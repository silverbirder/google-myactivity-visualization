"use client";

import { useState } from "react";
import {
  Box,
  Card,
  Heading,
  HStack,
  Button,
  Table,
  Text,
  Icon,
  Stack,
} from "@chakra-ui/react";
import { Chart, useChart } from "@chakra-ui/charts";
import {
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LuTable, LuTrendingUp } from "react-icons/lu";
import type { YearProductStatsTable } from "./year-product-stats.hook";
import { convertTableToChartData } from "./year-product-stats.hook";

type ViewMode = "table" | "chart";

type Props = {
  tableData: YearProductStatsTable;
};

export const YearProductStatsComponent = ({ tableData }: Props) => {
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const { chartData, series } = convertTableToChartData(tableData);

  const chart = useChart({
    data: chartData,
    series,
  });

  const TableView = () => (
    <Table.ScrollArea
      width="100%"
      maxW={{
        base: "340px",
        sm: "breakpoint-sm",
        md: "breakpoint-md",
        lg: "breakpoint-lg",
      }}
      borderWidth="1px"
      borderRadius="md"
      height={400}
    >
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader width="60px">
              <Text fontSize="sm" fontWeight="bold">
                年\製品
              </Text>
            </Table.ColumnHeader>
            {tableData.products.map((product) => (
              <Table.ColumnHeader key={product}>
                <Text fontSize="sm" fontWeight="bold" truncate title={product}>
                  {product}
                </Text>
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tableData.years.map((year) => (
            <Table.Row key={year}>
              <Table.Cell
                fontWeight="bold"
                backgroundColor="bg.muted"
                width="60px"
              >
                <Text fontSize="sm" fontWeight="bold">
                  {year}
                </Text>
              </Table.Cell>
              {tableData.products.map((product) => {
                const count = tableData.data.get(`${year}-${product}`) ?? 0;
                return (
                  <Table.Cell key={product}>
                    <Text fontSize="sm">
                      {count > 0 ? count.toLocaleString() : "-"}
                    </Text>
                  </Table.Cell>
                );
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );

  const ChartView = () => (
    <Chart.Root
      chart={chart}
      maxW={{
        base: "340px",
        sm: "breakpoint-sm",
        md: "breakpoint-md",
        lg: "breakpoint-lg",
      }}
      height={400}
    >
      <LineChart data={chart.data}>
        <CartesianGrid
          stroke={chart.color("border.muted") as string}
          vertical={false}
        />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey={chart.key("year") as string}
          stroke={chart.color("border") as string}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          stroke={chart.color("border") as string}
          tickFormatter={
            chart.formatNumber({
              notation: "compact",
              maximumFractionDigits: 1,
            }) as (value: number) => string
          }
        />
        <Tooltip
          cursor={false}
          animationDuration={100}
          content={<Chart.Tooltip />}
        />
        <Legend content={<Chart.Legend interaction="click" />} />
        {chart.series.map((item) => (
          <Line
            key={item.name}
            isAnimationActive={false}
            dataKey={chart.key(item.name) as string}
            stroke={chart.color(item.color) as string}
            strokeWidth={3}
            fill={chart.color("bg") as string}
            opacity={chart.getSeriesOpacity(item.name as string)}
          />
        ))}
      </LineChart>
    </Chart.Root>
  );

  if (chartData.length === 0) {
    return (
      <Card.Root>
        <Card.Body>
          <Box textAlign="center" p={8}>
            <Heading size="md" color="gray.500">
              データがありません
            </Heading>
          </Box>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Stack gap={2}>
      <HStack gap={2} justifyContent="flex-end">
        <Button
          size="sm"
          variant={viewMode === "table" ? "solid" : "outline"}
          onClick={() => setViewMode("table")}
        >
          <Icon as={LuTable} />
          テーブル
        </Button>
        <Button
          size="sm"
          variant={viewMode === "chart" ? "solid" : "outline"}
          onClick={() => setViewMode("chart")}
        >
          <Icon as={LuTrendingUp} />
          チャート
        </Button>
      </HStack>
      {viewMode === "table" ? <TableView /> : <ChartView />}
    </Stack>
  );
};
