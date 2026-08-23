/**
 * Project content model.
 *
 * This is the single definition of what a portfolio project is.
 * Content files (src/content/projects/*.md) are validated against this schema
 * before anything downstream is allowed to see them.
 *
 * Nothing here knows about Markdown, the filesystem, Vite, or React.
 */
import { z } from "zod";

/** URL-safe, lowercase, hyphen-separated. Stable once published. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Publishing states. Only "published" is ever visible in production. */
export const PROJECT_STATUSES = ["draft", "published", "archived"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/** Image file extensions the portfolio accepts. */
export const ALLOWED_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp"] as const;

const IMAGE_FILENAME_PATTERN = new RegExp(
  `^[A-Za-z0-9._-]+\\.(${ALLOWED_IMAGE_EXTENSIONS.join("|")})$`,
  "i",
);

/** A required string that rejects empty / whitespace-only values. */
const requiredText = (field: string) =>
  z
    .string({ required_error: `"${field}" is required`, invalid_type_error: `"${field}" must be a string` })
    .trim()
    .min(1, `"${field}" must not be empty`);

/**
 * An optional string. Empty / whitespace-only values are treated as "not set"
 * rather than as an empty string, so the admin can leave fields blank safely.
 */
const optionalText = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().min(1).optional(),
);

/** An optional absolute URL. Validated only when supplied. */
const optionalUrl = (field: string) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z
      .string()
      .trim()
      .url(`"${field}" must be a valid absolute URL (including https://)`)
      .optional(),
  );

/** An image filename stored inside src/assets/projects. Never a path. */
const imageFilename = (field: string) =>
  requiredText(field).regex(
    IMAGE_FILENAME_PATTERN,
    `"${field}" must be an image filename such as my-project.png (allowed: ${ALLOWED_IMAGE_EXTENSIONS.join(", ")})`,
  );

/**
 * The YAML frontmatter contract for a project file.
 *
 * `.strict()` is deliberate: an unknown key almost always means a typo
 * (e.g. "sumary"), and silently ignoring it would hide content from the site.
 */
export const projectFrontmatterSchema = z
  .object({
    // --- identity & routing -------------------------------------------------
    slug: requiredText("slug").regex(
      SLUG_PATTERN,
      `"slug" must be lowercase letters, numbers and single hyphens (e.g. "elbi-homes")`,
    ),
    title: requiredText("title"),
    category: requiredText("category"),

    // --- publishing ---------------------------------------------------------
    status: z.enum(PROJECT_STATUSES, {
      required_error: `"status" is required`,
      invalid_type_error: `"status" must be one of: ${PROJECT_STATUSES.join(", ")}`,
    }),
    featured: z.boolean().optional().default(false),
    order: z.number().int().nonnegative().optional(),
    /** ISO calendar date (YYYY-MM-DD). Year is derived from this, never stored. */
    date: z.preprocess(
      (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
      z
        .string()
        .trim()
        .regex(/^\d{4}-\d{2}-\d{2}$/, `"date" must be in YYYY-MM-DD format`)
        .optional(),
    ),

    // --- copy ---------------------------------------------------------------
    summary: requiredText("summary"),
    context: optionalText,
    problem: optionalText,
    built: optionalText,
    result: optionalText,

    // --- media --------------------------------------------------------------
    coverImage: imageFilename("coverImage"),
    gallery: z.array(imageFilename("gallery entry")).optional().default([]),

    // --- links --------------------------------------------------------------
    liveUrl: optionalUrl("liveUrl"),
    sourceUrl: optionalUrl("sourceUrl"),

    // --- seo (falls back to title / summary when absent) --------------------
    seoTitle: optionalText,
    seoDescription: optionalText,
  })
  .strict();

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

/**
 * A fully-resolved project as presentation components consume it.
 *
 * `id` is derived from the slug and is never stored in Markdown.
 * `body` comes from the Markdown body, not the frontmatter.
 * `coverImageUrl` / `galleryUrls` are resolved by the loader, so components
 * never need to know where image files live.
 */
export type Project = ProjectFrontmatter & {
  id: string;
  body?: string;
  coverImageUrl: string;
  galleryUrls: string[];
  /** Source content file, for developer-facing error messages only. */
  sourceFile?: string;
};

/** IDs are derived, never duplicated in content files. */
export const deriveId = (slug: string): string => slug;

/** Year shown in the UI is derived from `date`, never stored separately. */
export const deriveYear = (date?: string): number | undefined =>
  date ? Number(date.slice(0, 4)) : undefined;

/** Effective document title for a project. */
export const resolveSeoTitle = (project: Pick<Project, "title" | "seoTitle">): string =>
  project.seoTitle ?? project.title;

/** Effective meta description for a project. */
export const resolveSeoDescription = (
  project: Pick<Project, "summary" | "seoDescription">,
): string => project.seoDescription ?? project.summary;

/** Canonical in-app path for a project. Single source of truth for URLs. */
export const projectPath = (slug: string): string => `/projects/${slug}`;

/** Turns a title into a candidate slug. Used by the admin when creating. */
export const slugify = (input: string): string =>
  input
    .normalize("NFKD")
    // Any whitespace becomes a single space so it survives as a separator below.
    .replace(/\s+/g, " ")
    // Drop anything outside printable ASCII (combining accents, smart quotes, emoji).
    .replace(/[^ -~]/g, "")
    .toLowerCase()
    // Apostrophes vanish rather than becoming separators ("Reed's" -> "reeds").
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
