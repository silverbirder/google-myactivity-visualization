"use client";

import { Box, FileUpload, Icon } from "@chakra-ui/react";
import type { ChangeEventHandler } from "react";
import { LuUpload } from "react-icons/lu";

type Props = {
  onFileUpload?: ChangeEventHandler;
};

export const ActivityUploaderComponent = ({ onFileUpload }: Props) => {
  return (
    <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={1}>
      <FileUpload.HiddenInput
        accept="application/json,.json,application/zip,application/x-zip-compressed,.zip"
        onChange={onFileUpload}
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
};
