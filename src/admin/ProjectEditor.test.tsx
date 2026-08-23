import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { saveProject } from "@/admin/api";
import ProjectEditor from "@/admin/ProjectEditor";
import { getAllPublished } from "@/content/loader";

/**
 * The editor, with only the network call replaced.
 *
 * The Zod validation, the slug rules and the messages are the real ones, so
 * these tests check that nothing can be sent to the writer that the site would
 * later refuse to load.
 *
 * fireEvent rather than user-event: @testing-library/user-event is not a
 * dependency of this project and adding one was out of scope.
 */
vi.mock("@/admin/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/admin/api")>();
  return { ...actual, saveProject: vi.fn() };
});

const mockedSave = vi.mocked(saveProject);

const renderEditor = (path = "/admin/new") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/admin/new" element={<ProjectEditor />} />
        <Route path="/admin/edit/:slug" element={<ProjectEditor />} />
      </Routes>
    </MemoryRouter>,
  );

const type = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

beforeEach(() => {
  mockedSave.mockReset();
  mockedSave.mockResolvedValue({
    ok: true,
    slug: "a-brand-new-project",
    file: "src/content/projects/a-brand-new-project.md",
    created: true,
    images: [],
    message: "Published locally. Commit and push your changes to deploy.",
  });
});

describe("ProjectEditor", () => {
  it("offers every content field, so no source file has to be opened", () => {
    renderEditor();

    for (const label of [
      "Title",
      "Slug",
      "Category",
      "Summary",
      "Context",
      "Problem",
      "What I built",
      "Result",
      "Cover image",
      "Gallery (optional)",
      "Live URL",
      "Source / GitHub URL",
      "SEO title",
      "SEO description",
      "Status",
      "Order",
      "Date",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("derives the slug from the title while the slug is untouched", () => {
    renderEditor();

    type("Title", "A Brand New Project");

    expect(screen.getByLabelText("Slug")).toHaveValue("a-brand-new-project");
    expect(
      screen.getByText("/projects/a-brand-new-project", { exact: false }),
    ).toBeInTheDocument();
  });

  it("stops following the title once the slug is edited by hand", () => {
    renderEditor();

    type("Slug", "chosen-slug");
    type("Title", "A Different Title");

    expect(screen.getByLabelText("Slug")).toHaveValue("chosen-slug");
  });

  it("refuses to save an incomplete project and never calls the writer", async () => {
    renderEditor();

    fireEvent.click(screen.getByRole("button", { name: /publish/i }));

    // Field-level messages, in the form, from the same schema the site uses.
    expect(await screen.findByText(/"title" must not be empty/i)).toBeInTheDocument();
    expect(mockedSave).not.toHaveBeenCalled();
  });

  it("rejects a link that is not a full URL before writing anything", async () => {
    renderEditor();

    type("Title", "A Brand New Project");
    type("Category", "Landing Page");
    type("Summary", "A short summary.");
    type("Live URL", "example.com");

    fireEvent.click(screen.getByRole("button", { name: /publish/i }));

    expect(await screen.findByText(/must be a valid absolute URL/i)).toBeInTheDocument();
    expect(mockedSave).not.toHaveBeenCalled();
  });

  it("sends the whole project to the writer when it is valid", async () => {
    renderEditor();

    type("Title", "A Brand New Project");
    type("Category", "Landing Page");
    type("Summary", "A short summary.");

    // A cover image is required; reuse one that already exists on disk so the
    // test needs no file upload.
    const existingImage = getAllPublished()[0]?.coverImage ?? "";
    const [coverSelect] = screen.getAllByRole("combobox");
    fireEvent.change(coverSelect, { target: { value: existingImage } });

    fireEvent.click(screen.getByRole("button", { name: /publish/i }));

    await waitFor(() => expect(mockedSave).toHaveBeenCalledTimes(1));

    const payload = mockedSave.mock.calls[0]?.[0];
    expect(payload?.slug).toBe("a-brand-new-project");
    expect(payload?.project.title).toBe("A Brand New Project");
    expect(payload?.project.status).toBe("published");
    expect(payload?.project.coverImage).toBe(existingImage);
    // Nothing to rename: this project has no previous slug.
    expect(payload?.previousSlug).toBeUndefined();
  });

  it("unpublishes an existing project by saving it as a draft", async () => {
    const published = getAllPublished()[0];
    expect(published).toBeDefined();
    if (!published) return;

    renderEditor(`/admin/edit/${published.slug}`);

    // A published project offers "Unpublish" instead of "Publish".
    fireEvent.click(screen.getByRole("button", { name: /unpublish/i }));

    await waitFor(() => expect(mockedSave).toHaveBeenCalledTimes(1));
    expect(mockedSave.mock.calls[0]?.[0].project.status).toBe("draft");
    expect(mockedSave.mock.calls[0]?.[0].previousSlug).toBe(published.slug);
  });

  it("warns before changing the URL of a published project", () => {
    const published = getAllPublished()[0];
    if (!published) return;

    renderEditor(`/admin/edit/${published.slug}`);
    type("Slug", "a-different-slug");

    expect(screen.getByText(/the old one will stop working/i)).toBeInTheDocument();
  });

  it("does not warn about the URL while the slug is unchanged", () => {
    const published = getAllPublished()[0];
    if (!published) return;

    renderEditor(`/admin/edit/${published.slug}`);

    expect(screen.queryByText(/the old one will stop working/i)).not.toBeInTheDocument();
  });

  it("says that publishing is local until the change is committed", () => {
    const published = getAllPublished()[0];
    if (!published) return;

    renderEditor(`/admin/edit/${published.slug}`);

    expect(
      screen.getByText("Published locally. Commit and push your changes to deploy."),
    ).toBeInTheDocument();
  });

  it("explains itself when a slug has no content file", () => {
    renderEditor("/admin/edit/not-a-real-project");

    expect(screen.getByText(/no content file matches/i)).toBeInTheDocument();
  });
});
