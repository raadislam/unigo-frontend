import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe2, FileCheck2, Headset, PlaneTakeoff } from "lucide-react";

const highlights = [
  { icon: Globe2, title: "Explore destinations", description: "Discover country information and travel options." },
  { icon: FileCheck2, title: "Understand visa options", description: "Learn about categories, requirements and process." },
  { icon: Headset, title: "Get expert support", description: "Receive guidance from planning to application." },
];

export function VisaDirectoryCta() {
  return (
    <section className="overflow-hidden bg-white px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-9 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d7192d]">
              <span className="h-[3px] w-9 rounded-full bg-[#d7192d]" />
              UniGo Visa Directory
            </div>
            <h2 className="mt-5 max-w-xl text-3xl font-bold leading-[1.13] tracking-tight text-[#082b4c] sm:text-4xl lg:text-[48px]">
              Your gateway to <span className="text-[#d7192d]">global travel.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              Explore country-wise visa information, available application options and practical guidance. Let UniGo help you plan your next journey with greater clarity and confidence.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {highlights.map(({ icon: Icon, title, description }, index) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0f2] text-[#d7192d]">
                    <Icon size={19} />
                  </span>
                  <div>
                    <p className="text-xs font-bold leading-5 text-[#082b4c]">{title}</p>
                    <p className="mt-1 text-[11px] leading-5 text-slate-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/visa-services/"
                className="inline-flex items-center gap-2 rounded-xl bg-[#d7192d] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#d7192d]/15 transition hover:-translate-y-0.5 hover:bg-[#b91426]"
              >
                Explore Visa Services <ArrowRight size={17} />
              </Link>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#526579]">
                <PlaneTakeoff size={15} className="text-[#d7192d]" />
                Start planning your journey
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-12 top-8 h-64 w-64 rounded-full bg-[#eaf4fb] blur-3xl" />
            <div className="absolute -bottom-8 left-8 h-40 w-40 rounded-full bg-[#fff0f2] blur-3xl" />
            <div className="relative overflow-hidden rounded-[30px] border border-[#e3ebf2] bg-[#f4f9fd] shadow-[0_22px_60px_rgba(8,43,76,0.13)]">
              <Image
                src="/images/visa-travel-hero.svg"
                alt="UniGo traveller looking towards global destinations"
                width={1200}
                height={820}
                priority={false}
                className="h-auto w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 56vw"
              />
            </div>
            <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-[#e5edf4] bg-white px-4 py-3 shadow-[0_12px_35px_rgba(8,43,76,0.12)] sm:left-10">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#082b4c] text-white"><Globe2 size={19} /></span>
              <div>
                <p className="text-xs font-bold text-[#082b4c]">Discover the world</p>
                <p className="mt-0.5 text-[11px] text-slate-500">One destination at a time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
