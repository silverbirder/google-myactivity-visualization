"use client";
import React from "react";
import { useActivityViewer } from "./activity-viewer.hook";
import {
  Box,
  Button,
  Heading,
  Stack,
  Textarea,
  Spinner,
  Table,
} from "@chakra-ui/react";

export const ActivityViewer = () => {
  const {
    query,
    setQuery,
    data,
    isQuerying,
    queryError,
    isLoading,
    error,
    executeQuery,
  } = useActivityViewer();
  const borderColor = "gray.200";

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="md"
      borderColor={borderColor}
      bg="white"
    >
      <Heading as="h3" size="md" mb={4}>
        Activity SQL Viewer
      </Heading>
      <Stack
        direction={{ base: "column", md: "row" }}
        gap={4}
        mb={4}
        alignItems="flex-start"
      >
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={4}
          fontFamily="mono"
          flex={1}
        />
        <Button
          onClick={executeQuery}
          loading={isQuerying || isLoading}
          colorScheme="blue"
          minWidth={24}
        >
          実行
        </Button>
      </Stack>
      {(isLoading || isQuerying) && (
        <Stack direction="row" alignItems="center" mb={2}>
          <Spinner size="sm" /> <span>Loading...</span>
        </Stack>
      )}
      {(error ?? queryError) && (
        <Box mb={2} color="red.500">
          {error ?? queryError}
        </Box>
      )}
      <Box
        maxH="400px"
        overflowY="auto"
        overflowX="auto"
        borderWidth={1}
        borderRadius="md"
        borderColor={borderColor}
        mt={2}
        maxW="600px"
      >
        <Box>
          {data.length > 0 ? (
            <Table.Root size="sm" striped>
              <Table.Header>
                <Table.Row>
                  {Object.keys(data[0] ?? {}).map((key) => (
                    <Table.ColumnHeader key={key}>{key}</Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.map((row, i) => (
                  <Table.Row key={i}>
                    {Object.entries(row).map(([key, value]) => (
                      <Table.Cell key={key}>{value as string}</Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          ) : (
            <Box p={4} textAlign="center" color="gray.500">
              データがありません
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
