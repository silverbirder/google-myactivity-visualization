"use client";

import {
  Box,
  Button,
  Stack,
  Textarea,
  Spinner,
  Table,
  Text,
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
        borderWidth={1}
        borderRadius="md"
        borderColor={borderColor}
        mt={2}
        maxW="breakpoint-lg"
        width="100%"
      >
        {data.length > 0 ? (
          <Table.ScrollArea width="100%" height={400}>
            <Table.Root size="sm" variant="outline">
              <Table.Header>
                <Table.Row>
                  {Object.keys(data[0] ?? {}).map((key) => (
                    <Table.ColumnHeader key={key}>
                      <Text fontSize="sm" fontWeight="bold">
                        {key}
                      </Text>
                    </Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.map((row, i) => (
                  <Table.Row key={i}>
                    {Object.entries(row).map(([key, value]) => (
                      <Table.Cell key={key}>
                        <Text fontSize="sm">{value as string}</Text>
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        ) : (
          <Box p={4} width="100%" textAlign="center" color="gray.500">
            データがありません
          </Box>
        )}
      </Box>
    </Box>
  );
};
