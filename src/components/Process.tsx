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
    desc: "Clarify the goal, the people using the product, what needs to happen, and the constraints before writing code.",
  },
  {
    icon: Component,
    title: "Shape",
    desc: "Turn the problem into clear user flows, interfaces, components, states, and interactions that make sense together.",
  },
  {
    icon: GitBranch,
    title: "Build",
    desc: "Implement the solution with maintainable code, responsive behavior, real application logic, and the integrations it needs.",
  },
  {
    icon: TestTube2,
    title: "Refine",
    desc: "Test important paths, investigate problems, and improve usability, accessibility, performance, and reliability.",
  },
  {
    icon: Rocket,
    title: "Ship",
    desc: "Put the product in the hands of real users, verify that it works as intended, and keep improving from there.",
  },
];

const Process = () => (
  <section className="py-20 md:py-28 bg-surface">
    <div className="container max-w-5xl">
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
        My Process
      </p>

      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        From a problem worth solving to something people can use.
      </h2>

      <p className="text-muted-foreground max-w-2xl mb-12 leading-relaxed">
        I keep the process practical: understand what matters, shape the right
        solution, build it carefully, test it in real conditions, and ship it.
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