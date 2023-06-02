import { Timeline, TimelineProps, TimelineTableComponents } from "timeline";
import { fireEvent, render } from "@testing-library/react";

import { DEFAULT_DAY_LENGTH } from "utility/Constants";
import { DateTime } from "luxon";

type TestingProps<
  T extends TimelineTableComponents = "table",
  H extends TimelineTableComponents = "thead",
  TR extends TimelineTableComponents = "tr",
  TH extends TimelineTableComponents = "th",
  TD extends TimelineTableComponents = "td",
  TB extends TimelineTableComponents = "tbody",
  TimelineResources extends Record<string, unknown> = Record<string, unknown>,
  TimelineEvents extends Record<string, unknown> = Record<string, unknown>
> = TimelineProps<T, H, TR, TH, TD, TB, TimelineResources, TimelineEvents>;

const resources = [...Array(30).keys()].map((x) => ({
  id: `foo${x}`,
  title: `Event${x}`
}));

// Make a reproducible start and end time
const start = DateTime.fromFormat("2021-01-01", "yyyy-MM-dd");
const end = DateTime.fromFormat("2021-01-07", "yyyy-MM-dd");

const timelineItems = [
  {
    id: 1,
    resourceId: "foo1",
    start: start.minus({ hours: 3 }).toJSDate(),
    end: end.plus({ hours: 1 }),
    title: "Meeting",
    color: "yellow"
  },
  {
    id: 2,
    resourceId: "foo2",
    start: start,
    end: end.plus({ minutes: 30 }).toISO(),
    title: "Trying out food",
    color: "pink"
  },
  {
    id: 3,
    resourceId: "foo3",
    start: start.plus({ hours: 1 }),
    end: end.plus({ hours: 1, minutes: 30 }),
    title: "A Test Event",
    color: "blue"
  },
  {
    id: 4,
    resourceId: "foo4",
    start: start.plus({ hours: 1 }),
    end: end.plus({ day: 2 }),
    title: "Cooking",
    color: "red"
  },
  {
    id: 41,
    resourceId: "foo5",
    start: start.plus({ hours: 1 }),
    end: end.plus({ day: 2 }),
    title: "Cooking",
    color: "red"
  },
  {
    id: 5,
    resourceId: "foo6",
    start: start.startOf("hour").plus({ hours: 1 }),
    end: end.startOf("hour").plus({ hours: 1, minutes: 30 }),
    title: "Cooking",
    color: "red"
  },

  {
    id: 1235,
    resourceId: "foo7",
    start: start.startOf("hour"),
    end: end.startOf("hour").plus({ hours: 1, minutes: 30 }),
    title: "Cooking",
    color: "red"
  }
];

const timelineConfig = {
  resourceId: "resourceId",
  start: "start",
  end: "end",
  eventId: "id",
  renderEvent: (event: Record<string, unknown>) => (
    <div>{event.title as string}</div>
  )
};

describe("Timeline", () => {
  const renderTimeline = (props?: Partial<TestingProps>) => {
    return render(
      <Timeline
        resources={resources}
        timelineEvents={timelineItems}
        resourceConfig={{
          selector: "id",
          renderResourceCell: (item) => <div>{item.title as string}</div>
        }}
        timelineConfig={timelineConfig}
        title="Resources"
        start={start}
        end={end}
        {...props}
      />
    );
  };

  it("should render the timeline", () => {
    const { queryByText } = renderTimeline();
    expect(queryByText("Event5")).toBeTruthy();
    expect(queryByText("Trying out food")).toBeTruthy();
    // Check that one of the center days have their colunm span set to the default
    const wednesday = queryByText("Wed, Jan 6, 2021");
    expect(wednesday).toBeTruthy();
    expect(wednesday?.getAttribute("colSpan")).toEqual(`${DEFAULT_DAY_LENGTH}`);
  });

  it("inverted dates should return no items", () => {
    const { queryByText } = renderTimeline({
      start: end,
      end: start
    });
    expect(queryByText("Event5")).toBeTruthy();
    expect(queryByText("Trying out food")).toBeFalsy();
  });

  it("timelines that are less than an hour wide should still show 1 hour", () => {
    const { queryByText } = renderTimeline({
      start: start,
      end: start.plus({ minutes: 30 })
    });
    const firstHour = queryByText("12 AM");
    expect(firstHour).toBeTruthy();
    // Expect the hour to span 2 columns
    expect(firstHour?.parentElement?.getAttribute("colSpan")).toEqual("2");
  });

  it("should still render when a ISO date is passed", () => {
    const { queryByText } = renderTimeline({
      start: start.toISO() ?? "",
      end: end.toISO() ?? ""
    });
    expect(queryByText("Event5")).toBeTruthy();
    expect(queryByText("Trying out food")).toBeTruthy();
  });

  it("should still render when a JSDate is passed", () => {
    const { queryByText } = renderTimeline({
      start: start.toJSDate(),
      end: end.toJSDate()
    });
    expect(queryByText("Event5")).toBeTruthy();
    expect(queryByText("Trying out food")).toBeTruthy();
  });

  it("using an object accessor should work", () => {
    const { queryByText } = renderTimeline({
      timelineConfig: {
        // Intentionally ignoring types to test the default values
        // @ts-expect-error Testing the default values
        resourceId: (x) => x.resourceId,
        // @ts-expect-error Testing the default values
        start: (x) => x.start,
        // @ts-expect-error Testing the default values
        end: (x) => x.end,
        // @ts-expect-error Testing the default values
        eventId: (x) => x.id,
        // @ts-expect-error Testing the default values
        renderEvent: (event) => <div>{event.title}</div>
      }
    });
    expect(queryByText("A Test Event")).toBeTruthy();
  });

  it("no accessors should default to start, end, id and resourceId", () => {
    const { queryByText } = renderTimeline({
      // Intentionally ignoring types to test the default values
      // @ts-expect-error Testing the default values
      timelineConfig: {},
      resourceConfig: {},
      start: undefined,
      end: undefined
    });
    expect(queryByText("A Test Event")).toBeFalsy();
  });

  it("bad resourceId should just be dropped out", () => {
    const { queryByText } = renderTimeline({
      timelineConfig: {
        // Intentionally ignoring types to test the default values
        // @ts-expect-error Testing the default values
        resourceId: () => undefined
      }
    });
    expect(queryByText("A Test Event")).toBeFalsy();
  });

  it("non existent resources and timelineEvents should still render the timeline", () => {
    const { queryByText } = renderTimeline({
      resources: [],
      timelineEvents: []
    });
    expect(queryByText("A Test Event")).toBeFalsy();
    expect(queryByText("Event5")).toBeFalsy();
  });

  it("no title should be empty", () => {
    const { queryByText } = renderTimeline({
      title: undefined
    });
    expect(queryByText("Resources")).toBeFalsy();
  });

  it("should render when both resources and timeline events are undefined", () => {
    const { queryByText } = renderTimeline({
      resources: undefined,
      timelineEvents: undefined
    });
    expect(queryByText("Trying out food")).toBeNull();
    expect(queryByText("Event5")).toBeNull();
  });

  it("bad resource id should drop the events related", () => {
    const { queryByText } = renderTimeline({
      resources: [
        {
          id: undefined,
          title: "A Test Event"
        }
      ]
    });
    expect(queryByText("A Test Event")).toBeNull();
  });

  it("onClick an event should call the callback", () => {
    const onClick = jest.fn();
    const { queryByText } = renderTimeline({
      timelineConfig: {
        ...timelineConfig,
        onClick
      }
    });
    const event = queryByText("Trying out food");
    expect(event).toBeTruthy();
    expect(onClick).not.toHaveBeenCalled();
    fireEvent.click(event as HTMLElement);
    expect(onClick).toHaveBeenCalled();
    // Expect there to have been an object passed to the callback
    const passedObject = onClick.mock.calls[0][0];
    expect(passedObject).toBeTruthy();
    // Check that the title is correct
    expect(passedObject).toHaveProperty("title", "Trying out food");
  });
});
