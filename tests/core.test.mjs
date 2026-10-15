import test from "node:test";
import assert from "node:assert/strict";
import { createBrief } from "../public/core.mjs";

// Native mail clients decode URI escapes, not HTML form '+' spaces.
function nativeHeaders(uri) {
  assert.ok(uri.startsWith("mailto:canadahightechsolutions@gmail.com?"));
  return Object.fromEntries(uri.slice(uri.indexOf("?") + 1).split("&").map(field => {
    const equals = field.indexOf("=");
    return [field.slice(0, equals), decodeURIComponent(field.slice(equals + 1))];
  }));
}

test("native mail draft preserves exact spaces, special characters, Unicode and CRLF", () => {
  const uri = createBrief({ name: " Sam & Co + café ", service: "Game or interactive experience", idea: " A + B & C #1? 你好 🎮\nNext\rThird\r\nFourth ", timing: " Next winter? " });
  const headers = nativeHeaders(uri);
  assert.equal(headers.subject, "Project inquiry: Game or interactive experience");
  assert.equal(headers.body, "Hi Canada High-tech Solutions,\r\n\r\nI'd like to discuss a project.\r\n\r\nName / company: Sam & Co + café\r\nProject type: Game or interactive experience\r\nIdea: A + B & C #1? 你好 🎮\r\nNext\r\nThird\r\nFourth\r\nTiming: Next winter?\r\n\r\nThanks!");
  assert.deepEqual(Object.keys(headers), ["subject", "body"]);
  assert.ok(uri.includes("%20"));
  assert.ok(uri.includes("%2B"));
  assert.ok(!uri.includes("+"));
});

test("subject normalizes control characters to prevent header injection", () => {
  const headers = nativeHeaders(createBrief({ service: "Game + café & #?\r\nBcc: attacker@example.com\n\tNext\u0000", idea: "Hello" }));
  assert.equal(headers.subject, "Project inquiry: Game + café & #? Bcc: attacker@example.com Next ");
  assert.ok(!/[\r\n\x00-\x1f\x7f]/.test(headers.subject));
  assert.deepEqual(Object.keys(headers), ["subject", "body"]);
});

test("empty ideas do not create a draft and defaults remain unchanged", () => {
  assert.equal(createBrief({ idea: "  " }), null);
  assert.equal(createBrief(), null);
  const headers = nativeHeaders(createBrief({ idea: "Hello" }));
  assert.equal(headers.subject, "Project inquiry: Not sure yet");
  assert.ok(headers.body.includes("Name / company: Not provided\r\n"));
  assert.ok(headers.body.includes("Timing: Flexible\r\n"));
});
