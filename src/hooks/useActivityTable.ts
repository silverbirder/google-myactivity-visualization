import { useCallback } from "react";
import JSZip from "jszip";
import type { Activity } from "@/types";
import { useDuckDBContext } from "@/contexts/DuckDBContext";

export const useActivityTable = () => {
  const { isLoading, error, runQuery, registerFileText } = useDuckDBContext();
  const TABLE_NAME = "activities";

  const createTable = useCallback(
    async (path: string) => {
      await runQuery(
        `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} AS
         SELECT
           json_extract_string(json, '$.header')                AS header,
           json_extract_string(json, '$.title')                 AS title,
           json_extract_string(json, '$.titleUrl')              AS titleUrl,
           json_extract_string(json, '$.time')                  AS time,
           json_extract(json, '$.products')                     AS products,
           json_extract(json, '$.activityControls')             AS activityControls,
           json_extract_string(json, '$.description')           AS description,
           json_extract(json, '$.safeHtmlItem')                 AS safeHtmlItem,
           json_extract(json, '$.audioFiles')                   AS audioFiles,
           json_extract(json, '$.details')                      AS details,
           json_extract(json, '$.locationInfos')                AS locationInfos,
           json_extract(json, '$.subtitles')                    AS subtitles
         FROM read_json_objects('${path}')`,
      );
    },
    [runQuery, TABLE_NAME],
  );

  const insertActivities = useCallback(
    async (data: Activity[]) => {
      const path = `mem://activities_${Date.now()}.json`;
      const jsonText = JSON.stringify(data);
      await registerFileText(path, jsonText);
      await createTable(path);
      await runQuery(
        `INSERT INTO ${TABLE_NAME}
         SELECT
           json_extract_string(json, '$.header')                AS header,
           json_extract_string(json, '$.title')                 AS title,
           json_extract_string(json, '$.titleUrl')              AS titleUrl,
           json_extract_string(json, '$.time')                  AS time,
           json_extract(json, '$.products')                     AS products,
           json_extract(json, '$.activityControls')             AS activityControls,
           json_extract_string(json, '$.description')           AS description,
           json_extract(json, '$.safeHtmlItem')                 AS safeHtmlItem,
           json_extract(json, '$.audioFiles')                   AS audioFiles,
           json_extract(json, '$.details')                      AS details,
           json_extract(json, '$.locationInfos')                AS locationInfos,
           json_extract(json, '$.subtitles')                    AS subtitles
         FROM read_json_objects('${path}')`,
      );
    },
    [createTable, registerFileText, TABLE_NAME, runQuery],
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
