import React from "react";
import { TimelineEvent } from "./types";
import TimelineEventRenderer from "./TimelineEventRenderer";
import { isValidKey } from "utility/TypeValidation";
import { useRelatedResourceId } from "hooks/useRelatedResourceId";
import { useResourceId } from "hooks/useResourceId";
import { useTableComponents } from "utility/TableComponentsContext";
import { useTimelineContext } from "utility/TimelineContext";

type Props = {
  columnSegments: number;
};

const TimelineEventTable = ({ columnSegments }: Props) => {
  const { Table, tableProps, TableBody, tableBodyProps } = useTableComponents();

  const { resources, timelineEvents, timelineWidth } = useTimelineContext();

  /**
   * Gets the resource id for a given resource
   */
  const getResourceIdKeyFromResource = useResourceId();

  /**
   * Gets the resource id for a given timelineEvent
   */
  const getResourceIdFromEvent = useRelatedResourceId();

  // Get the timeline items for a given resource
  const timelineMap = React.useMemo(() => {
    const map = new Map<string | number, TimelineEvent[]>();
    // Default to resourceId if it is not provided
    timelineEvents.forEach((item) => {
      // If resourceId is a function, call it with the item, the result needs to be a string | number
      const resourceIdValue = getResourceIdFromEvent(item);
      if (resourceIdValue === undefined || !isValidKey(resourceIdValue)) {
        return;
      }

      const items = map.get(resourceIdValue) ?? [];
      items.push(item);
      map.set(resourceIdValue, items);
    });
    return map;
  }, [getResourceIdFromEvent, timelineEvents]);

  return (
    <Table
      aria-hidden="true"
      css={{
        zIndex: 2,
        width: timelineWidth,
        overflow: "hidden",
        borderCollapse: "collapse",
      }}
      {...tableProps}
    >
      <TableBody
        {...tableBodyProps}
        css={{
          height: "100%",
          width: "100%"
        }}
      >
        {
          //Match the items, so in this case there are 26 items
          resources.map((i) => {
            const resourceId = getResourceIdKeyFromResource(i);
            if (resourceId === undefined || !isValidKey(resourceId)) {
              return null;
            }
            return (
              <TimelineEventRenderer
                key={resourceId}
                columnSegments={columnSegments}
                eventMap={timelineMap}
                resourceId={resourceId}
              />
            );
          })
        }
      </TableBody>
    </Table>
  );
};

export default TimelineEventTable;
