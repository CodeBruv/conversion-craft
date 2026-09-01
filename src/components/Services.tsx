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
    title: "Web Applications",
    desc: "Modern, responsive applications built with React, Next.js, and TypeScript, from interfaces and user flows to application state and interactions.",
  },
  {
    icon: Database,
    title: "Data & Integrations",
    desc: "Connect products to APIs, databases, authentication, and external services while handling real-world loading, error, empty, and edge states.",
  },
  {
    icon: Gauge,
    title: "Performance",
    desc: "Build and improve experiences with attention to rendering, JavaScript execution, Core Web Vitals, resource usage, and perceived speed.",
  },
  {
    icon: Accessibility,
    title: "Accessible Experiences",
    desc: "Semantic, keyboard-friendly interfaces designed to remain usable across different devices, abilities, and ways of interacting with the web.",
  },
  {
    icon: GitBranch,
    title: "Testing & Reliability",
    desc: "Use automated tests, browser tooling, and systematic debugging to catch regressions, investigate problems, and make changes with confidence.",
  },
  {
    icon: Server,
    title: "End-to-End Understanding",
    desc: "Frontend-focused engineering backed by practical experience with Node.js, PostgreSQL, authentication, server actions, and deployment.",
  },
];

const Services = () => (
  <section className="py-20 md:py-28 bg-background">
    <div className="container max-w-5xl">
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
        Technical Capabilities
      </p>

      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        Strong frontend engineering, with enough depth to understand the whole product.
      </h2>

      <p className="text-muted-foreground max-w-2xl mb-12 leading-relaxed">
        My strongest area is frontend engineering, but I work with an
        understanding of the systems around the interface. That lets me build
        features with the data, APIs, performance, reliability, and deployment
        concerns in mind.
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