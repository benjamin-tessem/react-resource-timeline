import { DEFAULT_CELL_HEIGHT, DEFAULT_COLUMN_WIDTH } from "utility/Constants";

import { useTableComponents } from "utility/TableComponentsContext";
import { useTimelineContext } from "utility/TimelineContext";

type Props = {
  columnSegments: number;
};
const TimelineBackground = ({ columnSegments }: Props) => {
  // The columns are double the time span when time span is in hours, because we want to show half hour increments
  const { timelineWidth } = useTimelineContext();

  const {
    TableCell,
    tableCellProps,
    Table,
    tableProps,
    TableBody,
    tableBodyProps,
    tableRowProps,
    TableRow
  } = useTableComponents();

  return (
    <div
      css={{
        bottom: 0,
        top: 0,
        position: "absolute",
        boxSizing: "border-box"
      }}
    >
      <Table
        aria-hidden="true"
        css={{
          // // TODO: Determine if needed
          minWidth: timelineWidth,
          height: "100%",
          tableLayout: "fixed",
          borderCollapse: "collapse"
        }}
        {...tableProps}
      >
        <colgroup>
          {Array.from(Array(columnSegments).keys()).map((i) => (
            <col
              css={{
                width: DEFAULT_COLUMN_WIDTH
              }}
              key={i}
            />
          ))}
        </colgroup>
        {/* This Table has the background separators */}
        <TableBody {...tableBodyProps}>
          <TableRow {...tableRowProps}>
            {
              // This is in 30 minute increments, so in this case 48 rather than 24
              // When we are passing props, we need to double whatever whole hour we pass in, if it is half an hour for some reason,
              // we need to add 1 to the hour
              Array.from(Array(columnSegments).keys()).map((i) => (
                <TableCell
                  key={i}
                  css={{
                    position: "relative",
                    border: i % 2 === 0 ? "1px solid #ddd" : "1px dotted #ddd",
                    borderRight: "none",
                    padding: 0,
                    height: DEFAULT_CELL_HEIGHT,
                    boxSizing: "border-box"
                    // width: DEFAULT_COLUMN_WIDTH * 2
                  }}
                  {...tableCellProps}
                ></TableCell>
              ))
            }
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default TimelineBackground;
