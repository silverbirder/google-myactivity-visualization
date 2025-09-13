"use client";

import { Box, FileUpload, Progress, Text, VStack } from "@chakra-ui/react";
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
    <VStack align="stretch">
      <Text color="fg.muted">
        Google
        Takeoutからダウンロードしたマイアクティビティファイルをアップロードしてください
      </Text>
      <FileUpload.Root alignItems="stretch" maxFiles={1}>
        <FileUpload.HiddenInput accept=".json,.zip" onChange={onFileUpload} />
        <FileUpload.Dropzone>
          <LuUpload size="2rem" />
          <FileUpload.DropzoneContent>
            <Text fontSize="lg" fontWeight="bold">
              ここにファイルをドラッグ＆ドロップ
            </Text>
            <Text fontSize="sm">または、クリックしてファイルを選択</Text>
            <Text fontSize="sm">対応形式: JSON, ZIP</Text>
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
