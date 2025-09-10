"use client";

import dynamic from "next/dynamic";
import { useSearchMap } from "./search-map.hook";
import type { YearMonth } from "@/types";

const Map = dynamic(() => import("./search-map.component"), { ssr: false });

type Props = {
  yearMonth: YearMonth;
};

export const SearchMapContainer = ({ yearMonth }: Props) => {
  const { year, month } = yearMonth;
  const { points, loading } = useSearchMap(year, month);
  if (loading) return <div>読み込み中です</div>;
  if (points.length === 0) return <div>結果が見つかりませんでした</div>;
  return <Map points={points} />;
};
