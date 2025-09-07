"use client";

import { useEffect } from "react";
import { useSearchWordCloud } from "./search-word-cloud.hook";
import { WordCloud } from "./word-cloud";
import { Skeleton } from "@chakra-ui/react";

export const SearchWordCloud = () => {
  const { words, loading, fetchWords } = useSearchWordCloud();

  useEffect(() => {
    void fetchWords();
  }, [fetchWords]);

  return (
    <div>
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
