"use client";

import {
  ActivityUploaderContainer,
  WordCloudContainer,
  ActivityViewerContainer,
  HeatmapContainer,
  TimelineContainer,
  SearchMapContainer,
  YearProductStatsContainer,
  AppDescriptionComponent,
} from "@/components";
import { usePage } from "./page.hook";
import {
  Center,
  Container,
  Flex,
  Heading,
  NativeSelect,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { LuChartColumn, LuUpload } from "react-icons/lu";

export const Page = () => {
  const {
    isDuckDBLoading,
    isYearMonthsLoading,
    yearMonths,
    selectedYearMonth,
    handleSelectedYearMonth,
    refetchYearMonths,
  } = usePage();

  if (isDuckDBLoading) return <Spinner />;

  return (
    <Container maxWidth="breakpoint-lg" py="8">
      <Center>
        <Stack gap="6">
          <Flex alignItems="center" gap="2" justifyContent="center">
            <LuChartColumn size="2rem" color="green" />
            <Heading size="4xl" color="green">
              ActivityViz
            </Heading>
          </Flex>
          <AppDescriptionComponent />
          <Stack gap="2">
            <Flex alignItems="center" gap="2" justifyContent="flex-start">
              <LuUpload size="1.5rem" color="green" />
              <Heading size="lg">ファイルをアップロード</Heading>
            </Flex>
            <ActivityUploaderContainer onUploadComplete={refetchYearMonths} />
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
          <Container maxWidth="breakpoint-md">
            <Stack>
              <Heading size="lg">年別製品統計</Heading>
              <YearProductStatsContainer />
            </Stack>
            <Stack>
              <Heading size="lg">アクティビティテーブル</Heading>
              <ActivityViewerContainer />
            </Stack>
          </Container>
        </Stack>
      </Center>
    </Container>
  );
};
