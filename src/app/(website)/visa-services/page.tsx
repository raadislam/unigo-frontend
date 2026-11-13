import type { Metadata } from "next";
import { CountryDirectory } from "@/components/visa-services/country-directory";
import { getCountryDirectory } from "@/lib/country-directory";

export const metadata: Metadata = {
  title: "Visa Services by Country",
  description:
    "Explore visa categories and travel assistance by destination. Find country-specific visa guidance and services from UniGo Bangladesh.",
  alternates: {
    canonical: "/visa-services/",
  },
  openGraph: {
    title: "Visa Services by Country | UniGo Bangladesh",
    description:
      "Explore country-specific visa information, application guidance and travel services with UniGo Bangladesh.",
    url: "https://unigo-bd.com/visa-services/",
    type: "website",
  },
};

export default async function VisaServicesPage() {
  const directory = await getCountryDirectory();

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium tracking-wide text-slate-500">
            Discover the World
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-[42px]">
            Find visa services for{" "}
            <span className="text-[#2563eb]">189+ countries</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Explore destination-specific visa information, available services and application guidance from UniGo Bangladesh.
          </p>
        </div>

        <CountryDirectory
          countries={directory.data}
          categories={directory.meta.filters.categories}
        />
      </div>
    </section>
  );
}
