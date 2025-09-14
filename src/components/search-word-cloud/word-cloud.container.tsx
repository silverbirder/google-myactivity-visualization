"use client";

import { useWordCloud } from "./word-cloud.hook";
import { WordCloudComponent } from "./word-cloud.component";
import type { YearMonth } from "@/types";
import { Skeleton } from "@chakra-ui/react";
import { NotFoundEmptyState } from "..";
import { useSearchAvailableYearMonths } from "./search-available-year-months.hook";
import { SearchAvailableYearMonthsComponent } from "./search-available-year-months.component";

type Props = {
  yearMonth: YearMonth;
};

export const WordCloudContainer = ({ yearMonth }: Props) => {
  const { words, loading } = useWordCloud({ yearMonth });
  const { yearMonths, loading: yearMonthsLoading } =
    useSearchAvailableYearMonths();

  if (loading || yearMonthsLoading)
    return <Skeleton height="250px" width="100%" />;
  if (words.length === 0) return <NotFoundEmptyState />;

  return (
    <>
      <WordCloudComponent words={words} width={600} height={400} />
      <SearchAvailableYearMonthsComponent yearMonths={yearMonths} />
    </>
  );
};
