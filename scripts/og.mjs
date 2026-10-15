import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.goto("http://localhost:4173");
await page.evaluate(async () => {
  await document.fonts.ready;
  document.body.innerHTML = `<main style="height:630px;padding:55px 68px;background:#f5f3ec;color:#20211e;position:relative;overflow:hidden"><div style="font-size:17px;font-weight:600;letter-spacing:-.5px">Canada High-tech Solutions</div><div style="font-size:13px;letter-spacing:2px;margin-top:60px">DESIGN + DEVELOPMENT + A LITTLE PLAY</div><h1 style="font-size:100px;line-height:1;letter-spacing:-5px;margin-top:27px;position:relative;z-index:1">Ideas into<br><em>experiences.</em></h1><div style="position:absolute;right:80px;top:145px;width:280px;height:280px;background:#f2543d;border-radius:50%"></div><div style="position:absolute;right:30px;bottom:60px;font-size:190px;line-height:1">✳</div><p style="position:absolute;bottom:36px;left:68px;font-size:17px">Websites. Apps. Campaigns. Interactive experiences.</p></main>`;
});
await page.screenshot({ path: "public/og.png" });
await browser.close();
