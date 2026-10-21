import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

const destinations = [
  {
    name: "Canada",
    code: "ca",
    description: "Explore universities and colleges across Canada.",
    href: "/study-abroad/canada/",
  },
  {
    name: "United Kingdom",
    code: "gb",
    description: "Discover established universities and diverse programs.",
    href: "/study-abroad/uk/",
  },
  {
    name: "Australia",
    code: "au",
    description: "Find programs in a vibrant, international community.",
    href: "/study-abroad/australia/",
  },
  {
    name: "United States",
    code: "us",
    description: "Explore a wide range of academic pathways.",
    href: "/study-abroad/usa/",
  },
];

export function DestinationsSection() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Explore destinations"
            title="A world of possibilities"
            description="Find a destination that matches your academic goals and plans for the future."
          />
          <Link
            href="/destinations/"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#082B4C] hover:text-[#D7192D]"
          >
            View all destinations <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination) => (
            <Link
              key={destination.code}
              href={destination.href}
              className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl"
            >
              <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-[#EAF2FC] to-[#F8FAFD]">
                <div className="absolute size-36 rounded-full border border-blue-200/60 transition duration-500 group-hover:scale-110" />
                <div className="absolute size-28 rounded-full border border-blue-200/50" />
                <img
                  src={`https://flagcdn.com/w160/${destination.code}.png`}
                  alt={`${destination.name} flag`}
                  width={96}
                  height={64}
                  className="relative rounded-md object-cover shadow-lg transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#082B4C]">
                  {destination.name}
                </h3>
                <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-600">
                  {destination.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#D7192D]">
                  Explore destination <ArrowUpRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
