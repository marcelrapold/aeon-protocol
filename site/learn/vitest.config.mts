import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * The `@/…` alias, so tests can import the modules the application imports
 * rather than a relative-path copy of the graph. Next resolves it from
 * tsconfig's `paths`; Vitest needs telling.
 *
 * No environment is declared: everything under test is either pure or
 * server-rendered, and Node is both faster and closer to how these modules
 * actually run at build time.
 */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
});
