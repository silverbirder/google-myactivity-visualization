import { useCallback } from "react";
import JSZip from "jszip";
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
      const BATCH_SIZE = 500;
      for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const chunk = data.slice(i, i + BATCH_SIZE);
        if (chunk.length === 0) continue;
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
        const sql = `INSERT INTO ${TABLE_NAME} (header, title, titleUrl, time, products, activityControls)\nVALUES ${values};`;
        await runQuery(sql);
      }
    },
    [createTable, runQuery, TABLE_NAME],
  );

  const handleFileUpload = useCallback(
    async (file: File) => {
      const isZip =
        file.type === "application/zip" ||
        file.type === "application/x-zip-compressed" ||
        /\.zip$/i.test(file.name);
      if (!isZip) {
        const text = await file.text();
        try {
          const json = JSON.parse(text) as unknown;
          if (Array.isArray(json)) {
            await insertActivities(json as Activity[]);
          }
        } catch {}
        return;
      }
      try {
        const zip = await JSZip.loadAsync(file);
        const allFiles = Object.values(zip.files);
        const jsonFiles = allFiles.filter((f) => /\.json$/i.test(f.name));
        if (jsonFiles.length === 0) return;
        for (const f of jsonFiles) {
          const content = await f.async("string");
          try {
            const parsed = JSON.parse(content) as unknown;
            if (Array.isArray(parsed)) {
              await insertActivities(parsed as Activity[]);
            }
          } catch {}
        }
      } catch {}
    },
    [insertActivities],
  );

  return { handleFileUpload, isLoading, error };
};
