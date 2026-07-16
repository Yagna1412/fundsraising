import { useCallback, useEffect, useRef, useState } from "react";
import platformApi from "../services/platformApi";

export function useAdminRealtime({ onDonation, onSecurity, onPaymentsUpdate, enabled = true }) {
  const [connected, setConnected] = useState(false);
  const [infra, setInfra] = useState({ redis: "jpa", rabbitmq: "jpa", api: false });
  const wsRef = useRef(null);
  const retryRef = useRef(null);

  const refreshHealth = useCallback(async () => {
    try {
      const health = await platformApi.health();
      setInfra({
        redis: health.redis || "jpa",
        rabbitmq: health.rabbitmq || "jpa",
        api: Boolean(health.ok),
      });
      // Without a dedicated WS server, treat a healthy admin API as "connected"
      if (!platformApi.ws) {
        setConnected(Boolean(health.ok));
      }
      return health;
    } catch {
      setInfra({ redis: "offline", rabbitmq: "offline", api: false });
      if (!platformApi.ws) setConnected(false);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    refreshHealth();
    const healthTimer = setInterval(refreshHealth, 15000);

    if (!platformApi.ws) {
      return () => clearInterval(healthTimer);
    }

    const connect = () => {
      try {
        const ws = new WebSocket(platformApi.ws);
        wsRef.current = ws;

        ws.onopen = () => setConnected(true);
        ws.onclose = () => {
          setConnected(false);
          retryRef.current = setTimeout(connect, 4000);
        };
        ws.onerror = () => setConnected(false);
        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.type === "connected") {
              setInfra((prev) => ({
                ...prev,
                redis: message.payload?.redis || prev.redis,
                rabbitmq: message.payload?.rabbitmq || prev.rabbitmq,
              }));
            }
            if (message.type === "donation" && onDonation) onDonation(message.payload);
            if (message.type === "security" && onSecurity) onSecurity(message.payload);
            if (message.type === "payments_updated" && onPaymentsUpdate) {
              onPaymentsUpdate(message.payload);
            }
          } catch {
            /* ignore malformed */
          }
        };
      } catch {
        setConnected(false);
        retryRef.current = setTimeout(connect, 4000);
      }
    };

    connect();

    return () => {
      clearInterval(healthTimer);
      if (retryRef.current) clearTimeout(retryRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [enabled, onDonation, onSecurity, onPaymentsUpdate, refreshHealth]);

  return { connected, infra, refreshHealth };
}

export default useAdminRealtime;
