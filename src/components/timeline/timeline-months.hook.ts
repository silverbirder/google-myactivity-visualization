import { useEffect, useState } from "react";
import { useDuckDBContext } from "@/contexts";
import selectTimelineMonthsSql from "./select_timeline_months.sql";

export type TimelineMonth = { year: number; month: number };

export function useTimelineMonths() {
  const { runQuery, isLoading } = useDuckDBContext();
  const [months, setMonths] = useState<TimelineMonth[]>([]);
  useEffect(() => {
    const fetch = async () => {
      const result = await runQuery(selectTimelineMonthsSql);
      setMonths(result as TimelineMonth[]);
    };
    if (!isLoading) void fetch();
  }, [isLoading, runQuery]);
  return months;
}
