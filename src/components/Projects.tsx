import {
  Search,
  Component,
  GitBranch,
  TestTube2,
  Rocket,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Understand",
    desc: "Start with the product goal, user needs, existing requirements, and technical constraints.",
  },
  {
    icon: Component,
    title: "Structure",
    desc: "Break the interface into reusable components and define the states and interactions the product needs.",
  },
  {
    icon: GitBranch,
    title: "Build",
    desc: "Implement responsive, maintainable interfaces and connect them to the required application logic and APIs.",
  },
  {
    icon: TestTube2,
    title: "Test & Refine",
    desc: "Test behavior across devices and states, investigate issues, and refine accessibility, performance, and usability.",
  },
  {
    icon: Rocket,
    title: "Ship",
    desc: "Deploy the application, verify the production environment, and continue improving it based on real usage.",
  },
];

const Process = () => (
  <section className="py-20 md:py-28 bg-surface">
    <div className="container max-w-5xl">
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
        How I Work
      </p>

      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        Understand the problem. Build carefully. Ship and improve.
      </h2>

      <p className="text-muted-foreground max-w-2xl mb-12 leading-relaxed">
        I prefer a practical development process: understand what needs to be
        built, keep the implementation clear, test the important states, and
        improve the product based on what actually happens in use.
      </p>

      <div className="grid md:grid-cols-5 gap-6">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="group p-4 rounded-xl border border-border hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                <step.icon className="w-4 h-4 text-primary" />
              </div>

              <span className="text-xs font-semibold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-foreground mb-2">
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