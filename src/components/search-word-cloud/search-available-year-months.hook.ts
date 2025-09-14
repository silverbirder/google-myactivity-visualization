"use client";

import { useCallback, useEffect, useState } from "react";
import { useDuckDBContext } from "@/contexts";
import type { YearMonth } from "@/types";
import selectSearchAvailableYearMonthsSql from "./select_search_available_year_months.sql";

export const useSearchAvailableYearMonths = () => {
  const { runQuery } = useDuckDBContext();
  const [yearMonths, setYearMonths] = useState<YearMonth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchYearMonths = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await runQuery(selectSearchAvailableYearMonthsSql);
      const yearMonthList: YearMonth[] = res.map((row) => ({
        year: Number(row.year),
        month: Number(row.month),
      }));
      setYearMonths(yearMonthList);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [runQuery]);

  useEffect(() => {
    void fetchYearMonths();
  }, [fetchYearMonths]);

  return { yearMonths, loading, error } as const;
};
