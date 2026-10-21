import { CheckCircle2, Compass, Globe2, Users } from "lucide-react";
import { Container } from "@/components/shared/container";
import { ConsultationButton } from "@/components/shared/consultation-button";

const benefits = [
  "Guidance tailored to your goals",
  "Clear explanations of the next steps",
  "Support with application preparation",
  "Help comparing study destinations",
];

export function WhyUnigoSection() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative overflow-hidden rounded-3xl bg-[#082B4C] p-8 text-white sm:p-12">
            <div className="absolute -right-12 -top-12 size-52 rounded-full border border-white/10" />
            <div className="absolute -right-4 -top-4 size-36 rounded-full border border-white/10" />

            <div className="relative grid grid-cols-2 gap-4">
              {[
                { icon: Globe2, title: "Global outlook" },
                { icon: Users, title: "Personal guidance" },
                { icon: Compass, title: "Clear direction" },
                { icon: CheckCircle2, title: "Informed choices" },
              ].map(({ icon: Icon, title }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-5"
                >
                  <Icon size={25} className="text-[#FF7A89]" />
                  <p className="mt-4 text-sm font-semibold">{title}</p>
                </div>
              ))}
            </div>

            <p className="relative mt-7 text-sm leading-7 text-slate-300">
              Every student's journey is different. We help you explore
              available options and understand the decisions ahead.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#D7192D]">
              Why UniGo
            </p>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#082B4C] sm:text-4xl">
              Make your next step an informed one
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              International education can involve many choices. UniGo helps you
              understand the process, explore your options, and plan your next
              steps with greater clarity.
            </p>

            <div className="mt-7 grid gap-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />
                  <p className="text-sm font-medium text-slate-700">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>

            <ConsultationButton className="mt-8" />
          </div>
        </div>
      </Container>
    </section>
  );
}
