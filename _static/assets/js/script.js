// === Helpers ===
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const isDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

// === Theme Storage ===
const getStoredTheme = () => localStorage.getItem("theme");
const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

// === Bootstrap: Theme Prefs ===
const getPreferredTheme = () =>
  getStoredTheme() || (isDark() ? "dark" : "light");

const setTheme = (theme) => {
  const effective = theme === "auto" ? (isDark() ? "dark" : "light") : theme;
  document.documentElement.dataset.bsTheme = effective;
};

const showActiveTheme = (theme, focus = false) => {
  const switcher = $("#bd-theme");
  if (!switcher) return;

  const switcherText = $("#bd-theme-text");
  const activeIconUse = $(".theme-icon-active use");
  const btn = $(`[data-bs-theme-value="${theme}"]`);
  const svgHref = btn?.querySelector("svg use")?.getAttribute("href");

  $$("[data-bs-theme-value]").forEach((el) => {
    el.classList.remove("active");
    el.setAttribute("aria-pressed", "false");
  });

  btn?.classList.add("active");
  btn?.setAttribute("aria-pressed", "true");
  activeIconUse?.setAttribute("href", svgHref);
  switcher.setAttribute(
    "aria-label",
    `${switcherText?.textContent} (${btn?.dataset.bsThemeValue})`,
  );
  if (focus) switcher.focus();
};

const initThemeListener = () => {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      const stored = getStoredTheme();
      if (!["light", "dark"].includes(stored)) setTheme(getPreferredTheme());
    });
};

const initThemeSwitcher = () => {
  showActiveTheme(getPreferredTheme());
  $$("[data-bs-theme-value]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const theme = toggle.dataset.bsThemeValue;
      setStoredTheme(theme);
      setTheme(theme);
      showActiveTheme(theme, true);
    });
  });
};

// === Init All ===
window.addEventListener("DOMContentLoaded", () => {
  [
    () => setTheme(getPreferredTheme()),
    initThemeListener,
    initThemeSwitcher,
  ].forEach((fn) => fn());
});
