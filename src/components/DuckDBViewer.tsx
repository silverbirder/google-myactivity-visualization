"use client";

import React, { memo, useMemo, useState } from "react";
import { useDuckDB } from "@/hooks";

type Row = Record<string, string | number | boolean | null>;

export const DuckDBViewer = memo(function DuckDBViewer({
  defaultQuery,
}: {
  defaultQuery?: string;
}) {
  const { isLoading, error, runQuery } = useDuckDB();
  const [query, setQuery] = useState<string>(defaultQuery ?? "");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleRun = async () => {
    setRunning(true);
    setMessage("");
    try {
      const res = await runQuery(query || "SELECT 1 as one");
      setRows(res as Row[]);
      if ((res as Row[]).length === 0) setMessage("No rows returned");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setMessage(`Error: ${errMsg}`);
      setRows(null);
    } finally {
      setRunning(false);
    }
  };

  const headers = useMemo(() => {
    if (!rows || rows.length === 0) return [] as string[];
    const first = rows[0] as Record<string, unknown> | undefined;
    if (!first) return [] as string[];
    return Object.keys(first);
  }, [rows]);

  return (
    <div>
      <h2>DuckDB Viewer</h2>
      {isLoading ? <div>Initializing DuckDB...</div> : null}
      {error ? <div>Error: {error}</div> : null}

      <div>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={4}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginTop: 8 }}>
        <button onClick={handleRun} disabled={isLoading || running}>
          Run Query
        </button>
      </div>

      {message && <pre>{message}</pre>}

      {rows && rows.length > 0 && (
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table>
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {headers.map((h) => (
                    <td key={h}>{r[h] === null ? "NULL" : String(r[h])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

DuckDBViewer.displayName = "DuckDBViewer";
