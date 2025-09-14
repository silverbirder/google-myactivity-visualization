"use client";

import { Skeleton } from "@chakra-ui/react";
import { YearProductStatsComponent } from "./year-product-stats.component";
import { useYearProductStats } from "./year-product-stats.hook";
import { NotFoundEmptyState } from "..";
import { useEffect } from "react";

type Props = {
  refetchTrigger?: number | boolean;
};

export const YearProductStatsContainer = ({ refetchTrigger }: Props) => {
  const { loading, tableData, refetch } = useYearProductStats();

  useEffect(() => {
    if (refetchTrigger) {
      void refetch();
    }
  }, [refetchTrigger, refetch]);

  if (loading) return <Skeleton height="400px" width="100%" />;
  if (tableData.years.length === 0)
    return (
      <NotFoundEmptyState
        title="データが見つかりません"
        description="年ごとの製品統計が見つかりませんでした。"
      />
    );

  return <YearProductStatsComponent tableData={tableData} />;
};
