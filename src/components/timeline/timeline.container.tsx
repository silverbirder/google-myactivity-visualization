"use client";

import { useTimeline } from "./timeline.hook";
import type { YearMonth } from "@/types";
import { TimelineComponent } from "./timeline.component";

type Props = {
  yearMonth: YearMonth;
};

export const TimelineContainer = ({ yearMonth }: Props) => {
  const { data, loading } = useTimeline(yearMonth.year, yearMonth.month);

  if (loading) return <div>読み込み中です</div>;
  if (Object.keys(data).length === 0)
    return <div>結果が見つかりませんでした</div>;

  return <TimelineComponent data={data} />;
};
