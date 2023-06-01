import React from "react";
import { ScrollSyncPane } from "react-scroll-sync";
import TimelineBackground from "./TimelineBackground";
import TimelineEventTable from "./TimelineEventTable";
import { getTimeSpan } from "utility/DateManagement";
import { useTableComponents } from "utility/TableComponentsContext";
import { useTimelineContext } from "utility/TimelineContext";

const TimelineItemsContainer = () => {
  const { TableCell } = useTableComponents();

  const { start, end, timelineWidth } = useTimelineContext();

  const timeSpan = React.useMemo(() => getTimeSpan(start, end), [start, end]);
  const columnSegments = timeSpan * 2;

  return (
    <TableCell
      role="presentation"
      id={"timeline-items"}
      css={{
        height: "100%",
        padding: 0,
        boxSizing: "border-box",
        border: "1px solid #ddd"
      }}
    >
      <div
        css={{
          overflow: "hidden",
          position: "relative",
          height: "100%",
          direction: "ltr",
          boxSizing: "border-box"
        }}
      >
        <ScrollSyncPane group={["horizontal", "vertical"]}>
          <div
            css={{
              overflow: "scroll",
              position: "absolute",
              height: "100%",
              inset: 0,
              boxSizing: "border-box"
            }}
          >
            <div
              css={{
                minWidth: timelineWidth,
                position: "relative",
                zIndex: 1,
                minHeight: "100%",
                boxSizing: "border-box"
              }}
            >
              <TimelineBackground columnSegments={columnSegments} />
              <TimelineEventTable columnSegments={columnSegments} />
            </div>
          </div>
        </ScrollSyncPane>
      </div>
    </TableCell>
  );
};
export default TimelineItemsContainer;
