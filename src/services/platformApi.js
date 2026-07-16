import { getAccessToken } from "../auth/keycloakAuth";

/** Admin APIs now live on Spring Boot under /api/admin */
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
const WS_BASE = process.env.REACT_APP_PLATFORM_WS || "";

function authHeaders(extra = {}) {
  const headers = { ...extra };
  const token = getAccessToken();
  if (token && token.includes(".")) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: authHeaders({
      "Content-Type": "application/json",
      ...(options.headers || {}),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    let message = `Request failed (${response.status})`;
    try {
      const data = JSON.parse(text);
      message = data.message || message;
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }

  return response.json();
}

export const platformApi = {
  base: API_BASE,
  ws: WS_BASE,

  async health() {
    return request("/admin/health");
  },

  async getReports(period) {
    return request(`/admin/reports/${period}`);
  },

  async getPayments() {
    return request("/admin/payments");
  },

  async getUserProfiles() {
    return request("/admin/users/profiles");
  },

  async getSecurityEvents() {
    return request("/admin/security/events");
  },

  async logSecurityEvent(event) {
    return request("/admin/security/events", {
      method: "POST",
      body: JSON.stringify(event || {}),
    });
  },

  async simulateDonation() {
    return request("/admin/donations/simulate", { method: "POST", body: "{}" });
  },
};

export default platformApi;
