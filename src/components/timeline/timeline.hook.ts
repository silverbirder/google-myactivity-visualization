"use client";

import { useState, useCallback } from "react";
import selectTimelineByMonthSql from "./select_timeline_by_month.sql";
import { useDuckDBContext } from "@/contexts";

export type TimelineCell = {
  hour: number;
  product: string;
  count: number;
};

export type TimelineData = Record<number, Record<string, number>>;

export const useTimeline = (year: number, month: number) => {
  const { runQuery } = useDuckDBContext();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TimelineData>({});

  const fetchTimeline = useCallback(async () => {
    try {
      const sql = selectTimelineByMonthSql
        .replace("?", `'${year}'`)
        .replace("?", `'${month.toString().padStart(2, "0")}'`);
      const result = await runQuery(sql);
      const timeline: TimelineData = {};
      (
        result as Array<{
          hour: string | number;
          product: string;
          count: number;
        }>
      ).forEach((row) => {
        const hour = Number(row.hour);
        timeline[hour] ??= {};
        timeline[hour][row.product] = row.count;
      });
      setData(timeline);
    } finally {
      setLoading(false);
    }
  }, [runQuery, year, month]);

  return {
    data,
    fetchTimeline,
    loading,
  };
};
