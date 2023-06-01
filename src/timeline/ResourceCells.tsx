import { DEFAULT_CELL_HEIGHT } from "utility/Constants";
import { ScrollSyncPane } from "react-scroll-sync";
import { useResourceId } from "hooks/useResourceId";
import { useTableComponents } from "utility/TableComponentsContext";
import { useTimelineContext } from "utility/TimelineContext";

const ResourceCells = () => {
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

  const { resources, resourceConfig } = useTimelineContext();

  const getResourceId = useResourceId();

  return (
    //  Allow replacing this
    <TableCell
      role="presentation"
      css={{
        height: "100%",
        padding: 0,
        boxSizing: "border-box",
        border: "1px solid #ddd"
      }}
      {...tableCellProps}
    >
      <div
        css={{
          height: "100%",
          direction: "ltr",
          position: "relative",
          boxSizing: "border-box"
        }}
      >
        <ScrollSyncPane group="vertical">
          <div
            css={{
              overflow: "scroll",
              bottom: 0,
              left: 0,
              right: 0,
              top: 0,
              position: "absolute"
            }}
          >
            {/* Allow replacing */}
            <Table
              role="presentation"
              css={{
                height: "1px",
                tableLayout: "fixed",
                width: "100%",
                borderCollapse: "collapse"
              }}
              {...tableProps}
            >
              <colgroup>
                <col />
              </colgroup>
              <TableBody
                role="presentation"
                css={{
                  boxSizing: "border-box"
                }}
                {...tableBodyProps}
              >
                {resources.map((i) => {
                  const resourceId = getResourceId(i);
                  if (resourceId === null || resourceId === undefined) {
                    return null;
                  }
                  return (
                    <TableRow
                      role="row"
                      // TODO fix this type shim
                      key={getResourceId(i) as string}
                      {...tableRowProps}
                    >
                      <TableCell
                        role="gridcell"
                        css={{
                          padding: 0,
                          height: DEFAULT_CELL_HEIGHT
                        }}
                        {...tableCellProps}
                      >
                        {/* Resource Cell */}
                        {resourceConfig?.renderResourceCell?.(i)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </ScrollSyncPane>
      </div>
    </TableCell>
  );
};

export default ResourceCells;
