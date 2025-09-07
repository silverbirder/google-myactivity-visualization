import { useState } from "react";
import { useDuckDBContext } from "@/contexts";

export function useActivityViewer() {
  const { runQuery, isLoading, error } = useDuckDBContext();
  const [query, setQuery] = useState<string>(
    "SELECT * FROM activities LIMIT 100",
  );
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  const executeQuery = async () => {
    if (isLoading) return;
    setIsQuerying(true);
    setQueryError(null);
    try {
  const result = await runQuery(query);
  setData(result as Record<string, unknown>[]);
    } catch (err) {
      setQueryError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsQuerying(false);
    }
  };

  return {
    query,
    setQuery,
    data,
    isQuerying,
    queryError,
    isLoading,
    error,
    executeQuery,
  };
}
