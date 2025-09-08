"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Box, Stack, NativeSelect } from "@chakra-ui/react";
import { useSearchMap } from "./search-map.hook";
import type { Activity } from "@/types";
import { useDuckDBContext } from "@/contexts";

const Map = dynamic(() => import("./search-map.leaflet"), { ssr: false });

export const SearchMap = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const years = Array.from({ length: 6 }, (_, i) => 2020 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const [activities, setActivities] = useState<Activity[]>([]);
  const { runQuery, isLoading: isDuckLoading } = useDuckDBContext();

  useEffect(() => {
    if (isDuckLoading) return;
    const sql = `SELECT time, locationInfos FROM activities WHERE strftime('%Y', CAST(time AS TIMESTAMP)) = '${year}' AND strftime('%m', CAST(time AS TIMESTAMP)) = '${String(month).padStart(2, "0")}'`;
    void runQuery(sql)
      .then((rows: unknown[]) => {
        setActivities(rows as Activity[]);
      })
      .catch(() => setActivities([]));
  }, [year, month, runQuery, isDuckLoading]);

  const points = useSearchMap(activities, year, month);
  console.log({ points });
  return (
    <Stack>
      <Stack direction="row" gap={2} alignItems="center">
        <NativeSelect.Root size="sm" width="auto">
          <NativeSelect.Field
            value={String(year)}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setYear(Number(e.target.value))
            }
          >
            {years.map((y: number) => (
              <option key={y} value={y}>
                {y}年
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        <NativeSelect.Root size="sm" width="auto">
          <NativeSelect.Field
            value={String(month)}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setMonth(Number(e.target.value))
            }
          >
            {months.map((m: number) => (
              <option key={m} value={m}>
                {m}月
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Stack>
      <Box h="400px" w="100%">
        <Map points={points} />
      </Box>
    </Stack>
  );
};
