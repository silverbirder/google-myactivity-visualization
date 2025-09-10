"use client";

import {
  ActivityUploaderContainer,
  WordCloudContainer,
  ActivityViewerContainer,
  HeatmapContainer,
  TimelineContainer,
  SearchMapContainer,
} from "@/components";
import { usePage } from "./page.hook";
import {
  Center,
  Container,
  Heading,
  NativeSelect,
  Stack,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";

export const Page = () => {
  const {
    isDuckDBLoading,
    isYearMonthsLoading,
    yearMonths,
    selectedYearMonth,
    handleSelectedYearMonth,
  } = usePage();

  if (isDuckDBLoading) <div>読み込み中です</div>;

  return (
    <Container>
      <Center>
        <Stack gap="4">
          <Heading size="2xl">Googleマイアクティビティを可視化</Heading>
          <Stack gap="2">
            <Heading size="lg">ファイルをアップロード</Heading>
            <ActivityUploaderContainer />
          </Stack>
          {!isYearMonthsLoading && yearMonths.length > 0 && (
            <NativeSelect.Root>
              <NativeSelect.Field
                value={`${selectedYearMonth?.year}-${selectedYearMonth?.month}`}
                placeholder="年月を選択してください。"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  const [year, month] = e.target.value.split("-");
                  handleSelectedYearMonth({
                    year: Number(year),
                    month: Number(month),
                  });
                }}
              >
                {yearMonths.map((yearMonth) => (
                  <option
                    key={`${yearMonth.year}-${yearMonth.month}`}
                    value={`${yearMonth.year}-${yearMonth.month}`}
                  >
                    {yearMonth.year}年{yearMonth.month}月
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          )}
          {selectedYearMonth && (
            <>
              <Stack>
                <Heading size="lg">Chrome検索履歴のWordCloud</Heading>
                <WordCloudContainer yearMonth={selectedYearMonth} />
              </Stack>
              <Stack>
                <Heading size="lg">ヒートマップ</Heading>
                <HeatmapContainer yearMonth={selectedYearMonth} />
              </Stack>
              <Stack>
                <Heading size="lg">タイムライン</Heading>
                <TimelineContainer yearMonth={selectedYearMonth} />
              </Stack>
              <Stack>
                <Heading size="lg">検索地図</Heading>
                <SearchMapContainer yearMonth={selectedYearMonth} />
              </Stack>
            </>
          )}
          <Stack>
            <Heading size="lg">アクティビティテーブル</Heading>
            <ActivityViewerContainer />
          </Stack>
        </Stack>
      </Center>
    </Container>
  );
};
