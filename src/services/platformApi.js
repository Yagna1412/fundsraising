const API_BASE = process.env.REACT_APP_PLATFORM_API || "http://localhost:4000";
const WS_BASE = process.env.REACT_APP_PLATFORM_WS || "ws://localhost:4000/ws";

export const platformApi = {
  base: API_BASE,
  ws: WS_BASE,

  async health() {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) throw new Error("Platform API unavailable");
    return res.json();
  },

  async getReports(period) {
    const res = await fetch(`${API_BASE}/api/reports/${period}`);
    if (!res.ok) throw new Error("Failed to load reports");
    return res.json();
  },

  async getPayments() {
    const res = await fetch(`${API_BASE}/api/payments`);
    if (!res.ok) throw new Error("Failed to load payments");
    return res.json();
  },

  async getUserProfiles() {
    const res = await fetch(`${API_BASE}/api/users/profiles`);
    if (!res.ok) throw new Error("Failed to load profiles");
    return res.json();
  },

  async getSecurityEvents() {
    const res = await fetch(`${API_BASE}/api/security/events`);
    if (!res.ok) throw new Error("Failed to load security events");
    return res.json();
  },

  async logSecurityEvent(event) {
    const res = await fetch(`${API_BASE}/api/security/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    if (!res.ok) throw new Error("Failed to log event");
    return res.json();
  },

  async simulateDonation() {
    const res = await fetch(`${API_BASE}/api/donations/simulate`, { method: "POST" });
    if (!res.ok) throw new Error("Simulation failed");
    return res.json();
  },
};

export default platformApi;
