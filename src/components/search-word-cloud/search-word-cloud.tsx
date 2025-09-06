"use client";

import { useEffect } from "react";
import { useSearchWordCloud } from "./search-word-cloud.hook";
import { WordCloud } from "./word-cloud";

export const SearchWordCloud: React.FC = () => {
  const { words, loading, error, fetchWords } = useSearchWordCloud();

  useEffect(() => {
    void fetchWords();
  }, [fetchWords]);

  return (
    <div>
      <h2>Google検索ワードクラウド</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {words.length > 0 ? (
        <WordCloud words={words} width={600} height={400} />
      ) : (
        !loading && <div>データがありません</div>
      )}
    </div>
  );
};

export default SearchWordCloud;
