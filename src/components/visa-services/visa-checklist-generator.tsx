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

  const canGenerate = Boolean(requirement && (requirement.required_documents?.length || requirement.applicant_checklists?.length));
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
      const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
      if (!apiBase) throw new Error("The UniGo API URL is not configured.");
      const response = await fetch(`${apiBase}/visa-requirements/${encodeURIComponent(country.slug)}/checklist-pdf`, {
        method: "POST",
        headers: { Accept: "application/pdf", "Content-Type": "application/json" },
        body: JSON.stringify({ scope, applicant_occupation: applicant, sponsor_occupation: sponsor, funding, relationship }),
        cache: "no-store",
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || `The PDF service returned HTTP ${response.status}.`);
      }
      const blob = await response.blob();
      if (blob.type !== "application/pdf" && blob.size < 100) throw new Error("The server returned an invalid PDF.");
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${country.slug}-visa-checklist-unigo.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setMessage("Your complete checklist PDF has been downloaded.");
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
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">A complete, multi-page A4 checklist with the original UniGo letterhead, QR code and official sources.</p>
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
                <p className="mt-1 text-xs leading-6 text-slate-500">A readable, multi-page document containing the available checklist, photo, fee, travel-condition and source details.</p>
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