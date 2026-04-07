import { ArrowRight } from "lucide-react";

const Hero = () => (
  <section className="bg-secondary text-secondary-foreground min-h-[90vh] flex items-center">
    <div className="container max-w-4xl py-20 md:py-32">
      
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
        Landing Pages That Make You Look Credible, And Turn Visitors Into Clients
      </h1>

      <p className="text-lg md:text-xl text-secondary-foreground/70 max-w-2xl mb-10 leading-relaxed">
        Not just clean design. I build fast, structured websites that guide people, build trust quickly, and push them to take action.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <a
          href="#work"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          See What I’ve Built
          <ArrowRight className="w-4 h-4" />
        </a>

        <a
          href="#contact"
          className="inline-flex items-center justify-center gap-2 border border-secondary-foreground/20 text-secondary-foreground px-6 py-3.5 rounded-lg font-semibold hover:bg-secondary-foreground/5 transition-colors"
        >
          Start Your Project
        </a>
      </div>

      {/* Trust Signal */}
      <p className="text-sm text-secondary-foreground/60 mb-4">
        Used by SaaS teams, real estate brands, and personal businesses
      </p>

      {/* Proof Line */}
      <p className="text-sm text-secondary-foreground/40">
        Fast turnaround (3–7 days) · Built for conversions · Clean, scalable code
      </p>

    </div>
  </section>
);

export default Hero;
