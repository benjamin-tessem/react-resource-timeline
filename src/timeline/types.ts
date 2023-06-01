import { DateTime } from "luxon";

export type TimelineTableComponents =
  | React.ElementType
  | keyof JSX.IntrinsicElements;

export type TimelineEvent = Record<string, unknown>;
export type TimelineResource = Record<string, unknown>;

/**
 * Configuration for the resource table, used to render resources and link them to events
 */
export type ResourceConfig<T> = {
  /**
   * Selector is used to uniquely identify the resource, defaults to id
   */
  selector?: keyof T;
  /**
   * Callback to render the resource cell,
   * @param item The resource item
   * @returns
   */
  renderResourceCell?: (item: T) => React.ReactNode;
};

/**
 * Configuration for the timeline, used to render events and link them to resources
 */
export type TimelineConfig<T> = {
  /**
   * resourceId is used to identify which resource the event belongs to.
   */
  resourceId?: keyof T | ((event: T) => string | number);

  /**
   * Event Id is used to identify the event.
   */
  eventId?: keyof T | ((event: T) => string | number);

  /**
   * Start is used to identify when the event is starting.
   */
  start: keyof T | ((event: T) => Date | string | DateTime);
  /**
   * End is used to identify when the event is ending.
   */
  end: keyof T | ((event: T) => Date | string | DateTime);

  /**
   * Optional callback to render the event
   * @param event The event associated with the timeline item
   * @returns Element to be rendered
   */

  renderEvent?: (event: T) => React.ReactNode;
  /**
   * Optional callback when event is clicked
   * @param item The event associated with the timeline item
   * @returns
   */
  onClick?: (item: T) => void;
};

export type TimelineComponents<
  T extends TimelineTableComponents = TimelineTableComponents,
  H extends TimelineTableComponents = TimelineTableComponents,
  TR extends TimelineTableComponents = TimelineTableComponents,
  TH extends TimelineTableComponents = TimelineTableComponents,
  TD extends TimelineTableComponents = TimelineTableComponents,
  TB extends TimelineTableComponents = TimelineTableComponents
> = {
  // Allow passing custom table components
  Table: T;
  tableProps?: T extends React.ComponentType
    ? React.ComponentPropsWithoutRef<T> & React.ComponentPropsWithRef<T>
    : never;

  // Allow passing custom table head components
  TableHead: H;
  tableHeadProps?: React.ComponentPropsWithoutRef<H>;

  // Allow passing custom table row components
  TableRow: TR;
  tableRowProps?: React.ComponentPropsWithoutRef<TR>;

  // Allow passing custom table header components
  TableHeaderCell: TH;
  tableHeaderCellProps?: React.ComponentPropsWithoutRef<TH>;

  // Allow passing custom table data components
  TableCell: TD;
  tableCellProps?: React.ComponentPropsWithoutRef<TD>;

  // Allow passing custom table body components
  TableBody: TB;
  tableBodyProps?: React.ComponentPropsWithoutRef<TB>;

  cellHeight?: number;
  columnWidth?: number;
};

export type TimelineProps<
  T extends TimelineTableComponents,
  H extends TimelineTableComponents,
  TR extends TimelineTableComponents,
  TH extends TimelineTableComponents,
  TD extends TimelineTableComponents,
  TB extends TimelineTableComponents,
  TimelineResources extends Record<string, unknown>,
  TimelineEvents extends Record<string, unknown>
> = {
  /**
   * Start is used to identify the upper bound of the Timeline.
   */
  start?: Date | string | DateTime;
  /**
   * End is used to identify the lower bound of the Timeline.
   */
  end?: Date | string | DateTime;

  /**
   * Optional, allows using a custom component for the table
   * @default table
   * @type React.ElementType | keyof JSX.IntrinsicElements
   */
  tableComponent?: T;
  /**
   * Optional, allows passing props to the table component
   * @default {}
   * @type React.ComponentPropsWithoutRef<T>
   */
  tableProps?: React.ComponentPropsWithoutRef<T>;

  /**
   * Optional, allows using a custom component for the table head
   * @default thead
   * @type React.ElementType | keyof JSX.IntrinsicElements
   */
  tableHeadComponent?: H;
  /**
   * Optional, allows passing props to the table head component
   * @default {}
   * @type React.ComponentPropsWithoutRef<H>
   */
  tableHeadProps?: React.ComponentPropsWithoutRef<H>;

  /**
   * Optional, allows using a custom component for the table row
   * @default tr
   * @type React.ElementType | keyof JSX.IntrinsicElements
   */
  tableRowComponent?: TR;
  /**
   * Optional, allows passing props to the table row component
   * @default {}
   * @type React.ComponentPropsWithoutRef<TR>
   */
  tableRowProps?: React.ComponentPropsWithoutRef<TR>;

  /**
   * Optional, allows using a custom component for the table header cell
   * @default th
   * @type React.ElementType | keyof JSX.IntrinsicElements
   */
  tableHeaderCellComponent?: TH;
  /**
   * Optional, allows passing props to the table header cell component
   * @default {}
   * @type React.ComponentPropsWithoutRef<TH>
   */
  tableHeaderCellProps?: React.ComponentPropsWithoutRef<TH>;

  /**
   * Optional, allows using a custom component for the table data cell
   * @default td
   * @type React.ElementType | keyof JSX.IntrinsicElements
   */
  tableCellComponent?: TD;
  /**
   * Optional, allows passing props to the table data cell component
   * @default {}
   * @type React.ComponentPropsWithoutRef<TD>
   */
  tableCellProps?: React.ComponentPropsWithoutRef<TD>;

  /**
   * Optional, allows using a custom component for the table body
   * @default tbody
   * @type React.ElementType | keyof JSX.IntrinsicElements
   */
  tableBodyComponent?: TB;
  /**
   * Optional, allows passing props to the table body component
   * @default {}
   * @type React.ComponentPropsWithoutRef<TB>
   * */
  tableBodyProps?: React.ComponentPropsWithoutRef<TB>;

  // Shared between TimelineProps and TimelineProps
  /**
   * The resources to display on the timeline
   */
  resources: TimelineResources[];
  /**
   * Configuration for the resources
   * Used to specify getters for id, callbacks, etc
   */
  resourceConfig?: ResourceConfig<TimelineResources>;

  /**
   * The items to display on the timeline
   */
  timelineEvents: TimelineEvents[];
  /**
   * Configuration for the timeline events
   */
  timelineConfig?: TimelineConfig<TimelineEvents>;

  /**
   * Title to display above the timeline
   */
  title?: string | React.ReactNode;

  /**
   * Unused right now, will be used to specify the height of the cells
   * @default 50
   */
  cellHeight?: number;
  /**
   * Unused right now, will be used to specify the width of the columns
   * @default 30
   */
  columnWidth?: number;
};

export type TimelineContextProps<
  TimelineResources extends Record<string, unknown>,
  TimelineEvents extends Record<string, unknown>
> = {
  // The resources to display on the timeline
  resources: TimelineResources[];

  resourceConfig?: ResourceConfig<TimelineResources>;

  // The items to display on the timeline
  timelineEvents: TimelineEvents[];
  timelineConfig?: TimelineConfig<TimelineEvents>;

  title?: string | React.ReactNode;

  cellHeight?: number;
  columnWidth?: number;

  start: DateTime;
  end: DateTime;
};
