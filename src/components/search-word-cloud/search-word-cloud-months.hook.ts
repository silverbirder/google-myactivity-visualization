import selectMonthsSql from "./select_months.sql";
import { useCallback, useState } from "react";
import { useDuckDBContext } from "@/contexts";

export type YearMonth = { year: number; month: number };

export function useAvailableMonths() {
  const { isLoading, runQuery } = useDuckDBContext();
  const [months, setMonths] = useState<YearMonth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonths = useCallback(async () => {
    if (isLoading) return;
    setError(null);
    try {
      const sql = selectMonthsSql;
      const res = await runQuery(sql);
      setMonths(
        res.map((row) => ({
          year: Number(row.year),
          month: Number(row.month),
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [isLoading, runQuery]);

  return { months, loading, error, fetchMonths };
}
