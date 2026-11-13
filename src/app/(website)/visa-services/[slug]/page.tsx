import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Plane, FileText } from "lucide-react";
import { getCountry, getCountryDirectory, type Country } from "@/lib/country-directory";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const directory = await getCountryDirectory();

  return directory.data.map((country) => ({
    slug: country.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const country = await getCountry(slug);

    return {
      title: country.seo_title || `${country.name} Visa Services from Bangladesh`,
      description:
        country.seo_description ||
        `Explore visa information and available application guidance for ${country.name} from UniGo Bangladesh.`,
      keywords: country.seo_keywords || undefined,
      alternates: {
        canonical: `/visa-services/${country.slug}/`,
      },
      openGraph: {
        title: country.seo_title || `${country.name} Visa Services | UniGo`,
        description:
          country.seo_description ||
          `Explore ${country.name} visa information and UniGo services.`,
        url: `https://unigo-bd.com/visa-services/${country.slug}/`,
        type: "article",
      },
    };
  } catch {
    return {
      title: "Country Visa Services | UniGo Bangladesh",
      robots: { index: false, follow: false },
    };
  }
}

export default async function CountryVisaPage({ params }: Props) {
  const { slug } = await params;
  let country: Country;

  try {
    country = await getCountry(slug);
  } catch {
    notFound();
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://unigo-bd.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Visa Services",
        item: "https://unigo-bd.com/visa-services/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: country.name,
        item: `https://unigo-bd.com/visa-services/${country.slug}/`,
      },
    ],
  };

  return (
    <article className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-[#D7192D]">Home</Link>
          <ChevronRight size={13} />
          <Link href="/visa-services/" className="hover:text-[#D7192D]">Visa Services</Link>
          <ChevronRight size={13} />
          <span className="font-medium text-slate-800">{country.name}</span>
        </nav>

        <header className="border-b border-slate-200 pb-9">
          <div className="flex items-center gap-4">
            <span className="text-5xl" aria-hidden="true">{country.flag_emoji || "🌍"}</span>
            <div>
              <p className="text-sm font-medium text-slate-500">Visa services from Bangladesh</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {country.name} Visa Services
              </h1>
            </div>
          </div>
          {country.short_description && (
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600">
              {country.short_description}
            </p>
          )}
        </header>

        {country.overview && (
          <section className="prose prose-slate mt-10 max-w-none">
            <h2>About travelling to {country.name}</h2>
            <p className="whitespace-pre-line">{country.overview}</p>
          </section>
        )}

        <section className="mt-10">
          <div className="mb-5 flex items-center gap-3">
            <Plane className="text-[#30366f]" size={21} />
            <h2 className="text-xl font-semibold text-slate-900">Visa categories</h2>
          </div>
          {country.visa_categories.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {country.visa_categories.map((category) => (
                <div key={category.id} className="rounded-xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">{category.name}</h3>
                  {category.description && <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>}
                  {category.pivot?.availability_note && <p className="mt-3 text-sm text-slate-600">{category.pivot.availability_note}</p>}
                  {category.pivot?.application_method && <p className="mt-2 text-xs font-medium text-slate-500">Application method: {category.pivot.application_method}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
              Visa category information is being reviewed. Contact UniGo for assistance with your travel plans.
            </p>
          )}
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center gap-3">
            <FileText className="text-[#30366f]" size={21} />
            <h2 className="text-xl font-semibold text-slate-900">UniGo services</h2>
          </div>
          {country.services.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {country.services.map((service) => (
                <div key={service.id} className="rounded-xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">{service.name}</h3>
                  {(service.pivot?.description || service.description) && (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {service.pivot?.description || service.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
              Contact UniGo to discuss the services available for {country.name}.
            </p>
          )}
        </section>

        {country.visa_information && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Visa information</h2>
            <p className="whitespace-pre-line text-sm leading-7 text-slate-600">{country.visa_information}</p>
          </section>
        )}

        <section className="mt-12 rounded-2xl bg-[#082B4C] p-7 text-white sm:p-9">
          <h2 className="text-2xl font-semibold">Planning a trip to {country.name}?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
            Speak with UniGo about your travel plans and the guidance available for your destination.
          </p>
          <Link href="/contact/" className="mt-6 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#082B4C] transition hover:bg-slate-100">
            Contact UniGo
          </Link>
        </section>
      </div>
    </article>
  );
}
