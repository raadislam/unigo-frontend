"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Plane, ArrowRight } from "lucide-react";
import type { Country, VisaCategory } from "@/lib/country-directory";

type Props = {
  countries: Country[];
  categories: Pick<VisaCategory, "name" | "slug">[];
};

const alphabet = ["ALL", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

export function CountryDirectory({ countries, categories }: Props) {
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState("ALL");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredCountries = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return countries.filter((country) => {
      const matchesSearch =
        !normalizedSearch ||
        country.name.toLowerCase().includes(normalizedSearch);

      const matchesLetter =
        activeLetter === "ALL" ||
        country.name.toUpperCase().startsWith(activeLetter);

      const matchesCategory =
        activeCategory === "all" ||
        country.visa_categories.some(
          (category) => category.slug === activeCategory,
        );

      return matchesSearch && matchesLetter && matchesCategory;
    });
  }, [countries, search, activeLetter, activeCategory]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-lg border px-4 py-3 text-left text-sm transition ${activeCategory === "all" ? "border-[#30366f] bg-[#30366f] text-white" : "border-slate-200 bg-white text-slate-700 hover:border-[#30366f]"}`}
        >
          <span className="block font-semibold">All</span>
          <span className="block text-xs opacity-80">({countries.length} Countries)</span>
        </button>

        {categories.map((category) => {
          const count = countries.filter((country) =>
            country.visa_categories.some((item) => item.slug === category.slug),
          ).length;

          return (
            <button
              type="button"
              key={category.slug}
              onClick={() => setActiveCategory(category.slug)}
              className={`rounded-lg border px-4 py-3 text-left text-sm transition ${activeCategory === category.slug ? "border-[#30366f] bg-[#30366f] text-white" : "border-slate-200 bg-white text-slate-700 hover:border-[#30366f]"}`}
            >
              <span className="block font-semibold">{category.name}</span>
              <span className="block text-xs opacity-80">({count} Countries)</span>
            </button>
          );
        })}
      </div>

      <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <Search size={19} className="shrink-0 text-slate-400" />
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setActiveLetter("ALL");
          }}
          placeholder="Search by country name..."
          aria-label="Search countries"
          className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <span className="mr-2 text-xs font-medium text-slate-500">Search by Country</span>
        {alphabet.map((letter) => (
          <button
            type="button"
            key={letter}
            onClick={() => {
              setActiveLetter(letter);
              setSearch("");
            }}
            aria-pressed={activeLetter === letter}
            className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm transition ${activeLetter === letter ? "bg-[#30366f] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
          >
            {letter}
          </button>
        ))}
      </div>

      {filteredCountries.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filteredCountries.map((country) => (
            <Link
              href={`/visa-services/${country.slug}/`}
              key={country.id}
              className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="text-2xl" aria-hidden="true">{country.flag_emoji || "🌍"}</span>
                <h2 className="text-sm font-semibold text-slate-900 group-hover:text-[#30366f]">
                  {country.name}
                </h2>
              </div>

              <div className="pt-3">
                <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                  <Plane size={14} />
                  <span>Available Services</span>
                  <span className="rounded border border-green-300 px-1.5 py-0.5 text-[11px] text-green-700">
                    {country.services.length}
                  </span>
                </div>

                <div className="space-y-1.5 border-l-2 border-dotted border-slate-300 pl-3 text-xs text-slate-700">
                  {country.services.slice(0, 2).map((service) => (
                    <p key={service.id}>{service.name}</p>
                  ))}
                  {country.services.length === 0 && (
                    <p className="text-slate-400">Service information coming soon</p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {country.visa_categories.slice(0, 2).map((category) => (
                  <span key={category.id} className="rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-600">
                    {category.name}
                  </span>
                ))}
              </div>

              <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#30366f]">
                Explore country <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
          <p className="font-semibold text-slate-800">No countries found</p>
          <p className="mt-2 text-sm text-slate-500">Try another country name, letter or visa category.</p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActiveLetter("ALL");
              setActiveCategory("all");
            }}
            className="mt-4 rounded-lg bg-[#30366f] px-4 py-2 text-sm font-semibold text-white"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
