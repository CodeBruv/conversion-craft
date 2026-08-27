import {
  PanelsTopLeft,
  Database,
  Gauge,
  Accessibility,
  GitBranch,
  Server,
} from "lucide-react";

const capabilities = [
  {
    icon: PanelsTopLeft,
    title: "Product Interfaces",
    desc: "Responsive interfaces built with React, Next.js, and TypeScript, with careful attention to layout, interaction, and application state.",
  },
  {
    icon: Database,
    title: "Data & API Integration",
    desc: "Connect frontend experiences to APIs and databases while handling loading, error, empty, and edge states cleanly.",
  },
  {
    icon: Gauge,
    title: "Performance",
    desc: "Identify unnecessary JavaScript, rendering costs, layout shifts, and other issues that affect real-world page performance.",
  },
  {
    icon: Accessibility,
    title: "Accessibility",
    desc: "Semantic, keyboard-friendly interfaces with accessibility considered as part of implementation rather than an afterthought.",
  },
  {
    icon: GitBranch,
    title: "Testing & Debugging",
    desc: "Use automated testing, browser tooling, and systematic debugging to find regressions and resolve problems across development and production.",
  },
  {
    icon: Server,
    title: "Full-Stack Understanding",
    desc: "Frontend-focused development backed by practical experience with Node.js, PostgreSQL, authentication, server actions, and deployment.",
  },
];

const Services = () => (
  <section className="py-20 md:py-28 bg-background">
    <div className="container max-w-5xl">
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
        What I Build
      </p>

      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        Frontend work with the product behind the interface in mind.
      </h2>

      <p className="text-muted-foreground max-w-2xl mb-12 leading-relaxed">
        I focus on building web experiences that are responsive, maintainable,
        accessible, and connected to real application logic — not just pages
        that look good in a screenshot.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {capabilities.map((item) => (
          <div
            key={item.title}
            className="group text-left p-5 rounded-xl border border-border hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <item.icon className="w-5 h-5 text-primary" />
            </div>

            <h3 className="text-base font-bold text-foreground mb-2">
              {item.title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;