import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Wallet,
  CheckCircle2,
  ShieldCheck,
  FileText,
  RefreshCw,
  UserCheck,
  AlertCircle,
  CreditCard,
  LockKeyhole,
} from "lucide-react";

export default function NewCarrierPaymentStep({
  setStep,
  agreementData,
  setAgreementData,
}) {
  const [paymentTermsMethod, setPaymentTermsMethod] = useState(
    agreementData.paymentTermsMethod || ""
  );

  const [error, setError] = useState("");

  const paymentOptions = [
    {
      value: "Zelle Transfer",
      title: "Zelle Transfer",
      description: "Select Zelle as your preferred payment option.",
      icon: CreditCard,
    },
    {
      value: "Chime",
      title: "Chime",
      description: "Choose Chime for your payment arrangement.",
      icon: Wallet,
    },
    {
      value: "Cashapp / BTC",
      title: "Cash App / BTC",
      description: "Select this option if it is your agreed payment method.",
      icon: LockKeyhole,
    },
    {
      value: "Venmo",
      title: "Venmo",
      description: "Choose Venmo as your preferred payment option.",
      icon: CreditCard,
    },
  ];

  const handlePaymentChange = (value) => {
    setPaymentTermsMethod(value);

    setAgreementData((previous) => ({
      ...previous,
      paymentTermsMethod: value,
    }));

    setError("");
  };

  const handleNext = () => {
    if (!paymentTermsMethod) {
      setError("Please select a payment option to continue.");
      return;
    }

    setError("");

    setAgreementData((previous) => ({
      ...previous,
      paymentTermsMethod,
    }));

    setStep(5);
  };

  const handleBack = () => {
    setStep(3);
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#F5F8F5] px-3 py-4 sm:px-6 sm:py-7">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-[#D4A84F]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#17665B]/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-[#DCE7DF] bg-white shadow-[0_24px_70px_rgba(16,60,58,0.10)]">
        {/* Brand accent */}
        <div className="h-1.5 bg-gradient-to-r from-[#103C3A] via-[#17665B] to-[#D4A84F]" />

        <div className="max-h-[84dvh] overflow-y-auto">
          {/* Header */}
          <div className="border-b border-gray-100 bg-gradient-to-br from-white to-[#F3F7F3] px-5 py-6 sm:px-9 sm:py-8">
            <button
              type="button"
              onClick={handleBack}
              className="mb-7 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#17665B] transition hover:bg-[#17665B]/5 hover:text-[#103C3A]"
            >
              <ArrowLeft size={17} />
              Back to Carrier Information
            </button>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#103C3A] text-[#F0D99B] shadow-lg shadow-[#103C3A]/15">
                <Wallet size={30} strokeWidth={1.7} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#D4A84F]/40 bg-[#FBF6E9] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#806020] sm:text-xs">
                  <ShieldCheck size={14} />
                  Payment Terms & Policy
                </div>

                <h1 className="text-2xl font-bold leading-tight tracking-tight text-[#103C3A] sm:text-3xl">
                  Trucking Service Agreement
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                  Review the payment terms and select your preferred payment
                  option to continue.
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                <span className="text-[#103C3A]">Payment terms</span>
                <span className="text-[#17665B]">Step 4 of 5</span>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-[#E8EEE9]"
                role="progressbar"
                aria-label="Agreement progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={80}
              >
                <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-[#103C3A] via-[#17665B] to-[#D4A84F]" />
              </div>
            </div>
          </div>

          <div className="space-y-8 px-5 py-7 sm:px-9 sm:py-9">
            {/* Payment introduction */}
            <section className="rounded-2xl border border-[#DCE7DF] bg-[#F8FAF8] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#103C3A] text-[#F0D99B]">
                  <CreditCard size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-[#103C3A]">
                    Payment Arrangement
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    Payment is due prior to service activation, according to
                    the agreed terms. Select the payment option applicable to
                    your arrangement.
                  </p>
                </div>
              </div>
            </section>

            {/* Payment options */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3EC] text-[#17665B]">
                  <Wallet size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#103C3A]">
                    Select Payment Option
                    <span className="ml-1 text-red-500">*</span>
                  </h2>

                  <p className="text-sm text-gray-500">
                    Choose one option to proceed.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = paymentTermsMethod === option.value;

                  return (
                    <label
                      key={option.value}
                      className={`relative flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-200 ${
                        isSelected
                          ? "border-[#17665B] bg-[#F0F6F1] shadow-[0_0_0_1px_rgba(23,102,91,0.12)]"
                          : "border-gray-200 bg-white hover:border-[#17665B]/40 hover:bg-[#FAFCFA]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentTermsMethod"
                        value={option.value}
                        checked={isSelected}
                        onChange={() => handlePaymentChange(option.value)}
                        className="sr-only"
                      />

                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          isSelected
                            ? "bg-[#103C3A] text-[#F0D99B]"
                            : "bg-[#EDF2ED] text-[#17665B]"
                        }`}
                      >
                        <Icon size={21} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-bold text-[#103C3A]">
                            {option.title}
                          </span>

                          {isSelected && (
                            <CheckCircle2
                              size={18}
                              className="shrink-0 text-[#17665B]"
                            />
                          )}
                        </div>

                        <p className="mt-1.5 text-xs leading-5 text-gray-500">
                          {option.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {error && (
                <p
                  role="alert"
                  className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600"
                >
                  <AlertCircle size={17} />
                  {error}
                </p>
              )}

              <p className="mt-5 text-sm leading-7 text-gray-500">
                Payments may be processed via third-party accounts to enable
                same-day service. A digital receipt will be issued upon
                payment, as applicable to the agreed arrangement.
              </p>
            </section>

            {/* Refund policy */}
            <section className="rounded-2xl border border-[#D4A84F]/50 bg-gradient-to-br from-[#FBF6E9] to-white p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4A84F]/20 text-[#806020]">
                  <RefreshCw size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-[#72541D]">
                    Refund Policy
                  </h2>
                  <p className="text-xs text-[#806B43]">
                    Dedicated lane setup fee
                  </p>
                </div>
              </div>

              <p className="text-sm leading-7 text-[#725F3B]">
                The <strong>$485 dedicated lane setup fee</strong> is
                refundable after the client completes their first delivery
                arranged by the company, according to the applicable agreement
                terms.
              </p>
            </section>

            {/* Client responsibilities */}
            <section className="rounded-2xl border border-[#DCE7DF] bg-white p-5 sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-[#103C3A]">
                <UserCheck size={20} className="text-[#17665B]" />
                Client Responsibilities
              </h2>

              <ul className="space-y-3">
                {[
                  "Provide accurate legal business information.",
                  "Maintain active authority and insurance.",
                  "Maintain professional communication.",
                  "Avoid fraud and unauthorized chargebacks.",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm leading-6 text-gray-600"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-[#17665B]"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Independent carrier */}
            <section className="rounded-2xl border border-[#DCE7DF] bg-white p-5 sm:p-6">
              <h2 className="mb-3 flex items-center gap-2 font-bold text-[#103C3A]">
                <FileText size={20} className="text-[#17665B]" />
                No Employer-Employee Relationship
              </h2>

              <p className="text-sm leading-7 text-gray-600">
                This Agreement does not create an employment relationship.
                The Client operates as an independent carrier.
              </p>
            </section>

            {/* Liability */}
            <section className="rounded-2xl border border-[#DCE7DF] bg-white p-5 sm:p-6">
              <h2 className="mb-3 flex items-center gap-2 font-bold text-[#103C3A]">
                <ShieldCheck size={20} className="text-[#17665B]" />
                Limitation of Liability
              </h2>

              <p className="text-sm leading-7 text-gray-600">
                The Company is not liable for delays, missed loads, or market
                changes, subject to the terms of the applicable agreement and
                governing law.
              </p>
            </section>

            {/* Footer buttons */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#DCE7DF] bg-white px-6 py-3.5 text-sm font-bold text-[#103C3A] transition hover:border-[#17665B] hover:bg-[#F5F8F5] sm:w-1/2"
                >
                  <ArrowLeft size={17} />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#103C3A] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#103C3A]/15 transition duration-200 hover:bg-[#17665B] hover:shadow-xl sm:w-1/2"
                >
                  Continue to Final Submission
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                Please review your selected payment option before continuing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};