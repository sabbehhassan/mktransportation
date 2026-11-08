import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CARRIER_SERVICES } from "../../components/CarrierAgreementModal/carrierServices";

const API_URL = "http://localhost:4000/api/admin/invoices";

const toDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getInitialForm = () => {
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 14);
  return {
    invoiceDate: toDateInput(today),
    dueDate: toDateInput(dueDate),
    additionalCharges: "0",
    discount: "0",
    taxRate: "0",
    paymentMethod: "",
    customPaymentMethod: "",
    accountHolder: "",
    accountId: "",
    bankName: "",
    routingNumber: "",
    accountNumber: "",
    paymentInstructions: "",
    notes: "",
  };
};

const getToken = () => localStorage.getItem("adminToken");

const paymentMethodOptions = [
  "Zelle",
  "Venmo",
  "Chime",
  "Cash App",
  "Bitcoin (BTC)",
  "Bank Transfer",
  "Wire Transfer",
  "Other",
];

const getSuggestedPaymentMethod = (value) => {
  const method = String(value || "").trim();
  const normalized = method.toLowerCase();
  if (normalized.includes("zelle")) return { paymentMethod: "Zelle" };
  if (normalized.includes("venmo")) return { paymentMethod: "Venmo" };
  if (normalized.includes("chime")) return { paymentMethod: "Chime" };
  if (normalized.includes("bitcoin") || normalized.includes("btc")) {
    return { paymentMethod: "Bitcoin (BTC)" };
  }
  if (normalized.includes("cashapp") || normalized.includes("cash app")) {
    return { paymentMethod: "Cash App" };
  }
  if (normalized.includes("wire")) return { paymentMethod: "Wire Transfer" };
  if (normalized.includes("bank") || normalized.includes("ach")) {
    return { paymentMethod: "Bank Transfer" };
  }
  return method
    ? { paymentMethod: "Other", customPaymentMethod: method }
    : {};
};

const getSavedInvoiceForm = (invoice) => {
  const payment = invoice.payment || {};
  const method = invoice.paymentMethod || payment.method || "";
  const selectedMethod = payment.methodType || (
    paymentMethodOptions.includes(method) ? method : method ? "Other" : ""
  );
  return {
    ...getInitialForm(),
    invoiceDate: invoice.invoiceDate,
    dueDate: invoice.dueDate,
    additionalCharges: String(invoice.additionalCharges || 0),
    discount: String(invoice.discount || 0),
    taxRate: String(invoice.taxRate || 0),
    paymentMethod: selectedMethod,
    customPaymentMethod:
      selectedMethod === "Other" ? method : "",
    accountHolder: payment.accountHolder || payment.accountName || "",
    accountId: payment.accountId || payment.account || "",
    bankName: payment.bankName || "",
    routingNumber: payment.routingNumber || "",
    accountNumber: payment.accountNumber || "",
    paymentInstructions:
      payment.instructions || invoice.paymentInstructions || "",
    notes: invoice.notes || "",
  };
};

const readSelectedServices = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getServiceLabel = (service) => {
  const selectedValue =
    typeof service === "string" ? service : service?.value || service?.description;
  const catalogService = CARRIER_SERVICES.find(
    (item) => item.value === selectedValue,
  );
  if (catalogService) {
    return `${catalogService.title} · ${catalogService.price}`;
  }
  if (typeof service === "string") return service;
  if (service?.description) {
    return `${service.description} · $${Number(service.rate || 0).toFixed(2)}`;
  }
  return "";
};

const readApiJson = async (response, fallback) => {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Error(
      `${fallback} The backend returned an unexpected response (${response.status}).`,
    );
  }

  try {
    return await response.json();
  } catch {
    throw new Error(`${fallback} The backend returned invalid JSON.`);
  }
};

export default function InvoiceModal({
  agreementId,
  onClose,
  onUnauthorized,
  onUpdated,
}) {
  const [agreement, setAgreement] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [invoiceHistory, setInvoiceHistory] = useState([]);
  const [form, setForm] = useState(getInitialForm);
  const [previewUrl, setPreviewUrl] = useState("");
  const previewUrlRef = useRef("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const isExisting = Boolean(invoice?.id);
  const invoiceData = invoice?.invoice_data;
  const hasPaymentMethod = Boolean(
    form.paymentMethod &&
      (form.paymentMethod !== "Other" || form.customPaymentMethod.trim()),
  );
  const hasPaymentAccount = Boolean(
    form.accountHolder.trim() && form.accountId.trim(),
  );
  const canSend =
    !isExisting && Boolean(previewUrl) && hasPaymentMethod && hasPaymentAccount;
  const hasOpenInvoice = invoiceHistory.some((item) =>
    ["pending", "sent"].includes(item.status),
  );
  const statusLabel = useMemo(
    () => String(invoice?.status || "").replaceAll("_", " "),
    [invoice?.status],
  );

  const replacePreviewUrl = useCallback((nextUrl) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = nextUrl;
    setPreviewUrl(nextUrl);
  }, []);

  const request = useCallback(
    async (url, options = {}) => {
      const token = getToken();
      if (!token) {
        onUnauthorized();
        throw new Error("Admin session expired. Please sign in again.");
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });
      if (response.status === 401 || response.status === 403) {
        onUnauthorized();
        throw new Error("Admin session expired. Please sign in again.");
      }
      return response;
    },
    [onUnauthorized],
  );

  const fetchInvoicePdf = useCallback(
    async (url, filename, options = {}) => {
      const response = await request(url, options);
      if (!response.ok) {
        const data = await readApiJson(response, "Unable to load invoice PDF.");
        throw new Error(data.message || "Unable to load invoice PDF.");
      }
      const blob = await response.blob();
      const nextUrl = URL.createObjectURL(blob);
      replacePreviewUrl(nextUrl);
      if (filename) {
        const anchor = document.createElement("a");
        anchor.href = nextUrl;
        anchor.download = filename;
        anchor.click();
      }
      return nextUrl;
    },
    [request, replacePreviewUrl],
  );

  useEffect(() => {
    let active = true;
    const loadInvoiceData = async () => {
      try {
        const response = await request(`${API_URL}/agreements/${agreementId}`);
        const data = await readApiJson(response, "Unable to load the agreement.");
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load the agreement.");
        }
        if (!active) return;
        setAgreement(data);
        setInvoiceHistory(data.invoices || []);
        if (data.invoice) {
          setInvoice(data.invoice);
          setForm(getSavedInvoiceForm(data.invoice.invoice_data));
          await fetchInvoicePdf(
            `${API_URL}/${data.invoice.id}/pdf`,
            null,
          );
        } else {
          setForm({
            ...getInitialForm(),
            ...getSuggestedPaymentMethod(data.paymentMethodSuggestion),
          });
        }
      } catch (loadError) {
        if (active) setError(loadError.message || "Unable to load invoice data.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadInvoiceData();
    return () => {
      active = false;
    };
  }, [agreementId, fetchInvoicePdf, request]);

  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    [],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    replacePreviewUrl("");
    setError("");
    setNotice("");
  };

  const handlePreview = async () => {
    if (!hasPaymentMethod || !hasPaymentAccount) {
      setError(
        "Select a payment method and enter the account holder name and payment email or account ID before previewing.",
      );
      return;
    }
    setError("");
    setNotice("");
    setBusy("preview");
    try {
      await fetchInvoicePdf(
        `${API_URL}/agreements/${agreementId}/preview`,
        null,
        {
          method: "POST",
          body: JSON.stringify(form),
        },
      );
      setNotice("Preview generated. Review the PDF before sending.");
    } catch (previewError) {
      setError(previewError.message || "Unable to generate invoice preview.");
    } finally {
      setBusy("");
    }
  };

  const handleDownload = async () => {
    setError("");
    setBusy("download");
    try {
      if (isExisting) {
        await fetchInvoicePdf(
          `${API_URL}/${invoice.id}/pdf`,
          `${invoice.invoice_number}.pdf`,
        );
      } else if (previewUrl) {
        const anchor = document.createElement("a");
        anchor.href = previewUrl;
        anchor.download = "MKTransportation-invoice-preview.pdf";
        anchor.click();
      } else {
        await handlePreview();
      }
    } catch (downloadError) {
      setError(downloadError.message || "Unable to download invoice.");
    } finally {
      setBusy("");
    }
  };

  const handleSend = async () => {
    if (!canSend || !window.confirm(`Send this invoice to ${agreement.agreement.email}?`)) {
      return;
    }
    setError("");
    setBusy("send");
    try {
      const response = await request(`${API_URL}/agreements/${agreementId}`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      const data = await readApiJson(response, "Unable to send invoice.");
      if (!response.ok || !data.success) {
        if (data.invoice) {
          setInvoice(data.invoice);
          setInvoiceHistory((current) => [data.invoice, ...current]);
          onUpdated();
        }
        throw new Error(data.message || "Unable to send invoice.");
      }
      setInvoice(data.invoice);
      setInvoiceHistory((current) => [data.invoice, ...current]);
      setNotice("Invoice email sent successfully.");
      onUpdated();
      try {
        await fetchInvoicePdf(`${API_URL}/${data.invoice.id}/pdf`, null);
      } catch (pdfError) {
        setNotice(
          `Invoice email sent successfully. PDF preview could not refresh: ${pdfError.message}`,
        );
      }
    } catch (sendError) {
      setError(sendError.message || "Invoice email delivery failed.");
    } finally {
      setBusy("");
    }
  };

  const handleResend = async () => {
    if (!window.confirm(`Resend this invoice to ${invoiceData?.carrier?.email}?`)) {
      return;
    }
    setError("");
    setBusy("resend");
    try {
      const response = await request(`${API_URL}/${invoice.id}/resend`, {
        method: "POST",
      });
      const data = await readApiJson(response, "Unable to resend invoice.");
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to resend invoice.");
      }
      setInvoice((current) => ({ ...current, ...data.invoice }));
      setNotice("Invoice resent successfully.");
      onUpdated();
    } catch (resendError) {
      setError(resendError.message || "Invoice email delivery failed.");
    } finally {
      setBusy("");
    }
  };

  const handleStatus = async (status) => {
    if (!window.confirm(`Mark this invoice as ${status}?`)) return;
    setError("");
    setBusy(status);
    try {
      const response = await request(`${API_URL}/${invoice.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      const data = await readApiJson(response, "Unable to update invoice status.");
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update invoice status.");
      }
      setInvoice((current) => ({ ...current, ...data.invoice }));
      setNotice(`Invoice marked ${status}.`);
      onUpdated();
    } catch (statusError) {
      setError(statusError.message || "Unable to update invoice status.");
    } finally {
      setBusy("");
    }
  };

  const handleSelectInvoice = async (selectedInvoice) => {
    setError("");
    setNotice("");
    setInvoice(selectedInvoice);
    setForm(getSavedInvoiceForm(selectedInvoice.invoice_data));
    try {
      await fetchInvoicePdf(`${API_URL}/${selectedInvoice.id}/pdf`, null);
    } catch (pdfError) {
      setError(pdfError.message || "Unable to load invoice PDF.");
    }
  };

  const handleCreateAnother = () => {
    setInvoice(null);
    setForm({
      ...getInitialForm(),
      ...getSuggestedPaymentMethod(agreement?.paymentMethodSuggestion),
    });
    setError("");
    setNotice("");
    replacePreviewUrl("");
  };

  const shownAgreement = agreement?.agreement;
  const details = invoiceData || null;
  const agreementServices = readSelectedServices(shownAgreement?.selected_services);
  const displayedServices = details?.services || agreementServices;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="invoice-modal-title"
        className="flex max-h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-slate-800 px-5 py-4 sm:px-7">
          <div>
            <h2 id="invoice-modal-title" className="text-xl font-bold">
              {isExisting ? "Invoice History" : "Create Invoice"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {shownAgreement?.tracking_id || "Loading agreement..."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Close
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
          {error && (
            <div role="alert" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}
          {notice && (
            <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              {notice}
            </div>
          )}
          {loading ? (
            <p className="py-16 text-center text-slate-400">Loading agreement and invoice history...</p>
          ) : !shownAgreement ? (
            <p className="py-16 text-center text-slate-400">Agreement details could not be loaded.</p>
          ) : (
            <>
              {invoice && (
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
                  <div>
                    <p className="font-semibold">{invoice.invoice_number}</p>
                    <p className="mt-1 text-sm capitalize text-slate-400">
                      Status: {statusLabel} {invoice.sent_at ? `· Sent ${new Date(invoice.sent_at).toLocaleString()}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!hasOpenInvoice && ["paid", "cancelled"].includes(invoice.status) && (
                      <button
                        type="button"
                        onClick={handleCreateAnother}
                        className="rounded-lg border border-emerald-500/40 px-3 py-2 text-sm font-semibold text-emerald-300"
                      >
                        Create Another Invoice
                      </button>
                    )}
                    {["pending", "sent"].includes(invoice.status) && (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={Boolean(busy)}
                        className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
                      >
                        {busy === "resend" ? "Sending..." : invoice.status === "pending" ? "Send Invoice" : "Resend Invoice"}
                      </button>
                    )}
                    {["pending", "sent"].includes(invoice.status) && (
                      <button
                        type="button"
                        onClick={() => handleStatus("paid")}
                        disabled={Boolean(busy)}
                        className="rounded-lg border border-blue-500/40 px-3 py-2 text-sm font-semibold text-blue-300 disabled:opacity-50"
                      >
                        Mark Paid
                      </button>
                    )}
                    {["pending", "sent"].includes(invoice.status) && (
                      <button
                        type="button"
                        onClick={() => handleStatus("cancelled")}
                        disabled={Boolean(busy)}
                        className="rounded-lg border border-red-500/40 px-3 py-2 text-sm font-semibold text-red-300 disabled:opacity-50"
                      >
                        Cancel Invoice
                      </button>
                    )}
                  </div>
                </div>
              )}

              {invoiceHistory.length > 1 && (
                <section className="mb-5 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-slate-300">Invoice history</h3>
                  <div className="flex flex-wrap gap-2">
                    {invoiceHistory.map((historyInvoice) => (
                      <button
                        key={historyInvoice.id}
                        type="button"
                        onClick={() => handleSelectInvoice(historyInvoice)}
                        className={`rounded-lg border px-3 py-2 text-left text-xs ${
                          invoice?.id === historyInvoice.id
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                            : "border-slate-700 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <span className="block font-semibold">{historyInvoice.invoice_number}</span>
                        <span className="mt-1 block capitalize text-slate-400">{historyInvoice.status}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <div className="grid gap-6 xl:grid-cols-[minmax(350px,0.8fr)_minmax(0,1.2fr)]">
                <div className="space-y-5">
                  <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <h3 className="mb-3 font-semibold text-emerald-300">Agreement information</h3>
                    <dl className="grid grid-cols-[125px_1fr] gap-x-3 gap-y-2 text-sm">
                      <dt className="text-slate-500">Carrier</dt><dd>{shownAgreement.carrier_name || shownAgreement.print_name || "—"}</dd>
                      <dt className="text-slate-500">Company</dt><dd>{shownAgreement.company_name || "—"}</dd>
                      <dt className="text-slate-500">Email</dt><dd className="break-all">{shownAgreement.email || "—"}</dd>
                      <dt className="text-slate-500">Phone</dt><dd>{shownAgreement.phone || "—"}</dd>
                      <dt className="text-slate-500">MC / DOT</dt><dd>{shownAgreement.mc_dot || "—"}</dd>
                      <dt className="text-slate-500">Agreement</dt><dd>{shownAgreement.agreement_type || "—"}</dd>
                      <dt className="text-slate-500">Carrier type</dt><dd>{shownAgreement.carrier_type || "—"}</dd>
                      <dt className="text-slate-500">Tracking ID</dt><dd>{shownAgreement.tracking_id}</dd>
                      <dt className="text-slate-500">Payment method</dt><dd>{shownAgreement.payment_terms_method || "Not recorded"}</dd>
                      <dt className="text-slate-500">Services</dt>
                      <dd className="space-y-1">
                        {displayedServices.length > 0 ? (
                          displayedServices.map((service, index) => (
                            <div
                              key={`${getServiceLabel(service)}-${index}`}
                            >
                              {getServiceLabel(service)}
                            </div>
                          ))
                        ) : (
                          <span className="text-amber-300">
                            No services were saved on this agreement.
                          </span>
                        )}
                      </dd>
                    </dl>
                  </section>

                  {!isExisting && (
                    <form
                      className="grid gap-3 sm:grid-cols-2"
                      onSubmit={(event) => {
                        event.preventDefault();
                        handlePreview();
                      }}
                    >
                      {[
                        ["invoiceDate", "Invoice Date", "date"],
                        ["dueDate", "Due Date", "date"],
                        ["additionalCharges", "Additional Charges ($)", "number"],
                        ["discount", "Discount ($)", "number"],
                        ["taxRate", "Tax (%)", "number"],
                      ].map(([name, label, type]) => (
                        <label key={name}>
                          <span className="mb-1.5 block text-xs font-medium text-slate-400">{label}</span>
                          <input
                            required={type === "date"}
                            min={type === "number" ? "0" : undefined}
                            max={name === "taxRate" ? "100" : undefined}
                            step={type === "number" ? "0.01" : undefined}
                            type={type}
                            name={name}
                            value={form[name]}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                          />
                        </label>
                      ))}
                      <label className="sm:col-span-2">
                        <span className="mb-1.5 block text-xs font-medium text-slate-400">Invoice notes (optional)</span>
                        <textarea
                          name="notes"
                          rows="2"
                          value={form.notes}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                        />
                      </label>
                    </form>
                  )}

                  <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <h3 className="mb-1 font-semibold text-emerald-300">
                      Payment Method &amp; Account Details
                    </h3>
                    <p className="mb-4 text-xs leading-5 text-slate-400">
                      {isExisting
                        ? "Payment details saved with this invoice."
                        : "Enter the payment destination for this invoice. The agreement payment method is only a suggestion; each invoice uses the details entered here."}
                    </p>
                    {isExisting ? (
                      <dl className="grid grid-cols-[150px_1fr] gap-x-3 gap-y-2 text-sm">
                        {[
                          ["Payment method", details?.paymentMethod || details?.payment?.method],
                          ["Account holder", details?.payment?.accountHolder || details?.payment?.accountName],
                          ["Payment email / account ID", details?.payment?.accountId || details?.payment?.account],
                          ["Bank name", details?.payment?.bankName],
                          ["Routing number", details?.payment?.routingNumber],
                          ["Account number", details?.payment?.accountNumber],
                          ["Payment instructions", details?.payment?.instructions || details?.paymentInstructions],
                        ]
                          .filter(([, value]) => String(value || "").trim())
                          .map(([label, value]) => (
                            <Fragment key={label}>
                              <dt className="text-slate-500">{label}</dt>
                              <dd className="break-all">{value}</dd>
                            </Fragment>
                          ))}
                      </dl>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="sm:col-span-2">
                          <span className="mb-1.5 block text-xs font-medium text-slate-400">Payment method</span>
                          <select
                            name="paymentMethod"
                            value={form.paymentMethod}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
                          >
                            <option value="">Select payment method</option>
                            {paymentMethodOptions.map((method) => (
                              <option key={method} value={method}>{method}</option>
                            ))}
                          </select>
                          {shownAgreement.payment_terms_method && (
                            <span className="mt-1 block text-xs text-slate-500">
                              Agreement selection suggestion: {getSuggestedPaymentMethod(shownAgreement.payment_terms_method).customPaymentMethod || getSuggestedPaymentMethod(shownAgreement.payment_terms_method).paymentMethod || shownAgreement.payment_terms_method}
                            </span>
                          )}
                        </label>
                        {form.paymentMethod === "Other" && (
                          <label className="sm:col-span-2">
                            <span className="mb-1.5 block text-xs font-medium text-slate-400">Custom payment method</span>
                            <input
                              required
                              maxLength={80}
                              name="customPaymentMethod"
                              value={form.customPaymentMethod}
                              onChange={handleChange}
                              placeholder="Enter payment method"
                              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                            />
                          </label>
                        )}
                        {[
                          ["accountHolder", "Account Holder / Business Name", true, 160],
                          ["accountId", "Payment Email / Account ID", true, 200],
                          ["bankName", "Bank Name (optional)", false, 120],
                          ["routingNumber", "Routing Number (optional)", false, 80],
                          ["accountNumber", "Account Number (optional)", false, 100],
                        ].map(([name, label, required, maxLength]) => (
                          <label key={name}>
                            <span className="mb-1.5 block text-xs font-medium text-slate-400">{label}</span>
                            <input
                              name={name}
                              value={form[name]}
                              onChange={handleChange}
                              required={required}
                              maxLength={maxLength}
                              autoComplete="off"
                              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                            />
                          </label>
                        ))}
                        <label className="sm:col-span-2">
                          <span className="mb-1.5 block text-xs font-medium text-slate-400">Additional Payment Instructions (optional)</span>
                          <textarea
                            name="paymentInstructions"
                            rows="2"
                            maxLength={1000}
                            value={form.paymentInstructions}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                          />
                        </label>
                      </div>
                    )}
                  </section>
                </div>

                <section className="flex min-h-[420px] flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
                    <div>
                      <h3 className="font-semibold">Invoice PDF Preview</h3>
                      {details && <p className="mt-1 text-sm font-bold text-emerald-300">Total due: ${Number(details.total).toFixed(2)}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={Boolean(busy) || (!previewUrl && !isExisting)}
                      className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-50"
                    >
                      {busy === "download" ? "Preparing..." : "Download PDF"}
                    </button>
                  </div>
                  {previewUrl ? (
                    <iframe title="Invoice PDF preview" src={previewUrl} className="min-h-[420px] flex-1 bg-white" />
                  ) : (
                    <div className="flex min-h-[420px] flex-1 items-center justify-center p-8 text-center text-sm text-slate-500">
                      Generate a preview to review the final amount, payment details, and PDF.
                    </div>
                  )}
                  <div className="flex flex-wrap justify-end gap-3 border-t border-slate-800 p-4">
                    {!isExisting && (
                      <>
                        <button
                          type="button"
                          onClick={handlePreview}
                          disabled={Boolean(busy) || !hasPaymentMethod || !hasPaymentAccount}
                          className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 disabled:opacity-50"
                        >
                          {busy === "preview" ? "Generating..." : "Preview Invoice"}
                        </button>
                        <button
                          type="button"
                          onClick={handleSend}
                          disabled={Boolean(busy) || !canSend}
                          className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {busy === "send" ? "Sending..." : "Send Invoice"}
                        </button>
                      </>
                    )}
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
