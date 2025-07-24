import { useEffect, useRef, useState } from "react";

interface SalesAccount {
  comp_id: number;
  acc_manager: string;
  comp_name: string;
  comp_person: string;
  comp_email: string;
  comp_number: string;
  comp_address: string;
  remarks: string;
  created_at: string;
}

export function useSalesAccountsWS(token: string | null) {
  const ws = useRef<WebSocket | null>(null);
  const [data, setData] = useState<SalesAccount[] | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;
  
    const wsUrl = `ws://localhost:5000/ws/sales-accounts?token=${encodeURIComponent(token)}`;
    const socket = new WebSocket(wsUrl);
    ws.current = socket;
  
    socket.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };
  
    socket.onmessage = (event) => {
      try {
        const updatedData: SalesAccount[] = JSON.parse(event.data);
        setData(updatedData);
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };
  
    socket.onerror = (event) => {
      console.error("WebSocket error", event);
      // Optional: Set error state
      // setError(event);
    };
  
    socket.onclose = (event) => {
      console.log(`WebSocket closed: code=${event.code}, reason=${event.reason}`);
      setConnected(false);
    };
  
    // Clean up on component unmount or token change
    return () => {
      socket.close(1000, "Component unmounted or token changed");
    };
  }, [token]);
  
  return { data, connected };
}
