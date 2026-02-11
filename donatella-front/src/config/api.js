/**
 * API base URL - uses relative path in dev (Vite proxies /api to backend)
 * so phone at 192.168.x.x:5173 fetches same-origin, no CORS/firewall issues
 */
const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Dev: relative URL -> Vite proxies to localhost:5000
  if (import.meta.env.DEV) {
    return "/api/items";
  }
  // Production fallback
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/items`;
  }
  return "/api/items";
};

export const API_BASE = getApiBase();
