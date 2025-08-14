import { useState, useEffect } from "react";

interface Admin {
  aid: number;
  name: string;
  position: string;
  role: string[];
  email: string;
}

export const useAdmin = (trigger?: boolean) => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/admins`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error("Failed to fetch admins");
        const data = await response.json();
        setAdmins(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [trigger]);

  return { admins, loading, error };
};

export const useAdminDetails = (email: string | null) => {
  const [adminData, setAdminData] = useState<Admin | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    if (email === null) return;

    const fetchAdmin = async () => {
      setLoadingDetails(true);
      setErrorDetails(null);
      try {
        const res = await fetch(`/admins/${email}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch admin");
        }
        const data = await res.json();
        setAdminData(data);
        console.log(data);
      } catch (err) {
        if (err instanceof Error) setErrorDetails(err.message);
        else setErrorDetails("Unknown error");
        setAdminData(null);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchAdmin();
  }, [email]);

  return { adminData, loadingDetails, errorDetails };
};

export const useAddAdmin = () => {
  const addAdmin = async (
    name: string,
    email: string,
    position: string,
    role: string[]
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, position, role }),
      });

      if (!response.ok) {
        const errorRes = await response.json();
        return { success: false, error: errorRes.message || "Failed to add admin." };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: "Network error while adding admin." };
    }
  };

  return { addAdmin };
};

export const removeAdmin = async (
  aid: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`/admins/${aid}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      const errorRes = await response.json();
      return { success: false, error: errorRes.message || "Failed to delete admin." };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: "Network error while removing admin." };
  }
};

export function useAccountManagers() {
  const [accountManagers, setAccountManagers] = useState<{ name: string; aid: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authorization token missing.");
      setLoading(false);
      return;
    }

    async function fetchAccountManagers() {
      try {
        const res = await fetch(`/api/account-managers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch account managers");

        const managers: string[] = await res.json();

        const formatted = managers.map((name, index) => ({
          name,
          aid: index,
        }));

        setAccountManagers(formatted);
        setError(null);
      } catch (error) {
        console.error("Error fetching account managers:", error);
        setAccountManagers([]);
        setError("Failed to load account managers.");
      } finally {
        setLoading(false);
      }
    }

    fetchAccountManagers();
  }, []);

  return { accountManagers, loading, error };
};


