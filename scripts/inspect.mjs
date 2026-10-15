import { chromium } from "@playwright/test";
const b = await chromium.launch();
const p = await b.newPage();
await p.goto("http://localhost:4173");
console.log(await p.locator("#service").innerHTML());
await p.screenshot({ path: "evidence/inspect.png", fullPage: true });
await b.close();
