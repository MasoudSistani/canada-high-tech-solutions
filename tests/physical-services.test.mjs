import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const html = fs.readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
test('fifth service offers 3D design, printing and custom gifts with matching brief choice', () => {
  assert.equal((html.match(/<details(?: open)?>/g) || []).length, 5);
  assert.match(html, /<h3>3D design, printing &amp; custom gifts\.<\/h3>/);
  assert.match(html, /data-service="3D design, printing &amp; custom gifts"/);
  assert.match(html, /<option>3D design, printing &amp; custom gifts<\/option>/);
  for (const example of ['personalized gifts', 'branded desk items', 'event keepsakes', 'display pieces', 'prototypes']) assert.ok(html.includes(example));
  assert.match(html, /digital and physical/);
  assert.match(html, /name="description"[\s\S]*?content="[^"]*3D/);
});
