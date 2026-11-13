import type { Metadata } from "next";
import { Globe2, ShieldCheck, PlaneTakeoff, Headphones } from "lucide-react";
import { CountryDirectory } from "@/components/visa-services/country-directory";
import { getCountryDirectory } from "@/lib/country-directory";

export const metadata: Metadata = {
  title: "Visa Services by Country",
  description: "Explore visa categories and travel assistance by destination. Find country-specific visa guidance and services from UniGo Bangladesh.",
  alternates: { canonical: "/visa-services/" },
  openGraph: {
    title: "Visa Services by Country | UniGo Bangladesh",
    description: "Explore country-specific visa information, application guidance and travel services with UniGo Bangladesh.",
    url: "https://unigo-bd.com/visa-services/",
    type: "website",
  },
};

export default async function VisaServicesPage() {
  const directory = await getCountryDirectory();

  return (
    <main className="bg-[#f7fafe]">
      <section className="relative isolate overflow-hidden bg-[#082b4c]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_18%,rgba(215,25,45,0.28),transparent_32%),radial-gradient(circle_at_12%_100%,rgba(64,128,177,0.24),transparent_38%)]" />
        <div className="absolute -right-24 -top-36 -z-10 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -right-10 -top-20 -z-10 h-72 w-72 rounded-full border border-white/10" />
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white/90 backdrop-blur">
              <Globe2 size={14} className="text-[#ff7c88]" /> UNIGO DESTINATION DIRECTORY
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your journey starts with the <span className="text-[#ff6877]">right destination.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              Explore country-specific visa information and discover how UniGo can support your travel plans, documentation and application journey.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#country-list" className="inline-flex items-center gap-2 rounded-xl bg-[#d7192d] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/15 transition hover:bg-[#b91426]">Explore countries <PlaneTakeoff size={16} /></a>
              <a href="/contact/" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15">Talk to an advisor <Headphones size={16} /></a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium text-white/70">
              <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-[#ff7c88]" /> Guidance from our team</span>
              <span className="inline-flex items-center gap-2"><Globe2 size={15} className="text-[#ff7c88]" /> Destinations around the world</span>
            </div>
          </div>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-[#d7192d] via-[#f36a78] to-transparent" />
      </section>

      <section id="country-list" className="mx-auto max-w-[1440px] scroll-mt-24 px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d7192d]">Choose where to go</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#082b4c] sm:text-3xl">Explore visa services by country</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Select a destination to view the available visa categories and UniGo services.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#526579]"><span className="h-2 w-2 rounded-full bg-[#d7192d]" /> Updated destination information</div>
        </div>
        <CountryDirectory initialCountries={directory.data} initialCategories={directory.meta.filters.categories} />
      </section>
    </main>
  );
}
