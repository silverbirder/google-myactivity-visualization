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
  YearMonthSelectorContainer,
} from "@/components";
import { usePage } from "./page.hook";
import {
  Center,
  Container,
  Heading,
  HStack,
  Stack,
  Button,
  Flex,
  ScrollArea,
  Skeleton,
} from "@chakra-ui/react";
import {
  LuChartColumn,
  LuDatabase,
  LuUpload,
  LuTrash2,
  LuEye,
  LuArrowLeftRight,
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

  if (isDuckDBLoading) {
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
              <Skeleton height="200px" />
            </Stack>
          </Stack>
        </Center>
      </Container>
    );
  }

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
          {isYearMonthsLoading && (
            <Stack gap="4">
              <Skeleton height="12" />
            </Stack>
          )}
          {!isYearMonthsLoading && yearMonths.length > 0 && (
            <HStack justifyContent="space-between" alignItems="flex-start">
              <Stack gap="4">
                <YearMonthSelectorContainer
                  yearMonths={yearMonths}
                  viewMode={viewMode}
                  selectedYearMonth={selectedYearMonth}
                  comparisonYearMonths={comparisonYearMonths}
                  onSelectedYearMonthChange={handleSelectedYearMonth}
                  onAddComparisonYearMonth={handleAddComparisonYearMonth}
                  onRemoveComparisonYearMonth={handleRemoveComparisonYearMonth}
                />
              </Stack>
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
                  <LuArrowLeftRight size="1rem" />
                  比較表示
                </Button>
              </HStack>
            </HStack>
          )}
          {viewMode === "single" && selectedYearMonth && (
            <>
              <Stack>
                <Heading size="lg">よく検索した言葉</Heading>
                <WordCloudContainer yearMonth={selectedYearMonth} />
              </Stack>
              <Stack>
                <Heading size="lg">利用回数カレンダー</Heading>
                <HeatmapContainer yearMonth={selectedYearMonth} />
              </Stack>
              <Stack>
                <Heading size="lg">1日の活動パターン</Heading>
                <TimelineContainer yearMonth={selectedYearMonth} />
              </Stack>
              <Stack>
                <Heading size="lg">位置情報マップ</Heading>
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
                        <Heading size="lg">よく検索した言葉</Heading>
                        <WordCloudContainer yearMonth={yearMonth} />
                      </Stack>
                      <Stack>
                        <Heading size="lg">利用回数カレンダー</Heading>
                        <HeatmapContainer yearMonth={yearMonth} />
                      </Stack>
                      <Stack>
                        <Heading size="lg">1日の活動パターン</Heading>
                        <TimelineContainer yearMonth={yearMonth} />
                      </Stack>
                      <Stack>
                        <Heading size="lg">位置情報マップ</Heading>
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
