"use client";

import { useState, type FormEvent } from "react";
import { Mail, Send } from "lucide-react";
import { siteConfig } from "@/config/site";

export function ContactForm() {
  const [isSending, setIsSending] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "");
    const phone = String(formData.get("phone") || "");
    const email = String(formData.get("email") || "");
    const message = String(formData.get("message") || "");

    const subject = encodeURIComponent("New Website Enquiry - UniGo");

    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`,
    );

    setIsSending(true);
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
    setIsSending(false);
  }

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-9">
      <div className="mb-7">
        <div className="flex size-12 items-center justify-center rounded-xl bg-red-50">
          <Mail className="text-[#D7192D]" size={22} />
        </div>

        <h2 className="mt-5 text-2xl font-black text-[#082B4C]">
          Send Us a Direct Message
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Fill in the details below and tell us how we can help you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="contact-name"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#082B4C]"
            >
              Your Name <span className="text-[#D7192D]">*</span>
            </label>

            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Full Name"
              required
              autoComplete="name"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-[#082B4C] outline-none transition placeholder:text-slate-400 focus:border-[#0D5960] focus:ring-2 focus:ring-[#0D5960]/10"
            />
          </div>

          <div>
            <label
              htmlFor="contact-phone"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#082B4C]"
            >
              Phone Number <span className="text-[#D7192D]">*</span>
            </label>

            <input
              id="contact-phone"
              name="phone"
              type="tel"
              placeholder="+880 1..."
              required
              autoComplete="tel"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-[#082B4C] outline-none transition placeholder:text-slate-400 focus:border-[#0D5960] focus:ring-2 focus:ring-[#0D5960]/10"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#082B4C]"
          >
            Email Address
          </label>

          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-[#082B4C] outline-none transition placeholder:text-slate-400 focus:border-[#0D5960] focus:ring-2 focus:ring-[#0D5960]/10"
          />
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#082B4C]"
          >
            Your Message <span className="text-[#D7192D]">*</span>
          </label>

          <textarea
            id="contact-message"
            name="message"
            placeholder="Tell us about your visa or travel requirements..."
            required
            rows={7}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-[#082B4C] outline-none transition placeholder:text-slate-400 focus:border-[#0D5960] focus:ring-2 focus:ring-[#0D5960]/10"
          />
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#0D5960] px-6 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#082B4C] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Send size={17} />
          {isSending ? "Preparing Message..." : "Send Message"}
        </button>

        <p className="text-center text-xs leading-5 text-slate-400">
          Your email application will open with your message prepared.
        </p>
      </form>
    </div>
  );
}
