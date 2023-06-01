import { DEFAULT_CELL_HEIGHT } from "utility/Constants";
import ScheduleBar from "./ScheduleBar";
import { TimelineEvent } from "./types";
import { useEventId } from "hooks/useEventId";
import { useTableComponents } from "utility/TableComponentsContext";

type Props = {
  columnSegments: number;
  eventMap: Map<string | number, TimelineEvent[]>;
  resourceId: string | number;
};

const TimelineEventRenderer = ({
  columnSegments,
  eventMap,
  resourceId
}: Props) => {
  const { TableCell, tableCellProps, tableRowProps, TableRow } =
    useTableComponents();

  const getEventId = useEventId();

  return (
    <TableRow {...tableRowProps}>
      <TableCell
        css={{
          position: "relative",
          // Make the row height just fill to the same size as the resources bar
          width: "100%",
          height: DEFAULT_CELL_HEIGHT,
          padding: 0,
          border: "1px solid #ddd"
        }}
        {...tableCellProps}
      >
        {eventMap.get(resourceId)?.map((item) => (
          <ScheduleBar
            // TODO: Resolve this type coercion
            key={getEventId(item) as string}
            event={item}
            columnSegments={columnSegments}
          />
        ))}
      </TableCell>
    </TableRow>
  );
};

export default TimelineEventRenderer;
