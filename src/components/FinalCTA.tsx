import { ArrowRight } from "lucide-react";

const FinalCTA = () => (
  <section id="contact" className="py-20 md:py-28 bg-secondary text-secondary-foreground">
    <div className="container max-w-3xl text-center">
      <h2 className="text-2xl md:text-4xl font-bold mb-4">
        Need a website that actually works?
      </h2>
      <p className="text-secondary-foreground/60 text-lg mb-10 max-w-xl mx-auto">
        Tell me what you're building. I'll help you structure it properly.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="mailto:hello@codebruv.com"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Start a Project
          <ArrowRight className="w-4 h-4" />
        </a>
        <a
          href="mailto:hello@codebruv.com"
          className="inline-flex items-center justify-center gap-2 border border-secondary-foreground/20 text-secondary-foreground px-6 py-3.5 rounded-lg font-semibold hover:bg-secondary-foreground/5 transition-colors"
        >
          Send a Message
        </a>
      </div>
    </div>
  </section>
);

export default FinalCTA;
