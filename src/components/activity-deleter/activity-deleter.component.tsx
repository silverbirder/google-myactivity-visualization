"use client";

import { Box, Button, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";

type Props = {
  onDeleteAll?: () => void;
  isDeleting?: boolean;
  statusText?: string;
};

export const ActivityDeleterComponent = ({
  onDeleteAll,
  isDeleting = false,
  statusText = "",
}: Props) => {
  return (
    <VStack align="stretch" maxW="xl" gap={3}>
      <HStack>
        <Button
          onClick={onDeleteAll}
          loading={isDeleting}
          colorScheme="red"
          variant="solid"
          gap={2}
        >
          <Icon>
            <LuTrash2 />
          </Icon>
          全データ削除
        </Button>
        <Text color="fg.muted" fontSize="sm">
          取り消しはできません。
        </Text>
      </HStack>
      {statusText && (
        <Box color="fg.muted" fontSize="sm">
          {statusText}
        </Box>
      )}
    </VStack>
  );
};
