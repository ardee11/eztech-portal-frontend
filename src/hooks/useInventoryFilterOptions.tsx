import { useEffect, useState } from "react";

type MonthYear = { month: number; year: number };

export function useInventoryFilterOptions() {
  const [monthYearOptions, setMonthYearOptions] = useState<MonthYear[]>([]);
  const [yearOptions, setYearOptions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/inventory/filter-options")
      .then(res => res.json())
      .then((data: MonthYear[]) => {
        setMonthYearOptions(data);

        const uniqueYears = Array.from(
          new Set(data.map(item => item.year))
        ).sort((a, b) => b - a);
        setYearOptions(uniqueYears);

        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch filter options", err);
        setError("Failed to fetch filter options");
        setLoading(false);
      });
  }, []);

  return { monthYearOptions, yearOptions, loading, error };
}
