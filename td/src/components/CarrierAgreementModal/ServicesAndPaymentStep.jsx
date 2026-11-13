import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  FileText,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import {
  CARRIER_SERVICES,
  ONBOARDING_LANE_SETUP_VALUE,
} from "./carrierServices";

const paymentOptions = [
  { value: "Zelle Transfer", icon: CreditCard },
  { value: "Chime", icon: Wallet },
  { value: "Cashapp / BTC", icon: CreditCard },
  { value: "Venmo", icon: Wallet },
  { value: "Cash Deposit", icon: Wallet },
];

const newCarrierExplanation =
  "Shipper's use fast and reliable methods such as Zelle, Venmo, or Chime because it allows them to instantly verify your refundable deposit and process your BOL, Pickup Number, Scheduling, and documents without delay. If slower methods are used like wire or other transfers, it can take 5-7 business days to verify, may involve additional fees or taxes, and can delay your load assignment. By selecting a quick option, you help ensure your load is scheduled smoothly and your deposit is refunded promptly after your first delivery.";

const oldCarrierExplanation =
  "Shipper's use fast and reliable methods such as Zelle, Venmo, or Chime because it allows them to instantly verify your deposit and process your BOL, Pickup Number, Scheduling, and documents without delay. If slower methods are used like wire or other transfers, it can take 5-7 business days to verify, may involve additional fees or taxes, and can delay your load assignment. By selecting a quick option, you help ensure your load is scheduled smoothly";

export default function ServicesAndPaymentStep({
  setStep,
  agreementData,
  setAgreementData,
}) {
  const [error, setError] = useState("");
  const selectedServices = agreementData.selectedServices || [];
  const hasAdditionalOldCarrierService = selectedServices.some(
    (service) => service !== ONBOARDING_LANE_SETUP_VALUE,
  );
  const showPaymentTerms =
    agreementData.carrierType === "new" ||
    (agreementData.carrierType === "old" && hasAdditionalOldCarrierService);

  const toggleService = (value) => {
    setAgreementData((previous) => {
      const currentServices = previous.selectedServices || [];
      const nextServices = currentServices.includes(value)
        ? currentServices.filter((service) => service !== value)
        : [...currentServices, value];
      const hasAdditionalService = nextServices.some(
        (service) => service !== ONBOARDING_LANE_SETUP_VALUE,
      );

      return {
        ...previous,
        selectedServices: nextServices,
        ...(previous.carrierType === "old" && !hasAdditionalService
          ? { paymentTermsMethod: "" }
          : {}),
      };
    });
    setError("");
  };

  const handlePaymentChange = (value) => {
    setAgreementData((previous) => ({
      ...previous,
      paymentTermsMethod: value,
    }));
    setError("");
  };

  const handleNext = () => {
    if (selectedServices.length === 0) {
      setError("Select at least one service to continue.");
      return;
    }

    if (showPaymentTerms && !agreementData.paymentTermsMethod) {
      setError("Select a payment option to continue.");
      return;
    }

    setError("");
    setStep(6);
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--brand-light-gray)] bg-white shadow-[0_24px_70px_rgba(8,9,11,0.08)]">
      <div className="h-1.5 bg-gradient-to-r from-[var(--brand-black)] via-[var(--brand-gold)] to-[var(--brand-gold)]" />
      <div className="space-y-8 p-5 sm:p-8 lg:p-10">
        <header>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--brand-gold)]/40 bg-[var(--brand-light-gray)] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-black">
            <CircleDollarSign size={15} />
            Step 5 · Services & Fees
          </div>
          <h2 className="text-2xl font-black text-[var(--brand-black)] sm:text-3xl">
            Select Services
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Choose the services needed for your carrier operation. Your
            selections will be included with your submitted agreement.
          </p>
        </header>

        <section aria-labelledby="services-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3
                id="services-heading"
                className="text-lg font-extrabold text-[var(--brand-black)]"
              >
                Services & Fees
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Select one or more services.
              </p>
            </div>
            <span className="rounded-full bg-[var(--brand-light-gray)] px-3 py-1.5 text-xs font-bold text-brand-black">
              {selectedServices.length} selected
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {CARRIER_SERVICES.map((service) => {
              const Icon = service.icon;
              const isSelected = selectedServices.includes(service.value);
              const onboardingFeeWaived =
                agreementData.carrierType === "old" &&
                service.isOnboardingLaneSetup;

              return (
                <label
                  key={service.value}
                  className={`flex cursor-pointer gap-4 rounded-2xl border p-5 transition sm:p-6 ${
                    isSelected
                      ? "border-[var(--brand-gold)] bg-[var(--brand-gold)]/5 shadow-[0_10px_28px_rgba(23,102,91,0.09)]"
                      : "border-[var(--brand-black)]/10 bg-white hover:border-[var(--brand-gold)]/70 hover:shadow-md"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleService(service.value)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[var(--brand-gold)]"
                  />
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      isSelected
                        ? "bg-[var(--brand-black)] text-[var(--brand-gold)]"
                        : "bg-[var(--brand-black)]/5 text-brand-black"
                    }`}
                  >
                    <Icon size={21} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-start justify-between gap-2">
                      <span className="text-sm font-extrabold leading-6 text-[var(--brand-black)]">
                        {service.title}
                      </span>
                      <span className="text-sm font-black text-brand-black">
                        {onboardingFeeWaived ? "No fee" : service.price}
                      </span>
                    </span>
                    <span className="mt-2 block text-xs leading-6 text-slate-600">
                      {service.description}
                    </span>
                    <span className="mt-2 block text-[11px] font-semibold leading-5 text-slate-500">
                      {onboardingFeeWaived
                        ? "No onboarding fee applies to this carrier category."
                        : service.note}
                    </span>
                    {isSelected && (
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-black">
                        <CheckCircle2 size={14} />
                        Selected
                      </span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
          <p className="mt-4 text-xs leading-6 text-slate-500">
            Service availability and applicable charges are subject to the
            relevant service terms and confirmation.
          </p>
        </section>

        {showPaymentTerms && (
          <>
            <section aria-labelledby="payment-terms-heading">
              <div className="mb-5">
                <div className="mb-3 inline-flex items-center gap-2 text-brand-black">
                  <Wallet size={19} />
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    Payment Terms
                  </span>
                </div>
                <h3
                  id="payment-terms-heading"
                  className="text-xl font-black text-[var(--brand-black)]"
                >
                  Payment Terms
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Select your preferred payment method for the Refundable
                  Security Deposit (you are not being charged now):
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected =
                    agreementData.paymentTermsMethod === option.value;

                  return (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
                        isSelected
                          ? "border-[var(--brand-gold)] bg-[var(--brand-light-gray)] ring-1 ring-[var(--brand-gold)]/15"
                          : "border-[var(--brand-light-gray)] bg-white hover:border-[var(--brand-gold)]/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentTermsMethod"
                        value={option.value}
                        checked={isSelected}
                        onChange={() => handlePaymentChange(option.value)}
                        className="h-4 w-4 accent-[var(--brand-gold)]"
                      />
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-light-gray)] text-brand-black">
                        <Icon size={19} />
                      </span>
                      <span className="font-bold text-[var(--brand-black)]">
                        {option.value}
                      </span>
                      {isSelected && (
                        <CheckCircle2
                          size={18}
                          className="ml-auto shrink-0 text-brand-black"
                        />
                      )}
                    </label>
                  );
                })}
              </div>

              {agreementData.paymentTermsMethod && (
                <p className="mt-4 rounded-xl border border-[var(--brand-gold)]/20 bg-[var(--brand-light-gray)] p-4 text-sm leading-7 text-[var(--brand-dark-gray)]">
                  {agreementData.carrierType === "old"
                    ? oldCarrierExplanation
                    : newCarrierExplanation}
                </p>
              )}
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              {agreementData.carrierType === "new" && (
                <article className="rounded-2xl border border-[var(--brand-gold)]/45 bg-[var(--brand-light-gray)] p-5">
                  <h3 className="flex items-center gap-2 font-extrabold text-brand-black">
                    <RefreshCw size={18} />
                    Refundable Security Deposit
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-brand-black">
                    The $425 dedicated lane setup fee is refundable after the
                    first delivery arranged by the company, according to the
                    applicable agreement terms.
                  </p>
                </article>
              )}
              <article className="rounded-2xl border border-[var(--brand-light-gray)] bg-[var(--brand-light-gray)] p-5">
                <h3 className="flex items-center gap-2 font-extrabold text-[var(--brand-black)]">
                  <FileText size={18} className="text-brand-black" />
                  Payment Processing
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Payment timing and any applicable third-party processing
                  charges depend on the selected method and the agreed service
                  terms. A payment option selected here records your
                  preference; no payment is collected on this page.
                </p>
              </article>
            </section>
          </>
        )}

        {error && (
          <p
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
          >
            <AlertCircle size={17} />
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-[var(--brand-light-gray)] pt-6 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => setStep(4)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--brand-light-gray)] bg-white px-6 py-3.5 text-sm font-bold text-[var(--brand-black)] transition hover:border-[var(--brand-gold)]"
          >
            <ArrowLeft size={17} />
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand-black)] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[var(--brand-gold-dark)]"
          >
            Continue to Final Submission
            <ArrowRight size={17} />
          </button>
        </div>

        <p className="flex items-center justify-center gap-2 text-center text-xs leading-5 text-slate-500">
          <ShieldCheck size={15} className="text-brand-black" />
          Your selected services are included in your agreement submission.
        </p>
      </div>
    </section>
  );
}
