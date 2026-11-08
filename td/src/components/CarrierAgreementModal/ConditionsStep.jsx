import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  Handshake,
  Landmark,
  ShieldCheck,
  Truck,
} from "lucide-react";

const shipperResponsibilities = [
  "Payment for arranged transportation is based on the rates shown in the applicable Load Confirmation. If a Load Confirmation differs from this Agreement, its terms control for that load and apply to related approved services.",
  "Additional charges may not be invoiced unless they are authorized in this Agreement or the relevant Load Confirmation. Any rate change discussed verbally must be confirmed in writing within five business days to be binding.",
  "As a condition of payment, the Carrier must submit an invoice with proof of delivery showing that the freight reached its destination.",
  "The Shipper coordinates transportation through MK Transportation Group Inc. and will comply with applicable local, state, and federal transportation requirements.",
  "The Shipper's role is limited to arranging transport. The Carrier is responsible for physically transporting the freight; the Shipper does not take possession of cargo or direct the Carrier's transportation methods.",
];

const carrierResponsibilities = [
  "Arrive and check in at the shipper or receiver by the appointment time.",
  "Send supporting records for detention, accessorial, or incidental charges within 24–48 hours after delivery.",
  "Notify the Shipper when a wait reaches 60 minutes.",
  "Detention eligibility starts two hours after the scheduled appointment at the shipper or receiver.",
  "Provide a time-stamped Bill of Lading (BOL) within 48 hours after delivery.",
];

const accessorialFees = [
  { label: "Detention", detail: "$60 per hour after the first two hours; $300 maximum per stop." },
  { label: "Layover", detail: "$250 for Dry Van and $350 for Running Reefer." },
  { label: "Truck Order Not Used (TONU)", detail: "$200." },
];

function TermsCard({ icon: Icon, title, children, className = "" }) {
  return (
    <article
      className={`rounded-2xl border border-[#DCE7DF] bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF3EC] text-[#17665B]">
          <Icon size={20} />
        </span>
        <h3 className="text-base font-extrabold text-[#103C3A] sm:text-lg">
          {title}
        </h3>
      </div>
      {children}
    </article>
  );
}

function TermsList({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 text-sm leading-7 text-slate-600"
        >
          <CheckCircle2
            size={17}
            className="mt-1 shrink-0 text-[#17665B]"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ConditionsStep({ setStep, agreementData }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#DCE7DF] bg-[#F5F8F5] shadow-[0_24px_70px_rgba(16,60,58,0.08)]">
      <div className="h-1.5 bg-gradient-to-r from-[#103C3A] via-[#17665B] to-[#D4A84F]" />
      <div className="space-y-6 p-5 sm:p-8 lg:p-10">
        <header className="rounded-2xl bg-[#103C3A] p-5 text-white sm:p-7">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#F0D99B]">
            <ShieldCheck size={15} />
            Step 4 · Agreement Terms
          </div>
          <h2 className="text-2xl font-black sm:text-3xl">
            Terms, Responsibilities & Fees
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
            Please review these terms for the arrangement between MK
            Transportation LLC and the Carrier before proceeding.
          </p>
        </header>

        <TermsCard icon={Handshake} title="Shipper Responsibilities">
          <TermsList items={shipperResponsibilities} />
        </TermsCard>

        {agreementData.carrierType !== "old" && (
          <TermsCard
            icon={BadgeDollarSign}
            title="Onboarding Lane Setup Deposit"
            className="border-[#D4A84F]/50 bg-gradient-to-br from-[#FBF6E9] to-white"
          >
            <div className="space-y-3 text-sm leading-7 text-[#725F3B]">
              <p>
                The Carrier provides a <strong>$425 security deposit</strong>{" "}
                to MK Transportation Group Inc. by direct or instant payment. The
                deposit is refundable after the Carrier completes its first
                delivery and receives payment for that load. The Carrier
                should obtain a deposit receipt from an MK Transportation
                representative.
              </p>
              <p>
                At contract termination, the deposit is refundable when there
                are no outstanding obligations or Carrier-caused damages. Any
                termination notice must follow the 15-day notice provision
                below. Detention charges, when applicable, are the Shipper's
                responsibility.
              </p>
            </div>
          </TermsCard>
        )}

        <TermsCard icon={Landmark} title="Payment Terms">
          <p className="mb-4 text-sm leading-7 text-slate-600">
            To request payment, the Carrier submits a signed Rate Confirmation
            together with its company invoice to the Shipper.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                name: "Quick Pay",
                detail: "A 2% fee applies for same-day deposit.",
              },
              {
                name: "Standard Pay",
                detail: "No fee; deposit is made within 24 hours.",
              },
              {
                name: "Cash on Delivery",
                detail: "Available as a payment arrangement.",
              },
            ].map((option) => (
              <div
                key={option.name}
                className="rounded-xl border border-[#DCE7DF] bg-[#F8FAF8] p-4"
              >
                <p className="font-extrabold text-[#103C3A]">{option.name}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {option.detail}
                </p>
              </div>
            ))}
          </div>
        </TermsCard>

        <TermsCard icon={Truck} title="Carrier Responsibilities">
          <TermsList items={carrierResponsibilities} />
          <div className="mt-5 grid gap-3 border-t border-[#DCE7DF] pt-5 sm:grid-cols-3">
            {accessorialFees.map((fee) => (
              <div
                key={fee.label}
                className="rounded-xl bg-[#F8FAF8] p-4"
              >
                <p className="font-extrabold text-[#103C3A]">{fee.label}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {fee.detail}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-[#D4A84F]/40 bg-[#FBF6E9] p-4 text-sm leading-6 text-[#725F3B]">
            <FileCheck2
              size={17}
              className="mt-1 shrink-0 text-[#806020]"
            />
            The Shipper must approve and confirm delays or cancellations.
            Layover, detention, and other accessorial charges also require
            approval before they are billed.
          </p>
        </TermsCard>

        <TermsCard icon={Clock3} title="Agreement Period & Ending the Agreement">
          <p className="text-sm leading-7 text-slate-600">
            This Agreement begins on its stated effective date and continues
            for <strong className="text-[#103C3A]">120 days</strong>. Unless
            either party ends it, the Agreement renews for successive one-year
            periods. Either party may terminate by giving at least{" "}
            <strong className="text-[#103C3A]">
              15 days&apos; written or electronic notice
            </strong>
            , provided outstanding balances have been settled.
          </p>
        </TermsCard>

        <TermsCard icon={FileText} title="Legal & Regulatory Compliance">
          <p className="text-sm leading-7 text-slate-600">
            This Agreement does not remove any Carrier or Shipper
            responsibility for legal or regulatory penalties resulting from
            discrepancies found in cargo inspections or customs records. All
            duties under applicable Canadian and United States laws, including
            Customs Regulations, remain in effect.
          </p>
        </TermsCard>

        <div className="flex flex-col-reverse gap-3 border-t border-[#DCE7DF] pt-6 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => setStep(3)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE7DF] bg-white px-6 py-3.5 text-sm font-bold text-[#103C3A] transition hover:border-[#17665B]"
          >
            <ArrowLeft size={17} />
            Previous
          </button>
          <button
            type="button"
            onClick={() => setStep(5)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#103C3A] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#17665B]"
          >
            Continue to Services & Fees
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
