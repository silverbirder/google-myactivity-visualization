"use client";

import {
  Box,
  Button,
  Dialog,
  HStack,
  Icon,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
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
    <VStack gap={4} alignItems="flex-start">
      <Text color="fg.muted">ブラウザにあるデータを削除します。</Text>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <HStack>
            <Button
              loading={isDeleting}
              backgroundColor="red.fg"
              variant="solid"
              gap={2}
            >
              <Icon>
                <LuTrash2 />
              </Icon>
              削除する
            </Button>
            {statusText && (
              <Box color="fg.muted" fontSize="sm">
                {statusText}
              </Box>
            )}
          </HStack>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>データ削除の確認</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>本当にデータを削除しますか？</Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">キャンセル</Button>
                </Dialog.ActionTrigger>
                <Dialog.ActionTrigger asChild>
                  <Button
                    onClick={onDeleteAll}
                    backgroundColor="red.fg"
                    variant="solid"
                    gap={2}
                  >
                    <Icon>
                      <LuTrash2 />
                    </Icon>
                    削除する
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </VStack>
  );
};
