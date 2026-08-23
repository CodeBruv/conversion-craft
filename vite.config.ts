import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { contentApiPlugin } from "./vite/content-api";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  // contentApiPlugin is `apply: "serve"`, so it exists only while `npm run dev`
  // is running and contributes nothing to a production build.
  plugins: [react(), contentApiPlugin()].filter(Boolean),
  resolve: {
    alias: {
      // Order matters: aliases are matched in order and "@" also matches
      // "@/admin/AdminApp", so the specific entry has to come first.
      //
      // Any build - `npm run build` and also `npm run build:dev` - swaps the real
      // editor for a stub that renders the 404 page, so the editor UI and its
      // write calls are not merely unreachable in built output, they are never
      // bundled. Keying this on `command` rather than `mode` means a development
      // -mode build cannot ship the editor either.
      ...(command === "build"
        ? { "@/admin/AdminApp": path.resolve(__dirname, "./src/admin/AdminApp.stub.tsx") }
        : {}),
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
