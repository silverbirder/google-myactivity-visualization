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
  Button,
  Text,
  Flex,
  Badge,
  ScrollArea,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import {
  LuChartColumn,
  LuDatabase,
  LuUpload,
  LuTrash2,
  LuEye,
  LuGitCompare,
  LuX,
} from "react-icons/lu";

export const Page = () => {
  const {
    isDuckDBLoading,
    isYearMonthsLoading,
    yearMonths,
    viewMode,
    selectedYearMonth,
    comparisonYearMonths,
    handleSelectedYearMonth,
    handleViewModeChange,
    handleAddComparisonYearMonth,
    handleRemoveComparisonYearMonth,
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
            <Stack gap="4">
              <Stack gap="2">
                <Text fontWeight="semibold">表示モード</Text>
                <HStack gap="2">
                  <Button
                    variant={viewMode === "single" ? "solid" : "outline"}
                    size="sm"
                    onClick={() => handleViewModeChange("single")}
                  >
                    <LuEye size="1rem" />
                    シングル表示
                  </Button>
                  <Button
                    variant={viewMode === "comparison" ? "solid" : "outline"}
                    size="sm"
                    onClick={() => handleViewModeChange("comparison")}
                  >
                    <LuGitCompare size="1rem" />
                    比較表示
                  </Button>
                </HStack>
              </Stack>
              {viewMode === "single" && (
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
              {viewMode === "comparison" && (
                <Stack gap="2">
                  <Text fontWeight="semibold">比較する年月</Text>
                  <NativeSelect.Root width="fit-content">
                    <NativeSelect.Field
                      placeholder="年月を追加してください。"
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        if (e.target.value) {
                          const [year, month] = e.target.value.split("-");
                          handleAddComparisonYearMonth({
                            year: Number(year),
                            month: Number(month),
                          });
                          e.target.value = "";
                        }
                      }}
                    >
                      {yearMonths
                        .filter(
                          (yearMonth) =>
                            !comparisonYearMonths.some(
                              (ym) =>
                                ym.year === yearMonth.year &&
                                ym.month === yearMonth.month,
                            ),
                        )
                        .map((yearMonth) => (
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
                  {comparisonYearMonths.length > 0 && (
                    <Flex gap="2" wrap="wrap">
                      {comparisonYearMonths.map((yearMonth) => (
                        <Badge
                          key={`${yearMonth.year}-${yearMonth.month}`}
                          variant="solid"
                          colorPalette="green"
                          py="1"
                          px="2"
                          cursor="pointer"
                          onClick={() =>
                            handleRemoveComparisonYearMonth(yearMonth)
                          }
                        >
                          {yearMonth.year}年{yearMonth.month}月
                          <LuX size="0.8rem" style={{ marginLeft: "4px" }} />
                        </Badge>
                      ))}
                    </Flex>
                  )}
                </Stack>
              )}
            </Stack>
          )}
          {viewMode === "single" && selectedYearMonth && (
            <>
              <Stack>
                <Heading size="lg">WordCloud</Heading>
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
          {viewMode === "comparison" && comparisonYearMonths.length > 0 && (
            <ScrollArea.Root maxW="breakpoint-lg">
              <ScrollArea.Viewport>
                <HStack gap={6} p="2" alignItems="flex-start">
                  {comparisonYearMonths.map((yearMonth) => (
                    <Flex
                      gap={4}
                      direction="column"
                      key={`comparison-${yearMonth.year}-${yearMonth.month}`}
                      width={"300px"}
                      flexShrink={0}
                    >
                      <Stack>
                        <Heading size="lg">WordCloud</Heading>
                        <WordCloudContainer yearMonth={yearMonth} />
                      </Stack>
                      <Stack>
                        <Heading size="lg">ヒートマップ</Heading>
                        <HeatmapContainer yearMonth={yearMonth} />
                      </Stack>
                      <Stack>
                        <Heading size="lg">タイムライン</Heading>
                        <TimelineContainer yearMonth={yearMonth} />
                      </Stack>
                      <Stack>
                        <Heading size="lg">検索地図</Heading>
                        <SearchMapContainer yearMonth={yearMonth} />
                      </Stack>
                    </Flex>
                  ))}
                </HStack>
              </ScrollArea.Viewport>
            </ScrollArea.Root>
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
