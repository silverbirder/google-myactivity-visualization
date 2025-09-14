"use client";

import { useEffect, useMemo, useState } from "react";
import sqlQuery from "./select_activities_by_year_month.sql";
import selectProductsSql from "./select_products.sql";
import type { Activity, LocationInfo } from "@/types";
import { useDuckDBContext } from "@/contexts";

function decodeLatLngFromUrl(url: string): [number, number] | null {
  const match = /center=([\d.\-]+),([\d.\-]+)/.exec(url);
  if (match?.[1] && match?.[2]) {
    return [parseFloat(match[1]), parseFloat(match[2])];
  }
  return null;
}

export function useSearchMap(year: number, month: number) {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [productOptions, setProductOptions] = useState<string[]>([]);
  const [product, setProduct] = useState<string>("");
  const { runQuery } = useDuckDBContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sql = sqlQuery
          .replace("__YEAR__", `${year}`)
          .replace("__MONTH__", `${String(month).padStart(2, "0")}`)
          .replace("__PRODUCT__", product)
          .replace("__PRODUCT__", product);
        const data: unknown[] = await runQuery(sql);
        console.log({ sql, data });
        setActivities(data as Activity[]);
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [year, month, product, runQuery]);

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

  const points = useMemo(() => {
    const points: {
      lat: number;
      lng: number;
      name?: string;
      url?: string;
      product?: string;
    }[] = [];
    activities.forEach((activity) => {
      const date = new Date(activity.time);
      if (date.getFullYear() === year && date.getMonth() + 1 === month) {
        const infos = JSON.parse(
          activity.locationInfos ?? "[]",
        ) as LocationInfo[];
        infos.forEach((info) => {
          if (info?.url) {
            const latlng = decodeLatLngFromUrl(info.url);
            if (latlng) {
              points.push({
                lat: latlng[0],
                lng: latlng[1],
                name: info.name,
                url: info.url,
                product: activity.product,
              });
            }
          }
        });
      }
    });
    return points;
  }, [activities, year, month]);

  return { points, loading, productOptions, product, setProduct } as const;
}
