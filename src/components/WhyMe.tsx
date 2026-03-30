import {
  Timer,
  Braces,
  Smartphone,
  Activity,
  MessageCircle,
} from "lucide-react";

const points = [
  {
    icon: Timer,
    title: "Fast Turnaround",
    desc: "Most projects are completed within 3–7 days without sacrificing quality.",
  },
  {
    icon: Braces,
    title: "Clean Builds",
    desc: "Well-structured code that’s easy to maintain and expand later.",
  },
  {
    icon: Smartphone,
    title: "Responsive by Default",
    desc: "Your site works smoothly across mobile, tablet, and desktop.",
  },
  {
    icon: Activity,
    title: "Performance First",
    desc: "Built to load fast and pass key performance benchmarks.",
  },
  {
    icon: MessageCircle,
    title: "Clear Communication",
    desc: "You always know what’s happening and what comes next.",
  },
];

const WhyMe = () => (
  <section className="py-20 md:py-28 bg-background">
    <div className="container max-w-4xl">
      
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
        Why This Works
      </p>

      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        You don’t just get a website. You get clarity.
      </h2>

      <p className="text-muted-foreground max-w-2xl mb-10">
        Most websites fail because they’re slow, unclear, or trying to do too much.
        I focus on keeping things simple, fast, and structured so your visitors know exactly what to do.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {points.map((p) => (
          <div
            key={p.title}
            className="group bg-surface rounded-xl p-5 border border-border hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:scale-105 transition">
                <p.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                {p.title}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyMe;