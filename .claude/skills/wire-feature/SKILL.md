---
name: wire-feature
description: The canonical recipe for adding or completing a feature in The Leads Nest end-to-end — UI route → server action / API route → DataStore method on BOTH stores → Zod validation → ownership + RLS → env feature-flag + graceful degrade → tests. Use whenever wiring a page or form to the backend, adding an API route, or "connecting X to the backend".
user-invocable: true
---

# Wire a feature end-to-end

Follow this for every feature so routing, data, security, and degradation stay
consistent. Skipping a layer is how cross-org leaks and demo-mode crashes happen.

## The layers (top to bottom)
1. **Route / page** — `src/app/.../page.tsx` (server component by default).
   Authenticated app pages live under `src/app/app/*` (protected by
   `src/middleware.ts`). Build UI with the `crest-design` skill.
2. **Form / interaction** — client component in `src/components/` using React
   Hook Form + a **Zod** schema. Submit to a **server action** (`src/lib/actions.ts`)
   or a **route handler** (`src/app/api/.../route.ts`).
3. **Validation** — parse every input with Zod at the server boundary. Never
   trust client-supplied `org_id` / `project_id`.
4. **Authorization** — resolve the caller's org via the session
   (`getOrganizationForUser`), then pass a server-verified `orgId` into the
   store. Ownership check first; RLS is the second line of defense.
5. **Data** — add the operation to the `DataStore` interface
   (`src/lib/db/store.ts`) and implement it in **both** `MemoryStore` and
   `SupabaseStore`, kept at parity. Use `getStore()` for request-scoped
   (RLS-bound) access, `getAdminStore()` only for trusted background jobs.
6. **Env / degradation** — if the feature depends on an integration, add a
   feature-detector in `src/lib/env.ts` (e.g. `isXConfigured()`) and a graceful
   "not configured" path. The whole app must still run in demo mode with zero
   secrets.
7. **Tests** — unit-test the store method (incl. parity), the Zod schema, and
   the auth/ownership path; extend the E2E happy path if it's a core flow.

## Routing map (where new things go)
- Public/marketing: `src/app/page.tsx`, `pricing/`, `demo/`.
- Auth: `login/`, `signup/`, `onboarding/`, `auth/callback`, `auth/signout`.
- App (authed): `src/app/app/{page,projects,projects/[id],projects/[id]/sources,leads,leads/[id],digest,billing,settings,admin}`.
- API: `src/app/api/{demo/score,stripe/checkout,stripe/webhook,cron/digest,health}` —
  add new handlers here. Protect mutating routes with auth; protect jobs with a
  shared secret (see `CRON_SECRET`).

## Definition of done
Server-validated + org-scoped + parity across both stores + graceful demo-mode
fallback + tests, then the `release-gate` skill is green. For source/reply/
notification features, also pass `platform-safety-audit`.
