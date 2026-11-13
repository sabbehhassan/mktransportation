import {
  Truck,
  ShieldCheck,
  ArrowRight,
  FileCheck2,
  CheckCircle2,
} from "lucide-react";

export default function AgreementSelection({
  setStep,
  setAgreementData,
}) {
  const handleSelectAgreement = () => {
    setAgreementData((previous) => ({
      ...previous,
      agreementType: "Trucking Service Agreement",
    }));

    setStep(2);
  };

  return (
    <div className="relative isolate min-h-[560px] overflow-hidden rounded-3xl bg-[var(--brand-light-gray)] px-4 py-12 sm:px-8 sm:py-16 lg:py-20">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-[var(--brand-gold)]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 h-80 w-80 rounded-full bg-[var(--brand-gold)]/10 blur-3xl" />

      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(var(--brand-black) 0.7px, transparent 0.7px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative mx-auto w-full max-w-4xl">

        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--brand-gold)]/50 bg-white px-4 py-2 shadow-sm">
            <ShieldCheck size={16} className="text-brand-black" />

            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-black sm:text-xs">
              Step 1 of 7 · Carrier Partnership Portal
            </span>
          </div>

          <h2 className="text-3xl font-black leading-tight tracking-tight text-[var(--brand-black)] sm:text-4xl md:text-5xl">
            Let's Get Your
            <span className="mt-1 block text-brand-black">
              Agreement Started.
            </span>
          </h2>

          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-[var(--brand-gold)]" />

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            Choose the agreement below to begin your carrier setup.
            We'll guide you through the required information and the
            next steps in the process.
          </p>
        </div>

        {/* Agreement card */}
        <div className="group relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[var(--brand-black)]/10 bg-white shadow-[0_25px_70px_rgba(8,9,11,0.09)] transition-all duration-500 hover:-translate-y-1 hover:border-[var(--brand-gold)]/70 hover:shadow-[0_30px_80px_rgba(8,9,11,0.14)]">

          {/* Top accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[var(--brand-black)] via-[var(--brand-gold)] to-[var(--brand-gold)]" />

          <button
            type="button"
            onClick={handleSelectAgreement}
            className="block w-full p-6 text-left outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[var(--brand-gold)]/60 sm:p-9 lg:p-10"
          >
            {/* Card header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-black)] text-[var(--brand-gold)] shadow-lg transition duration-500 group-hover:bg-[var(--brand-gold-dark)] sm:h-20 sm:w-20">
                <Truck
                  size={36}
                  strokeWidth={1.6}
                  className="transition-transform duration-500 group-hover:translate-x-1"
                />
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-gold)]/15 bg-[var(--brand-gold)]/5 px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-brand-black sm:text-xs">
                <CheckCircle2 size={14} />
                Available
              </span>
            </div>

            {/* Card content */}
            <div className="mt-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-black">
                Carrier Agreement
              </p>

              <h3 className="mt-3 text-2xl font-black leading-tight text-[var(--brand-black)] sm:text-3xl">
                Trucking Service Agreement
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Begin the agreement process for your trucking operation.
                Provide the necessary carrier details and review the
                information required to move forward with MK Transportation
                Logistics.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="mt-7 grid gap-3 border-y border-[var(--brand-black)]/10 py-6 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-gold)]/30 text-brand-black">
                  <FileCheck2 size={19} />
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  Carrier Information
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-gold)]/30 text-brand-black">
                  <ShieldCheck size={19} />
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  Agreement Review
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-7 flex items-center justify-between gap-4">
              <div>
                <p className="font-extrabold text-[var(--brand-black)]">
                  Ready to continue?
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                  Start your carrier agreement setup.
                </p>
              </div>

              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-gold)] text-[var(--brand-black)] shadow-md transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[var(--brand-black)] group-hover:text-[var(--brand-gold)] sm:h-14 sm:w-14">
                <ArrowRight size={23} />
              </span>
            </div>
          </button>
        </div>

        {/* Footer note */}
        <div className="mx-auto mt-7 flex max-w-2xl items-start justify-center gap-3 px-2 text-center">
          <ShieldCheck
            size={17}
            className="mt-0.5 shrink-0 text-brand-black"
          />

          <p className="text-xs leading-6 text-slate-500 sm:text-sm">
            Please review the information you provide carefully before
            submitting your agreement for further processing.
          </p>
        </div>
      </div>
    </div>
  );
};
