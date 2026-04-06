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
    hook: "Built to help buyers trust quickly and take action without hesitation",
    problem: "Property listings lacked structure and didn’t build enough trust to drive inquiries",
    built: "A clean, conversion-focused landing page that highlights properties clearly and guides users toward inquiry",
    context: "Real estate company based in Birmingham, England",
    result: "Stronger trust signals and a smoother path from browsing to inquiry",
    liveUrl: "https://elbi-homes.netlify.app/",
  },
  {
    name: "SprintFlow",
    type: "SaaS Landing Page",
    image: sprintflowImg,
    hook: "Designed to explain the product in seconds without overwhelming the user",
    problem: "Visitors struggled to understand the product due to unclear messaging and feature overload",
    built: "A fast, structured SaaS landing page with clear sections, focused messaging, and simplified feature breakdown",
    context: "Remote team collaboration tool",
    result: "Improved clarity, making it easier for users to understand and move toward signup",
    liveUrl: "https://sprint-flow.netlify.app/",
  },
  {
    name: "Daniel Reed",
    type: "Personal Brand Landing Page",
    image: danielImg,
    hook: "Focused on turning attention into action with direct, conversion-driven messaging",
    problem: "The brand lacked a clear path for capturing leads, causing visitors to leave without taking action",
    built: "A focused landing page with strong positioning, clear value, and a single, direct call-to-action",
    context: "Productivity coach",
    result: "Higher clarity and a stronger flow toward lead capture",
    liveUrl: "https://reed-s-focus-system.netlify.app/",
  },
  {
    name: "GrowthForge",
    type: "Agency Website",
    image: growthforgeImg,
    hook: "Positioned the agency as performance-driven and results-focused from first glance",
    problem: "Weak positioning made it hard to build trust or stand out in a competitive market",
    built: "A structured multi-section website that communicates authority, services, and outcomes clearly",
    context: "Digital marketing agency",
    result: "Stronger credibility and a more confident brand presence",
    liveUrl: "https://growthforge-agency.netlify.app/",
  },
  {
    name: "Ava Thompson",
    type: "UX Portfolio Website",
    image: avaImg,
    hook: "Structured to present case studies in a way that feels clear, intentional, and easy to follow",
    problem: "The portfolio lacked structure, making the work feel scattered and harder to evaluate",
    built: "A clean, case study-driven portfolio with clear storytelling and visual hierarchy",
    context: "UX designer",
    result: "More professional presentation and easier understanding of the designer’s process",
    liveUrl: "https://ava-thompson.netlify.app/",
  },
  {
    name: "CookedByJulz",
    type: "Landing Page",
    image: cookedImg,
    hook: "Designed to remove the mental load of content creation through a clear, repeatable system",
    problem: "Content creation felt inconsistent and overwhelming without a clear structure for ideas and execution",
    built: "A personalized content system built on clarity, planning, and repeatability so hooks, topics, and captions are defined once and reused consistently",
    context: "Content brand",
    result: "Clearer product positioning and a structured system that makes content creation easier to maintain",
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