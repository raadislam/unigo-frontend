"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, ArrowRight, Globe2, SlidersHorizontal, MapPin, BadgeCheck, BriefcaseBusiness } from "lucide-react";
import type { Country, VisaCategory } from "@/lib/country-directory";
import { CountryFlag } from "@/components/shared/country-flag";

const alphabet = ["ALL", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const PAGE_SIZE = 15;

type CountryDirectoryProps = {
  initialCountries: Country[];
  initialCategories: Pick<VisaCategory, "name" | "slug">[];
};

export function CountryDirectory({ initialCountries, initialCategories }: CountryDirectoryProps) {
  const countries = initialCountries;
  const categories = initialCategories;
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState("ALL");
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCountries = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return countries.filter((country) => {
      const matchesSearch = !normalizedSearch || country.name.toLowerCase().includes(normalizedSearch);
      const matchesLetter = activeLetter === "ALL" || country.name.toUpperCase().startsWith(activeLetter);
      const matchesCategory = activeCategory === "all" || country.visa_categories.some((category) => category.slug === activeCategory);
      return matchesSearch && matchesLetter && matchesCategory;
    });
  }, [countries, search, activeLetter, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredCountries.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginatedCountries = useMemo(() => filteredCountries.slice(pageStart, pageStart + PAGE_SIZE), [filteredCountries, pageStart]);
  const firstVisibleCountry = filteredCountries.length ? pageStart + 1 : 0;
  const lastVisibleCountry = Math.min(pageStart + PAGE_SIZE, filteredCountries.length);

  const clearFilters = () => {
    setSearch("");
    setActiveLetter("ALL");
    setActiveCategory("all");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[#e6edf4] bg-white p-5 shadow-[0_18px_55px_rgba(8,43,76,0.06)] sm:p-7">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0f1] text-[#d7192d]">
              <SlidersHorizontal size={20} />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#082b4c]">Find your destination</h2>
              <p className="mt-0.5 text-xs text-slate-500">Search and filter available country information</p>
            </div>
          </div>
          <div className="relative w-full lg:max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => { setSearch(event.target.value); setActiveLetter("ALL"); setCurrentPage(1); }}
              placeholder="Search a country..."
              aria-label="Search countries"
              className="h-12 w-full rounded-xl border border-[#dce5ee] bg-[#f8fafc] pl-11 pr-4 text-sm text-[#082b4c] outline-none transition placeholder:text-slate-400 focus:border-[#d7192d] focus:bg-white focus:ring-4 focus:ring-[#d7192d]/10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => { setActiveCategory("all"); setCurrentPage(1); }} className={`rounded-full border px-4 py-2.5 text-xs font-semibold transition ${activeCategory === "all" ? "border-[#082b4c] bg-[#082b4c] text-white shadow-sm" : "border-[#dce5ee] bg-white text-[#42566a] hover:border-[#d7192d] hover:text-[#d7192d]"}`}>
            All destinations <span className="ml-1 opacity-70">({countries.length})</span>
          </button>
          {categories.map((category) => {
            const count = countries.filter((country) => country.visa_categories.some((item) => item.slug === category.slug)).length;
            return (
              <button key={category.slug} type="button" onClick={() => { setActiveCategory(category.slug); setCurrentPage(1); }} className={`rounded-full border px-4 py-2.5 text-xs font-semibold transition ${activeCategory === category.slug ? "border-[#082b4c] bg-[#082b4c] text-white shadow-sm" : "border-[#dce5ee] bg-white text-[#42566a] hover:border-[#d7192d] hover:text-[#d7192d]"}`}>
                {category.name} <span className="ml-1 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 border-t border-[#edf1f5] pt-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Browse alphabetically</span>
            {(search || activeLetter !== "ALL" || activeCategory !== "all") && <button type="button" onClick={clearFilters} className="text-xs font-semibold text-[#d7192d] hover:underline">Clear filters</button>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {alphabet.map((letter) => (
              <button key={letter} type="button" onClick={() => { setActiveLetter(letter); setSearch(""); setCurrentPage(1); }} aria-pressed={activeLetter === letter} className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-bold transition ${activeLetter === letter ? "bg-[#d7192d] text-white shadow-sm" : "bg-[#f1f5f9] text-[#526579] hover:bg-[#e4ebf2] hover:text-[#082b4c]"}`}>
                {letter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500"><span className="font-bold text-[#082b4c]">{filteredCountries.length}</span> destinations found</p>
        <span className="hidden items-center gap-1.5 text-xs font-medium text-slate-400 sm:flex"><Globe2 size={14} /> Explore with UniGo</span>
      </div>

      <div className="hidden" aria-hidden="true" data-directory-link-index="true">
        {countries.map((country) => <Link href={`/visa-services/${country.slug}/`} key={`directory-index-${country.id}`}>{country.name}</Link>)}
      </div>

      {filteredCountries.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {paginatedCountries.map((country) => (
            <Link href={`/visa-services/${country.slug}/`} key={country.id} className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#e3eaf1] bg-white p-5 shadow-[0_10px_32px_rgba(8,43,76,0.055)] transition duration-300 hover:-translate-y-1 hover:border-[#d7192d]/35 hover:shadow-[0_20px_48px_rgba(8,43,76,0.12)] sm:p-6">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#082b4c] via-[#d7192d] to-[#f5a0a8] opacity-0 transition group-hover:opacity-100" />
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <CountryFlag iso2={country.iso2} name={country.name} className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#f3f7fb] ring-1 ring-[#e7edf3]" />
                  <div className="min-w-0 pt-1">
                    <h3 className="truncate text-lg font-bold text-[#082b4c] transition group-hover:text-[#d7192d]">{country.name}</h3>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Destination guide</p>
                    {country.capital && <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={13} className="shrink-0 text-[#d7192d]" />Capital: {country.capital}</p>}
                  </div>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff0f1] text-[#d7192d] transition group-hover:bg-[#d7192d] group-hover:text-white"><ArrowRight size={18} /></span>
              </div>

              <p className="mt-5 min-h-[3.25rem] text-sm leading-6 text-slate-600 line-clamp-2">
                {country.short_description || country.overview || `Explore visa information and travel guidance for ${country.name}.`}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-[#f6f9fc] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400"><BadgeCheck size={13} className="text-[#d7192d]" />Visa categories</div>
                  <p className="mt-1.5 text-lg font-bold text-[#082b4c]">{country.visa_categories.length}</p>
                  <p className="text-[10px] text-slate-500">{country.visa_categories.length === 1 ? "Category listed" : "Categories listed"}</p>
                </div>
                <div className="rounded-2xl bg-[#f6f9fc] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400"><BriefcaseBusiness size={13} className="text-[#d7192d]" />UniGo services</div>
                  <p className="mt-1.5 text-lg font-bold text-[#082b4c]">{country.services.length}</p>
                  <p className="text-[10px] text-slate-500">{country.services.length === 1 ? "Service available" : "Services listed"}</p>
                </div>
              </div>

              <div className="mt-4 min-h-8">
                {country.services.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {country.services.slice(0, 3).map((service) => <span key={service.id} className="rounded-full border border-[#e4eaf0] bg-white px-2.5 py-1 text-[10px] font-medium text-[#526579]">{service.name}</span>)}
                    {country.services.length > 3 && <span className="rounded-full bg-[#fff0f1] px-2.5 py-1 text-[10px] font-semibold text-[#c52a37]">+{country.services.length - 3} more</span>}
                  </div>
                ) : <p className="text-xs text-slate-400">Country-specific services are being updated.</p>}
              </div>

              {country.visa_categories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {country.visa_categories.slice(0, 3).map((category) => <span key={category.id} className="rounded-full border border-[#e4eaf0] bg-[#f8fafc] px-2.5 py-1 text-[10px] font-medium text-[#526579]">{category.name}</span>)}
                </div>
              )}

              <div className="mt-auto flex items-center justify-between border-t border-[#edf1f5] pt-5">
                <span className="text-sm font-bold text-[#082b4c] transition group-hover:text-[#d7192d]">Explore destination</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">UniGo Bangladesh</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#cbd8e4] bg-white px-6 py-16 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0f1] text-[#d7192d]"><Search size={23} /></span>
          <p className="mt-4 text-lg font-bold text-[#082b4c]">No destinations found</p>
          <p className="mt-2 text-sm text-slate-500">Try another country name, letter or visa category.</p>
          <button type="button" onClick={clearFilters} className="mt-5 rounded-xl bg-[#d7192d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b91426]">Reset search</button>
        </div>
      )}

      {filteredCountries.length > 0 && (
        <div className="flex flex-col gap-4 rounded-2xl border border-[#e3eaf1] bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-xs font-medium text-slate-500" aria-live="polite">
            Showing <span className="font-bold text-[#082b4c]">{firstVisibleCountry}–{lastVisibleCountry}</span> of <span className="font-bold text-[#082b4c]">{filteredCountries.length}</span> destinations
          </p>
          {totalPages > 1 && (
            <nav aria-label="Country directory pagination" className="flex flex-wrap items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                aria-label="Go to previous page"
                className="inline-flex h-9 items-center rounded-lg border border-[#dce5ee] px-3 text-xs font-semibold text-[#42566a] transition hover:border-[#d7192d] hover:text-[#d7192d] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-xs font-bold transition ${currentPage === page ? "bg-[#082b4c] text-white shadow-sm" : "border border-[#dce5ee] bg-white text-[#526579] hover:border-[#d7192d] hover:text-[#d7192d]"}`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                aria-label="Go to next page"
                className="inline-flex h-9 items-center rounded-lg border border-[#dce5ee] px-3 text-xs font-semibold text-[#42566a] transition hover:border-[#d7192d] hover:text-[#d7192d] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
