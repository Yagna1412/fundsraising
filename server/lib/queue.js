const QUEUE_NAME = "donation.events";
let channel = null;
let mode = "memory";
const memoryListeners = [];

async function initQueue(onMessage) {
  const url =
    process.env.RABBITMQ_URL ||
    "amqp://fundraiser:fundraiser@127.0.0.1:5672";

  try {
    const amqp = require("amqplib");
    const connection = await amqp.connect(url);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.consume(QUEUE_NAME, (msg) => {
      if (!msg) return;
      try {
        const payload = JSON.parse(msg.content.toString());
        onMessage(payload);
      } catch {
        /* ignore */
      }
      channel.ack(msg);
    });
    mode = "rabbitmq";
    console.log("[rabbitmq] Connected");
    return true;
  } catch (error) {
    channel = null;
    mode = "memory";
    console.warn("[rabbitmq] Using in-memory fallback:", error.message);
    return false;
  }
}

async function publishEvent(event) {
  const body = Buffer.from(JSON.stringify(event));
  if (mode === "rabbitmq" && channel) {
    channel.sendToQueue(QUEUE_NAME, body, { persistent: true });
    return;
  }
  memoryListeners.forEach((fn) => fn(event));
}

function subscribeMemory(listener) {
  memoryListeners.push(listener);
}

function getQueueMode() {
  return mode;
}

module.exports = { initQueue, publishEvent, subscribeMemory, getQueueMode, QUEUE_NAME };
