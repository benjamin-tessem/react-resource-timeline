import { DateTime } from "luxon";

const isDateTime = (date: unknown): date is DateTime => {
  return DateTime.isDateTime(date);
};

const isDate = (date: unknown): date is Date => {
  return date instanceof Date;
};

const isString = (date: unknown): date is string => {
  return typeof date === "string";
};
/**
 * Determines if the date is a valid date, if not returns the current date or 7 days from now
 * @param isStart determines if the date is the start or end date
 * @param date item that may or may not be a date
 * @returns a resolved DateTime object, if the date was invalid either returns the current date or 7 days from now,
 * depending on if it was the start or end date
 */
export const getDateTime = (isStart: boolean, date?: unknown): DateTime => {
  let resolvedDate = DateTime.local()
    .startOf("day")
    .plus({ days: isStart ? 0 : 7 });

  if (isDateTime(date) && date.isValid) {
    resolvedDate = date;
  }

  if (isDate(date)) {
    resolvedDate = DateTime.fromJSDate(date);
  }

  if (isString(date)) {
    const tempDate = DateTime.fromISO(date);
    resolvedDate = tempDate.isValid ? tempDate : resolvedDate;
  }

  return resolvedDate;
};

// TODO: Make this allow taking an additional parameter for the unit of time, I think weeks, days, and hours is enough
/**
 * Gets the total time between two dates in hours
 * if the end date is before the start date, returns 0
 * if we are between 0 and 1 hours, returns 1
 * @param start start date
 * @param end end date
 */
export const getTimeSpan = (start: DateTime, end: DateTime): number => {
  const diff = end.diff(start, "hours").hours;
  // If we are less than 0 hours, return 0
  if (diff < 0) {
    return 0;
  }
  // round up to the nearest hour
  return Math.ceil(diff);
};
