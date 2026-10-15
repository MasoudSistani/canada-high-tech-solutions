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
  assert.equal(await page.locator('#playground, .lab, .experiment, #composition, [data-mode]').count(), 0);
  assert.doesNotMatch(await page.locator('body').innerText(), /snake|playground|interaction lab|internal demo|experiment/i);
  assert.equal(await page.locator('a[href*="snake"]').count(), 0);
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
  await page.getByLabel("Your name or company").fill("QA + café & Company");
  await page
    .getByLabel("What would you like to make?")
    .fill("A helpful website + app & #? 你好 🎮\nSecond line");
  await page.getByLabel("Project type").selectOption({ label: "Game or interactive experience" });
  const mail = await page.locator("#draft-link").getAttribute("href");
  assert.ok(mail.startsWith("mailto:canadahightechsolutions@gmail.com?"));
  const headers = Object.fromEntries(mail.slice(mail.indexOf("?") + 1).split("&").map(field => {
    const equals = field.indexOf("=");
    return [field.slice(0, equals), decodeURIComponent(field.slice(equals + 1))];
  }));
  assert.equal(headers.subject, "Project inquiry: Game or interactive experience");
  assert.equal(headers.body, "Hi Canada High-tech Solutions,\r\n\r\nI'd like to discuss a project.\r\n\r\nName / company: QA + café & Company\r\nProject type: Game or interactive experience\r\nIdea: A helpful website + app & #? 你好 🎮\r\nSecond line\r\nTiming: Flexible\r\n\r\nThanks!");
  assert.deepEqual(Object.keys(headers), ["subject", "body"]);
  assert.ok(!mail.includes("+"));
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
assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
await page.screenshot({ path: "evidence/reduced-motion-375.png" });
report.reducedMotion = "passed";
await browser.close();
await fs.writeFile("evidence/qa.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
