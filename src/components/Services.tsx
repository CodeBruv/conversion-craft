import { Zap, Layout, Gauge } from "lucide-react";

const services = [
  {
    icon: Layout,
    title: "Landing Pages",
    desc: "Built to convert traffic into leads",
  },
  {
    icon: Zap,
    title: "Portfolio Websites",
    desc: "Clean, professional presentation",
  },
  {
    icon: Gauge,
    title: "Performance Optimization",
    desc: "Fast, lightweight builds",
  },
];

const Services = () => (
  <section className="py-20 md:py-28 bg-background">
    <div className="container max-w-4xl">
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">What I Do</p>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-12">
        Focused on what moves the needle.
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {services.map((s) => (
          <div key={s.title} className="text-center md:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
              <s.icon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
            <p className="text-muted-foreground text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
