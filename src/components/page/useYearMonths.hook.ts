import { useCallback, useEffect, useState } from "react";
import { useDuckDBContext } from "@/contexts";
import type { YearMonth } from "@/types";
import selectMonthsSql from "./select_months.sql";

export const useYearMonths = () => {
  const { isLoading: isDuckDBLoading, runQuery } = useDuckDBContext();
  const [yearMonths, setYearMonths] = useState<YearMonth[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchYearMonths = useCallback(async () => {
    if (isDuckDBLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      const sql = selectMonthsSql;
      const res = await runQuery(sql);
      const newYearMonths = res.map((row) => ({
        year: Number(row.year),
        month: Number(row.month),
        has_word_cloud_data: Boolean(row.has_word_cloud_data),
        has_location_data: Boolean(row.has_location_data),
      }));
      setYearMonths(newYearMonths);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [isDuckDBLoading, runQuery]);

  useEffect(() => {
    void fetchYearMonths();
  }, [fetchYearMonths]);

  const refetch = useCallback(() => {
    void fetchYearMonths();
  }, [fetchYearMonths]);

  return {
    yearMonths,
    isLoading,
    isDuckDBLoading,
    error,
    refetch,
  } as const;
};
