import { useState } from "react";
import AgreementSelection from "./AgreementSelection";
import TruckingAgreement from "./TruckingAgreement";
import CarrierInformationStep from "./CarrierInformationStep";
import NewCarrierPaymentStep from "./NewCarrierPaymentStep";
import FinalSubmissionStep from "./FinalSubmissionStep";
import AgreementSuccessStep from "./AgreementSuccessStep";

// Initial form data — one source of truth
const createInitialAgreementData = () => ({
  agreementType: "",

  // Step 1
  selectedDispatch: "",
  agreementDate: "",

  // Carrier information
  carrierName: "",
  companyName: "",
  mcDot: "",
  phone: "",
  driverName: "",
  driverPhone: "",
  licenseNumber: "",
  carrierType: "",
  selectedServices: [],

  // Payment
  paymentMethod: "",

  // Final submission
  signature: "",
  printName: "",
  email: "",
  bankName: "",
  accountNumber: "",
  routingNumber: "",
  date: "",
});

export default function CarrierAgreementModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [agreementData, setAgreementData] = useState(
    createInitialAgreementData
  );

  const handleClose = () => {
    setStep(1);
    setAgreementData(createInitialAgreementData());
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#071C1B]/75 p-2 backdrop-blur-sm sm:p-4"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrier Agreement"
        className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#D4A84F]/30 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.30)] sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Premium brand accent */}
        <div className="h-1.5 shrink-0 bg-gradient-to-r from-[#103C3A] via-[#17665B] to-[#D4A84F]" />

        {/* Scrollable agreement content */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {step === 1 && (
            <AgreementSelection
              setStep={setStep}
              onClose={handleClose}
              agreementData={agreementData}
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
            <NewCarrierPaymentStep
              setStep={setStep}
              agreementData={agreementData}
              setAgreementData={setAgreementData}
            />
          )}

          {step === 5 && (
            <FinalSubmissionStep
              setStep={setStep}
              agreementData={agreementData}
              setAgreementData={setAgreementData}
            />
          )}

          {step === 6 && (
            <AgreementSuccessStep
              setStep={setStep}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};