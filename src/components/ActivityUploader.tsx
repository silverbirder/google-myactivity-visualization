import React, { memo, useCallback } from "react";

export const ActivityUploader = memo(function ActivityUploader({
  onUpload,
}: {
  onUpload: (file: File) => void;
}) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onUpload(file);
    },
    [onUpload],
  );

  return (
    <input type="file" accept="application/json" onChange={handleChange} />
  );
});

ActivityUploader.displayName = "ActivityUploader";
