"use client";
import React from "react";
import {
  ActivityUploader,
  ActivityTable,
  SaveParquetButton,
} from "@/components";
import { useActivityTable } from "@/hooks";

export default function Page() {
  const { activities, handleFileUpload, db } = useActivityTable();
  return (
    <div>
      <h1>Google My Activity Visualization</h1>
      <ActivityUploader onUpload={handleFileUpload} />
      <ActivityTable activities={activities} />
      <SaveParquetButton db={db} tableName="activities" />
    </div>
  );
}
