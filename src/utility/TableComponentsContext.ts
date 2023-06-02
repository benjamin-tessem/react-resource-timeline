import { createContext, useContext } from "react";

import { TimelineComponents } from "timeline";

export const TableComponentsContext = createContext<TimelineComponents>({
  Table: "table",
  tableProps: {},
  TableHead: "thead",
  tableHeadProps: {},
  TableRow: "tr",
  tableRowProps: {},
  TableHeaderCell: "th",
  tableHeaderCellProps: {},
  TableCell: "td",
  tableCellProps: {},
  TableBody: "tbody",
  tableBodyProps: {}
});

export const useTableComponents = () => useContext(TableComponentsContext);
