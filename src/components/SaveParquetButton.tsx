import { useExportParquet, useOPFSSave } from "@/hooks";
import type { AsyncDuckDB } from "@duckdb/duckdb-wasm";
import React, { useState, useCallback, memo, useMemo } from "react";

interface SaveParquetButtonProps {
  db: AsyncDuckDB | null;
  tableName: string;
  fileName?: string;
}

export const SaveParquetButton = memo(function SaveParquetButton({
  db,
  tableName,
  fileName,
}: SaveParquetButtonProps) {
  const exportParquet = useExportParquet(db, tableName);
  const saveOPFS = useOPFSSave(
    useMemo(() => fileName ?? `${tableName}.parquet`, [fileName, tableName]),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await exportParquet();
      await saveOPFS(data);
      alert("保存しました！");
    } catch (e: unknown) {
      if (
        typeof e === "object" &&
        e !== null &&
        "message" in e &&
        typeof (e as { message?: unknown }).message === "string"
      ) {
        setError((e as { message: string }).message);
      } else {
        setError("不明なエラー");
      }
    } finally {
      setLoading(false);
    }
  }, [exportParquet, saveOPFS]);

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "保存中..." : "Parquetで保存"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
});

SaveParquetButton.displayName = "SaveParquetButton";
