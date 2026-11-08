import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Clock3,
  FileText,
  Hash,
  IdCard,
  Phone,
  Truck,
  UserRound,
} from "lucide-react";

const pickupSchedule = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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
          onChange={(event) => updateField(field, event.target.value)}
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
  const carrierTypeSelected = Boolean(agreementData.carrierType);

  const updateField = (field, value) => {
    setAgreementData((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-[#F7F9F7] px-4 py-3.5 text-sm text-[#103C3A] outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-[#17665B]/10 ${
      errors[field]
        ? "border-red-400 focus:border-red-500"
        : "border-[#103C3A]/15 hover:border-[#17665B]/50 focus:border-[#17665B]"
    }`;

  const renderField = (props) => (
    <CarrierField
      {...props}
      value={agreementData[props.field]}
      errors={errors}
      updateField={updateField}
      inputClass={inputClass}
    />
  );

  const validateForm = () => {
    const nextErrors = {};
    if (!agreementData.carrierName?.trim()) {
      nextErrors.carrierName = "Please enter the carrier's full name.";
    }
    if (!agreementData.mcDot?.trim()) {
      nextErrors.mcDot = "Please enter your MC or DOT number.";
    }
    if (!agreementData.phone?.trim()) {
      nextErrors.phone = "Please enter a contact phone number.";
    }
    if (!agreementData.driverName?.trim()) {
      nextErrors.driverName = "Please enter the driver's name.";
    }
    if (!agreementData.driverPhone?.trim()) {
      nextErrors.driverPhone = "Please enter the driver's phone number.";
    }
    if (!agreementData.licenseNumber?.trim()) {
      nextErrors.licenseNumber = "Please enter the driver's license number.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCarrierTypeChange = (value) => {
    setAgreementData((previous) => ({ ...previous, carrierType: value }));
    setErrors((previous) => ({ ...previous, carrierType: "" }));
  };

  const handleNext = () => {
    if (validateForm()) {
      setStep(4);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#DCE7DF] bg-[#F5F8F5] text-[#103C3A] shadow-[0_24px_70px_rgba(16,60,58,0.08)]">
      <div className="pointer-events-none absolute -right-32 -top-24 h-80 w-80 rounded-full bg-[#D4A84F]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-32 h-80 w-80 rounded-full bg-[#17665B]/10 blur-3xl" />
      <div className="relative mx-auto w-full max-w-5xl px-4 py-7 sm:px-7 sm:py-9 lg:px-10 lg:py-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A84F]/45 bg-white px-4 py-2">
          <Truck size={16} className="text-[#17665B]" />
          <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#17665B]">
            Carrier Onboarding · Step 3 of 7
          </span>
        </div>

        <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
          Carrier Information
        </h2>
        <p className="mb-8 mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Enter your carrier and driver details, then choose whether you are a
          New Carrier or Old Carrier.
        </p>

        <div className="overflow-hidden rounded-2xl border border-[#103C3A]/10 bg-white shadow-sm">
          <div className="flex items-center gap-4 border-b border-[#103C3A]/10 px-5 py-5 sm:px-7">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#103C3A] text-[#F0D99B]">
              <Building2 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black sm:text-xl">
                Carrier & Driver Details
              </h3>
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

            <div className="sm:col-span-2">
              <div className="mb-4 flex items-center gap-3 border-t border-[#103C3A]/10 pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0D99B]/30 text-[#17665B]">
                  <IdCard size={21} />
                </div>
                <div>
                  <h3 className="font-extrabold">Driver Information</h3>
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

            <div className="sm:col-span-2">
              <div className="mb-3 flex items-center gap-2">
                <BadgeCheck size={19} className="text-[#17665B]" />
                <label
                  htmlFor="carrier-carrierType"
                  className="text-sm font-bold"
                >
                  Carrier Type <span className="text-[#B28A35]">*</span>
                </label>
              </div>
              <select
                id="carrier-carrierType"
                name="carrierType"
                value={agreementData.carrierType || ""}
                onChange={(event) =>
                  handleCarrierTypeChange(event.target.value)
                }
                aria-invalid={Boolean(errors.carrierType)}
                aria-describedby={
                  errors.carrierType ? "error-carrierType" : undefined
                }
                className={`${inputClass("carrierType")} cursor-pointer`}
              >
                <option value="">Choose your carrier type</option>
                <option value="new">New Carrier</option>
                <option value="old">Old Carrier</option>
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
            </div>
          </div>
        </div>

        {carrierTypeSelected && (
          <>
            <section className="mt-7 rounded-2xl border border-[#103C3A]/10 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF3EC] text-[#17665B]">
                  <CalendarDays size={21} />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#103C3A]">
                    Load Pickup and Delivery Schedule
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Regular pickup windows and backhaul delivery availability.
                  </p>
                </div>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2">
                {pickupSchedule.map((day, index) => (
                  <li
                    key={day}
                    className="flex items-start gap-3 rounded-xl border border-[#DCE7DF] bg-[#F8FAF8] p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#103C3A] text-sm font-extrabold text-[#F0D99B]">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-[#103C3A]">
                        Pickup on {day}, 7:00 AM–10:00 AM
                      </p>
                      <p className="mt-1 flex items-start gap-1.5 text-sm leading-6 text-slate-600">
                        <Clock3
                          size={15}
                          className="mt-1 shrink-0 text-[#17665B]"
                        />
                        Delivery available 24/7 with backhaul service
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-5 flex items-start gap-3 rounded-2xl border border-[#D4A84F]/40 bg-[#FBF6E9] p-5">
              <FileText
                size={20}
                className="mt-0.5 shrink-0 text-[#806020]"
              />
              <div>
                <h3 className="font-extrabold text-[#72541D]">
                  Carrier Setup Agreement & Security Practices
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#725F3B]">
                  This Carrier Setup Agreement between MK Transportation Group Inc.
                  and the Carrier/Shipper is intended to support cooperation
                  and strengthen cargo and equipment security throughout the
                  transportation process. The Carrier/Shipper agrees to
                  establish, maintain, and update a traceable, documented
                  security program consistent with applicable guidelines. If
                  the Carrier/Shipper does not oversee a manufacturing site,
                  distribution point, or another part of the supply chain, it
                  will encourage the responsible third parties to follow
                  appropriate security practices.
                </p>
              </div>
            </section>

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#103C3A]/10 pt-6 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#103C3A]/15 bg-white px-6 py-3.5 text-sm font-extrabold text-[#103C3A] transition hover:border-[#D4A84F]"
              >
                <ArrowLeft size={18} />
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#103C3A] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-[#17665B]"
              >
                Continue to Conditions
                <ArrowRight size={18} className="text-[#F0D99B]" />
              </button>
            </div>
          </>
        )}

      </div>
    </section>
  );
}
