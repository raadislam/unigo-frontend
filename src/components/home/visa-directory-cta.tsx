import Link from "next/link";
import { ArrowRight, Globe2, FileCheck2, Headset, PlaneTakeoff } from "lucide-react";

const highlights = [
  { icon: Globe2, title: "Explore destinations", description: "Discover country information and travel options." },
  { icon: FileCheck2, title: "Understand visa options", description: "Learn about categories, requirements and process." },
  { icon: Headset, title: "Get expert support", description: "Receive guidance from planning to application." },
];

export function VisaDirectoryCta() {
  return (
    <section className="relative isolate overflow-hidden bg-[#082b4c] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_82%_18%,rgba(44,112,160,0.42),transparent_36%),radial-gradient(ellipse_at_8%_100%,rgba(215,25,45,0.20),transparent_34%)]" />
      <div className="absolute -right-32 top-[-180px] -z-10 h-[520px] w-[520px] rounded-full border border-white/[0.07]" />
      <div className="absolute -right-12 top-[-100px] -z-10 h-[360px] w-[360px] rounded-full border border-white/[0.07]" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff8791]">
            <span className="h-[3px] w-9 rounded-full bg-[#e21b32]" />
            UniGo Visa Directory
          </div>
          <h2 className="mt-5 max-w-xl text-3xl font-bold leading-[1.13] tracking-tight text-white sm:text-4xl lg:text-[48px]">
            Your gateway to <span className="text-[#ff5367]">global travel.</span>
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
            Explore country-wise visa information, available application options and practical guidance. Let UniGo help you plan your next journey with greater clarity and confidence.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {highlights.map(({ icon: Icon, title, description }, index) => (
              <div key={title} className={`flex items-start gap-3 ${index > 0 ? "sm:border-l sm:border-white/15 sm:pl-4" : ""}`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-[#ff8791]">
                  <Icon size={19} />
                </span>
                <div>
                  <p className="text-xs font-bold leading-5 text-white">{title}</p>
                  <p className="mt-1 text-[11px] leading-5 text-white/65">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link
              href="/visa-services/"
              className="inline-flex items-center gap-2 rounded-xl bg-[#d7192d] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#b91426]"
            >
              Explore Visa Services <ArrowRight size={17} />
            </Link>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/75">
              <PlaneTakeoff size={16} className="text-[#ff8791]" />
              Start planning your journey
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-[34px] bg-[#2b6f9e]/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-[#123c5e] p-2 shadow-[0_28px_70px_rgba(0,0,0,0.28)]">
            <img
              src="https://cdn2.enuygun.com/media/lib/1200x675/uploads/image/paris-sokaklarinda-gezgin-66655.webp"
              alt="Traveller exploring Paris with the Eiffel Tower in the background"
              className="h-[300px] w-full rounded-[21px] object-cover sm:h-[390px] lg:h-[430px]"
              loading="lazy"
            />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4 rounded-2xl border border-white/20 bg-[#082b4c]/90 px-4 py-3 text-white shadow-xl backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7 sm:px-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d7192d] text-white"><Globe2 size={19} /></span>
                <div>
                  <p className="text-xs font-bold">Discover the world</p>
                  <p className="mt-0.5 text-[11px] text-white/65">One destination at a time</p>
                </div>
              </div>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.15em] text-[#ff8791] sm:block">Explore with UniGo</span>
            </div>
          </div>
          <div className="absolute -bottom-3 -right-3 -z-10 h-24 w-24 rounded-br-[28px] border-b-4 border-r-4 border-[#d7192d]" />
        </div>
      </div>
    </section>
  );
}
