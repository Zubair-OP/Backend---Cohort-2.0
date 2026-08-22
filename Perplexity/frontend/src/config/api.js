// Empty string = same-origin requests ("/api/..."), which is correct when the
// backend serves the built frontend (production). For local dev, Vite loads
// VITE_API_URL from .env.development.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const API_PREFIX = `${API_BASE_URL}/api`;
