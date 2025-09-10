import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { WordCloudComponent } from "./word-cloud.component";

test("renders word cloud", async () => {
  const { getByText } = render(
    <WordCloudComponent words={[{ text: "Vitest", value: 10 }]} />,
  );
  await expect.element(getByText("Vitest")).toBeInTheDocument();
});
