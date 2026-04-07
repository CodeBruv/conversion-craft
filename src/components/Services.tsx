import { MousePointerClick, Layers3, Rocket } from "lucide-react";

const services = [
  {
    icon: MousePointerClick,
    title: "Landing Pages",
    desc: "Built to guide visitors from first click to action. Clear messaging, strong structure, and zero guesswork.",
  },
  {
    icon: Layers3,
    title: "Portfolio Websites",
    desc: "Turn your work into something people instantly understand, trust, and want to hire.",
  },
  {
    icon: Rocket,
    title: "Performance Optimization",
    desc: "Fast, lightweight builds that load instantly, feel smooth, and perform well across devices and search.",
  },
];

const Services = () => (
  <section className="py-20 md:py-28 bg-background">
    <div className="container max-w-4xl">
      
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
        What You Actually Get
      </p>

      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        Websites that don’t just sit there, they guide people and bring in clients.
      </h2>

      <p className="text-muted-foreground max-w-2xl mb-12">
        Every project is built with a clear goal: make your business look credible, 
        communicate fast, and move visitors toward taking action without confusion.
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
