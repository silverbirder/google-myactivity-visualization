import type { YearMonth } from "@/types";
import { YearMonthSelector } from "./year-month-selector.component";

type Props = {
  yearMonths: YearMonth[];
  viewMode: "single" | "comparison";
  selectedYearMonth?: YearMonth | null;
  comparisonYearMonths?: YearMonth[];
  onSelectedYearMonthChange: (yearMonth: YearMonth) => void;
  onAddComparisonYearMonth: (yearMonth: YearMonth) => void;
  onRemoveComparisonYearMonth: (yearMonth: YearMonth) => void;
};

export const YearMonthSelectorContainer = (props: Props) => {
  return <YearMonthSelector {...props} />;
};
