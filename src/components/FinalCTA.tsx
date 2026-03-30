import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xgopkbro";

const FinalCTA = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    projectType: "",
    budget: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
          name: form.name,
          email: form.email,
          message: form.message,
          projectType: form.projectType,
          budget: form.budget,
          source: "Portfolio Website",
        }),
      });

      if (response.ok) {
        setStatus("success");
        setForm({
          name: "",
          email: "",
          message: "",
          projectType: "",
          budget: "",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-28 bg-secondary text-secondary-foreground"
    >
      <div className="container max-w-3xl text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
          Let’s Build Something That Actually Converts
        </h2>

        <p className="text-secondary-foreground/70 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Whether you need a landing page or a portfolio, I’ll help you structure
          it clearly, build it fast, and make sure it does its job.
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-background border border-border rounded-xl p-6 mb-8 text-left"
        >
          <div className="grid gap-4">

            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* Project Type */}
            <select
              name="projectType"
              value={form.projectType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              <option value="" disabled hidden>
                What do you need?
              </option>
              <option value="Landing Page">Landing Page</option>
              <option value="Portfolio Website">Portfolio Website</option>
              <option value="Website Redesign">Website Redesign</option>
              <option value="Other">Other</option>
            </select>

            {/* Budget */}
            <select
              name="budget"
              value={form.budget}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              <option value="" disabled hidden>
                Estimated budget?
              </option>
              <option value="$100 - $300">$100 - $300</option>
              <option value="$300 - $700">$300 - $700</option>
              <option value="$700 - $1500">$700 - $1500</option>
              <option value="$1500+">$1500+</option>
            </select>

            {/* Message */}
            <textarea
              name="message"
              placeholder="Briefly describe your project..."
              rows={4}
              value={form.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-lg font-semibold hover:opacity-90 transition-opacity mt-2 disabled:opacity-70"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Project Details
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Trust Trigger */}
          <p className="text-xs text-secondary-foreground/40 mt-3 text-center">
            Most projects delivered within 3–7 days
          </p>

          {/* STATUS */}
          {status === "success" && (
            <p className="text-green-500 text-sm mt-4">
              ✅ Message sent successfully. I’ll get back to you shortly.
            </p>
          )}

          {status === "error" && (
            <p className="text-red-500 text-sm mt-4">
              ❌ Something went wrong. Please try again or email directly.
            </p>
          )}
        </form>

        {/* Secondary CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <a
            href="https://www.upwork.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-secondary-foreground/20 text-secondary-foreground px-6 py-3.5 rounded-lg font-semibold hover:bg-secondary-foreground/5 transition-colors"
          >
            Hire Me on Upwork
          </a>
        </div>

        <p className="text-sm text-secondary-foreground/40">
          Fast delivery · Clean builds · Conversion-focused structure
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;