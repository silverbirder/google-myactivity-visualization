"use client";

import {
  Box,
  Button,
  FileUpload,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { ChangeEventHandler } from "react";
import { LuUpload, LuDownload } from "react-icons/lu";

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
  const handleSampleDownload = () => {
    const link = document.createElement("a");
    link.href = "/sample-myactivity.json";
    link.download = "sample-myactivity.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <VStack align="stretch" gap={4}>
      <Text color="fg.muted">
        Google
        Takeoutからダウンロードしたマイアクティビティファイルをアップロードしてください
      </Text>
      <Box bg="bg.muted" p={4} borderRadius="md">
        <Text fontSize="sm" fontWeight="semibold" mb={2}>
          初めてご利用の方へ
        </Text>
        <Text fontSize="sm" color="fg.muted" mb={3}>
          可視化がどんな感じになるか試してみたい方は、サンプルデータをダウンロードしてアップロードしてみてください。
        </Text>
        <Button size="sm" variant="outline" onClick={handleSampleDownload}>
          <LuDownload />
          サンプルデータをダウンロード
        </Button>
      </Box>
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
