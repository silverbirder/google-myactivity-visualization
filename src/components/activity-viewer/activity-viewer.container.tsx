"use client";

import { useActivityViewer } from "./activity-viewer.hook";
import { ActivityViewerComponent } from "./activity-viewer.component";

export const ActivityViewerContainer = () => {
  const {
    query,
    setQuery,
    data,
    isQuerying,
    queryError,
    isLoading,
    error,
    executeQuery,
  } = useActivityViewer();

  return (
    <ActivityViewerComponent
      query={query}
      setQuery={setQuery}
      data={data}
      isQuerying={isQuerying}
      queryError={queryError}
      isLoading={isLoading}
      error={error}
      executeQuery={executeQuery}
    />
  );
};
