"use client";

import { useHeatmap } from "./heatmap.hook";

import type { YearMonth } from "@/types";
import { HeatmapComponent } from "./heatmap.component";

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

  if (loading) return <div>読み込み中です</div>;
  if (calendarCells.length === 0) return <div>結果が見つかりませんでした</div>;

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
