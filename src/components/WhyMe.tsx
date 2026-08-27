import {
  Code2,
  Smartphone,
  Gauge,
  TestTube2,
  Database,
  MessageCircle,
} from "lucide-react";

const points = [
  {
    icon: Code2,
    title: "Product-Focused Development",
    desc: "I build interfaces as part of working products, thinking about application state, user flows, edge cases, and maintainable code.",
  },
  {
    icon: Smartphone,
    title: "Responsive by Default",
    desc: "Interfaces are designed and implemented to work properly across mobile, tablet, and desktop rather than treating mobile as an afterthought.",
  },
  {
    icon: Gauge,
    title: "Performance Mindset",
    desc: "I pay attention to JavaScript execution, rendering, Core Web Vitals, resource usage, and the factors that affect how an application feels.",
  },
  {
    icon: TestTube2,
    title: "Testing & Debugging",
    desc: "I use testing, browser tooling, logs, and systematic investigation to identify problems and verify that fixes actually work.",
  },
  {
    icon: Database,
    title: "Beyond the Frontend",
    desc: "Alongside React and Next.js, I have practical experience with APIs, authentication, PostgreSQL, server-side operations, and deployment.",
  },
  {
    icon: MessageCircle,
    title: "Clear Communication",
    desc: "I can explain technical problems clearly, work through requirements, and communicate progress without unnecessary complexity.",
  },
];

const WhyMe = () => (
  <section className="py-20 md:py-28 bg-background">
    <div className="container max-w-5xl">
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
        What I Bring
      </p>

      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        I care about how the product works, not just how the interface looks.
      </h2>

      <p className="text-muted-foreground max-w-2xl mb-10 leading-relaxed">
        My work sits at the intersection of frontend development, product
        thinking, and practical problem-solving. I enjoy taking an unclear
        problem, understanding what needs to happen, and turning it into a
        working interface.
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