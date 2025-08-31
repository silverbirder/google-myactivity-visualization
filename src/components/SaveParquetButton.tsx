import React from "react";
import { useExportParquet, useOPFSSave } from "@/hooks";
import type { AsyncDuckDB } from "@duckdb/duckdb-wasm";

interface SaveParquetButtonProps {
  db: AsyncDuckDB | null;
  tableName: string;
  fileName?: string;
}

/**
 * Parquet保存ボタン（汎用）
 * @param db DuckDBインスタンス
 * @param tableName エクスポートするテーブル名
 * @param fileName 保存するファイル名（省略時は `${tableName}.parquet`）
 */
export const SaveParquetButton: React.FC<SaveParquetButtonProps> = ({
  db,
  tableName,
  fileName,
}) => {
  const exportParquet = useExportParquet(db, tableName);
  const saveOPFS = useOPFSSave(fileName ?? `${tableName}.parquet`);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleClick = async () => {
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
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "保存中..." : "Parquetで保存"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};
