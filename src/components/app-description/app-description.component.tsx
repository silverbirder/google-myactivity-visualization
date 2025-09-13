import {
  Box,
  Heading,
  Stack,
  Text,
  Icon,
  Card,
  List,
  Flex,
  Link,
} from "@chakra-ui/react";
import {
  FaInfoCircle,
  FaDownload,
  FaUpload,
  FaShieldAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

export const AppDescriptionComponent = () => {
  return (
    <Card.Root borderColor="green.fg">
      <Card.Body p="4">
        <Stack gap="4">
          <Flex gap="2" alignItems="center" justifyContent="center">
            <FaInfoCircle size="1rem" />
            <Heading size="lg">このアプリについて</Heading>
          </Flex>
          <List.Root gap="2" variant="plain" align="start">
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
                  <FaExternalLinkAlt size="0.8rem" />
                </Link>
                から「マイ アクティビティ」データをダウンロードしてください。
                <Text as="span" color="red.600" fontWeight="bold">
                  ダウンロード時は「複数の形式」→「アクティビティの記録」→「JSON」を選択してください。
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
                すべてのデータはブラウザ内でのみ処理され、外部サーバーには一切送信されません。
              </Text>
            </List.Item>
          </List.Root>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
