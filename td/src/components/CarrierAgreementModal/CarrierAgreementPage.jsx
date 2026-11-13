import { useEffect, useState } from "react";
import AgreementSelection from "./AgreementSelection";
import TruckingAgreement from "./TruckingAgreement";
import CarrierInformationStep from "./CarrierInformationStep";
import ConditionsStep from "./ConditionsStep";
import ServicesAndPaymentStep from "./ServicesAndPaymentStep";
import FinalSubmissionStep from "./FinalSubmissionStep";
import AgreementSuccessStep from "./AgreementSuccessStep";

const initialAgreementData = {
  agreementType: "",
  selectedDispatch: "",
  agreementDate: "",
  carrierName: "",
  companyName: "",
  mcDot: "",
  phone: "",
  driverName: "",
  driverPhone: "",
  licenseNumber: "",
  carrierType: "",
  selectedServices: [],
  paymentTermsMethod: "",
  paymentMethod: "",
  signature: "",
  printName: "",
  email: "",
  bankName: "",
  accountNumber: "",
  routingNumber: "",
  date: "",
  trackingId: "",
};

const steps = [
  "Agreement Selection",
  "Trucking Agreement",
  "Carrier Information",
  "Conditions",
  "Services & Fees",
  "Final Submission",
  "Success",
];

export default function CarrierAgreementPage() {
  const [step, setStep] = useState(1);
  const [agreementData, setAgreementData] = useState(initialAgreementData);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleSubmissionSuccess = (trackingId) => {
    setAgreementData((previous) => ({ ...previous, trackingId }));
    setStep(7);
  };

  return (
    <div className="bg-[var(--brand-light-gray)] px-4 pb-12 pt-4 sm:px-6 lg:px-8 lg:pt-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 rounded-2xl border border-[var(--brand-light-gray)] bg-white p-4 shadow-sm sm:mb-9 sm:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-black">
                MK Transportation
              </p>
              <h1 className="mt-1 text-xl font-black text-[var(--brand-black)] sm:text-2xl">
                Carrier Agreement
              </h1>
            </div>
            <p className="text-sm font-bold text-[var(--brand-gray)]">
              Step {step} of 7
            </p>
          </div>

          <ol
            aria-label="Agreement steps"
            className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7"
          >
            {steps.map((label, index) => {
              const stepNumber = index + 1;
              const isCurrent = stepNumber === step;
              const isComplete = stepNumber < step;

              return (
                <li
                  key={label}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`flex min-w-0 items-center gap-2 rounded-xl px-2 py-2 text-xs font-bold sm:px-3 ${
                    isCurrent
                      ? "bg-[var(--brand-black)] text-white"
                      : isComplete
                        ? "bg-[var(--brand-light-gray)] text-brand-black"
                        : "bg-[var(--brand-light-gray)] text-slate-500"
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-[11px]">
                    {stepNumber}
                  </span>
                  <span className="truncate">{label}</span>
                </li>
              );
            })}
          </ol>
        </header>

        {step === 1 && (
          <AgreementSelection
            setStep={setStep}
            setAgreementData={setAgreementData}
          />
        )}
        {step === 2 && (
          <TruckingAgreement
            setStep={setStep}
            agreementData={agreementData}
            setAgreementData={setAgreementData}
          />
        )}
        {step === 3 && (
          <CarrierInformationStep
            setStep={setStep}
            agreementData={agreementData}
            setAgreementData={setAgreementData}
          />
        )}
        {step === 4 && (
          <ConditionsStep setStep={setStep} agreementData={agreementData} />
        )}
        {step === 5 && (
          <ServicesAndPaymentStep
            setStep={setStep}
            agreementData={agreementData}
            setAgreementData={setAgreementData}
          />
        )}
        {step === 6 && (
          <FinalSubmissionStep
            setStep={setStep}
            agreementData={agreementData}
            setAgreementData={setAgreementData}
            onSubmissionSuccess={handleSubmissionSuccess}
          />
        )}
        {step === 7 && (
          <AgreementSuccessStep trackingId={agreementData.trackingId} />
        )}
      </div>
    </div>
  );
}
