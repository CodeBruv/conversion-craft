const Footer = () => (
  <footer className="py-10 bg-secondary border-t border-secondary-foreground/10">
    <div className="container max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-secondary-foreground/60">
      
      {/* Left */}
      <div className="text-center md:text-left">
        <p className="font-medium text-secondary-foreground">
          Code Bruv Technologies Ltd
        </p>
        <p className="text-xs text-secondary-foreground/40">
          Fast, conversion-focused web builds
        </p>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        <a
          href="mailto:hello@codebruv.com"
          className="hover:text-secondary-foreground transition-colors"
        >
          Email
        </a>

        <a
          href="https://wa.me/+2348142971640"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-secondary-foreground transition-colors"
        >
          WhatsApp
        </a>

        <a
          href="https://www.upwork.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-secondary-foreground transition-colors"
        >
          Upwork
        </a>
      </div>
    </div>

    {/* Bottom strip */}
    <div className="mt-6 text-center text-xs text-secondary-foreground/30">
      © {new Date().getFullYear()} Code Bruv Technologies Ltd. All rights reserved.
    </div>
  </footer>
);

export default Footer;