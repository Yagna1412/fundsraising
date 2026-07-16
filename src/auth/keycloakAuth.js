const KEYCLOAK_URL =
  process.env.REACT_APP_KEYCLOAK_URL || "http://localhost:8081";
const REALM = process.env.REACT_APP_KEYCLOAK_REALM || "myfundraiser";
const CLIENT_ID =
  process.env.REACT_APP_KEYCLOAK_CLIENT_ID || "myfundraiser-frontend";

const TOKEN_URL = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized));
  } catch {
    return {};
  }
}

function extractRole(payload) {
  const realmRoles = payload?.realm_access?.roles || [];
  if (realmRoles.some((role) => String(role).toUpperCase() === "ADMIN")) {
    return "ADMIN";
  }
  const resourceRoles =
    payload?.resource_access?.[CLIENT_ID]?.roles || [];
  if (resourceRoles.some((role) => String(role).toUpperCase() === "ADMIN")) {
    return "ADMIN";
  }
  return "USER";
}

export function getAccessToken() {
  return localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
}

export function clearKeycloakSession() {
  [
    "accessToken",
    "refreshToken",
    "token",
    "userId",
    "email",
    "role",
    "user",
    "username",
    "loggedInUser",
  ].forEach((key) => localStorage.removeItem(key));
}

/**
 * Resource-owner password grant against Keycloak (demo-friendly with existing login form).
 */
export async function keycloakPasswordLogin({ email, password }) {
  const body = new URLSearchParams({
    grant_type: "password",
    client_id: CLIENT_ID,
    username: email,
    password,
    scope: "openid profile email",
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      data.error_description ||
      data.error ||
      "Keycloak login failed. Is Keycloak running on port 8081?";
    throw new Error(message);
  }

  const payload = decodeJwtPayload(data.access_token);
  const role = extractRole(payload);

  localStorage.setItem("accessToken", data.access_token);
  if (data.refresh_token) {
    localStorage.setItem("refreshToken", data.refresh_token);
  }
  // Keep `token` for existing ProtectedRoute checks
  localStorage.setItem("token", data.access_token);

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    payload,
    role,
    email: payload.email || email,
    fullName:
      payload.name ||
      [payload.given_name, payload.family_name].filter(Boolean).join(" ") ||
      email,
  };
}

export async function refreshKeycloakToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    clearKeycloakSession();
    throw new Error(data.error_description || "Session expired");
  }

  localStorage.setItem("accessToken", data.access_token);
  localStorage.setItem("token", data.access_token);
  if (data.refresh_token) {
    localStorage.setItem("refreshToken", data.refresh_token);
  }
  return data.access_token;
}

export const keycloakConfig = {
  url: KEYCLOAK_URL,
  realm: REALM,
  clientId: CLIENT_ID,
};

export default {
  keycloakPasswordLogin,
  refreshKeycloakToken,
  getAccessToken,
  clearKeycloakSession,
  keycloakConfig,
};
