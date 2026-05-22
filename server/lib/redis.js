let client = null;
let memoryStore = new Map();
let mode = "memory";

const memoryGet = (key) => memoryStore.get(key) ?? null;
const memorySet = (key, value, ttlSec = 300) => {
  memoryStore.set(key, value);
  if (ttlSec > 0) {
    setTimeout(() => memoryStore.delete(key), ttlSec * 1000).unref?.();
  }
};

async function initRedis() {
  let redis;
  try {
    const Redis = require("ioredis");
    redis = new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT || 6379),
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      lazyConnect: true,
      retryStrategy: () => null,
      enableOfflineQueue: false,
    });
    redis.on("error", () => {});
    await redis.connect();
    await redis.ping();
    client = redis;
    mode = "redis";
    console.log("[redis] Connected");
    return true;
  } catch (error) {
    if (redis) {
      try {
        redis.disconnect();
      } catch {
        /* ignore */
      }
    }
    client = null;
    mode = "memory";
    console.warn("[redis] Using in-memory fallback:", error.message);
    return false;
  }
}

async function cacheGet(key) {
  if (mode === "redis" && client) {
    const raw = await client.get(key);
    return raw ? JSON.parse(raw) : null;
  }
  return memoryGet(key);
}

async function cacheSet(key, value, ttlSec = 300) {
  const payload = JSON.stringify(value);
  if (mode === "redis" && client) {
    await client.set(key, payload, "EX", ttlSec);
    return;
  }
  memorySet(key, value, ttlSec);
}

function getRedisMode() {
  return mode;
}

module.exports = { initRedis, cacheGet, cacheSet, getRedisMode };
