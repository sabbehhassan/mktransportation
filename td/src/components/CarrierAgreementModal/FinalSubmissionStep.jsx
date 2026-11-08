import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  FileCheck2,
  ShieldCheck,
  PenLine,
  UserRound,
  Mail,
  CreditCard,
  Building2,
  Wallet,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  CalendarDays,
  Landmark,
  FileText,
} from "lucide-react";
export default function FinalSubmissionStep({
  setStep,
  agreementData,
  setAgreementData,
  onSubmissionSuccess,
}) {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const getLocalDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = getLocalDate();

  const paymentMethods = [
    {
      value: "Factoring",
      title: "Factoring",
      description: "Receive payments through a factoring company.",
      icon: Building2,
    },
    {
      value: "ACH Direct Deposit Method",
      title: "ACH Direct Deposit",
      description: "Receive payments directly into your bank account.",
      icon: Landmark,
    },
    {
      value: "Cash On Delivery",
      title: "Cash on Delivery",
      description: "Bank details are not required for this selection.",
      icon: Wallet,
    },
    {
      value: "No Fees for 24 Hours Deposit",
      title: "24-Hour Deposit — No Fees",
      description: "Choose this payment option as listed in the agreement.",
      icon: CreditCard,
    },
  ];

  const updateField = (field, value) => {
    setAgreementData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));

    setSubmitError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!agreementData.signature?.trim()) {
      newErrors.signature = "Signature is required.";
    }

    if (!agreementData.printName?.trim()) {
      newErrors.printName = "Please enter your full printed name.";
    }

    const email = agreementData.email?.trim() || "";

    if (!email) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!agreementData.paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method.";
    }

    if (
      agreementData.paymentMethod &&
      agreementData.paymentMethod !== "Cash On Delivery"
    ) {
      if (!agreementData.bankName?.trim()) {
        newErrors.bankName = "Bank name is required.";
      }

      if (!agreementData.accountNumber?.trim()) {
        newErrors.accountNumber = "Account number is required.";
      }

      if (!agreementData.routingNumber?.trim()) {
        newErrors.routingNumber = "Routing number is required.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    setSubmitError("");

    if (!validateForm()) {
      requestAnimationFrame(() => {
        document.querySelector('[aria-invalid="true"]')?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });

      return;
    }

    setIsLoading(true);

    const finalData = {
      ...agreementData,
      email: agreementData.email.trim(),
      printName: agreementData.printName.trim(),
      signature: agreementData.signature.trim(),
      date: today,
    };

    // Do not send banking details for Cash on Delivery.
    if (finalData.paymentMethod === "Cash On Delivery") {
      finalData.bankName = "";
      finalData.accountNumber = "";
      finalData.routingNumber = "";
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "");

      if (!backendUrl) {
        throw new Error(
          "Backend URL is missing. Please check VITE_BACKEND_URL in your frontend .env file.",
        );
      }

      console.log("Submitting carrier agreement to:", backendUrl);

      const response = await fetch(
        `${backendUrl}/api/agreement/submit-agreement`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalData),
        },
      );

      const data = await response.json();

      console.log("AGREEMENT API RESPONSE:", data);

      if (!response.ok || data.success !== true) {
        throw new Error(
          data.message ||
            "Your agreement could not be submitted. Please try again.",
        );
      }

      const receivedTrackingId = String(
        data.trackingId ||
          data.tracking_id ||
          data.data?.trackingId ||
          data.data?.tracking_id ||
          "",
      ).trim();

      if (!receivedTrackingId) {
        throw new Error(
          "Agreement submitted, but the server did not return a Tracking ID.",
        );
      }

      // Save the Tracking ID and move to the success screen.
      setAgreementData((previous) => ({
        ...previous,
        trackingId: receivedTrackingId,
      }));

      console.log("AGREEMENT SUBMITTED SUCCESSFULLY:", receivedTrackingId);

      if (typeof onSubmissionSuccess === "function") {
        onSubmissionSuccess(receivedTrackingId);
      } else {
        // Fallback: open the success screen even if the callback is missing.
        console.warn(
          "onSubmissionSuccess callback is missing. Using setStep(7) fallback.",
        );

        setStep(7);
      }
    } catch (error) {
      console.error("AGREEMENT SUBMISSION ERROR:", error);

      setSubmitError(
        error.message ||
          "Something went wrong. Please check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-[#173F3A] placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#17665B] focus:ring-4 focus:ring-[#17665B]/10 ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-gray-200 hover:border-[#17665B]/40"
    }`;

  const FieldError = ({ field }) =>
    errors[field] ? (
      <p
        className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600"
        role="alert"
      >
        <AlertCircle size={14} />
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className="relative w-full overflow-hidden bg-[#F5F8F5] px-3 py-4 sm:px-6 sm:py-7">
      <div className="pointer-events-none absolute -right-28 -top-24 h-80 w-80 rounded-full bg-[#D4A84F]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-[#17665B]/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-[#DCE7DF] bg-white shadow-[0_24px_70px_rgba(16,60,58,0.10)]">
        <div className="h-1.5 bg-gradient-to-r from-[#103C3A] via-[#17665B] to-[#D4A84F]" />

        <div>
          {/* Header */}
          <div className="border-b border-gray-100 bg-gradient-to-br from-white via-white to-[#F3F7F3] px-5 py-6 sm:px-9 sm:py-8">
            <button
              type="button"
              onClick={() => setStep(5)}
              disabled={isLoading}
              className="mb-7 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#17665B] transition hover:bg-[#17665B]/5 hover:text-[#103C3A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft size={17} />
              Back to Previous Step
            </button>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#103C3A] text-[#F0D99B] shadow-lg shadow-[#103C3A]/15">
                <FileCheck2 size={31} strokeWidth={1.7} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#D4A84F]/40 bg-[#FBF6E9] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.17em] text-[#806020] sm:text-xs">
                  <ShieldCheck size={14} />
                  Final Review & Submission
                </div>

                <h1 className="text-2xl font-bold leading-tight tracking-tight text-[#103C3A] sm:text-3xl">
                  Trucking Service Agreement
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                  Complete your signature and payment information, then submit
                  your agreement.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                <span className="text-[#103C3A]">Final submission</span>
                <span className="text-[#17665B]">Step 6 of 7</span>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-[#E8EEE9]"
                role="progressbar"
                aria-label="Agreement progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={86}
              >
                <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-[#103C3A] via-[#17665B] to-[#D4A84F]" />
              </div>
            </div>
          </div>

          <div className="space-y-8 px-5 py-7 sm:px-9 sm:py-9">
            {/* Agreement terms */}
            <section className="overflow-hidden rounded-2xl border border-[#DCE7DF]">
              <div className="flex items-center gap-3 border-b border-[#DCE7DF] bg-[#F1F6F1] px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#103C3A] text-[#F0D99B]">
                  <FileText size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-[#103C3A]">Agreement Terms</h2>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Please review before signing.
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={19}
                    className="mt-0.5 shrink-0 text-[#17665B]"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[#103C3A]">
                      Agreement Duration
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      The term of this Agreement shall be{" "}
                      <strong className="text-[#103C3A]">120 days</strong>,
                      commencing on the date listed above. If not cancelled, it
                      will automatically renew.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-gray-100 pt-4">
                  <CalendarDays
                    size={19}
                    className="mt-0.5 shrink-0 text-[#17665B]"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[#103C3A]">
                      Agreement Date
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {agreementData.agreementDate || today}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-gray-100 pt-4">
                  <CalendarDays
                    size={19}
                    className="mt-0.5 shrink-0 text-[#17665B]"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[#103C3A]">
                      Submission Date
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{today}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Signature and contact */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3EC] text-[#17665B]">
                  <PenLine size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#103C3A]">
                    Signature & Contact
                  </h2>
                  <p className="text-sm text-gray-500">
                    Enter the details of the person signing this agreement.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="signature"
                    className="mb-2 block text-sm font-semibold text-[#244C45]"
                  >
                    Signature <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <PenLine
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="signature"
                      type="text"
                      autoComplete="off"
                      placeholder="Type your full signature"
                      value={agreementData.signature || ""}
                      onChange={(e) => updateField("signature", e.target.value)}
                      aria-invalid={Boolean(errors.signature)}
                      className={`${inputClass("signature")} pl-11`}
                    />
                  </div>

                  <FieldError field="signature" />
                </div>

                <div>
                  <label
                    htmlFor="printName"
                    className="mb-2 block text-sm font-semibold text-[#244C45]"
                  >
                    Printed Full Name <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <UserRound
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="printName"
                      type="text"
                      autoComplete="name"
                      placeholder="Enter your full name"
                      value={agreementData.printName || ""}
                      onChange={(e) => updateField("printName", e.target.value)}
                      aria-invalid={Boolean(errors.printName)}
                      className={`${inputClass("printName")} pl-11`}
                    />
                  </div>

                  <FieldError field="printName" />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="agreementEmail"
                    className="mb-2 block text-sm font-semibold text-[#244C45]"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="agreementEmail"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={agreementData.email || ""}
                      onChange={(e) => updateField("email", e.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      className={`${inputClass("email")} pl-11`}
                    />
                  </div>

                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    Please provide an email address you can access.
                  </p>

                  <FieldError field="email" />
                </div>
              </div>
            </section>

            {/* Payment preferences */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3EC] text-[#17665B]">
                  <CreditCard size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#103C3A]">
                    How Do You Get Paid?
                  </h2>
                  <p className="text-sm text-gray-500">
                    Select your preferred payment method.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected =
                    agreementData.paymentMethod === method.value;

                  return (
                    <label
                      key={method.value}
                      className={`relative flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-200 ${
                        isSelected
                          ? "border-[#17665B] bg-[#F0F6F1] shadow-[0_0_0_1px_rgba(23,102,91,0.12)]"
                          : "border-gray-200 bg-white hover:border-[#17665B]/40 hover:bg-[#FAFCFA]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={isSelected}
                        onChange={() =>
                          updateField("paymentMethod", method.value)
                        }
                        className="sr-only"
                      />

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isSelected
                            ? "bg-[#103C3A] text-[#F0D99B]"
                            : "bg-[#EDF2ED] text-[#17665B]"
                        }`}
                      >
                        <Icon size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-bold leading-5 text-[#103C3A]">
                            {method.title}
                          </span>

                          {isSelected && (
                            <CheckCircle2
                              size={18}
                              className="shrink-0 text-[#17665B]"
                            />
                          )}
                        </div>

                        <p className="mt-1.5 text-xs leading-5 text-gray-500">
                          {method.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              <FieldError field="paymentMethod" />

              {agreementData.paymentMethod === "Cash On Delivery" && (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#D4A84F]/40 bg-[#FBF6E9] p-4">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-[#8C6924]"
                  />
                  <div>
                    <p className="text-sm font-bold text-[#72541D]">
                      Cash on Delivery Selected
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#806B43]">
                      Bank name, account number, and routing number are not
                      required for this selection.
                    </p>
                  </div>
                </div>
              )}
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-[#DCE7DF] bg-white p-5 sm:p-6">
                <h2 className="font-bold text-[#103C3A]">Entire Contract</h2>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  This CARRIER SETUP / AGREEMENT contains all the terms and
                  conditions that fully represent the mutual understanding and
                  CARRIER SETUP / AGREEMENT between the parties. It supersedes
                  all prior CARRIER SETUP / AGREEMENT, whether verbal or
                  written, and no other understandings - express or implied -
                  exist between the parties, except as expressly stated in
                  this document.
                </p>
              </article>
              <article className="rounded-2xl border border-[#DCE7DF] bg-white p-5 sm:p-6">
                <h2 className="font-bold text-[#103C3A]">Notices</h2>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  If the Carrier intends to terminate the contract or change
                  jobs, the Carrier must provide at least 15 days&apos; prior
                  notice before ending the contract.
                </p>
              </article>
            </section>

            {/* Bank details */}
            {agreementData.paymentMethod !== "Cash On Delivery" && (
                <section className="rounded-2xl border border-[#DCE7DF] bg-[#F8FAF8] p-5 sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#103C3A] text-[#F0D99B]">
                      <Landmark size={20} />
                    </div>

                    <div>
                      <h2 className="font-bold text-[#103C3A]">
                        Bank Account Details
                      </h2>
                      <p className="text-xs text-gray-500">
                        Complete all required banking fields.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="bankName"
                        className="mb-2 block text-sm font-semibold text-[#244C45]"
                      >
                        Bank Name <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="bankName"
                        type="text"
                        autoComplete="off"
                        placeholder="Enter bank name"
                        value={agreementData.bankName || ""}
                        onChange={(e) =>
                          updateField("bankName", e.target.value)
                        }
                        aria-invalid={Boolean(errors.bankName)}
                        className={inputClass("bankName")}
                      />

                      <FieldError field="bankName" />
                    </div>

                    <div>
                      <label
                        htmlFor="accountNumber"
                        className="mb-2 block text-sm font-semibold text-[#244C45]"
                      >
                        Account Number <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="accountNumber"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="Enter account number"
                        value={agreementData.accountNumber || ""}
                        onChange={(e) =>
                          updateField("accountNumber", e.target.value)
                        }
                        aria-invalid={Boolean(errors.accountNumber)}
                        className={inputClass("accountNumber")}
                      />

                      <FieldError field="accountNumber" />
                    </div>

                    <div>
                      <label
                        htmlFor="routingNumber"
                        className="mb-2 block text-sm font-semibold text-[#244C45]"
                      >
                        Routing Number <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="routingNumber"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="Enter routing number"
                        value={agreementData.routingNumber || ""}
                        onChange={(e) =>
                          updateField("routingNumber", e.target.value)
                        }
                        aria-invalid={Boolean(errors.routingNumber)}
                        className={inputClass("routingNumber")}
                      />

                      <FieldError field="routingNumber" />
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-2 rounded-lg bg-white p-3 text-xs leading-5 text-gray-500">
                    <ShieldCheck
                      size={16}
                      className="mt-0.5 shrink-0 text-[#17665B]"
                    />
                    <p>
                      Only enter banking information required for your selected
                      payment method. Ensure the information is accurate before
                      submitting.
                    </p>
                  </div>
                </section>
              )}

            {/* Broker obligations */}
            <section className="rounded-2xl border border-[#DCE7DF] bg-white p-5 sm:p-6">
              <h2 className="mb-3 flex items-center gap-2 font-bold text-[#103C3A]">
                <ShieldCheck size={19} className="text-[#17665B]" />
                Broker Obligations
              </h2>

              <p className="text-sm leading-7 text-gray-600">
                Broker shall pay CARRIER for services rendered in accordance
                with agreed rates in Load Confirmations.
              </p>
            </section>

            {/* Carrier obligations */}
            <section className="rounded-2xl border border-[#DCE7DF] bg-white p-5 sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-[#103C3A]">
                <FileCheck2 size={19} className="text-[#17665B]" />
                Carrier Obligations
              </h2>

              <ul className="space-y-3">
                {[
                  "Carrier must check in on time at the shipper/receiver.",
                  "Submit required documents within 24 hours.",
                  "Notify the broker after a 60-minute delay.",
                  "Provide a signed Bill of Lading (BOL) and Rate Confirmation.",
                ].map((obligation, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm leading-6 text-gray-600"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-[#17665B]"
                    />
                    <span>{obligation}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Submission error */}
            {submitError && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle size={20} className="mt-0.5 shrink-0" />

                <div>
                  <p className="font-bold">Submission unsuccessful</p>
                  <p className="mt-1 break-words leading-6">{submitError}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#DCE7DF] bg-white px-6 py-3.5 text-sm font-bold text-[#103C3A] transition hover:border-[#17665B] hover:bg-[#F5F8F5] disabled:cursor-not-allowed disabled:opacity-50 sm:w-1/2"
                >
                  <ArrowLeft size={17} />
                  Previous Step
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#103C3A] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#103C3A]/15 transition duration-200 hover:bg-[#17665B] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 sm:w-1/2"
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle size={19} className="animate-spin" />
                      Submitting Agreement...
                    </>
                  ) : (
                    <>
                      <FileCheck2 size={18} />
                      Submit Agreement
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                Please verify your information before final submission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
