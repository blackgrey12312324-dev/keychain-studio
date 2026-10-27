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

/* Any English text that has no entry in i18n.js is looked up in i18n-extra.js (PHRASES) and swapped automatically,
   so pressing TH or RU translates the whole page. The English original is remembered, so EN restores it. */
const ATTRS = ["placeholder", "alt", "title", "aria-label"];
function phrase(s) {
  const P = typeof PHRASES !== "undefined" ? PHRASES[ui.lang] : null;
  if (!P) return null;
  const key = s.trim();
  if (!key) return null;
  if (P[key]) return P[key];
  const i = key.lastIndexOf(", ");
  if (i > 0) {
    const head = key.slice(0, i), tail = key.slice(i + 2);
    if (P[head] || P[tail]) return (P[head] || head) + ", " + (P[tail] || tail);
  }
  return null;
}
function swapText(cur, en) {
  if (ui.lang === "en") return en;
  const p = phrase(en);
  return p == null ? en : en.replace(en.trim(), p);
}
function translateTree(root) {
  if (!root) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const pe = n.parentElement;
    if (!pe || pe.tagName === "SCRIPT" || pe.tagName === "STYLE" || pe.tagName === "TEXTAREA") continue;
    const cur = n.nodeValue;
    const en = n._en !== undefined && cur === n._out ? n._en : cur;
    const out = swapText(cur, en);
    if (out !== cur) { n._en = en; n._out = out; n.nodeValue = out; }
    else if (n._en !== undefined && cur === n._out) { n._en = undefined; }
  }
  const els = root.querySelectorAll ? root.querySelectorAll("[placeholder],[alt],[title],[aria-label],[data-en-placeholder],[data-en-alt],[data-en-title],[data-en-aria-label]") : [];
  els.forEach((el) => ATTRS.forEach((a) => {
    const stored = el.getAttribute("data-en-" + a);
    const cur = el.getAttribute(a);
    if (cur == null) return;
    const en = stored != null && cur === el.getAttribute("data-out-" + a) ? stored : cur;
    const out = swapText(cur, en);
    if (out !== cur) { el.setAttribute("data-en-" + a, en); el.setAttribute("data-out-" + a, out); el.setAttribute(a, out); }
  }));
  if (root === document.body) {
    if (document._titleEn === undefined || document.title !== document._titleOut) document._titleEn = document.title;
    const tt = swapText(document.title, document._titleEn);
    if (tt !== document.title) { document._titleOut = tt; document.title = tt; }
  }
}
let trTimer = 0;
function scheduleTranslate() { clearTimeout(trTimer); trTimer = setTimeout(() => translateTree(document.body), 60); }
if (document.body) {
  new MutationObserver(scheduleTranslate).observe(document.body, { childList: true, subtree: true, characterData: true });
  scheduleTranslate();
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
  scheduleTranslate();
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
          <a href="index.html#shop" class="nav-cta nav-shop">${N("shop")}</a>
          <a href="design.html?start=1" class="nav-cta nav-design">${N("design")}</a>
          <div class="dd">
            <button type="button" class="dd-btn nav-cta nav-sec" aria-haspopup="true">${N("sections")} <span aria-hidden="true">▾</span></button>
            <div class="dd-menu">${[["sec-keychains", "Keychains & necklaces"], ["sec-accessories", "Accessories"], ["sec-statues", "Statues & decor"], ["sec-kitchen", "Dining & restaurant"], ["sec-cutting", "Wooden cutting boards"], ["sec-paint", "Any size canvas"], ["sec-gift", "Custom gifts"], ["sec-send", "Send us a photo"]].map(([id, nm]) => `<a href="index.html#${id}">${nm}</a>`).join("")}</div>
          </div>
          <a href="idea.html" class="nav-cta${page === "idea" ? " here" : ""}">${N("idea")}</a>
          <a href="index.html#faq" class="nav-cta">${N("faq")}</a>
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
