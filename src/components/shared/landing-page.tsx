import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { ConsultationButton } from "@/components/shared/consultation-button";

type LandingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function LandingPage({ eyebrow, title, description }: LandingPageProps) {
  return (
    <>
      <section className="bg-[#F7FAFE] py-20 sm:py-28">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#D7192D]">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#082B4C] sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ConsultationButton />
              <Link
                href="/destinations/"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#082B4C]"
              >
                Explore destinations <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
