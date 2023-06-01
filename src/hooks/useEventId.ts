import React from "react";
import { TimelineEvent } from "timeline";
import { useTimelineContext } from "utility/TimelineContext";

/**
 * Hook to get the event id from a timeline event
 * @returns A function that returns the event id
 */
export const useEventId = () => {
  const { timelineConfig } = useTimelineContext();

  const getEventId = React.useCallback(
    (event: TimelineEvent) => {
      const accessor = timelineConfig?.eventId ?? "id";
      // Get the resolved resourceId
      return typeof accessor === "function" ? accessor(event) : event[accessor];
    },
    [timelineConfig?.eventId]
  );

  return getEventId;
};
