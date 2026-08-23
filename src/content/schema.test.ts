import { describe, expect, it } from "vitest";

import {
  ALLOWED_IMAGE_EXTENSIONS,
  PROJECT_STATUSES,
  deriveId,
  deriveYear,
  projectFrontmatterSchema,
  projectPath,
  resolveSeoDescription,
  resolveSeoTitle,
  slugify,
} from "@/content/schema";

/** A minimal project that must always validate. */
const validFrontmatter = () => ({
  slug: "example-project",
  title: "Example Project",
  category: "Landing Page",
  status: "published" as const,
  summary: "A short summary of the project.",
  coverImage: "example-project.png",
});

/** First error message for a given field, or undefined if that field passed. */
const errorFor = (input: unknown, field: string): string | undefined => {
  const result = projectFrontmatterSchema.safeParse(input);
  if (result.success) return undefined;
  return result.error.issues.find((issue) => issue.path.join(".") === field)?.message;
};

describe("projectFrontmatterSchema", () => {
  it("accepts a minimal valid project and applies defaults", () => {
    const result = projectFrontmatterSchema.safeParse(validFrontmatter());

    expect(result.success).toBe(true);
    if (!result.success) return;

    // Defaults exist so content files only have to state what differs.
    expect(result.data.featured).toBe(false);
    expect(result.data.gallery).toEqual([]);
    expect(result.data.order).toBeUndefined();
    expect(result.data.date).toBeUndefined();
  });

  it("accepts every documented status", () => {
    for (const status of PROJECT_STATUSES) {
      const result = projectFrontmatterSchema.safeParse({
        ...validFrontmatter(),
        status,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects a status outside the documented set", () => {
    expect(errorFor({ ...validFrontmatter(), status: "live" }, "status")).toBeDefined();
  });

  it("rejects slugs that would not be safe in a URL", () => {
    const badSlugs = [
      "Example Project", // spaces + capitals
      "example_project", // underscore
      "-leading-hyphen",
      "trailing-hyphen-",
      "double--hyphen",
      "../escape",
      "café", // non-ASCII
    ];

    for (const slug of badSlugs) {
      expect(errorFor({ ...validFrontmatter(), slug }, "slug")).toBeDefined();
    }

    expect(errorFor({ ...validFrontmatter(), slug: "a1-b2-c3" }, "slug")).toBeUndefined();
  });

  it("names the offending field in its error messages", () => {
    expect(errorFor({ ...validFrontmatter(), slug: "Bad Slug" }, "slug")).toContain("slug");
    expect(errorFor({ ...validFrontmatter(), title: "   " }, "title")).toContain("title");
  });

  it("requires the fields a project cannot render without", () => {
    for (const field of ["slug", "title", "category", "status", "summary", "coverImage"]) {
      const input: Record<string, unknown> = validFrontmatter();
      delete input[field];
      expect(errorFor(input, field)).toBeDefined();
    }
  });

  it("treats blank optional text as absent rather than as an empty string", () => {
    const result = projectFrontmatterSchema.safeParse({
      ...validFrontmatter(),
      context: "   ",
      problem: "",
      seoTitle: "",
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    // An empty string would render a heading with nothing under it.
    expect(result.data.context).toBeUndefined();
    expect(result.data.problem).toBeUndefined();
    expect(result.data.seoTitle).toBeUndefined();
  });

  it("rejects links that are not absolute URLs", () => {
    expect(errorFor({ ...validFrontmatter(), liveUrl: "example.com" }, "liveUrl")).toBeDefined();
    expect(errorFor({ ...validFrontmatter(), sourceUrl: "not a url" }, "sourceUrl")).toBeDefined();

    const ok = projectFrontmatterSchema.safeParse({
      ...validFrontmatter(),
      liveUrl: "https://example.com/",
      sourceUrl: "https://github.com/owner/repo",
    });
    expect(ok.success).toBe(true);
  });

  it("rejects unknown keys instead of silently ignoring a typo", () => {
    // "sumary" would otherwise leave the real summary empty with no warning.
    const result = projectFrontmatterSchema.safeParse({
      ...validFrontmatter(),
      sumary: "typo",
    });
    expect(result.success).toBe(false);
  });

  it("only accepts image filenames, never paths", () => {
    expect(errorFor({ ...validFrontmatter(), coverImage: "a.gif" }, "coverImage")).toBeDefined();
    expect(errorFor({ ...validFrontmatter(), coverImage: "no-extension" }, "coverImage")).toBeDefined();
    expect(
      errorFor({ ...validFrontmatter(), coverImage: "../../secret.png" }, "coverImage"),
    ).toBeDefined();
    expect(
      errorFor({ ...validFrontmatter(), coverImage: "/etc/passwd.png" }, "coverImage"),
    ).toBeDefined();

    for (const extension of ALLOWED_IMAGE_EXTENSIONS) {
      expect(
        errorFor({ ...validFrontmatter(), coverImage: `cover.${extension}` }, "coverImage"),
      ).toBeUndefined();
    }
  });

  it("rejects gallery entries that are not image filenames", () => {
    const result = projectFrontmatterSchema.safeParse({
      ...validFrontmatter(),
      gallery: ["fine.png", "../escape.png"],
    });
    expect(result.success).toBe(false);
  });

  it("requires dates in YYYY-MM-DD form", () => {
    expect(errorFor({ ...validFrontmatter(), date: "2026" }, "date")).toBeDefined();
    expect(errorFor({ ...validFrontmatter(), date: "08/23/2026" }, "date")).toBeDefined();
    expect(errorFor({ ...validFrontmatter(), date: "2026-08-23" }, "date")).toBeUndefined();
  });

  it("rejects a negative or fractional order", () => {
    expect(errorFor({ ...validFrontmatter(), order: -1 }, "order")).toBeDefined();
    expect(errorFor({ ...validFrontmatter(), order: 1.5 }, "order")).toBeDefined();
    expect(errorFor({ ...validFrontmatter(), order: 0 }, "order")).toBeUndefined();
  });
});

describe("derived values", () => {
  it("derives the id from the slug so it is never stored twice", () => {
    expect(deriveId("elbi-homes")).toBe("elbi-homes");
  });

  it("derives the year from the date", () => {
    expect(deriveYear("2026-08-23")).toBe(2026);
    expect(deriveYear(undefined)).toBeUndefined();
  });

  it("builds project paths from one place", () => {
    expect(projectPath("elbi-homes")).toBe("/projects/elbi-homes");
  });
});

describe("SEO fallbacks", () => {
  it("falls back to the title and summary when SEO fields are absent", () => {
    const project = { title: "Elbi Homes", summary: "A summary." };
    expect(resolveSeoTitle(project)).toBe("Elbi Homes");
    expect(resolveSeoDescription(project)).toBe("A summary.");
  });

  it("prefers the SEO fields when they are present", () => {
    const project = {
      title: "Elbi Homes",
      summary: "A summary.",
      seoTitle: "Elbi Homes - Real Estate Landing Page",
      seoDescription: "A longer description written for search results.",
    };
    expect(resolveSeoTitle(project)).toBe("Elbi Homes - Real Estate Landing Page");
    expect(resolveSeoDescription(project)).toBe(
      "A longer description written for search results.",
    );
  });
});

describe("slugify", () => {
  it("turns a title into a URL-safe slug the schema accepts", () => {
    const cases: Array<[string, string]> = [
      ["Elbi Homes", "elbi-homes"],
      ["SprintFlow", "sprintflow"],
      ["Reed's Focus System", "reeds-focus-system"],
      ["  Trimmed   Spacing  ", "trimmed-spacing"],
      ["Café Münster", "cafe-munster"],
      ["Already-Hyphenated", "already-hyphenated"],
      ["Symbols !@#$ Removed", "symbols-removed"],
      ["v2.0 Redesign", "v2-0-redesign"],
    ];

    for (const [input, expected] of cases) {
      expect(slugify(input)).toBe(expected);
    }
  });

  it("produces slugs that pass schema validation", () => {
    const slug = slugify("A Client's Brand-New Site!");
    expect(
      projectFrontmatterSchema.safeParse({ ...validFrontmatter(), slug }).success,
    ).toBe(true);
  });
});
