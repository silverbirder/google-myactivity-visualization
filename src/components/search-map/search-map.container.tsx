"use client";

import dynamic from "next/dynamic";
import { useSearchMap } from "./search-map.hook";
import type { YearMonth } from "@/types";
import { Skeleton } from "@chakra-ui/react";

const Map = dynamic(() => import("./search-map.component"), { ssr: false });

type Props = {
  yearMonth: YearMonth;
};

export const SearchMapContainer = ({ yearMonth }: Props) => {
  const { year, month } = yearMonth;
  const { points, loading, productOptions, product, setProduct } = useSearchMap(
    year,
    month,
  );

  if (loading) return <Skeleton height="444px" width="100%" />;

  return (
    <Map
      points={points}
      productOptions={productOptions}
      product={product}
      setProduct={setProduct}
    />
  );
};
