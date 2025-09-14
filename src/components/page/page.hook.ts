import { useCallback, useState, useEffect } from "react";
import type { YearMonth } from "@/types";
import { useYearMonths } from "./useYearMonths.hook";

type ViewMode = "single" | "comparison";

export const usePage = () => {
  const {
    yearMonths,
    isLoading: isYearMonthsLoading,
    isDuckDBLoading,
    error,
    refetch: refetchYearMonths,
  } = useYearMonths();

  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [selectedYearMonth, setSelectedYearMonth] = useState<YearMonth | null>(
    null,
  );
  const [comparisonYearMonths, setComparisonYearMonths] = useState<YearMonth[]>(
    [],
  );

  const [yearProductStatsRefreshTrigger, setYearProductStatsRefreshTrigger] =
    useState(0);

  useEffect(() => {
    if (yearMonths.length > 0 && !selectedYearMonth) {
      const firstYearMonth = yearMonths[0];
      if (firstYearMonth) {
        setSelectedYearMonth(firstYearMonth);
        setComparisonYearMonths([firstYearMonth]);
      }
    }
  }, [yearMonths, selectedYearMonth]);

  const handleSelectedYearMonth = useCallback((yearMonth: YearMonth) => {
    setSelectedYearMonth(yearMonth);
  }, []);

  const handleViewModeChange = useCallback(
    (mode: ViewMode) => {
      setViewMode(mode);
      if (mode === "single") {
        setComparisonYearMonths([]);
      } else {
        if (selectedYearMonth) {
          setComparisonYearMonths([selectedYearMonth]);
        }
      }
    },
    [selectedYearMonth],
  );

  const handleAddComparisonYearMonth = useCallback((yearMonth: YearMonth) => {
    setComparisonYearMonths((prev) => {
      const exists = prev.some(
        (ym) => ym.year === yearMonth.year && ym.month === yearMonth.month,
      );
      if (exists) return prev;
      return [...prev, yearMonth];
    });
  }, []);

  const handleRemoveComparisonYearMonth = useCallback(
    (yearMonth: YearMonth) => {
      setComparisonYearMonths((prev) =>
        prev.filter(
          (ym) => !(ym.year === yearMonth.year && ym.month === yearMonth.month),
        ),
      );
    },
    [],
  );

  const handleUploadComplete = useCallback(() => {
    refetchYearMonths();
    setYearProductStatsRefreshTrigger((prev) => prev + 1);
  }, [refetchYearMonths]);

  const handleDeleteComplete = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    isDuckDBLoading,
    isYearMonthsLoading,
    yearMonths,
    error,
    viewMode,
    selectedYearMonth,
    comparisonYearMonths,
    handleSelectedYearMonth,
    handleViewModeChange,
    handleAddComparisonYearMonth,
    handleRemoveComparisonYearMonth,
    refetchYearMonths,
    yearProductStatsRefreshTrigger,
    handleUploadComplete,
    handleDeleteComplete,
  } as const;
};
