"use client";

import { useCallback, useMemo, useState } from "react";
import { useDuckDBContext } from "@/contexts";

type Prop = {
  onDeleteComplete?: () => void;
};

export const useActivityDeleter = ({ onDeleteComplete }: Prop) => {
  const { error, runQuery, reset } = useDuckDBContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDeleteAll = useCallback(async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await runQuery("TRUNCATE TABLE activities;");
      await reset();
      setIsDeleted(true);
      onDeleteComplete?.();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setDeleteError(msg);
    } finally {
      setIsDeleting(false);
    }
  }, [runQuery, reset, onDeleteComplete]);

  const statusText = useMemo(() => {
    if (deleteError) return `エラー: ${deleteError}`;
    if (isDeleting) return "削除中…";
    if (isDeleted) return "削除しました";
    return "";
  }, [deleteError, isDeleting, isDeleted]);

  return {
    error,
    isDeleting,
    deleteError,
    statusText,
    handleDeleteAll,
  } as const;
};
