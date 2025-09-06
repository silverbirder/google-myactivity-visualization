import type { Meta, StoryObj } from "@storybook/nextjs";

import { WordCloud } from "./word-cloud";

const meta = {
  component: WordCloud,
  args: {
    words: [
      { text: "example", value: 10 },
      { text: "test", value: 5 },
      { text: "storybook", value: 8 },
      { text: "react", value: 12 },
      { text: "d3", value: 7 },
    ],
  },
} satisfies Meta<typeof WordCloud>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
