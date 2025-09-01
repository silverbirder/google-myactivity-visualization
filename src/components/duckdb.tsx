"use client";

import React, { useState, useCallback, memo } from "react";
import { useDuckDBContext } from "@/contexts/DuckDBContext";

export const DuckDB = memo(() => {
  const { isLoading, error, runQuery } = useDuckDBContext();
  const [result, setResult] = useState<string>("");

  const handleRunQuery = useCallback(async () => {
    try {
      const queryResult: Record<string, string | number | boolean | null>[] =
        await runQuery("SELECT 1 as num, 'Hello DuckDB!' as message");
      setResult(JSON.stringify(queryResult, null, 2));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setResult(`Error: ${errorMessage}`);
    }
  }, [runQuery]);

  if (isLoading) {
    return <div>Loading DuckDB...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>DuckDB WASM Demo</h2>
      <p>{result || "Ready to run queries!"}</p>
      <button onClick={handleRunQuery}>Run Sample Query</button>
    </div>
  );
});

DuckDB.displayName = "DuckDB";
