import { useEffect, useState } from "react";

type MonthYear = { month: number; year: number };

export function useInventoryFilterOptions() {
  const [options, setOptions] = useState<MonthYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/inventory/filter-options")
      .then(res => res.json())
      .then(data => {
        setOptions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch filter options", err);
        setError("Failed to fetch filter options");
        setLoading(false);
      });
  }, []);

  return { options, loading, error };
}
