"use client";

import { useActivityUploader } from "./activity-uploader.hook";
import { ActivityUploaderComponent } from "./activity-uploader.component";

export const ActivityUploaderContainer = () => {
  const { handleChange, isUploading, progress, uploadingStatusText } =
    useActivityUploader();

  return (
    <ActivityUploaderComponent
      onFileUpload={handleChange}
      isUploading={isUploading}
      progressPercent={progress.percent}
      statusText={uploadingStatusText}
    />
  );
};
