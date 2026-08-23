import { useEffect } from "react";

/**
 * Sets the document title and social meta tags for the current route.
 *
 * This is a small DOM-based hook rather than a helmet library because no such
 * library is installed and this project cannot add dependencies right now.
 *
 * Honest limitation: this runs in the browser. Google executes JavaScript and
 * will see these values, but most social scrapers (Facebook, LinkedIn, and
 * Twitter's card fetcher) do NOT. Per-project link previews therefore fall back
 * to the static tags in index.html until the site is prerendered. The static
 * fallbacks are deliberately generic so that outcome is still sensible.
 */
export interface DocumentMeta {
  title: string;
  description?: string;
  /** Absolute or root-relative image URL for social previews. */
  image?: string;
  /** Canonical URL for this page. */
  url?: string;
  /** Open Graph object type. Defaults to "website". */
  type?: string;
}

type MetaSelector = { attr: "name" | "property"; key: string };

const META_TAGS: Record<keyof Omit<DocumentMeta, "title">, MetaSelector[]> = {
  description: [
    { attr: "name", key: "description" },
    { attr: "property", key: "og:description" },
    { attr: "name", key: "twitter:description" },
  ],
  image: [
    { attr: "property", key: "og:image" },
    { attr: "name", key: "twitter:image" },
  ],
  url: [{ attr: "property", key: "og:url" }],
  type: [{ attr: "property", key: "og:type" }],
};

const TITLE_TAGS: MetaSelector[] = [
  { attr: "property", key: "og:title" },
  { attr: "name", key: "twitter:title" },
];

/** Finds an existing meta tag, or creates one, and sets its content. */
function setMeta({ attr, key }: MetaSelector, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function readMeta({ attr, key }: MetaSelector): string | null {
  return (
    document.head
      .querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
      ?.getAttribute("content") ?? null
  );
}

function setCanonical(url: string): void {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

/**
 * The values index.html shipped with, captured once before any route overrides
 * them. Restored when a page that set its own meta unmounts, so navigating back
 * to the homepage does not leave a project's description behind.
 */
const defaults = (() => {
  if (typeof document === "undefined") return null;
  const snapshot: { title: string; meta: Array<[MetaSelector, string | null]> } = {
    title: document.title,
    meta: [],
  };
  for (const selector of [...TITLE_TAGS, ...Object.values(META_TAGS).flat()]) {
    snapshot.meta.push([selector, readMeta(selector)]);
  }
  return snapshot;
})();

export function useDocumentMeta(meta: DocumentMeta): void {
  const { title, description, image, url, type } = meta;

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.title = title;
    for (const selector of TITLE_TAGS) setMeta(selector, title);

    const values: Array<[keyof typeof META_TAGS, string | undefined]> = [
      ["description", description],
      ["image", image],
      ["url", url],
      ["type", type ?? "website"],
    ];

    for (const [field, value] of values) {
      if (value === undefined) continue;
      for (const selector of META_TAGS[field]) setMeta(selector, value);
    }

    if (url) setCanonical(url);

    return () => {
      if (!defaults) return;
      document.title = defaults.title;
      for (const [selector, value] of defaults.meta) {
        if (value !== null) setMeta(selector, value);
      }
    };
  }, [title, description, image, url, type]);
}
