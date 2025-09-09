import { useDuckDBContext } from "@/contexts";
import selectMonthsSql from "./select_months.sql";
import { useCallback, useEffect, useState } from "react";
import type { YearMonth } from "@/types";

export const usePage = () => {
  const { isLoading: isDuckDBLoading, runQuery } = useDuckDBContext();
  const [yearMonths, setYearMonths] = useState<YearMonth[]>([]);
  const [isYearMonthsLoading, setIsYearMonthsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYearMonth, setSelectedYearMonth] = useState<YearMonth | null>(
    null,
  );

  const fetchMonths = useCallback(async () => {
    if (isDuckDBLoading) return;
    setError(null);
    try {
      const sql = selectMonthsSql;
      const res = await runQuery(sql);
      setYearMonths(
        res.map((row) => ({
          year: Number(row.year),
          month: Number(row.month),
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsYearMonthsLoading(false);
    }
  }, [isDuckDBLoading, runQuery]);

  useEffect(() => {
    void fetchMonths();
  }, [fetchMonths]);

  const handleSelectedYearMonth = useCallback((yearMonth: YearMonth) => {
    setSelectedYearMonth(yearMonth);
  }, []);

  return {
    isDuckDBLoading,
    isYearMonthsLoading,
    yearMonths,
    error,
    selectedYearMonth,
    handleSelectedYearMonth,
  } as const;
};
