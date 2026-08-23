import ProjectCard from "@/components/ProjectCard";
import { getAllPublished } from "@/content/loader";

/**
 * The work grid.
 *
 * This file used to be the project database. It is now integration code: it asks
 * the content loader for published projects and hands each one to ProjectCard.
 * Adding a project means adding a content file, never editing this component.
 *
 * Only published projects are listed, in development as well as production, so
 * the local homepage always matches the live one. Drafts are reached from /admin
 * or by their own URL while running locally.
 */
const Projects = () => {
  const projects = getAllPublished();

  return (
    <section id="work" className="py-20 md:py-28 bg-surface">
      <div className="container max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Selected Work, Including Concept Builds.
        </h2>

        <p className="text-muted-foreground max-w-2xl mb-12">
          Each project is designed with the goal to make it easy for visitors to understand, trust, and take action.
        </p>

        {projects.length === 0 ? (
          <p className="text-muted-foreground">
            New work is being added here shortly.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
