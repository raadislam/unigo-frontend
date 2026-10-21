"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Search, Phone } from "lucide-react";
import { navigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { ConsultationButton } from "@/components/shared/consultation-button";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

export function SiteHeader() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[82px] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <Link href="/" aria-label="UniGo homepage" className="shrink-0">
          <span className="text-[32px] font-black tracking-[-0.07em] text-[#082B4C]">
            Uni<span className="text-[#D7192D]">Go</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {navigation.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => item.children && setExpanded(item.label)}
              onMouseLeave={() => setExpanded(null)}
            >
              <div className="flex items-center gap-1">
                <Link
                  href={item.href}
                  className="py-3 text-[13px] font-semibold text-slate-700 transition hover:text-[#D7192D]"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded(expanded === item.label ? null : item.label)
                    }
                    aria-label={`Toggle ${item.label} submenu`}
                    className="text-slate-500"
                  >
                    <ChevronDown size={14} />
                  </button>
                )}
              </div>
              {item.children && expanded === item.label && (
                <div className="absolute left-0 top-full w-56 rounded-xl border border-slate-100 bg-white p-2 shadow-xl">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#D7192D]"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
            className="flex size-10 items-center justify-center rounded-full text-[#082B4C] transition hover:bg-slate-100"
          >
            <Search size={19} />
          </button>
          <a
            href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
            className="hidden h-11 items-center gap-2 rounded-full border border-slate-200 px-4 text-xs font-bold text-[#082B4C] 2xl:flex"
          >
            <Phone size={15} />
            {siteConfig.phone}
          </a>
          <ConsultationButton />
        </div>

        <MobileNavigation />
      </div>

      {searchOpen && (
        <form
          action="/search/"
          className="border-t border-slate-100 bg-white px-5 py-4"
        >
          <div className="mx-auto flex max-w-3xl gap-3">
            <input
              name="q"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search destinations, services and articles..."
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#082B4C]"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#082B4C] px-5 py-3 text-sm font-semibold text-white"
            >
              Search
            </button>
          </div>
        </form>
      )}
    </header>
  );
}
