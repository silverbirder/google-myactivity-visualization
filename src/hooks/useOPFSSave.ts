import { useCallback } from "react";

export function useOPFSSave(fileName: string) {
  return useCallback(
    async (data: Uint8Array) => {
      const root = await navigator.storage.getDirectory();
      const fileHandle = await root.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(new Blob([data.slice().buffer]));
      await writable.close();
    },
    [fileName],
  );
}
