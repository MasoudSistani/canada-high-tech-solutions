import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
test('production assets contain no experimental projects or preview machinery', async () => {
 const forbidden = /snake|playground|\blab\b|demo-window|demo-content|data-mode|catch-dot|caught:|experiment|preview-checklist|campaign-switch/i;
 for (const file of await readdir('public')) {
  assert.doesNotMatch(file, forbidden);
  if (/\.(html|css|mjs|svg|txt|xml)$/.test(file)) assert.doesNotMatch(await readFile(`public/${file}`, 'utf8'), forbidden, file);
 }
});
