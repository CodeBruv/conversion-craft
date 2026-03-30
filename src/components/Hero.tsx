import { ArrowRight } from "lucide-react";

const Hero = () => (
  <section className="bg-secondary text-secondary-foreground min-h-[90vh] flex items-center">
  <div className="container max-w-4xl py-20 md:py-32">
    
    <h1 className="text-3xl md:text-5xl lg:text-6xl font-800 leading-tight tracking-tight mb-8">
      Fast, Conversion-Focused Landing Pages & Portfolio Websites That Turn Visitors Into Clients
    </h1>

    <p className="text-lg md:text-xl text-secondary-foreground/70 max-w-2xl mb-12 leading-relaxed">
      I build clean, fast-loading websites that position your brand clearly and guide visitors toward taking action.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <a
        href="#work"
        className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
      >
        View Live Projects
        <ArrowRight className="w-4 h-4" />
      </a>

      <a
        href="#contact"
        className="inline-flex items-center justify-center gap-2 border border-secondary-foreground/20 text-secondary-foreground px-6 py-3.5 rounded-lg font-semibold hover:bg-secondary-foreground/5 transition-colors"
      >
        Tell Me About Your Project
      </a>
    </div>

    {/* Trust Signal */}
    <p className="text-sm text-secondary-foreground/60 mb-6">
      Trusted across SaaS, real estate, and personal brands
    </p>

    {/* Proof Line */}
    <p className="text-sm text-secondary-foreground/40">
      Built for real businesses · Fast delivery (3–7 days) · Performance-focused · Clean, scalable builds
    </p>

  </div>
</section>
);

export default Hero;
