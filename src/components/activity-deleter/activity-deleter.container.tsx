"use client";

import { useActivityDeleter } from "./activity-deleter.hook";
import { ActivityDeleterComponent } from "./activity-deleter.component";

export const ActivityDeleterContainer = () => {
  const { handleDeleteAll, isDeleting, statusText } = useActivityDeleter();

  return (
    <ActivityDeleterComponent
      onDeleteAll={handleDeleteAll}
      isDeleting={isDeleting}
      statusText={statusText}
    />
  );
};
