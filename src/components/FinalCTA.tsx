import { useState } from "react";
import { ArrowRight, Github, Linkedin, Loader2 } from "lucide-react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xgopkbro";
const WHATSAPP_NUMBER = "+2348142971640";

const FinalCTA = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateWhatsAppMessage = () => {
    return encodeURIComponent(
      `Hi Abdulmajid,\n\n` +
        `Name: ${form.name}\n` +
        `Email: ${form.email}\n\n` +
        `Message:\n${form.message}`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...form,
          source: "Portfolio Website",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setStatus("success");

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${generateWhatsAppMessage()}`;
      window.open(whatsappUrl, "_blank");

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-28 bg-secondary text-secondary-foreground"
    >
      <div className="container max-w-4xl">
        <div className="max-w-2xl mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Let’s Talk
          </p>

          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Have a problem worth solving?
          </h2>

          <p className="text-secondary-foreground/70 text-lg leading-relaxed">
            Whether you’re building a product, improving an existing one, or
            facing a problem that technology could solve, tell me what you’re
            working on. I’m always open to exploring the right way to approach
            it.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_1.4fr] gap-8 items-start">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">What happens next?</h3>

              <p className="text-sm text-secondary-foreground/60 leading-relaxed">
                Tell me what you’re trying to achieve, what isn’t working, or
                what you have in mind. We can start with the problem and figure
                out the right solution from there.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/CodeBruv"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>

              <a
                href="https://www.linkedin.com/in/abdulmajid-abubakar-hussain-313311138"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-background border border-border rounded-xl p-6 text-left"
          >
            <div className="grid gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm text-foreground"
              />

              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm text-foreground"
              />

              <textarea
                name="message"
                placeholder="What are you trying to build, improve, or solve?"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm resize-none text-foreground"
              />

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-lg font-semibold mt-2 hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Start a Conversation
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {status === "success" && (
                <p className="text-sm text-primary">
                  Thanks — your message was sent.
                </p>
              )}

              {status === "error" && (
                <p className="text-sm text-destructive">
                  Something went wrong. Please try again or contact me directly.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;