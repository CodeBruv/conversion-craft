import { describe, expect, it } from "vitest";

import { buildProjectRegistry, selectPublished } from "@/content/parse";
import { SLUG_PATTERN } from "@/content/schema";
import { RAW_PROJECT_FILES } from "@/test/content-files";
import { LEGACY_PROJECTS } from "@/test/legacy-projects.fixture";

/**
 * The real content directory, validated the same way the app validates it.
 *
 * The image resolver is the identity function so these tests stay pure: they
 * check the content, not Vite's asset URL hashing.
 */
const projects = buildProjectRegistry(RAW_PROJECT_FILES, (filename) => filename);

describe("the real project content", () => {
  it("validates every file in src/content/projects", () => {
    // buildProjectRegistry throws on any invalid file, so reaching here is the
    // assertion. The count guards against a file silently disappearing.
    expect(projects.length).toBe(Object.keys(RAW_PROJECT_FILES).length);
  });

  it("gives every project a unique, URL-safe slug", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(SLUG_PATTERN.test(slug)).toBe(true);
    }
  });

  it("names each file after its slug", () => {
    // The dev writer derives the filename from the slug; if these ever diverge,
    // editing a project would create a second file instead of updating one.
    for (const project of projects) {
      expect(project.sourceFile?.endsWith(`/${project.slug}.md`)).toBe(true);
    }
  });

  it("gives every project a cover image", () => {
    for (const project of projects) {
      expect(project.coverImage.length > 0).toBe(true);
    }
  });
});

describe("migration parity with the pre-migration hardcoded projects", () => {
  const published = selectPublished(projects);

  it("still shows the same projects, in the same order", () => {
    expect(published.map((project) => project.slug)).toEqual(
      LEGACY_PROJECTS.map((legacy) => legacy.slug),
    );
  });

  // Every visible string is compared, so a typo introduced during the migration
  // (or later, by the editor) fails the suite instead of shipping quietly.
  for (const [index, legacy] of LEGACY_PROJECTS.entries()) {
    it(`preserves every field of "${legacy.name}"`, () => {
      const project = published[index];
      expect(project).toBeDefined();
      if (!project) return;

      expect(project.title).toBe(legacy.name);
      expect(project.category).toBe(legacy.type);
      expect(project.summary).toBe(legacy.hook);
      expect(project.context).toBe(legacy.context);
      expect(project.problem).toBe(legacy.problem);
      expect(project.built).toBe(legacy.built);
      expect(project.result).toBe(legacy.result);
      expect(project.liveUrl).toBe(legacy.liveUrl);
      expect(project.coverImage).toBe(legacy.image);
    });
  }
});
