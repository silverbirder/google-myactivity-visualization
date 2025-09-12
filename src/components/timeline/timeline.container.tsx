"use client";

import { useTimeline } from "./timeline.hook";
import type { YearMonth } from "@/types";
import { TimelineComponent } from "./timeline.component";
import { Spinner } from "@chakra-ui/react";
import { NotFoundEmptyState } from "..";

type Props = {
  yearMonth: YearMonth;
};

export const TimelineContainer = ({ yearMonth }: Props) => {
  const { data, loading } = useTimeline(yearMonth.year, yearMonth.month);

  if (loading) return <Spinner />;
  if (Object.keys(data).length === 0) return <NotFoundEmptyState />;

  return <TimelineComponent data={data} />;
};
