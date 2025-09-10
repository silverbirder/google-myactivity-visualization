"use client";

import { useWordCloud } from "./word-cloud.hook";
import { WordCloudComponent } from "./word-cloud.component";
import type { YearMonth } from "@/types";

type Props = {
  yearMonth: YearMonth;
};

export const WordCloudContainer = ({ yearMonth }: Props) => {
  const { words, loading } = useWordCloud({ yearMonth });

  if (loading) return <div>読み込み中です</div>;
  if (words.length === 0) return <div>結果が見つかりませんでした</div>;

  return <WordCloudComponent words={words} width={600} height={400} />;
};
