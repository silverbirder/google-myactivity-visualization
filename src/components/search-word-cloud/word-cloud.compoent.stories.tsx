import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import { WordCloudComponent } from "./word-cloud.component";

const meta = {
  component: WordCloudComponent,
  args: {
    words: [
      { text: "example", value: 10 },
      { text: "test", value: 5 },
      { text: "storybook", value: 8 },
      { text: "react", value: 12 },
      { text: "d3", value: 7 },
    ],
  },
  parameters: {
    range: {
      words: {
        type: "array",
        min: 1,
        max: 100,
        step: 1,
        items: {
          type: "object",
          text: {
            type: "string",
          },
          value: {
            type: "number",
          },
        },
        defaultItem: (i: number) => ({
          text: `Word ${i + 1}`,
          value: i + 1,
        }),
      },
    },
  },
} satisfies Meta<typeof WordCloudComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("example")).toBeInTheDocument();
  },
};
