import ProjectCard from "@/components/ProjectCard";
import { getAllPublished } from "@/content/loader";

const Projects = () => {
  const projects = getAllPublished();

  return (
    <section id="work" className="py-20 md:py-28 bg-surface">
      <div className="container max-w-6xl">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
          Selected Work
        </p>

        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Things I’ve built to solve real problems.
        </h2>

        <p className="text-muted-foreground max-w-2xl mb-12 leading-relaxed">
          From publicly launched products to work exploring a particular
          problem or experience, each project shows how I think through a
          problem, make product decisions, and turn ideas into working software.
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