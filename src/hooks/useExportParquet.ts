import { useCallback } from "react";
import type { AsyncDuckDB } from "@duckdb/duckdb-wasm";

export function useExportParquet(db: AsyncDuckDB | null, tableName: string) {
  return useCallback(async () => {
    if (!db) throw new Error("DBが初期化されていません");
    const conn = await db.connect();
    const filePath = `/tmp/${tableName}.parquet`;
    await conn.query(`COPY ${tableName} TO '${filePath}' (FORMAT 'parquet')`);
    const data = await db.copyFileToBuffer(filePath);
    await conn.close();
    return data;
  }, [db, tableName]);
}
