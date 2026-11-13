import Link from "next/link";
import { ArrowRight, Globe2 } from "lucide-react";

export function VisaDirectoryCta() {
  return (
    <section className="bg-slate-50 px-5 py-14 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:flex-row sm:p-10">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Globe2 size={24} />
          </span>
          <div>
            <p className="text-sm font-semibold text-blue-700">Discover the World</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Explore visa services by country
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Browse destinations, available visa categories and UniGo assistance in one place.
            </p>
          </div>
        </div>
        <Link
          href="/visa-services/"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#30366f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#242956]"
        >
          Explore Countries <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
