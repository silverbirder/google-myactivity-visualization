"use client";

import { useEffect } from "react";
import { useTimeline } from "./timeline.hook";
import { TimelineMonthSelector } from "./timeline-month-selector";
import { useTimelineMonthSelector } from "./timeline-month-selector.hook";
import {
  TimelineRoot,
  TimelineItem,
  TimelineConnector,
  TimelineSeparator,
  TimelineIndicator,
  TimelineContent,
  TimelineTitle,
} from "@chakra-ui/react";

const hours = Array.from({ length: 24 }, (_, i) => i + 1);

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
      <TimelineRoot>
        {hours.map((hour) => {
          let colorPalette = "blue";
          if (hour >= 7 && hour <= 12) colorPalette = "teal";
          else if (hour >= 13 && hour <= 18) colorPalette = "orange";
          else if (hour >= 19 && hour <= 24) colorPalette = "pink";
          return (
            <TimelineItem key={hour}>
              <TimelineConnector>
                <TimelineSeparator />
                <TimelineIndicator colorPalette={colorPalette}>
                  {hour}
                </TimelineIndicator>
              </TimelineConnector>
              <TimelineContent>
                <TimelineTitle>
                  {data[hour]
                    ? Object.entries(data[hour])
                        .map(([product, count]) => `${product} (${count})`)
                        .join(", ")
                    : "-"}
                </TimelineTitle>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </TimelineRoot>
    </div>
  );
};
