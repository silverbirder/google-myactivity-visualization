"use client";

import { useState, useCallback, useEffect } from "react";
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
  const [selectedWeekday, setSelectedWeekday] = useState<number>(1);

  const fetchTimeline = useCallback(async () => {
    try {
      let sql = selectTimelineByMonthSql
        .replace("__YEAR__", `'${year}'`)
        .replace("__MONTH__", `'${month.toString().padStart(2, "0")}'`);
      const weekdayList = `'${selectedWeekday}'`;
      sql = sql.replace("__WEEKDAYS__", weekdayList);
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
  }, [runQuery, year, month, selectedWeekday]);

  useEffect(() => {
    void fetchTimeline();
  }, [fetchTimeline]);

  return {
    data,
    loading,
    selectedWeekday,
    setSelectedWeekday,
  } as const;
};
