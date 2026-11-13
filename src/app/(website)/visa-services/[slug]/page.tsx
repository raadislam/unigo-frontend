import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Plane, FileText, ArrowLeft, Headphones, ShieldCheck, Globe2 } from "lucide-react";
import { getCountry, getCountryDirectory, type Country } from "@/lib/country-directory";

type Props = { params: Promise<{ slug: string }> };
const EMPTY_DIRECTORY_SLUG = "__no_published_countries__";

export const dynamicParams = false;

export async function generateStaticParams() {
  const directory = await getCountryDirectory();
  if (!directory.data.length) return [{ slug: EMPTY_DIRECTORY_SLUG }];
  return directory.data.map((country) => ({ slug: country.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === EMPTY_DIRECTORY_SLUG) {
    return {
      title: "Country Visa Directory | UniGo Bangladesh",
      description: "Explore country visa information and travel services from UniGo Bangladesh.",
      robots: { index: false, follow: false },
    };
  }
  try {
    const country = await getCountry(slug);
    return {
      title: country.seo_title || `${country.name} Visa Services from Bangladesh`,
      description: country.seo_description || `Explore visa information and available application guidance for ${country.name} from UniGo Bangladesh.`,
      keywords: country.seo_keywords || undefined,
      alternates: { canonical: `/visa-services/${country.slug}/` },
      openGraph: {
        title: country.seo_title || `${country.name} Visa Services | UniGo`,
        description: country.seo_description || `Explore ${country.name} visa information and UniGo services.`,
        url: `https://unigo-bd.com/visa-services/${country.slug}/`,
        type: "article",
      },
    };
  } catch {
    return { title: "Country Visa Services | UniGo Bangladesh", robots: { index: false, follow: false } };
  }
}

export default async function CountryVisaPage({ params }: Props) {
  const { slug } = await params;
  if (slug === EMPTY_DIRECTORY_SLUG) {
    return (
      <main className="min-h-[60vh] bg-[#f7fafe] px-5 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#e3eaf1] bg-white p-8 shadow-sm sm:p-12">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0f1] text-[#d7192d]"><Globe2 size={23} /></span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#d7192d]">UniGo Visa Services</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#082b4c] sm:text-4xl">Country information is being prepared</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">Our destination directory is currently being updated. Browse the directory or contact UniGo for assistance with your travel plans.</p>
          <Link href="/visa-services/" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#d7192d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b91426]"><ArrowLeft size={16} /> Browse visa services</Link>
        </div>
      </main>
    );
  }

  let country: Country;
  try { country = await getCountry(slug); } catch { notFound(); }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://unigo-bd.com/" },
      { "@type": "ListItem", position: 2, name: "Visa Services", item: "https://unigo-bd.com/visa-services/" },
      { "@type": "ListItem", position: 3, name: country.name, item: `https://unigo-bd.com/visa-services/${country.slug}/` },
    ],
  };

  return (
    <main className="bg-[#f7fafe]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <section className="relative isolate overflow-hidden bg-[#082b4c]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_10%,rgba(215,25,45,0.27),transparent_32%),radial-gradient(circle_at_10%_100%,rgba(64,128,177,0.22),transparent_40%)]" />
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-9 flex flex-wrap items-center gap-2 text-xs text-white/60">
            <Link href="/" className="transition hover:text-white">Home</Link><ChevronRight size={13} />
            <Link href="/visa-services/" className="transition hover:text-white">Visa Services</Link><ChevronRight size={13} />
            <span className="font-semibold text-white">{country.name}</span>
          </nav>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-5xl shadow-lg backdrop-blur">{country.flag_emoji || "🌍"}</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff8791]">Visa services from Bangladesh</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{country.name} Visa Services</h1>
              {country.short_description && <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">{country.short_description}</p>}
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-[#d7192d] via-[#f36a78] to-transparent" />
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {country.overview && <section className="rounded-2xl border border-[#e3eaf1] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0f1] text-[#d7192d]"><Globe2 size={19} /></span><h2 className="text-xl font-bold text-[#082b4c]">About travelling to {country.name}</h2></div>
          <p className="whitespace-pre-line text-sm leading-8 text-slate-600">{country.overview}</p>
        </section>}

        <section className="mt-8">
          <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0f1] text-[#d7192d]"><Plane size={19} /></span><div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d7192d]">Entry options</p><h2 className="text-xl font-bold text-[#082b4c]">Visa categories</h2></div></div>
          {country.visa_categories.length ? <div className="grid gap-4 sm:grid-cols-2">
            {country.visa_categories.map((category) => <div key={category.id} className="rounded-2xl border border-[#e3eaf1] bg-white p-6 shadow-sm transition hover:border-[#d7192d]/40 hover:shadow-md">
              <h3 className="font-bold text-[#082b4c]">{category.name}</h3>
              {category.description && <p className="mt-2 text-sm leading-7 text-slate-500">{category.description}</p>}
              {category.pivot?.availability_note && <p className="mt-3 rounded-lg bg-[#f7fafe] p-3 text-sm leading-6 text-slate-600">{category.pivot.availability_note}</p>}
              {category.pivot?.application_method && <p className="mt-3 text-xs font-semibold text-[#526579]">Application method: {category.pivot.application_method}</p>}
            </div>)}
          </div> : <p className="rounded-2xl border border-dashed border-[#cbd8e4] bg-white p-6 text-sm leading-7 text-slate-500">Visa category information is being reviewed. Contact UniGo for assistance with your travel plans.</p>}
        </section>

        <section className="mt-9">
          <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0f1] text-[#d7192d]"><FileText size={19} /></span><div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d7192d]">How we can help</p><h2 className="text-xl font-bold text-[#082b4c]">UniGo services</h2></div></div>
          {country.services.length ? <div className="grid gap-4 sm:grid-cols-2">
            {country.services.map((service) => <div key={service.id} className="rounded-2xl border border-[#e3eaf1] bg-white p-6 shadow-sm"><h3 className="font-bold text-[#082b4c]">{service.name}</h3>{(service.pivot?.description || service.description) && <p className="mt-2 text-sm leading-7 text-slate-500">{service.pivot?.description || service.description}</p>}</div>)}
          </div> : <p className="rounded-2xl border border-dashed border-[#cbd8e4] bg-white p-6 text-sm leading-7 text-slate-500">Contact UniGo to discuss the services available for {country.name}.</p>}
        </section>

        {country.visa_information && <section className="mt-9 rounded-2xl border border-[#e3eaf1] bg-white p-6 shadow-sm sm:p-8"><h2 className="mb-4 text-xl font-bold text-[#082b4c]">Visa information</h2><p className="whitespace-pre-line text-sm leading-8 text-slate-600">{country.visa_information}</p></section>}

        <section className="relative mt-10 overflow-hidden rounded-3xl bg-[#082b4c] p-7 text-white shadow-xl shadow-[#082b4c]/10 sm:p-10">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -right-2 -top-10 h-44 w-44 rounded-full border border-white/10" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ff8791]"><ShieldCheck size={15} /> Your journey, guided by UniGo</span>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Planning a trip to {country.name}?</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">Speak with our team about your travel plans and the guidance available for your destination.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact/" className="inline-flex items-center gap-2 rounded-xl bg-[#d7192d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b91426]"><Headphones size={16} /> Contact UniGo</Link>
              <Link href="/visa-services/" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"><ArrowLeft size={15} /> All destinations</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
