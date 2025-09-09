import { useState, useEffect, useMemo, useCallback } from "react";
import { useDuckDBContext } from "@/contexts";
import selectProductsSql from "./select_products.sql";
import selectCountsByDaySql from "./select_counts_by_day.sql";

export function useHeatmap({ year, month }: { year: number; month: number }) {
  const { runQuery } = useDuckDBContext();
  const [data, setData] = useState<{ day: number; count: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [productOptions, setProductOptions] = useState<string[]>([]);
  const [product, setProduct] = useState<string>("");

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
    void fetchData();
  }, [runQuery, year, month, product]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await runQuery(selectProductsSql);
        const options = (result as { product: string }[]).map((r) => r.product);
        setProductOptions(options);
        if (options.length > 0) setProduct(options[0] ?? "");
      } catch {
        setProductOptions([]);
      }
    };
    void fetchProducts();
  }, [runQuery]);

  const dayCountMap = useMemo(() => {
    const map = new Map<number, number>();
    data?.forEach(({ day, count }) => {
      map.set(day, count);
    });
    return map;
  }, [data]);

  const calendarCells = useMemo(() => {
    const lastDay = new Date(year, month, 0).getDate();
    const firstDate = new Date(year, month - 1, 1);
    const firstDayOfWeek = firstDate.getDay();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= lastDay; d++) {
      cells.push(d);
    }
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }
    if (cells.length < 35) {
      while (cells.length < 35) cells.push(null);
    } else if (cells.length > 35) {
      cells.length = 35;
    }
    return cells;
  }, [year, month]);

  const getColor = useCallback((count?: number) => {
    if (!count) return "gray.100";
    if (count > 20) return "red.400";
    if (count > 10) return "orange.300";
    if (count > 5) return "yellow.200";
    return "green.100";
  }, []);

  return {
    data,
    error,
    dayCountMap,
    getColor,
    calendarCells,
    productOptions,
    product,
    setProduct,
  };
}
