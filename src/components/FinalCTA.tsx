import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xgopkbro";
const WHATSAPP_NUMBER = "+2348142971640";

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

  const generateWhatsAppMessage = () => {
    return encodeURIComponent(
      `Hi, I saw your website.\n\n` +
      `Name: ${form.name}\n` +
      `Email: ${form.email}\n` +
      `Project Type: ${form.projectType}\n` +
      `Budget: ${form.budget}\n\n` +
      `Project Details:\n${form.message}`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await fetch(FORMSPREE_ENDPOINT, {
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

      setStatus("success");

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${generateWhatsAppMessage()}`;
      window.open(whatsappUrl, "_blank");

      setForm({
        name: "",
        email: "",
        message: "",
        projectType: "",
        budget: "",
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
      <div className="container max-w-3xl text-center">

        <h2 className="text-2xl md:text-4xl font-bold mb-4">
          Have Something in Mind? Let’s Build It Properly.
        </h2>

        <p className="text-secondary-foreground/70 text-lg mb-6 max-w-xl mx-auto">
          Tell me what you're trying to build. I’ll help you structure it, design it clean, and get it live fast.
        </p>

        <p className="text-sm text-secondary-foreground/50 mb-10">
          Usually delivered within 3–7 days · Simple process · No unnecessary back and forth
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-background border border-border rounded-xl p-6 mb-8 text-left"
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

            <select
              name="projectType"
              value={form.projectType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm text-foreground"
            >
              <option value="" disabled hidden>What do you need?</option>
              <option value="Landing Page">Landing Page</option>
              <option value="Portfolio Website">Portfolio Website</option>
              <option value="Website Redesign">Website Redesign</option>
            </select>

            <select
              name="budget"
              value={form.budget}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm text-foreground"
            >
              <option value="" disabled hidden>Estimated budget?</option>
              <option value="$100 - $300">$100 - $300</option>
              <option value="$300 - $700">$300 - $700</option>
              <option value="$700 - $1500">$700 - $1500</option>
              <option value="$1500+">$1500+</option>
            </select>

            <textarea
              name="message"
              placeholder="Briefly describe your project..."
              rows={4}
              value={form.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm resize-none text-foreground"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-lg font-semibold mt-2"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Details & Continue on WhatsApp
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default FinalCTA;
