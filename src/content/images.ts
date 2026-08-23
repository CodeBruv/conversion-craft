/**
 * Resolves project image filenames to bundled asset URLs.
 *
 * Content files store a bare filename (e.g. "elbi-homes.png"). Vite needs the
 * file to be part of the module graph to hash, copy and cache-bust it, so every
 * image in src/assets/projects is imported eagerly here and looked up by name.
 *
 * This is the only place that knows where image files physically live.
 */
const imageModules = import.meta.glob<string>(
  "../assets/projects/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}",
  { eager: true, import: "default" },
);

/** filename (lowercased) -> bundled URL */
const imagesByFilename = new Map<string, string>();

for (const [path, url] of Object.entries(imageModules)) {
  const filename = path.split("/").pop();
  if (filename) imagesByFilename.set(filename.toLowerCase(), url);
}

/** Shipped in /public, so it needs no bundling. Development fallback only. */
const MISSING_IMAGE_PLACEHOLDER = "/placeholder.svg";

/** Every image filename available to content files. Used by the admin picker. */
export const availableImageFilenames = (): string[] =>
  Object.keys(imageModules)
    .map((path) => path.split("/").pop() as string)
    .sort((a, b) => a.localeCompare(b));

/**
 * Looks up a bundled URL for an image filename.
 *
 * In a production build a missing file is a hard error: a typo would otherwise
 * ship as a silently broken image. In development it warns and falls back to a
 * placeholder instead, because there is a brief moment right after the editor
 * saves a new image when the file exists on disk but the module graph has not
 * caught up yet. Crashing the page during that window would be unhelpful.
 */
export function resolveProjectImage(filename: string, sourceFile: string): string {
  const url = imagesByFilename.get(filename.trim().toLowerCase());
  if (url) return url;

  const available = availableImageFilenames();
  const message =
    `Image "${filename}" referenced by ${sourceFile} was not found in src/assets/projects.\n` +
    `Available images: ${available.length > 0 ? available.join(", ") : "(none)"}`;

  if (import.meta.env.DEV) {
    console.warn(`[content] ${message}`);
    return MISSING_IMAGE_PLACEHOLDER;
  }

  throw new Error(message);
}
