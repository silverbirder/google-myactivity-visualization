"use client";

import { Box, Table, Text } from "@chakra-ui/react";
import type { YearProductStatsTable } from "./year-product-stats.hook";

type Props = {
  tableData: YearProductStatsTable;
};

export const YearProductStatsComponent = ({ tableData }: Props) => {
  return (
    <Box 
      overflowX="auto" 
      maxWidth="100%" 
      borderWidth={1} 
      borderRadius="md" 
      borderColor="gray.200"
    >
      <Table.Root 
        size="sm" 
        striped 
        tableLayout="fixed"
        width="100%"
        minWidth="600px"
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader
              bg="gray.50"
              position="sticky"
              left={0}
              zIndex={2}
              width="100px"
              minWidth="100px"
              maxWidth="100px"
            >
              <Text fontSize="sm" fontWeight="bold">
                年 \ 製品
              </Text>
            </Table.ColumnHeader>
            {tableData.products.map((product) => (
              <Table.ColumnHeader
                key={product}
                width={`${Math.max(120, 800 / tableData.products.length)}px`}
                minWidth="80px"
                maxWidth="150px"
              >
                <Text 
                  fontSize="sm" 
                  fontWeight="bold"
                  truncate
                  title={product}
                >
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
                bg="gray.50" 
                fontWeight="bold" 
                position="sticky" 
                left={0} 
                zIndex={1}
                width="100px"
                minWidth="100px"
                maxWidth="100px"
              >
                <Text fontSize="sm" fontWeight="bold">
                  {year}
                </Text>
              </Table.Cell>
              {tableData.products.map((product) => {
                const count = tableData.data.get(`${year}-${product}`) ?? 0;
                return (
                  <Table.Cell 
                    key={product} 
                    textAlign="center"
                    width={`${Math.max(120, 800 / tableData.products.length)}px`}
                    minWidth="80px"
                    maxWidth="150px"
                  >
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
    </Box>
  );
};
