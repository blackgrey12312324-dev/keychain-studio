"use strict";

/* =========================================================
   Shared helpers for every page: language, words, small tools.
   (You don't need to edit this file.)
   ========================================================= */
const LANGS = ["en", "th", "ru"];
const STORE_KEY = "rc-lang";

function pickLang() {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch (e) { /* storage blocked */ }
  const nav = (navigator.language || "en").slice(0, 2);
  return LANGS.includes(nav) ? nav : "en";
}

const ui = { lang: pickLang() };

function getPath(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
}
function setPath(obj, path, value) {
  const keys = path.split(".");
  let o = obj;
  for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]];
  o[keys[keys.length - 1]] = value;
}
function t(path, vars, lang = ui.lang) {
  let v = getPath(I18N[lang], path);
  if (v == null) v = getPath(I18N.en, path);
  if (v == null) return path;
  if (typeof v === "string" && vars) v = v.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ""));
  return v;
}
const lab = (group, key, lang) => t(`labels.${group}.${key}`, null, lang);
const tr = (obj, field, lang = ui.lang) => obj[`${field}_${lang}`] || obj[field];
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
const money = (n) => CONFIG.currency + n;
const igLink = () => "https://ig.me/m/" + CONFIG.instagram;

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  ta.remove();
  return ok ? Promise.resolve() : Promise.reject(new Error("copy failed"));
}

/* Fill every element that has data-i18n="path.to.words" */
function applyStaticText() {
  document.documentElement.lang = ui.lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
  document.querySelectorAll("[data-lang]").forEach((b) => {
    const on = b.dataset.lang === ui.lang;
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", on);
  });
}

/* Language buttons + a list of things to re-draw when the language changes */
const langListeners = [applyStaticText];
function onLangChange(fn) { langListeners.push(fn); }
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-lang]");
  if (!b) return;
  ui.lang = b.dataset.lang;
  try { localStorage.setItem(STORE_KEY, ui.lang); } catch (err) { /* storage blocked */ }
  langListeners.forEach((fn) => fn());
});

/* Mobile menu */
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-menu]");
  if (!b) return;
  const open = document.body.classList.toggle("menu-open");
  b.setAttribute("aria-expanded", open);
});

/* =========================================================
   Header and footer, shared by every page
   ========================================================= */
function renderChrome() {
  const N = (k) => t("nav." + k);
  const page = document.body.dataset.page;
  const link = (href, key, id) => `<a href="${href}" class="${page === id ? "here" : ""}">${N(key)}</a>`;
  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `
      <p class="announce">${N("announce")}</p>
      <div class="nav-row">
        <button type="button" class="menu-btn" data-menu aria-expanded="false" aria-controls="nav-links"><span class="bars" aria-hidden="true"></span><span class="sr">${N("menu")}</span></button>
        <a class="wordmark" href="index.html">${CONFIG.shopName}</a>
        <nav class="nav-links" id="nav-links" aria-label="Main">
          ${link("index.html#shop", "shop", "")}
          <div class="dd">
            <button type="button" class="dd-btn" aria-haspopup="true">${N("sections")} <span aria-hidden="true">▾</span></button>
            <div class="dd-menu">${[["sec-keychains", "Keychains & necklaces"], ["sec-accessories", "Accessories"], ["sec-statues", "Statues & decor"], ["sec-kitchen", "Kitchen & table"], ["sec-cutting", "Wooden cutting boards"], ["sec-paint", "Paintings"], ["sec-gift", "Custom gifts"]].map(([id, nm]) => `<a href="index.html#${id}">${nm}</a>`).join("")}</div>
          </div>
          ${link("idea.html", "idea", "idea")}
          ${link("index.html#faq", "faq", "")}
        </nav>
        <div class="nav-end">
          <div class="langs" role="group" aria-label="Language">
            <button type="button" data-lang="en">EN</button><button type="button" data-lang="th">TH</button><button type="button" data-lang="ru">RU</button>
          </div>
        </div>
      </div>`;
  }
  const footer = document.getElementById("site-footer");
  if (footer) {
    const H = (k, v) => t("home." + k, v);
    footer.innerHTML = `
      <div class="foot-inner">
        <div class="foot-brand">
          <a class="wordmark light" href="index.html">${CONFIG.shopName}</a>
          <p>${H("footerTag")}</p>
        </div>
        <nav class="foot-col" aria-label="Shop">
          <a href="index.html#shop">${N("shop")}</a>
          <a href="index.html#sec-keychains">${N("sections")}</a>
          <a href="idea.html">${N("idea")}</a>
          <a href="index.html#faq">${N("faq")}</a>
        </nav>
        <div class="foot-col">
          <span class="foot-label">${H("follow")}</span>
          <a href="https://www.instagram.com/${CONFIG.instagram}/" target="_blank" rel="noopener">Instagram</a>
          <a href="${CONFIG.facebook}" target="_blank" rel="noopener">Facebook</a>
          <a href="${igLink()}" target="_blank" rel="noopener">${H("contact")}</a>
        </div>
      </div>
      <p class="foot-small">© ${new Date().getFullYear()} ${CONFIG.shopName}. Handmade in Phuket.</p>`;
  }
  applyStaticText();
}
langListeners.unshift(renderChrome);
