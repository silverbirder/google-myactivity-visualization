import { afterAll, beforeAll, describe, it, expect } from "vitest";
import { GenericContainer, type StartedTestContainer } from "testcontainers";
import {
  type Browser,
  type BrowserContext,
  type Page,
  chromium,
} from "@playwright/test";
import path from "path";

describe("Word Cloud", () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  let appContainer: StartedTestContainer;

  beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    const appImage = await GenericContainer.fromDockerfile("./").build("app", {
      deleteOnExit: true,
    });
    appContainer = await appImage.withExposedPorts(3000).start();
  });

  afterAll(async () => {
    await appContainer.stop({ remove: true, removeVolumes: true });
    await context?.close();
    await browser?.close();
  });

  it("should display word cloud", async () => {
    const url = `https://${appContainer.getHost()}:${appContainer.getFirstMappedPort()}`;
    await page.goto(url);

    await page.waitForSelector("text=Initializing DuckDB...", {
      state: "detached",
      timeout: 20000,
    });

    const wordCloudFile = path.resolve(__dirname, "word-cloud.json");
    const fileInput = await page.$('input[type="file"]');
    await fileInput?.setInputFiles(wordCloudFile);

    await page.click("text=Run Query");

    await page.waitForTimeout(1000);

    await page.reload();
    await page.waitForSelector("text=test");

    const screenshotPath = path.resolve(__dirname, "word-cloud.png");
    await page.screenshot({ path: screenshotPath });
    expect(await page.locator("text=test").count()).toBeGreaterThan(0);
  });
});
