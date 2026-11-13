import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InvoiceModal from "./InvoiceModal";
import DepositVerificationModal from "./DepositVerificationModal";
import { API_BASE_URL } from "../../constants/api";

const API_URL = `${API_BASE_URL}/admin`;

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [agreements, setAgreements] = useState([]);
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [showLoadForm, setShowLoadForm] = useState(false);
  const [submittingLoad, setSubmittingLoad] = useState(false);
  const [loadFormError, setLoadFormError] = useState("");
  const [loadFormSuccess, setLoadFormSuccess] = useState("");
  const [invoiceAgreementId, setInvoiceAgreementId] = useState(null);
  const [depositAgreement, setDepositAgreement] = useState(null);
  const [replacingPaymentRecord, setReplacingPaymentRecord] = useState(false);
  const [loadForm, setLoadForm] = useState({
    agreement_id: "",
    load_title: "",
    lane_type: "Dedicated Lane",
    contract_duration: "90 Days",
    pickup_location: "",
    delivery_location: "",
    return_pickup_location: "",
    return_delivery_location: "",
    pickup_date: "",
    delivery_date: "",
    pickup_time: "",
    transit_details: "",
    round_trips_per_week: "5",
    one_way_miles: "",
    round_trip_miles: "",
    dead_miles: "",
    freight_details: "",
    load_weight_lbs: "",
    backhaul_weight_lbs: "",
    payment_per_round_trip: "",
    five_day_gross: "",
    full_week_option: false,
    reservation_fee: "465",
    reservation_fee_refundable: true,
    broker_name: "",
    broker_usdot: "",
    broker_mc: "",
    load_details: "",
  });

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("adminToken");
    navigate("/admin", { replace: true });
  }, [navigate]);

  const fetchDashboardData = useCallback(async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin", { replace: true });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [agreementsResponse, loadsResponse] = await Promise.all([
        fetch(`${API_URL}/agreements`, { headers }),
        fetch(`${API_URL}/loads`, { headers }),
      ]);

      if (
        agreementsResponse.status === 401 ||
        agreementsResponse.status === 403 ||
        loadsResponse.status === 401 ||
        loadsResponse.status === 403
      ) {
        handleUnauthorized();
        return;
      }

      const agreementsData = await agreementsResponse.json();
      const loadsData = await loadsResponse.json();

      if (!agreementsResponse.ok || agreementsData.success === false) {
        throw new Error(agreementsData.message || "Unable to load agreements.");
      }

      if (!loadsResponse.ok || loadsData.success === false) {
        throw new Error(loadsData.message || "Unable to load load records.");
      }

      const agreementRows = Array.isArray(agreementsData)
        ? agreementsData
        : agreementsData.agreements || agreementsData.data || [];

      const loadRows = Array.isArray(loadsData)
        ? loadsData
        : loadsData.loads || loadsData.data || [];

      if (!Array.isArray(agreementRows) || !Array.isArray(loadRows)) {
        throw new Error("The server returned an unexpected response.");
      }

      setAgreements(agreementRows);
      setLoads(loadRows);
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to the backend. Check that the server is running.",
      );
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const updateDepositStatus = async (
    agreement,
    newStatus,
    payment = null,
    replaceExistingVerification = false,
  ) => {
    const token = localStorage.getItem("adminToken");
    const agreementId = agreement.id;

    if (!token) {
      handleUnauthorized();
      return;
    }

    if (newStatus === "verified" && !payment) {
      if (
        !agreement.invoice_id ||
        !["sent", "paid"].includes(agreement.invoice_status)
      ) {
        setError("Send an invoice successfully before verifying this deposit.");
        return false;
      }
      setDepositAgreement(agreement);
      setReplacingPaymentRecord(replaceExistingVerification);
      return false;
    }

    if (
      newStatus === "pending" &&
      !window.confirm("Are you sure you want to mark this deposit as pending?")
    ) {
      return false;
    }

    setUpdatingId(agreementId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/agreements/${agreementId}/deposit-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            deposit_status: newStatus,
            ...(newStatus === "verified"
              ? {
                  invoice_id: agreement.invoice_id,
                  replace_existing_verification:
                    replaceExistingVerification,
                }
              : {}),
            ...(payment ? { payment } : {}),
          }),
        },
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update deposit status.");
      }

      const verifiedPayment = data.agreement?.payment;
      setAgreements((current) =>
        current.map((item) =>
          String(item.id) === String(agreementId)
            ? {
                ...item,
                deposit_status: data.agreement.deposit_status,
                deposit_payment_id:
                  newStatus === "verified" ? verifiedPayment?.id : null,
                deposit_amount_received:
                  newStatus === "verified"
                    ? verifiedPayment?.amount_received
                    : null,
                deposit_payment_method:
                  newStatus === "verified"
                    ? verifiedPayment?.payment_method
                    : null,
                deposit_payment_date:
                  newStatus === "verified"
                    ? verifiedPayment?.payment_date
                    : null,
                deposit_payment_reference:
                  newStatus === "verified"
                    ? verifiedPayment?.payment_reference
                    : null,
              }
            : item,
        ),
      );
      await fetchDashboardData();
      return true;
    } catch (err) {
      setError(err.message || "Failed to update deposit status.");
      return false;
    } finally {
      setUpdatingId(null);
    }
  };

  const isDepositVerified = (status) =>
    String(status || "").toLowerCase() === "verified";

  // Use the unique agreement record / tracking ID, not email, to decide
  // which verified agreement can receive a load. An active load excludes only
  // that exact agreement record; other verified agreements remain listed.
  const activeAgreementIds = new Set(
    loads
      .filter((load) =>
        ["assigned", "picked_up", "in_transit"].includes(
          String(load.load_status || "").toLowerCase(),
        ),
      )
      .map((load) => String(load.agreement_id ?? ""))
      .filter(Boolean),
  );

  const eligibleCarriers = agreements.filter((agreement) => {
    const verified = isDepositVerified(agreement.deposit_status);
    const agreementId = String(agreement.id ?? "");
    const trackingId = String(agreement.tracking_id || "").trim();
    return (
      verified &&
      agreementId &&
      trackingId &&
      !activeAgreementIds.has(agreementId)
    );
  });

  const handleLoadFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    setLoadForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetLoadForm = () => {
    setLoadForm({
      agreement_id: "",
      load_title: "",
      lane_type: "Dedicated Lane",
      contract_duration: "90 Days",
      pickup_location: "",
      delivery_location: "",
      return_pickup_location: "",
      return_delivery_location: "",
      pickup_date: "",
      delivery_date: "",
      pickup_time: "",
      transit_details: "",
      round_trips_per_week: "5",
      one_way_miles: "",
      round_trip_miles: "",
      dead_miles: "",
      freight_details: "",
      load_weight_lbs: "",
      backhaul_weight_lbs: "",
      payment_per_round_trip: "",
      five_day_gross: "",
      full_week_option: false,
      reservation_fee: "465",
      reservation_fee_refundable: true,
      broker_name: "",
      broker_usdot: "",
      broker_mc: "",
      load_details: "",
    });
  };

  const handleAssignLoad = async (event) => {
    event.preventDefault();
    setLoadFormError("");
    setLoadFormSuccess("");

    const token = localStorage.getItem("adminToken");
    if (!token) {
      handleUnauthorized();
      return;
    }

    const requiredFields = [
      ["agreement_id", "Please select a verified carrier."],
      ["load_title", "Load title is required."],
      ["pickup_location", "Pickup location is required."],
      ["delivery_location", "Delivery location is required."],
    ];
    for (const [field, message] of requiredFields) {
      if (!String(loadForm[field] || "").trim()) {
        setLoadFormError(message);
        return;
      }
    }

    setSubmittingLoad(true);
    try {
      const payload = {
        ...loadForm,
        agreement_id: Number(loadForm.agreement_id),
        round_trips_per_week:
          loadForm.round_trips_per_week === ""
            ? null
            : Number(loadForm.round_trips_per_week),
        one_way_miles:
          loadForm.one_way_miles === "" ? null : Number(loadForm.one_way_miles),
        round_trip_miles:
          loadForm.round_trip_miles === ""
            ? null
            : Number(loadForm.round_trip_miles),
        dead_miles:
          loadForm.dead_miles === "" ? null : Number(loadForm.dead_miles),
        load_weight_lbs:
          loadForm.load_weight_lbs === ""
            ? null
            : Number(loadForm.load_weight_lbs),
        backhaul_weight_lbs:
          loadForm.backhaul_weight_lbs === ""
            ? null
            : Number(loadForm.backhaul_weight_lbs),
        payment_per_round_trip:
          loadForm.payment_per_round_trip === ""
            ? null
            : Number(loadForm.payment_per_round_trip),
        five_day_gross:
          loadForm.five_day_gross === ""
            ? null
            : Number(loadForm.five_day_gross),
        reservation_fee:
          loadForm.reservation_fee === ""
            ? 0
            : Number(loadForm.reservation_fee),
        full_week_option: Boolean(loadForm.full_week_option),
        reservation_fee_refundable: Boolean(
          loadForm.reservation_fee_refundable,
        ),
      };

      const response = await fetch(`${API_URL}/loads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }
      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Unable to assign this load.");
      }

      const newTrackingId =
        data.load?.load_tracking_id ||
        data.load_tracking_id ||
        data.tracking_id ||
        "";
      setLoadFormSuccess(
        `Load assigned successfully${newTrackingId ? ` — Tracking ID: ${newTrackingId}` : "."}`,
      );
      resetLoadForm();
      await fetchDashboardData();
    } catch (err) {
      setLoadFormError(err.message || "Failed to assign load.");
    } finally {
      setSubmittingLoad(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin", { replace: true });
  };

  const getDepositStatus = (status) => {
    const normalized = String(status || "pending").toLowerCase();

    if (isDepositVerified(normalized)) {
      return {
        label: status,
        style: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
      };
    }

    if (["rejected", "failed"].includes(normalized)) {
      return {
        label: status,
        style: "bg-red-500/10 text-red-400 ring-red-500/20",
      };
    }

    return {
      label: status || "Pending",
      style: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
    };
  };

  const getLoadStatus = (status) => {
    const normalized = String(status || "assigned").toLowerCase();

    const styles = {
      assigned: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
      picked_up: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
      in_transit: "bg-violet-500/10 text-violet-400 ring-violet-500/20",
      delivered: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
      completed: "bg-green-500/10 text-green-400 ring-green-500/20",
      cancelled: "bg-red-500/10 text-red-400 ring-red-500/20",
    };

    return {
      label: normalized.replaceAll("_", " "),
      style:
        styles[normalized] ||
        "bg-slate-500/10 text-white/75 ring-slate-500/20",
    };
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredAgreements = agreements.filter((agreement) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return [
      agreement.tracking_id,
      agreement.carrier_name,
      agreement.company_name,
      agreement.email,
      agreement.phone,
      agreement.agreement_type,
    ].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(query),
    );
  });

  const filteredLoads = loads.filter((load) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return [
      load.load_tracking_id,
      load.carrier_tracking_id,
      load.carrier_name,
      load.company_name,
      load.carrier_email,
      load.load_title,
      load.pickup_location,
      load.delivery_location,
      load.load_status,
    ].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(query),
    );
  });

  const totalAgreements = agreements.length;

  const verifiedDeposits = agreements.filter((agreement) =>
    isDepositVerified(agreement.deposit_status),
  ).length;

  const pendingDeposits = agreements.filter(
    (agreement) => !isDepositVerified(agreement.deposit_status),
  ).length;

  const activeLoads = loads.filter((load) =>
    ["assigned", "picked_up", "in_transit"].includes(
      String(load.load_status || "").toLowerCase(),
    ),
  ).length;

  const stats = [
    {
      label: "Total Agreements",
      value: totalAgreements,
      description: "Submitted carrier agreements",
      icon: "📄",
      accent: "border-blue-500",
    },
    {
      label: "Pending Deposits",
      value: pendingDeposits,
      description: "Awaiting verification",
      icon: "⏳",
      accent: "border-amber-500",
    },
    {
      label: "Verified Deposits",
      value: verifiedDeposits,
      description: "Verified or paid deposits",
      icon: "✓",
      accent: "border-emerald-500",
    },
    {
      label: "Active Loads",
      value: activeLoads,
      description: "Assigned, picked up or in transit",
      icon: "🚛",
      accent: "border-violet-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--brand-black)] text-white">
      <header className="sticky top-0 z-20 border-b border-[var(--brand-border)] bg-[var(--brand-black)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-gold)] text-xl font-bold text-[var(--brand-black)]">
              S
            </div>

            <div>
              <h1 className="text-lg font-bold sm:text-xl">
                MK Transportation
              </h1>
              <p className="text-xs text-[var(--brand-gray)]">Administration Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="rounded-lg border border-[var(--brand-border)] px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-[var(--brand-dark-gray)] disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 ring-1 ring-red-500/20 transition hover:bg-red-500/20"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-[var(--brand-gold)]">
            ADMINISTRATION
          </p>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Dashboard Overview
          </h2>

          <p className="mt-2 text-sm text-[var(--brand-gray)] sm:text-base">
            Manage carrier agreements, deposits and assigned loads.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            <p className="font-semibold">Dashboard Error</p>
            <p className="mt-1">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-3 rounded-md bg-red-500/20 px-3 py-2 font-medium hover:bg-red-500/30"
            >
              Try Again
            </button>
          </div>
        )}

        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border border-[var(--brand-border)] border-l-4 ${stat.accent} bg-[var(--brand-dark-gray)] p-6 shadow-lg`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[var(--brand-gray)]">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-4xl font-bold">
                    {loading ? "—" : stat.value}
                  </p>
                  <p className="mt-2 text-xs text-[var(--brand-gray)]">
                    {stat.description}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-dark-gray)] text-2xl">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="mb-8 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-dark-gray)] p-5 sm:p-6">
          <label
            htmlFor="dashboard-search"
            className="mb-2 block text-sm font-medium text-white/75"
          >
            Search agreements and loads
          </label>
          <input
            id="dashboard-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search carrier, email, tracking ID, location..."
            className="w-full rounded-lg border border-[var(--brand-border)] bg-[var(--brand-black)] px-4 py-3 text-sm text-white outline-none placeholder:text-[var(--brand-gray)] focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/30"
          />
        </div>

        {/* Agreements */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-dark-gray)]">
          <div className="border-b border-[var(--brand-border)] p-5 sm:p-6">
            <h3 className="text-xl font-bold">Carrier Agreements</h3>
            <p className="mt-1 text-sm text-[var(--brand-gray)]">
              Review submitted agreements and verify deposits.
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-[var(--brand-gray)]">
              Loading agreements...
            </div>
          ) : filteredAgreements.length === 0 ? (
            <div className="px-6 py-12 text-center text-[var(--brand-gray)]">
              {agreements.length === 0
                ? "No agreements found."
                : "No agreements match your search."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1300px] text-left text-sm">
                <thead className="bg-[var(--brand-black)]/70 text-xs uppercase tracking-wider text-[var(--brand-gray)]">
                  <tr>
                    <th className="px-5 py-4">Tracking ID</th>
                    <th className="px-5 py-4">Carrier</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">Agreement</th>
                    <th className="px-5 py-4">Payment Method</th>
                    <th className="px-5 py-4">Deposit Status</th>
                    <th className="px-5 py-4">Invoice Status</th>
                    <th className="px-5 py-4">Submitted</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--brand-border)]">
                  {filteredAgreements.map((agreement, index) => {
                    const verified = isDepositVerified(
                      agreement.deposit_status,
                    );
                    const deposit = getDepositStatus(agreement.deposit_status);

                    return (
                      <tr
                        key={agreement.id || agreement.tracking_id || index}
                        className="transition hover:bg-[var(--brand-dark-gray)]/40"
                      >
                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-[var(--brand-gold)]">
                          {agreement.tracking_id || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium">
                            {agreement.carrier_name ||
                              agreement.print_name ||
                              "—"}
                          </p>
                          <p className="mt-1 text-xs text-[var(--brand-gray)]">
                            {agreement.company_name || ""}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p>{agreement.email || "—"}</p>
                          <p className="mt-1 text-xs text-[var(--brand-gray)]">
                            {agreement.phone || ""}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-white/75">
                          {agreement.agreement_type || "—"}
                        </td>

                        <td className="px-5 py-4 text-white/75">
                          {agreement.payment_terms_method ||
                            agreement.payment_method ||
                            "—"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${deposit.style}`}
                          >
                            {deposit.label}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {(() => {
                            const invoiceStatus = String(
                              agreement.invoice_status || "not created",
                            ).toLowerCase();
                            const invoiceStyles = {
                              sent: "bg-blue-500/10 text-blue-300 ring-blue-500/20",
                              pending: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
                              paid: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
                              cancelled: "bg-red-500/10 text-red-300 ring-red-500/20",
                            };
                            return (
                              <span
                                className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${
                                  invoiceStyles[invoiceStatus] ||
                                  "bg-slate-500/10 text-white/75 ring-slate-500/20"
                                }`}
                              >
                                {invoiceStatus}
                              </span>
                            );
                          })()}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-[var(--brand-gray)]">
                          {formatDate(
                            agreement.created_at || agreement.agreement_date,
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateDepositStatus(
                                agreement,
                                verified ? "pending" : "verified",
                              )
                            }
                            disabled={
                              updatingId === agreement.id ||
                              !agreement.id ||
                              (!verified &&
                                !["sent", "paid"].includes(
                                  agreement.invoice_status,
                                ))
                            }
                            title={
                              !verified &&
                              !["sent", "paid"].includes(
                                agreement.invoice_status,
                              )
                                ? "Send an invoice successfully before verifying the deposit."
                                : undefined
                            }
                            className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              verified
                                ? "border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                                : "bg-[var(--brand-gold)] text-[var(--brand-black)] hover:bg-[var(--brand-gold-dark)]"
                            }`}
                          >
                            {updatingId === agreement.id
                              ? "Updating..."
                              : verified
                                ? "Mark Pending"
                                : "Verify Deposit"}
                          </button>
                          {verified && (
                            <button
                              type="button"
                              onClick={() =>
                                updateDepositStatus(
                                  agreement,
                                  "verified",
                                  null,
                                  true,
                                )
                              }
                              disabled={
                                updatingId === agreement.id ||
                                !agreement.id ||
                                !["sent", "paid"].includes(
                                  agreement.invoice_status,
                                )
                              }
                              title={
                                !["sent", "paid"].includes(
                                  agreement.invoice_status,
                                )
                                  ? "Send an invoice successfully before updating payment details."
                                  : undefined
                              }
                              className="whitespace-nowrap rounded-lg border border-[var(--brand-border)] px-3 py-2 text-xs font-semibold text-white/75 transition hover:bg-[var(--brand-dark-gray)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Update Payment Record
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setInvoiceAgreementId(agreement.id)}
                            disabled={!agreement.id}
                            className="whitespace-nowrap rounded-lg border border-[var(--brand-gold)]/30 bg-[var(--brand-gold)]/10 px-3 py-2 text-xs font-semibold text-[var(--brand-gold)] transition hover:bg-[var(--brand-gold)]/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {agreement.invoice_id ? "View Invoice" : "Send Invoice"}
                          </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Loads */}
        <section className="overflow-hidden rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-dark-gray)]">
          <div className="border-b border-[var(--brand-border)] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold">Assigned Loads</h3>
                <p className="mt-1 text-sm text-[var(--brand-gray)]">
                  Loads saved in your database and linked to carrier agreements.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setLoadFormError("");
                    setLoadFormSuccess("");
                    setShowLoadForm((current) => !current);
                  }}
                  className="rounded-lg bg-[var(--brand-gold)] px-4 py-2.5 text-sm font-bold text-[var(--brand-black)] transition hover:bg-[var(--brand-gold-dark)]"
                >
                  {showLoadForm ? "Close Form" : "+ Assign New Load"}
                </button>
                <span className="rounded-full bg-violet-500/10 px-3 py-1.5 text-sm font-semibold text-violet-300 ring-1 ring-violet-500/20">
                  {loading ? "Loading..." : `${loads.length} total loads`}
                </span>
              </div>
            </div>
          </div>

          {showLoadForm && (
            <form
              onSubmit={handleAssignLoad}
              className="border-b border-[var(--brand-border)] bg-[var(--brand-black)]/50 p-5 sm:p-6"
            >
              <div className="mb-5">
                <h4 className="text-lg font-bold">Assign a New Load</h4>
                <p className="mt-1 text-sm text-[var(--brand-gray)]">
                  Only verified carriers without an active load are listed.
                </p>
              </div>

              {loadFormError && (
                <div
                  role="alert"
                  className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
                >
                  {loadFormError}
                </div>
              )}
              {loadFormSuccess && (
                <div
                  role="status"
                  className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300"
                >
                  {loadFormSuccess}
                </div>
              )}

              <div className="mb-6 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-dark-gray)] p-4">
                <label
                  htmlFor="agreement_id"
                  className="mb-2 block text-sm font-semibold text-white/85"
                >
                  Select Verified Agreement by Tracking ID{" "}
                  <span className="text-red-400">*</span>
                </label>
                <select
                  id="agreement_id"
                  name="agreement_id"
                  value={loadForm.agreement_id}
                  onChange={handleLoadFieldChange}
                  required
                  className="w-full rounded-lg border border-[var(--brand-border)] bg-[var(--brand-black)] px-3 py-3 text-sm text-white outline-none focus:border-[var(--brand-gold)]"
                >
                  <option value="">Choose a carrier...</option>
                  {eligibleCarriers.map((carrier) => (
                    <option key={carrier.id} value={carrier.id}>
                      {carrier.tracking_id} —{" "}
                      {carrier.carrier_name || carrier.print_name || "Carrier"}{" "}
                      — {carrier.company_name || "No company"}
                    </option>
                  ))}
                </select>
                {eligibleCarriers.length === 0 && (
                  <p className="mt-2 text-sm text-amber-300">
                    No verified agreements are available. Verify an agreement's
                    deposit first, or check whether that exact agreement already
                    has an active load.
                  </p>
                )}
                {loadForm.agreement_id &&
                  (() => {
                    const carrier = eligibleCarriers.find(
                      (item) =>
                        String(item.id) === String(loadForm.agreement_id),
                    );
                    return carrier ? (
                      <div className="mt-3 grid gap-2 text-sm text-[var(--brand-gray)] sm:grid-cols-3">
                        <p>
                          <span className="text-white/85">Carrier:</span>{" "}
                          {carrier.carrier_name || carrier.print_name || "—"}
                        </p>
                        <p>
                          <span className="text-white/85">Company:</span>{" "}
                          {carrier.company_name || "—"}
                        </p>
                        <p>
                          <span className="text-white/85">
                            Agreement Tracking ID:
                          </span>{" "}
                          {carrier.tracking_id || "—"}
                        </p>
                      </div>
                    ) : null;
                  })()}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[
                  {
                    name: "load_title",
                    label: "Load Title *",
                    required: true,
                    placeholder: "90 Day Dedicated Lane",
                  },
                  {
                    name: "lane_type",
                    label: "Lane Type",
                    placeholder: "Dedicated Lane",
                  },
                  {
                    name: "contract_duration",
                    label: "Contract Duration",
                    placeholder: "90 Days",
                  },
                  {
                    name: "pickup_location",
                    label: "Pickup Location *",
                    required: true,
                    placeholder: "Tolleson, AZ",
                  },
                  {
                    name: "delivery_location",
                    label: "Delivery Location *",
                    required: true,
                    placeholder: "Flagstaff, AZ",
                  },
                  {
                    name: "return_pickup_location",
                    label: "Return Pickup Location",
                    placeholder: "Flagstaff, AZ",
                  },
                  {
                    name: "return_delivery_location",
                    label: "Return Delivery Location",
                    placeholder: "Tolleson, AZ",
                  },
                  { name: "pickup_date", label: "Pickup Date", type: "date" },
                  {
                    name: "delivery_date",
                    label: "Delivery Date",
                    type: "date",
                  },
                  {
                    name: "pickup_time",
                    label: "Pickup Time",
                    placeholder: "7:00 AM - 9:00 AM",
                  },
                  {
                    name: "transit_details",
                    label: "Transit Details",
                    placeholder: "Straight Through 24/7",
                  },
                  {
                    name: "round_trips_per_week",
                    label: "Round Trips Per Week",
                    type: "number",
                    min: "0",
                  },
                  {
                    name: "one_way_miles",
                    label: "One-Way Miles",
                    type: "number",
                    min: "0",
                    step: "any",
                  },
                  {
                    name: "round_trip_miles",
                    label: "Round-Trip Miles",
                    type: "number",
                    min: "0",
                    step: "any",
                  },
                  {
                    name: "dead_miles",
                    label: "Dead Miles",
                    type: "number",
                    min: "0",
                    step: "any",
                  },
                  {
                    name: "freight_details",
                    label: "Freight Details",
                    placeholder: "No Touch Freight",
                  },
                  {
                    name: "load_weight_lbs",
                    label: "Load Weight (lbs)",
                    type: "number",
                    min: "0",
                    step: "any",
                  },
                  {
                    name: "backhaul_weight_lbs",
                    label: "Backhaul Weight (lbs)",
                    type: "number",
                    min: "0",
                    step: "any",
                  },
                  {
                    name: "payment_per_round_trip",
                    label: "Payment Per Round Trip ($)",
                    type: "number",
                    min: "0",
                    step: "any",
                  },
                  {
                    name: "five_day_gross",
                    label: "Five-Day Gross ($)",
                    type: "number",
                    min: "0",
                    step: "any",
                  },
                  {
                    name: "reservation_fee",
                    label: "Reservation Fee ($)",
                    type: "number",
                    min: "0",
                    step: "any",
                  },
                  {
                    name: "broker_name",
                    label: "Broker Name",
                    placeholder: "Broker company name",
                  },
                  {
                    name: "broker_usdot",
                    label: "Broker USDOT",
                    placeholder: "USDOT number",
                  },
                  {
                    name: "broker_mc",
                    label: "Broker MC",
                    placeholder: "MC number",
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={field.name}
                      className="mb-1.5 block text-sm font-medium text-white/75"
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type || "text"}
                      value={loadForm[field.name]}
                      onChange={handleLoadFieldChange}
                      required={Boolean(field.required)}
                      min={field.min}
                      step={field.step}
                      placeholder={field.placeholder || ""}
                      className="w-full rounded-lg border border-[var(--brand-border)] bg-[var(--brand-dark-gray)] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/30"
                    />
                  </div>
                ))}

                <div className="md:col-span-2 xl:col-span-3">
                  <label
                    htmlFor="load_details"
                    className="mb-1.5 block text-sm font-medium text-white/75"
                  >
                    Additional Load Details
                  </label>
                  <textarea
                    id="load_details"
                    name="load_details"
                    rows="3"
                    value={loadForm.load_details}
                    onChange={handleLoadFieldChange}
                    placeholder="Add instructions or other load information..."
                    className="w-full rounded-lg border border-[var(--brand-border)] bg-[var(--brand-dark-gray)] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/30"
                  />
                </div>

                <label className="flex items-center gap-3 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-dark-gray)] p-3 text-sm text-white/75">
                  <input
                    type="checkbox"
                    name="full_week_option"
                    checked={loadForm.full_week_option}
                    onChange={handleLoadFieldChange}
                    className="h-4 w-4 accent-[var(--brand-gold)]"
                  />
                  Full-week option available
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-dark-gray)] p-3 text-sm text-white/75">
                  <input
                    type="checkbox"
                    name="reservation_fee_refundable"
                    checked={loadForm.reservation_fee_refundable}
                    onChange={handleLoadFieldChange}
                    className="h-4 w-4 accent-[var(--brand-gold)]"
                  />
                  Reservation fee is refundable
                </label>
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetLoadForm();
                    setLoadFormError("");
                    setLoadFormSuccess("");
                    setShowLoadForm(false);
                  }}
                  disabled={submittingLoad}
                  className="rounded-lg border border-[var(--brand-border)] px-5 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-[var(--brand-dark-gray)] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingLoad || eligibleCarriers.length === 0}
                  className="rounded-lg bg-[var(--brand-gold)] px-5 py-2.5 text-sm font-bold text-[var(--brand-black)] transition hover:bg-[var(--brand-gold-dark)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submittingLoad ? "Assigning Load..." : "Assign Load"}
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="px-6 py-12 text-center text-[var(--brand-gray)]">
              Loading loads...
            </div>
          ) : filteredLoads.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-4xl">🚛</div>
              <p className="mt-3 font-semibold">
                {loads.length === 0
                  ? "No loads found"
                  : "No loads match your search"}
              </p>
              <p className="mt-1 text-sm text-[var(--brand-gray)]">
                Loads returned by the backend will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px] text-left text-sm">
                <thead className="bg-[var(--brand-black)]/70 text-xs uppercase tracking-wider text-[var(--brand-gray)]">
                  <tr>
                    <th className="px-5 py-4">Load Tracking ID</th>
                    <th className="px-5 py-4">Load Title</th>
                    <th className="px-5 py-4">Carrier</th>
                    <th className="px-5 py-4">Pickup</th>
                    <th className="px-5 py-4">Delivery</th>
                    <th className="px-5 py-4">Contract</th>
                    <th className="px-5 py-4">Deposit</th>
                    <th className="px-5 py-4">Load Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--brand-border)]">
                  {filteredLoads.map((load, index) => {
                    const status = getLoadStatus(load.load_status);

                    return (
                      <tr
                        key={load.id || load.load_tracking_id || index}
                        className="transition hover:bg-[var(--brand-dark-gray)]/40"
                      >
                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-[var(--brand-gold)]">
                          {load.load_tracking_id || "—"}
                          <p className="mt-1 text-xs font-normal text-[var(--brand-gray)]">
                            Agreement #{load.agreement_id ?? "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-white">
                            {load.load_title || "—"}
                          </p>
                          <p className="mt-1 text-xs text-[var(--brand-gray)]">
                            {load.lane_type || ""}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium">
                            {load.carrier_name || "—"}
                          </p>
                          <p className="mt-1 text-xs text-[var(--brand-gray)]">
                            {load.company_name || load.carrier_email || ""}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-white/75">
                          {load.pickup_location || "—"}
                          {load.pickup_date && (
                            <p className="mt-1 text-xs text-[var(--brand-gray)]">
                              {formatDate(load.pickup_date)}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4 text-white/75">
                          {load.delivery_location || "—"}
                          {load.delivery_date && (
                            <p className="mt-1 text-xs text-[var(--brand-gray)]">
                              {formatDate(load.delivery_date)}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4 text-white/75">
                          {load.contract_duration || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                              isDepositVerified(load.deposit_status)
                                ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 ring-amber-500/20"
                            }`}
                          >
                            {load.deposit_status || "Unknown"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${status.style}`}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="py-8 text-center text-xs text-white/40">
          MK Transportation Admin Portal
        </footer>
      </main>
      {invoiceAgreementId && (
        <InvoiceModal
          agreementId={invoiceAgreementId}
          onClose={() => setInvoiceAgreementId(null)}
          onUnauthorized={handleUnauthorized}
          onUpdated={fetchDashboardData}
        />
      )}
      {depositAgreement && (
        <DepositVerificationModal
          agreement={depositAgreement}
          busy={updatingId === depositAgreement.id}
          onClose={() => {
            setDepositAgreement(null);
            setReplacingPaymentRecord(false);
          }}
          onSubmit={async (payment) => {
            const updated = await updateDepositStatus(
              depositAgreement,
              "verified",
              payment,
              replacingPaymentRecord,
            );
            if (updated) {
              setDepositAgreement(null);
              setReplacingPaymentRecord(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
