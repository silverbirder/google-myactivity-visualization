import { useState } from "react";

export function useTimelineMonthSelector() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  return {
    year,
    setYear,
    month,
    setMonth,
  };
}
