import Link from "next/link";
import type { Country } from "@/lib/country-directory";
import { CountryFlag } from "@/components/shared/country-flag";

type Props = {
  countries: Country[];
};

export function HomepageCountryDiscovery({ countries }: Props) {
  const featuredCountries = countries.slice(0, 12);

  if (featuredCountries.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f4f7fa] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d7192d]">Explore the world with UniGo</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#082b4c] sm:text-4xl">Visa destinations around the world</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">Explore destination guides and visa information for Bangladeshi passport holders. Select a country to view its requirements and travel guidance.</p>
          </div>
          <Link href="/visa-services/" className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-[#082b4c] px-5 text-sm font-bold text-white transition hover:bg-[#d7192d]">
            View all {countries.length} destinations
          </Link>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredCountries.map((country) => (
            <Link
              key={country.id}
              href={`/visa-services/${country.slug}/`}
              className="group flex min-h-[150px] flex-col rounded-2xl border border-[#e1e8ef] bg-white p-5 shadow-[0_8px_24px_rgba(8,43,76,0.045)] transition duration-300 hover:-translate-y-1 hover:border-[#d7192d]/40 hover:shadow-[0_16px_34px_rgba(8,43,76,0.1)]"
            >
              <div className="flex items-center gap-3">
                <CountryFlag iso2={country.iso2} name={country.name} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f3f7fb] ring-1 ring-[#e7edf3]" />
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-[#082b4c] transition group-hover:text-[#d7192d]">{country.name}</h3>
                  {country.capital && <p className="mt-1 truncate text-xs text-slate-500">{country.capital}</p>}
                </div>
              </div>
              <p className="mt-4 line-clamp-2 text-xs leading-5 text-slate-600">{country.short_description || `Explore visa requirements and travel information for ${country.name}.`}</p>
              <span className="mt-auto pt-4 text-xs font-bold text-[#d7192d]">Explore visa information <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
