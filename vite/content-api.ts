/**
 * Development-only content writer.
 *
 * This is what lets the local /admin editor save a project as a real file in the
 * repository. It is a Vite middleware, not a server: `apply: "serve"` means it
 * exists while `npm run dev` is running and is absent from `vite build` output.
 *
 * Deliberate boundaries:
 *   - It writes ONLY inside src/content/projects and src/assets/projects.
 *   - It accepts a slug and a bare filename, never a path. Anything that
 *     resolves outside the two target directories is rejected.
 *   - It runs no Git commands. Committing and pushing stay entirely manual.
 *   - It is not a generic filesystem endpoint: two write operations, both with
 *     a fixed destination directory and a validated filename.
 *
 * Layered guards, because a Vite dev server with `host: "::"` is reachable from
 * the local network: loopback-only clients, a required custom header (which
 * forces a CORS preflight that is never answered, blocking cross-site posts),
 * same-origin checks, a JSON body cap, and image magic-byte verification.
 */
import { constants } from "node:fs";
import { access, mkdir, readFile, readdir, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

import {
  ALLOWED_IMAGE_EXTENSIONS,
  SLUG_PATTERN,
  type ProjectFrontmatter,
} from "../src/content/schema";
import {
  ProjectSerializeError,
  projectFileName,
  serializeProjectFile,
} from "../src/content/serialize";

/** Mount point for the dev endpoints. */
const BASE_PATH = "/__content-api";

/** Required on every request. Simple cross-site posts cannot set it. */
const GUARD_HEADER = "x-content-api";

/** Content directories, relative to the Vite project root. */
const PROJECTS_DIR = path.join("src", "content", "projects");
const ASSETS_DIR = path.join("src", "assets", "projects");

/** Max JSON body. Generous enough for a screenshot, small enough to be a cap. */
const MAX_BODY_BYTES = 8 * 1024 * 1024;

const IMAGE_FILENAME_PATTERN = new RegExp(
  `^[A-Za-z0-9._-]+\\.(${ALLOWED_IMAGE_EXTENSIONS.join("|")})$`,
  "i",
);

const LOOPBACK_ADDRESSES = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1", "localhost"]);

class RequestError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly issues?: Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.name = "RequestError";
  }
}

// --- helpers ---------------------------------------------------------------

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  const body = JSON.stringify(payload);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(body);
}

function isLoopback(req: IncomingMessage): boolean {
  const address = req.socket.remoteAddress ?? "";
  return LOOPBACK_ADDRESSES.has(address);
}

/** Rejects cross-site requests: the browser sends Origin on any cross-origin post. */
function assertSameOrigin(req: IncomingMessage): void {
  const origin = req.headers.origin;
  if (!origin) return;
  const host = req.headers.host;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new RequestError(403, "Rejected: unreadable Origin header.");
  }
  if (!host || originHost !== host) {
    throw new RequestError(403, "Rejected: cross-origin request to the local content writer.");
  }
}

async function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  const contentType = req.headers["content-type"] ?? "";
  if (!contentType.includes("application/json")) {
    throw new RequestError(415, "Expected a JSON request body.");
  }

  const chunks: Buffer[] = [];
  let size = 0;

  await new Promise<void>((resolve, reject) => {
    req.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(
          new RequestError(
            413,
            `Request body is larger than ${Math.round(MAX_BODY_BYTES / (1024 * 1024))} MB.`,
          ),
        );
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve());
    req.on("error", (error) => reject(error));
  });

  try {
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("not an object");
    }
    return parsed as Record<string, unknown>;
  } catch {
    throw new RequestError(400, "Request body was not a JSON object.");
  }
}

/**
 * Confines a caller-supplied name to a known directory.
 *
 * The name is already pattern-checked; this is the belt to that braces. It also
 * catches symlink-free traversal attempts such as a decoded "..%2f" sequence.
 */
function resolveInside(root: string, directory: string, name: string): string {
  const base = path.resolve(root, directory);
  const target = path.resolve(base, name);
  if (target !== path.join(base, path.basename(target)) || !target.startsWith(base + path.sep)) {
    throw new RequestError(400, `Rejected path outside ${directory}: ${name}`);
  }
  return target;
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/** Writes via a temp file in the same directory so readers never see a partial file. */
async function writeFileAtomic(filePath: string, data: string | Buffer): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temp = `${filePath}.${process.pid}.tmp`;
  await writeFile(temp, data);
  await rename(temp, filePath);
}

function requireString(body: Record<string, unknown>, field: string): string {
  const value = body[field];
  if (typeof value !== "string" || value.trim() === "") {
    throw new RequestError(400, `"${field}" is required.`);
  }
  return value.trim();
}

function optionalString(body: Record<string, unknown>, field: string): string | undefined {
  const value = body[field];
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") throw new RequestError(400, `"${field}" must be a string.`);
  return value;
}

function assertSlug(slug: string, field = "slug"): string {
  if (!SLUG_PATTERN.test(slug)) {
    throw new RequestError(400, `"${field}" must be lowercase letters, numbers and single hyphens.`);
  }
  return slug;
}

// --- image validation ------------------------------------------------------

const DATA_URL_PATTERN = /^data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=\s]+)$/i;

/** Confirms the bytes really are the image type the extension claims. */
function detectImageType(bytes: Buffer): "png" | "jpeg" | "webp" | null {
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "png";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpeg";
  }
  if (
    bytes.length >= 12 &&
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "webp";
  }
  return null;
}

const EXTENSION_TO_TYPE: Record<string, "png" | "jpeg" | "webp"> = {
  png: "png",
  jpg: "jpeg",
  jpeg: "jpeg",
  webp: "webp",
};

// --- handlers --------------------------------------------------------------

interface SaveResult {
  ok: true;
  slug: string;
  file: string;
  created: boolean;
  renamedFrom?: string;
  images: string[];
  message: string;
}

/** An image the editor wants written alongside the content file. */
interface PendingImage {
  filename: string;
  bytes: Buffer;
  replace: boolean;
}

/**
 * Validates uploaded images without writing anything.
 *
 * Separated from writing so a bad image cannot leave a half-saved project: all
 * validation for a save happens before the first byte hits the disk.
 */
function validateImages(body: Record<string, unknown>): PendingImage[] {
  const raw = body.images;
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) throw new RequestError(400, `"images" must be an array.`);
  if (raw.length > 12) throw new RequestError(400, "Too many images in one save (limit 12).");

  return raw.map((entry, index) => {
    if (entry === null || typeof entry !== "object" || Array.isArray(entry)) {
      throw new RequestError(400, `images[${index}] must be an object.`);
    }
    const image = entry as Record<string, unknown>;
    const filename = requireString(image, "filename");

    if (!IMAGE_FILENAME_PATTERN.test(filename)) {
      throw new RequestError(
        400,
        `"${filename}" is not an allowed image name. Use letters, numbers, dots, dashes or ` +
          `underscores and one of these extensions: ${ALLOWED_IMAGE_EXTENSIONS.join(", ")}.`,
      );
    }

    const match = DATA_URL_PATTERN.exec(requireString(image, "dataUrl"));
    if (!match) {
      throw new RequestError(
        400,
        `images[${index}] must be a base64 image data URL (png, jpg, jpeg or webp).`,
      );
    }

    const bytes = Buffer.from(match[2].replace(/\s+/g, ""), "base64");
    if (bytes.length === 0) throw new RequestError(400, `"${filename}" was empty.`);
    if (bytes.length > MAX_BODY_BYTES) throw new RequestError(413, `"${filename}" is too large to save.`);

    // The extension has to match the actual bytes, so an arbitrary payload
    // cannot be written into the assets folder under an image name.
    const extension = filename.split(".").pop()?.toLowerCase() ?? "";
    const expected = EXTENSION_TO_TYPE[extension];
    const actual = detectImageType(bytes);
    if (!actual || actual !== expected) {
      throw new RequestError(415, `"${filename}" is not a valid ${extension.toUpperCase()} image.`);
    }

    return { filename, bytes, replace: image.replace === true };
  });
}

async function handleSaveProject(
  root: string,
  body: Record<string, unknown>,
): Promise<SaveResult> {
  const slug = assertSlug(requireString(body, "slug"));
  const previousSlug = optionalString(body, "previousSlug")?.trim() || undefined;
  const confirmSlugChange = body.confirmSlugChange === true;

  const project = body.project;
  if (project === null || typeof project !== "object" || Array.isArray(project)) {
    throw new RequestError(400, `"project" must be an object of content fields.`);
  }

  const fields = project as Partial<ProjectFrontmatter> & { body?: string };
  if (fields.slug !== slug) {
    throw new RequestError(400, `"project.slug" must match the requested slug.`);
  }

  // Validation happens in the shared serializer, so a file that would break the
  // site can never reach disk.
  let contents: string;
  try {
    contents = serializeProjectFile(fields);
  } catch (error) {
    if (error instanceof ProjectSerializeError) {
      throw new RequestError(422, error.message, error.issues);
    }
    throw error;
  }

  const images = validateImages(body);

  const targetPath = resolveInside(root, PROJECTS_DIR, projectFileName(slug));
  const targetExists = await exists(targetPath);

  const isRename = previousSlug !== undefined && previousSlug !== slug;
  let previousPath: string | undefined;

  if (isRename) {
    previousPath = resolveInside(root, PROJECTS_DIR, projectFileName(assertSlug(previousSlug, "previousSlug")));
    if (await exists(previousPath)) {
      if (!confirmSlugChange) {
        throw new RequestError(
          409,
          `Changing the slug from "${previousSlug}" to "${slug}" changes this project's URL. ` +
            `The old address /projects/${previousSlug} will stop working and any links to it will break. ` +
            `Confirm to continue.`,
        );
      }
    } else {
      previousPath = undefined;
    }
  }

  if (targetExists && !isRename && previousSlug === undefined) {
    throw new RequestError(
      409,
      `A project file for "${slug}" already exists. Open it from the project list to edit it.`,
    );
  }

  if (targetExists && isRename) {
    throw new RequestError(409, `Cannot rename to "${slug}": a project with that slug already exists.`);
  }

  // Images first: the content file references them, and existing files are only
  // replaced when the editor explicitly said so.
  const written: string[] = [];
  for (const image of images) {
    const imagePath = resolveInside(root, ASSETS_DIR, image.filename);
    if ((await exists(imagePath)) && !image.replace) {
      throw new RequestError(
        409,
        `"${image.filename}" already exists in ${ASSETS_DIR}. Rename it, or confirm replacing it.`,
      );
    }
    await writeFileAtomic(imagePath, image.bytes);
    written.push(path.join(ASSETS_DIR, image.filename));
  }

  await writeFileAtomic(targetPath, contents);
  if (previousPath) await unlink(previousPath);

  const relative = path.join(PROJECTS_DIR, projectFileName(slug));
  return {
    ok: true,
    slug,
    file: relative,
    created: !targetExists,
    renamedFrom: previousPath ? previousSlug : undefined,
    images: written,
    message:
      fields.status === "published"
        ? "Published locally. Commit and push your changes to deploy."
        : `Saved as ${fields.status ?? "draft"} in ${relative}.`,
  };
}

async function handleListRaw(root: string): Promise<{ ok: true; files: Array<{ file: string; raw: string }> }> {
  const directory = path.resolve(root, PROJECTS_DIR);
  if (!(await exists(directory))) return { ok: true, files: [] };
  const names = (await readdir(directory)).filter((name) => name.endsWith(".md")).sort();
  const files = await Promise.all(
    names.map(async (name) => ({
      file: path.join(PROJECTS_DIR, name),
      raw: await readFile(path.join(directory, name), "utf8"),
    })),
  );
  return { ok: true, files };
}

// --- plugin ---------------------------------------------------------------

export function contentApiPlugin(): Plugin {
  let root = process.cwd();

  return {
    name: "conversion-craft:content-api",
    // Development only. This middleware is never part of a production build.
    apply: "serve",

    configResolved(config) {
      root = config.root;
    },

    configureServer(server) {
      server.middlewares.use(BASE_PATH, (req, res, next) => {
        const handle = async (): Promise<void> => {
          if (!isLoopback(req)) {
            throw new RequestError(
              403,
              "The local content editor only accepts requests from this machine.",
            );
          }
          if (req.headers[GUARD_HEADER] !== "1") {
            throw new RequestError(403, `Missing ${GUARD_HEADER} header.`);
          }
          assertSameOrigin(req);

          const route = (req.url ?? "/").split("?")[0].replace(/\/+$/, "") || "/";

          if (req.method === "GET" && route === "/health") {
            sendJson(res, 200, { ok: true, root, projectsDir: PROJECTS_DIR, assetsDir: ASSETS_DIR });
            return;
          }

          if (req.method === "GET" && route === "/projects") {
            sendJson(res, 200, await handleListRaw(root));
            return;
          }

          if (req.method === "POST" && route === "/project") {
            sendJson(res, 200, await handleSaveProject(root, await readJsonBody(req)));
            return;
          }

          throw new RequestError(404, `Unknown content endpoint: ${req.method} ${BASE_PATH}${route}`);
        };

        handle().catch((error: unknown) => {
          if (error instanceof RequestError) {
            sendJson(res, error.status, {
              ok: false,
              error: error.message,
              issues: error.issues,
            });
            return;
          }
          const message = error instanceof Error ? error.message : String(error);
          server.config.logger.error(`[content-api] ${message}`);
          sendJson(res, 500, { ok: false, error: `Could not write content: ${message}` });
        });
      });

      server.config.logger.info(
        `  \x1b[36m->\x1b[0m  local editor:  \x1b[1m/admin\x1b[0m (development only)`,
      );
    },
  };
}

export default contentApiPlugin;

/**
 * Internals exposed for tests only.
 *
 * These are the guards that stand between a browser request and the filesystem,
 * so they are worth testing directly. Nothing imports this from application
 * code, and this module is only ever loaded by the Vite dev server.
 */
export const __internals = {
  RequestError,
  assertSameOrigin,
  assertSlug,
  detectImageType,
  isLoopback,
  resolveInside,
  validateImages,
  PROJECTS_DIR,
  ASSETS_DIR,
};
