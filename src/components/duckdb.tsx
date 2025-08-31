"use client";

import { useState } from "react";
import { useDuckDB } from "@/hooks";

export const DuckDB = () => {
  const { isLoading, error, runQuery } = useDuckDB();
  const [result, setResult] = useState<string>("");

  const handleRunQuery = async () => {
    try {
      const queryResult: Record<string, string | number | boolean | null>[] =
        await runQuery("SELECT 1 as num, 'Hello DuckDB!' as message");
      setResult(JSON.stringify(queryResult, null, 2));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setResult(`Error: ${errorMessage}`);
    }
  };

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
};
