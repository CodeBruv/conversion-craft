import { MousePointerClick, Layers3, Rocket } from "lucide-react";

const services = [
  {
    icon: MousePointerClick,
    title: "Landing Pages",
    desc: "Structured to guide visitors from first impression to action; clear messaging, fast load, and zero confusion.",
  },
  {
    icon: Layers3,
    title: "Portfolio Websites",
    desc: "Designed to make your work easy to understand, easy to trust, and easy to say yes to.",
  },
  {
    icon: Rocket,
    title: "Performance Optimization",
    desc: "Lightweight builds that load instantly, feel smooth, and score strong across performance and SEO.",
  },
];

const Services = () => (
  <section className="py-20 md:py-28 bg-background">
    <div className="container max-w-4xl">
      
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
        What I Actually Help You Do
      </p>

      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        I build not just websites, but systems that bring in clients.
      </h2>

      <p className="text-muted-foreground max-w-2xl mb-12">
        Every build is focused on one thing: making sure your website looks credible,
        communicates clearly, and pushes visitors toward taking action.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {services.map((s) => (
          <div
            key={s.title}
            className="group text-left p-5 rounded-xl border border-border hover:shadow-md transition"
          >
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <s.icon className="w-5 h-5 text-primary" />
            </div>

            <h3 className="text-lg font-bold text-foreground mb-2">
              {s.title}
            </h3>

            <p className="text-muted-foreground text-sm leading-relaxed">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;