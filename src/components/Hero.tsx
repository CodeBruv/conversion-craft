import { ArrowRight, Github, Linkedin } from "lucide-react";

const Hero = () => (
  <section className="bg-secondary text-secondary-foreground min-h-[90vh] flex items-center">
    <div className="container max-w-5xl py-20 md:py-28">
      <div className="max-w-3xl">
        <p className="text-sm md:text-base font-semibold tracking-wide text-primary mb-5">
          FRONTEND ENGINEER · REACT · NEXT.JS · TYPESCRIPT
        </p>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6">
          I build web products that are clear, responsive, and built to ship.
        </h1>

        <p className="text-lg md:text-xl text-secondary-foreground/70 max-w-2xl mb-10 leading-relaxed">
          I build production web applications and interfaces with React,
          Next.js, TypeScript, and modern web technologies. I care about the
          details that make products feel good to use — responsive behavior,
          accessibility, performance, and reliable application state.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
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
            Get In Touch
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-secondary-foreground/60">
          <a
            href="https://github.com/CodeBruv"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-secondary-foreground transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/abdulmajid-abubakar-hussain-313311138"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-secondary-foreground transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>

          <span>Based in Nigeria · Open to remote work</span>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;