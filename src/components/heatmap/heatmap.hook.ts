import { useState, useEffect } from "react";
import { useDuckDBContext } from "@/contexts";
import selectCountsByDaySql from "./select_counts_by_day.sql";

export function useHeatmap({
  year,
  month,
  product,
}: {
  year: number;
  month: number;
  product: string;
}) {
  const { runQuery, isLoading } = useDuckDBContext();
  const [data, setData] = useState<{ day: number; count: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const lastDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
        const sql = selectCountsByDaySql
          .replace("__PRODUCT__", product)
          .replace("__FIRST_DAY__", firstDay)
          .replace("__LAST_DAY__", lastDate);
        const result = await runQuery(sql);
        setData(result as { day: number; count: number }[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    };
    if (isLoading) return;
    void fetchData();
  }, [isLoading, runQuery, year, month, product]);

  return { data, isLoading, error };
}
