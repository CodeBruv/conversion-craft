import { useState, useRef } from "react";
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
hook: "Built to remove hesitation and make property inquiries feel easy and natural",
problem: "Listings were scattered and didn’t build enough trust to convert visitors into inquiries",
built: "A structured landing page that presents properties clearly and guides users step-by-step toward contacting the business",
context: "Real estate company based in Birmingham, England",
result: "Stronger trust, clearer navigation, and more confident inquiry flow",
liveUrl: "https://elbi-homes.netlify.app/",
},
{
name: "SprintFlow",
type: "SaaS Landing Page",
image: sprintflowImg,
hook: "Designed to make the product clear within seconds of landing",
problem: "Users were confused by too many features and unclear messaging",
built: "A simplified SaaS landing page with focused sections, clean hierarchy, and clear product explanation",
context: "Remote team collaboration tool",
result: "Better clarity and smoother path toward signup decisions",
liveUrl: "https://sprint-flow.netlify.app/",
},
{
name: "Daniel Reed",
type: "Personal Brand Landing Page",
image: danielImg,
hook: "Focused on turning attention into action instead of passive scrolling",
problem: "Visitors had no clear next step, leading to lost leads",
built: "A direct, conversion-focused page with strong positioning and a single clear call-to-action",
context: "Productivity coach",
result: "Stronger lead capture flow and clearer user direction",
liveUrl: "https://reed-s-focus-system.netlify.app/",
},
{
name: "GrowthForge",
type: "Agency Website",
image: growthforgeImg,
hook: "Positioned to feel credible and performance-driven from the first scroll",
problem: "Weak positioning made the agency blend in with competitors",
built: "A structured website that clearly communicates services, authority, and outcomes",
context: "Digital marketing agency",
result: "More confident brand presence and stronger perceived value",
liveUrl: "https://growthforge-agency.netlify.app/",
},
{
name: "Ava Thompson",
type: "UX Portfolio Website",
image: avaImg,
hook: "Designed to make case studies easy to understand and evaluate quickly",
problem: "Work felt scattered and lacked clear storytelling",
built: "A clean, structured portfolio focused on clarity, hierarchy, and flow",
context: "UX designer",
result: "More professional presentation and easier decision-making for recruiters",
liveUrl: "https://ava-thompson.netlify.app/",
},
{
  name: "CookedByJulz",
  type: "Content Brand Landing Page",
  image: cookedImg,
  hook: "Designed to turn scattered ideas into a clear and structured content direction",
  problem: "Content lacked consistency and didn’t communicate a strong, focused message",
  built: "A clean landing page that organizes the brand’s message, content approach, and direction into a simple, easy-to-follow flow",
  context: "Personal content brand",
  result: "Stronger positioning and a clearer foundation for consistent content creation",
  liveUrl: "http://cookedbyjulz.com.ng/",
}
];

type Project = (typeof projects)[number];

const Projects = () => {
const [selected, setSelected] = useState<Project | null>(null);
const scrollPosition = useRef(0);

const getWhatsAppLink = (project: Project) => {
return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
`Hi, I saw your ${project.name} project.\n\nI want something similar.`
)}`;
};

if (selected) {
return (
<section className="min-h-screen bg-background py-16">
<div className="container max-w-3xl">

<button  
        onClick={() => {  
          setSelected(null);  
          setTimeout(() => {  
            window.scrollTo({  
              top: scrollPosition.current,  
              behavior: "instant",  
            });  
          }, 0);  
        }}  
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

      <div className="space-y-6 text-sm">  
        <div>  
          <h3 className="font-semibold text-muted-foreground">Context</h3>  
          <p>{selected.context}</p>  
        </div>  

        <div>  
          <h3 className="font-semibold text-muted-foreground">Problem</h3>  
          <p>{selected.problem}</p>  
        </div>  

        <div>  
          <h3 className="font-semibold text-muted-foreground">What I Built</h3>  
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
            I Want Something Like This  
          </a>  
        </Button>  
      </div>  
    </div>  
  </section>  
);

}

return (
<section id="work" className="py-20 md:py-28 bg-surface">
<div className="container max-w-6xl">

<h2 className="text-2xl md:text-3xl font-bold mb-4">  
      Selected Work, Including Concept Builds.  
    </h2>  

    <p className="text-muted-foreground max-w-2xl mb-12">  
      Each project is designed with the goal to make it easy for visitors to understand, trust, and take action.  
    </p>  

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">  
      {projects.map((p) => (  
        <div  
          key={p.name}  
          onClick={() => {  
            scrollPosition.current = window.scrollY;  
            setSelected(p);  
          }}  
          className="cursor-pointer bg-background border rounded-xl overflow-hidden hover:shadow-lg transition group"  
        >  
          <img src={p.image} className="w-full h-48 object-cover" />  
           
          <div className="p-4">  
            <h3 className="font-bold mb-1 group-hover:text-primary transition">  
              {p.name}  
            </h3>  
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