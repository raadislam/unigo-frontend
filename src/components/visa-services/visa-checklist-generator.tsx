"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileCheck2, X } from "lucide-react";
import type { Country, VisaRequirement } from "@/lib/country-directory";

type Occupation = "employee" | "business" | "student" | "retired" | "other";
type ChecklistScope = "applicant" | "both" | "sponsor";
type SponsorFunding = "self" | "full" | "partial";

const occupationLabels: Record<Occupation, string> = {
  employee: "Employed",
  business: "Business owner / self-employed",
  student: "Student",
  retired: "Retired",
  other: "Other",
};

const sponsorCommon = [
  "Signed sponsorship or financial-support letter explaining the relationship, purpose and expenses covered",
  "Copy of sponsor's passport or national identity document",
  "Proof of sponsor's lawful residence or status in the country where they live, where applicable",
  "Proof of sponsor's residential address",
  "Recent personal bank statements or other evidence of available funds",
  "Evidence of relationship to the applicant, where relevant",
];

const sponsorOccupationDocuments: Record<Occupation, string[]> = {
  employee: [
    "Recent employment confirmation letter stating position, salary and employment start date",
    "Recent payslips or salary certificates",
    "Employer contact details and approved leave confirmation, where relevant",
  ],
  business: [
    "Business registration, trade licence or incorporation documents",
    "Recent business bank statements",
    "Tax, VAT or business financial records, where available",
    "Evidence of ownership, partnership or directorship",
  ],
  student: [
    "Current student ID or enrolment confirmation",
    "Scholarship, stipend or financial-support evidence, if applicable",
    "Evidence of funds available to provide the sponsorship",
  ],
  retired: [
    "Pension statement or retirement-benefit evidence",
    "Recent bank statements showing pension or other regular income",
    "Evidence of other assets or savings relied upon for sponsorship",
  ],
  other: [
    "Evidence explaining the sponsor's occupation or source of income",
    "Recent financial records supporting the ability to sponsor the trip",
  ],
};

const applicantFallback: Record<Occupation, string[]> = {
  employee: ["Employment confirmation letter", "Recent payslips", "Approved leave letter or employer NOC"],
  business: ["Business registration or trade licence", "Business bank statements", "Tax or business financial records, where available", "Evidence of business ownership or management"],
  student: ["Current student ID", "Institution enrolment letter", "No-objection or leave letter from the institution, where applicable"],
  retired: ["Retirement or pension evidence", "Recent pension or income statements"],
  other: ["Documents explaining current occupation and source of income"],
};

function cleanText(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim();
}

function wrapText(value: string, max: number) {
  const words = cleanText(value).split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? line + " " + word : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function escapePdf(value: string) {
  return cleanText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function makePdf(jpeg: Uint8Array, pages: string[][], countryName: string) {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [0];
  let length = 0;
  const push = (bytes: Uint8Array) => {
    chunks.push(bytes);
    length += bytes.length;
  };
  const ascii = (value: string) => encoder.encode(value);
  const objects: Uint8Array[] = [];
  objects[1] = ascii("<< /Type /Catalog /Pages 2 0 R >>");
  objects[3] = new Uint8Array([
    ...ascii(`<< /Type /XObject /Subtype /Image /Width 993 /Height 1404 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`),
    ...jpeg,
    ...ascii("\nendstream"),
  ]);
  const pageRefs = pages.map((_, index) => 5 + index * 2);
  objects[2] = ascii(`<< /Type /Pages /Kids [${pageRefs.map((ref) => `${ref} 0 R`).join(" ")}] /Count ${pages.length} >>`);
  pages.forEach((lines, index) => {
    const pageRef = 5 + index * 2;
    const contentRef = pageRef + 1;
    const commands = ["q 595 0 0 842 0 0 cm /Im0 Do Q"];
    let top = 112;
    const addText = (value: string, x: number, yTop: number, size: number, bold = false, color = "0.12 0.19 0.27") => {
      commands.push(`BT /F${bold ? 2 : 1} ${size} Tf ${color} rg 1 0 0 1 ${x} ${842 - yTop} Tm (${escapePdf(value)}) Tj ET`);
    };
    addText(`${countryName.toUpperCase()} VISA CHECKLIST`, 43, top, 13, true, "0.03 0.17 0.30");
    top += 16;
    addText("Bangladeshi ordinary passport | Tourism", 43, top, 7.5, false, "0.35 0.41 0.48");
    addText(`Page ${index + 1} of ${pages.length}`, 510, top, 7, false, "0.35 0.41 0.48");
    top += 19;
    for (const line of lines) {
      if (line.startsWith("## ")) {
        top += 4;
        addText(line.slice(3), 43, top, 9, true, "0.03 0.17 0.30");
        top += 5;
        commands.push(`0.84 0.88 0.92 RG 0.6 w 43 ${842 - top} m 552 ${842 - top} l S`);
        top += 11;
      } else if (line.startsWith("! ")) {
        const wrapped = wrapText(line.slice(2), 118);
        for (const part of wrapped) {
          addText(part, 43, top, 6.4, false, "0.48 0.25 0.10");
          top += 8;
        }
      } else {
        const wrapped = wrapText(line, 112);
        for (const part of wrapped) {
          commands.push(`0.16 0.36 0.53 RG 0.7 w 44 ${842 - top + 1} 5 5 re S`);
          addText(part, 55, top + 5, 7.1, false, "0.16 0.22 0.29");
          top += 10;
        }
      }
    }
    const stream = ascii(commands.join("\n"));
    objects[pageRef] = ascii(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 3 0 R >> /Font << /F1 4 0 R /F2 6 0 R >> >> /Contents ${contentRef} 0 R >>`);
    objects[contentRef] = new Uint8Array([...ascii(`<< /Length ${stream.length} >>\nstream\n`), ...stream, ...ascii("\nendstream")]);
  });
  objects[4] = ascii("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects[6] = ascii("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  push(ascii("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n"));
  for (let i = 1; i < objects.length; i++) {
    if (!objects[i]) continue;
    offsets[i] = length;
    push(ascii(`${i} 0 obj\n`));
    push(objects[i]);
    push(ascii("\nendobj\n"));
  }
  const xrefOffset = length;
  const count = objects.length;
  let xref = `xref\n0 ${count}\n0000000000 65535 f \n`;
  for (let i = 1; i < count; i++) xref += offsets[i] ? `${String(offsets[i]).padStart(10, "0")} 00000 n \n` : "0000000000 00000 f \n";
  xref += `trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  push(ascii(xref));
  return new Blob(chunks, { type: "application/pdf" });
}

function buildChecklistLines(country: Country, requirement: VisaRequirement, scope: ChecklistScope, applicant: Occupation, sponsor: Occupation, funding: SponsorFunding, relationship: string) {
  const lines: string[] = [];
  const applicantChecklist = requirement.applicant_checklists?.find((item) => {
    const type = item.applicant_type.toLowerCase();
    return applicant === "business" ? type.includes("business") || type.includes("self_employed") : type === applicant;
  });
  const common = requirement.required_documents || [];
  const applicantDocs = applicantChecklist?.documents.map((item) => item.name) || applicantFallback[applicant];
  lines.push("## APPLICANT - COMMON DESTINATION REQUIREMENTS");
  if (scope !== "sponsor") {
    if (common.length) common.forEach((item) => lines.push(item));
    else lines.push("Check the current official application checklist for this destination before submission.");
    lines.push("Passport validity: " + (requirement.passport_validity_rule || "Check the current official application instructions."));
    if (requirement.blank_passport_pages_rule) lines.push("Blank passport pages: " + requirement.blank_passport_pages_rule);
    if (requirement.return_ticket_rule) lines.push("Return / onward travel: " + requirement.return_ticket_rule);
    if (requirement.proof_of_funds_rule) lines.push("Proof of funds: " + requirement.proof_of_funds_rule);
    if (requirement.accommodation_rule) lines.push("Accommodation: " + requirement.accommodation_rule);
    if (requirement.travel_insurance_rule) lines.push("Travel insurance: " + requirement.travel_insurance_rule);
    if (requirement.photo_specifications) {
      const photo = requirement.photo_specifications;
      lines.push("Photograph: " + [photo.status, photo.dimensions_mm, photo.format, photo.file_size, photo.background, photo.copies].filter(Boolean).join("; "));
      if (photo.notes) lines.push("Photograph notes: " + photo.notes);
    } else {
      lines.push("Photograph: verify current size, format, background and number of copies with the official application centre.");
    }
    lines.push("## APPLICANT - " + occupationLabels[applicant].toUpperCase() + " SUPPORTING DOCUMENTS");
    applicantDocs.forEach((item) => lines.push(item));
    if (applicantChecklist?.documents.length) {
      applicantChecklist.documents.filter((item) => item.status !== "required").forEach((item) => lines.push("If applicable: " + item.name));
    }
  }
  if (scope !== "applicant" && funding !== "self") {
    lines.push("## SPONSOR - COMMON SUPPORTING DOCUMENTS");
    sponsorCommon.forEach((item) => lines.push(item));
    lines.push("## SPONSOR - " + occupationLabels[sponsor].toUpperCase() + " SUPPORTING DOCUMENTS");
    sponsorOccupationDocuments[sponsor].forEach((item) => lines.push(item));
    if (relationship.trim()) lines.push("Relationship to applicant: " + relationship.trim());
    lines.push("Expenses covered: " + (funding === "full" ? "Full trip sponsorship" : "Partial trip sponsorship; specify expenses in the sponsor letter"));
  }
  if (requirement.sources?.length) {
    lines.push("## OFFICIAL SOURCES");
    requirement.sources.filter((source) => source.source_type === "official" && source.source_url).slice(0, 2).forEach((source) => lines.push((source.source_name || "Official guidance") + ": " + source.source_url));
  }
  lines.push("! Documents marked as supporting evidence are a preparation guide, not a guarantee that an authority will request them. Follow the latest personalised checklist and official instructions.");
  lines.push("! Last official check: " + (requirement.official_source_checked_at ? new Date(requirement.official_source_checked_at).toLocaleDateString("en-GB") : "Not supplied in the published record"));
  lines.push("! UniGo Tours & Travels | +880 1901-644300 | contact@unigo-bd.com | unigo-bd.com");
  return lines;
}

export function VisaChecklistGenerator({ country, requirement }: { country: Country; requirement: VisaRequirement | null }) {
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<ChecklistScope>("both");
  const [applicant, setApplicant] = useState<Occupation>("employee");
  const [sponsor, setSponsor] = useState<Occupation>("employee");
  const [funding, setFunding] = useState<SponsorFunding>("full");
  const [relationship, setRelationship] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const canGenerate = Boolean(requirement && requirement.required_documents?.length);
  const checklistSummary = useMemo(() => {
    if (scope === "applicant") return "Applicant documents only";
    if (scope === "sponsor") return "Sponsor supporting documents only";
    return "Applicant and sponsor documents";
  }, [scope]);

  async function downloadChecklist() {
    if (!requirement) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/assets/visa-checklist/unigo-letterhead.jpg", { cache: "force-cache" });
      if (!response.ok) throw new Error("The UniGo letterhead could not be loaded.");
      const jpeg = new Uint8Array(await response.arrayBuffer());
      const lines = buildChecklistLines(country, requirement, scope, applicant, sponsor, funding, relationship);
      const pages: string[][] = [];
      let page: string[] = [];
      let used = 0;
      for (const line of lines) {
        const wrappedCount = line.startsWith("## ") ? 2 : line.startsWith("! ") ? wrapText(line.slice(2), 118).length : wrapText(line, 112).length;
        const cost = line.startsWith("## ") ? 2 : wrappedCount;
        if (used + cost > 57 && page.length) {
          pages.push(page);
          page = [];
          used = 0;
        }
        page.push(line);
        used += cost;
      }
      if (page.length) pages.push(page);
      const pdf = makePdf(jpeg, pages, country.name);
      const url = URL.createObjectURL(pdf);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${country.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-visa-checklist-unigo.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setMessage(pages.length === 1 ? "Your one-page checklist has been downloaded." : `Your complete checklist has been downloaded in ${pages.length} pages to keep every item readable.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The checklist could not be generated. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <section className="mt-8 overflow-hidden rounded-3xl border border-[#dfe7ef] bg-white shadow-sm">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff0f1] text-[#d7192d]"><FileCheck2 size={23} /></span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d7192d]">Personalised document guide</p>
              <h2 className="mt-1 text-xl font-bold text-[#082b4c]">Download your visa checklist</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">Build a destination-specific checklist for the applicant and, where relevant, their financial sponsor. Download it on official UniGo letterhead.</p>
            </div>
          </div>
          <button type="button" onClick={() => { setMessage(""); setOpen(true); }} disabled={!requirement} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#d7192d] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#b91426] disabled:cursor-not-allowed disabled:opacity-50"><Download size={17} /> Download checklist</button>
        </div>
        {!requirement && <p className="border-t border-[#edf1f5] bg-amber-50 px-6 py-3 text-xs leading-6 text-amber-800">A published and verified tourism checklist is not currently available for this destination, so a personalised download is not offered.</p>}
      </section>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#061c32]/70 p-3 backdrop-blur-sm sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="visa-checklist-title" className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 bg-[#082b4c] px-6 py-5 text-white sm:px-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff9aa3]">UniGo document assistant</p>
                <h2 id="visa-checklist-title" className="mt-1 text-xl font-bold sm:text-2xl">{country.name} visa checklist</h2>
                <p className="mt-1 text-xs text-white/70">A few details help us select the relevant documents.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close checklist" className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-6 px-6 py-6 sm:px-8">
              <div>
                <label htmlFor="checklist-scope" className="mb-2 block text-sm font-bold text-[#082b4c]">1. Who needs a checklist?</label>
                <select id="checklist-scope" value={scope} onChange={(event) => setScope(event.target.value as ChecklistScope)} className="w-full rounded-xl border border-[#dbe4ed] bg-white px-4 py-3 text-sm text-[#263f59] outline-none focus:border-[#d7192d] focus:ring-2 focus:ring-[#d7192d]/10">
                  <option value="applicant">Main applicant only</option>
                  <option value="both">Applicant and sponsor</option>
                  <option value="sponsor">Sponsor only</option>
                </select>
              </div>
              {scope !== "sponsor" && (
                <div>
                  <label htmlFor="applicant-occupation" className="mb-2 block text-sm font-bold text-[#082b4c]">2. What is the applicant's current occupation?</label>
                  <select id="applicant-occupation" value={applicant} onChange={(event) => setApplicant(event.target.value as Occupation)} className="w-full rounded-xl border border-[#dbe4ed] bg-white px-4 py-3 text-sm text-[#263f59] outline-none focus:border-[#d7192d] focus:ring-2 focus:ring-[#d7192d]/10">
                    {Object.entries(occupationLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
              )}
              {scope !== "applicant" && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="sponsor-occupation" className="mb-2 block text-sm font-bold text-[#082b4c]">3. What is the sponsor's current occupation?</label>
                    <select id="sponsor-occupation" value={sponsor} onChange={(event) => setSponsor(event.target.value as Occupation)} className="w-full rounded-xl border border-[#dbe4ed] bg-white px-4 py-3 text-sm text-[#263f59] outline-none focus:border-[#d7192d] focus:ring-2 focus:ring-[#d7192d]/10">
                      {Object.entries(occupationLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sponsor-funding" className="mb-2 block text-sm font-bold text-[#082b4c]">How will the trip be funded?</label>
                    <select id="sponsor-funding" value={funding} onChange={(event) => setFunding(event.target.value as SponsorFunding)} className="w-full rounded-xl border border-[#dbe4ed] bg-white px-4 py-3 text-sm text-[#263f59] outline-none focus:border-[#d7192d] focus:ring-2 focus:ring-[#d7192d]/10">
                      <option value="full">Fully sponsored</option>
                      <option value="partial">Partially sponsored</option>
                      <option value="self">Self-funded (no sponsor documents)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sponsor-relationship" className="mb-2 block text-sm font-bold text-[#082b4c]">Relationship to applicant <span className="font-normal text-slate-400">(optional)</span></label>
                    <input id="sponsor-relationship" value={relationship} onChange={(event) => setRelationship(event.target.value)} placeholder="e.g. Father, mother, spouse, sibling, employer" className="w-full rounded-xl border border-[#dbe4ed] px-4 py-3 text-sm text-[#263f59] outline-none focus:border-[#d7192d] focus:ring-2 focus:ring-[#d7192d]/10" />
                  </div>
                </div>
              )}
              <div className="rounded-2xl bg-[#f6f9fc] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[#526579]">Your PDF will include</p>
                <p className="mt-2 text-sm font-semibold text-[#082b4c]">{checklistSummary}</p>
                <p className="mt-1 text-xs leading-6 text-slate-500">Common destination requirements, relevant occupation evidence, photo guidance, and sponsor evidence where selected. Supporting examples are distinguished from official mandatory requirements.</p>
              </div>
              {!canGenerate && <p className="rounded-xl bg-amber-50 p-3 text-xs leading-6 text-amber-800">This destination's verified record does not contain a complete common document list. The checklist download is paused to avoid generating an incomplete document.</p>}
              {message && <p role="status" className="rounded-xl bg-[#f1f7f3] p-3 text-sm text-[#23633c]">{message}</p>}
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-[#edf1f5] bg-[#fbfcfd] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-[#dbe4ed] px-5 py-3 text-sm font-semibold text-[#526579] transition hover:bg-white">Cancel</button>
              <button type="button" onClick={downloadChecklist} disabled={!canGenerate || busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d7192d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b91426] disabled:cursor-not-allowed disabled:opacity-50"><Download size={16} /> {busy ? "Preparing PDF..." : "Download PDF checklist"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
