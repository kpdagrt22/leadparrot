import { describe, it, expect, vi, afterEach } from "vitest";
import {
  notify,
  recipientFor,
  alertChannels,
  inQuietHours,
  testPayload,
  emailAdapter,
  smsAdapter,
  whatsappAdapter,
} from "@/lib/notify";
import type { Organization } from "@/lib/types";
import type { DataStore, RecordNotificationInput } from "@/lib/db/store";

function makeOrg(o: Partial<Organization> = {}): Organization {
  return {
    id: "org-1",
    owner_id: "user-1",
    name: "Acme",
    website: null,
    business_type: null,
    description: null,
    target_geography: null,
    reply_tone: "helpful",
    notification_email: "owner@acme.com",
    daily_digest_enabled: true,
    notify_email_enabled: false,
    notify_sms_enabled: false,
    notify_whatsapp_enabled: false,
    notify_phone: null,
    notify_email_verified: false,
    notify_phone_verified: false,
    high_intent_threshold: 70,
    quiet_hours_start: null,
    quiet_hours_end: null,
    digest_hour: 13,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...o,
  };
}

function fakeStore(org: Organization | null, lastAt: string | null = null) {
  const recorded: RecordNotificationInput[] = [];
  const store = {
    getOrganizationById: async () => org,
    getLastNotificationAt: async () => lastAt,
    recordNotification: async (_orgId: string, input: RecordNotificationInput) => {
      recorded.push(input);
    },
  } as unknown as DataStore;
  return { store, recorded };
}

describe("notify pure helpers", () => {
  it("recipientFor only ever returns the OWNER's own contact (never a lead)", () => {
    const org = makeOrg({ notification_email: "owner@acme.com", notify_phone: "+15550100" });
    expect(recipientFor("email", org)).toBe("owner@acme.com");
    expect(recipientFor("sms", org)).toBe("+15550100");
    expect(recipientFor("whatsapp", org)).toBe("+15550100");
  });

  it("alertChannels requires both enabled AND verified", () => {
    expect(alertChannels(makeOrg({ notify_email_enabled: true, notify_email_verified: false }))).toEqual([]);
    expect(alertChannels(makeOrg({ notify_email_enabled: true, notify_email_verified: true }))).toEqual(["email"]);
    const all = makeOrg({
      notify_email_enabled: true,
      notify_email_verified: true,
      notify_sms_enabled: true,
      notify_whatsapp_enabled: true,
      notify_phone_verified: true,
    });
    expect(alertChannels(all)).toEqual(["email", "sms", "whatsapp"]);
  });

  it("inQuietHours handles normal, midnight-wrap, and unset windows", () => {
    expect(inQuietHours(makeOrg({ quiet_hours_start: 22, quiet_hours_end: 6 }), 23)).toBe(true);
    expect(inQuietHours(makeOrg({ quiet_hours_start: 22, quiet_hours_end: 6 }), 12)).toBe(false);
    expect(inQuietHours(makeOrg({ quiet_hours_start: 9, quiet_hours_end: 17 }), 12)).toBe(true);
    expect(inQuietHours(makeOrg({ quiet_hours_start: 9, quiet_hours_end: 17 }), 20)).toBe(false);
    expect(inQuietHours(makeOrg({ quiet_hours_start: null, quiet_hours_end: null }), 3)).toBe(false);
  });
});

describe("adapters degrade safely when unconfigured", () => {
  it("email previews; sms/whatsapp report not-configured — none throw", async () => {
    expect(emailAdapter.isConfigured()).toBe(false);
    await expect(emailAdapter.send("owner@acme.com", testPayload("Acme"))).resolves.toMatchObject({ ok: true, preview: true });
    expect(smsAdapter.isConfigured()).toBe(false);
    await expect(smsAdapter.send("+15550100", testPayload("Acme"))).resolves.toMatchObject({ ok: false });
    expect(whatsappAdapter.isConfigured()).toBe(false);
    await expect(whatsappAdapter.send("+15550100", testPayload("Acme"))).resolves.toMatchObject({ ok: false });
  });
});

describe("notify dispatcher", () => {
  afterEach(() => vi.useRealTimers());

  it("routes only to enabled+verified channels and records the OWNER as the only target", async () => {
    const org = makeOrg({ notify_email_enabled: true, notify_email_verified: true, notification_email: "owner@acme.com", notify_phone: "+15550100" });
    const { store, recorded } = fakeStore(org);
    const results = await notify(store, org.id, "new_high_intent_lead", testPayload("Acme"));
    expect(results).toHaveLength(1);
    expect(results[0].channel).toBe("email");
    // Owner-only invariant: every recorded recipient is one of the org's own contacts.
    for (const r of recorded) {
      expect([org.notification_email, org.notify_phone]).toContain(r.target);
    }
  });

  it("dedupes within the window without contacting any channel", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-28T12:00:00.000Z"));
    const org = makeOrg({ notify_email_enabled: true, notify_email_verified: true });
    const { store, recorded } = fakeStore(org, "2026-06-28T11:30:00.000Z");
    const results = await notify(store, org.id, "new_high_intent_lead", testPayload("Acme"), { dedupeWindowMinutes: 55 });
    expect(results[0].status).toBe("skipped");
    expect(results[0].detail).toMatch(/dedup/i);
    expect(recorded).toHaveLength(0);
  });

  it("skips during quiet hours when respectQuietHours is set", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-28T23:00:00.000Z"));
    const org = makeOrg({ notify_email_enabled: true, notify_email_verified: true, quiet_hours_start: 22, quiet_hours_end: 6 });
    const { store } = fakeStore(org);
    const results = await notify(store, org.id, "new_high_intent_lead", testPayload("Acme"), { respectQuietHours: true });
    expect(results[0].status).toBe("skipped");
    expect(results[0].detail).toMatch(/quiet/i);
  });

  it("returns nothing for an unknown org", async () => {
    const { store } = fakeStore(null);
    expect(await notify(store, "missing", "test", testPayload("X"))).toEqual([]);
  });
});
