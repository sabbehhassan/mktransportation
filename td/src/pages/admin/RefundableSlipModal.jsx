import { useCallback, useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../../constants/api";

const API_URL = `${API_BASE_URL}/admin/invoices`;

const getToken = () => localStorage.getItem("adminToken");

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

const readImage = (file, maxSize) =>
  new Promise((resolve, reject) => {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      reject(new Error("Upload a PNG, JPEG, or WebP image."));
      return;
    }
    if (file.size > maxSize) {
      reject(new Error(`Image must be no larger than ${Math.floor(maxSize / 1024)} KB.`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
};

export default function RefundableSlipModal({
  invoiceId,
  onClose,
  onUnauthorized,
  onReceiptUpdated,
}) {
  const [context, setContext] = useState(null);
  const [settings, setSettings] = useState(null);
  const [activeTab, setActiveTab] = useState("receipt");
  const [previewUrl, setPreviewUrl] = useState("");
  const previewUrlRef = useRef("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [settingsDirty, setSettingsDirty] = useState(false);
  const [policyReviewed, setPolicyReviewed] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const receipt = context?.receipt;
  const receiptData = receipt?.receipt_data;
  const agreement = context?.agreement;
  const payment = receiptData?.payment || context?.payment;
  const isSent = receipt?.status === "sent";
  const authorizationForReceipt =
    receiptData?.authorization || settings || {};
  const hasAuthorization = Boolean(
    authorizationForReceipt.name?.trim() &&
      authorizationForReceipt.position?.trim() &&
      authorizationForReceipt.signatureDataUrl,
  );
  const canSend = Boolean(
    receipt &&
      ["draft", "failed"].includes(receipt.status) &&
      previewUrl &&
      policyReviewed &&
      hasAuthorization &&
      !settingsDirty &&
      String(agreement?.deposit_status).toLowerCase() === "verified",
  );

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

  const replacePreviewUrl = useCallback((nextUrl) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = nextUrl;
    setPreviewUrl(nextUrl);
  }, []);

  const refreshContext = useCallback(
    async ({ loadPdf = false, loadSettings = false } = {}) => {
      const response = await request(`${API_URL}/${invoiceId}/receipt`);
      const data = await readApiJson(response, "Unable to load refundable receipt details.");
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load refundable receipt details.");
      }
      setContext(data);
      if (loadSettings || !settings) {
        setSettings(data.settings);
        setSettingsDirty(false);
      }
      if (data.receipt?.receipt_data?.refundPolicy) {
        setPolicyReviewed(false);
      }
      if (loadPdf && data.receipt) {
        const pdfResponse = await request(`${API_URL}/${invoiceId}/receipt/pdf`);
        if (!pdfResponse.ok) {
          const failure = await readApiJson(pdfResponse, "Unable to load receipt PDF.");
          throw new Error(failure.message || "Unable to load receipt PDF.");
        }
        replacePreviewUrl(URL.createObjectURL(await pdfResponse.blob()));
      }
      return data;
    },
    [invoiceId, replacePreviewUrl, request, settings],
  );

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await request(`${API_URL}/${invoiceId}/receipt`);
        const data = await readApiJson(response, "Unable to load refundable receipt details.");
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load refundable receipt details.");
        }
        if (!active) return;
        setContext(data);
        setSettings(data.settings);
        setSettingsDirty(false);
        if (data.receipt?.receipt_data?.refundPolicy) {
          setPolicyReviewed(false);
        }
        if (data.receipt) {
          const pdfResponse = await request(`${API_URL}/${invoiceId}/receipt/pdf`);
          if (!pdfResponse.ok) {
            const failure = await readApiJson(pdfResponse, "Unable to load receipt PDF.");
            throw new Error(failure.message || "Unable to load receipt PDF.");
          }
          if (active) {
            replacePreviewUrl(URL.createObjectURL(await pdfResponse.blob()));
          }
        }
      } catch (loadError) {
        if (active) setError(loadError.message || "Unable to load refundable receipt.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [invoiceId, replacePreviewUrl, request]);

  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    [],
  );

  const updateSetting = (event) => {
    const { name, value } = event.target;
    setSettings((current) => ({ ...current, [name]: value }));
    setSettingsDirty(true);
    setPolicyReviewed(false);
    setError("");
    setNotice("");
  };

  const updateImage = async (event, name, maxSize) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readImage(file, maxSize);
      setSettings((current) => ({ ...current, [name]: dataUrl }));
      setSettingsDirty(true);
      setPolicyReviewed(false);
      setError("");
    } catch (imageError) {
      setError(imageError.message);
    } finally {
      event.target.value = "";
    }
  };

  const handleSaveSettings = async () => {
    setBusy("settings");
    setError("");
    setNotice("");
    try {
      const response = await request(`${API_URL}/settings`, {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      const data = await readApiJson(response, "Unable to save receipt settings.");
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save receipt settings.");
      }
      setSettings(data.settings);
      setSettingsDirty(false);
      setPolicyReviewed(false);
      setNotice("Refundable receipt settings saved.");
    } catch (saveError) {
      setError(saveError.message || "Unable to save receipt settings.");
    } finally {
      setBusy("");
    }
  };

  const handlePreview = async () => {
    if (!context?.payment || String(agreement?.deposit_status).toLowerCase() !== "verified") {
      setError("A manually verified payment record is required before generating a receipt.");
      return;
    }
    if (settingsDirty) {
      setError("Save your company, refund policy, and authorization settings before previewing.");
      return;
    }
    setBusy("preview");
    setError("");
    setNotice("");
    setPolicyReviewed(false);
    try {
      const response = await request(`${API_URL}/${invoiceId}/receipt/preview`, {
        method: "POST",
        body: JSON.stringify({ refundPolicy: settings.refundPolicy }),
      });
      if (!response.ok) {
        const data = await readApiJson(response, "Unable to generate refundable receipt.");
        throw new Error(data.message || "Unable to generate refundable receipt.");
      }
      replacePreviewUrl(URL.createObjectURL(await response.blob()));
      const updatedContext = await refreshContext();
      if (updatedContext.receipt) {
        onReceiptUpdated({
          id: updatedContext.receipt.id,
          invoice_id: updatedContext.receipt.invoice_id,
          receipt_number: updatedContext.receipt.receipt_number,
          status: updatedContext.receipt.status,
          email_sent_to: updatedContext.receipt.email_sent_to,
          email_sent_at: updatedContext.receipt.email_sent_at,
        });
      }
      setNotice("Receipt PDF preview is ready. Review the policy and details before sending.");
    } catch (previewError) {
      setError(previewError.message || "Unable to generate refundable receipt.");
    } finally {
      setBusy("");
    }
  };

  const handleDownload = async () => {
    if (!receipt) {
      setError("Generate a receipt preview before downloading.");
      return;
    }
    setBusy("download");
    setError("");
    try {
      const response = await request(
        `${API_URL}/${invoiceId}/receipt/pdf?download=1`,
      );
      if (!response.ok) {
        const data = await readApiJson(response, "Unable to download refundable receipt.");
        throw new Error(data.message || "Unable to download refundable receipt.");
      }
      const blobUrl = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = `${receipt.receipt_number}.pdf`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (downloadError) {
      setError(downloadError.message || "Unable to download refundable receipt.");
    } finally {
      setBusy("");
    }
  };

  const handleSend = async () => {
    if (!canSend || !window.confirm(`Send receipt ${receipt.receipt_number} to ${receiptData.carrier.email}?`)) {
      return;
    }
    setBusy("send");
    setError("");
    setNotice("");
    try {
      const response = await request(`${API_URL}/${invoiceId}/receipt/send`, {
        method: "POST",
        body: JSON.stringify({ refundPolicyReviewed: true }),
      });
      const data = await readApiJson(response, "Unable to send refundable receipt.");
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to send refundable receipt.");
      }
      await refreshContext();
      onReceiptUpdated(data.receipt);
      setNotice("Refundable receipt emailed successfully.");
    } catch (sendError) {
      setError(sendError.message || "Refundable receipt email delivery failed.");
      try {
        await refreshContext();
      } catch {
        // Keep the delivery error visible; a later refresh can reload receipt state.
      }
    } finally {
      setBusy("");
    }
  };

  const handleResend = async () => {
    if (!isSent || !window.confirm(`Resend receipt ${receipt.receipt_number} to ${receipt.email_sent_to || receiptData.carrier.email}?`)) {
      return;
    }
    setBusy("resend");
    setError("");
    setNotice("");
    try {
      const response = await request(`${API_URL}/${invoiceId}/receipt/resend`, {
        method: "POST",
      });
      const data = await readApiJson(response, "Unable to resend refundable receipt.");
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to resend refundable receipt.");
      }
      await refreshContext();
      onReceiptUpdated(data.receipt);
      setNotice("Refundable receipt resent successfully.");
    } catch (resendError) {
      setError(resendError.message || "Refundable receipt resend failed.");
      try {
        await refreshContext();
      } catch {
        // Preserve the original delivery error.
      }
    } finally {
      setBusy("");
    }
  };

  const currentPolicy =
    receiptData?.refundPolicy || settings?.refundPolicy || "";
  const currentAuthorization = authorizationForReceipt;
  const currentCarrier = receiptData?.carrier || agreement || {};
  const currentPayment = receiptData?.payment || payment;
  const eventLabel = (eventType) =>
    String(eventType || "").replaceAll("_", " ");

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-sm sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="refundable-slip-title"
        className="flex max-h-[96vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
      >
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4 sm:px-7">
          <div>
            <h2 id="refundable-slip-title" className="text-xl font-bold">
              {isSent ? "Refundable Deposit Receipt" : "Refundable Slip Preview"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {context?.invoice?.invoice_number || "Loading invoice..."} ·{" "}
              {agreement?.tracking_id || "Loading agreement..."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("receipt")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                activeTab === "receipt"
                  ? "bg-emerald-500 text-slate-950"
                  : "border border-slate-700 text-slate-300"
              }`}
            >
              Receipt
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                activeTab === "settings"
                  ? "bg-emerald-500 text-slate-950"
                  : "border border-slate-700 text-slate-300"
              }`}
            >
              Receipt Settings
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {error && (
            <div role="alert" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}
          {notice && (
            <div role="status" className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              {notice}
            </div>
          )}
          {loading || !context || !settings ? (
            <p className="py-16 text-center text-slate-400">Loading payment verification and receipt information...</p>
          ) : activeTab === "settings" ? (
            <div className="mx-auto max-w-4xl space-y-5">
              <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
                <h3 className="font-semibold text-emerald-300">Company Information</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  These details are saved for future slips. Receipt records keep their own immutable snapshots.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    ["companyName", "Legal company name", true],
                    ["companyBrand", "Brand name", true],
                    ["companyWebsite", "Website", true],
                    ["companyEmail", "Contact email", true],
                    ["companyPhone", "Contact phone", false],
                    ["mcNumber", "MC / MX / FF number", false],
                    ["usdotNumber", "USDOT number", false],
                    ["physicalAddress", "Physical address", false],
                    ["mailingAddress", "Mailing address", false],
                  ].map(([name, label, required]) => (
                    <label key={name}>
                      <span className="mb-1.5 block text-xs font-medium text-slate-400">{label}</span>
                      <input
                        name={name}
                        value={settings[name] || ""}
                        onChange={updateSetting}
                        maxLength={name.includes("Address") ? 255 : 255}
                        required={required}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                      />
                    </label>
                  ))}
                  <label>
                    <span className="mb-1.5 block text-xs font-medium text-slate-400">Company logo (PNG/JPEG/WebP, max 2.15 MB)</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) => updateImage(event, "logoDataUrl", 2_250_000)}
                      className="block w-full text-xs text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-slate-200"
                    />
                    {settings.logoDataUrl && (
                      <img src={settings.logoDataUrl} alt="Current company logo" className="mt-3 max-h-16 max-w-40 rounded bg-white p-2" />
                    )}
                  </label>
                </div>
              </section>

              <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
                <h3 className="font-semibold text-emerald-300">Refund Policy</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Review this policy against the signed agreement. The current text is based on the refundable deposit terms and does not promise a processing timeframe.
                </p>
                <textarea
                  name="refundPolicy"
                  value={settings.refundPolicy || ""}
                  onChange={updateSetting}
                  rows={7}
                  maxLength={6000}
                  required
                  className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm leading-6 outline-none focus:border-emerald-500"
                />
              </section>

              <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
                <h3 className="font-semibold text-emerald-300">Receipt Authorization</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Enter only an authorized representative and upload a genuine, company-approved signature. Sending is blocked until all three fields are configured.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label>
                    <span className="mb-1.5 block text-xs font-medium text-slate-400">Authorized representative name</span>
                    <input
                      name="authorizedName"
                      value={settings.authorizedName || ""}
                      onChange={updateSetting}
                      maxLength={160}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-xs font-medium text-slate-400">Authorized job title</span>
                    <input
                      name="authorizedPosition"
                      value={settings.authorizedPosition || ""}
                      onChange={updateSetting}
                      maxLength={160}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="mb-1.5 block text-xs font-medium text-slate-400">Approved signature image (PNG/JPEG/WebP, max 293 KB)</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) => updateImage(event, "signatureDataUrl", 300_000)}
                      className="block w-full text-xs text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-slate-200"
                    />
                    {settings.signatureDataUrl ? (
                      <img src={settings.signatureDataUrl} alt="Configured approved signature" className="mt-3 max-h-20 max-w-64 rounded bg-white p-2" />
                    ) : (
                      <span className="mt-2 block text-xs text-amber-300">No approved signature has been configured.</span>
                    )}
                  </label>
                </div>
              </section>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={Boolean(busy) || !settingsDirty}
                  className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {busy === "settings" ? "Saving..." : "Save Receipt Settings"}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-[minmax(320px,0.75fr)_minmax(0,1.25fr)]">
              <div className="space-y-4">
                <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-emerald-300">Receipt Status</h3>
                      <p className="mt-1 text-sm capitalize text-slate-300">
                        {receipt?.status || "Not Generated"}
                      </p>
                    </div>
                    {receipt?.receipt_number && (
                      <span className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200">
                        {receipt.receipt_number}
                      </span>
                    )}
                  </div>
                  <dl className="mt-4 grid grid-cols-[125px_1fr] gap-x-3 gap-y-2 text-sm">
                    <dt className="text-slate-500">Carrier</dt>
                    <dd>{currentCarrier.carrier_name || currentCarrier.name || currentCarrier.print_name || "—"}</dd>
                    <dt className="text-slate-500">Company</dt>
                    <dd>{currentCarrier.company_name || currentCarrier.company || "—"}</dd>
                    <dt className="text-slate-500">Carrier email</dt>
                    <dd className="break-all">{receipt?.email_sent_to || currentCarrier.email || "—"}</dd>
                    <dt className="text-slate-500">Phone</dt>
                    <dd>{currentCarrier.phone || "—"}</dd>
                    <dt className="text-slate-500">MC / DOT</dt>
                    <dd>{currentCarrier.mc_dot || currentCarrier.mcDot || "—"}</dd>
                    <dt className="text-slate-500">Deposit status</dt>
                    <dd className={String(agreement.deposit_status).toLowerCase() === "verified" ? "text-emerald-300" : "text-amber-300"}>
                      {agreement.deposit_status || "Not verified"}
                    </dd>
                    <dt className="text-slate-500">Amount received</dt>
                    <dd>{currentPayment ? formatCurrency(currentPayment.amountReceived ?? currentPayment.amount_received) : "—"}</dd>
                    <dt className="text-slate-500">Payment method</dt>
                    <dd>{currentPayment?.method || currentPayment?.payment_method || "—"}</dd>
                    <dt className="text-slate-500">Payment date</dt>
                    <dd>{formatDate(currentPayment?.date || currentPayment?.payment_date)}</dd>
                    {(currentPayment?.reference || currentPayment?.payment_reference) && (
                      <>
                        <dt className="text-slate-500">Reference</dt>
                        <dd className="break-all">{currentPayment.reference || currentPayment.payment_reference}</dd>
                      </>
                    )}
                    <dt className="text-slate-500">Sent date</dt>
                    <dd>{receipt?.email_sent_at ? new Date(receipt.email_sent_at).toLocaleString() : "—"}</dd>
                    <dt className="text-slate-500">Authorized by</dt>
                    <dd>{currentAuthorization.name || "Not configured"}{currentAuthorization.position ? ` · ${currentAuthorization.position}` : ""}</dd>
                  </dl>
                </section>

                <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <h3 className="font-semibold text-emerald-300">Refund Policy Snapshot</h3>
                  <div className="mt-3 max-h-48 space-y-3 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-slate-300">
                    {currentPolicy || "No refund policy configured."}
                  </div>
                  {!isSent && (
                    <label className="mt-4 flex items-start gap-2 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={policyReviewed}
                        onChange={(event) => setPolicyReviewed(event.target.checked)}
                        className="mt-1 accent-emerald-500"
                      />
                      <span>I reviewed and approve the refund policy shown in this receipt.</span>
                    </label>
                  )}
                  {!hasAuthorization && (
                    <p className="mt-3 text-xs leading-5 text-amber-300">
                      Configure an authorized representative, job title, and approved signature in Receipt Settings before sending.
                    </p>
                  )}
                  {settingsDirty && (
                    <p className="mt-3 text-xs text-amber-300">
                      Save updated receipt settings before generating the preview.
                    </p>
                  )}
                </section>

                {context.events?.length > 0 && (
                  <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <h3 className="font-semibold text-emerald-300">Receipt History</h3>
                    <ul className="mt-3 space-y-2 text-xs text-slate-400">
                      {context.events.map((event, index) => (
                        <li key={`${event.event_type}-${event.created_at}-${index}`} className="flex justify-between gap-3">
                          <span className="capitalize">{eventLabel(event.event_type)}</span>
                          <span className="text-right">{new Date(event.created_at).toLocaleString()} · {event.admin_email}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {context.paymentHistory?.length > 0 && (
                  <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <h3 className="font-semibold text-emerald-300">Payment Verification History</h3>
                    <ul className="mt-3 space-y-3 text-xs text-slate-400">
                      {context.paymentHistory.map((record) => (
                        <li key={record.id} className="border-t border-slate-800 pt-2">
                          <div className="flex justify-between gap-3">
                            <span className={`capitalize ${record.status === "verified" ? "text-emerald-300" : "text-amber-300"}`}>
                              {record.status}
                            </span>
                            <span>{formatCurrency(record.amount_received)} · {record.payment_method}</span>
                          </div>
                          <p className="mt-1">
                            {formatDate(record.payment_date)} · verified by {record.verified_by} · {new Date(record.verified_at).toLocaleString()}
                          </p>
                          {record.status === "revoked" && (
                            <p className="mt-1 text-amber-300">
                              Revoked by {record.revoked_by || "admin"}
                              {record.revoked_at
                                ? ` · ${new Date(record.revoked_at).toLocaleString()}`
                                : ""}
                            </p>
                          )}
                          {record.payment_reference && (
                            <p className="mt-1 break-all">Reference: {record.payment_reference}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              <section className="flex min-h-[520px] flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
                  <div>
                    <h3 className="font-semibold">Refundable Receipt PDF</h3>
                    {receiptData && (
                      <p className="mt-1 text-sm font-bold text-emerald-300">
                        {formatCurrency(receiptData.payment?.amountReceived)} · {receiptData.payment?.method}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={Boolean(busy) || !receipt}
                    className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-50"
                  >
                    {busy === "download" ? "Preparing..." : "Download PDF"}
                  </button>
                </div>
                {previewUrl ? (
                  <iframe title="Refundable deposit receipt preview" src={previewUrl} className="min-h-[520px] flex-1 bg-white" />
                ) : (
                  <div className="flex min-h-[520px] flex-1 items-center justify-center p-8 text-center text-sm text-slate-500">
                    {context.payment
                      ? "Generate a PDF preview to review the refundable deposit receipt."
                      : "A receipt is available only after an administrator records and verifies the payment details."}
                  </div>
                )}
                <div className="flex flex-wrap justify-end gap-3 border-t border-slate-800 p-4">
                  {!isSent && (
                    <>
                      <button
                        type="button"
                        onClick={handlePreview}
                        disabled={Boolean(busy) || !context.payment || settingsDirty}
                        className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 disabled:opacity-50"
                      >
                        {busy === "preview" ? "Generating..." : "Preview PDF"}
                      </button>
                      <button
                        type="button"
                        onClick={handleSend}
                        disabled={Boolean(busy) || !canSend}
                        className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {busy === "send" ? "Sending..." : "Send Refundable Slip"}
                      </button>
                    </>
                  )}
                  {isSent && (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={Boolean(busy)}
                      className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-50"
                    >
                      {busy === "resend" ? "Resending..." : "Resend Refundable Slip"}
                    </button>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
