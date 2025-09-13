"use client";

import { useState, useCallback, useEffect } from "react";
import selectYearProductStatsSql from "./select_year_product_stats.sql";
import { useDuckDBContext } from "@/contexts";

export type YearProductStatsData = {
  year: number;
  product: string;
  count: number;
};

export type YearProductStatsTable = {
  years: number[];
  products: string[];
  data: Map<string, number>; // key: "year-product", value: count
};

export const useYearProductStats = () => {
  const { runQuery } = useDuckDBContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableData, setTableData] = useState<YearProductStatsTable>({
    years: [],
    products: [],
    data: new Map(),
  });

  const fetchYearProductStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await runQuery(selectYearProductStatsSql);
      const data = result as YearProductStatsData[];

      // 年とproductのユニークな値を取得
      const years = Array.from(new Set(data.map((d) => d.year))).sort(
        (a, b) => b - a,
      );
      const products = Array.from(new Set(data.map((d) => d.product))).sort();

      // Map形式でデータを格納
      const dataMap = new Map<string, number>();
      data.forEach((d) => {
        dataMap.set(`${d.year}-${d.product}`, d.count);
      });

      setTableData({
        years,
        products,
        data: dataMap,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [runQuery]);

  useEffect(() => {
    void fetchYearProductStats();
  }, [fetchYearProductStats]);

  return {
    loading,
    error,
    tableData,
    refetch: fetchYearProductStats,
  } as const;
};
