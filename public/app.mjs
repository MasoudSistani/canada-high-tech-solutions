import { createBrief } from "./core.mjs";
const $ = (selector) => document.querySelector(selector);
const menu = $("#menu");
const nav = $("#nav");
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
});
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menu.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    nav.classList.remove("is-open");
    menu.setAttribute("aria-expanded", "false");
    menu.focus();
  }
});
const composition = $("#composition");
const content = $("#demo-content");
let x = 0,
  y = 0,
  caught = 0;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const move = (nextX, nextY) => {
  x = Math.max(-28, Math.min(28, nextX));
  y = Math.max(-28, Math.min(28, nextY));
  composition.style.setProperty("--x", `${x}px`);
  composition.style.setProperty("--r", `${x * 0.6}deg`);
  composition.style.setProperty("--y", `${y}px`);
};
composition.addEventListener("pointermove", (event) => {
  if (reducedMotion.matches || event.target.closest("button,input,label"))
    return;
  if (event.pointerType === "touch" && !event.buttons) return;
  const box = composition.getBoundingClientRect();
  move(
    ((event.clientX - box.left) / box.width - 0.5) * 56,
    ((event.clientY - box.top) / box.height - 0.5) * 56,
  );
});
composition.addEventListener("pointerleave", () => move(0, 0));
composition.addEventListener("keydown", (event) => {
  if (event.target !== composition) return;
  const directions = {
    ArrowRight: [8, 0],
    ArrowLeft: [-8, 0],
    ArrowUp: [0, -8],
    ArrowDown: [0, 8],
  };
  if (directions[event.key]) {
    event.preventDefault();
    move(x + directions[event.key][0], y + directions[event.key][1]);
  }
});
$("#shuffle").addEventListener("click", () => {
  composition.classList.toggle("is-shuffled");
  move(x === 20 ? -20 : 20, y === 15 ? -15 : 15);
});
const modes = {
  websites: {
    label: "A small idea, made tangible.",
    description:
      "A clear story. A considered layout. A website that makes the next step easy.",
    html: '<p class="preview-kicker">MAKE ROOM FOR</p><p class="preview-title">a good<br><em>first impression.</em></p><span class="preview-line"></span>',
  },
  apps: {
    label: "A small product prototype",
    description:
      "Turn a workflow into something useful. Try this tiny project checklist.",
    html: '<p class="preview-title"><em>Next up.</em></p><div class="preview-checklist"><label><input type="checkbox">Shape the idea</label><label><input type="checkbox">Try a prototype</label><label><input type="checkbox">Make it real</label></div><p class="progress" aria-live="polite">0 of 3 complete</p>',
  },
  games: {
    label: "A little interaction experiment",
    description:
      "One rule: catch the coral dot. Play a round with touch, a pointer or your keyboard.",
    html: '<p class="preview-title">A little<br><em>more play.</em></p><button class="play-start">Play a round</button>',
  },
  campaigns: {
    label: "A campaign concept study",
    description:
      "One idea, different expressions. Change the headline to explore the message.",
    html: '<p class="preview-kicker">A CONCEPT, NOT A CLIENT CAMPAIGN</p><p class="campaign-title">Make<br><em>some room.</em></p><button class="campaign-switch">Try another headline ↻</button>',
  },
};
for (const button of document.querySelectorAll(".mode-controls button")) {
  button.addEventListener("click", () => {
    const mode = button.dataset.mode;
    composition.dataset.mode = mode;
    content.innerHTML = modes[mode].html;
    $("#preview-label").textContent = modes[mode].label;
    $("#mode-description").textContent = modes[mode].description;
    document.querySelector(".lab-number").textContent =
      `0${Object.keys(modes).indexOf(mode) + 1} / 04`;
    document
      .querySelectorAll(".mode-controls button")
      .forEach((other) =>
        other.setAttribute("aria-pressed", String(other === button)),
      );
  });
}
let headline = 0;
content.addEventListener("click", (event) => {
  if (event.target.closest(".play-start")) {
    caught = 0;
    content.innerHTML =
      '<p class="game-count" aria-live="polite">Caught: 0</p><div class="dot-arena"><button class="catch-dot" aria-label="Catch the dot"></button></div>';
    $(".catch-dot").focus({ preventScroll: true });
  } else if (event.target.closest(".catch-dot")) {
    caught++;
    $(".game-count").textContent = `Caught: ${caught}`;
    const dot = $(".catch-dot");
    dot.style.left = `${[12, 60, 32, 70, 45][caught % 5]}%`;
    dot.style.top = `${[5, 50, 20, 55, 30][caught % 5]}%`;
  } else if (event.target.closest(".campaign-switch")) {
    headline = (headline + 1) % 3;
    $(".campaign-title").innerHTML = [
      "Make<br><em>some room.</em>",
      "Start<br><em>something.</em>",
      "Give ideas<br><em>a place.</em>",
    ][headline];
  }
});
content.addEventListener("change", () => {
  const progress = $(".progress");
  if (progress)
    progress.textContent = `${content.querySelectorAll("input:checked").length} of 3 complete`;
});
const form = $("#brief");
const updateBrief = () => {
  const fields = Object.fromEntries(new FormData(form));
  const href = createBrief(fields);
  $("#draft-link").href =
    href ||
    "mailto:canadahightechsolutions@gmail.com?subject=Project%20inquiry";
};
form.addEventListener("input", updateBrief);
form.addEventListener("change", updateBrief);
form.addEventListener("submit", (event) => event.preventDefault());
$("#draft-link").addEventListener("click", (event) => {
  if (!$("#idea").value.trim()) {
    event.preventDefault();
    $("#brief-status").textContent =
      "Add a sentence about your idea to build the email draft.";
    $("#idea").focus();
  } else {
    updateBrief();
    $("#brief-status").textContent =
      "Your email app will open with a draft. If it does not, use the email address alongside this form.";
  }
});
for (const link of document.querySelectorAll("[data-service]")) {
  link.addEventListener("click", () => {
    $("#service").value = link.dataset.service;
    updateBrief();
  });
}
