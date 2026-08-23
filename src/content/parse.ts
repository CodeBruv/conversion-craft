/**
 * Pure content parsing + selection logic.
 *
 * Deliberately free of Vite, React and Node APIs so it can be unit-tested
 * directly and reused by any loader (Markdown today, something else later).
 *
 * Uses js-yaml for the frontmatter block: hand-rolling YAML is a bug factory,
 * and js-yaml is already present in the dependency tree.
 */
import yaml from "js-yaml";
import { ZodError } from "zod";

import {
  deriveId,
  projectFrontmatterSchema,
  type Project,
  type ProjectStatus,
} from "./schema";

/** Raised when a content file cannot be parsed or fails validation. */
export class ProjectContentError extends Error {
  constructor(
    message: string,
    readonly sourceFile: string,
  ) {
    super(message);
    this.name = "ProjectContentError";
  }
}

const FRONTMATTER_PATTERN =
  /^\uFEFF?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n([\s\S]*))?$/;

/** Splits a Markdown file into its raw YAML frontmatter and Markdown body. */
export function splitFrontmatter(raw: string): { frontmatter: string; body: string } {
  const match = FRONTMATTER_PATTERN.exec(raw.trim());
  if (!match) {
    throw new Error(
      "missing YAML frontmatter. A project file must start with '---', " +
        "contain the project fields, then a closing '---'.",
    );
  }
  return { frontmatter: match[1] ?? "", body: (match[2] ?? "").trim() };
}

/** Formats Zod issues into a developer-facing, field-by-field message. */
function formatZodError(error: ZodError): string {
  return error.issues
    .map((issue) => {
      const field = issue.path.length > 0 ? issue.path.join(".") : "(root)";
      return `  - ${field}: ${issue.message}`;
    })
    .join("\n");
}

/** Resolves an image filename to a URL the browser can use. */
export type ImageResolver = (filename: string, sourceFile: string) => string;

/** Default resolver: passes the filename through unchanged (used in tests). */
const identityImageResolver: ImageResolver = (filename) => filename;

/**
 * Parses and validates a single project content file.
 *
 * Throws ProjectContentError naming the exact file and field on any problem.
 */
export function parseProjectFile(
  raw: string,
  sourceFile: string,
  resolveImage: ImageResolver = identityImageResolver,
): Project {
  let frontmatter: string;
  let body: string;
  try {
    ({ frontmatter, body } = splitFrontmatter(raw));
  } catch (error) {
    throw new ProjectContentError(
      `Invalid project content in ${sourceFile}: ${(error as Error).message}`,
      sourceFile,
    );
  }

  let data: unknown;
  try {
    data = yaml.load(frontmatter);
  } catch (error) {
    throw new ProjectContentError(
      `Invalid YAML frontmatter in ${sourceFile}: ${(error as Error).message}`,
      sourceFile,
    );
  }

  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    throw new ProjectContentError(
      `Invalid project content in ${sourceFile}: frontmatter must be a set of key/value fields.`,
      sourceFile,
    );
  }

  const parsed = projectFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new ProjectContentError(
      `Invalid project content in ${sourceFile}:\n${formatZodError(parsed.error)}`,
      sourceFile,
    );
  }

  const frontmatterData = parsed.data;

  return {
    ...frontmatterData,
    id: deriveId(frontmatterData.slug),
    body: body.length > 0 ? body : undefined,
    coverImageUrl: resolveImage(frontmatterData.coverImage, sourceFile),
    galleryUrls: frontmatterData.gallery.map((file) => resolveImage(file, sourceFile)),
    sourceFile,
  };
}

/**
 * Deterministic display order:
 *   1. explicit `order` ascending (files without `order` come last)
 *   2. newest `date` first
 *   3. title A-Z
 *
 * Keeping this in one place means the homepage, the admin list and any future
 * view all agree on ordering.
 */
export function compareProjects(a: Project, b: Project): number {
  const orderA = a.order ?? Number.POSITIVE_INFINITY;
  const orderB = b.order ?? Number.POSITIVE_INFINITY;
  if (orderA !== orderB) return orderA - orderB;

  const dateA = a.date ?? "";
  const dateB = b.date ?? "";
  if (dateA !== dateB) return dateB.localeCompare(dateA);

  return a.title.localeCompare(b.title);
}

/**
 * Validates a whole set of content files and returns them in display order.
 *
 * `files` maps a source path to that file's raw text. Duplicate slugs are a
 * hard error: two files claiming one URL is always a mistake.
 */
export function buildProjectRegistry(
  files: Record<string, string>,
  resolveImage: ImageResolver = identityImageResolver,
): Project[] {
  const projects: Project[] = [];
  const errors: string[] = [];
  const seenSlugs = new Map<string, string>();

  for (const sourceFile of Object.keys(files).sort()) {
    let project: Project;
    try {
      project = parseProjectFile(files[sourceFile], sourceFile, resolveImage);
    } catch (error) {
      errors.push((error as Error).message);
      continue;
    }

    const previous = seenSlugs.get(project.slug);
    if (previous) {
      errors.push(
        `Duplicate slug "${project.slug}" in ${sourceFile} - already used by ${previous}. ` +
          `Each project needs a unique slug because it becomes the project URL.`,
      );
      continue;
    }

    seenSlugs.set(project.slug, sourceFile);
    projects.push(project);
  }

  if (errors.length > 0) {
    throw new Error(
      `Portfolio content is invalid (${errors.length} problem${errors.length === 1 ? "" : "s"}):\n\n` +
        `${errors.join("\n\n")}\n`,
    );
  }

  return projects.sort(compareProjects);
}

// --- selectors ------------------------------------------------------------
// Pure functions over an already-validated project list.

/** Everything, including drafts and archived work. Admin/dev use only. */
export const selectAll = (projects: Project[]): Project[] => [...projects];

/** Only what the public site may show. */
export const selectPublished = (projects: Project[]): Project[] =>
  projects.filter((project) => project.status === "published");

/** Published + flagged as featured. */
export const selectFeatured = (projects: Project[]): Project[] =>
  selectPublished(projects).filter((project) => project.featured);

/** Projects with a given status. */
export const selectByStatus = (projects: Project[], status: ProjectStatus): Project[] =>
  projects.filter((project) => project.status === status);

/**
 * Finds one project by slug.
 *
 * `includeUnpublished` exists so a draft can be previewed on its real URL in
 * development while staying invisible in production.
 */
export const selectBySlug = (
  projects: Project[],
  slug: string,
  options: { includeUnpublished?: boolean } = {},
): Project | undefined => {
  const pool = options.includeUnpublished ? projects : selectPublished(projects);
  return pool.find((project) => project.slug === slug);
};
