import { memo, useCallback } from "react";
import { useActivityUploader } from "./activity-uploader.hook";
import { Box, FileUpload, Icon } from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";

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
    <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={1}>
      <FileUpload.HiddenInput
        accept="application/json,.json,application/zip,application/x-zip-compressed,.zip"
        onChange={handleChange}
      />
      <FileUpload.Dropzone>
        <Icon size="md" color="fg.muted">
          <LuUpload />
        </Icon>
        <FileUpload.DropzoneContent>
          <Box>ここにファイルをドラッグ＆ドロップ</Box>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
      <FileUpload.List />
    </FileUpload.Root>
  );
});

ActivityUploader.displayName = "ActivityUploader";
