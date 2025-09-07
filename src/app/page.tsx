"use client";

import {
  ActivityUploader,
  SearchWordCloud,
  ActivityViewer,
} from "@/components";
import { Center, Container, Heading, Stack } from "@chakra-ui/react";

export default function Page() {
  return (
    <Container>
      <Center>
        <Stack gap="4">
          <Heading size="2xl">Googleマイアクティビティを可視化</Heading>
          <Stack gap="2">
            <Heading size="lg">ファイルをアップロード</Heading>
            <ActivityUploader />
          </Stack>
          <Stack>
            <Heading size="lg">Chrome検索履歴のWordCloud</Heading>
            <SearchWordCloud />
          </Stack>
          <Stack>
            <Heading size="lg">アクティビティテーブル</Heading>
            <ActivityViewer />
          </Stack>
        </Stack>
      </Center>
    </Container>
  );
}
