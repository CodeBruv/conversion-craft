const Footer = () => (
  <footer className="py-8 bg-secondary border-t border-secondary-foreground/10">
    <div className="container max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-secondary-foreground/50">
      <span>© {new Date().getFullYear()} Code Bruv Technologies Ltd</span>
      <div className="flex gap-6">
        <a href="mailto:hello@codebruv.com" className="hover:text-secondary-foreground transition-colors">
          Email
        </a>
        <a href="https://wa.me/" className="hover:text-secondary-foreground transition-colors" target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        <a href="https://www.upwork.com/" className="hover:text-secondary-foreground transition-colors" target="_blank" rel="noopener noreferrer">
          Upwork
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
