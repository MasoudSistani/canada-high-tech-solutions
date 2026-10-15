import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.TEST_URL || "http://localhost:4173";
const browser = await chromium.launch({ headless: true });
await fs.mkdir("evidence", { recursive: true });
const report = { url: base, runs: [] };
for (const width of [375, 768, 1440]) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    isMobile: width === 375,
    hasTouch: width === 375,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  const response = await page.goto(base);
  assert.equal(response.status(), 200);
  await page
    .getByRole("heading", { name: "Ideas into experiences.", exact: true })
    .waitFor();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  for (const mode of ["Websites", "Apps", "Games", "Campaigns"]) {
    const control = page.getByRole("button", { name: mode, exact: true });
    await control.click();
    assert.equal(await control.getAttribute("aria-pressed"), "true");
    assert.ok(
      (await page.locator("#mode-description").textContent()).length > 20,
    );
  }
  await page.getByRole("button", { name: "Games", exact: true }).click();
  await page.getByRole("button", { name: "Play a round" }).click();
  await page.getByRole("button", { name: "Catch the dot" }).click();
  await page.getByText("Caught: 1", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Apps", exact: true }).click();
  await page.getByRole("checkbox", { name: "Shape the idea" }).check();
  await page.getByText("1 of 3 complete", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Websites", exact: true }).click();
  await page.getByRole("button", { name: "Shuffle composition" }).click();
  const stage = page.locator("#composition");
  await stage.focus();
  await page.keyboard.press("ArrowRight");
  assert.ok((await stage.getAttribute("style")).includes("--x"));
  if (width === 375) {
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    assert.equal(
      await page
        .getByRole("button", { name: "Menu", exact: true })
        .getAttribute("aria-expanded"),
      "true",
    );
    await page
      .locator("#nav")
      .getByRole("link", { name: "Services", exact: true })
      .click();
    assert.equal(
      await page
        .getByRole("button", { name: "Menu", exact: true })
        .getAttribute("aria-expanded"),
      "false",
    );
  }
  await page.getByLabel("Your name or company").fill("QA & Company");
  await page
    .getByLabel("What would you like to make?")
    .fill("A helpful website & app");
  await page.getByLabel("Project type").selectOption("Website");
  const mail = await page.locator("#draft-link").getAttribute("href");
  assert.ok(mail.startsWith("mailto:canadahightechsolutions@gmail.com?"));
  assert.match(
    decodeURIComponent(mail.replaceAll("+", " ")),
    /A helpful website & app/,
  );
  const missing = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .filter((a) => !document.querySelector(a.getAttribute("href")))
        .map((a) => a.outerHTML),
    );
  assert.deepEqual(missing, []);
  const a11y = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  assert.deepEqual(
    a11y.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
    [],
  );
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: `evidence/${width}.png`, fullPage: true });
  assert.deepEqual(errors, []);
  report.runs.push({
    width,
    http: response.status(),
    consoleErrors: errors,
    overflow: false,
    axeViolations: a11y.violations.length,
    interactions: "passed",
  });
  await context.close();
}
const reduced = await browser.newContext({
  reducedMotion: "reduce",
  viewport: { width: 375, height: 667 },
});
const page = await reduced.newPage();
await page.goto(base);
assert.equal(
  await page.evaluate(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  ),
  true,
);
await page.screenshot({ path: "evidence/reduced-motion-375.png" });
report.reducedMotion = "passed";
await browser.close();
await fs.writeFile("evidence/qa.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
