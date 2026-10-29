import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    server: {
      deps: {
        // Its ESM build has extensionless relative imports, which Node cannot
        // load on its own; Vite resolves them, as it does in the site build.
        inline: ["@material/material-color-utilities"],
      },
    },
  },
});
