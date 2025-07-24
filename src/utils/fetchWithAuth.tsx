import { useAuth } from "../contexts/authContext";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL!;

export const useFetchWithAuth = () => {
  const { token } = useAuth();

  return async (
    url: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
    data?: any
  ) => {
    const headers: HeadersInit = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (data && method !== "GET") {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${url}`, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }

    return response.json();
  };
};
