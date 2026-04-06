import { useState } from "react";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import elbiImg from "@/assets/projects/elbi-homes.png";
import sprintflowImg from "@/assets/projects/sprintflow.png";
import danielImg from "@/assets/projects/daniel-reed.png";
import growthforgeImg from "@/assets/projects/growthforge.png";
import avaImg from "@/assets/projects/ava-thompson.png";
import cookedImg from "@/assets/projects/cookedbyjulz.png";

const WHATSAPP_NUMBER = "+2348142971640";

const projects = [
  {
    name: "Elbi Homes",
    type: "Real Estate Landing Page",
    image: elbiImg,
    hook: "Designed to help property buyers trust faster and make inquiries easily",
    problem: "Needed a clean page to present properties and build buyer trust",
    built: "Modern landing page focused on clarity and property visibility",
    context: "Real estate company based in Birmingham, England",
    result: "Improved presentation and clearer user flow for inquiries",
    liveUrl: "https://elbi-homes.netlify.app/",
  },
  {
    name: "SprintFlow",
    type: "SaaS Landing Page",
    image: sprintflowImg,
    hook: "Structured to explain the product clearly without overwhelming users",
    problem: "Product page confused visitors, features weren't clear",
    built: "Fast SaaS page with clear messaging and feature breakdown",
    context: "Remote team collaboration tool",
    result: "Better product understanding and improved signup flow",
    liveUrl: "https://sprint-flow.netlify.app/",
  },
  {
    name: "Daniel Reed",
    type: "Personal Brand Landing Page",
    image: danielImg,
    hook: "Focused on turning visitors into leads with clear messaging",
    problem: "No clear lead capture, visitors bounced",
    built: "Focused landing page with strong CTA",
    context: "Productivity coach",
    result: "Improved lead capture and clarity",
    liveUrl: "https://reed-s-focus-system.netlify.app/",
  },
  {
    name: "GrowthForge",
    type: "Agency Website",
    image: growthforgeImg,
    hook: "Positioned the agency as performance-driven",
    problem: "Weak positioning and trust",
    built: "Professional multi-section site",
    context: "Digital marketing agency",
    result: "Stronger credibility and trust",
    liveUrl: "https://growthforge-agency.netlify.app/",
  },
  {
    name: "Ava Thompson",
    type: "UX Portfolio Website",
    image: avaImg,
    hook: "Structured UX case studies clearly",
    problem: "Portfolio lacked structure",
    built: "Clean case study-focused portfolio",
    context: "UX designer",
    result: "Improved presentation and professionalism",
    liveUrl: "#",
  },
  {
    name: "CookedByJulz",
    type: "Landing Page + Digital Products",
    image: cookedImg,
    hook: "Simplified product discovery and buying",
    problem: "Confusing product flow",
    built: "Structured landing page with product system",
    context: "Content brand",
    result: "Clearer product positioning and flow",
    liveUrl: "http://cookedbyjulz.com.ng/",
  },
];

type Project = (typeof projects)[number];

const Projects = () => {
  const [selected, setSelected] = useState<Project | null>(null);

  const getWhatsAppLink = (project: Project) => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `Hi, I saw your ${project.name} project.\n\nI want something similar.`
    )}`;
  };

  // ✅ CASE STUDY VIEW
  if (selected) {
    return (
      <section className="min-h-screen bg-background py-16">
        <div className="container max-w-3xl">

          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-2 text-sm mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to projects
          </button>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {selected.name}
          </h1>

          <p className="text-primary mb-6">{selected.type}</p>

          <div className="aspect-[16/10] rounded-lg overflow-hidden mb-6">
            <img src={selected.image} className="w-full h-full object-cover" />
          </div>

          <p className="text-lg mb-6">{selected.hook}</p>

          <div className="space-y-5 text-sm">
            <div>
              <h3 className="font-semibold text-muted-foreground">Context</h3>
              <p>{selected.context}</p>
            </div>

            <div>
              <h3 className="font-semibold text-muted-foreground">Problem</h3>
              <p>{selected.problem}</p>
            </div>

            <div>
              <h3 className="font-semibold text-muted-foreground">Solution</h3>
              <p>{selected.built}</p>
            </div>

            <div>
              <h3 className="font-semibold text-primary">Outcome</h3>
              <p>{selected.result}</p>
            </div>
          </div>

          <div className="mt-10 space-y-3">
            <Button className="w-full" asChild>
              <a href={selected.liveUrl} target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live Project
              </a>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <a href={getWhatsAppLink(selected)} target="_blank">
                Build Something Like This
              </a>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // ✅ GRID VIEW
  return (
    <section id="work" className="py-20 md:py-28 bg-surface">
      <div className="container max-w-6xl">

        <h2 className="text-2xl md:text-3xl font-bold mb-12">
          Selected Projects
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.name}
              onClick={() => setSelected(p)}
              className="cursor-pointer bg-background border rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <img src={p.image} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;