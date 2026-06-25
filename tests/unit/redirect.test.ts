import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "@/lib/utils";

describe("safeRedirectPath (open-redirect protection)", () => {
  it("allows normal root-relative paths", () => {
    expect(safeRedirectPath("/app")).toBe("/app");
    expect(safeRedirectPath("/app/leads/123")).toBe("/app/leads/123");
    expect(safeRedirectPath("/onboarding")).toBe("/onboarding");
  });

  it("falls back for absolute external URLs", () => {
    expect(safeRedirectPath("https://evil.com")).toBe("/app");
    expect(safeRedirectPath("http://evil.com/x")).toBe("/app");
  });

  it("blocks protocol-relative and backslash tricks", () => {
    expect(safeRedirectPath("//evil.com")).toBe("/app");
    expect(safeRedirectPath("/\\evil.com")).toBe("/app");
  });

  it("blocks control/whitespace smuggling", () => {
    expect(safeRedirectPath("/ /evil")).toBe("/app");
    expect(safeRedirectPath("/\tx")).toBe("/app");
    expect(safeRedirectPath("/\nx")).toBe("/app");
  });

  it("falls back for empty / non-path input", () => {
    expect(safeRedirectPath(null)).toBe("/app");
    expect(safeRedirectPath(undefined)).toBe("/app");
    expect(safeRedirectPath("")).toBe("/app");
    expect(safeRedirectPath("app/leads")).toBe("/app");
  });

  it("honors a custom fallback", () => {
    expect(safeRedirectPath("https://evil.com", "/onboarding")).toBe("/onboarding");
  });
});
