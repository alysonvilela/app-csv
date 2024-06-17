import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src", "!src/__tests__/**", "!src/**/*.test.*", "!src/**/*.spec.*"],
  // clean: true,
});
