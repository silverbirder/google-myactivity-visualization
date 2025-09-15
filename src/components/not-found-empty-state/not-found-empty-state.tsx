import { EmptyState } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import type { ReactNode } from "react";

type Props = {
  title?: string;
  description?: string;
  iconSize?: number;
  children?: ReactNode;
} & React.ComponentProps<typeof EmptyState.Root>;

export const NotFoundEmptyState = ({
  title = "結果が見つかりませんでした",
  description = "条件を変えて再度お試しください",
  iconSize = 32,
  children,
  ...props
}: Props) => {
  return (
    <EmptyState.Root {...props}>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <LuSearch size={iconSize} />
        </EmptyState.Indicator>
        <EmptyState.Title>{title}</EmptyState.Title>
        <EmptyState.Description>{description}</EmptyState.Description>
        {children}
      </EmptyState.Content>
    </EmptyState.Root>
  );
};
