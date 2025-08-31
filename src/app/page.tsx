"use client";
import React from "react";
import { ActivityUploader } from "../components/ActivityUploader";
import { ActivityTable } from "../components/ActivityTable";
import { useActivityTable } from "../hooks/useActivityTable";

export default function Page() {
  const { activities, handleFileUpload } = useActivityTable();
  return (
    <div>
      <h1>Google My Activity Visualization</h1>
      <ActivityUploader onUpload={handleFileUpload} />
      <ActivityTable activities={activities} />
    </div>
  );
}
