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
  ActivityDeleterContainer,
} from "@/components";
import { usePage } from "./page.hook";
import {
  Center,
  Container,
  Heading,
  HStack,
  NativeSelect,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { LuChartColumn, LuDatabase, LuUpload, LuTrash2 } from "react-icons/lu";

export const Page = () => {
  const {
    isDuckDBLoading,
    isYearMonthsLoading,
    yearMonths,
    selectedYearMonth,
    handleSelectedYearMonth,
    yearProductStatsRefreshTrigger,
    handleUploadComplete,
    handleDeleteComplete,
  } = usePage();

  if (isDuckDBLoading) return <Spinner />;

  return (
    <Container width="100%" maxWidth="breakpoint-lg" py="8">
      <Center>
        <Stack gap="6">
          <HStack gap="2" justifyContent="center">
            <LuChartColumn size="2rem" color="green" />
            <Heading size="4xl" color="green">
              ActivityViz
            </Heading>
          </HStack>
          <AppDescriptionComponent />
          <Stack gap="2">
            <HStack gap="2">
              <LuUpload size="1.5rem" color="green" />
              <Heading size="lg">ファイルをアップロード</Heading>
            </HStack>
            <ActivityUploaderContainer
              onUploadComplete={handleUploadComplete}
            />
          </Stack>
          {!isYearMonthsLoading && yearMonths.length > 0 && (
            <NativeSelect.Root width="fit-content">
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
            <HStack gap="2">
              <LuChartColumn size="1.5rem" color="green" />
              <Heading size="lg">年別製品統計</Heading>
            </HStack>
            <YearProductStatsContainer
              refetchTrigger={yearProductStatsRefreshTrigger}
            />
          </Stack>
          <Stack>
            <HStack gap="2">
              <LuDatabase size="1.5rem" color="green" />
              <Heading size="lg">SQL Viewer</Heading>
            </HStack>
            <ActivityViewerContainer />
          </Stack>
          {!isYearMonthsLoading && yearMonths.length > 0 && (
            <Stack>
              <HStack gap="2">
                <LuTrash2 size="1.5rem" color="green" />
                <Heading size="lg">データ削除</Heading>
              </HStack>
              <ActivityDeleterContainer
                onDeleteComplete={handleDeleteComplete}
              />
            </Stack>
          )}
        </Stack>
      </Center>
    </Container>
  );
};
