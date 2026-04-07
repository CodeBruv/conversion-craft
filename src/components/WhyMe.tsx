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
    desc: "Most projects go live within 3–7 days without dragging things out.",
  },
  {
    icon: Braces,
    title: "Clean, Scalable Code",
    desc: "Built properly from the start so you’re not stuck fixing things later.",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    desc: "Your site looks and feels right on mobile, tablet, and desktop.",
  },
  {
    icon: Activity,
    title: "Built for Performance",
    desc: "Fast load times, smooth interaction, and strong technical foundation.",
  },
  {
    icon: MessageCircle,
    title: "No Confusion",
    desc: "Clear communication, clear direction, and no unnecessary back and forth.",
  },
];

const WhyMe = () => (
  <section className="py-20 md:py-28 bg-background">
    <div className="container max-w-4xl">
      
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
        Why Work With Me
      </p>

      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        This is built to be simple, fast, and actually useful.
      </h2>

      <p className="text-muted-foreground max-w-2xl mb-10">
        Most websites look fine but don’t do anything. They’re slow, unclear, or overloaded.
        I keep things focused so your visitors understand quickly and take action without hesitation.
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
