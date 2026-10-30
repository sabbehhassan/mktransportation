import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Truck,
  Building2,
  Hash,
  Phone,
  UserRound,
  IdCard,
  ShieldCheck,
  CheckCircle2,
  CircleDollarSign,
  Route,
  CreditCard,
  AlertCircle,
  BadgeCheck,
} from "lucide-react";

// IMPORTANT: Field component parent component ke bahar hai.
// Is se typing ke waqt input remount nahi hoga aur focus lose nahi hoga.
function CarrierField({
  field,
  label,
  placeholder,
  icon: Icon,
  required = false,
  type = "text",
  autoComplete,
  value,
  errors,
  updateField,
  inputClass,
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={`carrier-${field}`}
        className="mb-2 flex items-center gap-1.5 text-sm font-bold text-[#103C3A]"
      >
        {label}
        {required && <span className="text-[#B28A35]">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
              errors[field] ? "text-red-400" : "text-[#17665B]/70"
            }`}
          />
        )}

        <input
          id={`carrier-${field}`}
          name={field}
          type={type}
          value={value || ""}
          onChange={(e) => updateField(field, e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={Boolean(errors[field])}
          aria-describedby={errors[field] ? `error-${field}` : undefined}
          className={`${inputClass(field)} ${Icon ? "pl-11" : ""}`}
        />
      </div>

      {errors[field] && (
        <p
          id={`error-${field}`}
          className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-red-600"
        >
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          {errors[field]}
        </p>
      )}
    </div>
  );
}

export default function CarrierInformationStep({
  setStep,
  agreementData,
  setAgreementData,
}) {
  const [errors, setErrors] = useState({});

  // Existing service values backend compatibility ke liye unchanged hain.
  const services = [
    {
      value: "Dedicated Lane Setup - $485 (Refundable after first delivery)",
      title: "Dedicated Lane Setup",
      price: "$485",
      description: "Dedicated route onboarding support.",
      note: "Refundable after first delivery",
      icon: Route,
    },
    {
      value: "TWIC Card Application - $360 (Same-day processing)",
      title: "TWIC Card Application",
      price: "$360",
      description: "Guidance with TWIC application preparation.",
      note: "Application assistance",
      icon: IdCard,
    },
    {
      value: "Trailer Rental (3 months) - $500",
      title: "Trailer Rental",
      price: "$500",
      description: "Trailer rental option for a three-month period.",
      note: "3-month term",
      icon: Truck,
    },
    {
      value: "Factoring Setup - $250 (Same-day registration)",
      title: "Factoring Setup",
      price: "$250",
      description: "Support with factoring provider onboarding.",
      note: "Registration assistance",
      icon: CreditCard,
    },
    {
      value: "Insurance Assistance - $399",
      title: "Insurance Assistance",
      price: "$399",
      description: "Guidance with trucking insurance documentation.",
      note: "Application support",
      icon: ShieldCheck,
    },
  ];

  const updateField = (field, value) => {
    setAgreementData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const toggleService = (serviceValue) => {
    setAgreementData((prev) => {
      const currentServices = prev.selectedServices || [];

      const updatedServices = currentServices.includes(serviceValue)
        ? currentServices.filter((item) => item !== serviceValue)
        : [...currentServices, serviceValue];

      return {
        ...prev,
        selectedServices: updatedServices,
      };
    });
  };

  const handleCarrierTypeChange = (value) => {
    setAgreementData((prev) => ({
      ...prev,
      carrierType: value,
      ...(value === "old" ? { selectedServices: [] } : {}),
    }));

    setErrors((prev) => ({
      ...prev,
      carrierType: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!agreementData.carrierName?.trim()) {
      newErrors.carrierName = "Please enter the carrier's full name.";
    }

    if (!agreementData.mcDot?.trim()) {
      newErrors.mcDot = "Please enter your MC or DOT number.";
    }

    if (!agreementData.phone?.trim()) {
      newErrors.phone = "Please enter a contact phone number.";
    }

    if (!agreementData.carrierType) {
      newErrors.carrierType = "Please select your carrier category.";
    }

    if (!agreementData.driverName?.trim()) {
      newErrors.driverName = "Please enter the driver's name.";
    }

    if (!agreementData.driverPhone?.trim()) {
      newErrors.driverPhone = "Please enter the driver's phone number.";
    }

    if (!agreementData.licenseNumber?.trim()) {
      newErrors.licenseNumber =
        "Please enter the driver's license number.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-[#F7F9F7] px-4 py-3.5 text-sm text-[#103C3A] outline-none transition duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-[#17665B]/10 ${
      errors[field]
        ? "border-red-400 focus:border-red-500"
        : "border-[#103C3A]/15 hover:border-[#17665B]/50 focus:border-[#17665B]"
    }`;

  const selectedServices = agreementData.selectedServices || [];

  // Har field ko stable CarrierField component render karta hai.
  const renderField = (props) => (
    <CarrierField
      {...props}
      value={agreementData[props.field]}
      errors={errors}
      updateField={updateField}
      inputClass={inputClass}
    />
  );

  return (
    <section className="relative overflow-hidden bg-[#F5F7F4] text-[#103C3A]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 -top-24 h-80 w-80 rounded-full bg-[#D4A84F]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-32 h-80 w-80 rounded-full bg-[#17665B]/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-5xl px-4 py-7 sm:px-7 sm:py-9 lg:px-10 lg:py-10">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => setStep(2)}
          className="group mb-7 inline-flex items-center gap-2 rounded-lg text-sm font-bold text-[#17665B] transition hover:text-[#103C3A]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#103C3A]/10 bg-white transition group-hover:border-[#D4A84F] group-hover:bg-[#103C3A] group-hover:text-white">
            <ArrowLeft size={17} />
          </span>
          Back to Agreement
        </button>

        {/* Heading */}
        <div className="mb-9">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A84F]/45 bg-white px-4 py-2">
            <Truck size={16} className="text-[#17665B]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#17665B] sm:text-xs">
              Carrier Onboarding
            </span>
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
            Tell Us About Your
            <span className="block text-[#17665B]">
              Trucking Business.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            Provide your carrier and driver details, choose your carrier
            category, and select any services you need for your operation.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-9 rounded-2xl border border-[#103C3A]/10 bg-white p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-[#103C3A]">
                Carrier Information
              </p>
              <p className="mt-1 text-xs text-slate-500">Step 3 of 5</p>
            </div>

            <span className="rounded-full bg-[#F0D99B]/30 px-3 py-1.5 text-xs font-extrabold text-[#17665B]">
              60% Complete
            </span>
          </div>

          <div
            className="h-2 overflow-hidden rounded-full bg-[#103C3A]/10"
            role="progressbar"
            aria-label="Agreement progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={60}
          >
            <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-[#103C3A] via-[#17665B] to-[#D4A84F]" />
          </div>
        </div>

        {/* Carrier details */}
        <div className="overflow-hidden rounded-2xl border border-[#103C3A]/10 bg-white shadow-[0_12px_35px_rgba(16,60,58,0.045)]">
          <div className="flex items-center gap-4 border-b border-[#103C3A]/10 px-5 py-5 sm:px-7">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#103C3A] text-[#F0D99B]">
              <Building2 size={24} />
            </div>

            <div>
              <h2 className="text-lg font-black sm:text-xl">
                Carrier & Driver Details
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Complete all required fields marked with an asterisk.
              </p>
            </div>
          </div>

          <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-7">
            {renderField({
              field: "carrierName",
              label: "Carrier Full Name",
              placeholder: "Enter carrier's full name",
              icon: UserRound,
              required: true,
              autoComplete: "name",
            })}

            {renderField({
              field: "companyName",
              label: "Company Name",
              placeholder: "Enter registered business name",
              icon: Building2,
              autoComplete: "organization",
            })}

            {renderField({
              field: "mcDot",
              label: "MC / DOT Number",
              placeholder: "Enter MC or DOT number",
              icon: Hash,
              required: true,
            })}

            {renderField({
              field: "phone",
              label: "Carrier Phone Number",
              placeholder: "Enter business contact number",
              icon: Phone,
              required: true,
              type: "tel",
              autoComplete: "tel",
            })}

            {/* Driver information heading */}
            <div className="sm:col-span-2">
              <div className="mb-4 flex items-center gap-3 border-t border-[#103C3A]/10 pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0D99B]/30 text-[#17665B]">
                  <IdCard size={21} />
                </div>

                <div>
                  <h3 className="font-extrabold text-[#103C3A]">
                    Driver Information
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Enter the designated driver's contact and license details.
                  </p>
                </div>
              </div>
            </div>

            {renderField({
              field: "driverName",
              label: "Driver Full Name",
              placeholder: "Enter driver's full name",
              icon: UserRound,
              required: true,
              autoComplete: "name",
            })}

            {renderField({
              field: "driverPhone",
              label: "Driver Phone Number",
              placeholder: "Enter driver's phone number",
              icon: Phone,
              required: true,
              type: "tel",
              autoComplete: "tel",
            })}

            <div className="sm:col-span-2">
              {renderField({
                field: "licenseNumber",
                label: "Driver's License Number",
                placeholder: "Enter driver's license number",
                icon: IdCard,
                required: true,
              })}
            </div>

            {/* Carrier type */}
            <div className="sm:col-span-2">
              <div className="mb-3 flex items-center gap-2">
                <BadgeCheck size={19} className="text-[#17665B]" />
                <label
                  htmlFor="carrier-carrierType"
                  className="text-sm font-bold text-[#103C3A]"
                >
                  Carrier Category <span className="text-[#B28A35]">*</span>
                </label>
              </div>

              <select
                id="carrier-carrierType"
                name="carrierType"
                value={agreementData.carrierType || ""}
                onChange={(e) => handleCarrierTypeChange(e.target.value)}
                aria-invalid={Boolean(errors.carrierType)}
                aria-describedby={
                  errors.carrierType ? "error-carrierType" : undefined
                }
                className={`${inputClass("carrierType")} cursor-pointer`}
              >
                <option value="">Choose your carrier category</option>
                <option value="new">New Carrier</option>
                <option value="old">Established Carrier (2+ Years)</option>
              </select>

              {errors.carrierType && (
                <p
                  id="error-carrierType"
                  className="mt-2 flex items-center gap-1.5 text-xs text-red-600"
                >
                  <AlertCircle size={14} />
                  {errors.carrierType}
                </p>
              )}

              <p className="mt-2 text-xs leading-6 text-slate-500">
                Select the category that best describes your carrier business.
              </p>
            </div>
          </div>
        </div>

        {/* Services */}
        {agreementData.carrierType && (
          <div className="mt-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[#B28A35]">
                  <CircleDollarSign size={19} />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.16em]">
                    Optional Services
                  </span>
                </div>

                <h2 className="text-2xl font-black sm:text-3xl">
                  Choose Your Services
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-7 text-slate-600">
                  Select the services relevant to your operation. Review the
                  listed pricing and terms before proceeding.
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#17665B]/15 bg-white px-3 py-2 text-xs font-bold text-[#17665B]">
                <CheckCircle2 size={15} />
                {selectedServices.length} selected
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((service) => {
                const Icon = service.icon;
                const isSelected = selectedServices.includes(service.value);
                const isEstablishedCarrier =
                  agreementData.carrierType === "old";
                const isDedicatedLane =
                  service.title === "Dedicated Lane Setup";

                return (
                  <label
                    key={service.value}
                    className={`group relative flex cursor-pointer gap-4 rounded-2xl border p-5 transition-all duration-300 sm:p-6 ${
                      isSelected
                        ? "border-[#17665B] bg-[#17665B]/5 shadow-[0_10px_28px_rgba(23,102,91,0.09)]"
                        : "border-[#103C3A]/10 bg-white hover:-translate-y-0.5 hover:border-[#D4A84F]/70 hover:shadow-[0_12px_30px_rgba(16,60,58,0.06)]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleService(service.value)}
                      className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#17665B]"
                    />

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isSelected
                          ? "bg-[#103C3A] text-[#F0D99B]"
                          : "bg-[#103C3A]/5 text-[#17665B] group-hover:bg-[#F0D99B]/40"
                      }`}
                    >
                      <Icon size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="text-sm font-extrabold leading-6 text-[#103C3A]">
                          {service.title}
                        </h3>

                        {isEstablishedCarrier && isDedicatedLane ? (
                          <span className="rounded-full bg-[#17665B]/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#17665B]">
                            No fee
                          </span>
                        ) : (
                          <span className="text-sm font-black text-[#17665B]">
                            {service.price}
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-xs leading-6 text-slate-600">
                        {service.description}
                      </p>

                      <p className="mt-2 text-[11px] font-semibold leading-5 text-slate-500">
                        {isEstablishedCarrier && isDedicatedLane
                          ? "Dedicated lane setup is listed without a fee for this carrier category."
                          : service.note}
                      </p>

                      {isSelected && (
                        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#17665B]">
                          <CheckCircle2 size={14} />
                          Selected
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              Service availability and applicable charges are subject to the
              relevant service terms and confirmation.
            </p>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-9 flex flex-col-reverse gap-3 border-t border-[#103C3A]/10 pt-6 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#103C3A]/15 bg-white px-6 py-3.5 text-sm font-extrabold text-[#103C3A] transition hover:border-[#D4A84F] hover:bg-[#F5F7F4] sm:min-w-40"
          >
            <ArrowLeft size={18} />
            Previous Step
          </button>

          <button
            type="button"
            onClick={() => {
              if (!validateForm()) return;

              if (agreementData.carrierType === "new") {
                setStep(4);
              } else {
                setStep(5);
              }
            }}
            className="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#103C3A] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#17665B] hover:shadow-xl sm:min-w-48"
          >
            Continue
            <ArrowRight
              size={18}
              className="text-[#F0D99B] transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* Trust note */}
        <div className="mt-5 flex items-start justify-center gap-2 text-center">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#17665B]" />
          <p className="text-[11px] leading-5 text-slate-500">
            Please ensure your carrier and driver details are accurate before
            moving to the next step.
          </p>
        </div>
      </div>
    </section>
  );
};