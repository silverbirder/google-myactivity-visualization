import { useCallback, useMemo } from "react";
import { createListCollection } from "@chakra-ui/react";
import type { YearMonth } from "@/types";

export type UseYearMonthSelectorProps = {
  yearMonths: YearMonth[];
  selectedYearMonth?: YearMonth | null;
  comparisonYearMonths?: YearMonth[];
  onSelectedYearMonthChange: (yearMonth: YearMonth) => void;
  onAddComparisonYearMonth: (yearMonth: YearMonth) => void;
  onRemoveComparisonYearMonth: (yearMonth: YearMonth) => void;
};

export const useYearMonthSelector = ({
  yearMonths,
  selectedYearMonth,
  comparisonYearMonths = [],
  onSelectedYearMonthChange,
  onAddComparisonYearMonth,
  onRemoveComparisonYearMonth,
}: UseYearMonthSelectorProps) => {
  const createYearMonthCollection = useCallback(
    (yearMonthList: YearMonth[]) => {
      return createListCollection({
        items: yearMonthList.map((yearMonth) => {
          const features: string[] = [];
          if (yearMonth.has_word_cloud_data) {
            features.push("よく検索した言葉");
          }
          if (yearMonth.has_location_data) {
            features.push("位置情報マップ");
          }

          const description =
            features.length > 0
              ? `データあり: ${features.join(", ")}`
              : undefined;

          return {
            label: `${yearMonth.year}年${yearMonth.month}月`,
            value: `${yearMonth.year}-${yearMonth.month}`,
            description,
          };
        }),
      });
    },
    [],
  );

  const singleModeCollection = useMemo(
    () => createYearMonthCollection(yearMonths),
    [yearMonths, createYearMonthCollection],
  );

  const comparisonModeCollection = useMemo(
    () =>
      createYearMonthCollection(
        yearMonths.filter(
          (yearMonth) =>
            !comparisonYearMonths.some(
              (ym) =>
                ym.year === yearMonth.year && ym.month === yearMonth.month,
            ),
        ),
      ),
    [yearMonths, comparisonYearMonths, createYearMonthCollection],
  );

  const handleSingleModeChange = useCallback(
    (value: string) => {
      const [year, month] = value.split("-");
      const numYear = Number(year);
      const numMonth = Number(month);
      if (!isNaN(numYear) && !isNaN(numMonth)) {
        onSelectedYearMonthChange({
          year: numYear,
          month: numMonth,
        });
      }
    },
    [onSelectedYearMonthChange],
  );

  const handleComparisonModeAdd = useCallback(
    (value: string) => {
      const [year, month] = value.split("-");
      onAddComparisonYearMonth({
        year: Number(year),
        month: Number(month),
      });
    },
    [onAddComparisonYearMonth],
  );

  const selectedValue = selectedYearMonth
    ? [`${selectedYearMonth.year}-${selectedYearMonth.month}`]
    : [];

  return {
    singleModeCollection,
    comparisonModeCollection,
    selectedValue,
    handleSingleModeChange,
    handleComparisonModeAdd,
    onRemoveComparisonYearMonth,
  };
};
