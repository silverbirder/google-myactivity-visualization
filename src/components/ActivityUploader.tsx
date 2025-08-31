import React from "react";

export const ActivityUploader: React.FC<{ onUpload: (file: File) => void }> = ({
  onUpload,
}) => (
  <input
    type="file"
    accept="application/json"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) onUpload(file);
    }}
  />
);
