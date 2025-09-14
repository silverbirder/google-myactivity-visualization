import { useDuckDBContext } from "@/contexts";
import selectMonthsSql from "./select_months.sql";
import { useCallback, useEffect, useState } from "react";
import type { YearMonth } from "@/types";
import { createListCollection } from "@chakra-ui/react";
type ViewMode = "single" | "comparison";

export const usePage = () => {
  const { isLoading: isDuckDBLoading, runQuery } = useDuckDBContext();
  const [yearMonths, setYearMonths] = useState<YearMonth[]>([]);
  const [isYearMonthsLoading, setIsYearMonthsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [selectedYearMonth, setSelectedYearMonth] = useState<YearMonth | null>(
    null,
  );
  const [comparisonYearMonths, setComparisonYearMonths] = useState<YearMonth[]>(
    [],
  );

  const [yearProductStatsRefreshTrigger, setYearProductStatsRefreshTrigger] =
    useState(0);

  const fetchMonths = useCallback(async () => {
    if (isDuckDBLoading) return;
    setError(null);
    try {
      const sql = selectMonthsSql;
      const res = await runQuery(sql);
      const newYearMonths = res.map((row) => ({
        year: Number(row.year),
        month: Number(row.month),
        has_word_cloud_data: Boolean(row.has_word_cloud_data),
        has_location_data: Boolean(row.has_location_data),
      }));
      setYearMonths(newYearMonths);

      if (newYearMonths.length > 0 && !selectedYearMonth) {
        const firstYearMonth = newYearMonths[0];
        if (firstYearMonth) {
          setSelectedYearMonth(firstYearMonth);
          setComparisonYearMonths([firstYearMonth]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsYearMonthsLoading(false);
    }
  }, [isDuckDBLoading, runQuery, selectedYearMonth]);

  useEffect(() => {
    void fetchMonths();
  }, [fetchMonths]);

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
    void fetchMonths();
    setYearProductStatsRefreshTrigger((prev) => prev + 1);
  }, [fetchMonths]);

  const handleDeleteComplete = useCallback(() => {
    window.location.reload();
  }, []);

  const createYearMonthCollection = useCallback((yearMonthList: YearMonth[]) => {
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
            ? `利用可能: ${features.join(", ")}`
            : "データなし";

        return {
          label: `${yearMonth.year}年${yearMonth.month}月`,
          value: `${yearMonth.year}-${yearMonth.month}`,
          description,
        };
      }),
    });
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
    refetchYearMonths: fetchMonths,
    yearProductStatsRefreshTrigger,
    handleUploadComplete,
    handleDeleteComplete,
    createYearMonthCollection,
  } as const;
};
