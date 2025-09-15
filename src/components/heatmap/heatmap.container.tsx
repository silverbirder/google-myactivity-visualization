"use client";

import { useHeatmap } from "./heatmap.hook";

import type { YearMonth } from "@/types";
import { HeatmapComponent } from "./heatmap.component";
import { Skeleton } from "@chakra-ui/react";
import { NotFoundEmptyState } from "..";

type Props = {
  yearMonth: YearMonth;
};

export const HeatmapContainer = ({ yearMonth }: Props) => {
  const { year, month } = yearMonth;
  const {
    dayCountMap,
    getColor,
    calendarCells,
    productOptions,
    product,
    setProduct,
    loading,
  } = useHeatmap({
    year,
    month,
  });

  if (loading) return <Skeleton height="288px" width="100%" />;
  if (calendarCells.length === 0)
    return <NotFoundEmptyState height="288px" width="100%" />;

  return (
    <HeatmapComponent
      productOptions={productOptions}
      product={product}
      setProduct={setProduct}
      dayCountMap={dayCountMap}
      getColor={getColor}
      calendarCells={calendarCells}
    />
  );
};
