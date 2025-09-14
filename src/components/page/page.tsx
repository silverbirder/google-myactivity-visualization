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
import { ToggleTip } from "@/components/ui";
import {
  LuChartColumn,
  LuDatabase,
  LuUpload,
  LuTrash2,
  LuEye,
  LuArrowLeftRight,
  LuInfo,
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
      <Container
        width="100%"
        maxW={{
          base: "340px",
          sm: "breakpoint-sm",
          md: "breakpoint-md",
          lg: "breakpoint-lg",
        }}
        py="8"
      >
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
    <Container
      width="100%"
      maxW={{
        base: "340px",
        sm: "breakpoint-sm",
        md: "breakpoint-md",
        lg: "breakpoint-lg",
      }}
      py="8"
    >
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
            <Flex
              justifyContent="space-between"
              alignItems="flex-start"
              wrap="wrap"
              gap="2"
            >
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
              <Flex gap="2" wrap="wrap">
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
              </Flex>
            </Flex>
          )}
          {viewMode === "single" && selectedYearMonth && (
            <>
              <Stack>
                <HStack>
                  <Heading size="lg">よく検索した言葉</Heading>
                  <ToggleTip content="Google検索から、検索クエリ（qパラメータ）を抽出しワードクラウドで可視化します。">
                    <Button size="xs" variant="ghost">
                      <LuInfo />
                    </Button>
                  </ToggleTip>
                </HStack>
                <WordCloudContainer yearMonth={selectedYearMonth} />
              </Stack>
              <Stack>
                <HStack>
                  <Heading size="lg">利用回数カレンダー</Heading>
                  <ToggleTip content="選択した製品の1日ごとの利用回数を集計しカレンダー表示します。">
                    <Button size="xs" variant="ghost">
                      <LuInfo />
                    </Button>
                  </ToggleTip>
                </HStack>
                <HeatmapContainer yearMonth={selectedYearMonth} />
              </Stack>
              <Stack>
                <HStack>
                  <Heading size="lg">1日の活動パターン</Heading>
                  <ToggleTip content="時間帯ごと・製品ごとの利用回数を集計し、1日の活動パターンを可視化します。">
                    <Button size="xs" variant="ghost">
                      <LuInfo />
                    </Button>
                  </ToggleTip>
                </HStack>
                <TimelineContainer yearMonth={selectedYearMonth} />
              </Stack>
              <Stack>
                <HStack>
                  <Heading size="lg">位置情報マップ</Heading>
                  <ToggleTip content="locationInfosが存在するアクティビティのみ抽出し、地図上に位置情報を表示します。">
                    <Button size="xs" variant="ghost">
                      <LuInfo />
                    </Button>
                  </ToggleTip>
                </HStack>
                <SearchMapContainer yearMonth={selectedYearMonth} />
              </Stack>
            </>
          )}
          {viewMode === "comparison" && comparisonYearMonths.length > 0 && (
            <ScrollArea.Root
              maxW={{
                base: "340px",
                sm: "breakpoint-sm",
                md: "breakpoint-md",
                lg: "breakpoint-lg",
              }}
            >
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
                        <HStack>
                          <Heading size="lg">よく検索した言葉</Heading>
                          <ToggleTip content="Google検索から、検索クエリ（qパラメータ）を抽出しワードクラウドで可視化します。">
                            <Button size="xs" variant="ghost">
                              <LuInfo />
                            </Button>
                          </ToggleTip>
                        </HStack>
                        <WordCloudContainer yearMonth={yearMonth} />
                      </Stack>
                      <Stack>
                        <HStack>
                          <Heading size="lg">利用回数カレンダー</Heading>
                          <ToggleTip content="選択した製品の1日ごとの利用回数を集計しカレンダー表示します。">
                            <Button size="xs" variant="ghost">
                              <LuInfo />
                            </Button>
                          </ToggleTip>
                        </HStack>
                        <HeatmapContainer yearMonth={yearMonth} />
                      </Stack>
                      <Stack>
                        <HStack>
                          <Heading size="lg">1日の活動パターン</Heading>
                          <ToggleTip content="時間帯ごと・製品ごとの利用回数を集計し、1日の活動パターンを可視化します。">
                            <Button size="xs" variant="ghost">
                              <LuInfo />
                            </Button>
                          </ToggleTip>
                        </HStack>
                        <TimelineContainer yearMonth={yearMonth} />
                      </Stack>
                      <Stack>
                        <HStack>
                          <Heading size="lg">位置情報マップ</Heading>
                          <ToggleTip content="locationInfosが存在するアクティビティのみ抽出し、地図上に位置情報を表示します。">
                            <Button size="xs" variant="ghost">
                              <LuInfo />
                            </Button>
                          </ToggleTip>
                        </HStack>
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
