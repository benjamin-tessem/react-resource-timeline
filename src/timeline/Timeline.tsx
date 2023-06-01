import {
  ResourceConfig,
  TimelineConfig,
  TimelineProps,
  TimelineTableComponents
} from "./types";

import { DEFAULT_CAL_WIDTH } from "utility/Constants";
import ResourceCells from "./ResourceCells";
import { ScrollSync } from "react-scroll-sync";
import { TableComponentsContext } from "utility/TableComponentsContext";
import TableDividerCell from "./TableDividerCell";
import { TimelineContext } from "utility/TimelineContext";
import TimelineHeader from "./TimelineHeader";
import TimelineItemsContainer from "./TimelineItemsContainer";
import { getDateTime } from "utility/DateManagement";

const Timeline = <
  T extends TimelineTableComponents = "table",
  H extends TimelineTableComponents = "thead",
  TR extends TimelineTableComponents = "tr",
  TH extends TimelineTableComponents = "th",
  TD extends TimelineTableComponents = "td",
  TB extends TimelineTableComponents = "tbody",
  TimelineResources extends Record<string, unknown> = Record<string, unknown>,
  TimelineEvents extends Record<string, unknown> = Record<string, unknown>
>({
  resources,
  resourceConfig,
  timelineEvents,
  timelineConfig,
  start,
  end,
  title,
  tableComponent,
  tableProps,
  tableCellComponent,
  tableCellProps,
  tableHeadComponent,
  tableHeadProps,
  tableHeaderCellComponent,
  tableHeaderCellProps,
  tableRowComponent,
  tableRowProps,
  tableBodyComponent,
  tableBodyProps
}: TimelineProps<T, H, TR, TH, TD, TB, TimelineResources, TimelineEvents>) => {
  const startDateTime = getDateTime(true, start);
  const endDateTime = getDateTime(false, end);

  const totalMinuteSpan = endDateTime.diff(startDateTime, "minutes").minutes;

  const Table = tableComponent || "table";
  const TableCell = tableCellComponent || "td";
  const TableHead = tableHeadComponent || "thead";
  const TableHeaderCell = tableHeaderCellComponent || "th";
  const TableRow = tableRowComponent || "tr";
  const TableBody = tableBodyComponent || "tbody";

  return (
    <TableComponentsContext.Provider
      value={{
        Table,
        TableCell,
        TableHead,
        TableHeaderCell,
        TableRow,
        TableBody,

        // All the props
        tableProps,
        tableCellProps,
        tableHeaderCellProps,
        tableHeadProps,
        tableRowProps,
        tableBodyProps
      }}
    >
      <TimelineContext.Provider
        value={{
          start: startDateTime,
          end: endDateTime,
          resources: resources ?? [],
          resourceConfig: resourceConfig as ResourceConfig<
            Record<string, unknown>
          >,
          // Only show events if there is a span of time
          timelineEvents: totalMinuteSpan > 0 ? timelineEvents ?? [] : [],
          timelineConfig: timelineConfig as TimelineConfig<
            Record<string, unknown>
          >,
          title,
          // We don't want any negative widths
          timelineWidth:
            totalMinuteSpan > 0 ? totalMinuteSpan : DEFAULT_CAL_WIDTH
        }}
      >
        <div
          css={{
            height: "100%",
            width: "100%"
            // boxSizing: "border-box",
            // position: "relative"
          }}
          id="timeline-container"
        >
          <ScrollSync>
            <div
              css={{
                bottom: 0,
                left: 0,
                position: "absolute",
                right: 0,
                top: 0
              }}
            >
              {/*
                We want to make the first column, of resources, and the times sticky, and scrollable
              */}
              <Table
                role="grid"
                css={{
                  height: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                  width: "100%",
                  boxSizing: "border-box"
                }}
                {...tableProps}
              >
                <colgroup>
                  <col
                    css={{
                      width: "15%"
                    }}
                  />
                  <col />
                  <col />
                </colgroup>
                <TableBody role="rowgroup" {...tableBodyProps}>
                  <TimelineHeader />
                  <TableRow role="presentation" {...tableRowProps}>
                    <ResourceCells />
                    <TableDividerCell />
                    <TimelineItemsContainer />
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </ScrollSync>
        </div>
      </TimelineContext.Provider>
    </TableComponentsContext.Provider>
  );
};

export default Timeline;
