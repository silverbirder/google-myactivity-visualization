"use client";

import { useActivityUploader } from "./activity-uploader.hook";
import { ActivityUploaderComponent } from "./activity-uploader.component";

type Props = {
  onUploadComplete?: () => void;
};

export const ActivityUploaderContainer = ({ onUploadComplete }: Props) => {
  const { handleChange, isUploading, progress, uploadingStatusText } =
    useActivityUploader({ onUploadComplete });

  return (
    <ActivityUploaderComponent
      onFileUpload={handleChange}
      isUploading={isUploading}
      progressPercent={progress.percent}
      statusText={uploadingStatusText}
    />
  );
};
