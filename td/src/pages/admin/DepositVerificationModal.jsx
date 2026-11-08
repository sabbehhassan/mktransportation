import { useState } from "react";

const getToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export default function DepositVerificationModal({
  agreement,
  busy,
  onClose,
  onSubmit,
}) {
  const [payment, setPayment] = useState({
    amountReceived: "",
    method: "",
    date: getToday(),
    reference: "",
  });

  const handleChange = (event) => {
    setPayment((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(payment);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="deposit-verification-title"
        className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:p-7"
      >
        <h2 id="deposit-verification-title" className="text-xl font-bold">
          Record &amp; Verify Deposit Payment
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Enter the details from the payment you have manually checked. This
          record is the source used for any refundable receipt.
        </p>
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950/60 p-3 text-sm">
          <p className="font-semibold text-white">
            {agreement.carrier_name || agreement.print_name || "Carrier"}
            {agreement.company_name ? ` · ${agreement.company_name}` : ""}
          </p>
          <p className="mt-1 text-slate-400">{agreement.tracking_id}</p>
        </div>
        <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label>
            <span className="mb-1.5 block text-xs font-medium text-slate-400">
              Amount received ($)
            </span>
            <input
              type="number"
              name="amountReceived"
              min="0.01"
              max="1000000"
              step="0.01"
              value={payment.amountReceived}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-medium text-slate-400">
              Payment date
            </span>
            <input
              type="date"
              name="date"
              value={payment.date}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-medium text-slate-400">
              Payment method
            </span>
            <input
              type="text"
              name="method"
              value={payment.method}
              onChange={handleChange}
              maxLength={100}
              placeholder="e.g. Zelle, ACH, wire transfer"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-medium text-slate-400">
              Payment reference (optional)
            </span>
            <input
              type="text"
              name="reference"
              value={payment.reference}
              onChange={handleChange}
              maxLength={160}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
          </label>
          <p className="sm:col-span-2 text-xs leading-5 text-amber-300">
            Verification enables load eligibility under the existing workflow.
            It does not create a receipt or assign a load.
          </p>
          <div className="flex justify-end gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-50"
            >
              {busy ? "Verifying..." : "Confirm Verified Payment"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
