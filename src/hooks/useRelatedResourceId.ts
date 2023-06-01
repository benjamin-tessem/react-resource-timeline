import React from "react";
import { TimelineEvent } from "timeline";
import { useTimelineContext } from "utility/TimelineContext";

export const useRelatedResourceId = () => {
  const { timelineConfig } = useTimelineContext();

  const getResourceIdFromEvent = React.useCallback(
    (event: TimelineEvent) => {
      const accessor = timelineConfig?.resourceId ?? "resourceId";
      // Get the resolved resourceId
      return typeof accessor === "function" ? accessor(event) : event[accessor];
    },
    [timelineConfig?.resourceId]
  );

  return getResourceIdFromEvent;
};
