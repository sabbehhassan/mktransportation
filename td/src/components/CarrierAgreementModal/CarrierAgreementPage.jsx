import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ShieldCheck } from "lucide-react";

import AgreementSelection from "./AgreementSelection";
import TruckingAgreement from "./TruckingAgreement";
import CarrierInformationStep from "./CarrierInformationStep";
import NewCarrierPaymentStep from "./NewCarrierPaymentStep";
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
  carrierType: "",
  selectedServices: [],
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

export default function CarrierAgreementPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [agreementData, setAgreementData] = useState({
    ...initialAgreementData,
  });
  const [trackingId, setTrackingId] = useState("");

  const handleSubmissionSuccess = (id) => {
    const receivedId = String(id || "").trim();

    if (!receivedId) {
      console.error("Success callback received an empty tracking ID.");
      return;
    }

    console.log("SUCCESS CALLBACK RECEIVED:", receivedId);

    setTrackingId(receivedId);

    setAgreementData((previous) => ({
      ...previous,
      trackingId: receivedId,
    }));

    setStep(6);
  };

  const handleClose = () => {
    setStep(1);
    setAgreementData({ ...initialAgreementData });
    setTrackingId("");
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#103C3A]/75 p-3 backdrop-blur-md sm:p-6">
      <div className="relative my-auto flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/50 bg-[#F5F7F4] shadow-[0_30px_100px_rgba(0,0,0,0.28)] sm:rounded-3xl">
        <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-[#103C3A] via-[#17665B] to-[#D4A84F]" />

        <div className="relative flex shrink-0 items-center justify-between gap-4 border-b border-[#103C3A]/10 bg-white px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#103C3A] text-[#F0D99B]">
              <ShieldCheck size={22} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[#103C3A] sm:text-base">
                MK Transportation
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Carrier Agreement Portal
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-[#D4A84F]/40 bg-[#F0D99B]/15 px-3 py-2 sm:flex">
            <span className="text-xs font-bold uppercase tracking-wider text-[#17665B]">
              {step === 6 ? "Completed" : `Step ${step} of 5`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close carrier agreement"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#103C3A]/10 bg-white text-[#103C3A] transition duration-300 hover:border-[#D4A84F] hover:bg-[#103C3A] hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

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
              onSubmissionSuccess={handleSubmissionSuccess}
            />
          )}

          {step === 6 && (
            <AgreementSuccessStep
              setStep={setStep}
              onClose={handleClose}
              trackingId={trackingId || agreementData.trackingId}
            />
          )}
        </div>

        <div className="flex shrink-0 items-center justify-center gap-2 border-t border-[#103C3A]/10 bg-white px-4 py-3 text-center">
          <ShieldCheck size={14} className="shrink-0 text-[#17665B]" />
          <p className="text-[10px] leading-5 text-slate-500 sm:text-xs">
            Please review your information carefully before final submission.
          </p>
        </div>
      </div>
    </div>
  );
}
