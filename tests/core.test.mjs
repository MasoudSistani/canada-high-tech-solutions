import test from "node:test";
import assert from "node:assert/strict";

test("brief opens an encoded email addressed to the verified business contact", async () => {
  const { createBrief } = await import("../public/core.mjs");
  const result = createBrief({
    name: "Sam & Co",
    service: "Website",
    idea: "A useful shop & booking flow",
    timing: "This winter",
  });
  assert.ok(result.startsWith("mailto:canadahightechsolutions@gmail.com?"));
  const query = new URLSearchParams(result.split("?")[1]);
  assert.equal(query.get("subject"), "Project inquiry: Website");
  assert.match(query.get("body"), /Sam & Co/);
  assert.match(query.get("body"), /A useful shop & booking flow/);
  assert.match(query.get("body"), /This winter/);
  assert.equal(createBrief({ idea: "  " }), null);
});
