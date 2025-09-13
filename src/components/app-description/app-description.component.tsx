import { Box, Heading, Stack, Text, Icon, Card, List } from "@chakra-ui/react";
import {
  FaInfoCircle,
  FaDownload,
  FaUpload,
  FaShieldAlt,
} from "react-icons/fa";

export const AppDescriptionComponent = () => {
  return (
    <Card.Root>
      <Card.Body p="6">
        <Stack gap="4">
          <Box textAlign="center">
            <Icon size="xl" mb="2">
              <FaInfoCircle />
            </Icon>
            <Heading size="lg">このアプリについて</Heading>
          </Box>
          <List.Root gap="3" variant="plain" align="start">
            <List.Item>
              <List.Indicator asChild>
                <FaInfoCircle />
              </List.Indicator>
              <Text fontSize="sm" fontWeight="medium">
                Googleマイアクティビティデータを可視化し、活動パターンを分析できるWebアプリケーションです。
              </Text>
            </List.Item>
            <List.Item>
              <List.Indicator asChild>
                <FaDownload />
              </List.Indicator>
              <Text fontSize="sm" fontWeight="medium">
                <Text as="span" fontWeight="bold">
                  Google Takeout
                </Text>
                から「マイアクティビティ」データをダウンロードしてください。
                <Text as="span" color="red.600" fontWeight="bold">
                  ダウンロード時のフォーマットは必ずJSONを選択してください。
                </Text>
              </Text>
            </List.Item>

            <List.Item>
              <List.Indicator asChild>
                <FaUpload />
              </List.Indicator>
              <Text fontSize="sm" fontWeight="medium">
                ダウンロードしたZIPファイルをそのまま、または解凍したJSONファイルを個別にアップロードしていただけます。
              </Text>
            </List.Item>

            <List.Item>
              <List.Indicator asChild>
                <FaShieldAlt />
              </List.Indicator>
              <Text fontSize="sm" fontWeight="medium">
                <Text as="span" fontWeight="bold">
                  プライバシー保護
                </Text>
                ：
                すべてのデータはブラウザ内でのみ処理され、外部サーバーには一切送信されません。
              </Text>
            </List.Item>
          </List.Root>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
