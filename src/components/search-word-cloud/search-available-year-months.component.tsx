"use client";

import type { YearMonth } from "@/types";
import { Box, Flex, Text, Badge, VStack, Collapsible } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { LuChevronDown } from "react-icons/lu";

type Props = {
  yearMonths: YearMonth[];
};

export const SearchAvailableYearMonthsComponent = ({ yearMonths }: Props) => {
  const formatMonth = useCallback((month: number) => {
    return `${month}月`;
  }, []);
  const groupedByYear = useMemo(() => {
    const groups: Record<number, number[]> = {};
    yearMonths.forEach(({ year, month }) => {
      groups[year] ??= [];
      groups[year].push(month);
    });
    const sortedGroups = Object.entries(groups)
      .map(([year, months]) => ({
        year: Number(year),
        months: months.sort((a, b) => a - b),
      }))
      .sort((a, b) => b.year - a.year);

    return sortedGroups;
  }, [yearMonths]);

  return (
    <Collapsible.Root>
      <Collapsible.Trigger asChild>
        <Flex
          align="center"
          justify="space-between"
          mb={2}
          cursor="pointer"
          p={2}
          borderRadius="md"
        >
          <Text fontSize="sm">検索データがある年月</Text>
          <LuChevronDown />
        </Flex>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <VStack gap={3} align="stretch">
          {groupedByYear.map(({ year, months }) => (
            <Box key={year}>
              <Text fontSize="sm" mb={1}>
                {year}年
              </Text>
              <Flex wrap="wrap" gap={1}>
                {months.map((month) => (
                  <Badge
                    key={`${year}-${month}`}
                    variant="outline"
                    borderRadius="sm"
                    fontSize="xs"
                  >
                    {formatMonth(month)}
                  </Badge>
                ))}
              </Flex>
            </Box>
          ))}
        </VStack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
