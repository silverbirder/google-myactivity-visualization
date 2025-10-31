"use client";

import { useEffect, useState, useCallback } from "react";
import { useDuckDBContext } from "@/contexts";
import selectChromeDomainsByYearMonthSql from "./select_chrome_domains_by_year_month.sql";

export type DomainCount = {
  domain: string;
  count: number;
};

export const useChromeDomainBarList = (yearMonth: {
  year: number;
  month: number;
}) => {
  const { runQuery } = useDuckDBContext();
  const [topDomains, setTopDomains] = useState<DomainCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDomains = useCallback(
    async (params: { year: number; month: number }) => {
      setError(null);
      setIsLoading(true);
      try {
        const firstDay = `${params.year}-${String(params.month).padStart(2, "0")}-01`;
        const lastDayDate = new Date(params.year, params.month, 0);
        const lastDay = `${params.year}-${String(params.month).padStart(2, "0")}-${String(lastDayDate.getDate()).padStart(2, "0")}`;
        const sql = selectChromeDomainsByYearMonthSql
          .replace("__FIRST_DAY__", firstDay)
          .replace("__LAST_DAY__", lastDay);
        const res = (await runQuery(sql)) as {
          domain: string;
          count: number;
        }[];
        setTopDomains(
          res.map((row) => ({
            domain: row.domain,
            count: Number(row.count),
          })),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setTopDomains([]);
      } finally {
        setIsLoading(false);
      }
    },
    [runQuery],
  );

  useEffect(() => {
    void fetchDomains(yearMonth);
  }, [yearMonth, fetchDomains]);

  return { topDomains, isLoading, error };
};
