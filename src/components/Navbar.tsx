import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

/**
 * A homepage section link.
 *
 * On the homepage this is the same plain anchor it always was. On another route
 * (a project page) a bare "#work" would point at a section that is not on the
 * page, so it becomes a link back to the homepage section instead.
 */
const SectionLink = ({ id, children }: { id: string; children: ReactNode }) => {
  const { pathname } = useLocation();
  const className = "hover:text-white transition-colors";

  return pathname === "/" ? (
    <a href={`#${id}`} className={className}>
      {children}
    </a>
  ) : (
    <Link to={`/#${id}`} className={className}>
      {children}
    </Link>
  );
};

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-secondary/80 backdrop-blur-md border-b border-white/5">
      <div className="container max-w-6xl flex items-center justify-between py-4">

        {/* Logo */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-semibold tracking-tight text-sm md:text-base text-secondary-foreground/80 hover:text-white transition-colors"
        >
          Code Bruv
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-6">

          {/* Navigation */}
          <nav className="flex items-center gap-6 text-sm text-secondary-foreground/70">
            <SectionLink id="work">Work</SectionLink>
            <SectionLink id="contact">Contact</SectionLink>
          </nav>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
