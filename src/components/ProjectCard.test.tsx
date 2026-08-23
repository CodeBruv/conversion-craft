import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/content/schema";

const project: Project = {
  slug: "elbi-homes",
  title: "Elbi Homes",
  category: "Real Estate Landing Page",
  status: "published",
  featured: false,
  summary: "Built to remove hesitation and make property inquiries feel easy.",
  coverImage: "elbi-homes.png",
  gallery: [],
  id: "elbi-homes",
  coverImageUrl: "/assets/elbi-homes.png",
  galleryUrls: [],
};

const renderCard = (overrides: Partial<Project> = {}) =>
  render(
    <MemoryRouter>
      <ProjectCard project={{ ...project, ...overrides }} />
    </MemoryRouter>,
  );

describe("ProjectCard", () => {
  it("shows the title and category", () => {
    renderCard();

    expect(screen.getByRole("heading", { name: "Elbi Homes" })).toBeInTheDocument();
    expect(screen.getByText("Real Estate Landing Page")).toBeInTheDocument();
  });

  it("links to the project's own URL", () => {
    renderCard();

    expect(screen.getByRole("link")).toHaveAttribute("href", "/projects/elbi-homes");
  });

  it("uses the resolved image URL and describes the image", () => {
    renderCard();

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "/assets/elbi-homes.png");
    expect(image).toHaveAttribute("alt", "Elbi Homes - Real Estate Landing Page");
    expect(image).toHaveAttribute("loading", "lazy");
  });

  it("does not care where the project came from", () => {
    // No sourceFile, no body: a project from a CMS or an API would render the
    // same, which is the point of keeping this component presentation-only.
    renderCard({ slug: "from-anywhere", title: "From Anywhere" });

    expect(screen.getByRole("link")).toHaveAttribute("href", "/projects/from-anywhere");
  });
});
