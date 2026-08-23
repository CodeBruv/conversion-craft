import { describe, expect, it } from "vitest";

import { parseProjectFile } from "@/content/parse";
import {
  FRONTMATTER_FIELD_ORDER,
  ProjectSerializeError,
  projectFileName,
  serializeProjectFile,
  type ProjectFileInput,
} from "@/content/serialize";
import { RAW_PROJECT_FILES } from "@/test/content-files";

/**
 * Builds serializer input.
 *
 * The cast is deliberate: several tests below pass values a well-typed caller
 * could never produce, because the dev writer receives this data as JSON from an
 * HTTP request. Runtime validation is the only real guard, so it gets tested.
 */
const input = (overrides: Record<string, unknown> = {}): ProjectFileInput =>
  ({
    slug: "example-project",
    title: "Example Project",
    category: "Landing Page",
    status: "published",
    summary: "A short summary.",
    coverImage: "example-project.png",
    ...overrides,
  }) as ProjectFileInput;

describe("serializeProjectFile", () => {
  it("writes a file the parser accepts", () => {
    const raw = serializeProjectFile(input({ body: "Some extra detail." }));
    const parsed = parseProjectFile(raw, "example-project.md");

    expect(parsed.title).toBe("Example Project");
    expect(parsed.body).toBe("Some extra detail.");
  });

  it("opens and closes the frontmatter block correctly", () => {
    const raw = serializeProjectFile(input());
    expect(raw.startsWith("---\n")).toBe(true);
    expect(raw).toContain("\n---\n");
    expect(raw.endsWith("\n")).toBe(true);
  });

  it("writes fields in a fixed order so Git diffs stay readable", () => {
    const raw = serializeProjectFile(
      input({ order: 1, date: "2026-08-23", liveUrl: "https://example.com/" }),
    );

    const writtenFields = raw
      .split("\n")
      .map((line) => /^([A-Za-z]+):/.exec(line)?.[1])
      .filter((field): field is string => Boolean(field));

    const expectedOrder = FRONTMATTER_FIELD_ORDER.filter((field) =>
      writtenFields.includes(field),
    );
    expect(writtenFields).toEqual([...expectedOrder]);
  });

  it("omits an empty gallery instead of writing an empty list", () => {
    expect(serializeProjectFile(input())).not.toContain("gallery");
    expect(serializeProjectFile(input({ gallery: ["one.png"] }))).toContain("gallery");
  });

  it("writes a body-less file without trailing blank lines", () => {
    expect(serializeProjectFile(input()).endsWith("---\n")).toBe(true);
  });

  it("refuses to write data the site could not load", () => {
    expect(() => serializeProjectFile(input({ slug: "Not A Slug" }))).toThrow(
      ProjectSerializeError,
    );
    expect(() => serializeProjectFile(input({ status: "live" }))).toThrow(
      ProjectSerializeError,
    );
    expect(() => serializeProjectFile(input({ liveUrl: "example.com" }))).toThrow(
      ProjectSerializeError,
    );
    expect(() => serializeProjectFile(input({ summary: "" }))).toThrow(
      ProjectSerializeError,
    );
    // A path in an image field is how a writer would be talked into escaping the
    // assets directory, so it must fail before any file is touched.
    expect(() =>
      serializeProjectFile(input({ coverImage: "../../../etc/passwd.png" })),
    ).toThrow(ProjectSerializeError);
  });

  it("reports which fields were wrong", () => {
    let fields: string[] = [];
    try {
      serializeProjectFile(input({ slug: "Not A Slug", summary: "" }));
    } catch (error) {
      fields = (error as ProjectSerializeError).issues.map((issue) => issue.field);
    }

    expect(fields).toContain("slug");
    expect(fields).toContain("summary");
  });

  it("escapes quotes and colons in copy rather than producing broken YAML", () => {
    const summary = 'A summary with "quotes", a: colon and a #hash.';
    const parsed = parseProjectFile(
      serializeProjectFile(input({ summary })),
      "example-project.md",
    );
    expect(parsed.summary).toBe(summary);
  });

  it("survives a multi-line body", () => {
    const body = "First paragraph.\n\nSecond paragraph.\n\n- a list item\n- another";
    const parsed = parseProjectFile(
      serializeProjectFile(input({ body })),
      "example-project.md",
    );
    expect(parsed.body).toBe(body);
  });
});

describe("projectFileName", () => {
  it("derives the filename from the slug", () => {
    expect(projectFileName("elbi-homes")).toBe("elbi-homes.md");
  });
});

describe("round-trip against the real content files", () => {
  const entries = Object.entries(RAW_PROJECT_FILES);

  it("finds the project content files", () => {
    expect(entries.length > 0).toBe(true);
  });

  // Byte-for-byte equality proves a file saved from /admin is indistinguishable
  // from one written by hand, so editing a project keeps the Git diff minimal.
  for (const [path, raw] of entries) {
    it(`reproduces ${path} exactly`, () => {
      const parsed = parseProjectFile(raw, path);
      const { id, body, coverImageUrl, galleryUrls, sourceFile, ...frontmatter } = parsed;
      void id;
      void coverImageUrl;
      void galleryUrls;
      void sourceFile;

      expect(serializeProjectFile({ ...frontmatter, body })).toBe(raw);
    });
  }
});
