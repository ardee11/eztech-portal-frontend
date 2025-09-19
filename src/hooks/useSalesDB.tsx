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
      setLoading(true);
      try {
        const res = await fetch("/api/sales-accounts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        if (isMounted) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Failed to load accounts.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Setup WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws/sales-accounts?token=${token}`);
    ws.current = socket;

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (isMounted && message.type === "sales_update" && Array.isArray(message.data)) {
          setData(message.data);
        }
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    socket.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      isMounted = false;
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  async function updateSalesAccount(comp_id: number, payload: Partial<SalesAccount>) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authorization token missing.");

    const res = await fetch(`/api/sales-accounts/${comp_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Failed to update company");
    }
  }

  async function addCompany(company: Partial<SalesAccount>) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authorization token missing.");

    const response = await fetch(`/api/sales-accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(company),
    });

    if (response.status === 409) {
      const error = new Error("This company already exists in the database.");
      (error as any).status = 409;
      throw error;
    }

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.error || "Failed to add company details.");
      (error as any).status = response.status;
      throw error;
    }
  }

  async function removeCompany(companyId: string) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authorization token missing.");

    const response = await fetch(`/api/sales-accounts/${companyId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to remove company details.");
    }
  }

  return { data, loading, error, updateSalesAccount, addCompany, removeCompany };
}