import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, Mail, Phone } from "lucide-react";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/config/site";
import {
  ContactForm,
  OfficeLocator,
} from "@/components/contact/contact-experience";

export const metadata: Metadata = {
  title: "Contact Us | UniGo",
  description:
    "Contact UniGo for international education guidance. Visit our offices in Dhaka and Narayanganj, Bangladesh.",
};

export default function ContactPage() {
  return (
    <main className="overflow-hidden bg-white">
      <section className="relative overflow-hidden bg-[#082B4C]">
        <div className="pointer-events-none absolute -right-40 -top-48 size-[550px] rounded-full border border-white/[0.06]" />
        <div className="pointer-events-none absolute -right-16 -top-28 size-[390px] rounded-full border border-white/[0.06]" />
        <div className="pointer-events-none absolute -bottom-52 left-[38%] size-[430px] rounded-full bg-[#D7192D]/10 blur-3xl" />

        <Container>
          <div className="relative grid min-h-[370px] items-center gap-12 py-20 lg:grid-cols-[1fr_auto] lg:py-24">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-9 bg-[#D7192D]" />
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-white/60">
                  Contact UniGo
                </span>
              </div>

              <h1 className="mt-7 text-5xl font-black leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Every journey
                <br />
                starts with a
                <span className="text-[#F05A68]"> conversation.</span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
                Tell us where you want to go. Our team is ready to help you
                explore international education opportunities and plan your next
                move.
              </p>

              <a
                href="#contact-details"
                className="mt-9 inline-flex items-center gap-3 text-sm font-bold text-white transition hover:text-[#F05A68]"
              >
                Get in touch
                <ArrowDown size={18} />
              </a>
            </div>

            <div className="hidden lg:flex">
              <div className="relative flex size-48 items-center justify-center rounded-full border border-white/15">
                <div className="absolute inset-4 rounded-full border border-white/10" />
                <div className="absolute inset-8 rounded-full border border-white/10" />
                <span className="text-6xl font-black tracking-tighter text-white">
                  U<span className="text-[#D7192D]">.</span>
                </span>
                <span className="absolute -right-3 top-8 size-4 rounded-full bg-[#D7192D]" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section
        id="contact-details"
        className="scroll-mt-20 bg-[#F7FAFE] py-16 sm:py-24"
      >
        <Container>
          <div className="grid items-start gap-x-10 gap-y-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-x-12 lg:gap-y-12">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D7192D]">
                Let&apos;s Connect
              </p>

              <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight tracking-tight text-[#082B4C] sm:text-4xl">
                We&apos;re here to help you move forward.
              </h2>

              <p className="mt-4 max-w-2xl leading-8 text-slate-600">
                Whether you are exploring Destinations, planning an application,
                or looking for expert guidance, our team is ready to hear from
                you.
              </p>
            </div>

            <div className="min-w-0">
              <OfficeLocator />
            </div>

            <div className="min-w-0">
              <ContactForm />
            </div>

            <aside className="min-w-0 space-y-6">
              <div className="rounded-[24px] border border-slate-200/80 bg-white p-7 shadow-[0_8px_30px_rgba(8,43,76,0.035)] sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D7192D]">
                  Contact Information
                </p>

                <h3 className="mt-3 text-2xl font-bold leading-tight text-[#082B4C]">
                  Let&apos;s start a conversation.
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  Reach out to our team directly. We will be happy to discuss
                  your international plans.
                </p>

                <div className="mt-8 space-y-6">
                  <a
                    href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
                    className="group flex items-center gap-4"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F2] transition group-hover:bg-[#D7192D]">
                      <Phone
                        size={19}
                        className="text-[#D7192D] transition group-hover:text-white"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Phone / Hotline
                      </p>
                      <p className="mt-1 break-words text-sm font-bold text-[#082B4C]">
                        {siteConfig.phone}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={17}
                      className="ml-auto shrink-0 text-slate-300 transition group-hover:text-[#D7192D]"
                    />
                  </a>

                  <div className="h-px bg-slate-100" />

                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="group flex items-center gap-4"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F2] transition group-hover:bg-[#D7192D]">
                      <Mail
                        size={19}
                        className="text-[#D7192D] transition group-hover:text-white"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Email Address
                      </p>
                      <p className="mt-1 break-all text-sm font-bold text-[#082B4C]">
                        {siteConfig.email}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={17}
                      className="ml-auto shrink-0 text-slate-300 transition group-hover:text-[#D7192D]"
                    />
                  </a>
                </div>

                <a
                  href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("UniGo Education Consultation")}`}
                  className="mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#082B4C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0D5960]"
                >
                  Email Our Team
                  <ArrowUpRight size={16} />
                </a>
              </div>

              <div className="rounded-[24px] border border-[#DCE8F2] bg-[#EDF4FA] p-7 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D7192D]">
                  Our Commitment
                </p>

                <h3 className="mt-3 text-xl font-bold leading-snug text-[#082B4C]">
                  Your next opportunity starts with the right guidance.
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Connect with UniGo to explore your options and take the next
                  step towards your international education goals.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </main>
  );
}
