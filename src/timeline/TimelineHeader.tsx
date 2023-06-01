import { DEFAULT_COLUMN_WIDTH, DEFAULT_DAY_LENGTH } from "utility/Constants";

import { DateTime } from "luxon";
import React from "react";
import { ScrollSyncPane } from "react-scroll-sync";
import TableDividerCell from "./TableDividerCell";
import { getTimeSpan } from "utility/DateManagement";
import { useTableComponents } from "utility/TableComponentsContext";
import { useTimelineContext } from "utility/TimelineContext";

const TimelineHeader = () => {
  const {
    Table,
    tableProps,
    tableRowProps,
    TableRow,
    TableHeaderCell,
    tableHeaderCellProps,
    TableHead,
    tableHeadProps,
    TableBody,
    tableBodyProps
  } = useTableComponents();

  const { start, end, title, timelineWidth } = useTimelineContext();

  const startCrossesDayBoundary = start.day !== end.day && start.day < end.day;

  const spannedDays = React.useMemo(() => {
    const betweenDates = start
      .until(end)
      .splitBy({ days: 1 })
      .map((item) => item.start);
    // Until does not include the end date, so we need to add it back in
    return [...betweenDates, end];
  }, [start, end]);

  const timeSpan = React.useMemo(() => getTimeSpan(start, end), [start, end]);
  // The columns are double the time span when time span is in hours, because we want to show half hour increments
  const columnSegments = timeSpan * 2;

  const getHourName = (hour: number): string => {
    // Given an offset from the start, return the hour in localized format
    const hourOffset = start.plus({ hours: hour });
    // We want the format to be in hour, then AM/PM
    return hourOffset.toLocaleString({
      hour: "numeric",
      hour12: true
    });
  };

  /**
   * This method will check the day, and if it is the first day in the graph, it will calculate the width
   * by subtracting the total hours from the start of the day, to the end of that specific day.
   * The rest of the days will be calculated by the total hours in a day, which is 24 * 2 = 48, since
   * columns are in half hour increments.
   * @param day spanned day
   */
  const calculateDayWidth = (day: DateTime): number => {
    if (day.day === start.day) {
      // Calculate the hours, including the minutes between the start and the end of the day, and return the number of columns
      const dayDiff = day.endOf("day").diff(start, "hours").hours * 2;
      return Math.ceil(dayDiff);
    }
    // We also need to check if the day is the last day in the span, and if it is, we need to calculate the width, based off when the graph ends
    if (day.day === end.day) {
      // Calculate the hours, including the minutes between the start and the end of the day, and return the number of columns
      const dayDiff = end.diff(day.startOf("day"), "hours").hours * 2;
      return Math.ceil(dayDiff);
    }

    return DEFAULT_DAY_LENGTH;
  };

  return (
    <TableRow role="presentation" {...tableRowProps}>
      <TableHeaderCell
        role="presentation"
        css={{
          position: "relative",
          padding: 0,
          boxSizing: "border-box",
          border: "1px solid #ddd"
        }}
        {...tableHeaderCellProps}
      >
        <div
          css={{
            direction: "ltr",
            overflow: "hidden",
            position: "relative"
          }}
        >
          <div
            css={{
              overflow: "hidden",
              position: "relative"
            }}
          >
            <Table
              role="presentation"
              // TODO: This is responsive
              css={{
                height: "1px",
                tableLayout: "fixed",
                borderCollapse: "collapse",
                width: "100%"
              }}
              {...tableProps}
            >
              <colgroup>
                <col />
              </colgroup>
              <TableHead role="presentation" {...tableHeadProps}>
                <TableRow role="row" {...tableRowProps}>
                  <TableHeaderCell
                    role="columnheader"
                    {...tableHeaderCellProps}
                  >
                    {/* Title Cell */}
                    <div
                      css={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%"
                      }}
                    >
                      {title ?? ""}
                    </div>
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
            </Table>
          </div>
        </div>
      </TableHeaderCell>
      <TableDividerCell />
      <TableHeaderCell
        role="presentation"
        css={{
          padding: 0,
          boxSizing: "border-box",
          border: "1px solid #ddd"
        }}
        {...tableHeaderCellProps}
      >
        <ScrollSyncPane group="horizontal">
          <div
            css={{
              overflow: "scroll",
              // Make the box take up the full height of the parent
              height: "100%"
            }}
          >
            <Table
              aria-hidden="true"
              {...tableProps}
              // May not be needed now
              css={{ minWidth: timelineWidth, borderCollapse: "collapse" }}
            >
              <colgroup>
                {/* Create the column segments */}
                {Array.from(Array(columnSegments).keys()).map((i) => (
                  <col
                    css={{
                      minWidth: DEFAULT_COLUMN_WIDTH
                    }}
                    key={i + "col"}
                  />
                ))}
              </colgroup>
              <TableBody {...tableBodyProps}>
                {/* If the time span crosses to another day, display the days of the week header */}
                {startCrossesDayBoundary && (
                  <>
                    <TableRow role="row">
                      {spannedDays.map(
                        (day) =>
                          day && (
                            <TableHeaderCell
                              // Col span 48 is to span an entire day, however what if the graph time span starts at 1pm? We need to check the start time and adjust the col span accordingly, per item
                              // We can take the day start time, then calculate how many hours are left in the day, then multiply by 2 to get the number of col spans
                              colSpan={calculateDayWidth(day) /* 48 */}
                              css={{
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "1.2em",
                                boxSizing: "border-box",
                                borderRight: "none",
                                border: "1px solid #ddd"
                              }}
                              key={
                                day.toMillis() + "day" /* Unique key per day */
                              }
                              {...tableHeaderCellProps}
                            >
                              {/* Format: Day name then day number / month
                               */}
                              {day.toLocaleString(
                                DateTime.DATE_MED_WITH_WEEKDAY
                              )}
                            </TableHeaderCell>
                          )
                      )}
                    </TableRow>
                  </>
                )}

                <TableRow role="row">
                  {/* Each cell will span 2 cols, so that we can have each col represent 30-minute increments */}
                  {[...Array(timeSpan).keys()].map((i) => (
                    <TableHeaderCell
                      key={i}
                      colSpan={2}
                      css={{
                        padding: 0,
                        boxSizing: "border-box",
                        borderCollapse: "collapse",
                        width: DEFAULT_COLUMN_WIDTH * 2,
                        overflow: "hidden"
                      }}
                      {...tableHeaderCellProps}
                    >
                      <div
                        css={{
                          width: DEFAULT_COLUMN_WIDTH * 2,
                          height: 40,
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          boxSizing: "border-box",
                          overflow: "hidden",
                          borderCollapse: "collapse",
                          borderRight: "1px solid #ddd"
                        }}
                      >
                        {getHourName(i)}
                      </div>
                    </TableHeaderCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </ScrollSyncPane>
      </TableHeaderCell>
    </TableRow>
  );
};

export default TimelineHeader;
