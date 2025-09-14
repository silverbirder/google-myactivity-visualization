import { Heading, Stack, Text, Card, List, Flex, Link } from "@chakra-ui/react";
import {
  LuDownload,
  LuExternalLink,
  LuInfo,
  LuShield,
  LuUpload,
} from "react-icons/lu";

export const AppDescriptionComponent = () => {
  return (
    <Card.Root backgroundColor="bg.muted">
      <Card.Body p="4">
        <Stack gap="4">
          <Flex gap="2" alignItems="center" justifyContent="center">
            <LuInfo size="1rem" />
            <Heading size="lg">このアプリについて</Heading>
          </Flex>
          <List.Root gap="2" variant="plain" align="start">
            <List.Item>
              <List.Indicator asChild>
                <LuInfo />
              </List.Indicator>
              <Text fontSize="sm">
                Googleマイアクティビティデータを可視化し、活動パターンを分析できるWebアプリケーションです。
              </Text>
            </List.Item>
            <List.Item>
              <List.Indicator asChild>
                <LuDownload />
              </List.Indicator>
              <Text fontSize="sm">
                <Link
                  href="https://takeout.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  fontWeight="bold"
                  color="blue.600"
                  textDecoration="underline"
                  _hover={{ color: "blue.800" }}
                  marginRight="1"
                >
                  Google Takeout
                  <LuExternalLink size="0.8rem" />
                </Link>
                から「マイ アクティビティ」データをダウンロードしてください。
                <Text as="span" color="red.600" fontWeight="bold">
                  ダウンロード時は「複数の形式」→「アクティビティの記録」→「JSON」を選択してください。
                </Text>
              </Text>
            </List.Item>
            <List.Item>
              <List.Indicator asChild>
                <LuUpload />
              </List.Indicator>
              <Text fontSize="sm">
                ダウンロードしたZIPファイルをそのまま、または解凍したJSONファイルを個別にアップロードしていただけます。
              </Text>
            </List.Item>
            <List.Item>
              <List.Indicator asChild>
                <LuShield />
              </List.Indicator>
              <Text fontSize="sm" fontWeight="bold">
                すべてのデータはブラウザ内でのみ処理され、
                <Text as="span" color="red.600" fontWeight="bold">
                  外部サーバーには一切送信されません。
                </Text>
              </Text>
            </List.Item>
          </List.Root>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
