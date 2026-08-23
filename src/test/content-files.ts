/**
 * Raw text of every real project content file, keyed by source path.
 *
 * The glob lives here rather than inside a test file so the tests themselves
 * stay free of bundler-specific syntax and can also be exercised outside Vite.
 */
export const RAW_PROJECT_FILES = import.meta.glob<string>("../content/projects/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});
