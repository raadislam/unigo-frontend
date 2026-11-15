"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, ChevronRight, FileText, Globe2, Headphones, MapPin, Plane, ShieldCheck } from "lucide-react";
import { getCountry, getVisaRequirement, type Country, type VisaRequirement } from "@/lib/country-directory";
import { CountryFlag } from "@/components/shared/country-flag";

function formatPhotoValue(value: unknown, unit?: string): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((item) => formatPhotoValue(item)).filter(Boolean).join(", ");
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (record.width !== undefined && record.height !== undefined) {
      const resolvedUnit = typeof record.unit === "string" && record.unit.trim() ? record.unit.trim() : unit;
      return `${formatPhotoValue(record.width)} × ${formatPhotoValue(record.height)}${resolvedUnit ? ` ${resolvedUnit}` : ""}`;
    }
    return Object.entries(record)
      .map(([key, item]) => {
        const formatted = formatPhotoValue(item);
        return formatted ? `${key.replaceAll("_", " ")}: ${formatted}` : "";
      })
      .filter(Boolean)
      .join("; ");
  }
  return "";
}

export function CountryVisaPageClient({ slug, initialCountry, initialRequirement }: { slug: string; initialCountry: Country; initialRequirement: VisaRequirement | null }) {
  const [country, setCountry] = useState<Country | null>(initialCountry);
  const [loading, setLoading] = useState(false);
  const [requirement, setRequirement] = useState<VisaRequirement | null>(initialRequirement);
  const [requirementError, setRequirementError] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadDestination() {
      try {
        const data = await getCountry(slug);
        if (!active) return;
        setCountry(data);

        try {
          const visaData = await getVisaRequirement(data.iso2);
          if (active) setRequirement(visaData);
        } catch {
          if (active) setRequirementError(true);
        }
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDestination();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#f7fafe] px-5 py-16">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-56 rounded-3xl bg-[#082b4c]/10" />
          <div className="h-40 rounded-2xl bg-white" />
          <div className="grid gap-4 sm:grid-cols-2"><div className="h-36 rounded-2xl bg-white" /><div className="h-36 rounded-2xl bg-white" /></div>
        </div>
      </main>
    );
  }

  if (error || !country) {
    return (
      <main className="flex min-h-[65vh] items-center bg-[#f7fafe] px-5 py-16">
        <div className="mx-auto w-full max-w-2xl rounded-3xl border border-[#e3eaf1] bg-white p-8 text-center shadow-sm sm:p-12">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0f1] text-[#d7192d]"><Globe2 size={25} /></span>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#d7192d]">UniGo destination guide</p>
          <h1 className="mt-3 text-2xl font-bold text-[#082b4c]">Destination information is temporarily unavailable</h1>
          <p className="mt-3 text-sm leading-7 text-slate-500">We could not load the latest information for this destination. Please try again or contact our team for assistance.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => window.location.reload()} className="rounded-xl bg-[#d7192d] px-5 py-3 text-sm font-bold text-white">Try again</button>
            <Link href="/visa-services/" className="rounded-xl border border-[#dce5ee] px-5 py-3 text-sm font-bold text-[#082b4c]">All destinations</Link>
          </div>
        </div>
      </main>
    );
  }

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
            <CountryFlag iso2={country.iso2} name={country.name} className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-white/10 shadow-lg backdrop-blur" />
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
        <div className="mb-7 flex flex-wrap gap-3">
          {country.capital && <span className="inline-flex items-center gap-2 rounded-full border border-[#e3eaf1] bg-white px-4 py-2 text-xs font-semibold text-[#526579]"><MapPin size={14} className="text-[#d7192d]" /> Capital: {country.capital}</span>}
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e3eaf1] bg-white px-4 py-2 text-xs font-semibold text-[#526579]"><BadgeCheck size={14} className="text-[#d7192d]" /> {country.visa_categories.length} visa categories</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e3eaf1] bg-white px-4 py-2 text-xs font-semibold text-[#526579]"><Plane size={14} className="text-[#d7192d]" /> {country.services.length} UniGo services</span>
        </div>

        {country.overview && <section className="rounded-2xl border border-[#e3eaf1] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0f1] text-[#d7192d]"><Globe2 size={19} /></span><h2 className="text-xl font-bold text-[#082b4c]">About travelling to {country.name}</h2></div>
          <p className="whitespace-pre-line text-sm leading-8 text-slate-600">{country.overview}</p>
        </section>}

        <section className="mt-8 rounded-3xl border border-[#e3eaf1] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d7192d]">Bangladeshi ordinary passport</p>
              <h2 className="mt-1 text-xl font-bold text-[#082b4c]">Visa and entry requirements</h2>
              <p className="mt-1 text-sm text-slate-500">Travel purpose: Tourism</p>
            </div>
            {requirement && <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><ShieldCheck size={14} /> Verified information</span>}
          </div>
          {requirementError ? (
            <p className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">Detailed entry requirements could not be loaded right now. Please try again later or contact UniGo.</p>
          ) : requirement ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Requirement type", requirement.requirement_type],
                  ["Maximum permitted stay", requirement.maximum_permitted_stay],
                  ["Entry count", requirement.entry_count],
                  ["Application fee", requirement.application_fee],
                  ["Processing time", requirement.processing_time],
                  ["Application channel", requirement.application_channel],
                ].filter((item): item is [string, string] => Boolean(item[1]?.trim())).map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-[#f6f9fc] p-4">
                    <p className="text-xs font-semibold text-slate-500">{label}</p>
                    <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-6 text-[#263f59]">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["Visa required", requirement.visa_required],
                  ["Visa free", requirement.visa_free_available],
                  ["Visa on arrival", requirement.visa_on_arrival_available],
                  ["eVisa available", requirement.evisa_available],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex items-center justify-between rounded-xl border border-[#e8edf2] px-4 py-3">
                    <span className="text-sm text-slate-600">{String(label)}</span>
                    <span className="text-sm font-bold text-[#082b4c]">{value === true ? "Yes" : value === false ? "No" : "Not specified"}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {[
                  ["Passport validity", requirement.passport_validity_rule],
                  ["Blank passport pages", requirement.blank_passport_pages_rule],
                  ["Return or onward ticket", requirement.return_ticket_rule],
                  ["Proof of funds", requirement.proof_of_funds_rule],
                  ["Accommodation", requirement.accommodation_rule],
                  ["Travel insurance", requirement.travel_insurance_rule],
                  ["Health requirements", requirement.health_requirements],
                  ["Transit requirements", requirement.transit_requirements],
                ].filter((item): item is [string, string] => Boolean(item[1]?.trim())).map(([label, value]) => (
                  <div key={label}>
                    <h3 className="text-sm font-bold text-[#082b4c]">{label}</h3>
                    <p className="mt-1 whitespace-pre-line text-sm leading-7 text-slate-600">{value}</p>
                  </div>
                ))}
              </div>
              {requirement.required_documents?.length ? (
                <div className="mt-6 border-t border-[#edf1f5] pt-6">
                  <h3 className="text-base font-bold text-[#082b4c]">Required documents</h3>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {requirement.required_documents.map((document, index) => <li key={index} className="flex gap-2 rounded-xl bg-[#f6f9fc] p-3 text-sm leading-6 text-slate-600"><FileText size={16} className="mt-0.5 shrink-0 text-[#d7192d]" />{document}</li>)}
                  </ul>
                </div>
              ) : null}
              <section className="mt-6 border-t border-[#edf1f5] pt-6">
                <h3 className="text-base font-bold text-[#082b4c]">Photograph specifications</h3>
                <p className="mt-1 text-xs text-slate-500">Follow the specification for the selected application route. Do not assume one photo size applies to every visa category.</p>
                {!requirement.photo_specifications ? (
                  <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">UniGo has not yet verified the photograph dimensions and upload requirements for this application route. Please check the current official embassy or visa-centre checklist before preparing your photo.</p>
                ) : ["not_published", "not_specified", "no_fixed_size_published", "not_verified"].includes(requirement.photo_specifications.status || "") ? (
                  <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">The reviewed authority has not published a specific photograph size for this route. Follow the personalised online application instructions or confirm with the responsible application centre before preparing your photo.</p>
                ) : requirement.photo_specifications.status === "biometric_capture" || requirement.photo_specifications.status === "captured_at_vac" || requirement.photo_specifications.status === "captured_at_application_centre" ? (
                  <p className="mt-3 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-800">A photograph is expected to be captured at the designated visa application or biometric centre for this route. Check the appointment instructions to confirm whether you must also bring printed photographs.</p>
                ) : (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {[
                      ["Application route", formatPhotoValue(requirement.photo_specifications.route)],
                      ["Application authority", formatPhotoValue(requirement.photo_specifications.representation)],
                      ["Photo capture", requirement.photo_specifications.captured_at_vac ? "Digital photo captured at the visa application centre; confirm whether printed photographs are also required." : undefined],
                      ["Printed photo size", formatPhotoValue(requirement.photo_specifications.dimensions_mm, "mm")],
                      ["Digital dimensions", formatPhotoValue(requirement.photo_specifications.digital_dimensions_px, "px")],
                      ["File size", formatPhotoValue(requirement.photo_specifications.file_size)],
                      ["Background", formatPhotoValue(requirement.photo_specifications.background)],
                      ["Head measurements", formatPhotoValue(requirement.photo_specifications.head_measurements)],
                      ["Photo age", formatPhotoValue(requirement.photo_specifications.photo_age)],
                      ["File format", formatPhotoValue(requirement.photo_specifications.format)],
                      ["Number of copies", formatPhotoValue(requirement.photo_specifications.copies)],
                    ].filter((item): item is [string, string] => Boolean(item[1])).map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-[#f6f9fc] p-4">
                        <p className="text-xs font-semibold text-slate-500">{label}</p>
                        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-[#263f59]">{value}</p>
                      </div>
                    ))}
                  </div>
                )}
                {requirement.photo_specifications?.notes && <p className="mt-3 text-sm leading-6 text-slate-600">{requirement.photo_specifications.notes}</p>}
                {requirement.photo_specifications?.source_url && <p className="mt-3 text-xs text-slate-500">Source: <a href={requirement.photo_specifications.source_url} target="_blank" rel="noreferrer" className="font-medium text-[#b91f32] underline">{requirement.photo_specifications.source_name || "Official application guidance"}</a>{requirement.photo_specifications.checked_at ? ` · Checked ${requirement.photo_specifications.checked_at}` : ""}</p>}
              </section>
              {requirement.applicant_checklists?.length ? (
                <section className="mt-6 border-t border-[#edf1f5] pt-6">
                  <h3 className="text-base font-bold text-[#082b4c]">Documents by applicant type</h3>
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    {requirement.applicant_checklists.map((checklist) => (
                      <div key={checklist.applicant_type} className="rounded-2xl border border-[#e8edf2] p-4">
                        <h4 className="font-bold capitalize text-[#082b4c]">{checklist.applicant_type.replaceAll("_", " ")}</h4>
                        <ul className="mt-3 space-y-2">
                          {checklist.documents.map((document, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm leading-6 text-slate-600">
                              <FileText size={15} className="mt-1 shrink-0 text-[#d7192d]" />
                              <span>{document.name}<span className="ml-2 rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">{document.status.replaceAll("_", " ")}</span>{document.notes ? <span className="block text-xs text-slate-500">{document.notes}</span> : null}</span>
                            </li>
                          ))}
                        </ul>
                        {checklist.source_url && <p className="mt-3 text-xs text-slate-500">Source: <a href={checklist.source_url} target="_blank" rel="noreferrer" className="text-[#b91f32] underline">{checklist.source_name || "Application checklist"}</a>{checklist.checked_at ? ` · Checked ${checklist.checked_at}` : ""}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
              {requirement.sources?.length ? (
                <div className="mt-6 border-t border-[#edf1f5] pt-5">
                  <h3 className="text-sm font-bold text-[#082b4c]">Sources and application guidance</h3>
                  <div className="mt-2 flex flex-col gap-2">
                    {requirement.sources.map((source) => <a key={source.id} href={source.source_url || "#"} target="_blank" rel="noreferrer" className="text-sm font-medium text-[#b91f32] underline underline-offset-4">{source.source_name || "Government source"} · {source.source_type === "provider" ? "Application provider" : source.source_type === "secondary" ? "Secondary source" : "Official source"}{source.is_primary ? " · Primary source" : ""}</a>)}
                  </div>
                  {requirement.official_source_checked_at && <p className="mt-3 text-xs text-slate-400">Last official source check: {new Date(requirement.official_source_checked_at).toLocaleDateString("en-GB")}</p>}
                </div>
              ) : null}
              <p className="mt-6 rounded-xl bg-[#f6f9fc] p-4 text-xs leading-6 text-slate-500">Visa and entry requirements may change. Always confirm current requirements with the destination government before booking or travelling.</p>
            </>
          ) : (
            <p className="rounded-xl bg-[#f6f9fc] p-4 text-sm leading-7 text-slate-500">No currently published and verified tourism requirement is available for Bangladeshi passport holders. Contact UniGo for guidance.</p>
          )}
        </section>

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
