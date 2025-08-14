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

export function useSalesAccounts(reloadFlag?: boolean) {
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

    setLoading(true);
    fetch(`/api/sales-accounts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(json => {
        setData(json);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load accounts.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [reloadFlag]);

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
        const res = await fetch("/api/sales-accounts", {
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
    
    const socket = new WebSocket(`ws://${window.location.host}/ws/sales-accounts?token=${token}`);
    ws.current = socket;

    socket.onopen = () => {
      if (!isMounted) {
        socket.close();
        return;
      }
      //console.log("WebSocket connected");
      setConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (Array.isArray(message)) {
          setData(message);
        } else if (message.type === "sales_update" && Array.isArray(message.data)) {
          setData(message.data);
        } else {
          console.warn("Unexpected WebSocket message format:", message);
        }
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    ws.current.onclose = () => {
      setConnected(false);
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

    setData((prev) =>
      prev.map((account) =>
        account.comp_id === comp_id ? { ...account, ...payload } : account
      )
    );
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
      throw new Error("This company already exists in the database.");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to add company details.");
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

  return { data, loading, error, connected, updateSalesAccount, addCompany, removeCompany };
}