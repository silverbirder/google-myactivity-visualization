"use client";

import { ActivityUploader, SearchWordCloud } from "@/components";
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
          {/*<DuckDBViewer defaultQuery={"SELECT * FROM activities LIMIT 10;"} />*/}
        </Stack>
      </Center>
    </Container>
  );
}
