"use client";

import { Spinner } from "@chakra-ui/react";
import { YearProductStatsComponent } from "./year-product-stats.component";
import { useYearProductStats } from "./year-product-stats.hook";
import { NotFoundEmptyState } from "..";

export const YearProductStatsContainer = () => {
  const { loading, tableData } = useYearProductStats();

  if (loading) return <Spinner />;
  if (tableData.years.length === 0)
    return (
      <NotFoundEmptyState
        title="データが見つかりません"
        description="年ごとの製品統計が見つかりませんでした。"
      />
    );

  return <YearProductStatsComponent tableData={tableData} />;
};
