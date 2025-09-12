"use client";

import { useCallback, useMemo, useState } from "react";
import { useDuckDBContext } from "@/contexts";

export const useActivityDeleter = () => {
  const { isLoading, error, runQuery, reset } = useDuckDBContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletedCount, setDeletedCount] = useState<number | null>(null);

  const handleDeleteAll = useCallback(async () => {
    if (isLoading) return;
    setIsDeleting(true);
    setDeleteError(null);
    setDeletedCount(null);
    try {
      const countRes = await runQuery(
        "SELECT COUNT(*) AS cnt FROM activities;",
      );
      const cntRow = countRes[0] as { cnt?: number } | undefined;
      const beforeCount = Number(cntRow?.cnt ?? 0);
      await runQuery("TRUNCATE TABLE activities;");
      await reset();
      setDeletedCount(beforeCount);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setDeleteError(msg);
    } finally {
      setIsDeleting(false);
    }
  }, [isLoading, runQuery, reset]);

  const statusText = useMemo(() => {
    if (deleteError) return `エラー: ${deleteError}`;
    if (isDeleting) return "削除中…";
    if (deletedCount !== null) return `${deletedCount}件を削除しました`;
    return "";
  }, [deleteError, isDeleting, deletedCount]);

  return {
    isLoading,
    error,
    isDeleting,
    deletedCount,
    deleteError,
    statusText,
    handleDeleteAll,
  } as const;
};
