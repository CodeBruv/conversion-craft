/**
 * The content loader: the single doorway between content files and the app.
 *
 *   src/content/projects/*.md
 *        -> parsed + Zod-validated (./parse, ./schema)
 *        -> typed Project objects
 *        -> presentation components
 *
 * Components import from here (or receive Projects as props) and never touch
 * Markdown, YAML, globs or asset paths. Swapping this file for a CMS/API client
 * later would require no component changes.
 */
import {
  buildProjectRegistry,
  selectAll,
  selectBySlug,
  selectByStatus,
  selectFeatured,
  selectPublished,
} from "./parse";
import { resolveProjectImage } from "./images";
import type { Project, ProjectStatus } from "./schema";

/**
 * Eagerly read every project file as raw text.
 *
 * Eager is intentional: the project list is small, the homepage needs it during
 * the first paint, and Vite's HMR re-runs this module when a file changes, so
 * saving from /admin refreshes the site immediately.
 */
const contentFiles = import.meta.glob<string>("./projects/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

/**
 * Validated projects in display order.
 *
 * Built once at module evaluation. Invalid content throws here, loudly, naming
 * the offending file and field, rather than quietly disappearing from the site.
 */
const projects: Project[] = buildProjectRegistry(contentFiles, resolveProjectImage);

/** True only in `vite dev`; statically replaced with `false` in production. */
const isDev = import.meta.env.DEV;

/** Every project, including drafts and archived work. Development/admin only. */
export const getAllProjects = (): Project[] => selectAll(projects);

/** Everything the public site is allowed to display. */
export const getAllPublished = (): Project[] => selectPublished(projects);

/** Published + featured, in display order. */
export const getFeatured = (): Project[] => selectFeatured(projects);

/** Projects filtered by publishing status (drives the admin list). */
export const getByStatus = (status: ProjectStatus): Project[] =>
  selectByStatus(projects, status);

/**
 * Finds a project for a route.
 *
 * In production only published projects resolve, so a draft URL 404s even if
 * someone guesses it. In development drafts resolve too, which is what makes
 * "preview before publishing" work on the real /projects/:slug route.
 */
export const getBySlug = (
  slug: string,
  options: { includeUnpublished?: boolean } = {},
): Project | undefined =>
  selectBySlug(projects, slug, {
    includeUnpublished: options.includeUnpublished ?? isDev,
  });

/** Total number of content files that validated. Used by the admin header. */
export const getProjectCount = (): number => projects.length;

export type { Project, ProjectStatus };
