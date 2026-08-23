import { cloneElement, isValidElement, useId, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ExternalLink, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ContentApiError, fileToDataUrl, saveProject, type PendingImage } from "@/admin/api";
import { getAllProjects, getBySlug } from "@/content/loader";
import { availableImageFilenames, resolveProjectImage } from "@/content/images";
import {
  ALLOWED_IMAGE_EXTENSIONS,
  PROJECT_STATUSES,
  projectFrontmatterSchema,
  projectPath,
  slugify,
  type Project,
  type ProjectStatus,
} from "@/content/schema";

/**
 * The project form.
 *
 * Every field of the content model is editable here, so adding a project never
 * means opening a source file. The form validates with the same Zod schema the
 * content files are validated against, so what passes here is exactly what the
 * site will accept.
 *
 * Publishing writes `status: published` to the content file and says so. It does
 * not commit, push, or touch Git in any way.
 */

interface FormState {
  slug: string;
  title: string;
  category: string;
  status: ProjectStatus;
  featured: boolean;
  order: string;
  date: string;
  summary: string;
  context: string;
  problem: string;
  built: string;
  result: string;
  coverImage: string;
  gallery: string[];
  liveUrl: string;
  sourceUrl: string;
  seoTitle: string;
  seoDescription: string;
  body: string;
}

const emptyForm = (nextOrder: number): FormState => ({
  slug: "",
  title: "",
  category: "",
  status: "draft",
  featured: false,
  order: String(nextOrder),
  date: new Date().toISOString().slice(0, 10),
  summary: "",
  context: "",
  problem: "",
  built: "",
  result: "",
  coverImage: "",
  gallery: [],
  liveUrl: "",
  sourceUrl: "",
  seoTitle: "",
  seoDescription: "",
  body: "",
});

const formFromProject = (project: Project): FormState => ({
  slug: project.slug,
  title: project.title,
  category: project.category,
  status: project.status,
  featured: project.featured,
  order: project.order === undefined ? "" : String(project.order),
  date: project.date ?? "",
  summary: project.summary,
  context: project.context ?? "",
  problem: project.problem ?? "",
  built: project.built ?? "",
  result: project.result ?? "",
  coverImage: project.coverImage,
  gallery: [...project.gallery],
  liveUrl: project.liveUrl ?? "",
  sourceUrl: project.sourceUrl ?? "",
  seoTitle: project.seoTitle ?? "",
  seoDescription: project.seoDescription ?? "",
  body: project.body ?? "",
});

/** Trims a value and turns blanks into undefined, matching the schema's rules. */
const clean = (value: string): string | undefined => {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

const extensionOf = (filename: string): string => filename.split(".").pop()?.toLowerCase() ?? "";

/** HTML elements a <label> is allowed to point at. */
const LABELABLE_TAGS = new Set(["input", "select", "textarea"]);

const Field = ({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) => {
  const fieldId = useId();

  // Tie the label to its control so clicking the label focuses the field.
  // Fields that render a group of controls (the image pickers) are left alone:
  // they carry their own labels, and a label may not contain another label.
  const child = isValidElement(children) ? children : undefined;
  const isSingleControl =
    child !== undefined && (typeof child.type !== "string" || LABELABLE_TAGS.has(child.type));
  const control = isSingleControl
    ? cloneElement(child as React.ReactElement<{ id?: string }>, { id: fieldId })
    : children;

  return (
    <div className="space-y-1.5">
      <Label className="text-sm" htmlFor={isSingleControl ? fieldId : undefined}>
        {label}
      </Label>
      {control}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-xl border bg-background p-5">
    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </section>
);

const ProjectEditor = () => {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const existing = routeSlug ? getBySlug(routeSlug, { includeUnpublished: true }) : undefined;
  const isNew = !routeSlug;

  const nextOrder = useMemo(() => {
    const orders = getAllProjects()
      .map((project) => project.order)
      .filter((order): order is number => typeof order === "number");
    return orders.length > 0 ? Math.max(...orders) + 1 : 1;
  }, []);

  const [form, setForm] = useState<FormState>(() =>
    existing ? formFromProject(existing) : emptyForm(nextOrder),
  );
  const [pendingImages, setPendingImages] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [confirmSlugChange, setConfirmSlugChange] = useState(false);
  const [conflict, setConflict] = useState<string | null>(null);
  const slugEdited = useRef(!isNew);

  const knownImages = availableImageFilenames();

  if (routeSlug && !existing) {
    return (
      <div className="rounded-xl border bg-background p-8 text-center">
        <p className="mb-4 text-sm text-muted-foreground">
          No content file matches <code className="font-mono">{routeSlug}</code>.
        </p>
        <Button variant="outline" asChild>
          <Link to="/admin">Back to projects</Link>
        </Button>
      </div>
    );
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors(({ [key as string]: _removed, ...rest }) => rest);
  };

  const onTitleChange = (value: string) => {
    setForm((previous) => ({
      ...previous,
      title: value,
      // While creating, the slug follows the title until it is edited by hand.
      slug: slugEdited.current ? previous.slug : slugify(value),
    }));
  };

  const slugChanged = Boolean(existing) && existing?.slug !== form.slug;
  const wasPublished = existing?.status === "published";

  /** Next free "-N" suffix, so removing and re-adding never reuses a name. */
  const nextGalleryIndex = (): number => {
    const taken = new Set([...form.gallery, ...Object.keys(pendingImages)]);
    let index = 1;
    while ([...taken].some((name) => name.startsWith(`${form.slug}-${index}.`))) index += 1;
    return index;
  };

  /** Reads a chosen file, names it from the slug, and holds it until save. */
  const attachImage = async (file: File, target: "cover" | "gallery") => {
    const extension = extensionOf(file.name);
    if (!(ALLOWED_IMAGE_EXTENSIONS as readonly string[]).includes(extension)) {
      toast.error(`Images must be ${ALLOWED_IMAGE_EXTENSIONS.join(", ")}.`);
      return;
    }
    if (!form.slug) {
      toast.error("Add a title first so the image can be named after the project.");
      return;
    }

    const filename =
      target === "cover"
        ? `${form.slug}.${extension}`
        : `${form.slug}-${nextGalleryIndex()}.${extension}`;

    try {
      const dataUrl = await fileToDataUrl(file);
      setPendingImages((previous) => ({ ...previous, [filename]: dataUrl }));
      if (target === "cover") {
        update("coverImage", filename);
      } else {
        update("gallery", [...form.gallery, filename]);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read that file.");
    }
  };

  /** A displayable URL for a filename, whether saved already or still pending. */
  const previewUrl = (filename: string): string =>
    pendingImages[filename] ?? resolveProjectImage(filename, "admin editor");

  const buildFrontmatter = (status: ProjectStatus) => ({
    slug: form.slug.trim(),
    title: form.title.trim(),
    category: form.category.trim(),
    status,
    featured: form.featured,
    order: form.order.trim() === "" ? undefined : Number(form.order),
    date: clean(form.date),
    summary: form.summary.trim(),
    context: clean(form.context),
    problem: clean(form.problem),
    built: clean(form.built),
    result: clean(form.result),
    coverImage: form.coverImage.trim(),
    gallery: form.gallery,
    liveUrl: clean(form.liveUrl),
    sourceUrl: clean(form.sourceUrl),
    seoTitle: clean(form.seoTitle),
    seoDescription: clean(form.seoDescription),
  });

  const submit = async (status: ProjectStatus) => {
    setConflict(null);
    const frontmatter = buildFrontmatter(status);

    // Same schema the site loads with, so the form can never save a file the
    // portfolio would then refuse.
    const parsed = projectFrontmatterSchema.safeParse(frontmatter);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] ? String(issue.path[0]) : "form"] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Some fields still need attention.");
      return;
    }

    const images: PendingImage[] = Object.entries(pendingImages)
      .filter(([filename]) => filename === form.coverImage || form.gallery.includes(filename))
      .map(([filename, dataUrl]) => ({
        filename,
        dataUrl,
        // The name is derived from this project's slug, so a same-named file is
        // this project's own earlier image and is meant to be replaced.
        replace: knownImages.includes(filename),
      }));

    setSaving(true);
    try {
      const result = await saveProject({
        slug: frontmatter.slug,
        previousSlug: existing?.slug,
        confirmSlugChange,
        project: { ...parsed.data, body: clean(form.body) },
        images,
      });

      toast.success(result.message);
      setPendingImages({});
      setConfirmSlugChange(false);
      update("status", status);
      navigate(`/admin/edit/${result.slug}`, { replace: true });
    } catch (error) {
      if (error instanceof ContentApiError) {
        if (error.needsConfirmation) setConflict(error.message);
        if (error.issues?.length) {
          setErrors(
            Object.fromEntries(error.issues.map((issue) => [issue.field, issue.message])),
          );
        }
        toast.error(error.message);
      } else {
        toast.error(error instanceof Error ? error.message : "Saving failed.");
      }
    } finally {
      setSaving(false);
    }
  };

  const savedOnDisk = Boolean(existing) && !slugChanged;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-3 mb-1">
            <Link to="/admin">
              <ArrowLeft className="mr-1 h-3.5 w-3.5" />
              All projects
            </Link>
          </Button>
          <h1 className="text-xl font-bold">
            {isNew ? "New project" : form.title || existing?.title}
          </h1>
          {existing && (
            <p className="text-xs text-muted-foreground">
              <code className="font-mono">{existing.sourceFile}</code>
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {savedOnDisk && (
            <Button variant="ghost" size="sm" asChild>
              <Link to={projectPath(existing!.slug)} target="_blank">
                <ExternalLink className="mr-1 h-3.5 w-3.5" />
                Preview page
              </Link>
            </Button>
          )}
          <Button variant="outline" disabled={saving} onClick={() => submit(form.status)}>
            {saving && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
            Save {form.status}
          </Button>
          {form.status === "published" ? (
            <Button variant="outline" disabled={saving} onClick={() => submit("draft")}>
              Unpublish
            </Button>
          ) : (
            <Button disabled={saving} onClick={() => submit("published")}>
              {saving && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
              Publish
            </Button>
          )}
        </div>
      </div>

      {existing && (
        <p
          className={
            existing.status === "published"
              ? "rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm"
              : "rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground"
          }
        >
          {existing.status === "published"
            ? "Published locally. Commit and push your changes to deploy."
            : `Saved as ${existing.status}. It is visible on this machine only, at its own URL, and is not on the live site.`}
        </p>
      )}

      {conflict && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="mb-3 flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <span>{conflict}</span>
          </p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={confirmSlugChange}
              onChange={(event) => setConfirmSlugChange(event.target.checked)}
            />
            Yes, change the URL and remove the old file
          </label>
        </div>
      )}

      <Section title="Identity">
        <Field label="Title" error={errors.title}>
          <Input value={form.title} onChange={(event) => onTitleChange(event.target.value)} />
        </Field>

        <Field
          label="Slug"
          hint={`The project URL will be /projects/${form.slug || "your-slug"}`}
          error={errors.slug}
        >
          <Input
            value={form.slug}
            onChange={(event) => {
              slugEdited.current = true;
              update("slug", event.target.value);
            }}
          />
        </Field>

        {slugChanged && wasPublished && (
          <p className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
            <span>
              This project is published at <code className="font-mono">/projects/{existing?.slug}</code>.
              Saving with a new slug changes its address, and the old one will stop working.
            </span>
          </p>
        )}

        <Field label="Category" hint="Shown under the title, e.g. SaaS Landing Page" error={errors.category}>
          <Input value={form.category} onChange={(event) => update("category", event.target.value)} />
        </Field>
      </Section>

      <Section title="Story">
        <Field label="Summary" hint="The one-line hook at the top of the project page" error={errors.summary}>
          <Textarea
            rows={2}
            value={form.summary}
            onChange={(event) => update("summary", event.target.value)}
          />
        </Field>
        <Field label="Context" error={errors.context}>
          <Textarea rows={2} value={form.context} onChange={(event) => update("context", event.target.value)} />
        </Field>
        <Field label="Problem" error={errors.problem}>
          <Textarea rows={2} value={form.problem} onChange={(event) => update("problem", event.target.value)} />
        </Field>
        <Field label="What I built" error={errors.built}>
          <Textarea rows={3} value={form.built} onChange={(event) => update("built", event.target.value)} />
        </Field>
        <Field label="Result" error={errors.result}>
          <Textarea rows={2} value={form.result} onChange={(event) => update("result", event.target.value)} />
        </Field>
        <Field
          label="Longer write-up (optional)"
          hint="Paragraphs shown below the summary blocks. Blank lines separate paragraphs."
        >
          <Textarea rows={6} value={form.body} onChange={(event) => update("body", event.target.value)} />
        </Field>
      </Section>

      <Section title="Images">
        <Field label="Cover image" error={errors.coverImage}>
          <div className="flex items-start gap-4">
            <div className="h-24 w-40 shrink-0 overflow-hidden rounded-lg border bg-muted">
              {form.coverImage ? (
                <img src={previewUrl(form.coverImage)} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted">
                <Upload className="h-3.5 w-3.5" />
                Upload cover
                <input
                  type="file"
                  className="hidden"
                  accept={ALLOWED_IMAGE_EXTENSIONS.map((extension) => `.${extension}`).join(",")}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (file) void attachImage(file, "cover");
                  }}
                />
              </label>
              <select
                className="block h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={knownImages.includes(form.coverImage) ? form.coverImage : ""}
                onChange={(event) => update("coverImage", event.target.value)}
              >
                <option value="">Or choose an existing image</option>
                {knownImages.map((filename) => (
                  <option key={filename} value={filename}>
                    {filename}
                  </option>
                ))}
              </select>
              <p className="font-mono text-xs text-muted-foreground">
                {form.coverImage || "no file selected"}
                {pendingImages[form.coverImage] ? " (will be written on save)" : ""}
              </p>
            </div>
          </div>
        </Field>

        <Field label="Gallery (optional)" error={errors.gallery}>
          <div className="space-y-3">
            {form.gallery.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {form.gallery.map((filename) => (
                  <div key={filename} className="relative">
                    <img
                      src={previewUrl(filename)}
                      alt=""
                      className="h-20 w-32 rounded-lg border object-cover"
                    />
                    <button
                      type="button"
                      aria-label={`Remove ${filename}`}
                      onClick={() =>
                        update(
                          "gallery",
                          form.gallery.filter((entry) => entry !== filename),
                        )
                      }
                      className="absolute -right-2 -top-2 rounded-full border bg-background p-1 shadow-sm hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted">
              <Upload className="h-3.5 w-3.5" />
              Add gallery image
              <input
                type="file"
                className="hidden"
                accept={ALLOWED_IMAGE_EXTENSIONS.map((extension) => `.${extension}`).join(",")}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) void attachImage(file, "gallery");
                }}
              />
            </label>
          </div>
        </Field>
      </Section>

      <Section title="Links">
        <Field label="Live URL" hint="Include https://" error={errors.liveUrl}>
          <Input value={form.liveUrl} onChange={(event) => update("liveUrl", event.target.value)} />
        </Field>
        <Field label="Source / GitHub URL" error={errors.sourceUrl}>
          <Input value={form.sourceUrl} onChange={(event) => update("sourceUrl", event.target.value)} />
        </Field>
      </Section>

      <Section title="Search and social">
        <Field label="SEO title" hint="Falls back to the project title" error={errors.seoTitle}>
          <Input value={form.seoTitle} onChange={(event) => update("seoTitle", event.target.value)} />
        </Field>
        <Field label="SEO description" hint="Falls back to the summary" error={errors.seoDescription}>
          <Textarea
            rows={2}
            value={form.seoDescription}
            onChange={(event) => update("seoDescription", event.target.value)}
          />
        </Field>
      </Section>

      <Section title="Publishing">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Status" error={errors.status}>
            <select
              className="block h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.status}
              onChange={(event) => update("status", event.target.value as ProjectStatus)}
            >
              {PROJECT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Order" hint="Lower numbers appear first" error={errors.order}>
            <Input
              inputMode="numeric"
              value={form.order}
              onChange={(event) => update("order", event.target.value)}
            />
          </Field>
          <Field label="Date" hint="YYYY-MM-DD" error={errors.date}>
            <Input value={form.date} onChange={(event) => update("date", event.target.value)} />
          </Field>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={form.featured} onCheckedChange={(checked) => update("featured", checked)} />
          <Label className="text-sm">Featured</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          The buttons above set the status when they save, so Publish writes
          <code className="mx-1 font-mono">status: published</code> whatever this menu shows.
        </p>
      </Section>
    </div>
  );
};

export default ProjectEditor;
