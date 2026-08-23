/**
 * Guards of the development-only content writer.
 *
 * These functions are the boundary between a browser request and the
 * filesystem, so they are tested directly rather than through HTTP: what
 * matters is that each one refuses the inputs it is there to refuse.
 *
 * The suite runs under the project's default jsdom environment, so Buffer is
 * imported explicitly rather than assumed to be a global.
 */
import { Buffer } from "node:buffer";
import type { IncomingMessage } from "node:http";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { __internals } from "./content-api";

const {
  RequestError,
  assertSameOrigin,
  assertSlug,
  detectImageType,
  isLoopback,
  resolveInside,
  validateImages,
  ASSETS_DIR,
  PROJECTS_DIR,
} = __internals;

const ROOT = process.platform === "win32" ? "C:\\repo" : "/repo";

/** Minimal stand-ins for the parts of a request each guard actually reads. */
const requestFrom = (remoteAddress: string): IncomingMessage =>
  ({ socket: { remoteAddress } }) as unknown as IncomingMessage;

const requestWith = (headers: Record<string, string | undefined>): IncomingMessage =>
  ({ headers }) as unknown as IncomingMessage;

const dataUrl = (mime: string, bytes: number[]): string =>
  `data:${mime};base64,${Buffer.from(bytes).toString("base64")}`;

const PNG_BYTES = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d];
const JPEG_BYTES = [0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01];
const WEBP_BYTES = [
  0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50, 0x56, 0x50, 0x38, 0x20,
];

describe("request origin guards", () => {
  it("only accepts connections from this machine", () => {
    for (const address of ["127.0.0.1", "::1", "::ffff:127.0.0.1"]) {
      expect(isLoopback(requestFrom(address))).toBe(true);
    }
    for (const address of ["192.168.1.20", "10.0.0.5", "203.0.113.7", ""]) {
      expect(isLoopback(requestFrom(address))).toBe(false);
    }
  });

  it("accepts a same-origin request and a request with no Origin header", () => {
    expect(() =>
      assertSameOrigin(requestWith({ origin: "http://localhost:8080", host: "localhost:8080" })),
    ).not.toThrow();
    expect(() => assertSameOrigin(requestWith({ host: "localhost:8080" }))).not.toThrow();
  });

  it("rejects a request sent from another site", () => {
    expect(() =>
      assertSameOrigin(requestWith({ origin: "https://evil.example", host: "localhost:8080" })),
    ).toThrow(RequestError);
    expect(() =>
      assertSameOrigin(requestWith({ origin: "not-a-url", host: "localhost:8080" })),
    ).toThrow(/Origin/);
  });
});

describe("slug guard", () => {
  it("accepts the slug shape the content schema accepts", () => {
    expect(assertSlug("elbi-homes")).toBe("elbi-homes");
    expect(assertSlug("a1-b2-c3")).toBe("a1-b2-c3");
  });

  it("rejects anything that could reach outside a filename", () => {
    for (const slug of [
      "../escape",
      "..",
      "/absolute",
      "with space",
      "Upper-Case",
      "trailing-",
      "double--hyphen",
      "with.dot",
      "with%2fencoded",
      "",
    ]) {
      expect(() => assertSlug(slug)).toThrow(RequestError);
    }
  });
});

describe("path confinement", () => {
  it("resolves a plain filename inside the target directory", () => {
    expect(resolveInside(ROOT, PROJECTS_DIR, "elbi-homes.md")).toBe(
      path.resolve(ROOT, PROJECTS_DIR, "elbi-homes.md"),
    );
    expect(resolveInside(ROOT, ASSETS_DIR, "elbi-homes.png")).toBe(
      path.resolve(ROOT, ASSETS_DIR, "elbi-homes.png"),
    );
  });

  it("refuses to escape the directory", () => {
    for (const name of [
      "../secret.md",
      "../../.env",
      "nested/deeper.md",
      "./../escape.md",
      "..",
      ".",
      "",
    ]) {
      expect(() => resolveInside(ROOT, PROJECTS_DIR, name)).toThrow(RequestError);
    }
  });

  it("refuses an absolute path even when it looks harmless", () => {
    const absolute = process.platform === "win32" ? "C:\\Windows\\notes.md" : "/etc/notes.md";
    expect(() => resolveInside(ROOT, PROJECTS_DIR, absolute)).toThrow(RequestError);
  });
});

describe("image type detection", () => {
  it("recognises the formats the portfolio accepts", () => {
    expect(detectImageType(Buffer.from(PNG_BYTES))).toBe("png");
    expect(detectImageType(Buffer.from(JPEG_BYTES))).toBe("jpeg");
    expect(detectImageType(Buffer.from(WEBP_BYTES))).toBe("webp");
  });

  it("returns null for anything else", () => {
    expect(detectImageType(Buffer.from("<?php echo 1; ?>", "utf8"))).toBeNull();
    expect(detectImageType(Buffer.from([0x00, 0x01, 0x02]))).toBeNull();
    expect(detectImageType(Buffer.alloc(0))).toBeNull();
  });
});

describe("image payload validation", () => {
  it("accepts a well-formed image", () => {
    const images = validateImages({
      images: [{ filename: "elbi-homes.png", dataUrl: dataUrl("image/png", PNG_BYTES) }],
    });

    expect(images).toHaveLength(1);
    expect(images[0].filename).toBe("elbi-homes.png");
    expect(images[0].replace).toBe(false);
  });

  it("treats a missing images field as no images", () => {
    expect(validateImages({})).toEqual([]);
    expect(validateImages({ images: null })).toEqual([]);
  });

  it("only replaces an existing file when asked to", () => {
    const [image] = validateImages({
      images: [
        { filename: "elbi-homes.png", dataUrl: dataUrl("image/png", PNG_BYTES), replace: true },
      ],
    });
    expect(image.replace).toBe(true);
  });

  it("rejects a filename that is a path", () => {
    expect(() =>
      validateImages({
        images: [{ filename: "../../evil.png", dataUrl: dataUrl("image/png", PNG_BYTES) }],
      }),
    ).toThrow(RequestError);
  });

  it("rejects a disallowed extension", () => {
    expect(() =>
      validateImages({
        images: [{ filename: "logo.svg", dataUrl: dataUrl("image/png", PNG_BYTES) }],
      }),
    ).toThrow(RequestError);
  });

  it("rejects a payload whose bytes do not match its extension", () => {
    // A script renamed to .png is exactly what this guard is for.
    expect(() =>
      validateImages({
        images: [
          {
            filename: "elbi-homes.png",
            dataUrl: `data:image/png;base64,${Buffer.from("<?php ?>").toString("base64")}`,
          },
        ],
      }),
    ).toThrow(/not a valid PNG image/);

    // Real JPEG bytes under a .png name are still a mismatch.
    expect(() =>
      validateImages({
        images: [{ filename: "elbi-homes.png", dataUrl: dataUrl("image/png", JPEG_BYTES) }],
      }),
    ).toThrow(RequestError);
  });

  it("rejects anything that is not a base64 image data URL", () => {
    for (const bad of ["https://example.com/image.png", "data:text/html;base64,PGh0bWw+", ""]) {
      expect(() =>
        validateImages({ images: [{ filename: "elbi-homes.png", dataUrl: bad }] }),
      ).toThrow(RequestError);
    }
  });

  it("rejects an empty image", () => {
    expect(() =>
      validateImages({ images: [{ filename: "elbi-homes.png", dataUrl: "data:image/png;base64," }] }),
    ).toThrow(RequestError);
  });

  it("rejects a malformed images field", () => {
    expect(() => validateImages({ images: "not-an-array" })).toThrow(RequestError);
    expect(() => validateImages({ images: [null] })).toThrow(RequestError);
    expect(() => validateImages({ images: [{ filename: "elbi-homes.png" }] })).toThrow(
      RequestError,
    );
  });

  it("caps how many images one save may write", () => {
    const many = Array.from({ length: 13 }, (_, index) => ({
      filename: `elbi-homes-${index}.png`,
      dataUrl: dataUrl("image/png", PNG_BYTES),
    }));
    expect(() => validateImages({ images: many })).toThrow(/limit 12/);
  });
});

describe("writer directories", () => {
  it("only ever targets the two known content directories", () => {
    expect(PROJECTS_DIR).toBe(path.join("src", "content", "projects"));
    expect(ASSETS_DIR).toBe(path.join("src", "assets", "projects"));
  });
});
