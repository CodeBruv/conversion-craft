/**
 * Client for the development content writer.
 *
 * Every call goes to the Vite dev middleware in vite/content-api.ts, which only
 * exists while `npm run dev` is running. Nothing here talks to Git: saving writes
 * a file, and committing stays a normal manual step.
 */
import type { ProjectFrontmatter } from "@/content/schema";

const BASE = "/__content-api";

/** Matches the guard the dev middleware requires on every request. */
const GUARD_HEADERS = { "x-content-api": "1", "Content-Type": "application/json" };

export interface PendingImage {
  filename: string;
  /** base64 data URL produced by the browser's FileReader. */
  dataUrl: string;
  /** True when this image intentionally replaces a file of the same name. */
  replace?: boolean;
}

export interface SaveProjectPayload {
  slug: string;
  previousSlug?: string;
  confirmSlugChange?: boolean;
  project: Partial<ProjectFrontmatter> & { body?: string };
  images?: PendingImage[];
}

export interface SaveProjectResult {
  ok: true;
  slug: string;
  file: string;
  created: boolean;
  renamedFrom?: string;
  images: string[];
  message: string;
}

export class ContentApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly issues?: Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.name = "ContentApiError";
  }

  /** True when the writer wants explicit confirmation before proceeding. */
  get needsConfirmation(): boolean {
    return this.status === 409;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, { ...init, headers: GUARD_HEADERS });
  } catch {
    throw new ContentApiError(
      "Could not reach the local content writer. Is `npm run dev` still running?",
      0,
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ContentApiError(
      `The content writer returned an unexpected response (HTTP ${response.status}).`,
      response.status,
    );
  }

  const body = payload as { ok?: boolean; error?: string; issues?: Array<{ field: string; message: string }> };

  if (!response.ok || body.ok !== true) {
    throw new ContentApiError(
      body.error ?? `The content writer refused the request (HTTP ${response.status}).`,
      response.status,
      body.issues,
    );
  }

  return payload as T;
}

/** Confirms the dev writer is reachable, so the editor can say so up front. */
export const checkWriter = () =>
  request<{ ok: true; projectsDir: string; assetsDir: string }>("/health");

/** Writes a project content file, plus any images it needs, in one request. */
export const saveProject = (payload: SaveProjectPayload) =>
  request<SaveProjectResult>("/project", {
    method: "POST",
    body: JSON.stringify(payload),
  });

/** Reads a File chosen in the browser as a base64 data URL. */
export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.readAsDataURL(file);
  });
