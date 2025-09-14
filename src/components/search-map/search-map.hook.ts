"use client";

import { useEffect, useMemo, useState } from "react";
import sqlQuery from "./select_activities_by_year_month.sql";
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
  const { runQuery } = useDuckDBContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sql = sqlQuery
          .replace("?", `'${year}'`)
          .replace("?", `'${String(month).padStart(2, "0")}'`);
        const data: unknown[] = await runQuery(sql);
        setActivities(data as Activity[]);
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [year, month, runQuery]);

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

  return { points, loading } as const;
}
