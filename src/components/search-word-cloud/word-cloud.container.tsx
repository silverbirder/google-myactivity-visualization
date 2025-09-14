"use client";

import { useWordCloud } from "./word-cloud.hook";
import { WordCloudComponent } from "./word-cloud.component";
import type { YearMonth } from "@/types";
import { Skeleton } from "@chakra-ui/react";
import { NotFoundEmptyState } from "..";

type Props = {
  yearMonth: YearMonth;
};

export const WordCloudContainer = ({ yearMonth }: Props) => {
  const { words, loading } = useWordCloud({ yearMonth });

  if (loading) return <Skeleton height="250px" width="100%" />;
  if (words.length === 0) return <NotFoundEmptyState />;

  return <WordCloudComponent words={words} width={600} height={400} />;
};
