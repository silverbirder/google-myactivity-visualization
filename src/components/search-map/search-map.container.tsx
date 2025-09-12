"use client";

import dynamic from "next/dynamic";
import { useSearchMap } from "./search-map.hook";
import type { YearMonth } from "@/types";
import { Spinner } from "@chakra-ui/react";
import { NotFoundEmptyState } from "..";

const Map = dynamic(() => import("./search-map.component"), { ssr: false });

type Props = {
  yearMonth: YearMonth;
};

export const SearchMapContainer = ({ yearMonth }: Props) => {
  const { year, month } = yearMonth;
  const { points, loading } = useSearchMap(year, month);
  if (loading) return <Spinner />;
  if (points.length === 0) return <NotFoundEmptyState />;
  return <Map points={points} />;
};
