const configuredBackendUrl =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "";
const backendUrl = (
  configuredBackendUrl ||
  (import.meta.env.DEV ? "http://localhost:4000" : "")
).replace(/\/+$/, "");

export const API_BASE_URL = `${backendUrl}/api`;
