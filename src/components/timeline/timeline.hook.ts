"use client";

import { useState, useCallback } from "react";
import selectTimelineByMonthSql from "./select_timeline_by_month.sql";
import { useDuckDBContext } from "@/contexts";

export interface TimelineCell {
  hour: number;
  product: string;
  count: number;
}

export type TimelineData = Record<number, Record<string, number>>;

export const useTimeline = (year: number, month: number) => {
  const { isLoading, runQuery } = useDuckDBContext();
  const [data, setData] = useState<TimelineData>({});

  const fetchTimeline = useCallback(async () => {
    const sql = selectTimelineByMonthSql
      .replace("?", `'${year}'`)
      .replace("?", `'${month.toString().padStart(2, "0")}'`);
    const result = await runQuery(sql);
    const timeline: TimelineData = {};
    const offsetHours = -new Date().getTimezoneOffset() / 60;
    const offsetHoursInt = Math.round(offsetHours);
    (
      result as Array<{ hour: string | number; product: string; count: number }>
    ).forEach((row) => {
      const utcHour = Number(row.hour);
      const localHour = (((utcHour + offsetHoursInt) % 24) + 24) % 24;
      timeline[localHour] ??= {};
      timeline[localHour][row.product] = row.count;
    });
    setData(timeline);
  }, [runQuery, year, month]);

  return {
    data,
    isLoading,
    fetchTimeline,
  };
};
