import { useState, useEffect, useRef } from "react";

export interface Item {
  item_id: string | null;
  item_name: string;
  quantity: number;
  distributor: string;
  client_name: string;
  entry_date: Date;
  checked_by: string[];
  received_by: string[];
  delivered: boolean | null;
  delivery_date: Date | null;
  delivered_by: string[] | null;
  item_status: string;
  notes: string | null;
  created_at: Date;
  created_by: string | null; //to be not nulled
  serialnumbers: SerialNumber[];
}

interface SerialNumber {
  id: string;
  inventory_id: string | null;
  remarks: string;
  notes: string | null;
}

export interface Supplier {
  aid: number;
  name: string;
}

export function useInventory() {
  const [inventoryItems, setInventoryItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  const fetchAllItems = async (isMounted: boolean, token: string) => {
    try {
      const response = await fetch(`/api/inventory/all`, {
          headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const parsed = data.map((item: any) => ({
        ...item,
        entry_date: new Date(item.entry_date),
        delivery_date: item.delivery_date ? new Date(item.delivery_date) : null,
        created_at: new Date(item.created_at),
      }));

      if (isMounted) {
        setInventoryItems(parsed); // Update the single state variable
        setLoading(false);
        setError(null);
      }

    } catch (err) {
      console.error("Failed to fetch inventory:", err);
      if (isMounted) {
        setError("Failed to load inventory.");
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    let isMounted = true;
    fetchAllItems(isMounted, token);

    const socket = new WebSocket(`ws://${window.location.host}/ws/inventory?token=${token}`);
    ws.current = socket;

    socket.onopen = () => {
      if (!isMounted) {
        socket.close();
        return;
      }
        //console.log("Inventory WebSocket connected");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'inventory_update' && Array.isArray(message.data)) {
          const parsed = message.data.map((item: any) => ({
          ...item,
          entry_date: new Date(item.entry_date),
          delivery_date: item.delivery_date ? new Date(item.delivery_date) : null,
          created_at: new Date(item.created_at),
        }));
          setInventoryItems(parsed); // Update the single source of truth
        } else {
          console.warn("Unhandled WebSocket message:", message);
        }
      } catch (err) {
        console.error("Failed to parse WS message:", err);
      }
    };

    socket.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    socket.onclose = () => {
      setConnected(false);
    };

    return () => {
      isMounted = false;
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, []); 

  return { inventoryItems, loading, error, connected };
}

export function useAddInventory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const addInventory = async (item: Item) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`/api/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...item,
          entry_date: item.entry_date.toISOString(),
          delivery_date: item.delivery_date ? item.delivery_date.toISOString() : null,
          serial_numbers: item.serialnumbers,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add inventory item");
      }
    } catch (err: any) {
      console.error("Add inventory error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { addInventory, loading, error, success };
}

export function useItemDetails(itemId: string | null) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItem = async () => {
    if (!itemId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/inventory/${itemId}`);
      if (!res.ok) throw new Error("Failed to fetch item");

      const data = await res.json();

      setItem({
        item_id: data.item_id,
        item_name: data.item_name,
        quantity: data.quantity,
        distributor: data.distributor,
        client_name: data.client_name,
        entry_date: new Date(data.entry_date),
        checked_by: data.checked_by,
        received_by: data.received_by,
        delivered: data.delivered,
        delivery_date: data.delivery_date ? new Date(data.delivery_date) : null,
        delivered_by: data.delivered_by,
        item_status: data.item_status,
        notes: data.notes,
        created_at: new Date(data.created_at),
        created_by: data.created_by,
        serialnumbers: data.serialnumbers ?? [],
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load item");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [itemId]);

  return { item, loading, error, refetch: fetchItem };
}

export function useUpdateInventory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateInventory = async (itemId: string, updates: Partial<Item>) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const cleanedUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
      );

      const response = await fetch(`/api/inventory/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedUpdates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update inventory item");
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Update inventory error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateInventory, loading, error, success };
}

export function useDeleteInventory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteInventory = async (itemId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`/api/inventory/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete inventory item");
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Delete inventory error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { deleteInventory, loading, error, success };
}

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    const fetchSuppliers = async () => {
      try {
        const response = await fetch("/api/suppliers", {
          headers: {
            method: "GET",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch suppliers");
        }

        const data = await response.json();
        setSuppliers(data);
      } catch (err: any) {
        console.error("Error fetching suppliers:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  return { suppliers, loading, error };
}
