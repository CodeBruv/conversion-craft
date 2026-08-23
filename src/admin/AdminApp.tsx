import { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { ExternalLink, FileText, Pencil, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { checkWriter } from "@/admin/api";
import ProjectEditor from "@/admin/ProjectEditor";
import { getAllProjects } from "@/content/loader";
import { projectPath, type Project, type ProjectStatus } from "@/content/schema";

/**
 * The local content editor.
 *
 * Development only, in two independent ways: App.tsx puts this route behind
 * import.meta.env.DEV, and vite.config.ts replaces this module with a stub in
 * production builds. It has no login because it is not reachable from anywhere
 * except this machine while the dev server is running.
 */

const STATUS_STYLES: Record<ProjectStatus, string> = {
  published: "bg-primary/10 text-primary border-primary/20",
  draft: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  archived: "bg-muted text-muted-foreground",
};

const StatusBadge = ({ status }: { status: ProjectStatus }) => (
  <Badge variant="outline" className={STATUS_STYLES[status]}>
    {status}
  </Badge>
);

/** Tells the user immediately if the dev writer is not answering. */
const WriterStatus = () => {
  const [state, setState] = useState<"checking" | "ready" | "offline">("checking");

  useEffect(() => {
    let active = true;
    checkWriter()
      .then(() => active && setState("ready"))
      .catch(() => active && setState("offline"));
    return () => {
      active = false;
    };
  }, []);

  if (state === "checking") return null;

  return state === "ready" ? (
    <p className="text-xs text-muted-foreground">
      Writing to <code className="font-mono">src/content/projects</code>
    </p>
  ) : (
    <p className="text-xs text-destructive">
      The local content writer is not responding. Saving will fail until `npm run dev` is restarted.
    </p>
  );
};

const AdminShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-muted/40">
    <header className="border-b bg-background">
      <div className="container max-w-5xl flex items-center justify-between py-4">
        <div>
          <Link to="/admin" className="font-semibold">
            Portfolio content
          </Link>
          <p className="text-xs text-muted-foreground">
            Local editor - development only. Nothing here is part of the live site until you commit and push.
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">View site</Link>
        </Button>
      </div>
    </header>
    <main className="container max-w-5xl py-8">{children}</main>
  </div>
);

const ProjectRow = ({ project }: { project: Project }) => (
  <div className="flex items-center gap-4 border-b py-3 last:border-b-0">
    <img
      src={project.coverImageUrl}
      alt=""
      className="h-12 w-20 rounded object-cover border bg-background"
    />
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <p className="truncate font-medium">{project.title}</p>
        <StatusBadge status={project.status} />
        {project.featured && (
          <Badge variant="outline" className="border-primary/20 text-primary">
            featured
          </Badge>
        )}
      </div>
      <p className="truncate text-xs text-muted-foreground">
        {project.category} - /projects/{project.slug}
      </p>
    </div>
    <Button variant="ghost" size="sm" asChild>
      <Link to={projectPath(project.slug)} target="_blank">
        <ExternalLink className="mr-1 h-3.5 w-3.5" />
        Preview
      </Link>
    </Button>
    <Button variant="outline" size="sm" asChild>
      <Link to={`/admin/edit/${project.slug}`}>
        <Pencil className="mr-1 h-3.5 w-3.5" />
        Edit
      </Link>
    </Button>
  </div>
);

const ProjectList = () => {
  const projects = getAllProjects();
  const counts = projects.reduce<Record<string, number>>((totals, project) => {
    totals[project.status] = (totals[project.status] ?? 0) + 1;
    return totals;
  }, {});

  return (
    <>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground">
            {projects.length} content {projects.length === 1 ? "file" : "files"}
            {" - "}
            {counts.published ?? 0} published, {counts.draft ?? 0} draft, {counts.archived ?? 0} archived
          </p>
          <WriterStatus />
        </div>
        <Button asChild>
          <Link to="/admin/new">
            <Plus className="mr-1 h-4 w-4" />
            New project
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-background px-4">
        {projects.length === 0 ? (
          <p className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            No project files yet. Create the first one.
          </p>
        ) : (
          projects.map((project) => <ProjectRow key={project.slug} project={project} />)
        )}
      </div>
    </>
  );
};

/** Redirects /admin/anything-else back to the list. */
const AdminNotFound = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/admin", { replace: true });
  }, [navigate]);
  return null;
};

const AdminApp = () => (
  <AdminShell>
    <Routes>
      <Route index element={<ProjectList />} />
      <Route path="new" element={<ProjectEditor />} />
      <Route path="edit/:slug" element={<ProjectEditor />} />
      <Route path="*" element={<AdminNotFound />} />
    </Routes>
  </AdminShell>
);

export default AdminApp;
