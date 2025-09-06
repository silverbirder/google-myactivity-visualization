import { useCallback } from "react";
import { buildCreateActivitiesSql } from "@/sql/create_activities";
import { buildInsertActivitiesSql } from "@/sql/insert_activities";
import JSZip from "jszip";
import type { Activity } from "@/types";
import { useDuckDBContext } from "@/contexts/DuckDBContext";

export const useActivityTable = () => {
  const { isLoading, error, runQuery, registerFileText } = useDuckDBContext();

  const createTable = useCallback(
    async (path: string) => {
      const sql = buildCreateActivitiesSql(path);
      await runQuery(sql);
    },
    [runQuery],
  );

  const insertActivities = useCallback(
    async (data: Activity[]) => {
      const path = `mem://activities_${Date.now()}.json`;
      const jsonText = JSON.stringify(data);
      await registerFileText(path, jsonText);
      await createTable(path);
      {
        const sql = buildInsertActivitiesSql(path);
        await runQuery(sql);
      }
    },
    [createTable, registerFileText, runQuery],
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
