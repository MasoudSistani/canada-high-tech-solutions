import { cp, rm, mkdir, readFile } from "node:fs/promises";
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
for (const file of [
  "index.html",
  "style.css",
  "app.mjs",
  "core.mjs",
  "favicon.svg",
  "og.png",
  "robots.txt",
  "sitemap.xml",
])
  await readFile(`dist/${file}`);
console.log("Static production build ready in dist.");
