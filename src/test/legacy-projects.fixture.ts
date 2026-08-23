/**
 * The six projects exactly as they existed in the hardcoded array in
 * src/components/Projects.tsx before the content migration, captured verbatim.
 *
 * This exists only so a test can prove the migration changed no visible copy.
 * It is not used by the application and must not be edited to make a test pass:
 * if a value here no longer matches a content file, the content file changed.
 */
export interface LegacyProject {
  name: string;
  type: string;
  image: string;
  hook: string;
  problem: string;
  built: string;
  context: string;
  result: string;
  liveUrl: string;
  /** The slug the project was migrated to. */
  slug: string;
}

export const LEGACY_PROJECTS: LegacyProject[] = [
  {
    name: "Elbi Homes",
    type: "Real Estate Landing Page",
    image: "elbi-homes.png",
    hook: "Built to remove hesitation and make property inquiries feel easy and natural",
    problem:
      "Listings were scattered and didn’t build enough trust to convert visitors into inquiries",
    built:
      "A structured landing page that presents properties clearly and guides users step-by-step toward contacting the business",
    context: "Real estate company based in Birmingham, England",
    result: "Stronger trust, clearer navigation, and more confident inquiry flow",
    liveUrl: "https://elbi-homes.netlify.app/",
    slug: "elbi-homes",
  },
  {
    name: "SprintFlow",
    type: "SaaS Landing Page",
    image: "sprintflow.png",
    hook: "Designed to make the product clear within seconds of landing",
    problem: "Users were confused by too many features and unclear messaging",
    built:
      "A simplified SaaS landing page with focused sections, clean hierarchy, and clear product explanation",
    context: "Remote team collaboration tool",
    result: "Better clarity and smoother path toward signup decisions",
    liveUrl: "https://sprint-flow.netlify.app/",
    slug: "sprintflow",
  },
  {
    name: "Daniel Reed",
    type: "Personal Brand Landing Page",
    image: "daniel-reed.png",
    hook: "Focused on turning attention into action instead of passive scrolling",
    problem: "Visitors had no clear next step, leading to lost leads",
    built:
      "A direct, conversion-focused page with strong positioning and a single clear call-to-action",
    context: "Productivity coach",
    result: "Stronger lead capture flow and clearer user direction",
    liveUrl: "https://reed-s-focus-system.netlify.app/",
    slug: "daniel-reed",
  },
  {
    name: "GrowthForge",
    type: "Agency Website",
    image: "growthforge.png",
    hook: "Positioned to feel credible and performance-driven from the first scroll",
    problem: "Weak positioning made the agency blend in with competitors",
    built:
      "A structured website that clearly communicates services, authority, and outcomes",
    context: "Digital marketing agency",
    result: "More confident brand presence and stronger perceived value",
    liveUrl: "https://growthforge-agency.netlify.app/",
    slug: "growthforge",
  },
  {
    name: "Ava Thompson",
    type: "UX Portfolio Website",
    image: "ava-thompson.png",
    hook: "Designed to make case studies easy to understand and evaluate quickly",
    problem: "Work felt scattered and lacked clear storytelling",
    built: "A clean, structured portfolio focused on clarity, hierarchy, and flow",
    context: "UX designer",
    result: "More professional presentation and easier decision-making for recruiters",
    liveUrl: "https://ava-thompson.netlify.app/",
    slug: "ava-thompson",
  },
  {
    name: "CookedByJulz",
    type: "Content Brand Landing Page",
    image: "cookedbyjulz.png",
    hook: "Designed to turn scattered ideas into a clear and structured content direction",
    problem:
      "Content lacked consistency and didn’t communicate a strong, focused message",
    built:
      "A clean landing page that organizes the brand’s message, content approach, and direction into a simple, easy-to-follow flow",
    context: "Personal content brand",
    result:
      "Stronger positioning and a clearer foundation for consistent content creation",
    liveUrl: "http://cookedbyjulz.com.ng/",
    slug: "cookedbyjulz",
  },
];
