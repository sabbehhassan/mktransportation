import { useState } from "react";
import {
  COMPANY_EMAIL,
  COMPANY_NAME,
  COMPANY_MC_NUMBER,
  COMPANY_USDOT_NUMBER,
  COMPANY_PHYSICAL_ADDRESS,
  COMPANY_MAILING_ADDRESS,
  COMPANY_WEBSITE,
} from "../../constants/companyDetails";
import DispatchStep from "./DispatchStep";
import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Truck,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CalendarDays,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function TruckingAgreement({
  setStep,
  agreementData,
  setAgreementData,
}) {
  const [error, setError] = useState("");

  const handleDispatchChange = (value) => {
    setAgreementData((previous) => ({
      ...previous,
      selectedDispatch: value,
      agreementDate: getToday(),
    }));

    setError("");
  };

  const handleNext = () => {
    if (!agreementData.selectedDispatch) {
      setError("Please select a dispatch service before continuing.");
      return;
    }

    setError("");

    setAgreementData((previous) => ({
      ...previous,
      agreementDate: previous.agreementDate || getToday(),
    }));

    setStep(3);
  };

  const companyDetails = [
    {
      icon: Building2,
      label: "Company",
      value: COMPANY_NAME,
    },
    {
      icon: Building2,
      label: "MC/MX/FF / USDOT",
      value: `${COMPANY_MC_NUMBER} / ${COMPANY_USDOT_NUMBER}`,
    },
    {
      icon: MapPin,
      label: "Physical Address",
      value: COMPANY_PHYSICAL_ADDRESS,
    },
    {
      icon: MapPin,
      label: "Mailing Address",
      value: COMPANY_MAILING_ADDRESS,
    },
    {
      icon: Globe,
      label: "Website",
      value: COMPANY_WEBSITE,
      href: `https://${COMPANY_WEBSITE}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: COMPANY_EMAIL,
      href: `mailto:${COMPANY_EMAIL}`,
    },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-[var(--brand-light-gray)] px-3 py-4 sm:px-6 sm:py-7">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[var(--brand-gold)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[var(--brand-gold)]/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-[var(--brand-light-gray)] bg-white shadow-[0_24px_70px_rgba(8,9,11,0.10)]">
        {/* Brand accent */}
        <div className="h-1.5 bg-gradient-to-r from-[var(--brand-black)] via-[var(--brand-gold)] to-[var(--brand-gold)]" />

        <div>
          {/* Header */}
          <div className="border-b border-gray-100 bg-gradient-to-br from-white to-[var(--brand-light-gray)] px-5 py-6 sm:px-9 sm:py-8">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mb-7 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-black transition hover:bg-[var(--brand-gold-dark)]/5 hover:text-[var(--brand-black)]"
            >
              <ArrowLeft size={17} />
              Back to Agreement Selection
            </button>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-black)] text-[var(--brand-gold)] shadow-lg shadow-[var(--brand-black)]/15">
                <Truck size={31} strokeWidth={1.7} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--brand-gold)]/40 bg-[var(--brand-light-gray)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-black sm:text-xs">
                  <FileText size={14} />
                  Carrier Agreement
                </div>

                <h1 className="text-2xl font-bold leading-tight tracking-tight text-[var(--brand-black)] sm:text-3xl">
                  Trucking Service Agreement
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                  Dedicated lanes, dispatch, trailer rental, and setup services.
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                <span className="text-[var(--brand-black)]">Agreement details</span>
                <span className="text-brand-black">Step 2 of 7</span>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-[var(--brand-light-gray)]"
                role="progressbar"
                aria-label="Agreement progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={29}
              >
                <div className="h-full w-[29%] rounded-full bg-gradient-to-r from-[var(--brand-black)] via-[var(--brand-gold)] to-[var(--brand-gold)]" />
              </div>
            </div>
          </div>

          <div className="space-y-8 px-5 py-7 sm:px-9 sm:py-9">
            {/* Agreement introduction */}
            <section className="rounded-2xl border border-[var(--brand-light-gray)] bg-[var(--brand-light-gray)] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-black)] text-[var(--brand-gold)]">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-[var(--brand-black)]">
                    Agreement Information
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    This agreement is made and entered into on{" "}
                    <strong className="text-[var(--brand-black)]">
                      {agreementData.agreementDate || getToday()}
                    </strong>{" "}
                    between the client and the logistics company.
                  </p>
                </div>
              </div>
            </section>

            {/* Dispatch selection */}
            <section className="rounded-2xl border border-[var(--brand-light-gray)] bg-white p-4 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-light-gray)] text-brand-black">
                  <Truck size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[var(--brand-black)]">
                    Select Your Dispatch Service
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Choose the dispatch service applicable to your agreement.
                  </p>
                </div>
              </div>

              <DispatchStep
                selectedDispatch={agreementData.selectedDispatch}
                setSelectedDispatch={handleDispatchChange}
              />

              {error && (
                <p
                  role="alert"
                  className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600"
                >
                  <AlertCircle size={17} />
                  {error}
                </p>
              )}

              {agreementData.selectedDispatch && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-[var(--brand-gold)]/40 bg-[var(--brand-light-gray)] p-3">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-brand-black"
                  />

                  <p className="text-sm leading-6 text-brand-black">
                    Selected service:{" "}
                    <strong>{agreementData.selectedDispatch}</strong>
                  </p>
                </div>
              )}
            </section>

            {/* Company information */}
            <section className="overflow-hidden rounded-2xl border border-[var(--brand-light-gray)]">
              <div className="flex items-center gap-4 bg-[var(--brand-black)] p-5 text-white sm:p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-[var(--brand-gold)]">
                  <Building2 size={24} />
                </div>

                <div className="min-w-0">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--brand-gold)] sm:text-xs">
                    Official Logistics Provider
                  </p>

                  <h2 className="text-lg font-bold tracking-wide sm:text-xl">
                    MK Transportation
                  </h2>

                  <p className="mt-1 text-xs text-white/70 sm:text-sm">
                    Logistics & Dispatch Services
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
                {companyDetails.map((detail) => {
                  const Icon = detail.icon;

                  return (
                    <div
                      key={detail.label}
                      className="flex min-w-0 items-start gap-3 rounded-xl border border-gray-100 bg-[var(--brand-light-gray)] p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-light-gray)] text-brand-black">
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-400">
                          {detail.label}
                        </p>

                        {detail.href ? (
                          <a
                            href={detail.href}
                            target={
                              detail.href.startsWith("https://")
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              detail.href.startsWith("https://")
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="mt-1 block break-words text-sm font-medium text-brand-black transition hover:text-[var(--brand-black)] hover:underline"
                          >
                            {detail.value}
                          </a>
                        ) : (
                          <p className="mt-1 break-words text-sm font-medium leading-6 text-[var(--brand-dark-gray)]">
                            {detail.value}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Agreement notice */}
            <div className="flex items-start gap-3 rounded-xl border border-[var(--brand-light-gray)] bg-[var(--brand-light-gray)] p-4">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-brand-black"
              />

              <p className="text-xs leading-6 text-gray-500">
                Please verify your selected dispatch service and company
                information before continuing to the carrier information step.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--brand-light-gray)] bg-white px-6 py-3.5 text-sm font-bold text-[var(--brand-black)] transition hover:border-[var(--brand-gold)] hover:bg-[var(--brand-light-gray)] sm:w-1/2"
              >
                <ArrowLeft size={17} />
                Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-black)] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[var(--brand-black)]/15 transition hover:bg-[var(--brand-gold-dark)] hover:shadow-xl sm:w-1/2"
              >
                Continue to Carrier Information
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};