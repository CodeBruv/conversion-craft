import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SITE_NAME } from "@/config/site";
import { getAllPublished } from "@/content/loader";
import { resolveSeoDescription, resolveSeoTitle } from "@/content/schema";
import ProjectPage from "@/pages/ProjectPage";

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/projects/:slug" element={<ProjectPage />} />
      </Routes>
    </MemoryRouter>,
  );

const metaContent = (selector: string): string | null =>
  document.head.querySelector(selector)?.getAttribute("content") ?? null;

afterEach(() => {
  vi.restoreAllMocks();
});

describe("/projects/:slug", () => {
  const project = getAllPublished()[0];

  it("has at least one published project to route to", () => {
    expect(project).toBeDefined();
  });

  it("renders the project on its own URL", () => {
    if (!project) return;
    renderAt(`/projects/${project.slug}`);

    expect(screen.getByRole("heading", { level: 1, name: project.title })).toBeInTheDocument();
    expect(screen.getByText(project.summary)).toBeInTheDocument();
  });

  it("renders the site chrome around the project", () => {
    if (!project) return;
    renderAt(`/projects/${project.slug}`);

    // The navbar link back to the homepage proves the page is a real route in
    // the site rather than a bare component.
    expect(screen.getByRole("link", { name: "Code Bruv" })).toHaveAttribute("href", "/");
  });

  it("points the navbar section links back at the homepage", () => {
    if (!project) return;
    renderAt(`/projects/${project.slug}`);

    // A bare "#work" would scroll to a section that is not on this page.
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/#work");
  });

  it("sets the document title and meta description from the project", () => {
    if (!project) return;
    renderAt(`/projects/${project.slug}`);

    expect(document.title).toBe(`${resolveSeoTitle(project)} - ${SITE_NAME}`);
    expect(metaContent('meta[name="description"]')).toBe(resolveSeoDescription(project));
    expect(metaContent('meta[property="og:title"]')).toBe(
      `${resolveSeoTitle(project)} - ${SITE_NAME}`,
    );
    expect(metaContent('meta[property="og:type"]')).toBe("article");
  });

  it("sets a canonical URL for the project", () => {
    if (!project) return;
    renderAt(`/projects/${project.slug}`);

    const canonical = document.head
      .querySelector('link[rel="canonical"]')
      ?.getAttribute("href");
    expect(canonical?.endsWith(`/projects/${project.slug}`)).toBe(true);
  });

  it("restores the site's default title when leaving the page", () => {
    if (!project) return;
    const defaultTitle = document.title;

    const view = renderAt(`/projects/${project.slug}`);
    expect(document.title).not.toBe(defaultTitle);

    view.unmount();
    expect(document.title).toBe(defaultTitle);
  });

  it("renders the 404 page for an unknown slug", () => {
    // NotFound logs the bad path on purpose; keep the test output readable.
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    renderAt("/projects/no-such-project");

    expect(screen.getByRole("heading", { level: 1, name: "404" })).toBeInTheDocument();
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });
});
