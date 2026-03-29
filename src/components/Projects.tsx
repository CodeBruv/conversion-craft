const projects = [
  {
    name: "Elbi Homes",
    type: "Real Estate Landing Page",
    context: "Real estate company based in Birmingham, England",
    problem: "Needed a clean landing page to present properties and build trust with potential buyers",
    built: "A structured, modern landing page focused on clarity, property visibility, and easy navigation",
    result: "Improved presentation, stronger credibility, and clearer user flow for inquiries",
  },
  {
    name: "SprintFlow",
    type: "SaaS Landing Page",
    context: "Remote team collaboration tool",
    problem: "Needed a landing page that clearly explains the product and reduces confusion around features",
    built: "A fast, structured SaaS landing page with clear messaging and feature breakdown",
    result: "Better product understanding and improved conversion flow for signups",
  },
  {
    name: "Daniel Reed",
    type: "Personal Brand Landing Page",
    context: "Productivity coach for freelancers",
    problem: "Needed a lead capture page to convert visitors into coaching clients",
    built: "A focused landing page with strong messaging and clear call-to-action",
    result: "More structured lead capture and improved clarity of offer",
  },
  {
    name: "GrowthForge",
    type: "Agency Website",
    context: "Digital marketing agency",
    problem: "Needed a website that positions the agency as performance-driven and credible",
    built: "A clean, professional multi-section website focused on services and results",
    result: "Stronger brand positioning and improved trust for potential clients",
  },
  {
    name: "Ava Thompson",
    type: "UX Portfolio Website",
    context: "Mid-level UX designer",
    problem: "Needed a portfolio that presents case studies clearly and professionally",
    built: "A structured portfolio website with clean layouts and focused case study sections",
    result: "Better presentation of work and improved professional credibility",
  },
  {
    name: "CookedByJulz",
    type: "Landing Page + Digital Product System",
    context: "Content brand selling digital products",
    problem: "Needed a system to present and sell content resources clearly without confusion",
    built: "A structured landing page with integrated digital product flow",
    result: "Simplified user journey and clearer product positioning for buyers",
  },
];

const Projects = () => (
  <section id="work" className="py-20 md:py-28 bg-surface">
    <div className="container max-w-5xl">
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Selected Work</p>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-12">
        Real projects. Real outcomes.
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <div
            key={p.name}
            className="bg-background rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
          >
            <div className="mb-4">
              <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
              <p className="text-sm font-medium text-primary">{p.type}</p>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-muted-foreground">Context:</span>
                <span className="ml-1.5 text-foreground/80">{p.context}</span>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground">Problem:</span>
                <span className="ml-1.5 text-foreground/80">{p.problem}</span>
              </div>
              <div>
                <span className="font-semibold text-muted-foreground">Built:</span>
                <span className="ml-1.5 text-foreground/80">{p.built}</span>
              </div>
              <div className="pt-2 border-t border-border">
                <span className="font-semibold text-primary">Result:</span>
                <span className="ml-1.5 text-foreground">{p.result}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Projects;
