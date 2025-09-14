"use client";

import { useTimeline } from "./timeline.hook";
import type { YearMonth } from "@/types";
import { TimelineComponent } from "./timeline.component";
import { Skeleton } from "@chakra-ui/react";
import { NotFoundEmptyState } from "..";

type Props = {
  yearMonth: YearMonth;
};

export const TimelineContainer = ({ yearMonth }: Props) => {
  const { data, loading } = useTimeline(yearMonth.year, yearMonth.month);

  if (loading) return <Skeleton height="50vh" width="100%" />;
  if (Object.keys(data).length === 0) return <NotFoundEmptyState />;

  return <TimelineComponent data={data} />;
};
