"use client";

import { ActivityUploader, DuckDBViewer, SearchWordCloud } from "@/components";

export default function Page() {
  return (
    <div>
      <h1>Google My Activity Visualization</h1>
      <ActivityUploader />
      <DuckDBViewer defaultQuery={"SELECT * FROM activities LIMIT 10;"} />
      <SearchWordCloud />
    </div>
  );
}
