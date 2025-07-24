import { useEffect, useRef, useState } from "react";

export interface SalesAccount {
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

export function useSalesAccounts() {
  const [data, setData] = useState<SalesAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/sales-accounts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load accounts.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const socket = new WebSocket(`ws://localhost:5000/ws/sales-accounts?token=${token}`);
    ws.current = socket;

    socket.onopen = () => {
      if (!isMounted) {
        socket.close();
        return;
      }
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      try {
        const updatedData: SalesAccount[] = JSON.parse(event.data);
        setData(updatedData);
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    // ws.current.onerror = (event) => {
    //   console.error("WebSocket error", event);
    // };

     ws.current.onclose = () => {
      //console.log(`WebSocket closed: ${event.code}, ${event.reason}`);
      setConnected(false);
     };

    return () => {
      isMounted = false;
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  return { data, loading, error, connected };
}