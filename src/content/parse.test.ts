import { describe, expect, it } from "vitest";

import {
  ProjectContentError,
  buildProjectRegistry,
  compareProjects,
  parseProjectFile,
  selectAll,
  selectByStatus,
  selectBySlug,
  selectFeatured,
  selectPublished,
  splitFrontmatter,
} from "@/content/parse";
import type { Project } from "@/content/schema";

const file = (fields: Record<string, unknown>, body = ""): string => {
  const lines = Object.entries(fields).map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key}:\n${value.map((entry) => `  - "${entry}"`).join("\n")}`;
    }
    if (typeof value === "string") return `${key}: "${value}"`;
    return `${key}: ${value}`;
  });
  return `---\n${lines.join("\n")}\n---\n${body ? `\n${body}\n` : ""}`;
};

const validFields = (overrides: Record<string, unknown> = {}) => ({
  slug: "example-project",
  title: "Example Project",
  category: "Landing Page",
  status: "published",
  summary: "A short summary.",
  coverImage: "example-project.png",
  ...overrides,
});

/** Builds a Project object directly, for testing pure selectors and ordering. */
const project = (overrides: Partial<Project> = {}): Project => ({
  slug: "example-project",
  title: "Example Project",
  category: "Landing Page",
  status: "published",
  featured: false,
  summary: "A short summary.",
  coverImage: "example-project.png",
  gallery: [],
  id: "example-project",
  coverImageUrl: "/example-project.png",
  galleryUrls: [],
  ...overrides,
});

describe("splitFrontmatter", () => {
  it("separates frontmatter from the Markdown body", () => {
    const { frontmatter, body } = splitFrontmatter(
      '---\ntitle: "Example"\n---\n\nFirst paragraph.\n\nSecond paragraph.\n',
    );

    expect(frontmatter).toBe('title: "Example"');
    expect(body).toBe("First paragraph.\n\nSecond paragraph.");
  });

  it("handles a file with frontmatter and no body", () => {
    const { frontmatter, body } = splitFrontmatter('---\ntitle: "Example"\n---\n');
    expect(frontmatter).toBe('title: "Example"');
    expect(body).toBe("");
  });

  it("handles Windows line endings", () => {
    // Git on Windows can check files out with CRLF; content must still parse.
    const { frontmatter, body } = splitFrontmatter(
      '---\r\ntitle: "Example"\r\n---\r\n\r\nBody text.\r\n',
    );
    expect(frontmatter).toBe('title: "Example"');
    expect(body).toBe("Body text.");
  });

  it("handles a UTF-8 byte order mark", () => {
    // Some Windows editors prepend a BOM when saving.
    const bom = String.fromCharCode(0xfeff);
    const { frontmatter } = splitFrontmatter(`${bom}---\ntitle: "Example"\n---\n`);
    expect(frontmatter).toBe('title: "Example"');
  });

  it("explains itself when the frontmatter block is missing", () => {
    expect(() => splitFrontmatter("Just some Markdown.\n")).toThrow(/frontmatter/i);
    expect(() => splitFrontmatter('---\ntitle: "Unclosed"\n')).toThrow(/frontmatter/i);
  });
});

describe("parseProjectFile", () => {
  it("returns a fully-resolved project", () => {
    const parsed = parseProjectFile(
      file(validFields({ gallery: ["one.png", "two.png"] }), "Extra detail."),
      "example-project.md",
      (filename) => `/assets/${filename}`,
    );

    expect(parsed.slug).toBe("example-project");
    expect(parsed.id).toBe("example-project");
    expect(parsed.body).toBe("Extra detail.");
    expect(parsed.coverImageUrl).toBe("/assets/example-project.png");
    expect(parsed.galleryUrls).toEqual(["/assets/one.png", "/assets/two.png"]);
    expect(parsed.sourceFile).toBe("example-project.md");
  });

  it("leaves the body undefined when a file has none", () => {
    const parsed = parseProjectFile(file(validFields()), "example-project.md");
    expect(parsed.body).toBeUndefined();
  });

  it("names the file and the field when validation fails", () => {
    let message = "";
    try {
      parseProjectFile(file(validFields({ slug: "Not A Slug" })), "broken.md");
    } catch (error) {
      message = (error as Error).message;
      expect(error).toBeInstanceOf(ProjectContentError);
      expect((error as ProjectContentError).sourceFile).toBe("broken.md");
    }

    expect(message).toContain("broken.md");
    expect(message).toContain("slug");
  });

  it("reports broken YAML rather than crashing obscurely", () => {
    const raw = '---\ntitle: "unterminated\n  indent: bad\n---\n';
    expect(() => parseProjectFile(raw, "broken.md")).toThrow(/broken\.md/);
  });

  it("rejects frontmatter that is not a set of key/value fields", () => {
    expect(() => parseProjectFile('---\n- one\n- two\n---\n', "broken.md")).toThrow(
      /key\/value/,
    );
  });
});

describe("buildProjectRegistry", () => {
  it("validates a set of files and returns them in display order", () => {
    const projects = buildProjectRegistry({
      "b.md": file(validFields({ slug: "second", title: "Second", order: 2 })),
      "a.md": file(validFields({ slug: "first", title: "First", order: 1 })),
    });

    expect(projects.map((entry) => entry.slug)).toEqual(["first", "second"]);
  });

  it("rejects duplicate slugs and names both files", () => {
    let message = "";
    try {
      buildProjectRegistry({
        "one.md": file(validFields({ slug: "same" })),
        "two.md": file(validFields({ slug: "same" })),
      });
    } catch (error) {
      message = (error as Error).message;
    }

    expect(message).toContain("Duplicate slug");
    expect(message).toContain("one.md");
    expect(message).toContain("two.md");
  });

  it("reports every broken file at once instead of only the first", () => {
    let message = "";
    try {
      buildProjectRegistry({
        "bad-slug.md": file(validFields({ slug: "Bad Slug" })),
        "bad-status.md": file(validFields({ slug: "ok-slug", status: "live" })),
        "no-frontmatter.md": "Just Markdown.\n",
      });
    } catch (error) {
      message = (error as Error).message;
    }

    expect(message).toContain("3 problems");
    expect(message).toContain("bad-slug.md");
    expect(message).toContain("bad-status.md");
    expect(message).toContain("no-frontmatter.md");
  });

  it("accepts an empty content directory", () => {
    expect(buildProjectRegistry({})).toEqual([]);
  });
});

describe("compareProjects", () => {
  it("sorts by explicit order first", () => {
    const sorted = [
      project({ slug: "c", order: 3 }),
      project({ slug: "a", order: 1 }),
      project({ slug: "b", order: 2 }),
    ].sort(compareProjects);

    expect(sorted.map((entry) => entry.slug)).toEqual(["a", "b", "c"]);
  });

  it("places projects without an order last", () => {
    const sorted = [
      project({ slug: "unordered" }),
      project({ slug: "ordered", order: 5 }),
    ].sort(compareProjects);

    expect(sorted.map((entry) => entry.slug)).toEqual(["ordered", "unordered"]);
  });

  it("falls back to newest date, then title", () => {
    const byDate = [
      project({ slug: "older", date: "2025-01-01" }),
      project({ slug: "newer", date: "2026-01-01" }),
    ].sort(compareProjects);
    expect(byDate.map((entry) => entry.slug)).toEqual(["newer", "older"]);

    const byTitle = [
      project({ slug: "b", title: "Beta" }),
      project({ slug: "a", title: "Alpha" }),
    ].sort(compareProjects);
    expect(byTitle.map((entry) => entry.title)).toEqual(["Alpha", "Beta"]);
  });
});

describe("selectors", () => {
  const projects = [
    project({ slug: "live-one", status: "published", featured: true }),
    project({ slug: "live-two", status: "published" }),
    project({ slug: "work-in-progress", status: "draft", featured: true }),
    project({ slug: "retired", status: "archived" }),
  ];

  it("selectAll returns everything without mutating the source", () => {
    const all = selectAll(projects);
    expect(all).toHaveLength(4);
    all.pop();
    expect(projects).toHaveLength(4);
  });

  it("selectPublished excludes drafts and archived work", () => {
    expect(selectPublished(projects).map((entry) => entry.slug)).toEqual([
      "live-one",
      "live-two",
    ]);
  });

  it("selectFeatured never leaks a featured draft", () => {
    expect(selectFeatured(projects).map((entry) => entry.slug)).toEqual(["live-one"]);
  });

  it("selectByStatus filters by a single status", () => {
    expect(selectByStatus(projects, "draft").map((entry) => entry.slug)).toEqual([
      "work-in-progress",
    ]);
    expect(selectByStatus(projects, "archived")).toHaveLength(1);
  });

  it("selectBySlug hides drafts unless unpublished content is requested", () => {
    // This is what makes a draft URL 404 in production but preview locally.
    expect(selectBySlug(projects, "work-in-progress")).toBeUndefined();
    expect(
      selectBySlug(projects, "work-in-progress", { includeUnpublished: true })?.slug,
    ).toBe("work-in-progress");
  });

  it("selectBySlug finds published projects either way", () => {
    expect(selectBySlug(projects, "live-one")?.slug).toBe("live-one");
    expect(selectBySlug(projects, "live-one", { includeUnpublished: true })?.slug).toBe(
      "live-one",
    );
  });

  it("selectBySlug returns undefined for an unknown slug", () => {
    expect(selectBySlug(projects, "does-not-exist", { includeUnpublished: true })).toBeUndefined();
  });
});
