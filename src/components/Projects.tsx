import { useState } from "react";
import { ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import elbiImg from "@/assets/projects/elbi-homes.jpg";
import sprintflowImg from "@/assets/projects/sprintflow.jpg";
import danielImg from "@/assets/projects/daniel-reed.jpg";
import growthforgeImg from "@/assets/projects/growthforge.jpg";
import avaImg from "@/assets/projects/ava-thompson.jpg";
import cookedImg from "@/assets/projects/cookedbyjulz.jpg";

const projects = [
  {
    name: "Elbi Homes",
    type: "Real Estate Landing Page",
    image: elbiImg,
    problem: "Needed a clean page to present properties and build buyer trust",
    built: "Modern landing page focused on clarity and property visibility",
    context: "Real estate company based in Birmingham, England",
    result: "Improved presentation, stronger credibility, and clearer user flow for inquiries",
    liveUrl: "#",
  },
  {
    name: "SprintFlow",
    type: "SaaS Landing Page",
    image: sprintflowImg,
    problem: "Product page confused visitors — features weren't clear",
    built: "Fast, structured SaaS page with clear messaging and feature breakdown",
    context: "Remote team collaboration tool",
    result: "Better product understanding and improved conversion flow for signups",
    liveUrl: "#",
  },
  {
    name: "Daniel Reed",
    type: "Personal Brand Landing Page",
    image: danielImg,
    problem: "No clear lead capture — visitors bounced without converting",
    built: "Focused landing page with strong messaging and clear CTA",
    context: "Productivity coach for freelancers",
    result: "More structured lead capture and improved clarity of offer",
    liveUrl: "#",
  },
  {
    name: "GrowthForge",
    type: "Agency Website",
    image: growthforgeImg,
    problem: "Website didn't position the agency as performance-driven",
    built: "Clean, professional multi-section site focused on services and results",
    context: "Digital marketing agency",
    result: "Stronger brand positioning and improved trust for potential clients",
    liveUrl: "#",
  },
  {
    name: "Ava Thompson",
    type: "UX Portfolio Website",
    image: avaImg,
    problem: "Portfolio lacked structure — case studies were hard to scan",
    built: "Structured portfolio with clean layouts and focused case study sections",
    context: "Mid-level UX designer",
    result: "Better presentation of work and improved professional credibility",
    liveUrl: "#",
  },
  {
    name: "CookedByJulz",
    type: "Landing Page + Digital Products",
    image: cookedImg,
    problem: "Digital products were hard to find and confusing to buy",
    built: "Structured landing page with integrated digital product flow",
    context: "Content brand selling digital products",
    result: "Simplified user journey and clearer product positioning for buyers",
    liveUrl: "#",
  },
];

type Project = (typeof projects)[number];

const ProjectCard = ({
  project,
  onViewDetails,
}: {
  project: Project;
  onViewDetails: () => void;
}) => (
  <div className="group bg-background rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    {/* Thumbnail */}
    <div className="aspect-[16/10] overflow-hidden">
      <img
        src={project.image}
        alt={`${project.name} — ${project.type}`}
        loading="lazy"
        width={960}
        height={600}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>

    {/* Info */}
    <div className="p-5">
      <div className="mb-3">
        <h3 className="text-base font-bold text-foreground">{project.name}</h3>
        <p className="text-xs font-medium text-primary">{project.type}</p>
      </div>

      <div className="space-y-1.5 text-sm text-muted-foreground mb-5">
        <p>
          <span className="font-semibold text-foreground/70">Problem:</span>{" "}
          {project.problem}
        </p>
        <p>
          <span className="font-semibold text-foreground/70">Built:</span>{" "}
          {project.built}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button size="sm" className="flex-1 gap-1.5" asChild>
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-3.5 h-3.5" />
            Live Preview
          </a>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 gap-1.5"
          onClick={onViewDetails}
        >
          <Eye className="w-3.5 h-3.5" />
          View Details
        </Button>
      </div>
    </div>
  </div>
);

const Projects = () => {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="work" className="py-20 md:py-28 bg-surface">
      <div className="container max-w-6xl">
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
          Selected Work
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-12">
          Real projects. Real outcomes.
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard
              key={p.name}
              project={p}
              onViewDetails={() => setSelected(p)}
            />
          ))}
        </div>
      </div>

      {/* Details Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selected.name}</DialogTitle>
                <DialogDescription className="text-primary font-medium">
                  {selected.type}
                </DialogDescription>
              </DialogHeader>

              <div className="aspect-[16/10] rounded-lg overflow-hidden my-2">
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="w-full h-full object-cover"
                  width={960}
                  height={600}
                />
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold text-muted-foreground">Context:</span>
                  <span className="ml-1.5 text-foreground/80">{selected.context}</span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Problem:</span>
                  <span className="ml-1.5 text-foreground/80">{selected.problem}</span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">Built:</span>
                  <span className="ml-1.5 text-foreground/80">{selected.built}</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <span className="font-semibold text-primary">Result:</span>
                  <span className="ml-1.5 text-foreground">{selected.result}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button className="w-full gap-2" asChild>
                  <a href={selected.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    View Live Project
                  </a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Projects;
