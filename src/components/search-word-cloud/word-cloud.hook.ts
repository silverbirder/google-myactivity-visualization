"use client";

import { useCallback, useEffect, useState } from "react";
import { useDuckDBContext } from "@/contexts";
import type { WordCloudData } from "./word-cloud.component";
import selectSearchWordsByYearMonthSql from "./select_search_words_by_year_month.sql";
import type { YearMonth } from "@/types";

type Props = {
  yearMonth: YearMonth;
};

export const useWordCloud = ({ yearMonth }: Props) => {
  const { runQuery } = useDuckDBContext();
  const [words, setWords] = useState<WordCloudData>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWords = useCallback(
    async (params: { year: number; month: number }) => {
      setError(null);
      setLoading(true);
      try {
        const sql = selectSearchWordsByYearMonthSql
          .replace("__YEAR__", String(params.year))
          .replace("__MONTH__", String(params.month));
        const res = await runQuery(sql);
        const freq: Record<string, number> = {};
        for (const row of res) {
          const raw = String(row.searched_word ?? "").trim();
          if (!raw) continue;
          const words = raw
            .split("+")
            .map((w) => w.trim())
            .filter(Boolean);
          for (const word of words) {
            freq[word] = (freq[word] ?? 0) + 1;
          }
        }
        setWords(
          Object.entries(freq).map(([text, value]) => ({ text, value })),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [runQuery],
  );

  useEffect(() => {
    void fetchWords(yearMonth);
  }, [yearMonth, fetchWords]);

  return { words, loading, error } as const;
};
