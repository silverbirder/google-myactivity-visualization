import { useEffect } from "react";
import type { AsyncDuckDB } from "@duckdb/duckdb-wasm";

export function useLoadParquetToDuckDB(db: AsyncDuckDB | null) {
  useEffect(() => {
    if (!db) return;
    void (async () => {
      const files = await db.globFiles("/opfs/");
      for (const file of files) {
        if (file.fileName.endsWith(".parquet")) {
          await db.registerOPFSFileName(file.fileName);
          const tableName = file.fileName
            .replace(/^\/opfs\//, "")
            .replace(/\.parquet$/, "");
          const conn = await db.connect();
          await conn.query(
            `CREATE TABLE ${tableName} AS SELECT * FROM read_parquet('${file.fileName}')`,
          );
          await conn.close();
        }
      }
    })();
  }, [db]);
}
