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
  data: Map<string, number>;
};

export type YearProductStatsChartData = {
  year: number;
  [productName: string]: number;
};

export const convertTableToChartData = (
  tableData: YearProductStatsTable,
): {
  chartData: YearProductStatsChartData[];
  series: Array<{ name: string; color: string }>;
} => {
  const chartData: YearProductStatsChartData[] = tableData.years.map((year) => {
    const yearData: YearProductStatsChartData = { year };
    tableData.products.forEach((product) => {
      const count = tableData.data.get(`${year}-${product}`) ?? 0;
      yearData[product] = typeof count === "bigint" ? Number(count) : count;
    });
    return yearData;
  });

  const colorPalette = [
    "blue.solid",
    "green.solid",
    "orange.solid",
    "purple.solid",
    "teal.solid",
    "red.solid",
    "yellow.solid",
    "pink.solid",
    "cyan.solid",
    "gray.solid",
    "blue.emphasized",
    "green.emphasized",
    "orange.emphasized",
    "purple.emphasized",
    "teal.emphasized",
    "red.emphasized",
    "yellow.emphasized",
    "pink.emphasized",
    "cyan.emphasized",
    "gray.emphasized",
  ];

  const series = tableData.products.map((product, index) => ({
    name: product,
    color: colorPalette[index % colorPalette.length] ?? "blue.solid",
  }));

  return { chartData, series };
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

      const years = Array.from(
        new Set(
          data.map((d) =>
            typeof d.year === "bigint" ? Number(d.year) : d.year,
          ),
        ),
      ).sort((a, b) => a - b);
      const products = Array.from(new Set(data.map((d) => d.product))).sort();

      const dataMap = new Map<string, number>();
      data.forEach((d) => {
        const year = typeof d.year === "bigint" ? Number(d.year) : d.year;
        const count = typeof d.count === "bigint" ? Number(d.count) : d.count;
        dataMap.set(`${year}-${d.product}`, count);
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
