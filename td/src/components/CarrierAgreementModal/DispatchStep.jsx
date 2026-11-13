import { useState } from "react";
import {
  Route,
  Building2,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function DispatchStep({
  selectedDispatch,
  setSelectedDispatch,
}) {
  const [error, setError] = useState("");

  const dispatchCompanies = [
    "Prime Dispatchify",
    "3D Dispatch",
    "GO Lane Dispatch",
    "Logity Dispatch",
    "AFT Dispatch",
    "Solace Dispatch",
  ];

  const handleSelect = (company) => {
    setSelectedDispatch(company);
    setError("");
  };

  return (
    <section className="relative mt-6 overflow-hidden rounded-3xl bg-[var(--brand-light-gray)] px-4 py-7 sm:mt-8 sm:px-7 sm:py-9 lg:px-9">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[var(--brand-gold)]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[var(--brand-gold)]/10 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--brand-gold)]/45 bg-white px-4 py-2">
            <Route size={16} className="text-brand-black" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-black sm:text-xs">
              Agreement Process
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-black)] text-[var(--brand-gold)] shadow-md sm:h-14 sm:w-14">
              <Building2 size={25} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-black">
                Step 1
              </p>

              <h2 className="mt-1 text-2xl font-black leading-tight text-[var(--brand-black)] sm:text-3xl">
                Choose Your Dispatch Company
              </h2>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            Select the dispatch company associated with your trucking
            agreement. Confirm your selection before moving to the next
            stage of the setup process.
          </p>
        </div>

        {/* Selection panel */}
        <div className="overflow-hidden rounded-2xl border border-[var(--brand-black)]/10 bg-white shadow-[0_15px_40px_rgba(8,9,11,0.06)]">
          <div className="h-1.5 bg-gradient-to-r from-[var(--brand-black)] via-[var(--brand-gold)] to-[var(--brand-gold)]" />

          <div className="p-5 sm:p-7">
            <div>
              <label
                htmlFor="dispatch-company"
                className="mb-2 block text-sm font-bold text-[var(--brand-black)]"
              >
                Select Dispatch Company
              </label>

              <div className="relative">
                <select
                  id="dispatch-company"
                  value={selectedDispatch || ""}
                  onChange={(e) => handleSelect(e.target.value)}
                  aria-invalid={Boolean(error)}
                  className={`w-full appearance-none rounded-xl border bg-[var(--brand-light-gray)] px-4 py-3.5 pr-11 text-sm text-[var(--brand-black)] outline-none transition focus:bg-white focus:ring-4 focus:ring-[var(--brand-gold)]/10 ${
                    error
                      ? "border-red-400"
                      : "border-[var(--brand-black)]/15 hover:border-[var(--brand-gold)]/50 focus:border-[var(--brand-gold)]"
                  }`}
                >
                  <option value="">Select a dispatch company</option>

                  {dispatchCompanies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-black"
                />
              </div>

              {error && (
                <p className="mt-3 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Selection summary */}
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-[var(--brand-gold)]/35 bg-[var(--brand-gold)]/15 p-4">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-brand-black"
          />

          <div>
            <p className="text-sm font-bold text-[var(--brand-black)]">
              Confirm Your Selection
            </p>

            <p className="mt-1 text-xs leading-6 text-slate-600">
              {selectedDispatch
                ? `Selected provider: ${selectedDispatch}.`
                : "Choose a dispatch company above to continue your agreement."}
            </p>
          </div>
        </div>

        {/* Continue hint */}
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--brand-black)]/10 pt-5">
          <p className="text-xs leading-5 text-slate-500">
            You can review your choice before continuing.
          </p>

          <span className="inline-flex shrink-0 items-center gap-2 text-sm font-extrabold text-brand-black">
            Next: Agreement Details
            <ArrowRight size={17} />
          </span>
        </div>
      </div>
    </section>
  );
};