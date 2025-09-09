"use client";

import { Grid, GridItem, Box, Text, NativeSelect } from "@chakra-ui/react";
import { type ChangeEvent } from "react";
import { useHeatmap } from "./heatmap.hook";

const DAYS = ["日", "月", "火", "水", "木", "金", "土"];

import type { YearMonth } from "@/types";

type Props = {
  yearMonth: YearMonth;
};

export const Heatmap = ({ yearMonth }: Props) => {
  const { year, month } = yearMonth;
  const {
    dayCountMap,
    getColor,
    calendarCells,
    productOptions,
    product,
    setProduct,
    loading,
  } = useHeatmap({
    year,
    month,
  });

  if (loading) return <div>読み込み中です</div>;
  if (calendarCells.length === 0) return <div>結果が見つかりませんでした</div>;

  return (
    <Box>
      <Box mb={2} display="flex" gap={2} alignItems="center">
        <NativeSelect.Root
          disabled={productOptions.length === 0}
          size="sm"
          width="auto"
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
          {product} ヒートマップ
        </Text>
      </Box>
      <Grid templateColumns="repeat(7, 1fr)" gap={1}>
        {DAYS.map((d) => (
          <Box key={d} textAlign="center" fontWeight="bold" color="gray.600">
            {d}
          </Box>
        ))}
        {calendarCells.map((day, i) => (
          <GridItem key={i}>
            {day ? (
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
            ) : (
              <Box height="40px" />
            )}
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};
