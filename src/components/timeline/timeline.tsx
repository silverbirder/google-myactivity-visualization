"use client";

import { useEffect } from "react";
import { useTimeline } from "./timeline.hook";
import {
  TimelineRoot,
  TimelineItem,
  TimelineConnector,
  TimelineSeparator,
  TimelineIndicator,
  TimelineContent,
  TimelineTitle,
} from "@chakra-ui/react";
import type { YearMonth } from "@/types";

const hours = Array.from({ length: 24 }, (_, i) => i + 1);

type Props = {
  yearMonth: YearMonth;
};

export const Timeline = ({ yearMonth }: Props) => {
  const { data, fetchTimeline } = useTimeline(yearMonth.year, yearMonth.month);

  useEffect(() => {
    void fetchTimeline();
  }, [yearMonth.year, yearMonth.month, fetchTimeline]);

  return (
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
  );
};
