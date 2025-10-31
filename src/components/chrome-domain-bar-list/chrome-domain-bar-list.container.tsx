"use client";

import { ChromeDomainBarList } from "./chrome-domain-bar-list.component";
import { useChromeDomainBarList } from "./chrome-domain-bar-list.hook";
import type { YearMonth } from "@/types";
import { Skeleton } from "@chakra-ui/react";
import { NotFoundEmptyState } from "@/components/not-found-empty-state";

type Props = {
  yearMonth: YearMonth;
};

export const ChromeDomainBarListContainer = ({ yearMonth }: Props) => {
  const { topDomains, isLoading, error } = useChromeDomainBarList(yearMonth);
  if (isLoading) return <Skeleton height="300px" width="100%" />;
  if (error || topDomains.length === 0)
    return <NotFoundEmptyState height="300px" width="100%" />;
  return <ChromeDomainBarList domains={topDomains} />;
};
