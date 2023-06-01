import React from "react";
import { TimelineEvent } from "./types";
// import Stack from "components/styled/Stack";
import { getDateTime } from "utility/DateManagement";
import { useTimelineContext } from "utility/TimelineContext";

type Props = {
  event: TimelineEvent;
  columnSegments: number;
};

type ComputedLocationProps = {
  location: number;
  overflow: boolean;
};

const ScheduleBar = ({ event }: Props) => {
  const {
    start: tableStart,
    end: tableEnd,
    timelineConfig
  } = useTimelineContext();

  const {
    onClick: eventClick,
    renderEvent,
    end: endAccessor,
    start: startAccessor
  } = timelineConfig ?? {};

  const fetchedStart = React.useMemo(() => {
    const accessor = startAccessor ?? "start";
    return typeof accessor === "function" ? accessor(event) : event[accessor];
  }, [event, startAccessor]);

  const fetchedEnd = React.useMemo(() => {
    const accessor = endAccessor ?? "end";
    return typeof accessor === "function" ? accessor(event) : event[accessor];
  }, [endAccessor, event]);

  // TODO: consider making getDateTime not throw, and validate a different way, perhaps just drop the time if it's not valid
  const scheduleStart = getDateTime(true, fetchedStart);
  const scheduleEnd = getDateTime(false, fetchedEnd);

  // We need to generate the left and right positions of the event, based on the tableStart and end times
  // For example, if the tableStart is 8:00am, then left: 0 is 8:00am

  const computedLeft = React.useMemo((): ComputedLocationProps => {
    // TODO make this allow to show days, or weeks as well
    const location = scheduleStart.diff(tableStart, "minutes").minutes;
    if (location < 0) {
      return {
        location: 0,
        overflow: true
      };
    }
    return {
      location,
      overflow: false
    };
  }, [tableStart, scheduleStart]);

  const computedRight = React.useMemo((): ComputedLocationProps => {
    // Compare the tableEnd DateTime to the scheduleEnd DateTime
    // If the scheduleEnd is after the tableEnd, then we need to set the right to 0
    const difference = tableEnd.diff(scheduleEnd, "minutes").minutes;

    // Rather than calculating the width, compute the right position of the event
    // If the scheduleEnd is after the tableEnd, then we need to set the right to 0
    if (difference < 0) {
      return {
        location: 0,
        overflow: true
      };
    }

    // If the scheduleEnd is before the tableEnd, then we need to set the right to the difference
    return {
      location: difference,
      overflow: false
    };
  }, [scheduleEnd, tableEnd]);

  return (
    <div
      css={{
        left: computedLeft.location,
        right: computedRight.location,
        position: "absolute",
        top: 0,
        bottom: 0
      }}
    >
      <div
        css={{
          whiteSpace: "nowrap",
          maxWidth: "100%",
          overflow: "hidden",
          height: "100%",
          cursor: "pointer",
          alignItems: "center",
          borderRadius: "none",
          position: "relative",
          width: "100%"
        }}
        onClick={() => eventClick?.(event)}
        id="event-container"
      >
        {/*  Render the title, it is either a string, or a callback that returns a react node*/}
        {renderEvent?.(event)}
      </div>
    </div>
  );
};

export default ScheduleBar;
