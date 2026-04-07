import {
  Compass,
  LayoutDashboard,
  Code2,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    icon: Compass,
    title: "Define",
    desc: "We get clear on your goal, your audience, and what the site needs to achieve.",
  },
  {
    icon: LayoutDashboard,
    title: "Structure",
    desc: "I map a layout that’s simple, clear, and built to guide action.",
  },
  {
    icon: Code2,
    title: "Build",
    desc: "Fast, responsive development with performance and usability in mind.",
  },
  {
    icon: SlidersHorizontal,
    title: "Refine",
    desc: "We test, adjust, and tighten everything so it feels smooth and intentional.",
  },
  {
    icon: CheckCircle2,
    title: "Launch",
    desc: "You get a polished site that’s ready to go live and start working.",
  },
];

const Process = () => (
  <section className="py-20 md:py-28 bg-surface">
    <div className="container max-w-4xl">
      
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
        Simple Process
      </p>

      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        Clear steps. Fast turnaround. No confusion.
      </h2>

      <p className="text-muted-foreground max-w-2xl mb-12">
        You always know what’s happening next. The process is structured to keep things moving 
        without delays, overthinking, or endless revisions.
      </p>

      <div className="grid md:grid-cols-5 gap-6">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="group p-4 rounded-xl border border-border hover:shadow-sm transition"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                <step.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary">
                {i + 1}.
              </span>
            </div>

            <h3 className="text-sm font-semibold text-foreground mb-1">
              {step.title}
            </h3>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Process;
