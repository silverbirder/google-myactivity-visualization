"use client";

import { useEffect } from "react";
import { useTimeline } from "./timeline.hook";

import { TimelineMonthSelector } from "./timeline-month-selector";
import { useTimelineMonthSelector } from "./timeline-month-selector.hook";

const hours = Array.from({ length: 24 }, (_, i) => i);

export const Timeline = () => {
  const { year, setYear, month, setMonth } = useTimelineMonthSelector();
  const { data, fetchTimeline, isLoading } = useTimeline(year, month);
  useEffect(() => {
    if (!isLoading) {
      void fetchTimeline();
    }
  }, [isLoading, year, month, fetchTimeline]);

  return (
    <div>
      <TimelineMonthSelector
        year={year}
        month={month}
        setYear={setYear}
        setMonth={setMonth}
      />
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>時間</th>
            <th>プロダクト（回数）</th>
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              <td style={{ border: "1px solid #ccc", padding: 4 }}>{hour}時</td>
              <td style={{ border: "1px solid #ccc", padding: 4 }}>
                {data[hour]
                  ? Object.entries(data[hour])
                      .map(([product, count]) => `${product} (${count})`)
                      .join(", ")
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
