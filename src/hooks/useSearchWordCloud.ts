import { useCallback, useState } from "react";
import { useDuckDBContext } from "@/contexts/DuckDBContext";
import type { WordCloudData } from "@/components/WordCloud";

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
      const res = await runQuery(`
        SELECT 
          url_decode(regexp_extract(titleUrl, '[?&]q=([^&]+)', 1)) AS searched_word
        FROM activities
        WHERE header = '検索'
          AND titleUrl LIKE 'https://www.google.com/search?%'
        LIMIT 100;
      `);
      // 集計してワードごとの出現回数をカウント
      const freq: Record<string, number> = {};
      for (const row of res) {
        const raw = String(row.searched_word ?? "").trim();
        if (!raw) continue;
        // +で分割し、空白や空文字を除外
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
