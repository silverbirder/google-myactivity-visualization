"use client";
import React from "react";
import { ActivityUploader, DuckDBViewer } from "@/components";
import { useActivityTable } from "@/hooks";

export default function Page() {
  const { handleFileUpload } = useActivityTable();
  return (
    <div>
      <h1>Google My Activity Visualization</h1>
      <ActivityUploader onUpload={handleFileUpload} />
      <DuckDBViewer defaultQuery={"SELECT * FROM activities LIMIT 10"} />
    </div>
  );
}
