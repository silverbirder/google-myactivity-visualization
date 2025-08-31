import { useEffect, useState, useCallback } from "react";
import type { Activity } from "@/types";
import { useDuckDB } from "./useDuckDB";

export const useActivityTable = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  const { db, isLoading, error, runQuery } = useDuckDB();
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

  const insertActivities = async (data: Activity[]) => {
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
    await fetchActivities();
  };

  type DuckDBRow = {
    header: string;
    title: string;
    titleUrl: string;
    time: string;
    products: string;
    activityControls: string;
  };
  const fetchActivities = useCallback(async () => {
    await createTable();
    const rows = await runQuery(`SELECT * FROM ${TABLE_NAME}`);
    setActivities(
      (rows as DuckDBRow[]).map((row) => ({
        header: row.header,
        title: row.title,
        titleUrl: row.titleUrl,
        time: row.time,
        products: JSON.parse(row.products) as string[],
        activityControls: JSON.parse(row.activityControls) as string[],
      })),
    );
  }, [createTable, runQuery, TABLE_NAME]);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const result = e.target?.result;
        if (typeof result === "string") {
          const json = JSON.parse(result) as unknown;
          if (Array.isArray(json) && json.every(isActivity)) {
            await insertActivities(json);
          }
        }
      } catch {
        // エラー時は何もしない
      }
    };
    reader.readAsText(file);
  };

  // Activity型ガード
  function isActivity(obj: unknown): obj is Activity {
    return (
      typeof obj === "object" &&
      obj !== null &&
      typeof (obj as Activity).header === "string" &&
      typeof (obj as Activity).title === "string" &&
      typeof (obj as Activity).titleUrl === "string" &&
      typeof (obj as Activity).time === "string" &&
      Array.isArray((obj as Activity).products) &&
      Array.isArray((obj as Activity).activityControls)
    );
  }

  useEffect(() => {
    if (!isLoading && db) {
      void fetchActivities();
    }
  }, [isLoading, db, fetchActivities]);

  return { activities, handleFileUpload, isLoading, error, db };
};
