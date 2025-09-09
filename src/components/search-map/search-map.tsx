"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Box } from "@chakra-ui/react";
import { useSearchMap } from "./search-map.hook";
import type { Activity, YearMonth } from "@/types";
import { useDuckDBContext } from "@/contexts";

const Map = dynamic(() => import("./search-map.leaflet"), { ssr: false });

type Props = {
  yearMonth: YearMonth;
};

export const SearchMap = ({ yearMonth }: Props) => {
  const { year, month } = yearMonth;
  const [activities, setActivities] = useState<Activity[]>([]);
  const { runQuery } = useDuckDBContext();

  useEffect(() => {
    const sql = `SELECT time, locationInfos FROM activities WHERE strftime('%Y', CAST(time AS TIMESTAMP)) = '${year}' AND strftime('%m', CAST(time AS TIMESTAMP)) = '${String(month).padStart(2, "0")}'`;
    void runQuery(sql)
      .then((rows: unknown[]) => {
        setActivities(rows as Activity[]);
      })
      .catch(() => setActivities([]));
  }, [year, month, runQuery]);

  const points = useSearchMap(activities, year, month);

  return (
    <Box h="400px" w="100%">
      <Map points={points} />
    </Box>
  );
};
