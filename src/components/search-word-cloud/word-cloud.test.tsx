import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { WordCloud } from "./word-cloud";

test("renders word cloud", async () => {
  const { getByText } = render(
    <WordCloud words={[{ text: "Vitest", value: 10 }]} />,
  );
  await expect.element(getByText("Vitest")).toBeInTheDocument();
});
