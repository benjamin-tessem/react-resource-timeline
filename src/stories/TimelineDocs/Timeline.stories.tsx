import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";

import { DateTime } from "luxon";
import Timeline from "../../timeline/Timeline";

const resources = [
  { id: "a", title: "Room A" },
  { id: "b", title: "Room B" },
  { id: "c", title: "Conference Room" }
];

const timelineEvents = [
  {
    id: 1,
    resourceId: "a",
    start: DateTime.now().minus({ hours: 3 }),
    end: DateTime.now().plus({ hours: 1 }),
    title: "Event 1",
    color: "yellow"
  },
  {
    id: 2,
    resourceId: "b",
    start: DateTime.now(),
    end: DateTime.now().plus({ days: 1 }),
    title: "Event 2",
    color: "blue"
  },
  {
    id: 3,
    resourceId: "c",
    start: DateTime.now().plus({ hours: 1 }),
    end: DateTime.now().plus({ hours: 4 }),
    title: "Event 3",
    color: "#ff00ff"
  },
  {
    id: 4,
    resourceId: "c",
    start: DateTime.now().plus({ hours: 5 }),
    end: DateTime.now().plus({ hours: 7 }),
    title: "Event 4",
    color: "#97c519"
  }
];

const meta: Meta<typeof Timeline> = {
  title: "Timeline",
  component: Timeline,
  tags: ["autodocs"],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 500
      }
    },
    controls: {
      expanded: true
    }
  },
  argTypes: {
    start: {
      control: {
        type: "date"
      }
    },
    end: {
      control: {
        type: "date"
      }
    }
  },
  args: {
    start: DateTime.now().startOf("hour").toISO() ?? "",
    end: DateTime.now().startOf("hour").plus({ days: 7 }).toISO() ?? "",
    timelineEvents,
    resources,
    timelineConfig: {
      resourceId: "resourceId",
      start: "start",
      end: "end",
      eventId: "id",
      renderEvent: (event) => (
        <div style={{ backgroundColor: "red", width: "100%" }}>
          {event?.title as string}
        </div>
      )
    },
    resourceConfig: {
      selector: "id",
      renderResourceCell(item) {
        return <div>{item?.title as string}</div>;
      }
    },
    title: "Resource Timeline"
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export default meta;

type Story = StoryObj<typeof Timeline>;

export const Basic: Story = {};

export const WithMUI: Story = {
  args: {
    timelineConfig: {
      resourceId: "resourceId",
      start: "start",
      end: "end",
      eventId: "id",
      renderEvent: (event) => (
        <Card
          sx={{
            height: "100%",
            backgroundColor: event.color as string
          }}
        >
          <CardContent>{event?.title as string}</CardContent>
        </Card>
      )
    },
    resourceConfig: {
      selector: "id",
      renderResourceCell(item) {
        return (
          <Card
            sx={{
              height: "100%",
              backgroundColor: "lightblue"
            }}
          >
            <CardContent>{item.title as string}</CardContent>
          </Card>
        );
      }
    },
    title: "MUI Timeline",
    tableComponent: Table,
    tableBodyComponent: TableBody,
    tableCellComponent: TableCell,
    tableHeadComponent: TableHead,
    tableHeaderCellComponent: TableCell,
    tableRowComponent: TableRow,
    tableHeaderCellProps: {
      component: "th"
    }
  }
};
