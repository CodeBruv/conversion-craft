/**
 * Turns project data back into a content file.
 *
 * Pure and free of Node/Vite APIs so the dev-server writer and the test suite
 * can both use it, and so a file written by the admin is byte-for-byte the same
 * shape as one written by hand. Round-tripping is covered by tests: parsing a
 * content file and serializing it again reproduces the original text.
 */
import yaml from "js-yaml";

import { projectFrontmatterSchema, type ProjectFrontmatter } from "./schema";

/**
 * Field order in written files. Fixed on purpose: a stable order keeps Git
 * diffs small and readable when a project is edited.
 */
export const FRONTMATTER_FIELD_ORDER = [
  "slug",
  "title",
  "category",
  "status",
  "featured",
  "order",
  "date",
  "summary",
  "context",
  "problem",
  "built",
  "result",
  "coverImage",
  "gallery",
  "liveUrl",
  "sourceUrl",
  "seoTitle",
  "seoDescription",
] as const satisfies readonly (keyof ProjectFrontmatter)[];

/** Everything needed to write a content file. */
export type ProjectFileInput = Partial<ProjectFrontmatter> & { body?: string };

export class ProjectSerializeError extends Error {
  constructor(
    message: string,
    readonly issues: Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.name = "ProjectSerializeError";
  }
}

/**
 * Validates input against the content schema and renders a Markdown file.
 *
 * Validation happens here rather than only in the UI so that nothing can write
 * a file the site would later refuse to load.
 */
export function serializeProjectFile(input: ProjectFileInput): string {
  const { body, ...frontmatterInput } = input;

  const parsed = projectFrontmatterSchema.safeParse(frontmatterInput);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => ({
      field: issue.path.length > 0 ? issue.path.join(".") : "(root)",
      message: issue.message,
    }));
    throw new ProjectSerializeError(
      `Cannot save project: ${issues.map((i) => `${i.field}: ${i.message}`).join("; ")}`,
      issues,
    );
  }

  const data = parsed.data;
  const ordered: Record<string, unknown> = {};

  for (const field of FRONTMATTER_FIELD_ORDER) {
    const value = data[field];
    if (value === undefined) continue;
    // An empty gallery is the default; omitting it keeps files tidy.
    if (field === "gallery" && Array.isArray(value) && value.length === 0) continue;
    ordered[field] = value;
  }

  const frontmatter = yaml.dump(ordered, {
    lineWidth: -1,
    quotingType: '"',
    forceQuotes: true,
    noRefs: true,
    sortKeys: false,
  });

  const trimmedBody = (body ?? "").trim();
  return `---\n${frontmatter}---\n${trimmedBody ? `\n${trimmedBody}\n` : ""}`;
}

/** The content filename for a slug. Never a path, never caller-controlled. */
export const projectFileName = (slug: string): string => `${slug}.md`;
