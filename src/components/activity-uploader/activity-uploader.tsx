import { memo, useCallback } from "react";
import { useActivityUploader } from "./activity-uploader.hook";

export const ActivityUploader = memo(function ActivityUploader() {
  const { handleFileUpload } = useActivityUploader();
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        void handleFileUpload(file);
      }
    },
    [handleFileUpload],
  );

  return (
    <input
      type="file"
      accept="application/json,.json,application/zip,application/x-zip-compressed,.zip"
      onChange={handleChange}
    />
  );
});

ActivityUploader.displayName = "ActivityUploader";
