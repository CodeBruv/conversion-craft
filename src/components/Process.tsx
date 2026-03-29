const steps = ["Discovery", "Structure", "Build", "Refine", "Launch"];

const Process = () => (
  <section className="py-20 md:py-28 bg-surface">
    <div className="container max-w-4xl">
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">How I Work</p>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-12">
        Simple. Structured. No surprises.
      </h2>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-4 md:gap-0 md:flex-col md:flex-1">
            <div className="flex items-center gap-3 md:flex-col md:gap-2">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                {i + 1}
              </div>
              <span className="font-semibold text-foreground text-sm">{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="hidden md:block w-full h-px bg-border mt-5 mx-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Process;
