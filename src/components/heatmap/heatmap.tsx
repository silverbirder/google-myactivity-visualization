"use client";

import {
  Grid,
  GridItem,
  Box,
  Text,
  Skeleton,
  NativeSelect,
} from "@chakra-ui/react";
import { useState, type ChangeEvent } from "react";
import { useHeatmap } from "./heatmap.hook";

const DAYS = ["日", "月", "火", "水", "木", "金", "土"];

import { useEffect } from "react";
import { useDuckDBContext } from "@/contexts";
import selectProductsSql from "./select_products.sql";

export const Heatmap = () => {
  const now = new Date();
  const defaultYear =
    now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const defaultMonth = now.getMonth() === 0 ? 12 : now.getMonth();

  const [year, setYear] = useState<number>(defaultYear);
  const [month, setMonth] = useState<number>(defaultMonth);
  const [productOptions, setProductOptions] = useState<string[]>([]);
  const [product, setProduct] = useState<string>("");

  const { isLoading: isDuckLoading, runQuery } = useDuckDBContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await runQuery(selectProductsSql);
        const options = (result as { product: string }[]).map((r) => r.product);
        setProductOptions(options);
        if (options.length > 0) setProduct(options[0] ?? "");
      } catch {
        setProductOptions([]);
      }
    };
    if (isDuckLoading) return;
    void fetchProducts();
  }, [isDuckLoading, runQuery]);

  const { data, isLoading, error } = useHeatmap({ year, month, product });
  const dayCountMap = new Map<number, number>();
  data?.forEach(({ day, count }) => {
    dayCountMap.set(day, count);
  });
  const lastDay = new Date(year, month, 0).getDate();
  const firstDate = new Date(year, month - 1, 1);
  const firstDayOfWeek = firstDate.getDay();
  const calendarCells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= lastDay; d++) {
    calendarCells.push(d);
  }
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }
  if (calendarCells.length < 35) {
    while (calendarCells.length < 35) calendarCells.push(null);
  } else if (calendarCells.length > 35) {
    calendarCells.length = 35;
  }
  const getColor = (count?: number) => {
    if (!count) return "gray.100";
    if (count > 20) return "red.400";
    if (count > 10) return "orange.300";
    if (count > 5) return "yellow.200";
    return "green.100";
  };

  // 年の選択肢（直近5年）
  const yearOptions = Array.from(
    { length: 5 },
    (_, i) => now.getFullYear() - i,
  );
  // 月の選択肢
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Box>
      <Box mb={2} display="flex" gap={2} alignItems="center">
        <NativeSelect.Root size="sm" width="auto">
          <NativeSelect.Field
            value={String(year)}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setYear(Number(e.target.value))
            }
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}年
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        <NativeSelect.Root size="sm" width="auto">
          <NativeSelect.Field
            value={String(month)}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setMonth(Number(e.target.value))
            }
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m}月
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        <NativeSelect.Root
          size="sm"
          width="auto"
          disabled={productOptions.length === 0}
        >
          <NativeSelect.Field
            value={product}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setProduct(e.target.value)
            }
          >
            {productOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        <Text fontWeight="bold" ml={2}>
          {year}年{month}月 {product} ヒートマップ
        </Text>
      </Box>
      {error && <Text color="red.500">{error}</Text>}
      <Grid templateColumns="repeat(7, 1fr)" gap={1}>
        {DAYS.map((d) => (
          <Box key={d} textAlign="center" fontWeight="bold" color="gray.600">
            {d}
          </Box>
        ))}
        {calendarCells.map((day, i) => (
          <GridItem key={i}>
            {day ? (
              isLoading ? (
                <Skeleton height="40px" />
              ) : (
                <Box
                  height="40px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg={getColor(dayCountMap.get(day))}
                  borderRadius="md"
                  flexDirection="column"
                >
                  <Text fontSize="sm">{day}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {dayCountMap.get(day) ?? 0}
                  </Text>
                </Box>
              )
            ) : (
              <Box height="40px" />
            )}
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};
