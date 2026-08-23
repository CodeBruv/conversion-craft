import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    // src/** is the application. vite/** is the dev-only content writer, whose
    // guards sit between the browser and the filesystem and are worth testing
    // directly.
    include: ["src/**/*.{test,spec}.{ts,tsx}", "vite/**/*.{test,spec}.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
