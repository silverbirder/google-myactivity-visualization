"use client";

import { useEffect, useState } from "react";
import { useSearchWordCloud } from "./search-word-cloud.hook";
import { useAvailableMonths } from "./search-word-cloud-months.hook";
import type { YearMonth } from "./search-word-cloud-months.hook";
import { WordCloud } from "./word-cloud";
import { Skeleton, Box } from "@chakra-ui/react";

export const SearchWordCloud = () => {
  const { words, loading, fetchWords } = useSearchWordCloud();
  const { months, loading: monthsLoading, fetchMonths } = useAvailableMonths();
  const [selected, setSelected] = useState<YearMonth | null>(null);
  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
    void fetchMonths();
  }, [fetchMonths]);

  useEffect(() => {
    if (isFirst && months.length > 0) {
      setIsFirst(false);
      const latest = months[months.length - 1];
      if (latest) {
        setSelected(latest);
        void fetchWords(latest);
      }
    }
  }, [months, fetchWords, isFirst]);

  const handleMonthChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;
    const [yearStr, monthStr] = value.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);
    if (Number.isNaN(year) || Number.isNaN(month)) return;
    setSelected({ year, month });
    await fetchWords({ year, month });
  };

  return (
    <div>
      <Box mb={4}>
        {monthsLoading ? (
          <Skeleton width="400px" height="40px" />
        ) : (
          <select
            value={selected ? `${selected.year}-${selected.month}` : ""}
            onChange={handleMonthChange}
            style={{
              width: "200px",
              height: "40px",
              fontSize: "16px",
              padding: "4px",
            }}
          >
            <option value="">年月を選択</option>
            {months.map(({ year, month }) => {
              const label = `${year}年${month}月`;
              const value = `${year}-${month}`;
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        )}
      </Box>
      {loading && <Skeleton width="600px" height="400px" />}
      {words.length > 0 ? (
        <WordCloud words={words} width={600} height={400} />
      ) : (
        !loading && <div>データがありません</div>
      )}
    </div>
  );
};

export default SearchWordCloud;
