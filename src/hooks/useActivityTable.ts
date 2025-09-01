import { useCallback } from "react";
import type { Activity } from "@/types";
import { useDuckDBContext } from "@/contexts/DuckDBContext";

export const useActivityTable = () => {
  const { isLoading, error, runQuery } = useDuckDBContext();
  const TABLE_NAME = "activities";

  const createTable = useCallback(async () => {
    await runQuery(`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      header VARCHAR,
      title VARCHAR,
      titleUrl VARCHAR,
      time VARCHAR,
      products VARCHAR,
      activityControls VARCHAR
    )`);
  }, [runQuery, TABLE_NAME]);

  const insertActivities = useCallback(
    async (data: Activity[]) => {
      await createTable();
      const esc = (v: string) => (v ?? "").replace(/'/g, "''");
      const BATCH_SIZE = 1000;
      const statements: string[] = [];
      statements.push("BEGIN TRANSACTION;");
      for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const chunk = data.slice(i, i + BATCH_SIZE);
        const values = chunk
          .map((a: Activity) => {
            const header = esc(a.header ?? "");
            const title = esc(a.title ?? "");
            const titleUrl = esc(a.titleUrl ?? "");
            const time = esc(a.time ?? "");
            const products = esc(JSON.stringify(a.products ?? []));
            const activityControls = esc(
              JSON.stringify(a.activityControls ?? []),
            );
            return `('${header}','${title}','${titleUrl}','${time}','${products}','${activityControls}')`;
          })
          .join(",\n");
        if (values.length === 0) continue;
        statements.push(
          `INSERT INTO ${TABLE_NAME} (header, title, titleUrl, time, products, activityControls)\nVALUES ${values};`,
        );
      }
      statements.push("COMMIT;");
      const sql = statements.join("\n");
      try {
        await runQuery(sql);
      } catch (e) {
        try {
          await runQuery("ROLLBACK;");
        } catch {}
        throw e;
      }
    },
    [createTable, runQuery, TABLE_NAME],
  );

  const handleFileUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = e.target?.result;
          if (typeof result === "string") {
            const json = JSON.parse(result) as unknown;
            if (Array.isArray(json)) {
              await insertActivities(json as Activity[]);
            }
          }
        } catch {
          // エラー時は何もしない
        }
      };
      reader.readAsText(file);
    },
    [insertActivities],
  );

  return { handleFileUpload, isLoading, error };
};
