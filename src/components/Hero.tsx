import { ArrowRight } from "lucide-react";

const Hero = () => (
  <section className="bg-secondary text-secondary-foreground min-h-[90vh] flex items-center">
    <div className="container max-w-4xl py-20 md:py-32">
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-800 leading-tight tracking-tight mb-6">
        Landing Pages & Portfolio Websites That Load Fast and Convert
      </h1>
      <p className="text-lg md:text-xl text-secondary-foreground/70 max-w-2xl mb-10 leading-relaxed">
        I build clean, high-performing websites that help you look credible and turn visitors into clients.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <a
          href="#work"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          View My Work
          <ArrowRight className="w-4 h-4" />
        </a>
        <a
          href="#contact"
          className="inline-flex items-center justify-center gap-2 border border-secondary-foreground/20 text-secondary-foreground px-6 py-3.5 rounded-lg font-semibold hover:bg-secondary-foreground/5 transition-colors"
        >
          Start a Project
        </a>
      </div>
      <p className="text-sm text-secondary-foreground/40">
        Fast delivery · Clean builds · Built under Code Bruv Technologies Ltd
      </p>
    </div>
  </section>
);

export default Hero;
