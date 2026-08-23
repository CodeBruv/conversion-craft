import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { TextDecoder, TextEncoder } from "node:util";

import AdminAppStub from "@/admin/AdminApp.stub";

// Restore Node’s native TextEncoder/TextDecoder that jsdom overwrote.
// Must run before any test that dynamically imports vite.config (esbuild).
beforeAll(() => {
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
});

/** Shape of the parts of the Vite config these tests care about. */
type ConfigFactory = (env: { command: "build" | "serve"; mode: string }) => {
  resolve?: { alias?: Record<string, string> };
  plugins?: unknown[];
};

describe("the editor's production stand-in", () => {
  it("renders the 404 page instead of the editor", () => {
    // NotFound logs the unmatched path on purpose.
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AdminAppStub />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "404" })).toBeInTheDocument();
    expect(screen.queryByText(/local editor/i)).not.toBeInTheDocument();
  });
});

describe("the production build guard", () => {
  it("swaps the editor for the stub in a production build", async () => {
    const module = await import("../../vite.config");
    const factory = module.default as unknown as ConfigFactory;

    const production = factory({ command: "build", mode: "production" });
    const alias = production.resolve?.alias ?? {};

    // With this alias in place the editor is not merely unreachable in
    // production, its code never enters the bundle.
    expect(Object.keys(alias)).toContain("@/admin/AdminApp");
    expect(String(alias["@/admin/AdminApp"])).toContain("AdminApp.stub");
  });

  it("leaves the real editor in place during development", async () => {
    const module = await import("../../vite.config");
    const factory = module.default as unknown as ConfigFactory;

    const development = factory({ command: "serve", mode: "development" });

    expect(Object.keys(development.resolve?.alias ?? {})).not.toContain("@/admin/AdminApp");
  });

  it("swaps the editor for the stub in a development-mode build as well", async () => {
    const module = await import("../../vite.config");
    const factory = module.default as unknown as ConfigFactory;

    // `npm run build:dev` produces deployable output too, so the guard keys on
    // the command rather than the mode.
    const alias = factory({ command: "build", mode: "development" }).resolve?.alias ?? {};

    expect(String(alias["@/admin/AdminApp"])).toContain("AdminApp.stub");
  });

  it("keeps the specific alias ahead of the general one", async () => {
    const module = await import("../../vite.config");
    const factory = module.default as unknown as ConfigFactory;

    const keys = Object.keys(
      factory({ command: "build", mode: "production" }).resolve?.alias ?? {},
    );

    // "@" is a prefix of "@/admin/AdminApp", so if the general alias came first
    // the stub would never be used.
    expect(keys.indexOf("@/admin/AdminApp")).toBeLessThan(keys.indexOf("@"));
  });
});