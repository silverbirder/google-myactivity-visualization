import React from "react";
import { Stack, Select, Portal, Span, Flex, Badge } from "@chakra-ui/react";
import { LuX } from "react-icons/lu";
import {
  useYearMonthSelector,
  type UseYearMonthSelectorProps,
} from "./year-month-selector.hook";

export interface Props extends UseYearMonthSelectorProps {
  viewMode: "single" | "comparison";
}

export const YearMonthSelector = (props: Props) => {
  const { viewMode, comparisonYearMonths = [] } = props;

  const {
    singleModeCollection,
    comparisonModeCollection,
    selectedValue,
    handleSingleModeChange,
    handleComparisonModeAdd,
    onRemoveComparisonYearMonth,
  } = useYearMonthSelector(props);

  if (viewMode === "single") {
    return (
      <Select.Root
        collection={singleModeCollection}
        size="sm"
        width="320px"
        value={selectedValue}
        onValueChange={(details) => {
          const value = details.value[0];
          if (value) {
            handleSingleModeChange(value);
          }
        }}
      >
        <Select.HiddenSelect />
        <Select.Label>年月を選択</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="年月を選択してください" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {singleModeCollection.items.map((item) => (
                <Select.Item item={item} key={item.value}>
                  <Stack gap="0">
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Span color="fg.muted" textStyle="xs">
                      {item.description}
                    </Span>
                  </Stack>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    );
  }

  return (
    <Stack gap="2">
      <Select.Root
        collection={comparisonModeCollection}
        size="sm"
        width="320px"
        onValueChange={(details) => {
          const value = details.value[0];
          if (value) {
            handleComparisonModeAdd(value);
          }
        }}
      >
        <Select.HiddenSelect />
        <Select.Label>年月を追加</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="年月を追加してください" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {comparisonModeCollection.items.map((item) => (
                <Select.Item item={item} key={item.value}>
                  <Stack gap="0">
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Span color="fg.muted" textStyle="xs">
                      {item.description}
                    </Span>
                  </Stack>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
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
              onClick={() => onRemoveComparisonYearMonth(yearMonth)}
            >
              {yearMonth.year}年{yearMonth.month}月
              <LuX size="0.8rem" style={{ marginLeft: "4px" }} />
            </Badge>
          ))}
        </Flex>
      )}
    </Stack>
  );
};
