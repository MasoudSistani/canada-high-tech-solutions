export function createBrief({
  name = "",
  service = "Not sure yet",
  idea = "",
  timing = "",
} = {}) {
  if (!idea.trim()) return null;
  const query = new URLSearchParams({
    subject: `Project inquiry: ${service}`,
    body: `Hi Canada High-tech Solutions,\n\nI'd like to discuss a project.\n\nName / company: ${name.trim() || "Not provided"}\nProject type: ${service}\nIdea: ${idea.trim()}\nTiming: ${timing.trim() || "Flexible"}\n\nThanks!`,
  });
  return `mailto:canadahightechsolutions@gmail.com?${query}`;
}
