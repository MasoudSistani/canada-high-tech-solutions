import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const browser = await chromium.launch();
const url = process.env.TEST_URL || "http://localhost:4173";
const results = [];
for (const width of [375, 650, 768, 1024, 1440]) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    hasTouch: width === 375,
    isMobile: width === 375,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  await page.locator("#draft-link").click();
  assert.equal(
    await page.locator("#idea").evaluate((el) => el === document.activeElement),
    true,
  );
  assert.match(
    await page.locator("#brief-status").textContent(),
    /Add a sentence/,
  );
  for (const details of await page.locator("details").all()) {
    if (!((await details.getAttribute("open")) !== null))
      await details.locator("summary").click();
    const service = await details
      .locator("[data-service]")
      .getAttribute("data-service");
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    assert.deepEqual(audit.violations.map(v => ({id:v.id,nodes:v.nodes.map(n=>n.target)})), []);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await details.locator("[data-service]").click();
    assert.equal(await page.locator("#service").inputValue(), service);
  }
  assert.deepEqual(errors, []);
  results.push({
    width,
    consoleErrors: errors,
    businessPaths: "passed",
    serviceInquiries: "passed",

  });
  await context.close();
}
const noJS = await browser.newContext({ javaScriptEnabled: false });
const page = await noJS.newPage();
await page.goto(url);
assert.ok(await page.locator(".email").isVisible());
assert.equal(
  await page.locator(".email").getAttribute("href"),
  "mailto:canadahightechsolutions@gmail.com",
);
await noJS.close();
await browser.close();
await fs.writeFile(
  "evidence/extended-qa.json",
  JSON.stringify(
    { url, results, noJS: "email and content available" },
    null,
    2,
  ),
);
console.log(JSON.stringify(results, null, 2));
