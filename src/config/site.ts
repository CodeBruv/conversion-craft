/**
 * Site-wide constants that are configuration, not project content.
 *
 * These belong here rather than in a content file because they describe the
 * business, not a portfolio project.
 */

/** WhatsApp contact number used by project enquiry links. */
export const WHATSAPP_NUMBER = "+2348142971640";

/** Brand name used in document titles. */
export const SITE_NAME = "Code Bruv Technologies";

/**
 * Fallback social preview image, served from /public so its URL is stable
 * across builds (unlike hashed src/assets files).
 */
export const DEFAULT_OG_IMAGE = "/og-image.png";

/**
 * Absolute site origin, used to build canonical and og:url values.
 *
 * The deployed domain is not recorded anywhere in this repository, so it is not
 * hardcoded here. Set VITE_SITE_URL at build time to pin it; otherwise the
 * browser's own origin is used, which is correct for every real visit.
 */
export const SITE_URL: string =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, "") ?? "";

/** Resolves a path to an absolute URL when the origin is known. */
export const absoluteUrl = (path: string): string => {
  const origin =
    SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
  if (!origin) return path;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
};
