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
      for (const a of data) {
        await runQuery(
          `INSERT INTO ${TABLE_NAME} VALUES (
          '${a.header.replace(/'/g, "''")}',
          '${a.title.replace(/'/g, "''")}',
          '${a.titleUrl.replace(/'/g, "''")}',
          '${a.time.replace(/'/g, "''")}',
          '${JSON.stringify(a.products).replace(/'/g, "''")}',
          '${JSON.stringify(a.activityControls).replace(/'/g, "''")}'
        )`,
        );
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
