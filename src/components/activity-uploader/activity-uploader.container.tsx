"use client";

import { useActivityUploader } from "./activity-uploader.hook";
import { ActivityUploaderComponent } from "./activity-uploader.component";

export const ActivityUploaderContainer = () => {
  const { handleChange } = useActivityUploader();

  return <ActivityUploaderComponent onFileUpload={handleChange} />;
};
