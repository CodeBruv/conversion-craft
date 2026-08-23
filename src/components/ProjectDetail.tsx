import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { WHATSAPP_NUMBER } from "@/config/site";
import type { Project } from "@/content/schema";

/**
 * The full project case study.
 *
 * Pure presentation: it receives a Project and renders it. It does not fetch,
 * parse, or validate anything, and it does not know that projects live in
 * Markdown files. Copy blocks are omitted when a project has no value for them,
 * so an empty field never renders a stray heading.
 */
interface ProjectDetailProps {
  project: Project;
}

const whatsAppLink = (project: Project) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I saw your ${project.title} project.\n\nI want something similar.`,
  )}`;

/** Renders the optional Markdown body as plain paragraphs. */
const BodyText = ({ body }: { body: string }) => (
  <div className="mt-10 space-y-4 text-sm leading-relaxed">
    {body
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((paragraph, index) => (
        <p key={index} className="whitespace-pre-line">
          {paragraph}
        </p>
      ))}
  </div>
);

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const copyBlocks: Array<{ label: string; value?: string; accent?: boolean }> = [
    { label: "Context", value: project.context },
    { label: "Problem", value: project.problem },
    { label: "What I Built", value: project.built },
    { label: "Outcome", value: project.result, accent: true },
  ];

  const visibleBlocks = copyBlocks.filter((block) => Boolean(block.value));

  return (
    <div className="container max-w-3xl">
      <Link
        to="/#work"
        className="flex items-center gap-2 text-sm mb-6 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to projects
      </Link>

      {project.status !== "published" && (
        <p className="mb-6 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {project.status === "draft" ? "Draft" : "Archived"}
          </span>{" "}
          - visible only while running locally. This page does not exist on the live site.
        </p>
      )}

      <h1 className="text-2xl md:text-3xl font-bold mb-2">{project.title}</h1>
      <p className="text-primary mb-6">{project.category}</p>

      <div className="aspect-[16/10] rounded-lg overflow-hidden mb-6">
        <img
          src={project.coverImageUrl}
          alt={`${project.title} - ${project.category}`}
          className="w-full h-full object-cover"
        />
      </div>

      <p className="text-lg mb-6">{project.summary}</p>

      {visibleBlocks.length > 0 && (
        <div className="space-y-6 text-sm">
          {visibleBlocks.map((block) => (
            <div key={block.label}>
              <h3
                className={
                  block.accent
                    ? "font-semibold text-primary"
                    : "font-semibold text-muted-foreground"
                }
              >
                {block.label}
              </h3>
              <p>{block.value}</p>
            </div>
          ))}
        </div>
      )}

      {project.body && <BodyText body={project.body} />}

      {project.galleryUrls.length > 0 && (
        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {project.galleryUrls.map((url, index) => (
            <div key={url} className="rounded-lg overflow-hidden border">
              <img
                src={url}
                alt={`${project.title} - screenshot ${index + 1}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 space-y-3">
        {project.liveUrl && (
          <Button className="w-full" asChild>
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live Project
            </a>
          </Button>
        )}
        {project.sourceUrl && (
          <Button variant="outline" className="w-full" asChild>
            <a href={project.sourceUrl} target="_blank" rel="noreferrer">
              <Github className="w-4 h-4 mr-2" />
              View Source
            </a>
          </Button>
        )}
        <Button variant="outline" className="w-full" asChild>
          <a href={whatsAppLink(project)} target="_blank" rel="noreferrer">
            I Want Something Like This
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ProjectDetail;
