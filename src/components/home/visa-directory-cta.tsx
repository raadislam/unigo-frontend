import Link from "next/link";
import { ArrowRight, Globe2, FileCheck2, Headset } from "lucide-react";
import type { Country } from "@/lib/country-directory";

type Props = {
  countries: Country[];
};

const highlights = [
  { icon: Globe2, title: "Explore destinations", description: "Discover country information and travel options." },
  { icon: FileCheck2, title: "Understand visa options", description: "Learn about categories, requirements and process." },
  { icon: Headset, title: "Get expert support", description: "Receive guidance from planning to application." },
];

export function VisaDirectoryCta({ countries }: Props) {
  const featuredCountries = countries.slice(0, 4);

  return (
    <section className="relative isolate overflow-hidden bg-[#082b4c] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_82%_18%,rgba(44,112,160,0.42),transparent_36%),radial-gradient(ellipse_at_8%_100%,rgba(215,25,45,0.20),transparent_34%)]" />
      <div className="absolute -right-32 top-[-180px] -z-10 h-[520px] w-[520px] rounded-full border border-white/[0.07]" />
      <div className="absolute -right-12 top-[-100px] -z-10 h-[360px] w-[360px] rounded-full border border-white/[0.07]" />

      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff8791]">
              <span className="h-[3px] w-9 rounded-full bg-[#e21b32]" />
              UniGo Visa Directory
            </div>
            <h2 className="mt-5 text-3xl font-bold leading-[1.13] tracking-tight text-white sm:text-4xl lg:text-[48px]">
              Your gateway to <span className="text-[#ff5367]">global travel.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              Explore destination guides and visa information for Bangladeshi passport holders. Choose a country to review its available information and plan your next journey with UniGo.
            </p>
          </div>
          <Link href="/visa-services/" className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#d7192d] px-6 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#b91426]">
            View all {countries.length} destinations <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featuredCountries.map((country) => (
            <Link key={country.id} href={`/visa-services/${country.slug}/`} className="group flex min-h-[174px] flex-col rounded-2xl border border-white/10 bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-1 hover:border-[#ff8791] hover:shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f3f7fb] text-3xl ring-1 ring-[#e7edf3]" aria-hidden="true">{country.flag_emoji || "🌍"}</span>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-[#082b4c] transition group-hover:text-[#d7192d]">{country.name}</h3>
                  {country.capital && <p className="mt-1 truncate text-xs text-slate-500">{country.capital}</p>}
                </div>
              </div>
              <p className="mt-4 line-clamp-2 text-xs leading-5 text-slate-600">{country.short_description || `Explore visa requirements and travel information for ${country.name}.`}</p>
              <span className="mt-auto flex items-center gap-2 pt-4 text-xs font-bold text-[#d7192d]">Explore visa information <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
          {featuredCountries.length === 0 && (
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 text-sm text-white/75 sm:col-span-2 xl:col-span-4">
              Country destinations are being updated. Please visit the full visa directory for available information.
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-5 border-t border-white/15 pt-8 sm:grid-cols-3">
          {highlights.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-[#ff8791]"><Icon size={19} /></span>
              <div>
                <p className="text-xs font-bold leading-5 text-white">{title}</p>
                <p className="mt-1 text-[11px] leading-5 text-white/65">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
