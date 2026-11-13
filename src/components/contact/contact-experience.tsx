"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Check,
  LoaderCircle,
  MapPin,
  Navigation,
  Send,
} from "lucide-react";
import { siteConfig } from "@/config/site";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

const offices = [
  {
    id: "dhaka",
    name: "Dhaka",
    branch: "Main Office",
    address:
      "City Center (11th Floor), 90/1 Motijheel Road, Dilkusha, Dhaka-1000, Bangladesh",
    mapQuery: "City Center 90/1 Motijheel Road Dilkusha Dhaka Bangladesh",
  },
  {
    id: "narayanganj",
    name: "Narayanganj",
    branch: "Branch Office",
    address:
      "89/32, B-Dwip, Beside Isdair Rabeya School, Uttar Chashara, Narayanganj-1400, Bangladesh",
    mapQuery:
      "89/32 B-Dwip Isdair Rabeya School Uttar Chashara Narayanganj Bangladesh",
  },
];

export function ContactForm() {
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!API_BASE_URL) {
      setStatus({
        type: "error",
        message:
          "The contact service is not configured. Please try again later.",
      });
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    setIsSending(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        const validationMessage = result.errors
          ? Object.values(result.errors).flat().join(" ")
          : result.message;

        throw new Error(
          validationMessage ||
            "Unable to submit your enquiry. Please try again.",
        );
      }

      setStatus({
        type: "success",
        message:
          "Thank you! Your enquiry has been received. Our team will contact you shortly.",
      });

      form.reset();
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_40px_rgba(8,43,76,0.045)] sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D7192D]">
            Contact Form
          </span>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-[#082B4C] sm:text-[28px]">
            Send us a message
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Share your plans with us. Our team is ready to help.
          </p>
        </div>

        <div className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F2] sm:flex">
          <Send size={19} className="text-[#D7192D]" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="contact-name"
              className="mb-2 block text-xs font-semibold text-[#082B4C]"
            >
              Full Name <span className="text-[#D7192D]">*</span>
            </label>

            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Enter your name"
              autoComplete="name"
              maxLength={120}
              required
              className="h-[50px] w-full rounded-xl border border-slate-200 bg-[#FAFBFD] px-4 text-sm text-[#082B4C] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0D5960] focus:bg-white focus:ring-4 focus:ring-[#0D5960]/[0.07]"
            />
          </div>

          <div>
            <label
              htmlFor="contact-phone"
              className="mb-2 block text-xs font-semibold text-[#082B4C]"
            >
              Phone Number <span className="text-[#D7192D]">*</span>
            </label>

            <input
              id="contact-phone"
              name="phone"
              type="tel"
              placeholder="+880 1XXXXXXXXX"
              autoComplete="tel"
              maxLength={30}
              required
              className="h-[50px] w-full rounded-xl border border-slate-200 bg-[#FAFBFD] px-4 text-sm text-[#082B4C] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0D5960] focus:bg-white focus:ring-4 focus:ring-[#0D5960]/[0.07]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block text-xs font-semibold text-[#082B4C]"
          >
            Email Address
          </label>

          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={255}
            className="h-[50px] w-full rounded-xl border border-slate-200 bg-[#FAFBFD] px-4 text-sm text-[#082B4C] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0D5960] focus:bg-white focus:ring-4 focus:ring-[#0D5960]/[0.07]"
          />
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="mb-2 block text-xs font-semibold text-[#082B4C]"
          >
            Your Message <span className="text-[#D7192D]">*</span>
          </label>

          <textarea
            id="contact-message"
            name="message"
            rows={7}
            maxLength={5000}
            required
            placeholder="Tell us how we can help with your international plans..."
            className="min-h-[170px] w-full resize-y rounded-xl border border-slate-200 bg-[#FAFBFD] p-4 text-sm leading-7 text-[#082B4C] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0D5960] focus:bg-white focus:ring-4 focus:ring-[#0D5960]/[0.07]"
          />
        </div>

        {status && (
          <div
            role="status"
            aria-live="polite"
            className={`rounded-xl px-4 py-3 text-sm ${
              status.type === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSending}
          className="group flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#D7192D] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#B51225] hover:shadow-lg hover:shadow-[#D7192D]/15 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSending ? (
            <>
              <LoaderCircle size={17} className="animate-spin" />
              Sending Message...
            </>
          ) : status?.type === "success" ? (
            <>
              <Check size={17} />
              Message Sent
            </>
          ) : (
            <>
              Send Message
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-slate-400">
          Your message will be sent securely to the UniGo team.
        </p>
      </form>
    </div>
  );
}

export function OfficeLocator() {
  const [selectedOffice, setSelectedOffice] = useState("dhaka");

  const office =
    offices.find((item) => item.id === selectedOffice) ?? offices[0];

  return (
    <div className="rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(8,43,76,0.035)] sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D7192D]">
            Our Locations
          </p>

          <h3 className="mt-1 text-lg font-bold text-[#082B4C]">
            Visit a UniGo Office
          </h3>
        </div>

        <div className="flex w-fit items-center gap-1 rounded-full bg-[#F1F5F9] p-1">
          {offices.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedOffice(item.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                selectedOffice === item.id
                  ? "bg-[#082B4C] text-white shadow-sm"
                  : "text-slate-500 hover:text-[#082B4C]"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl bg-slate-100">
        <iframe
          key={office.id}
          title={`UniGo ${office.name} Office Map`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(office.mapQuery)}&output=embed`}
          width="100%"
          height="190"
          style={{ border: 0, display: "block" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <div className="mt-5 flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF1F2]">
          <MapPin size={17} className="text-[#D7192D]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-[#082B4C]">{office.name}</h4>

            <span className="rounded-full bg-[#F1F5F9] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">
              {office.branch}
            </span>
          </div>

          <p className="mt-2 text-xs leading-6 text-slate-500">
            {office.address}
          </p>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#0D5960] transition hover:text-[#D7192D]"
          >
            <Navigation size={14} />
            Get Directions
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
