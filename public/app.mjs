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
