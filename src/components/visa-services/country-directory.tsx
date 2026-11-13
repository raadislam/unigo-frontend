"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, Plane, ArrowRight, Globe2, SlidersHorizontal } from "lucide-react";
import { getCountryDirectory, type Country, type VisaCategory } from "@/lib/country-directory";

const alphabet = ["ALL", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

export function CountryDirectory() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [categories, setCategories] = useState<Pick<VisaCategory, "name" | "slug">[]>([]);
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState("ALL");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    getCountryDirectory().then((directory) => {
      if (!active) return;
      setCountries(directory.data);
      setCategories(directory.meta.filters.categories);
      setError(!directory.success);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [attempt]);

  const filteredCountries = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return countries.filter((country) => {
      const matchesSearch = !normalizedSearch || country.name.toLowerCase().includes(normalizedSearch);
      const matchesLetter = activeLetter === "ALL" || country.name.toUpperCase().startsWith(activeLetter);
      const matchesCategory = activeCategory === "all" || country.visa_categories.some((category) => category.slug === activeCategory);
      return matchesSearch && matchesLetter && matchesCategory;
    });
  }, [countries, search, activeLetter, activeCategory]);

  const clearFilters = () => {
    setSearch("");
    setActiveLetter("ALL");
    setActiveCategory("all");
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
              onChange={(event) => { setSearch(event.target.value); setActiveLetter("ALL"); }}
              placeholder="Search a country..."
              aria-label="Search countries"
              className="h-12 w-full rounded-xl border border-[#dce5ee] bg-[#f8fafc] pl-11 pr-4 text-sm text-[#082b4c] outline-none transition placeholder:text-slate-400 focus:border-[#d7192d] focus:bg-white focus:ring-4 focus:ring-[#d7192d]/10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setActiveCategory("all")} className={`rounded-full border px-4 py-2.5 text-xs font-semibold transition ${activeCategory === "all" ? "border-[#082b4c] bg-[#082b4c] text-white shadow-sm" : "border-[#dce5ee] bg-white text-[#42566a] hover:border-[#d7192d] hover:text-[#d7192d]"}`}>
            All destinations <span className="ml-1 opacity-70">({countries.length})</span>
          </button>
          {categories.map((category) => {
            const count = countries.filter((country) => country.visa_categories.some((item) => item.slug === category.slug)).length;
            return (
              <button key={category.slug} type="button" onClick={() => setActiveCategory(category.slug)} className={`rounded-full border px-4 py-2.5 text-xs font-semibold transition ${activeCategory === category.slug ? "border-[#082b4c] bg-[#082b4c] text-white shadow-sm" : "border-[#dce5ee] bg-white text-[#42566a] hover:border-[#d7192d] hover:text-[#d7192d]"}`}>
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
              <button key={letter} type="button" onClick={() => { setActiveLetter(letter); setSearch(""); }} aria-pressed={activeLetter === letter} className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-bold transition ${activeLetter === letter ? "bg-[#d7192d] text-white shadow-sm" : "bg-[#f1f5f9] text-[#526579] hover:bg-[#e4ebf2] hover:text-[#082b4c]"}`}>
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

      {loading ? (
        <div className="rounded-3xl border border-[#e3eaf1] bg-white px-6 py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#d7192d]/20 border-t-[#d7192d]" />
          <p className="mt-4 text-sm font-medium text-[#526579]">Loading destinations...</p>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-dashed border-[#cbd8e4] bg-white px-6 py-16 text-center">
          <p className="text-lg font-bold text-[#082b4c]">Unable to load destinations</p>
          <p className="mt-2 text-sm text-slate-500">Please check your connection and try again.</p>
          <button type="button" onClick={() => { setLoading(true); setError(false); setAttempt((value) => value + 1); }} className="mt-5 rounded-xl bg-[#d7192d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b91426]">Try again</button>
        </div>
      ) : filteredCountries.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCountries.map((country) => (
            <Link href={`/visa-services/${country.slug}/`} key={country.id} className="group relative overflow-hidden rounded-2xl border border-[#e3eaf1] bg-white p-5 shadow-[0_8px_28px_rgba(8,43,76,0.045)] transition duration-300 hover:-translate-y-1 hover:border-[#d7192d]/40 hover:shadow-[0_18px_42px_rgba(8,43,76,0.11)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#082b4c] via-[#d7192d] to-[#f5a0a8] opacity-0 transition group-hover:opacity-100" />
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f3f7fb] text-3xl ring-1 ring-[#e7edf3]" aria-hidden="true">{country.flag_emoji || "🌍"}</span>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-[#082b4c] transition group-hover:text-[#d7192d]">{country.name}</h3>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">Visa information</p>
                  </div>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff0f1] text-[#d7192d] transition group-hover:bg-[#d7192d] group-hover:text-white"><ArrowRight size={16} /></span>
              </div>

              <div className="mt-5 rounded-xl bg-[#f7fafe] p-3.5">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#082b4c]">
                  <Plane size={14} className="text-[#d7192d]" />
                  UniGo services
                  <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#d7192d] ring-1 ring-[#e6edf4]">{country.services.length}</span>
                </div>
                {country.services.length ? (
                  <div className="space-y-1.5">
                    {country.services.slice(0, 2).map((service) => <p key={service.id} className="text-xs text-slate-600">{service.name}</p>)}
                    {country.services.length > 2 && <p className="text-[11px] font-semibold text-[#d7192d]">+{country.services.length - 2} more services</p>}
                  </div>
                ) : <p className="text-xs text-slate-400">Service information coming soon</p>}
              </div>

              <div className="mt-4 flex min-h-6 flex-wrap gap-1.5">
                {country.visa_categories.slice(0, 3).map((category) => <span key={category.id} className="rounded-full border border-[#e4eaf0] bg-white px-2.5 py-1 text-[10px] font-medium text-[#526579]">{category.name}</span>)}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-[#edf1f5] pt-4">
                <span className="text-xs font-bold text-[#082b4c] transition group-hover:text-[#d7192d]">Explore destination</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">UniGo Bangladesh</span>
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
    </div>
  );
}
