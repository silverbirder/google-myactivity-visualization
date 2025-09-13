"use client";

import {
  Box,
  Button,
  Stack,
  Textarea,
  Spinner,
  Table,
} from "@chakra-ui/react";

type Props = {
  query: string;
  setQuery: (query: string) => void;
  data: Record<string, unknown>[];
  isQuerying: boolean;
  queryError: string | null;
  isLoading: boolean;
  error: string | null;
  executeQuery: () => void;
};

export const ActivityViewerComponent = ({
  query,
  setQuery,
  data,
  isQuerying,
  queryError,
  isLoading,
  error,
  executeQuery,
}: Props) => {
  const borderColor = "gray.200";

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
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
          flex={1}
        />
        <Button onClick={executeQuery} loading={isQuerying || isLoading}>
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
