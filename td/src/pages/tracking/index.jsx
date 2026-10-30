import { useState } from "react";

const API_URL = "http://localhost:4000/api";

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (event) => {
    event.preventDefault();

    const id = trackingId.trim();

    if (!id) {
      setError("Please enter your Agreement Tracking ID.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `${API_URL}/tracking/${encodeURIComponent(id)}`,
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "No record found for this Tracking ID.",
        );
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message || "Unable to retrieve tracking details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const agreement = result?.agreement;
  const load = result?.load;

  const statusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (["verified", "completed", "delivered", "submitted"].includes(value)) {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    }

    if (["rejected", "failed", "cancelled"].includes(value)) {
      return "bg-red-500/10 text-red-400 border-red-500/30";
    }

    return "bg-amber-500/10 text-amber-400 border-amber-500/30";
  };

  const formatStatus = (status) => {
    if (!status) return "Not available";

    return String(status)
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) return "Not scheduled";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const Detail = ({ label, value }) => (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="break-words text-sm font-medium text-white">
        {value || "Not available"}
      </p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-12 pt-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-black text-slate-950">
            S
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            MK Transportation
          </p>

          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Track Your Agreement
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Enter your Agreement Tracking ID to check your verification status
            and view your assigned load information.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl sm:p-8">
          <form onSubmit={handleTrack}>
            <label
              htmlFor="trackingId"
              className="mb-3 block text-sm font-semibold text-slate-200"
            >
              Agreement Tracking ID
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="trackingId"
                type="text"
                value={trackingId}
                onChange={(event) => setTrackingId(event.target.value)}
                placeholder="e.g. SSL-20261027-02564D9A"
                autoComplete="off"
                className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-[#050816] px-4 py-4 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-emerald-500 px-7 py-4 font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Checking..." : "Track Agreement"}
              </button>
            </div>
          </form>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
            >
              {error}
            </div>
          )}
        </section>

        {result && agreement && (
          <section className="mt-8 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-8">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm text-slate-400">
                    Agreement Tracking ID
                  </p>

                  <h2 className="mt-2 break-all text-xl font-extrabold text-emerald-400 sm:text-2xl">
                    {agreement.tracking_id}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Carrier: {agreement.carrier_name}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full border px-3 py-2 text-xs font-semibold ${statusStyle(
                      agreement.deposit_status,
                    )}`}
                  >
                    Deposit: {formatStatus(agreement.deposit_status)}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-2 text-xs font-semibold ${statusStyle(
                      agreement.submission_status,
                    )}`}
                  >
                    Agreement: {formatStatus(agreement.submission_status)}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Detail label="Carrier Name" value={agreement.carrier_name} />

                <Detail label="Company" value={agreement.company_name} />

                <Detail
                  label="Agreement Type"
                  value={agreement.agreement_type}
                />

                <Detail
                  label="Dispatch Service"
                  value={agreement.selected_dispatch}
                />

                <Detail label="Carrier Type" value={agreement.carrier_type} />

                <Detail
                  label="Agreement Date"
                  value={formatDate(agreement.agreement_date)}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-8">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                  Load Information
                </p>

                <h2 className="mt-2 text-2xl font-extrabold">
                  {load ? load.load_title : "Load Not Yet Assigned"}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  {load
                    ? "Your agreement is linked to the following load."
                    : "Your deposit may be verified, but a load has not been assigned to this agreement yet."}
                </p>
              </div>

              {load ? (
                <>
                  <div className="mb-6 flex flex-col gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        Load Tracking ID
                      </p>

                      <p className="mt-2 break-all font-bold text-emerald-400">
                        {load.load_tracking_id}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-3 py-2 text-xs font-semibold ${statusStyle(
                        load.load_status,
                      )}`}
                    >
                      {formatStatus(load.load_status)}
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Detail label="Lane Type" value={load.lane_type} />

                    <Detail
                      label="Contract Duration"
                      value={load.contract_duration}
                    />

                    <Detail
                      label="Pickup Location"
                      value={load.pickup_location}
                    />

                    <Detail
                      label="Delivery Location"
                      value={load.delivery_location}
                    />

                    <Detail
                      label="Return Pickup"
                      value={load.return_pickup_location}
                    />

                    <Detail
                      label="Return Delivery"
                      value={load.return_delivery_location}
                    />

                    <Detail
                      label="Pickup Date"
                      value={formatDate(load.pickup_date)}
                    />

                    <Detail
                      label="Delivery Date"
                      value={formatDate(load.delivery_date)}
                    />

                    <Detail label="Pickup Time" value={load.pickup_time} />

                    <Detail
                      label="Round Trips Per Week"
                      value={load.round_trips_per_week}
                    />

                    <Detail label="One-Way Miles" value={load.one_way_miles} />

                    <Detail
                      label="Round-Trip Miles"
                      value={load.round_trip_miles}
                    />

                    <Detail
                      label="Freight Details"
                      value={load.freight_details}
                    />

                    <Detail label="Broker" value={load.broker_name} />
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                  <p className="font-semibold text-amber-300">
                    Waiting for load assignment
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Please keep your Agreement Tracking ID. Check again after
                    the logistics team assigns a load to your agreement.
                  </p>
                </div>
              )}
            </div>

            <p className="text-center text-xs leading-5 text-slate-500">
              For assistance with your agreement, please contact MK Transportation
              Logistics through its official support channel.
            </p>
          </section>
        )}

        <footer className="mt-10 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} MK Transportation. All rights
          reserved.
        </footer>
      </div>
    </main>
  );
}
