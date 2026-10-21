import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact UniGo to discuss your international education plans.",
};

export default function ContactPage() {
  return (
    <section className="bg-[#F7FAFE] py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#D7192D]">
              Contact UniGo
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-[#082B4C] sm:text-5xl">
              Let's talk about your future
            </h1>
            <p className="mt-5 max-w-lg leading-8 text-slate-600">
              Have questions about studying abroad? Reach out to our team to
              discuss your goals and the guidance you need.
            </p>

            <div className="mt-9 grid gap-5">
              <a
                href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
                className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5"
              >
                <Phone className="mt-1 text-[#D7192D]" size={21} />
                <div>
                  <p className="font-bold text-[#082B4C]">Phone</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {siteConfig.phone}
                  </p>
                </div>
              </a>

              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5"
              >
                <Mail className="mt-1 text-[#D7192D]" size={21} />
                <div>
                  <p className="font-bold text-[#082B4C]">Email</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {siteConfig.email}
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5">
                <MapPin className="mt-1 text-[#D7192D]" size={21} />
                <div>
                  <p className="font-bold text-[#082B4C]">Office</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {siteConfig.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-9">
            <h2 className="text-2xl font-bold text-[#082B4C]">
              Send us an email
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Contact our team directly using your preferred email application.
            </p>
            <a
              href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("UniGo Education Consultation")}`}
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#D7192D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#B51225]"
            >
              Email UniGo
            </a>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              An online consultation form can be connected to your Laravel API
              when the backend is ready.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
