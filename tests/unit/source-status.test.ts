import { describe, it, expect } from "vitest";
import { canTransition, isTerminal, transition } from "@/lib/sources/status";

describe("source run status transitions", () => {
  it("allows the happy path pending → running → success", () => {
    expect(canTransition("pending", "running")).toBe(true);
    expect(canTransition("running", "success")).toBe(true);
  });

  it("allows failing from pending or running", () => {
    expect(canTransition("pending", "error")).toBe(true);
    expect(canTransition("running", "error")).toBe(true);
  });

  it("forbids skipping running", () => {
    expect(canTransition("pending", "success")).toBe(false);
  });

  it("forbids transitions out of terminal states", () => {
    expect(canTransition("success", "running")).toBe(false);
    expect(canTransition("error", "running")).toBe(false);
    expect(isTerminal("success")).toBe(true);
    expect(isTerminal("error")).toBe(true);
    expect(isTerminal("pending")).toBe(false);
  });

  it("transition() returns the target on a legal move", () => {
    expect(transition("running", "success")).toBe("success");
  });

  it("transition() throws on an illegal move", () => {
    expect(() => transition("success", "running")).toThrow(/Illegal/);
  });
});
