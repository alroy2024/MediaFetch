// Centrally managed backend API URL configuration
const configuredApiUrl =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ??
  "http://localhost:8080";

export const API_BASE_URL = configuredApiUrl.replace(/\/+$/, "");
