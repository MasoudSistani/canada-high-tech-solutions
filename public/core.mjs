export function createBrief({
  name = "",
  service = "Not sure yet",
  idea = "",
  timing = "",
} = {}) {
  if (!idea.trim()) return null;
  const subject = `Project inquiry: ${service}`.replace(/[\x00-\x1f\x7f]+/g, " ");
  const body = `Hi Canada High-tech Solutions,\n\nI'd like to discuss a project.\n\nName / company: ${name.trim() || "Not provided"}\nProject type: ${service}\nIdea: ${idea.trim()}\nTiming: ${timing.trim() || "Flexible"}\n\nThanks!`;
  // mailto uses URI encoding, not form encoding. RFC 6068 requires CRLF in bodies.
  return `mailto:canadahightechsolutions@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/\r\n|\r|\n/g, "\r\n"))}`;
}
