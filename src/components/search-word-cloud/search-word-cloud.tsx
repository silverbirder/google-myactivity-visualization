"use client";

import { useEffect } from "react";
import { useSearchWordCloud } from "./search-word-cloud.hook";
import { WordCloud } from "./word-cloud";
import type { YearMonth } from "@/types";

type Props = {
  yearMonth: YearMonth;
};

export const SearchWordCloud = ({ yearMonth }: Props) => {
  const { words, loading, fetchWords } = useSearchWordCloud();

  useEffect(() => {
    void fetchWords(yearMonth);
  }, [yearMonth, fetchWords]);

  if (loading) return <div>読み込み中です</div>;
  if (words.length === 0) return <div>結果が見つかりませんでした</div>;
  return <WordCloud words={words} width={600} height={400} />;
};
