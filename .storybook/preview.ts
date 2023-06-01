import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    options: {
      storySort: {
        order: [
          "Installation",
          "Development",
          "Basic Usage",
          "Timeline",
          ["Documentation", "Custom Component Libraries"]
        ]
      }
    }
  }
};

export default preview;
