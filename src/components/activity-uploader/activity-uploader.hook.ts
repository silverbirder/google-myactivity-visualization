import { useCallback, useMemo, useState } from "react";
import createActivitiesSql from "./create_activities.sql";
import insertActivitiesSql from "./insert_activities.sql";
import JSZip from "jszip";
import type { Activity } from "@/types";
import { useDuckDBContext } from "@/contexts";

type UploadProgress = {
  totalFiles: number;
  processedFiles: number;
  percent: number;
  message: string;
};

type UseActivityUploaderOptions = {
  onUploadComplete?: () => void;
};

export const useActivityUploader = (
  options: UseActivityUploaderOptions = {},
) => {
  const { onUploadComplete } = options;
  const { isLoading, error, runQuery, registerFileText } = useDuckDBContext();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [progress, setProgress] = useState<UploadProgress>({
    totalFiles: 0,
    processedFiles: 0,
    percent: 0,
    message: "",
  });

  const createTable = useCallback(
    async (path: string) => {
      const sql = createActivitiesSql.replace(
        "__PATH__",
        path.replaceAll("'", "''"),
      );
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
        const sql = insertActivitiesSql.replace(
          "__PATH__",
          path.replaceAll("'", "''"),
        );
        await runQuery(sql);
      }
    },
    [createTable, registerFileText, runQuery],
  );

  const handleFileUpload = useCallback(
    async (file: File) => {
      setUploadError(null);
      setIsUploading(true);
      const isZip =
        file.type === "application/zip" ||
        file.type === "application/x-zip-compressed" ||
        /\.zip$/i.test(file.name);
      if (isZip) {
        try {
          setProgress({
            totalFiles: 0,
            processedFiles: 0,
            percent: 0,
            message: "ZIP を展開中…",
          });
          const zip = await JSZip.loadAsync(file);
          const allFiles = Object.values(zip.files);
          const jsonFiles = allFiles.filter((f) => /\.json$/i.test(f.name));
          if (jsonFiles.length === 0) {
            throw new Error("ZIP 内に JSON ファイルが見つかりません");
          }
          setProgress({
            totalFiles: jsonFiles.length,
            processedFiles: 0,
            percent: 0,
            message: `全 ${jsonFiles.length} 件の JSON を処理中…`,
          });
          for (let i = 0; i < jsonFiles.length; i++) {
            const f = jsonFiles[i]!;
            setProgress((p) => ({
              ...p,
              message: `${i + 1} / ${jsonFiles.length} を読み込み中… (${f.name})`,
            }));
            const content = await f.async("string");
            try {
              const parsed = JSON.parse(content) as unknown;
              if (Array.isArray(parsed)) {
                const mapped = (parsed as Activity[]).map((a) => ({
                  ...a,
                  time: a.time ? new Date(a.time).toLocaleString() : a.time,
                }));
                setProgress((p) => ({
                  ...p,
                  message: `データを挿入中… (${f.name})`,
                }));
                await insertActivities(mapped);
              }
            } catch {
              // パースエラーは無視してスキップ
            }
            const processedFiles = i + 1;
            const percent = Math.round(
              (processedFiles / jsonFiles.length) * 100,
            );
            setProgress((p) => ({
              ...p,
              processedFiles,
              percent,
              message: `処理中… ${percent}%`,
            }));
          }
          setProgress((p) => ({
            ...p,
            processedFiles: jsonFiles.length,
            percent: 100,
            message: "完了",
          }));
          onUploadComplete?.();
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          setUploadError(msg);
          setProgress((p) => ({ ...p, message: `エラー: ${msg}` }));
        } finally {
          setIsUploading(false);
        }
        return;
      }

      // JSONファイルのみ
      setProgress({
        totalFiles: 1,
        processedFiles: 0,
        percent: 0,
        message: "JSON を読み込み中…",
      });
      try {
        const text = await file.text();
        const json = JSON.parse(text) as unknown;
        if (Array.isArray(json)) {
          const mapped = (json as Activity[]).map((a) => ({
            ...a,
            time: a.time ? new Date(a.time).toLocaleString() : a.time,
          }));
          setProgress((p) => ({
            ...p,
            message: "データを挿入中…",
            percent: 50,
          }));
          await insertActivities(mapped);
          setProgress({
            totalFiles: 1,
            processedFiles: 1,
            percent: 100,
            message: "完了",
          });
          onUploadComplete?.();
        } else {
          throw new Error("JSON の配列形式ではありません");
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setUploadError(`JSON: ${msg}`);
        setProgress((p) => ({ ...p, message: `エラー: ${msg}` }));
      } finally {
        setIsUploading(false);
      }
    },
    [insertActivities, onUploadComplete],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        void handleFileUpload(file);
      }
    },
    [handleFileUpload],
  );

  const uploadingStatusText = useMemo(() => {
    if (uploadError) return `エラー: ${uploadError}`;
    if (isUploading) return progress.message || "処理中…";
    if (progress.percent === 100 && progress.totalFiles > 0) return "完了";
    return "";
  }, [
    isUploading,
    progress.message,
    progress.percent,
    progress.totalFiles,
    uploadError,
  ]);

  return {
    handleChange,
    isLoading,
    error,
    isUploading,
    uploadError,
    progress,
    uploadingStatusText,
  } as const;
};
