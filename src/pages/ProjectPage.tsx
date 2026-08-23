import { useParams } from "react-router-dom";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProjectDetail from "@/components/ProjectDetail";
import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from "@/config/site";
import { getBySlug } from "@/content/loader";
import { projectPath, resolveSeoDescription, resolveSeoTitle } from "@/content/schema";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import NotFound from "@/pages/NotFound";

/**
 * The /projects/:slug route.
 *
 * Resolution rules come from the loader: in production only published projects
 * exist, so a draft or unknown slug renders the normal 404 page. In development
 * drafts resolve too, which is what makes previewing before publishing work on
 * the project's real URL.
 */
const ProjectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getBySlug(slug) : undefined;

  if (!project) return <NotFound />;

  return <ProjectPageContent project={project} />;
};

/**
 * Split out so the meta hook is only mounted for a project that actually exists
 * (hooks cannot run conditionally).
 */
const ProjectPageContent = ({ project }: { project: NonNullable<ReturnType<typeof getBySlug>> }) => {
  useDocumentMeta({
    title: `${resolveSeoTitle(project)} - ${SITE_NAME}`,
    description: resolveSeoDescription(project),
    image: absoluteUrl(project.coverImageUrl || DEFAULT_OG_IMAGE),
    url: absoluteUrl(projectPath(project.slug)),
    type: "article",
  });

  return (
    <main>
      <Navbar />
      <section className="min-h-screen bg-background pt-28 pb-16">
        <ProjectDetail project={project} />
      </section>
      <Footer />
    </main>
  );
};

export default ProjectPage;
