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
  for (const mode of ["Websites", "Apps", "Games", "Campaigns"]) {
    await page.getByRole("button", { name: mode, exact: true }).click();
    if (mode === "Apps") {
      const labels = await page
        .locator(".preview-checklist label")
        .evaluateAll((items) =>
          items.map((el) => ({
            height: el.offsetHeight,
            width: el.offsetWidth,
          })),
        );
      assert.ok(
        labels.every((box) => box.height >= 44 && box.width >= 44),
        JSON.stringify({ width, labels }),
      );
      await page.getByRole("checkbox", { name: "Make it real" }).check();
      await page.getByText("1 of 3 complete", { exact: true }).waitFor();
      await page.getByRole("checkbox", { name: "Make it real" }).uncheck();
      await page.getByText("0 of 3 complete", { exact: true }).waitFor();
    }
    if (mode === "Games") {
      await page.getByRole("button", { name: "Play a round" }).focus();
      await page.keyboard.press("Enter");
      for (let i = 1; i <= 8; i++) {
        await page.keyboard.press("Space");
        await page.getByText(`Caught: ${i}`, { exact: true }).waitFor();
      }
    }
    if (mode === "Campaigns") {
      const original = await page.locator(".campaign-title").textContent();
      await page.getByRole("button", { name: "Try another headline" }).click();
      assert.notEqual(
        await page.locator(".campaign-title").textContent(),
        original,
      );
    }
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    assert.deepEqual(
      audit.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      [],
      `${width} ${mode}`,
    );
    if (width === 375 || width === 1440) {
      await page
        .locator("#playground")
        .screenshot({
          path: `evidence/lab-${mode.toLowerCase()}-${width}.png`,
        });
    }
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
  }
  if (width === 375) {
    await page.getByRole("button", { name: "Websites", exact: true }).click();
    await page.locator("#composition").scrollIntoViewIfNeeded();
    const bounds = await page.locator("#composition").boundingBox();
    const client = await context.newCDPSession(page);
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: bounds.x + 20, y: bounds.y + 80 }],
    });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: bounds.x + 70, y: bounds.y + 82 }],
    });
    const touchX = await page
      .locator("#composition")
      .evaluate((el) => el.style.getPropertyValue("--x"));
    assert.ok(touchX && touchX !== "0px");
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    results.push({ touch: "CDP native touch drag passed" });
  }
  for (const details of await page.locator("details").all()) {
    if (!((await details.getAttribute("open")) !== null))
      await details.locator("summary").click();
    const service = await details
      .locator("[data-service]")
      .getAttribute("data-service");
    await details.locator("[data-service]").click();
    assert.equal(await page.locator("#service").inputValue(), service);
  }
  const external = await context.request.get(
    "https://snake-demo-mu.vercel.app",
  );
  assert.equal(external.status(), 200);
  results.push({
    width,
    allModeAccessibility: "passed",
    keyboardGame: "passed",
    serviceInquiries: "passed",
    externalDemo: 200,
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
