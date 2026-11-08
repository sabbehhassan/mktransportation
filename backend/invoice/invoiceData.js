const SERVICE_CATALOG = new Map([
  [
    "Dedicated Lane Setup - $425 (Refundable after first delivery)",
    { description: "Dedicated Lane Setup", rate: 425, onboarding: true },
  ],
  [
    "TWIC Card Application - $360 (Same-day processing)",
    { description: "TWIC Card Application", rate: 360 },
  ],
  [
    "Trailer Rental (3 months) - $500",
    { description: "Trailer Rental (3 months)", rate: 500 },
  ],
  [
    "Factoring Setup - $250 (Same-day registration)",
    { description: "Factoring Setup", rate: 250 },
  ],
  [
    "Insurance Assistance - $399",
    { description: "Insurance Assistance", rate: 399 },
  ],
]);

const PAYMENT_METHODS = new Set([
  "Zelle",
  "Venmo",
  "Chime",
  "Cash App",
  "Bitcoin (BTC)",
  "Bank Transfer",
  "Wire Transfer",
  "Other",
]);

const roundCurrency = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const cleanText = (
  value,
  label,
  maxLength,
  { required = false, multiline = false } = {},
) => {
  if (typeof value !== "string") {
    if (required) throw new Error(`${label} is required.`);
    return "";
  }
  const cleaned = value
    .replace(multiline ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, "")
    .trim();
  if (required && !cleaned) throw new Error(`${label} is required.`);
  if (cleaned.length > maxLength) {
    throw new Error(`${label} cannot exceed ${maxLength} characters.`);
  }
  return cleaned;
};

const normalizePaymentDetails = (input) => {
  const selectedMethod = cleanText(input.paymentMethod, "Payment method", 50, {
    required: true,
  });
  if (!PAYMENT_METHODS.has(selectedMethod)) {
    throw new Error("Select a supported payment method.");
  }

  const customMethod =
    selectedMethod === "Other"
      ? cleanText(input.customPaymentMethod, "Custom payment method", 80, {
          required: true,
        })
      : "";
  const accountHolder = cleanText(
    input.accountHolder,
    "Account holder / business name",
    160,
    { required: true },
  );
  const accountId = cleanText(input.accountId, "Payment email / account ID", 200, {
    required: true,
  });
  const bankName = cleanText(input.bankName, "Bank name", 120);
  const routingNumber = cleanText(input.routingNumber, "Routing number", 80);
  const accountNumber = cleanText(input.accountNumber, "Account number", 100);
  const instructions = cleanText(
    input.paymentInstructions,
    "Additional payment instructions",
    1000,
    { multiline: true },
  );

  return {
    method: selectedMethod === "Other" ? customMethod : selectedMethod,
    methodType: selectedMethod,
    accountHolder,
    accountId,
    bankName,
    routingNumber,
    accountNumber,
    instructions,
  };
};

const parseSelectedServices = (rawServices, carrierType) => {
  let services;
  try {
    services = Array.isArray(rawServices)
      ? rawServices
      : JSON.parse(rawServices || "[]");
  } catch {
    throw new Error("The agreement contains invalid service data.");
  }

  if (!Array.isArray(services)) {
    throw new Error("The agreement contains invalid service data.");
  }

  const seenServices = new Set();
  return services.map((value) => {
    const item = SERVICE_CATALOG.get(value);
    if (!item || seenServices.has(value)) {
      throw new Error("The agreement contains an unsupported or duplicated service.");
    }
    seenServices.add(value);

    return {
      description: item.description,
      quantity: 1,
      rate:
        item.onboarding && String(carrierType || "").toLowerCase() === "old"
          ? 0
          : item.rate,
    };
  });
};

const parseAmount = (value, label) => {
  if (value === "" || value === null || value === undefined) return 0;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0 || amount > 1000000) {
    throw new Error(`${label} must be a valid amount between 0 and 1,000,000.`);
  }
  return roundCurrency(amount);
};

const isValidDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const buildInvoiceData = (agreement, input, invoiceNumber) => {
  if (!isValidDate(input.invoiceDate) || !isValidDate(input.dueDate)) {
    throw new Error("Enter valid invoice and due dates.");
  }
  if (input.dueDate < input.invoiceDate) {
    throw new Error("The due date cannot be earlier than the invoice date.");
  }

  const services = parseSelectedServices(
    agreement.selected_services,
    agreement.carrier_type,
  );
  const subtotal = roundCurrency(
    services.reduce((total, item) => total + item.quantity * item.rate, 0),
  );
  const additionalCharges = parseAmount(input.additionalCharges, "Additional charges");
  const discount = parseAmount(input.discount, "Discount");
  const taxRate = parseAmount(input.taxRate, "Tax rate");
  if (taxRate > 100) throw new Error("Tax rate cannot exceed 100%.");
  if (discount > subtotal + additionalCharges) {
    throw new Error("Discount cannot exceed the subtotal and additional charges.");
  }

  const taxAmount = roundCurrency(
    ((subtotal + additionalCharges - discount) * taxRate) / 100,
  );
  const total = roundCurrency(subtotal + additionalCharges - discount + taxAmount);
  const notes = cleanText(input.notes, "Invoice notes", 2000, {
    multiline: true,
  });
  const payment = normalizePaymentDetails(input);

  return {
    invoiceNumber,
    invoiceDate: input.invoiceDate,
    dueDate: input.dueDate,
    carrier: {
      name: agreement.carrier_name || agreement.print_name || "",
      company: agreement.company_name || "",
      email: agreement.email || "",
      phone: agreement.phone || "",
      mcDot: agreement.mc_dot || "",
      agreementType: agreement.agreement_type || "",
      carrierType: agreement.carrier_type || "",
      trackingId: agreement.tracking_id,
      selectedDispatch: agreement.selected_dispatch || "",
    },
    services,
    additionalCharges,
    discount,
    taxRate,
    taxAmount,
    subtotal,
    total,
    payment,
    paymentMethod: payment.method,
    notes,
  };
};

module.exports = {
  buildInvoiceData,
  isValidDate,
};
