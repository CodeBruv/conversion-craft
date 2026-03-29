import { Clock, Code, Smartphone, Gauge, MessageSquare } from "lucide-react";

const points = [
  { icon: Clock, text: "Fast delivery (3–7 days typical)" },
  { icon: Code, text: "Clean, maintainable builds" },
  { icon: Smartphone, text: "Fully responsive" },
  { icon: Gauge, text: "Strong performance foundation" },
  { icon: MessageSquare, text: "Clear communication" },
];

const WhyMe = () => (
  <section className="py-20 md:py-28 bg-background">
    <div className="container max-w-4xl">
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Why Clients Work With Me</p>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">
        No fluff. Just execution.
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {points.map((p) => (
          <div key={p.text} className="flex items-center gap-3 bg-surface rounded-lg p-4">
            <p.icon className="w-5 h-5 text-primary shrink-0" />
            <span className="text-sm font-medium text-foreground">{p.text}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyMe;
