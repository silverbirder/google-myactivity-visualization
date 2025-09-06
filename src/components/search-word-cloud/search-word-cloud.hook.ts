import { useCallback, useState } from "react";
import { useDuckDBContext } from "@/contexts";
import type { WordCloudData } from "./word-cloud";
import selectSearchWordsSql from "@/sql/select_search_words.sql";

export function useSearchWordCloud() {
  const { isLoading, runQuery } = useDuckDBContext();
  const [words, setWords] = useState<WordCloudData>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWords = useCallback(async () => {
    if (isLoading) return;
    setLoading(true);
    setError(null);
    try {
      const sql = selectSearchWordsSql.replace("__LIMIT__", String(100));
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
      setWords(Object.entries(freq).map(([text, value]) => ({ text, value })));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [isLoading, runQuery]);
  return { words, loading, error, fetchWords };
}
