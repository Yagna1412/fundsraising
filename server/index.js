const http = require("http");
const express = require("express");
const cors = require("cors");
const { WebSocketServer } = require("ws");
const { initRedis, cacheGet, cacheSet, getRedisMode } = require("./lib/redis");
const { initQueue, publishEvent, subscribeMemory, getQueueMode } = require("./lib/queue");
const {
  paymentsSeed,
  userProfilesSeed,
  securityEventsSeed,
  reportSeries,
  liveDonationTemplates,
} = require("./data/seed");
const { normalizePaymentMethod, getGatewayForMethod } = require("./lib/paymentMethods");

const PORT = Number(process.env.PLATFORM_PORT || 4000);
const app = express();
app.use(cors());
app.use(express.json());

let payments = [...paymentsSeed];
let securityEvents = [...securityEventsSeed];
const wsClients = new Set();

function broadcast(payload) {
  const message = JSON.stringify(payload);
  wsClients.forEach((client) => {
    if (client.readyState === 1) client.send(message);
  });
}

function formatLiveDonation(template) {
  const now = new Date();
  return {
    id: `TXN-LIVE-${now.getTime()}`,
    donor: template.donor,
    email: `${template.donor.toLowerCase().replace(/\s/g, "")}@email.com`,
    campaign: template.campaign,
    campaignId: "CMP-LIVE",
    amount: `Rs ${template.amount.toLocaleString("en-IN")}`,
    method: normalizePaymentMethod(template.method),
    date: now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    status: "Success",
    reference: `REF/${now.getTime()}`,
  };
}

async function handlePlatformEvent(event) {
  if (event.type === "donation") {
    const method = normalizePaymentMethod(event.payload.method);
    const payment = {
      id: `PAY-${Date.now()}`,
      donor: event.payload.donor,
      campaign: event.payload.campaign,
      amount: event.payload.amount,
      method,
      status: "Settled",
      date: new Date().toISOString().slice(0, 10),
      gateway: getGatewayForMethod(method),
    };
    payments = [payment, ...payments].slice(0, 50);
    await cacheSet("payments:latest", payments, 120);
    broadcast({ type: "donation", payload: event.payload });
    broadcast({ type: "payments_updated", payload: payments.slice(0, 10) });
  }
}

app.get("/api/health", async (_req, res) => {
  res.json({
    ok: true,
    redis: getRedisMode(),
    rabbitmq: getQueueMode(),
    websocket: true,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/reports/:period", async (req, res) => {
  const period = req.params.period;
  if (!["daily", "weekly", "monthly"].includes(period)) {
    return res.status(400).json({ error: "Invalid period. Use daily, weekly, or monthly." });
  }
  const cacheKey = `reports:${period}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json({ period, ...cached, source: getRedisMode() });

  const series = reportSeries[period];
  const totalRaised = series.raised.reduce((a, b) => a + b, 0);
  const totalDonations = series.donations.reduce((a, b) => a + b, 0);
  const payload = {
    labels: series.labels,
    raised: series.raised,
    donations: series.donations,
    summary: {
      totalRaised,
      totalDonations,
      avgDonation: Math.round(totalRaised / Math.max(totalDonations, 1)),
      growth: period === "daily" ? 8 : period === "weekly" ? 12 : 18,
    },
  };
  await cacheSet(cacheKey, payload, 60);
  res.json({ period, ...payload, source: getRedisMode() });
});

app.get("/api/payments", async (_req, res) => {
  const cached = await cacheGet("payments:latest");
  res.json({ payments: cached || payments, source: getRedisMode() });
});

app.get("/api/users/profiles", async (_req, res) => {
  const cached = await cacheGet("users:profiles");
  if (cached) return res.json({ profiles: cached, source: getRedisMode() });
  await cacheSet("users:profiles", userProfilesSeed, 120);
  res.json({ profiles: userProfilesSeed, source: getRedisMode() });
});

app.get("/api/security/events", async (_req, res) => {
  res.json({ events: securityEvents, source: getRedisMode() });
});

app.post("/api/security/events", (req, res) => {
  const event = {
    id: `SEC-${Date.now()}`,
    type: req.body.type || "Login",
    user: req.body.user || "unknown",
    ip: req.body.ip || "127.0.0.1",
    device: req.body.device || "Browser",
    status: req.body.status || "Success",
    time: new Date().toLocaleString("en-IN"),
  };
  securityEvents = [event, ...securityEvents].slice(0, 30);
  publishEvent({ type: "security", payload: event });
  broadcast({ type: "security", payload: event });
  res.json({ ok: true, event });
});

app.post("/api/donations/simulate", async (_req, res) => {
  const template =
    liveDonationTemplates[Math.floor(Math.random() * liveDonationTemplates.length)];
  const donation = formatLiveDonation(template);
  await publishEvent({ type: "donation", payload: donation });
  await handlePlatformEvent({ type: "donation", payload: donation });
  res.json({ ok: true, donation });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (socket) => {
  wsClients.add(socket);
  socket.send(
    JSON.stringify({
      type: "connected",
      payload: { redis: getRedisMode(), rabbitmq: getQueueMode() },
    })
  );
  socket.on("close", () => wsClients.delete(socket));
});

async function start() {
  await initRedis();
  subscribeMemory(handlePlatformEvent);
  await initQueue(handlePlatformEvent);

  setInterval(async () => {
    const template =
      liveDonationTemplates[Math.floor(Math.random() * liveDonationTemplates.length)];
    const donation = formatLiveDonation(template);
    await publishEvent({ type: "donation", payload: donation });
    await handlePlatformEvent({ type: "donation", payload: donation });
  }, 12000);

  server.listen(PORT, () => {
    console.log(`[platform] API + WebSocket on http://localhost:${PORT}`);
    console.log(`[platform] WS path ws://localhost:${PORT}/ws`);
  });
}

start();
