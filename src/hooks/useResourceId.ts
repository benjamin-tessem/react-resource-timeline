import React from "react";
import { TimelineResource } from "timeline";
import { useTimelineContext } from "utility/TimelineContext";

/**
 * Hook to get the resource id from a timeline resource
 * @returns A function that returns the resource id
 */
export const useResourceId = () => {
  const { resourceConfig } = useTimelineContext();

  /**
   * Gets the resource id for a given resource
   */
  const getResourceIdKeyFromResource = React.useCallback(
    (resource: TimelineResource) => {
      const accessor = resourceConfig?.selector ?? "id";
      // Get the resolved resourceId
      return resource[accessor];
    },
    [resourceConfig?.selector]
  );

  return getResourceIdKeyFromResource;
};
