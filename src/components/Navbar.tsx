import { Link } from "react-router-dom";

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
            <a href="#work" className="hover:text-white transition-colors">
              Work
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
          </nav>

        </div>
      </div>
    </header>
  );
};

export default Navbar;