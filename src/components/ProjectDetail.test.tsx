import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import ProjectDetail from "@/components/ProjectDetail";
import { WHATSAPP_NUMBER } from "@/config/site";
import type { Project } from "@/content/schema";

const project: Project = {
  slug: "elbi-homes",
  title: "Elbi Homes",
  category: "Real Estate Landing Page",
  status: "published",
  featured: false,
  summary: "Built to remove hesitation and make property inquiries feel easy.",
  context: "Real estate company based in Birmingham, England",
  problem: "Listings were scattered and did not build enough trust.",
  built: "A structured landing page that presents properties clearly.",
  result: "Stronger trust and a more confident inquiry flow.",
  coverImage: "elbi-homes.png",
  gallery: [],
  liveUrl: "https://elbi-homes.netlify.app/",
  id: "elbi-homes",
  coverImageUrl: "/assets/elbi-homes.png",
  galleryUrls: [],
};

const renderDetail = (overrides: Partial<Project> = {}) =>
  render(
    <MemoryRouter>
      <ProjectDetail project={{ ...project, ...overrides }} />
    </MemoryRouter>,
  );

describe("ProjectDetail", () => {
  it("renders the case study copy", () => {
    renderDetail();

    expect(screen.getByRole("heading", { level: 1, name: "Elbi Homes" })).toBeInTheDocument();
    expect(screen.getByText("Real Estate Landing Page")).toBeInTheDocument();
    expect(screen.getByText(project.summary)).toBeInTheDocument();

    for (const label of ["Context", "Problem", "What I Built", "Outcome"]) {
      expect(screen.getByRole("heading", { name: label })).toBeInTheDocument();
    }
  });

  it("omits a copy block that has no content instead of showing an empty heading", () => {
    renderDetail({ context: undefined, result: undefined });

    expect(screen.queryByRole("heading", { name: "Context" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Outcome" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Problem" })).toBeInTheDocument();
  });

  it("links back to the work section of the homepage", () => {
    renderDetail();

    expect(screen.getByRole("link", { name: /back to projects/i })).toHaveAttribute(
      "href",
      "/#work",
    );
  });

  it("shows the live project button when there is a live URL", () => {
    renderDetail();

    expect(screen.getByRole("link", { name: /view live project/i })).toHaveAttribute(
      "href",
      "https://elbi-homes.netlify.app/",
    );
  });

  it("hides the live project button when there is no live URL", () => {
    renderDetail({ liveUrl: undefined });

    expect(screen.queryByRole("link", { name: /view live project/i })).not.toBeInTheDocument();
  });

  it("hides the source button when there is no source URL", () => {
    renderDetail();

    expect(screen.queryByRole("link", { name: /view source/i })).not.toBeInTheDocument();
  });

  it("shows the source button when there is a source URL", () => {
    renderDetail({ sourceUrl: "https://github.com/owner/repo" });

    expect(screen.getByRole("link", { name: /view source/i })).toHaveAttribute(
      "href",
      "https://github.com/owner/repo",
    );
  });

  it("keeps the WhatsApp enquiry wired to the project title", () => {
    renderDetail();

    const link = screen.getByRole("link", { name: /i want something like this/i });
    const href = link.getAttribute("href") ?? "";

    expect(href.startsWith(`https://wa.me/${WHATSAPP_NUMBER}?text=`)).toBe(true);
    expect(decodeURIComponent(href.split("?text=")[1] ?? "")).toBe(
      "Hi, I saw your Elbi Homes project.\n\nI want something similar.",
    );
  });

  it("renders gallery images when a project has them", () => {
    renderDetail({ galleryUrls: ["/assets/one.png", "/assets/two.png"] });

    expect(screen.getByAltText("Elbi Homes - screenshot 1")).toBeInTheDocument();
    expect(screen.getByAltText("Elbi Homes - screenshot 2")).toBeInTheDocument();
  });

  it("renders the Markdown body as paragraphs", () => {
    renderDetail({ body: "First paragraph.\n\nSecond paragraph." });

    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
  });

  it("warns that a draft is not on the live site", () => {
    renderDetail({ status: "draft" });
    expect(screen.getByText("Draft")).toBeInTheDocument();
    expect(screen.getByText(/does not exist on the live site/i)).toBeInTheDocument();
  });

  it("warns that an archived project is not on the live site", () => {
    renderDetail({ status: "archived" });
    expect(screen.getByText("Archived")).toBeInTheDocument();
  });

  it("shows no banner for a published project", () => {
    renderDetail();
    expect(screen.queryByText(/does not exist on the live site/i)).not.toBeInTheDocument();
  });
});
