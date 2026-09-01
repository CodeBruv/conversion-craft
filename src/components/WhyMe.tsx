import {
  Lightbulb,
  Layers3,
  Smartphone,
  Gauge,
  Bug,
  MessageCircle,
} from "lucide-react";

const points = [
  {
    icon: Lightbulb,
    title: "Start With the Problem",
    desc: "I don't begin by choosing a technology. I first try to understand what needs to happen, who it affects, and what a successful solution should look like.",
  },
  {
    icon: Layers3,
    title: "Think Beyond the Screen",
    desc: "A good interface is only part of a product. I think through the flows, data, states, edge cases, and systems that need to work behind it.",
  },
  {
    icon: Smartphone,
    title: "Build for Real Use",
    desc: "I design and build experiences that hold up across devices and real-world usage, not just polished screens that look good in a demo.",
  },
  {
    icon: Gauge,
    title: "Care About the Details",
    desc: "Performance, accessibility, responsiveness, loading states, and the small interactions that make software feel reliable all matter to me.",
  },
  {
    icon: Bug,
    title: "Investigate, Don't Guess",
    desc: "When something isn't working, I break the problem down, trace the cause, test assumptions, and verify the fix rather than patching symptoms.",
  },
  {
    icon: MessageCircle,
    title: "Communicate Clearly",
    desc: "I can work through unclear requirements, explain technical decisions in plain language, and keep people informed as the work moves forward.",
  },
];

const WhyMe = () => (
  <section className="py-20 md:py-28 bg-background">
    <div className="container max-w-5xl">
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
        How I Work
      </p>

      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        I care about solving the right problem, not just building the thing.
      </h2>

      <p className="text-muted-foreground max-w-2xl mb-10 leading-relaxed">
        Good software starts with understanding. I like taking an unclear
        problem, working out what actually needs to happen, and then turning
        that understanding into something useful, reliable, and built to last.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {points.map((point) => (
          <div
            key={point.title}
            className="group bg-surface rounded-xl p-5 border border-border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <point.icon className="w-4 h-4 text-primary" />
              </div>

              <span className="text-sm font-semibold text-foreground">
                {point.title}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {point.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyMe;