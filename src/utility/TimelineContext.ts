import {
  DEFAULT_CAL_WIDTH,
  DEFAULT_CELL_HEIGHT,
  DEFAULT_COLUMN_WIDTH
} from "./Constants";
import { createContext, useContext } from "react";

import { DateTime } from "luxon";
import { TimelineContextProps } from "timeline";

// Shim for generics right now
type TimelineContextValue = TimelineContextProps<
  Record<string, unknown>,
  Record<string, unknown>
> & {
  timelineWidth: number;
};
export const TimelineContext = createContext<TimelineContextValue>({
  resources: [],
  timelineEvents: [],

  cellHeight: DEFAULT_CELL_HEIGHT,
  columnWidth: DEFAULT_COLUMN_WIDTH,

  start: DateTime.local().startOf("day"),
  end: DateTime.local().endOf("day"),
  // Default to 24 hours, one minute = 1px
  timelineWidth: DEFAULT_CAL_WIDTH
});

export const useTimelineContext = () => useContext(TimelineContext);
