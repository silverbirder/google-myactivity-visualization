import { useCallback } from 'react';

/**
 * Uint8ArrayデータをOPFSに保存する汎用hook
 * @param fileName 保存するファイル名
 * @returns 保存処理関数
 */
export function useOPFSSave(fileName: string) {
  return useCallback(async (data: Uint8Array) => {
  const root = await navigator.storage.getDirectory();
  const fileHandle = await root.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(new Blob([data.slice().buffer]));
  await writable.close();
  }, [fileName]);
}
