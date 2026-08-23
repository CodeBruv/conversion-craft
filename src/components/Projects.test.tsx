import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import Projects from "@/components/Projects";
import { getAllPublished } from "@/content/loader";
import { projectPath } from "@/content/schema";

describe("Projects section", () => {
  const published = getAllPublished();

  it("renders one card per published project without any hardcoded list", () => {
    // Projects.tsx holds no project data: whatever is in the content directory
    // is what appears here. Adding a project must never require editing it.
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>,
    );

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(published.length);
    expect(links.map((link) => link.getAttribute("href"))).toEqual(
      published.map((project) => projectPath(project.slug)),
    );
  });

  it("keeps the section heading and anchor the homepage links to", () => {
    const { container } = render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>,
    );

    expect(container.querySelector("#work")).not.toBeNull();
    expect(
      screen.getByRole("heading", { name: /selected work, including concept builds/i }),
    ).toBeInTheDocument();
  });

  it("shows every published project's title", () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>,
    );

    for (const project of published) {
      expect(screen.getByRole("heading", { name: project.title })).toBeInTheDocument();
    }
  });
});
