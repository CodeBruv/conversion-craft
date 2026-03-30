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
    title: "Discovery",
    desc: "We define your goal, your audience, and what the website needs to achieve.",
  },
  {
    icon: LayoutDashboard,
    title: "Structure",
    desc: "I map a clean layout focused on clarity, flow, and conversion.",
  },
  {
    icon: Code2,
    title: "Build",
    desc: "Fast, responsive development with performance as a priority.",
  },
  {
    icon: SlidersHorizontal,
    title: "Refine",
    desc: "Testing across devices, improving speed, tightening the experience.",
  },
  {
    icon: CheckCircle2,
    title: "Launch",
    desc: "You get a polished site that’s ready to perform from day one.",
  },
];

const Process = () => (
  <section className="py-20 md:py-28 bg-surface">
    <div className="container max-w-4xl">
      
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
        How Projects Actually Get Done
      </p>

      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        Clear process. Fast execution. No back and forth.
      </h2>

      <p className="text-muted-foreground max-w-2xl mb-12">
        You’re not guessing what happens next. Each step is structured so your project
        moves forward smoothly without delays or confusion.
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