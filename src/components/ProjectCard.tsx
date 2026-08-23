import { Link } from "react-router-dom";

import { projectPath, type Project } from "@/content/schema";

/**
 * A single project tile in the work grid.
 *
 * Pure presentation: it receives a Project and knows nothing about where that
 * project came from. Markup and Tailwind classes match the previous inline grid
 * card exactly, with the clickable wrapper changed from a div to a Link so each
 * project now has a real, shareable URL.
 */
interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => (
  <Link
    to={projectPath(project.slug)}
    className="block cursor-pointer bg-background border rounded-xl overflow-hidden hover:shadow-lg transition group"
  >
    <img
      src={project.coverImageUrl}
      alt={`${project.title} - ${project.category}`}
      loading="lazy"
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h3 className="font-bold mb-1 group-hover:text-primary transition">{project.title}</h3>
      <p className="text-sm text-muted-foreground">{project.category}</p>
    </div>
  </Link>
);

export default ProjectCard;
