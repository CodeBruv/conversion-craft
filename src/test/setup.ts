// The /vitest entry point registers the DOM matchers *and* declares them on
// Vitest's `expect`, so `toBeInTheDocument()` type-checks as well as running.
// The bare "@testing-library/jest-dom" import only declares them for Jest.
import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
