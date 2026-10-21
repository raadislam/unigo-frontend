import Link from "next/link";
import {
  ClipboardCheck,
  Compass,
  FileCheck2,
  GraduationCap,
  Plane,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

const services = [
  {
    title: "Study Planning",
    description: "Explore suitable destinations and academic pathways.",
    icon: Compass,
  },
  {
    title: "University Selection",
    description: "Identify programs that fit your academic goals.",
    icon: GraduationCap,
  },
  {
    title: "Application Guidance",
    description: "Understand application steps and required documents.",
    icon: ClipboardCheck,
  },
  {
    title: "Visa Guidance",
    description: "Prepare for the documentation and visa process.",
    icon: FileCheck2,
  },
  {
    title: "Financial Planning",
    description: "Understand tuition, living costs, and budgeting.",
    icon: Wallet,
  },
  {
    title: "Pre-departure Support",
    description: "Prepare for your transition to studying abroad.",
    icon: Plane,
  },
];

export function ServicesSection() {
  return (
    <section className="bg-[#F7FAFE] py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="How we help"
          title="Support for every step of your journey"
          description="From exploring your options to preparing for departure, get guidance to make informed decisions."
          centered
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="group rounded-2xl border border-slate-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg sm:p-7"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-red-50 text-[#D7192D] transition group-hover:bg-[#D7192D] group-hover:text-white">
                <Icon size={23} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-[#082B4C]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {description}
              </p>
              <Link
                href="/services/"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#082B4C] hover:text-[#D7192D]"
              >
                Learn more <ArrowUpRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
