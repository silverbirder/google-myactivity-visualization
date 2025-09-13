"use client";

import { useActivityDeleter } from "./activity-deleter.hook";
import { ActivityDeleterComponent } from "./activity-deleter.component";

type Props = {
  onDeleteComplete?: () => void;
};

export const ActivityDeleterContainer = ({ onDeleteComplete }: Props) => {
  const { handleDeleteAll, isDeleting, statusText } = useActivityDeleter({
    onDeleteComplete,
  });

  return (
    <ActivityDeleterComponent
      onDeleteAll={handleDeleteAll}
      isDeleting={isDeleting}
      statusText={statusText}
    />
  );
};
