import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text-summary", "text"],
      // Gate coverage on the deterministic business-logic modules the unit
      // suite is designed to protect. Network/DB/UI layers are exercised by the
      // Playwright e2e flow instead, so they are intentionally out of scope here.
      include: [
        "src/lib/scoring/**",
        "src/lib/usage/**",
        "src/lib/plans.ts",
        "src/lib/sources/status.ts",
        "src/lib/ai/schemas/**",
        "src/lib/ai/safety.ts",
        "src/lib/ratelimit.ts",
        "src/lib/auth/organizations.ts",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 75,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
