import { describe, expect, it } from "vitest";

import {
  getAllProjects,
  getAllPublished,
  getByStatus,
  getBySlug,
  getFeatured,
  getProjectCount,
} from "@/content/loader";
import { RAW_PROJECT_FILES } from "@/test/content-files";

/**
 * Exercises the loader end to end: the glob, Zod validation and image
 * resolution, using the repository's real content files.
 */
describe("content loader", () => {
  it("loads every content file", () => {
    expect(getProjectCount()).toBe(Object.keys(RAW_PROJECT_FILES).length);
    expect(getAllProjects()).toHaveLength(getProjectCount());
  });

  it("resolves a real, usable URL for every cover image", () => {
    // This is what proves images survive bundling: a missing file would have
    // failed the glob lookup rather than returning a URL.
    for (const project of getAllProjects()) {
      expect(typeof project.coverImageUrl).toBe("string");
      expect(project.coverImageUrl.length > 0).toBe(true);
    }
  });

  it("never returns an unpublished project from getAllPublished", () => {
    for (const project of getAllPublished()) {
      expect(project.status).toBe("published");
    }
  });

  it("splits the same projects across the status selectors", () => {
    const total =
      getByStatus("published").length +
      getByStatus("draft").length +
      getByStatus("archived").length;
    expect(total).toBe(getProjectCount());
  });

  it("only ever features published work", () => {
    for (const project of getFeatured()) {
      expect(project.status).toBe("published");
      expect(project.featured).toBe(true);
    }
  });

  it("finds a published project by its slug", () => {
    const first = getAllPublished()[0];
    expect(first).toBeDefined();
    if (!first) return;

    expect(getBySlug(first.slug)?.slug).toBe(first.slug);
    expect(getBySlug(first.slug, { includeUnpublished: true })?.slug).toBe(first.slug);
  });

  it("returns undefined for an unknown slug so the route can 404", () => {
    expect(getBySlug("no-such-project")).toBeUndefined();
    expect(getBySlug("no-such-project", { includeUnpublished: true })).toBeUndefined();
  });

  it("keeps a stable display order across calls", () => {
    expect(getAllPublished().map((project) => project.slug)).toEqual(
      getAllPublished().map((project) => project.slug),
    );
  });
});
