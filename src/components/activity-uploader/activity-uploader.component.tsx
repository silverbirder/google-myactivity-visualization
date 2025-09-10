"use client";

import {
  Box,
  FileUpload,
  Icon,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { ChangeEventHandler } from "react";
import { LuUpload } from "react-icons/lu";

type Props = {
  onFileUpload?: ChangeEventHandler;
  isUploading?: boolean;
  progressPercent?: number;
  statusText?: string;
};

export const ActivityUploaderComponent = ({
  onFileUpload,
  isUploading = false,
  progressPercent = 0,
  statusText = "",
}: Props) => {
  return (
    <VStack align="stretch" maxW="xl" gap={3}>
      <FileUpload.Root alignItems="stretch" maxFiles={1}>
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
      {(isUploading || progressPercent > 0 || statusText) && (
        <Box>
          <Progress.Root value={progressPercent} max={100}>
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
          {statusText && (
            <Text fontSize="sm" color="fg.muted" mt={1}>
              {statusText}
            </Text>
          )}
        </Box>
      )}
    </VStack>
  );
};
