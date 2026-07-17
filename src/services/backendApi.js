import { clearKeycloakSession, getAccessToken } from "../auth/keycloakAuth";

const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api";

function authHeaders(extra = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...extra,
  };
  const token = getAccessToken();
  if (token && token.includes(".")) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: authHeaders(options.headers || {}),
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      (data && data.message) ||
      (typeof data === "string" ? data : null) ||
      `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

const PAYMENT_TO_API = {
  UPI: "UPI",
  Card: "CARD",
  CARD: "CARD",
  "Net Banking": "NET_BANKING",
  NET_BANKING: "NET_BANKING",
  Wallet: "UPI",
};

export function toApiPaymentMethod(method) {
  return PAYMENT_TO_API[method] || "UPI";
}

export function resolveCampaignImage(imageUrl, id) {
  if (imageUrl && /^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (imageUrl && imageUrl.startsWith("data:")) return imageUrl;
  return `https://picsum.photos/seed/fundraising-campaign-${id || "default"}/1000/600`;
}

export function mapCampaign(api) {
  if (!api) return null;

  const recipients = (api.recipients || []).map((r) => ({
    id: r.id,
    name: r.name,
    need: r.supportFor,
    location: r.location,
    target: Number(r.targetAmount || 0),
  }));

  return {
    id: api.id,
    title: api.title,
    category: api.cause || "General",
    description: api.shortDescription || api.description || "",
    detailedDescription: api.description || api.shortDescription || "",
    goal: Number(api.goalAmount || 0),
    raised: Number(api.raisedAmount || 0),
    fundedPercentage: api.fundedPercentage ?? 0,
    image: resolveCampaignImage(api.imageUrl, api.id),
    beneficiaries: api.beneficiaries || "—",
    duration: api.duration || "—",
    status: api.status,
    recipients,
    recipientType: "recipient",
    fundAllocation: [
      { label: "Direct aid", percentage: 70 },
      { label: "Operations", percentage: 20 },
      { label: "Outreach", percentage: 10 },
    ],
    impact: [
      "Transparent allocation of funds",
      "Direct support for listed recipients",
      "Progress updates as donations arrive",
    ],
  };
}

export function getStoredUserId() {
  const fromKey = localStorage.getItem("userId");
  if (fromKey) return Number(fromKey);

  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.userId) return Number(user.userId);
  } catch {
    /* ignore */
  }
  return null;
}

export function persistAuthSession(auth, { keepAccessToken = false } = {}) {
  const userId = auth.userId;
  const role = auth.role || "USER";
  if (!keepAccessToken) {
    localStorage.setItem("token", String(userId));
  }
  localStorage.setItem("userId", String(userId));
  localStorage.setItem("email", auth.email || "");
  localStorage.setItem("role", role);
  localStorage.setItem(
    "user",
    JSON.stringify({
      userId,
      name: auth.fullName,
      email: auth.email,
      role,
    })
  );
}

export function clearAuthSession() {
  clearKeycloakSession();
}

const backendApi = {
  register({ fullName, email, password, phone, role }) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        fullName,
        email,
        password,
        phone: phone || null,
        role: role || null,
      }),
    });
  },

  login({ email, password, role }) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        role: role || null,
      }),
    });
  },

  syncSession() {
    return request("/auth/sync", { method: "POST", body: "{}" });
  },

  getCampaigns() {
    return request("/campaigns").then((list) => (list || []).map(mapCampaign));
  },

  getCampaign(id) {
    return request(`/campaigns/${id}`).then(mapCampaign);
  },

  createCampaign(payload) {
    return request("/campaigns", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then(mapCampaign);
  },

  donate({
    userId,
    campaignId,
    recipientId,
    amount,
    paymentMethod,
    message,
    anonymous,
  }) {
    return request("/donations", {
      method: "POST",
      body: JSON.stringify({
        userId,
        campaignId: Number(campaignId),
        recipientId: recipientId ? Number(recipientId) : null,
        amount: Number(amount),
        paymentMethod: toApiPaymentMethod(paymentMethod),
        message: message || null,
        anonymous: Boolean(anonymous),
      }),
    });
  },

  getUserDonations(userId) {
    return request(`/donations/user/${userId}`);
  },

  getProfile(userId) {
    return request(`/users/${userId}/profile`);
  },

  updateProfile(userId, payload) {
    return request(`/users/${userId}/profile`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};

export default backendApi;
