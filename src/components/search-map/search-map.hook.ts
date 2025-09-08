"use client";

import { useMemo } from "react";
import type { Activity, LocationInfo } from "@/types";

function decodeLatLngFromUrl(url: string): [number, number] | null {
  const match = /center=([\d.\-]+),([\d.\-]+)/.exec(url);
  if (match?.[1] && match?.[2]) {
    return [parseFloat(match[1]), parseFloat(match[2])];
  }
  return null;
}

export function useSearchMap(
  activities: Activity[],
  year: number,
  month: number,
) {
  return useMemo(() => {
    const points: { lat: number; lng: number; name?: string; url?: string }[] =
      [];
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
              });
            }
          }
        });
      }
    });
    return points;
  }, [activities, year, month]);
}
