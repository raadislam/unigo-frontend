import Link from "next/link";
import { ArrowRight, Globe2, MapPin, FileCheck2, Headset, Sparkles } from "lucide-react";

const highlights = [
  { icon: MapPin, title: "Explore destinations", description: "Browse country-specific information" },
  { icon: FileCheck2, title: "Understand visa options", description: "Review available visa categories" },
  { icon: Headset, title: "Get guided support", description: "Connect with the UniGo team" },
];

export function VisaDirectoryCta() {
  return (
    <section className="bg-[#f7fafe] px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-[#e1e9f1] bg-white shadow-[0_18px_55px_rgba(8,43,76,0.08)]">
        <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[radial-gradient(circle_at_75%_20%,rgba(215,25,45,0.12),transparent_38%),linear-gradient(135deg,#f7fafe,#eef4fa)] lg:block" />
        <div className="relative grid lg:grid-cols-[1.25fr_0.75fr]">
          <div className="p-7 sm:p-10 lg:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f5d4d8] bg-[#fff5f6] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#c8172b]">
              <Sparkles size={13} />
              Your journey, made clearer
            </div>

            <h2 className="mt-5 max-w-xl text-2xl font-bold leading-tight tracking-tight text-[#082b4c] sm:text-3xl lg:text-[36px]">
              Find the right destination for your next journey
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              Explore visa information by country, understand the available application options and discover how UniGo can guide you through your travel plans.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {highlights.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-3 sm:block">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fdf0f2] text-[#d7192d] sm:mb-3">
                    <Icon size={17} />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#082b4c]">{title}</p>
                    <p className="mt-1 text-[11px] leading-5 text-slate-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/visa-services/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d7192d] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#d7192d]/15 transition hover:-translate-y-0.5 hover:bg-[#b91426]"
              >
                Explore visa services <ArrowRight size={16} />
              </Link>
              <span className="text-xs font-medium text-slate-500">Choose a country to get started</span>
            </div>
          </div>

          <div className="relative hidden min-h-[340px] items-center justify-center p-8 lg:flex">
            <div className="absolute right-[-54px] top-[-54px] h-72 w-72 rounded-full border border-[#dce6ef]" />
            <div className="absolute right-[-12px] top-[-12px] h-52 w-52 rounded-full border border-[#dce6ef]" />
            <div className="relative w-full max-w-[300px] rounded-3xl border border-white bg-white/90 p-6 shadow-[0_20px_55px_rgba(8,43,76,0.12)] backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#082b4c] text-white">
                  <Globe2 size={25} />
                </span>
                <span className="rounded-full bg-[#edf7f1] px-3 py-1.5 text-[10px] font-bold text-[#28734b]">Explore with confidence</span>
              </div>
              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-[#d7192d]">UniGo destination guide</p>
              <h3 className="mt-2 text-xl font-bold leading-snug text-[#082b4c]">Your plans. Your destination. Our guidance.</h3>
              <p className="mt-3 text-xs leading-6 text-slate-500">A clearer starting point for understanding country-specific visa information and support.</p>
              <div className="mt-5 flex items-center gap-2 border-t border-[#edf1f5] pt-4">
                <span className="h-2 w-2 rounded-full bg-[#d7192d]" />
                <span className="text-[11px] font-semibold text-[#526579]">Discover the possibilities</span>
                <ArrowRight size={14} className="ml-auto text-[#d7192d]" />
              </div>
            </div>
          </div>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-[#082b4c] via-[#d7192d] to-[#f4a1a9]" />
      </div>
    </section>
  );
}
