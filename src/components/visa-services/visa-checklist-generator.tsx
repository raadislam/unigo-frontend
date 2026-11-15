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
    }  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function escapePdf(value: string) {
  return cleanText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function makePdf(jpeg: Uint8Array, qrJpeg: Uint8Array, lines: string[], countryName: string) {
  const encoder = new TextEncoder();
  const ascii = (value: string) => encoder.encode(value);
  const commands: string[] = ["q 595 0 0 842 0 0 cm /Letterhead Do Q"];
  const addText = (value: string, x: number, yTop: number, size: number, bold = false, color = "0.12 0.19 0.27") => {
    commands.push(`BT /F${bold ? 2 : 1} ${size} Tf ${color} rg 1 0 0 1 ${x} ${842 - yTop} Tm (${escapePdf(value)}) Tj ET`);
  };
  const addLine = (value: string, y: number, size = 9.2, bold = false, x = 42, width = 510) => {
    const max = Math.max(36, Math.floor(width / (size * 0.51)));
    const wrapped = wrapText(value, max);
    wrapped.forEach((part, index) => {
      addText(part, x, y + index * (size + 3), size, bold);
    });
    return y + wrapped.length * (size + 3) + 2;
  };
  const drawSection = (title: string, y: number) => {
    addText(title.toUpperCase(), 42, y, 10.2, true, "0.03 0.17 0.30");
    commands.push(`0.84 0.88 0.92 RG 0.6 w 42 ${842 - y - 5} m 553 ${842 - y - 5} l S`);
    return y + 15;
  };
  commands.push("q 58 0 0 58 34 755 cm /QR Do Q");
  addText("SCAN FOR LATEST", 36, 72, 6.5, true, "0.35 0.41 0.48");
  addText("VISA CHECKLIST", 112, 52, 16, true, "0.03 0.17 0.30");
  addText(countryName, 112, 72, 12, true, "0.84 0.09 0.16");
  addText("Bangladeshi ordinary passport  |  Tourism", 112, 88, 8.5, false, "0.35 0.41 0.48");

  let y = 125;
  y = drawSection("Visa route", y);
  y = addLine(lines.find((line) => line.startsWith("ROUTE|"))?.slice(6) || "Check the destination's current visa route.", y, 9.5, true);
  y = addLine(lines.find((line) => line.startsWith("STAY|"))?.slice(5) || "", y, 9);
  y = addLine(lines.find((line) => line.startsWith("APPLICATION|"))?.slice(11) || "", y, 9);
  y = drawSection("Documents to prepare", y + 3);
  for (const line of lines.filter((item) => item.startsWith("DOC|"))) {
    const value = line.slice(4);
    const wrapped = wrapText(value, 88);
    for (const part of wrapped) {
      commands.push(`0.84 0.09 0.16 rg 43 ${842 - y - 2} 3 3 re f`);
      y = addLine(part, y, 9.1, false, 52, 495);
    }
  }
  const conditions = lines.filter((item) => item.startsWith("KEY|"));
  if (conditions.length) {
    y = drawSection("Key requirements", y + 3);
    for (const line of conditions) y = addLine(line.slice(4), y, 8.7);
  }
  const photo = lines.find((line) => line.startsWith("PHOTO|"));
  if (photo) {
    y = drawSection("Photo", y + 3);
    y = addLine(photo.slice(6), y, 8.7);
  }
  addText("Prepared by UniGo Tours & Travels  |  Confirm the latest instructions before applying.", 42, Math.min(744, y + 7), 7.5, false, "0.35 0.41 0.48");

  const objects: Uint8Array[] = [];
  objects[1] = ascii("<< /Type /Catalog /Pages 2 0 R >>");
  objects[2] = ascii("<< /Type /Pages /Kids [6 0 R] /Count 1 >>");
  objects[3] = new Uint8Array([...ascii(`<< /Type /XObject /Subtype /Image /Width 595 /Height 842 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`), ...jpeg, ...ascii("\nendstream")]);
  objects[4] = new Uint8Array([...ascii(`<< /Type /XObject /Subtype /Image /Width 160 /Height 160 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${qrJpeg.length} >>\nstream\n`), ...qrJpeg, ...ascii("\nendstream")]);
  objects[5] = ascii("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects[7] = ascii("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const stream = ascii(commands.join("\n"));
  objects[8] = ascii("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Letterhead 3 0 R /QR 4 0 R >> /Font << /F1 5 0 R /F2 7 0 R >> >> /Contents 9 0 R >>");
  objects[9] = new Uint8Array([...ascii(`<< /Length ${stream.length} >>\nstream\n`), ...stream, ...ascii("\nendstream")]);
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [0];
  let length = 0;
  const push = (bytes: Uint8Array) => { chunks.push(bytes); length += bytes.length; };
  push(ascii("%PDF-1.4\n%\\xE2\\xE3\\xCF\\xD3\n"));
  for (let i = 1; i < objects.length; i++) {
    if (!objects[i]) continue;
    offsets[i] = length;
    push(ascii(`${i} 0 obj\n`));
    push(objects[i]);
    push(ascii("\nendobj\n"));
  }
  const xrefOffset = length;
  let xref = `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < objects.length; i++) xref += offsets[i] ? `${String(offsets[i]).padStart(10, "0")} 00000 n \n` : "0000000000 00000 f \n";
  xref += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  push(ascii(xref));
  const output = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { output.set(chunk, offset); offset += chunk.length; }
  return new Blob([output], { type: "application/pdf" });
}

function buildChecklistLines(country: Country, requirement: VisaRequirement, scope: ChecklistScope, applicant: Occupation, sponsor: Occupation, funding: SponsorFunding, relationship: string) {
  const lines: string[] = [];
  const route = requirement.visa_required === false ? (requirement.visa_free_available ? "Visa-free entry" : requirement.visa_on_arrival_available ? "Visa on arrival" : "No visa required") : requirement.evisa_available ? "eVisa available" : "Visa required";
  lines.push("ROUTE|" + route);
  const stay = [
    requirement.maximum_permitted_stay ? "Stay: " + requirement.maximum_permitted_stay : "",
    requirement.entry_count ? "Entries: " + requirement.entry_count : "",
    requirement.passport_validity_rule ? "Passport: " + requirement.passport_validity_rule : "",
  ].filter(Boolean).join("  |  ");
  if (stay) lines.push("STAY|" + stay);
  const application = [
    requirement.application_channel ? "Apply: " + requirement.application_channel : "",
    requirement.application_fee ? "Fee: " + requirement.application_fee : "",
    requirement.processing_time ? "Processing: " + requirement.processing_time : "",
  ].filter(Boolean).join("  |  ");
  if (application) lines.push("APPLICATION|" + application);

  (requirement.required_documents || []).forEach((item) => lines.push("DOC|" + cleanText(item)));
  if (scope !== "sponsor") {
    const profiles = requirement.applicant_checklists || [];
    const selectedProfile = profiles.find((profile) => {
      const type = profile.applicant_type.toLowerCase();
      if (applicant === "business") return type.includes("business") || type.includes("self_employed");
      return type === applicant || type.includes(applicant);
    });
    if (selectedProfile) {
      selectedProfile.documents.forEach((item) => {
        const label = item.status === "required" ? "" : item.status === "conditional" ? " (if applicable)" : " (if applicable)";
        lines.push("DOC|" + cleanText(item.name + label));
      });
    } else {
      const fallback: Record<Occupation, string[]> = {
        employee: ["Employment confirmation letter", "Recent payslips", "Approved leave letter or employer NOC"],
        business: ["Business registration or trade licence", "Business bank statements", "Evidence of business ownership"],
        student: ["Student ID", "Current enrolment letter"],
        retired: ["Retirement or pension evidence", "Recent pension statement"],
        other: ["Evidence of current occupation and income source"],
      };
      fallback[applicant].forEach((item) => lines.push("DOC|" + cleanText(item + " (if applicable)")));
    }
  }
  if (scope !== "applicant" && funding !== "self") {
    lines.push("DOC|Sponsor: signed support letter, passport/ID and proof of address");
    lines.push("DOC|Sponsor: recent bank statement or proof of available funds");
    const occupationDoc: Record<Occupation, string> = {
      employee: "Sponsor employment letter and recent payslips",
      business: "Sponsor trade licence and business financial evidence",
      student: "Sponsor student ID and enrolment evidence",
      retired: "Sponsor pension or retirement-income evidence",
      other: "Sponsor evidence of occupation and income source",
    };
    lines.push("DOC|" + occupationDoc[sponsor]);
    if (relationship.trim()) lines.push("KEY|Sponsor relationship: " + cleanText(relationship));
  }
  const keys = [
    requirement.proof_of_funds_rule ? "Funds: " + requirement.proof_of_funds_rule : "",
    requirement.return_ticket_rule ? "Return ticket: " + requirement.return_ticket_rule : "",
    requirement.accommodation_rule ? "Accommodation: " + requirement.accommodation_rule : "",
    requirement.travel_insurance_rule ? "Insurance: " + requirement.travel_insurance_rule : "",
    requirement.blank_passport_pages_rule ? "Blank pages: " + requirement.blank_passport_pages_rule : "",
  ].filter(Boolean);
  keys.forEach((item) => lines.push("KEY|" + cleanText(item)));
  const photo = requirement.photo_specifications;
  if (photo) {
    const details = [
      typeof photo.dimensions_mm === "string" ? photo.dimensions_mm : photo.dimensions_mm ? JSON.stringify(photo.dimensions_mm) : "",
      photo.background ? "Background: " + photo.background : "",
      photo.format ? "Format: " + photo.format : "",
      photo.copies ? "Copies: " + photo.copies : "",
    ].filter(Boolean);
    if (details.length) lines.push("PHOTO|" + cleanText(details.join("  |  ")));
  }
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
    return funding === "self" ? "Applicant documents only (self-funded)" : "Applicant and sponsor documents";
  }, [scope, funding]);

  async function downloadChecklist() {
    if (!requirement) return;
    setBusy(true);
    setMessage("");
    try {
      const letterheadResponse = await fetch("/assets/visa-checklist/unigo-letterhead-a4.jpg", { cache: "force-cache" });
      if (!letterheadResponse.ok) throw new Error("The original UniGo letterhead could not be loaded.");
      const letterhead = new Uint8Array(await letterheadResponse.arrayBuffer());
      const destinationUrl = `https://unigo-bd.com/visa-services/${country.slug}/`;
      const qrResponse = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=160x160&format=jpg&margin=1&data=${encodeURIComponent(destinationUrl)}`, { cache: "no-store" });
      if (!qrResponse.ok) throw new Error("The destination QR code could not be created.");
      const qr = new Uint8Array(await qrResponse.arrayBuffer());
      const lines = buildChecklistLines(country, requirement, scope, applicant, sponsor, funding, relationship);
      const pdf = makePdf(letterhead, qr, lines, country.name);
      const url = URL.createObjectURL(pdf);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${country.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-visa-checklist-unigo.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setMessage("Your one-page A4 checklist has been downloaded.");
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
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">A clean, single-page A4 checklist with a QR code linking to the full destination guide.</p>
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
                  <label htmlFor="applicant-occupation" className="mb-2 block text-sm font-bold text-[#082b4c]">2. What is the applicant&apos;s current occupation?</label>
                  <select id="applicant-occupation" value={applicant} onChange={(event) => setApplicant(event.target.value as Occupation)} className="w-full rounded-xl border border-[#dbe4ed] bg-white px-4 py-3 text-sm text-[#263f59] outline-none focus:border-[#d7192d] focus:ring-2 focus:ring-[#d7192d]/10">
                    {Object.entries(occupationLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
              )}
              {scope !== "applicant" && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="sponsor-occupation" className="mb-2 block text-sm font-bold text-[#082b4c]">3. What is the sponsor&apos;s current occupation?</label>
                    <select id="sponsor-occupation" value={sponsor} onChange={(event) => setSponsor(event.target.value as Occupation)} className="w-full rounded-xl border border-[#dbe4ed] bg-white px-4 py-3 text-sm text-[#263f59] outline-none focus:border-[#d7192d] focus:ring-2 focus:ring-[#d7192d]/10">
                      {Object.entries(occupationLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sponsor-funding" className="mb-2 block text-sm font-bold text-[#082b4c]">How will the trip be funded?</label>
                    <select id="sponsor-funding" value={funding} onChange={(event) => setFunding(event.target.value as SponsorFunding)} className="w-full rounded-xl border border-[#dbe4ed] bg-white px-4 py-3 text-sm text-[#263f59] outline-none focus:border-[#d7192d] focus:ring-2 focus:ring-[#d7192d]/10">
                      <option value="full">Fully sponsored</option>
                      <option value="partial">Partially sponsored</option>
                      {scope !== "sponsor" && <option value="self">Self-funded (no sponsor documents)</option>}
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
                <p className="mt-1 text-xs leading-6 text-slate-500">A concise A4 summary: visa route, documents, key conditions and photo basics.</p>
              </div>
              {!canGenerate && <p className="rounded-xl bg-amber-50 p-3 text-xs leading-6 text-amber-800">This destination&apos;s verified record does not contain a complete common document list. The checklist download is paused to avoid generating an incomplete document.</p>}
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