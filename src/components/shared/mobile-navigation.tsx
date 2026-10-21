"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { navigation } from "@/config/navigation";
import { ConsultationButton } from "@/components/shared/consultation-button";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        className="flex size-11 items-center justify-center rounded-full border border-slate-200 text-[#082B4C]"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 border-t border-slate-100 bg-white px-5 pb-6 pt-3 shadow-xl">
          <nav className="mx-auto max-w-[1240px]">
            {navigation.map((item) => (
              <div key={item.href} className="border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="py-4 text-sm font-semibold text-[#082B4C]"
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
                      className="p-3 text-[#082B4C]"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${expanded === item.label ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>
                {item.children && expanded === item.label && (
                  <div className="pb-3 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="block py-2.5 text-sm text-slate-600 hover:text-[#D7192D]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <ConsultationButton className="mt-5 w-full" href="/contact/" />
          </nav>
        </div>
      )}
    </div>
  );
}
