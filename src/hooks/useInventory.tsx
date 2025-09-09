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
  created_by: string | null;
  order_no: string | null;
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

export interface YearlyStatusCounts {
  total: number;
  delivered: number;
  forDelivery: number;
  pending: number;
}

// Main hook for fetching a filtered/searchable list of inventory items
export function useInventory(
  searchQuery: string,
  statusFilter: "All" | "Delivered" | "Pending",
  selectedMonthYear: { month: number | null; year: number } | null
) {
  const [inventoryItems, setInventoryItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  const stateRef = useRef({ searchQuery, statusFilter, selectedMonthYear });
  stateRef.current = { searchQuery, statusFilter, selectedMonthYear };

  // New state for the yearly status counts (for the top cards)
  const [yearlyStatusCounts, setYearlyStatusCounts] = useState<YearlyStatusCounts>({
    total: 0,
    delivered: 0,
    forDelivery: 0,
    pending: 0,
  });

  const fetchFilteredItems = async (isMounted: boolean, token: string, params: URLSearchParams) => {
    try {
      const response = await fetch(`/api/inventory/all?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch filtered inventory data.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("API did not return an array:", data);
        throw new TypeError("Unexpected data format from server for filtered items.");
      }

      const parsed = data.map((item: any) => ({
        ...item,
        entry_date: new Date(item.entry_date),
        delivery_date: item.delivery_date ? new Date(item.delivery_date) : null,
        created_at: new Date(item.created_at),
      }));

      if (isMounted) {
        setInventoryItems(parsed);
        setLoading(false);
        setError(null);
      }
    } catch (err: any) {
      console.error("Failed to fetch inventory:", err);
      if (isMounted) {
        setError(err.message || "Failed to load inventory.");
        setLoading(false);
      }
    }
  };
  
  // New function to fetch all yearly status counts in one go
  const fetchAllYearlyStatusCounts = async (year: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const response = await fetch(`/api/inventory/yearly-status-counts?year=${year}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch yearly status totals.");
        }

        const data = await response.json();

        setYearlyStatusCounts({
            total: data.total || 0,
            delivered: data["Delivered"] || 0,
            forDelivery: data["For Delivery"] || 0,
            pending: data["Pending"] || 0,
        });
    } catch (err: any) {
      //console.error("Failed to fetch yearly status totals:", err);
      setYearlyStatusCounts({ total: 0, delivered: 0, forDelivery: 0, pending: 0 });
    }
  };

  // useEffect for fetching filtered items (for the table)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }
    let isMounted = true;
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (statusFilter !== 'All') params.append('status', statusFilter);
    if (selectedMonthYear?.year) params.append('year', selectedMonthYear.year.toString());
    if (selectedMonthYear?.month) params.append('month', selectedMonthYear.month.toString());

    fetchFilteredItems(isMounted, token, params);

    return () => {
      isMounted = false;
    };
  }, [searchQuery, statusFilter, selectedMonthYear]);

  // New useEffect that runs only when the selected year changes (for the top cards)
  useEffect(() => {
    if (selectedMonthYear?.year) {
      fetchAllYearlyStatusCounts(selectedMonthYear.year);
    }
  }, [selectedMonthYear?.year]);

  // useEffect for WebSocket updates
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let isMounted = true;
    const socket = new WebSocket(`ws://${window.location.host}/ws/inventory?token=${token}`);
    ws.current = socket;

    socket.onopen = () => {
      if (isMounted) {
        setConnected(true);
      }
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'inventory_update') {
          const params = new URLSearchParams();
          if (stateRef.current.searchQuery) params.append('q', stateRef.current.searchQuery);
          if (stateRef.current.statusFilter !== 'All') params.append('status', stateRef.current.statusFilter);
          if (stateRef.current.selectedMonthYear?.year) params.append('year', stateRef.current.selectedMonthYear.year.toString());
          if (stateRef.current.selectedMonthYear?.month) params.append('month', stateRef.current.selectedMonthYear.month.toString());

          fetchFilteredItems(isMounted, token, params);
          if (stateRef.current.selectedMonthYear?.year) {
            fetchAllYearlyStatusCounts(stateRef.current.selectedMonthYear.year);
          }
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

  return { inventoryItems, loading, error, connected, yearlyStatusCounts };
}

// Hook for adding a new inventory item
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { addInventory, loading, error, success };
}

// Hook for fetching a single item's details
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
        ...data,
        entry_date: new Date(data.entry_date),
        delivery_date: data.delivery_date ? new Date(data.delivery_date) : null,
        created_at: new Date(data.created_at),
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

// Hook for updating an inventory item
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

// Hook for deleting an inventory item
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

// Hook for fetching suppliers
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