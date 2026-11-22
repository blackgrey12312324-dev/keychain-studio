"use strict";

/* =========================================================
   The keychain designer (design.html).
   Prices, colours, add-ins and presets live in config.js.
   ========================================================= */
Object.assign(ui, {
  cat: "", step: 0, visited: new Set([0]), side: "front", slot: 0, photo: "",
  full: false, mode: "move", zoom: 1, pan: [0, 0],
  chosen: false, open: new Set(), inkCol: 0, pour: { id: "", amount: "m", size: "s" }, pourHistory: [], brush: { tool: "ink", color: "", size: "m" },
});
const STEP_COUNT = I18N.en.steps.length;
const LAST = STEP_COUNT - 1;

/* =========================================================
   Design state
   ========================================================= */
const DEFAULT_COLORS = ["#1F6BC0", "#4F8A9C", "#E6E0D8"];
// Until a customer picks colours the piece shows as clear resin, so the colours they choose are the only colour they see.
const isFresh = (d) => d.style !== "ocean" && Array.isArray(d.picked) && d.picked.length === 0 && d.colors.join() === DEFAULT_COLORS.join();
function mixHex(a, b) { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const x = p(a), y = p(b); return "#" + x.map((v, i) => Math.round((v + y[i]) / 2).toString(16).padStart(2, "0")).join(""); }
function applyPicked(d) {
  const p = d.picked;
  if (!p || !p.length) return;
  if (p.length === 1) d.colors = [p[0], p[0], p[0]];
  else if (p.length === 2) d.colors = d.style === "ink" ? [p[0], p[1], p[0]] : [p[0], mixHex(p[0], p[1]), p[1]];
  else d.colors = p.slice();
}
function defaultDesign() {
  return {
    shape: "A",
    cm: { w: 30, h: 40 },
    qty: 1,
    partial: 0,
    chess: { a: { c1: "", c2: "#E6E0D8", foil: true }, b: { c1: "#14151A", c2: "", foil: true } },
    second: "",
    style: "gradient",
    colors: DEFAULT_COLORS.slice(),
    picked: [],
    deco: "",
    clearParts: false,
    font: "block",
    gradient: { direction: "down", glitter: "none" },
    crush: [],
    photo: { on: false, x: 0, y: 0, zoom: 1 },
    letters: { text: "", metal: "gold", size: "s", layout: "word", x: 150, y: 290, rot: 0, seed: 7 },
    ink: { amount: "medium", background: "clear", spread: "all", cells: false, shimmer: "none", flow: "spread" },
    inkDrops: [],
    inkSize: "m",
    ocean: { sand: "middle", wave: "middle", foam: "frothy", sandColor: "natural", size: "medium", dir: "flat" },
    addins: {},
    paint: [],
    edge: "none",
    edgeColor: "#2BA59A",
    back: "same",
    metal: "gold",
    hardware: "none",
    tassel: { type: "none", ombre: true, color1: "#F3C6DD", color2: "#F7B89A", cord: "gold", photo: "" },
    extra: "none",
    note: "",
  };
}

const copy = (v) => JSON.parse(JSON.stringify(v));
function merge(base, extra) {
  for (const key in extra) {
    const v = extra[key];
    const isObj = v && typeof v === "object" && !Array.isArray(v);
    if (isObj && key !== "addins" && base[key] && typeof base[key] === "object" && !Array.isArray(base[key])) merge(base[key], v);
    else base[key] = copy(v);
  }
  return base;
}

function catOf(shape) {
  if (isLetter(shape) || isNumber(shape)) return "keychains";
  const c = CONFIG.shapes.find((x) => x.id === shape);
  if (!c) return "keychains";
  if (PENDANTS.includes(shape) || c.mold === "groovy") return "keychains";
  if (["bookmark", "bm-paw", "bm-bunny", "bm-cat", "feather", "comb", "comb-moon", "hairpin", "pen", "blade"].includes(shape) || c.tex === "glass" || /^bm-/.test(shape)) return "accessories";
  if (shape === "frame-oval") return "gift";
  if (shape === "canvas-rect") return "paint";
  if (["board", "wood-round", "wood-slice", "wood-tray", "board-rect", "board-whale", "board-whale-tail"].includes(shape)) return "cutting";
  if (["game-ttt", "game-chess", "domino-set"].includes(shape)) return "statues";
  return "kitchen";
}
const SHOW_PRICES = !!CONFIG.showPrices;
let design = defaultDesign();

function parseVal(v) {
  if (v === "true") return true;
  if (v === "false") return false;
  return v;
}
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* =========================================================
   Helpers: price, names, codes
   ========================================================= */

function blockedReason(id, d, lang = ui.lang) {
  const rule = CONFIG.incompatible[id];
  return rule && rule.styles.includes(d.style) ? tr(rule, "why", lang) : "";
}
// How big a mold is: 0 small (letters, tags, keychain shapes, bookmarks), 1 medium, 2 big. Pieces that are too big for the mold are not offered.
function moldRank(shape) {
  const c = CONFIG.shapes.find((x) => x.id === shape);
  const s = c && c.size;
  return s === "big" ? 2 : s === "medium" ? 1 : 0;
}
const CHARM_GROUPS = ["small", "seaanimals", "metalsea", "charms"];
const NEED = { paperflowers: 2, trees: 2, nature: 1, lights: 1, dried: 1 };
const INSIDE_STEP = 7;
const COLOURS_STEP = 4, GLITTER_STEP_NO = 6;
const SEA_WATER = ["#0F3D8C", "#2373C4", "#5BB6C8"];   // deep navy to royal blue to turquoise, like Anna's sea pours   // the sea style always uses the same water colours
// Clear resin has no colour or details step (it is decorated with glitter and things inside); the sea style has fixed colours and no glitter.
const skipStep = (i, d) => (isGame(d.shape) && (i === 3 || i === 5)) || (d.style === "ocean" && (i === COLOURS_STEP || i === GLITTER_STEP_NO)) || (d.style === "clear" && (i === COLOURS_STEP || i === 5));
// gradient is only coloured resin + glitter: nothing goes inside. Ink takes charms and dried/pressed flowers.
const CUP_SHAPES = ["coaster", "wood-coaster"];
const ALL_CUPS = ["coaster", "coaster-set", "wood-coaster", "coaster-stone"];
const isCup = (sh) => ALL_CUPS.includes(sh);
const noClear = (sh) => isCup(sh) || sh === "canvas-rect";
function qtyBlock() {
  if (!CUP_SHAPES.includes(design.shape)) return "";
  const n = design.qty || 1;
  return `<div class="field qty-field"><span class="field-label">${U("qtyH")}</span><div class="qty"><button type="button" data-qty="-1" aria-label="-" ${n <= 1 ? "disabled" : ""}>−</button><b>${n}</b><button type="button" data-qty="1" aria-label="+" ${n >= 50 ? "disabled" : ""}>+</button></div><p class="small-note">${U("qtyNote")}</p></div>`;
}
const isGame = (sh) => sh === "game-chess" || sh === "game-ttt";
const noInside = (d) => (d.style === "gradient" && d.shape !== "frame-oval") || catOf(d.shape) === "cutting" || isGame(d.shape);
const INK_GROUPS = ["small", "seaanimals", "charms", "flowers", "dried"];
function fits(a, d) {
  if ((d.style === "gradient" && d.shape !== "frame-oval") || catOf(d.shape) === "cutting" || isGame(d.shape)) return false;
  if (d.style === "ocean") return a.group === "sea" && !a.metal;
  if (d.style === "ink" && !INK_GROUPS.includes(a.group)) return false;
  if (d.deco === "natural" && CHARM_GROUPS.includes(a.group)) return false;
  if (d.deco === "charms" && !CHARM_GROUPS.includes(a.group)) return false;
  const need = a.id === "tree-small" || a.id.startsWith("sm-crown") ? 1 : NEED[a.group] || 0;   // crowns are thick: medium and big molds only
  if (need > moldRank(d.shape)) return false;
  if (isCup(d.shape) && (CHARM_GROUPS.includes(a.group) || a.id === "frog")) return false;
  // thick 3D pieces (crowns, little roses, metal charms) cannot go in thin molds such as bookmarks, pens and combs
  const sc = CONFIG.shapes.find((x) => x.id === d.shape);
  if (sc && sc.size === "thin" && (a.group === "charms" || a.group === "metalsea" || /^sm-(crown|rose|turtle|crab)/.test(a.id))) return false;
  return canHold(d.shape, a.id);
}
// does the piece physically fit inside the mold (an empty mold, anywhere)? Cached per mold and piece.
const _hold = {};
function canHold(shape, id) {
  const k = shape + "|" + id + "|" + (CONFIG.shapes.find((x) => x.id === shape) || {}).d;
  if (k in _hold) return _hold[k];
  let ok = false;
  try {
    const [T, B] = bounds(shape);
    outer: for (let y = T; y <= B; y += 6) for (let x = 40; x <= 260; x += 6) if (itemFits(shape, x, y, id)) { ok = true; break outer; }
  } catch (e) { ok = true; }
  return (_hold[k] = ok);
}
function activeAddins(d) {
  return CONFIG.addins.filter((a) => d.addins[a.id] && !blockedReason(a.id, d) && fits(a, d));
}
const isLetter = (sh) => /^[A-Z]$/.test(sh);
const isNumber = (sh) => /^[0-9]$/.test(sh);
const moldFamily = (sh) => (isLetter(sh) ? "letter" : isNumber(sh) ? "number" : sh);
function shapeName(shape, lang = ui.lang) {
  const s = CONFIG.shapes.find((x) => x.id === shape);
  if (s) return tr(s, "name", lang);
  return (/[0-9]/.test(shape) ? t("ui.number", null, lang) : t("ui.letter", null, lang)) + " " + shape;
}
function colorName(hex, lang = ui.lang) {
  const c = CONFIG.colors.find((x) => x.hex.toLowerCase() === String(hex).toLowerCase());
  return c ? tr(c, "name", lang) : String(hex).toUpperCase();
}

function priceOf(d, lang = ui.lang) {
  const P = CONFIG.prices;
  const L = (k, v) => t("price." + k, v, lang);
  const lines = [[L("keychain", { shape: shapeName(d.shape, lang) }), P.base]];
  if (P.style[d.style]) lines.push([L("style", { style: lab("style", d.style, lang) }), P.style[d.style]]);
  for (const a of activeAddins(d)) if (a.price) lines.push([tr(a, "name", lang), a.price]);
  if (P.edge[d.edge]) lines.push([L("edge", { edge: lab("edge", d.edge, lang) }), P.edge[d.edge]]);
  if (P.hardware[d.hardware]) lines.push([lab("hardware", d.hardware, lang), P.hardware[d.hardware]]);
  if (P.tassel[d.tassel.type]) lines.push([L("tassel", { t: lab("tassel", d.tassel.type, lang) }), P.tassel[d.tassel.type]]);
  if (d.tassel.type !== "none" && d.tassel.ombre) lines.push([L("ombre"), P.ombre]);
  if (d.paint.length && P.paint) lines.push([L("paint"), P.paint]);
  if (P.extra[d.extra]) lines.push([lab("extra", d.extra, lang), P.extra[d.extra]]);
  if (d.second) lines.push([L("matching", { l: d.second }), P.secondKeychain]);
  return { lines, total: lines.reduce((s, l) => s + l[1], 0) };
}

function hashText(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}
function designCode(d) {
  const shape = d.shape.length === 1 ? d.shape : d.shape.toUpperCase();
  const tail = hashText(JSON.stringify(d)).toString(36).slice(0, 4).toUpperCase();
  return ["RC", shape, d.style.toUpperCase(), d.metal.toUpperCase(), tail].join("-");
}

function styleDetails(d, lang) {
  const low = (s) => (lang === "en" ? s.toLowerCase() : s);
  if (d.style === "gradient") {
    const g = d.gradient;
    return [lab("direction", g.direction, lang), t("sum.glitter", null, lang) + ": " + low(lab("glitter", g.glitter, lang)),
      d.clearParts ? low(t("ui.clearWindow", null, lang)) : ""].filter(Boolean).join(", ");
  }
  if (d.style === "ink") {
    const k = d.ink;
    return [k.flow === "tight" ? t("ui.inkFlowTight", null, lang).toLowerCase() : t("ui.inkFlowWide", null, lang).toLowerCase(), t("ui.inkDrops", { n: (d.inkDrops || []).length }, lang),
      t("sum.bg", null, lang) + ": " + low(lab("background", k.background, lang)),
      k.cells ? low(t("ui.cells", null, lang)) : "",
      k.shimmer !== "none" ? t("sum.shimmer", null, lang) + ": " + low(lab("shimmer", k.shimmer, lang)) : ""].filter(Boolean).join(", ");
  }
  if (d.style === "ocean") {
    const o = d.ocean;
    return [t("sum.sand", null, lang) + ": " + low(lab("sand", o.sand, lang)), lab("waveSize", o.size || "medium", lang), lab("waveDir", o.dir || "flat", lang)].filter(Boolean).join(", ");
  }
  return "";
}

function tasselText(d, lang) {
  const tt = d.tassel;
  if (tt.type === "none") return lab("tassel", "none", lang);
  const cols = tt.ombre ? t("sum.ombreTo", { a: colorName(tt.color1, lang), b: colorName(tt.color2, lang) }, lang) : colorName(tt.color1, lang);
  if (tt.photo) return `${lab("tassel", "silk", lang)}, ${CONFIG.tassels.find((x) => x.id === tt.photo).name}`;
  return `${lab("tassel", tt.type, lang)}, ${cols}, ${t("sum.cordIs", { c: lab("cord", tt.cord, lang) }, lang)}`;
}

function summaryLines(d, lang = ui.lang) {
  const S = (k, v) => t("sum." + k, v, lang);
  const L = [];
  L.push([S("shape"), shapeName(d.shape, lang) + (isLetter(d.shape) || isNumber(d.shape) ? ` (${lab("font", d.font || "block", lang)})` : "")]);
  if (isGame(d.shape) && d.chess) {
    const nm = (h) => (h ? colorName(h, lang) : "transparent");
    const tt = d.shape === "game-ttt";
    for (const [k, lbl] of (tt ? [["a", "Board colour"], ["b", "Lines, X and O colour"]] : [["a", "Light squares"], ["b", "Dark squares"]])) { const c = d.chess[k]; L.push([lbl, [nm(c.c1), !tt && c.c2 ? nm(c.c2) : ""].filter(Boolean).join(" + ") + (c.foil ? ", gold foil" : "")]); }
  }
  if (CUP_SHAPES.includes(d.shape) && (d.qty || 1) > 1) L.push([lang === "en" ? "Quantity" : t("ui.qtyH", null, lang), `${d.qty} identical`]);
  if (d.shape === "game-ttt" || d.shape === "game-chess") { if (d.crush && d.crush.length) L.push([S("glitter") || "Glitter", "yes"]); return L; }
  if ((d.shape === "board-rect" || d.shape === "canvas-rect") && d.cm) L.push([lang === "en" ? "Size" : t("ui.cmTitle", null, lang), `${d.cm.w} × ${d.cm.h} cm`]);
  const det = styleDetails(d, lang);
  L.push([S("style"), lab("style", d.style, lang) + (det ? " (" + det + ")" : "")]);
  if (d.style !== "clear" && d.style !== "ocean") L.push([S("colours"), d.colors.map((c) => colorName(c, lang)).join(", ")]);
  const ad = activeAddins(d).map((a) => {
    const s = d.addins[a.id];
    const parts = [tr(a, "name", lang)];
    const low = (x) => (lang === "en" ? x.toLowerCase() : x);
    if (!a.single) parts.push(low(lab("amount", s.amount, lang)));
    if (a.drag && s.moved) parts.push(S("placed"));
    else if (a.id !== "glow") parts.push(s.place === "anna" ? lab("place", "anna", lang).replace(" 💛", "") : low(lab("place", s.place, lang)));
    if (!a.img) parts.push(colorName(s.color, lang));
    return parts.join(", ");
  });
  L.push([S("addins"), ad.length ? ad.join("; ") : S("none")]);
  if (d.crush.length) {
    const n = {};
    d.crush.forEach((c) => (n[c[0]] = (n[c[0]] || 0) + 1));
    L.push([S("glass"), Object.keys(n).sort((a, b) => n[b] - n[a]).map((id) => glitterName(id, lang)).join(", ")]);
  }
  if (d.photo && d.photo.on) L.push([S("photo"), S("photoText")]);
  if (d.letters.text) L.push([S("letters"), `"${d.letters.text}", ${lab("lmetal", d.letters.metal, lang)}, ${lab("llayout", d.letters.layout, lang)}`]);
  if (d.paint.length) L.push([S("paint"), S("strokes", { n: d.paint.length })]);
  if (hasHardware(d.shape)) {
    if (d.hardware !== "none") L.push([S("chain"), `${lab("metal", d.metal, lang)}, ${lab("hardware", d.hardware, lang)}`]);
    if (d.hardware !== "none") L.push([S("tassel"), tasselText(d, lang)]);
  }
  if (d.second) L.push([S("matching"), S("matchingText", { l: d.second })]);
  return L;
}

function encodeDesign(d) {
  const bytes = new TextEncoder().encode(JSON.stringify(d));
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}
function decodeDesign(s) {
  const bin = atob(s);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}
function shareLink() {
  const d = copy(design);
  delete d.note;
  if (d.crush.length > 150) d.crush = [];   // too long for a link; Anna gets the colours in the message instead
  return location.href.split("#")[0] + "#d=" + encodeURIComponent(encodeDesign(d));
}

// The message Anna receives is always in English, so she can read every order the same way.
function orderText() {
  const lines = ["Hi Anna! I designed a keychain on Keychain Studio 💛", "Design code: " + designCode(design), ""];
  for (const [k, v] of summaryLines(design, "en")) lines.push(`${k}: ${v}`);
  if (SHOW_PRICES) lines.push("", "Estimated price: " + money(priceOf(design, "en").total));
  if (design.style === "ink") lines.push("Ink note: the ink spreads while it cures, so the finished piece will not look exactly like the preview.");
  if (design.note.trim()) lines.push("Note: " + design.note.trim());
  if (ui.photo) lines.push(catOf(design.shape) === "cutting" ? "(I'll send a photo of the custom shape I want in this chat 📷)" : "(I'll send my reference photo in this chat 📷)");
  if (design.crush.length > 150) lines.push("(I'll send a screenshot of where my glitter goes 📷)");
  if (ui.lang !== "en") lines.push("Language: " + { th: "Thai", ru: "Russian" }[ui.lang]);
  lines.push("", "Open my exact design: " + shareLink());
  return lines.join("\n");
}

/* =========================================================
   Shapes: drawing + "is this point inside?" mask
   ========================================================= */
let uid = 0;
const LETTER_FONTS = {
  block: { family: "'Archivo Black', 'Arial Black', Impact, sans-serif", weight: 400 },
  groovy: { family: "'Bagel Fat One', 'Chewy', 'Comic Sans MS', cursive", weight: 400 },
};
let curFont = "block";
const fontSpec = () => LETTER_FONTS[curFont] || LETTER_FONTS.block;
const PICK_D = "M150 392 C 120 385 62 270 55 212 C 50 168 85 150 150 150 C 215 150 250 168 245 212 C 238 270 180 385 150 392 Z";
const HEART_D = "M150 392 C 60 330, 26 270, 38 212 C 50 154, 122 140, 150 196 C 178 140, 250 154, 262 212 C 274 270, 240 330, 150 392 Z";

function rng(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const METALS = {
  gold: ["#F6DE8A", "#B98B22"],
  silver: ["#F4F6F9", "#98A1AC"],
  rose: ["#F8CFC2", "#BF7A68"],
  black: ["#5C5C61", "#1C1C20"],
};
const SAND = { natural: "#CBB28A", white: "#EEE7D8", golden: "#DDB35C", pink: "#EAC1B5" };

// wooden pieces and big trays/boards are not keychains: no ring, chain or tassel
function hasHardware(shape) { const c = CONFIG.shapes.find((x) => x.id === shape); return !(c && (c.wood || c.size === "big" || c.nohw)); }
// What a new piece starts with: letters and the sea shapes from the letter molds are keychains
// with chain and tassel; the other small molds are mostly pendants (necklace), tassel optional.
const PENDANTS = ["tag", "oval", "square", "curved", "pick", "circle", "heartset"];
const SEA_KEYCHAINS = ["g-starfish", "g-shell", "g-paw", "g-tail", "g-jelly", "g-dolphin"];
function applyDefaults(d) {
  const c = CONFIG.shapes.find((x) => x.id === d.shape);
  if (isLetter(d.shape) || isNumber(d.shape) || (c && c.mold === "groovy")) { d.hardware = "none"; d.tassel.type = "none"; }
  else if (PENDANTS.includes(d.shape)) { d.hardware = "none"; d.tassel.type = "none"; }
  else { d.hardware = "none"; d.tassel.type = "none"; }
}

/* The normal wooden board: any size in centimetres, drawn in proportion */
function syncBoard(d) {
  if (!d || (d.shape !== "board-rect" && d.shape !== "canvas-rect")) return;
  const cm = d.cm || { w: 30, h: 40 }, sh = CONFIG.shapes.find((x) => x.id === d.shape);
  const s = Math.min(240 / cm.w, 280 / cm.h), w = cm.w * s, h = cm.h * s, x0 = 150 - w / 2, y0 = 270 - h / 2, x1 = x0 + w, y1 = y0 + h, r = Math.min(6, w / 6, h / 6);
  sh.d = `M${(x0 + r).toFixed(1)} ${y0.toFixed(1)} H${(x1 - r).toFixed(1)} Q${x1.toFixed(1)} ${y0.toFixed(1)} ${x1.toFixed(1)} ${(y0 + r).toFixed(1)} V${(y1 - r).toFixed(1)} Q${x1.toFixed(1)} ${y1.toFixed(1)} ${(x1 - r).toFixed(1)} ${y1.toFixed(1)} H${(x0 + r).toFixed(1)} Q${x0.toFixed(1)} ${y1.toFixed(1)} ${x0.toFixed(1)} ${(y1 - r).toFixed(1)} V${(y0 + r).toFixed(1)} Q${x0.toFixed(1)} ${y0.toFixed(1)} ${(x0 + r).toFixed(1)} ${y0.toFixed(1)} Z`;
  sh.t = Math.round(y0); sh.b = Math.round(y1); sh.pin = sh.t;
  maskCache = {};
}
function customShape(shape) { const id = shape === "coaster-set" ? "coaster" : shape; return CONFIG.shapes.find((x) => x.id === id && x.d); }
function bounds(shape) {
  const cs = customShape(shape);
  if (cs) return [cs.t, cs.b];
  const b = { tag: [122, 394], heart: [150, 392], circle: [134, 390], star: [133, 400], pick: [150, 392] };
  return b[shape] || [176, 392];
}
function pinTop(shape) {
  const cs = customShape(shape);
  if (cs) return cs.pin;
  const p = { tag: 134, heart: 182, circle: 140, star: 140, pick: 158 };
  return p[shape] || 190;
}

function starPath(cx, cy, R, r, n) {
  let d = "";
  for (let i = 0; i < n * 2; i++) {
    const ang = (Math.PI / n) * i - Math.PI / 2;
    const rad = i % 2 ? r : R;
    d += (i ? "L" : "M") + (cx + rad * Math.cos(ang)).toFixed(1) + " " + (cy + rad * Math.sin(ang)).toFixed(1);
  }
  return d + "Z";
}
function heartPath(x, y, s) {
  return `M${x} ${y + s * 0.9} C ${x - s * 1.4} ${y}, ${x - s * 0.7} ${y - s * 1.1}, ${x} ${y - s * 0.3} C ${x + s * 0.7} ${y - s * 1.1}, ${x + s * 1.4} ${y}, ${x} ${y + s * 0.9} Z`;
}

function shapeMarkup(shape, attrs) {
  switch (shape) {
    case "tag": return `<rect x="82" y="122" width="136" height="272" rx="18" ${attrs}/>`;
    case "heart": return `<path d="${HEART_D}" ${attrs}/>`;
    case "pick": return `<path d="${PICK_D}" ${attrs}/>`;
    case "circle": return `<circle cx="150" cy="262" r="128" ${attrs}/>`;
    case "star": return `<path d="${starPath(150, 270, 136, 60, 5)}" ${attrs}/>`;
    default:
      if (customShape(shape)) return `<path d="${customShape(shape).d}" ${attrs}/>`;
      return `<text x="150" y="392" text-anchor="middle" font-family="${fontSpec().family.replace(/"/g, "'")}" font-weight="${fontSpec().weight}" font-size="300" ${attrs}>${esc(shape)}</text>`;
  }
}

let maskCache = {};
function shapeMask(shape) {
  const key = shape + "|" + curFont;
  if (maskCache[key]) return maskCache[key];
  const c = document.createElement("canvas");
  c.width = 300; c.height = 440;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#000";
  if (shape === "tag") {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(82, 122, 136, 272, 18); else ctx.rect(82, 122, 136, 272);
    ctx.fill();
  } else if (shape === "heart") ctx.fill(new Path2D(HEART_D));
  else if (shape === "pick") ctx.fill(new Path2D(PICK_D));
  else if (customShape(shape)) ctx.fill(new Path2D(customShape(shape).d));
  else if (shape === "circle") { ctx.beginPath(); ctx.arc(150, 262, 128, 0, Math.PI * 2); ctx.fill(); }
  else if (shape === "star") ctx.fill(new Path2D(starPath(150, 270, 136, 60, 5)));
  else {
    ctx.font = `${fontSpec().weight} 300px ${fontSpec().family}`;
    ctx.textAlign = "center";
    ctx.fillText(shape, 150, 392);
  }
  const data = ctx.getImageData(0, 0, 300, 440).data;
  const fn = (x, y) => {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= 300 || y >= 440) return false;
    return data[(y * 300 + x) * 4 + 3] > 128;
  };
  return (maskCache[key] = fn);
}
function insideShape(shape, x, y, pad = 0) {
  const m = shapeMask(shape);
  if (!pad) return m(x, y);
  return m(x, y) && m(x + pad, y) && m(x - pad, y) && m(x, y + pad) && m(x, y - pad);
}

function zoneRange(place, T, B) {
  const h = B - T;
  if (place === "top") return [T + 10, T + h * 0.38];
  if (place === "middle") return [T + h * 0.33, T + h * 0.66];
  if (place === "bottom") return [T + h * 0.62, B - 14];
  return [T + 12, B - 12];
}

const AMT = { few: 0, some: 1, lots: 2 };
const ADDIN_COUNTS = {
  // metal charms (small photo cut-outs) use the default [1, 2, 3]
  goldleaf: [6, 14, 28], glitter: [40, 90, 160], hearts: [3, 7, 14], stars: [4, 9, 18],
  flowers: [1, 2, 4], frog: [1, 1, 1], starfish: [1, 2, 3], shells: [1, 3, 5], pearl: [1, 3, 6], glow: [0, 0, 0],
};

// pick a random point inside the shape, in the chosen zone
function takenSpots(d) {
  const spots = [];
  for (const id in d.addins) if (Array.isArray(d.addins[id].items)) d.addins[id].items.forEach((it) => spots.push(it));
  return spots;
}
// pick a random point inside the shape, in the chosen zone, not on top of other pieces
function randomSpot(d, place, rand, pad = 6, avoid = takenSpots(d)) {
  const [T, B] = bounds(d.shape);
  const [y0, y1] = zoneRange(place, T, B);
  let fallback = null;
  for (let tries = 0; tries < 80; tries++) {
    const zoneY = tries < 50 ? [y0, y1] : [T, B];
    const x = 40 + rand() * 220, y = zoneY[0] + rand() * (zoneY[1] - zoneY[0]);
    if (!insideShape(d.shape, x, y, pad)) continue;
    const spot = [Math.round(x), Math.round(y)];
    if (!fallback) fallback = spot;
    if (avoid.every((o) => Math.hypot(o[0] - x, o[1] - y) > 20)) return spot;
  }
  return fallback || [150, Math.round((T + B) / 2)];
}

function genItems(a, sel, d, rand) {
  const n = (ADDIN_COUNTS[a.id] || [1, 2, 3])[AMT[sel.amount] ?? 1];
  const items = [];
  const avoid = takenSpots(d).filter((it) => !(sel.items || []).includes(it));
  for (let i = 0; i < n; i++) {
    const [x, y] = randomSpot(d, sel.place, rand, a.id === "frog" ? 14 : 6, avoid.concat(items));
    items.push([x, y, a.id === "frog" ? 0 : Math.round(rand() * 40 - 20)]);
  }
  return items;
}
/* ---------- Crushed glass glitter (real photos of the chips) ---------- */
const GLASS = 15;                 // sprite size in drawing units (tiny, so it looks sprinkled)
const GLASS_MAX = 4000;           // keeps the drawing fast
const GLASS_RADIUS = { s: 0, m: 13, l: 28 };   // small = one dot, medium and big sprinkle an area
const GLASS_COUNT = { s: 1, m: 16, l: 95 };
const glitterName = (id, lang = ui.lang) => { const g = CONFIG.glitters.find((x) => x.id === id); return g ? tr(g, "name", lang) : id; };
function lighten(hex, k) { const p = (i) => parseInt(hex.slice(i, i + 2), 16); return "#" + [1, 3, 5].map((i) => Math.round(p(i) + (255 - p(i)) * k).toString(16).padStart(2, "0")).join(""); }
const SPRINKLE_COLOURS = { goldleaf: ["#D4AF37", "#E8C75A", "#B8902A"], hearts: ["#DE2D44", "#FA768D", "#FB9BB2"], stars: ["#F5B510", "#E4BE28", "#EFEAE6"] };
function glassSprite(c) {
  const g = CONFIG.glitters.find((x) => x.id === c[0]) || {};
  const h = (c[1] * 73 + c[2] * 151 + c[3] * 31) >>> 0;
  if (g.shape) {
    const cols = SPRINKLE_COLOURS[c[0]], col = cols[h % cols.length], r = (c[4] / 100) * 3;
    const body = g.shape === "heart" ? `<path d="${heartPath(0, 0, r * 1.05)}" fill="${col}"/>`
      : g.shape === "star" ? `<path d="${starPath(0, 0, r * 1.2, r * 0.5, 5)}" fill="${col}"/>`
      : `<polygon points="${[0, 1, 2, 3, 4].map((k) => { const an = k * 1.26 + (h % 40) / 20, rr = r * (0.55 + ((k * 37 + h) % 10) / 14); return `${(Math.cos(an) * rr).toFixed(1)},${(Math.sin(an) * rr).toFixed(1)}`; }).join(" ")}" fill="${col}" stroke="#FFF3C4" stroke-width="0.25"/>`;
    return `<g transform="translate(${c[1]} ${c[2]}) rotate(${c[3]})" pointer-events="none">${body}</g>`;
  }
  // a single tiny chip of crushed glass, coloured from the real photo of that glitter
  const pal = g.pal || ["#888"];
  const col = lighten(pal[h % pal.length], 0.22), r = (c[4] / 100) * 2.5;
  const pts = [0, 1, 2, 3, 4].map((k) => { const an = k * 1.25 + (h % 31) / 10, rr = r * (0.6 + ((k * 53 + h) % 9) / 11); return `${(Math.cos(an) * rr).toFixed(1)},${(Math.sin(an) * rr).toFixed(1)}`; }).join(" ");
  const shine = h % 4 === 0 ? `<line x1="${(-r * 0.4).toFixed(1)}" y1="${(-r * 0.3).toFixed(1)}" x2="${(r * 0.2).toFixed(1)}" y2="${(-r * 0.5).toFixed(1)}" stroke="#fff" stroke-width="0.5" opacity="0.8"/>` : "";
  return `<g transform="translate(${c[1]} ${c[2]}) rotate(${c[3]})" pointer-events="none"><polygon points="${pts}" fill="${col}" stroke="rgba(0,0,0,0.25)" stroke-width="0.2"/>${shine}</g>`;
}
function glassLayer(d) {
  return d.crush && d.crush.length ? `<g class="crush">${d.crush.map(glassSprite).join("")}</g>` : '<g class="crush"></g>';
}
// add a little pile of chips around a point; returns the new sprites
function stamp(d, id, x, y, amount, size = ui.pour.size) {
  const out = [];
  const n = GLASS_COUNT[size], rad = GLASS_RADIUS[size];
  for (let i = 0; i < n; i++) {
    const an = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * rad;
    out.push([id, Math.round(x + Math.cos(an) * r), Math.round(y + Math.sin(an) * r), Math.floor(Math.random() * 360), Math.round(80 + Math.random() * 45)]);
  }
  d.crush.push(...out);
  if (d.crush.length > GLASS_MAX) d.crush.splice(0, d.crush.length - GLASS_MAX);
  return out;
}
function nearShape(shape, x, y) {
  const m = shapeMask(shape);
  return m(x, y) || m(x + 14, y) || m(x - 14, y) || m(x, y + 14) || m(x, y - 14);
}
// cover (part of) the piece: share = 0..1
function fillGlass(d, id) {
  const [T, B] = bounds(d.shape);
  const step = 4.4, added = [];
  for (let y = T; y <= B; y += step) for (let x = 14; x <= 286; x += step) {
    const px = x + (Math.random() - 0.5) * step * 1.3, py = y + (Math.random() - 0.5) * step * 1.3;
    if (!insideShape(d.shape, px, py)) continue;
    added.push([id, Math.round(px), Math.round(py), Math.floor(Math.random() * 360), Math.round(85 + Math.random() * 40)]);
  }
  d.crush.push(...added);
  if (d.crush.length > GLASS_MAX) d.crush.splice(0, d.crush.length - GLASS_MAX);
  return added.length;
}

/* ---------- Tiny metal letters (a name or word, filled with the real metal) ---------- */
const LTR_SIZE = { s: 13, m: 19, l: 27 };
function lettersLayer(d, pid) {
  const L = d.letters;
  if (!L || !L.text || d.deco === "natural" || d.style === "gradient" || d.style === "ocean") return "";
  const fs = LTR_SIZE[L.size];
  const common = `font-family="Jost, 'Noto Sans Thai', Arial, sans-serif" font-weight="500" font-size="${fs}" fill="url(#${pid}-ltr)" stroke="rgba(0,0,0,0.35)" stroke-width="0.5" paint-order="stroke" style="filter:drop-shadow(0 0.8px 0.8px rgba(0,0,0,0.3))"`;
  let body;
  if (L.layout === "scatter") {
    const R = rng(L.seed * 977 + hashText(L.text));
    const spread = fs * 2.6 + L.text.length * 3;
    body = L.text.split("").filter((c) => c !== " ").map((c) => {
      let ox = 0, oy = 0;
      for (let t = 0; t < 40; t++) {            // keep every letter on the resin, not in a hole
        const a = R() * Math.PI * 2, r = Math.sqrt(R()) * spread;
        ox = Math.cos(a) * r; oy = Math.sin(a) * r * 1.2;
        if (insideShape(d.shape, L.x + ox, L.y + oy, 4)) break;
      }
      return `<text x="${ox.toFixed(1)}" y="${oy.toFixed(1)}" text-anchor="middle" dominant-baseline="central" transform="rotate(${Math.floor(R() * 360)} ${ox.toFixed(1)} ${oy.toFixed(1)})" ${common}>${esc(c)}</text>`;
    }).join("");
  } else {
    body = `<text x="0" y="0" text-anchor="middle" dominant-baseline="central" letter-spacing="${(fs * 0.14).toFixed(1)}" ${common}>${esc(L.text)}</text>`;
  }
  const w = Math.max(40, L.text.length * fs * 0.75), h = fs * 1.6;
  const hit = `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="transparent"/>`;
  return `<g class="ltr" transform="translate(${L.x} ${L.y}) rotate(${L.layout === "scatter" ? 0 : L.rot})">${hit}${body}</g>`;
}

// a spot on solid resin where a word fits: the widest unbroken stretch of the piece
function bestTextSpot(shape) {
  // the middle of the mold: the widest solid stretch on the row closest to the centre
  const m = shapeMask(shape), [T, B] = bounds(shape), mid = (T + B) / 2;
  for (let d = 0; d <= (B - T) / 2; d += 4) {
    for (const y of d === 0 ? [mid] : [mid - d, mid + d]) {
      let start = -1, best = null;
      for (let x = 0; x <= 300; x++) {
        const on = m(x, y);
        if (on && start < 0) start = x;
        if ((!on || x === 300) && start >= 0) { const run = x - start; if (run >= 44 && (!best || run > best[0])) best = [run, Math.round((start + x) / 2)]; start = -1; }
      }
      if (best) return [best[1], Math.round(y)];
    }
  }
  return [150, Math.round(mid)];
}

/* ---------- Customer photo inside the piece (big molds) ---------- */
function photoLayer(d) {
  if (!d.photo || !d.photo.on || !ui.photo || !ui.photoDims) return "";
  const [T, B] = bounds(d.shape), [w, h] = ui.photoDims;
  const k = Math.max(240 / w, (B - T) / h) * d.photo.zoom;
  const pw = w * k, ph = h * k, cx = 150 + d.photo.x, cy = (T + B) / 2 + d.photo.y;
  return `<image href="${ui.photo}" x="${(cx - pw / 2).toFixed(1)}" y="${(cy - ph / 2).toFixed(1)}" width="${pw.toFixed(1)}" height="${ph.toFixed(1)}" preserveAspectRatio="none" pointer-events="none"/>`;
}

function textureLayer(shape) {
  const c = customShape(shape);
  if (!c || !c.tex) return "";
  const wide = c.tex === "stones";
  const R = rng(c.seed * 131 + 7), x0 = wide ? 50 : 134, x1 = wide ? 250 : 166, y0 = c.t + 8, y1 = c.b - 8;
  let s = "";
  const P = () => [x0 + R() * (x1 - x0), y0 + R() * (y1 - y0)];
  if (c.tex === "glass") {
    const cx = 150, cy = y0 + (y1 - y0) * (0.25 + R() * 0.5);
    for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2 + R() * 0.4; s += `<line x1="${cx}" y1="${cy.toFixed(0)}" x2="${(cx + Math.cos(a) * 140).toFixed(0)}" y2="${(cy + Math.sin(a) * 140).toFixed(0)}"/>`; }
    for (let i = 0; i < 26; i++) { const [px, py] = P(), a = R() * Math.PI; const l = 20 + R() * 40; s += `<line x1="${px.toFixed(0)}" y1="${py.toFixed(0)}" x2="${(px + Math.cos(a) * l).toFixed(0)}" y2="${(py + Math.sin(a) * l).toFixed(0)}"/>`; }
  } else if (c.tex === "stones") {
    for (let i = 0; i < 14; i++) { const [px, py] = P(), n = 5 + Math.floor(R() * 2), r = 24 + R() * 10; let d = ""; for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2 + R() * 0.5, rr = r * (0.7 + R() * 0.5); d += (k ? "L" : "M") + (px + Math.cos(a) * rr).toFixed(0) + " " + (py + Math.sin(a) * rr).toFixed(0); } s += `<path d="${d}Z"/>`; }
  } else if (c.tex === "pebbles") {
    for (let i = 0; i < 70; i++) { const [px, py] = P(); s += `<ellipse cx="${px.toFixed(0)}" cy="${py.toFixed(0)}" rx="${(5 + R() * 7).toFixed(0)}" ry="${(4 + R() * 6).toFixed(0)}" transform="rotate(${(R() * 180).toFixed(0)} ${px.toFixed(0)} ${py.toFixed(0)})"/>`; }
  } else if (c.tex === "hearts") {
    for (let i = 0; i < 18; i++) { const [px, py] = P(); s += `<path d="${heartPath(px, py, 5 + R() * 4)}"/>`; }
  } else {
    for (let i = 0; i < 9; i++) { const [px, py] = P(); if (i % 3 === 2) s += `<line x1="${(px - 8).toFixed(0)}" y1="${py.toFixed(0)}" x2="${(px + 8).toFixed(0)}" y2="${py.toFixed(0)}" stroke-width="3"/>`; else s += `<circle cx="${px.toFixed(0)}" cy="${(py + 3).toFixed(0)}" r="5"/>` + [[-7, -5], [-2.5, -9], [2.5, -9], [7, -5]].map(([dx, dy]) => `<circle cx="${(px + dx).toFixed(1)}" cy="${(py + dy).toFixed(1)}" r="2"/>`).join(""); }
  }
  return `<g fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.1" pointer-events="none">${s}</g>`;
}
function gridLines(shape) {
  const g = customShape(shape) && customShape(shape).grid;
  if (!g) return "";
  let s = "";
  for (let i = 0; i <= g.n; i++) {
    const x = g.x0 + ((g.x1 - g.x0) * i) / g.n, y = g.y0 + ((g.y1 - g.y0) * i) / g.n;
    s += `<line x1="${x.toFixed(1)}" y1="${g.y0}" x2="${x.toFixed(1)}" y2="${g.y1}"/><line x1="${g.x0}" y1="${y.toFixed(1)}" x2="${g.x1}" y2="${y.toFixed(1)}"/>`;
  }
  return `<g stroke="rgba(255,255,255,0.55)" stroke-width="1.2" pointer-events="none">${s}</g>`;
}

// the small hole where the ring or chain passes through (only where the piece is solid)
function holeMark(d, id) {
  if (d.hardware === "none" || !hasHardware(d.shape)) return "";
  const y = pinTop(d.shape) + 16;
  if (!insideShape(d.shape, 150, y, 6)) return "";
  return `<circle cx="150" cy="${y}" r="5.5" fill="#EEF3F2" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>`;
}

function ensureItems(d) {
  for (const a of CONFIG.addins) {
    const sel = d.addins[a.id];
    if (sel && a.drag && !Array.isArray(sel.items)) sel.items = genItems(a, sel, d, rng(hashText(a.id + d.shape) + 7));
  }
}
function resetItems(d) {
  for (const id in d.addins) { delete d.addins[id].items; delete d.addins[id].moved; }
}

/* =========================================================
   Drawing the keychain (SVG)
   ========================================================= */
function glitterDots(R, type, colors, T, B) {
  if (type === "none") return "";
  let s = "";
  if (type === "chunky") {
    for (let i = 0; i < 30; i++) {
      const x = 40 + R() * 220, y = T + R() * (B - T), r = 2.5 + R() * 2.5;
      s += `<path d="${starPath(x, y, r, r * 0.8, 3)}" fill="${R() > 0.5 ? "#FFFFFF" : colors[1]}" opacity="0.85"/>`;
    }
    return s;
  }
  for (let i = 0; i < 100; i++) {
    const x = 40 + R() * 220, y = T + R() * (B - T), r = 0.6 + R() * 1.1;
    const col = type === "holo" ? `hsl(${Math.floor(R() * 360)} 90% 75%)` : R() > 0.4 ? "#FFFFFF" : colors[1];
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${col}" opacity="0.9"/>`;
  }
  return s;
}

function inkExtras(d, id, R, T, B, x0, x1, y0, y1, skipBg) {
  const k = d.ink, h = B - T;
  let s = "";
  if (k.cells) for (let i = 0; i < 45; i++) s += `<circle cx="${(40 + R() * 220).toFixed(1)}" cy="${(T + R() * h).toFixed(1)}" r="${(1.5 + R() * 3.5).toFixed(1)}" fill="rgba(255,255,255,0.45)" stroke="#fff" stroke-width="0.8"/>`;
  if (k.shimmer !== "none") {
    const col = k.shimmer === "gold" ? "#E7C45A" : "#FFFFFF";
    for (let i = 0; i < 70; i++) s += `<circle cx="${(40 + R() * 220).toFixed(1)}" cy="${(T + R() * h).toFixed(1)}" r="${(0.5 + R() * 0.8).toFixed(1)}" fill="${col}" opacity="0.85"/>`;
  }
  return s;
}


/* Chess board: two sections (light and dark squares). Each has one or two colours (or clear) and optional gold foil. */
function tttLayer(d, id) {
  const g = (customShape("game-ttt") || {}).grid; if (!g) return "";
  const ch = d.chess || {}, A = ch.a || {}, B = ch.b || {};
  const w = (g.x1 - g.x0) / 3, h = (g.y1 - g.y0) / 3;
  const colA = A.c1, colB = B.c1 || B.c2 || "#14151A";
  let o = "";
  if (colA) o += `<rect x="${g.x0}" y="${g.y0}" width="${g.x1 - g.x0}" height="${g.y1 - g.y0}" fill="${colA}" opacity="0.9"/>`;
  // the # dividers (raised ridges in the mold)
  for (let i = 1; i < 3; i++) o += `<rect x="${(g.x0 + w * i - 3.5).toFixed(1)}" y="${g.y0}" width="7" height="${g.y1 - g.y0}" rx="3" fill="${colB}" opacity="0.9"/><rect x="${g.x0}" y="${(g.y0 + h * i - 3.5).toFixed(1)}" width="${g.x1 - g.x0}" height="7" rx="3" fill="${colB}" opacity="0.9"/>`;
  const X = (cx, cy) => `<path d="M${cx - 13} ${cy - 13} L${cx + 13} ${cy + 13} M${cx + 13} ${cy - 13} L${cx - 13} ${cy + 13}" stroke="${colB}" stroke-width="7" stroke-linecap="round" fill="none"/>`;
  const O = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="14" fill="none" stroke="${colB}" stroke-width="7"/>`;
  const C = (i, j) => [g.x0 + w * (i + 0.5), g.y0 + h * (j + 0.5)];
  o += X(...C(0, 0)) + O(...C(1, 0)) + O(...C(0, 1)) + X(...C(1, 1)) + X(...C(2, 2)) + O(...C(2, 1));
  if (A.foil || B.foil) { let seed = 5; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); for (let n = 0; n < 40; n++) { const fx = g.x0 + rnd() * (g.x1 - g.x0), fy = g.y0 + rnd() * (g.y1 - g.y0), r = 1 + rnd() * 1.8, a = rnd() * 6; o += `<polygon points="${[0, 1, 2, 3].map((q) => `${(fx + Math.cos(a + q * 1.7) * r * (1 + (q % 2) * 0.6)).toFixed(1)},${(fy + Math.sin(a + q * 1.7) * r).toFixed(1)}`).join(" ")}" fill="${n % 2 ? "#E5C15A" : "#C89B2E"}" opacity="0.95"/>`; } }
  return `<g pointer-events="none">${o}</g>`;
}
function dominoLayer(d) {
  const tiles = [[40, 150, 0], [162, 150, 1], [40, 282, 2], [162, 282, 3]];
  const P = { 0: [], 1: [[.5, .5]], 2: [[.3, .3], [.7, .7]], 3: [[.3, .3], [.5, .5], [.7, .7]], 4: [[.3, .3], [.7, .3], [.3, .7], [.7, .7]], 5: [[.3, .3], [.7, .3], [.5, .5], [.3, .7], [.7, .7]], 6: [[.3, .25], [.7, .25], [.3, .5], [.7, .5], [.3, .75], [.7, .75]] };
  const vals = [[6, 4], [3, 5], [2, 1], [5, 0]];
  let o = "";
  tiles.forEach(([x, y, k]) => {
    o += `<rect x="${x + 8}" y="${y + 58}" width="82" height="3.5" rx="1.7" fill="rgba(20,30,40,.55)"/>`;
    [0, 1].forEach((half) => (P[vals[k][half]] || []).forEach(([px, py]) => { o += `<circle cx="${(x + 10 + px * 78).toFixed(1)}" cy="${(y + 6 + half * 56 + py * 52).toFixed(1)}" r="5.4" fill="rgba(255,255,255,.92)" stroke="rgba(20,30,40,.35)" stroke-width="1"/>`; }));
  });
  return `<g pointer-events="none">${o}</g>`;
}
function chessLayer(d, id) {
  const g = (customShape(d.shape) || {}).grid; if (!g) return "";
  const ch = d.chess || { a: { c1: "", c2: "", foil: false }, b: { c1: "", c2: "", foil: false } };
  const w = (g.x1 - g.x0) / g.n, h = (g.y1 - g.y0) / g.n;
  let defs = "", out = "";
  ["a", "b"].forEach((k) => { const c = ch[k]; if (c.c1 && c.c2) defs += `<linearGradient id="${id}-ch${k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.c1}"/><stop offset="1" stop-color="${c.c2}"/></linearGradient>`; });
  let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let j = 0; j < g.n; j++) for (let i = 0; i < g.n; i++) {
    const k = (i + j) % 2 ? "b" : "a", c = ch[k], x = g.x0 + i * w, y = g.y0 + j * h;
    const col = c.c1 && c.c2 ? `url(#${id}-ch${k})` : c.c1 || c.c2;
    if (col) out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${col}" opacity="0.94"/>`;
    if (c.foil) for (let n = 0; n < 7; n++) {
      const fx = x + 2 + rnd() * (w - 4), fy = y + 2 + rnd() * (h - 4), r = 0.8 + rnd() * 1.6, a = rnd() * 6;
      out += `<polygon points="${[0, 1, 2, 3].map((q) => `${(fx + Math.cos(a + q * 1.7) * r * (1 + (q % 2) * 0.6)).toFixed(1)},${(fy + Math.sin(a + q * 1.7) * r).toFixed(1)}`).join(" ")}" fill="${n % 2 ? "#E5C15A" : "#C89B2E"}" opacity="0.95"/>`;
    }
  }
  return `<defs>${defs}</defs><g pointer-events="none">${out}</g>`;
}
function chessPanel() {
  const ch = design.chess;
  const ttt = design.shape === "game-ttt";
  const sw = (sec, key, cur, withNone) => {
    const list = [["", withNone ? U("chessNone") : U("chessClear")]].concat(CONFIG.colors.map((c) => [c.hex, c.name]));
    return `<div class="swatches">${list.map(([hex, nm]) => `<button type="button" class="swatch ${cur === hex ? "on" : ""} ${hex ? "" : "clear"}" data-chess="${sec}.${key}" data-v="${hex}" title="${esc(nm)}" aria-pressed="${cur === hex}" ${hex ? `style="background:${hex}"` : ""}></button>`).join("")}</div>`;
  };
  const sec = (k, title) => {
    const c = ch[k];
    return `<div class="field chess-sec"><span class="field-label">${title}</span>
      <p class="small-note">${U("chessC1")}</p>${sw(k, "c1", c.c1, false)}
      ${ttt ? "" : `<p class="small-note">${U("chessC2")}</p>${sw(k, "c2", c.c2, true)}`}
      <div class="chips"><button type="button" class="chip ${c.foil ? "on" : ""}" data-chess="${k}.foil" data-v="${c.foil ? "" : "1"}" aria-pressed="${!!c.foil}">${U("chessFoil")}</button></div></div>`;
  };
  const tone = (c) => c.c1 || c.c2 || "rgba(190,205,210,0.7)";
  const glyphs = ["♚", "♛", "♝", "♞", "♜", "♟"], names = ["King", "Queen", "Bishop", "Knight", "Rook", "Pawn"];
  const row = (c) => `<div class="chess-pieces">${glyphs.map((g, i) => `<span title="${names[i]}" style="color:${tone(c)}">${g}</span>`).join("")}</div>`;
  return `<h2>${ttt ? U("tttTitle") : U("chessTitle")}</h2><p class="hint">${ttt ? U("tttNote") : U("chessNote")}</p>
    ${sec("a", ttt ? U("tttBoard") : U("chessLight"))}${sec("b", ttt ? U("tttMarks") : U("chessDark"))}
    ${ttt ? "" : `<div class="field"><span class="field-label">${U("chessPieces")}</span>${row(ch.a)}${row(ch.b)}<p class="small-note">${U("chessPiecesNote")}</p></div>`}`;
}
function styleLayer(d, id, R, T, B) {
  const c = d.colors;
  const h = B - T;
  if (d.style === "clear") return "";

  if (d.style === "gradient") {
    const g = d.gradient;
    const dirs = { down: [0, 0, 0, 1], right: [0, 0, 1, 0], diagonal: [0, 0, 1, 1] };
    const stops = [[0, 0], [0.2, 0], [0.4, 1], [0.6, 1], [0.8, 2], [1, 2]].map(([o, i]) => `<stop offset="${o}" stop-color="${c[i]}" stop-opacity="1"/>`).join("");
    const grad = g.direction === "center"
      ? `<radialGradient id="${id}-g" cx="0.5" cy="0.55" r="0.6">${stops}</radialGradient>`
      : `<linearGradient id="${id}-g" x1="${dirs[g.direction][0]}" y1="${dirs[g.direction][1]}" x2="${dirs[g.direction][2]}" y2="${dirs[g.direction][3]}">${stops}</linearGradient>`;
    const mask = d.clearParts
      ? `<mask id="${id}-m"><rect x="0" y="100" width="300" height="320" fill="#fff"/><ellipse cx="150" cy="${T + h * 0.5}" rx="190" ry="30" transform="rotate(-24 150 ${T + h * 0.5})" fill="#000" filter="url(#${id}-soft)"/></mask>`
      : "";
    return `<defs>${grad}${mask}</defs>
      <g ${d.clearParts ? `mask="url(#${id}-m)"` : ""}>
        <rect x="0" y="${T - 20}" width="300" height="${h + 40}" fill="url(#${id}-g)"/>
        <image href="images/real/swirl-gray.jpg" x="0" y="${T - 20}" width="300" height="${h + 40}" preserveAspectRatio="xMidYMid slice" style="mix-blend-mode:soft-light" opacity="0.45"/>
        ${glitterDots(R, g.glitter, c, T, B)}
      </g>`;
  }

  if (d.style === "ink") {
    const k = d.ink;
    let s = "";
    if (k.background === "white") s += `<rect x="0" y="100" width="300" height="320" fill="#FBFBFA"/>`;
    if (k.background === "cloudy") {
      s += `<rect x="0" y="100" width="300" height="320" fill="#FFFFFF" opacity="0.45"/>`;
      for (let i = 0; i < 6; i++) s += `<ellipse cx="${40 + R() * 220}" cy="${T + R() * h}" rx="${40 + R() * 40}" ry="${20 + R() * 25}" fill="#FFFFFF" opacity="0.75" filter="url(#${id}-soft)"/>`;
    }
    const zones = {
      all: [40, 260, T, B], top: [40, 260, T, T + h * 0.45], bottom: [40, 260, B - h * 0.45, B],
      left: [30, 150, T, B], right: [150, 270, T, B],
    };
    const [x0, x1, y0, y1] = zones[k.spread];
    if (!(d.inkDrops && d.inkDrops.length) && !k.legacy) {
      // nothing dropped yet: clear resin with only the background / cells / shimmer
      return s + inkExtras(d, id, R, T, B, x0, x1, y0, y1);
    }
    if (d.inkDrops && d.inkDrops.length) {
      const wide = k.flow !== "tight";
      let under = "", over = "";
      // one drop: strongest in the middle, thinning out towards the edge
      let defs = "";
      d.inkDrops.forEach(([ci, x, y, rs], i) => {
        const col = c[ci] || c[0], r = rs * (wide ? 3.6 : 2);
        defs += `<radialGradient id="${id}-d${i}"><stop offset="0" stop-color="${col}" stop-opacity="1"/><stop offset="0.14" stop-color="${col}" stop-opacity="0.96"/><stop offset="0.32" stop-color="${col}" stop-opacity="${wide ? 0.72 : 0.85}"/><stop offset="0.55" stop-color="${col}" stop-opacity="${wide ? 0.4 : 0.22}"/><stop offset="0.8" stop-color="${col}" stop-opacity="${wide ? 0.16 : 0.05}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`;
        over += `<ellipse cx="${x}" cy="${y}" rx="${r.toFixed(0)}" ry="${(r * (0.85 + (i % 3) * 0.08)).toFixed(0)}" fill="url(#${id}-d${i})" transform="rotate(${(i * 47) % 180} ${x} ${y})"/>`;
      });
      s += `<defs>${defs}</defs><g filter="url(#${id}-ink)">${over}</g>`;
      s += `<image href="images/real/swirl-gray.jpg" x="0" y="${T - 20}" width="300" height="${h + 40}" preserveAspectRatio="xMidYMid slice" style="mix-blend-mode:soft-light" opacity="0.55"/>`;
      return s + inkExtras(d, id, R, T, B, x0, x1, y0, y1, true);
    }
    const n = { light: 5, medium: 9, bold: 15 }[k.amount];
    const rBase = { light: 20, medium: 26, bold: 32 }[k.amount];
    const op = { light: 0.55, medium: 0.75, bold: 0.92 }[k.amount];
    let blobs = "";
    for (let i = 0; i < n; i++) {
      const r = rBase + R() * 18;
      blobs += `<ellipse cx="${(x0 + R() * (x1 - x0)).toFixed(0)}" cy="${(y0 + R() * (y1 - y0)).toFixed(0)}" rx="${(r * (0.9 + R() * 0.6)).toFixed(0)}" ry="${(r * (0.6 + R() * 0.5)).toFixed(0)}" fill="${c[i % 3]}" opacity="${op}"/>`;
    }
    s += `<g filter="url(#${id}-ink)">${blobs}</g>`;
    s += `<image href="images/real/swirl-gray.jpg" x="0" y="${T - 20}" width="300" height="${h + 40}" preserveAspectRatio="xMidYMid slice" style="mix-blend-mode:soft-light" opacity="0.7"/>`;
    if (k.cells) {
      for (let i = 0; i < 45; i++) {
        s += `<circle cx="${(x0 + R() * (x1 - x0)).toFixed(1)}" cy="${(y0 + R() * (y1 - y0)).toFixed(1)}" r="${(1.5 + R() * 3.5).toFixed(1)}" fill="rgba(255,255,255,0.45)" stroke="#fff" stroke-width="0.8"/>`;
      }
    }
    if (k.shimmer !== "none") {
      const col = k.shimmer === "gold" ? "#E7C45A" : "#FFFFFF";
      for (let i = 0; i < 70; i++) s += `<circle cx="${(40 + R() * 220).toFixed(1)}" cy="${(T + R() * h).toFixed(1)}" r="${(0.5 + R() * 0.8).toFixed(1)}" fill="${col}" opacity="0.85"/>`;
    }
    return s;
  }

  // sea: water in the colours the customer picked, a wavy sand edge with foam. All drawn, nothing copied from photos.
  const o = d.ocean;
  const sandY = o.sand === "none" ? null : T + h * { low: 0.8, middle: 0.64, high: 0.46 }[o.sand];
  const amp = { calm: 5, medium: 13, big: 25 }[o.size || "medium"];
  const ang = { flat: 0, left: -16, right: 16 }[o.dir || "flat"];
  const edgeY = sandY ?? (B + 40);
  const wavePath = (y, ph, A) => { let p = `M-140 ${y}`; for (let k = 0; k < 8; k++) p += ` q 40 ${(k % 2 ? 1 : -1) * A * (ph ? -1 : 1)} 80 0`; return p; };
  const cw = SEA_WATER;
  const sandCol = "#9A7650";
  const foamW = 12;
  let s = `<defs><linearGradient id="${id}-wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cw[0]}"/><stop offset="0.5" stop-color="${cw[1]}"/><stop offset="1" stop-color="${cw[2]}"/></linearGradient>
    <filter id="${id}-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.27  0 0 0 0 0.18  0 0 0 0.7 0"/></filter></defs>
    <g transform="rotate(${ang} 150 ${(T + B) / 2})">
    <rect x="-140" y="${T - 60}" width="580" height="${edgeY - T + 70}" fill="url(#${id}-wg)"/>
    <path d="${wavePath(edgeY - 70 - amp, 1, amp * 0.7)} V ${edgeY} H -140 Z" fill="#fff" opacity="0.10"/>`;
  if (sandY) {
    s += `<path d="${wavePath(sandY - foamW - 3, 0, amp)}" fill="none" stroke="#fff" stroke-width="${foamW + 6}" opacity="0.4" filter="url(#${id}-soft)"/>
      <path d="${wavePath(sandY - 2, 0, amp)} V 520 H -140 Z" fill="${sandCol}"/>
      <path d="${wavePath(sandY - 2, 0, amp)} V 520 H -140 Z" fill="#000" filter="url(#${id}-grain)" opacity="0.5"/>
      <path d="${wavePath(sandY - 4, 0, amp)}" fill="none" stroke="#fff" stroke-width="${foamW}" stroke-linecap="round" opacity="0.92" filter="url(#${id}-foam)"/>`;
  }
  const bub = rng(hashText("sea" + d.shape));
  for (let i = 0; i < 22; i++) s += `<circle cx="${(-20 + bub() * 340).toFixed(0)}" cy="${(edgeY - foamW - 4 - bub() * (amp + 16)).toFixed(0)}" r="${(1 + bub() * 2.6).toFixed(1)}" fill="#fff" opacity="${(0.5 + bub() * 0.45).toFixed(2)}"/>`;
  return s + "</g>";
}

function goldFlake(x, y, col, R, size) {
  let pts = "";
  const n = 4 + Math.floor(R() * 2);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + R() * 0.6;
    pts += `${(x + Math.cos(a) * size * (0.6 + R() * 0.6)).toFixed(1)},${(y + Math.sin(a) * size * (0.6 + R() * 0.6)).toFixed(1)} `;
  }
  return `<polygon points="${pts}" fill="${col}" opacity="0.95" stroke="#FFF3C4" stroke-width="0.6"/>`;
}

// gold leaf and glitter: lots of tiny pieces, scattered automatically
function scatterLayer(d, T, B) {
  let s = "";
  for (const a of activeAddins(d)) {
    if (a.drag || a.id === "glow") continue;
    const sel = d.addins[a.id];
    const R = rng(hashText(a.id + d.shape));
    const n = ADDIN_COUNTS[a.id][AMT[sel.amount] ?? 1];
    const [y0, y1] = zoneRange(sel.place, T, B);
    for (let i = 0; i < n; i++) {
      const x = 40 + R() * 220, y = y0 + R() * (y1 - y0);
      if (a.id === "goldleaf") s += goldFlake(x, y, sel.color, R, 4 + R() * 6);
      else s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.7 + R() * 1.1).toFixed(1)}" fill="${R() > 0.5 ? sel.color : "#fff"}"/>`;
    }
  }
  return s;
}

// one draggable piece, drawn around (0,0)
function drawItem(id, col, R, pid) {
  const ch = CONFIG.addins.find((x) => x.id === id);
  if (ch && ch.img) {
    const s = ch.size * pokeScale(ch);
    return `<image href="${ch.img}" x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" preserveAspectRatio="xMidYMid meet" style="filter:${ch.fx || "brightness(1.35) saturate(1.25) contrast(1.05) drop-shadow(0 1px 1.2px rgba(0,0,0,0.35))"}"/>`;
  }
  switch (id) {
    case "hearts": return `<path d="${heartPath(0, 0, 5 + R() * 4)}" fill="${col}" opacity="0.92"/>`;
    case "stars": return `<path d="${starPath(0, 0, 5 + R() * 3, 2.3, 5)}" fill="${col}"/>`;
    case "flowers": {
      let s = `<g opacity="0.92">`;
      const n = 12, r = 16 + R() * 6;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const ex = Math.cos(a) * r, ey = Math.sin(a) * r;
        s += `<line x1="0" y1="0" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#4E7A3C" stroke-width="0.7"/>`;
        s += `<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="2.6" fill="${col}"/>`;
        s += `<circle cx="${(Math.cos(a + 0.25) * r * 0.6).toFixed(1)}" cy="${(Math.sin(a + 0.25) * r * 0.6).toFixed(1)}" r="1.6" fill="${col}"/>`;
      }
      return s + `<circle r="2.5" fill="#E8D36A"/></g>`;
    }
    case "frog":
      return `<ellipse cx="0" cy="4" rx="24" ry="17" fill="${col}"/>
        <circle cx="-11" cy="-11" r="8" fill="${col}"/><circle cx="11" cy="-11" r="8" fill="${col}"/>
        <circle cx="-11" cy="-11" r="4.5" fill="#fff"/><circle cx="11" cy="-11" r="4.5" fill="#fff"/>
        <circle cx="-10" cy="-11" r="2.2" fill="#1C2B2B"/><circle cx="12" cy="-11" r="2.2" fill="#1C2B2B"/>
        <path d="M-9 5 Q 0 13 9 5" fill="none" stroke="#1C2B2B" stroke-width="2" stroke-linecap="round"/>
        <circle cx="-15" cy="4" r="3" fill="#FF9EB5" opacity="0.7"/><circle cx="15" cy="4" r="3" fill="#FF9EB5" opacity="0.7"/>`;
    case "starfish":
      return `<path d="${starPath(0, 0, 15, 6, 5)}" fill="${col}" stroke="#C9B48E" stroke-width="1" stroke-linejoin="round"/>`;
    case "shells":
      return `<path d="M0 6 L-10 -6 A 12 12 0 0 1 10 -6 Z" fill="${col}" stroke="#C99A8A" stroke-width="0.8"/>
        <path d="M0 6 L-5 -9 M0 6 L0 -10 M0 6 L5 -9" stroke="#C99A8A" stroke-width="0.8"/>`;
    case "pearl": return `<circle r="5.5" fill="url(#${pid}-pearl)"/>`;
    default: return "";
  }
}

const HIT = { frog: 26, starfish: 18, shells: 13, hearts: 11, stars: 11, pearl: 10 };
function itemsLayer(d, pid, interactive) {
  let s = "";
  for (const a of activeAddins(d)) {
    if (!a.drag) continue;
    const sel = d.addins[a.id];
    sel.items.forEach(([x, y, r], i) => {
      const R = rng(hashText(a.id) + i * 97);
      const hit = interactive ? `<circle r="${a.img ? a.size / 2 + 4 : HIT[a.id] || 14}" fill="transparent"/>` : "";
      s += `<g class="${interactive ? "item" : ""}" data-id="${a.id}" data-i="${i}" transform="translate(${x} ${y}) rotate(${r})">${hit}${drawItem(a.id, sel.color, R, pid)}</g>`;
    });
  }
  return s;
}

/* ---------- select pieces (click, shift-click or drag a box around them), then Delete ---------- */
ui.sels = [];
function validSel(s) { const ad = design.addins[s.id]; return !!(ad && ad.items && ad.items[s.i]); }
function markSelected() {
  els.preview.querySelectorAll(".item.sel").forEach((n) => n.classList.remove("sel"));
  ui.sels = ui.sels.filter(validSel);
  let btn = document.getElementById("del-item");
  if (!ui.sels.length) { if (btn) btn.hidden = true; return; }
  ui.sels.forEach((s) => { const n = els.preview.querySelector(`.item[data-id="${s.id}"][data-i="${s.i}"]`); if (n) n.classList.add("sel"); });
  if (!btn) {
    btn = document.createElement("button"); btn.type = "button"; btn.id = "del-item"; btn.className = "btn btn-ink small del-item";
    btn.addEventListener("click", deleteSelected);
    els.stage.appendChild(btn);
  }
  btn.textContent = "🗑 " + U("deleteItem") + (ui.sels.length > 1 ? " (" + ui.sels.length + ")" : ""); btn.hidden = false;
}
function deleteSelected() {
  if (!ui.sels.length) return;
  const byId = {};
  ui.sels.forEach((s) => (byId[s.id] = (byId[s.id] || []).concat(s.i)));
  for (const id in byId) {
    const sel = design.addins[id]; if (!sel || !sel.items) continue;
    byId[id].sort((x, y) => y - x).forEach((k) => sel.items.splice(k, 1));
    if (!sel.items.length) delete design.addins[id];
  }
  ui.sels = []; render(); markSelected();
}
document.addEventListener("keydown", (e) => { if ((e.key === "Delete" || e.key === "Backspace") && ui.sels.length && !/INPUT|TEXTAREA/.test((e.target || {}).tagName || "")) { e.preventDefault(); deleteSelected(); } if (e.key === "Escape" && ui.sels.length) { ui.sels = []; markSelected(); } });
function marqueeStart(e) {
  const box = document.createElement("div"); box.className = "marquee"; document.body.appendChild(box);
  gesture = { type: "marquee", sx: e.clientX, sy: e.clientY, box, add: e.shiftKey, base: e.shiftKey ? ui.sels.slice() : [] };
  els.preview.setPointerCapture(e.pointerId);
}
function marqueeMove(e) {
  const g = gesture, x0 = Math.min(g.sx, e.clientX), y0 = Math.min(g.sy, e.clientY), x1 = Math.max(g.sx, e.clientX), y1 = Math.max(g.sy, e.clientY);
  Object.assign(g.box.style, { left: x0 + "px", top: y0 + "px", width: x1 - x0 + "px", height: y1 - y0 + "px" });
  const picked = g.base.slice();
  els.preview.querySelectorAll(".item").forEach((n) => { const r = n.getBoundingClientRect(); if (r.right > x0 && r.left < x1 && r.bottom > y0 && r.top < y1) { const s = { id: n.dataset.id, i: Number(n.dataset.i) }; if (!picked.some((q) => q.id === s.id && q.i === s.i)) picked.push(s); } });
  ui.sels = picked; markSelected();
}
setTimeout(() => els.preview.addEventListener("pointerdown", (e) => { if (!e.target.closest(".item") && ui.sels.length && !e.shiftKey) { ui.sels = []; markSelected(); } }, true), 0);
const BRUSH = { s: 4, m: 9, l: 16 };
function strokePath(pts) {
  let p = "";
  for (let i = 0; i < pts.length; i += 2) p += (i ? "L" : "M") + pts[i] + " " + pts[i + 1];
  if (pts.length === 2) p += `L${pts[0] + 0.5} ${pts[1]}`;
  return p;
}
function paintLayer(d, id) {
  let s = "";
  d.paint.forEach((st, k) => {
    const w = BRUSH[st.size] || 9;
    const R = rng(1000 + k);
    if (st.tool === "ink") {
      s += `<path d="${strokePath(st.pts)}" fill="none" stroke="${st.color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="0.85" filter="url(#${id}-line)"/>`;
    } else if (st.tool === "glitter") {
      for (let i = 0; i < st.pts.length; i += 2) {
        for (let j = 0; j < 3; j++) {
          s += `<circle cx="${(st.pts[i] + (R() - 0.5) * w * 1.6).toFixed(1)}" cy="${(st.pts[i + 1] + (R() - 0.5) * w * 1.6).toFixed(1)}" r="${(0.6 + R() * 1.2).toFixed(1)}" fill="${R() > 0.45 ? st.color : "#fff"}"/>`;
        }
      }
    } else {
      for (let i = 0; i < st.pts.length; i += 4) s += goldFlake(st.pts[i], st.pts[i + 1], st.color, R, w * 0.55);
    }
  });
  return s;
}

function hardwareSvg(d, id) {
  const m = `url(#${id}-metal)`;
  const jump = (y) => `<circle cx="150" cy="${y}" r="8" fill="none" stroke="${m}" stroke-width="3"/>`;
  const dk = METALS[d.metal][1], lt = METALS[d.metal][0];
  const ring = `<circle cx="150" cy="42" r="27" fill="none" stroke="${dk}" stroke-width="8.5"/><circle cx="150" cy="42" r="27" fill="none" stroke="${m}" stroke-width="6.2"/><path d="M130 28 A 27 27 0 0 1 160 16" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity="0.75"/>`;
  // one chain link: dark rim, metal body, bright glint; alternate links are seen edge-on
  const link = (y, edge) => edge
    ? `<rect x="146.6" y="${y - 8.5}" width="6.8" height="17" rx="3.4" fill="${dk}"/><rect x="147.8" y="${y - 7.5}" width="4.4" height="15" rx="2.2" fill="${m}"/><line x1="149" y1="${y - 5}" x2="149" y2="${y + 2}" stroke="#fff" stroke-width="0.9" opacity="0.7"/>`
    : `<ellipse cx="150" cy="${y}" rx="7" ry="9.5" fill="none" stroke="${dk}" stroke-width="3.6"/><ellipse cx="150" cy="${y}" rx="7" ry="9.5" fill="none" stroke="${m}" stroke-width="2.2"/><path d="M144.6 ${y - 4} q 0.8 -4 4.2 -5.2" fill="none" stroke="#fff" stroke-width="0.9" stroke-linecap="round" opacity="0.8"/>`;
  const lobster = (y) => `<circle cx="150" cy="${y - 6}" r="6" fill="none" stroke="${m}" stroke-width="3"/>
    <path d="M150 ${y} c -14 0 -18 14 -18 26 c 0 16 10 26 18 30 c 8 -4 18 -14 18 -30 c 0 -12 -4 -26 -18 -26 z" fill="none" stroke="${m}" stroke-width="5"/>
    <rect x="160" y="${y + 18}" width="6" height="12" rx="2" fill="${m}"/>`;
  switch (d.hardware) {
    case "none": return "";
    case "necklace": return `<path d="M30 14 C 52 112 248 112 270 14" fill="none" stroke="${METALS[d.metal][1]}" stroke-width="4" stroke-dasharray="5 1.6" stroke-linecap="round"/><path d="M30 14 C 52 112 248 112 270 14" fill="none" stroke="${m}" stroke-width="2.4" stroke-dasharray="5 1.6" stroke-linecap="round"/><line x1="150" y1="88" x2="150" y2="108" stroke="${METALS[d.metal][1]}" stroke-width="3"/><circle cx="150" cy="114" r="7" fill="none" stroke="${m}" stroke-width="3"/><line x1="150" y1="121" x2="150" y2="${pinTop(d.shape) + 12}" stroke="${METALS[d.metal][1]}" stroke-width="3"/>`;
    case "ring": return ring + jump(82) + jump(102);
    case "ringchain":
      { const ys = []; for (let y = 76; y < pinTop(d.shape) - 2; y += 11) ys.push(y); return ring + ys.map((y, i) => link(y, i % 2)).join(""); }
    case "lobster": return lobster(30) + jump(104);
    case "swivel": return lobster(22) + `<circle cx="150" cy="90" r="6" fill="${m}"/>` + jump(106);
    case "carabiner":
      return `<path d="M134 18 h32 a14 14 0 0 1 14 14 v42 a20 20 0 0 1 -20 20 h-12 a20 20 0 0 1 -20 -20 v-42 a14 14 0 0 1 6 -14 z" fill="none" stroke="${m}" stroke-width="6"/>
        <line x1="140" y1="30" x2="140" y2="72" stroke="${m}" stroke-width="3"/>` + jump(106);
    case "wristlet":
      return `<path d="M150 106 C 64 96, 76 -22, 150 8 C 224 -22, 236 96, 150 106" fill="none" stroke="#C99A7A" stroke-width="11" stroke-linecap="round"/>
        <rect x="140" y="96" width="20" height="18" rx="4" fill="${m}"/>`;
    default: return ring;
  }
}

function tasselSvg(d, id) {
  const tt = d.tassel;
  if (tt.type === "none") return "";
  const R = rng(99);
  const cordColor = tt.photo ? "#C8A13A" : { gold: "#C8A13A", silver: "#AEB5BE", match: tt.color1, twist: tt.color1 }[tt.cord];
  const cordPath = d.hardware === "necklace" ? "M150 112 C 190 108, 224 104, 232 114" : "M171 56 C 205 58, 232 76, 232 112";
  let s = `<path d="${cordPath}" fill="none" stroke="${cordColor}" stroke-width="3.5" stroke-linecap="round"/>`;
  if (tt.cord === "twist") s += `<path d="${cordPath}" fill="none" stroke="#C8A13A" stroke-width="3.5" stroke-dasharray="4 4"/>`;
  const ph = tt.photo && CONFIG.tassels.find((x) => x.id === tt.photo);
  if (ph) {
    const h = 170, w = h * ph.ratio;
    const loop = d.hardware === "necklace" ? `<ellipse cx="150" cy="112" rx="5" ry="7" fill="none" stroke="${ph.hex}" stroke-width="3"/>` : `<ellipse cx="172" cy="55" rx="5.5" ry="9" transform="rotate(35 172 55)" fill="none" stroke="${ph.hex}" stroke-width="3"/>`;
    return `<path d="${cordPath}" fill="none" stroke="${ph.hex}" stroke-width="3.5" stroke-linecap="round"/>${loop}
      <image href="images/tassels/${ph.id}.png" x="${(232 - w * ph.kx).toFixed(1)}" y="108" width="${w.toFixed(1)}" height="${h}" preserveAspectRatio="none"/>`;
  }
  const silk = tt.type === "silk";
  const n = silk ? 34 : 26;
  for (let i = 0; i < n; i++) {
    const x0 = 224 + R() * 16, x1 = 204 + R() * 58, len = 230 + R() * 60;
    s += `<path d="M${x0.toFixed(1)} 128 Q ${((x0 + x1) / 2 + (R() - 0.5) * 10).toFixed(1)} ${(128 + len / 2).toFixed(0)} ${x1.toFixed(1)} ${(128 + len).toFixed(0)}" stroke="url(#${id}-tas)" stroke-width="${silk ? 1.3 : 1.9}" fill="none" stroke-linecap="round"/>`;
  }
  if (silk) {
    for (let i = 0; i < 7; i++) {
      const x0 = 226 + R() * 12, x1 = 210 + R() * 44;
      s += `<path d="M${x0.toFixed(1)} 130 L ${x1.toFixed(1)} ${(330 + R() * 40).toFixed(0)}" stroke="#fff" stroke-width="0.8" opacity="0.35"/>`;
    }
  }
  s += `<path d="M221 113 q 11 -11 22 0 l 3 17 h -28 z" fill="${tt.color1}"/>
    <rect x="219" y="125" width="26" height="6" rx="2" fill="${tt.color1}" stroke="rgba(0,0,0,0.12)"/>`;
  return s;
}

function extraSvg(d, id) {
  const c = d.tassel.color1;
  switch (d.extra) {
    case "ribbon":
      return `<g transform="translate(112 74)">
        <path d="M0 0 L -22 -12 L -22 12 Z M0 0 L 22 -12 L 22 12 Z" fill="${c}"/>
        <path d="M-2 2 L -10 30 M2 2 L 8 32" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
        <circle r="5" fill="${c}" stroke="rgba(0,0,0,0.12)"/>
      </g>`;
    case "pompom": {
      const R = rng(7);
      let s = `<path d="M148 70 C 120 80, 96 96, 90 112" fill="none" stroke="${c}" stroke-width="3"/>`;
      for (let i = 0; i < 40; i++) s += `<circle cx="${(88 + (R() - 0.5) * 34).toFixed(1)}" cy="${(134 + (R() - 0.5) * 34).toFixed(1)}" r="${(4 + R() * 4).toFixed(1)}" fill="${c}" opacity="0.85"/>`;
      return s;
    }
    case "beads": {
      let s = `<path d="M148 70 L 98 190" stroke="#BBB" stroke-width="1.5"/>`;
      for (let i = 0; i < 6; i++) {
        const k = (i + 1) / 6;
        s += `<circle cx="${(148 - 50 * k).toFixed(1)}" cy="${(70 + 120 * k).toFixed(1)}" r="${i % 2 ? 5 : 7}" fill="${i % 2 ? "#EFEAE6" : c}" stroke="rgba(0,0,0,0.12)"/>`;
      }
      return s;
    }
    case "charm":
      return `<path d="M148 70 L 106 116" stroke="url(#${id}-metal)" stroke-width="2.5"/>
        <path d="${starPath(102, 128, 16, 7, 5)}" fill="url(#${id}-metal)"/>`;
    default: return "";
  }
}

function zoomBox(z, pan = [0, 0]) {
  if (!z || z <= 1) return "0 0 300 440";
  const w = 300 / z, h = 440 / z;
  const x = Math.max(0, Math.min(300 - w, 150 + pan[0] - w / 2));
  const y = Math.max(0, Math.min(440 - h, 262 + pan[1] - h / 2));
  return `${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`;
}


/* The writing part of a pen (refill, spring and tip) sits inside the resin: clear shows it, ink dye shows it where there is no dye, gradient covers it. */
function penRefill(d) {
  if (d.shape !== "pen" && d.shape !== "blade") return "";
  const blade = d.shape === "blade";
  const y0 = blade ? 124 : 128, y1 = blade ? 300 : 310, y2 = blade ? 392 : 388, tip = blade ? 410 : 402;
  return `<g class="refill" pointer-events="none" opacity="0.9">
    <rect x="${blade ? 146.5 : 145.5}" y="${y0 - 8}" width="${blade ? 7 : 9}" height="12" rx="3" fill="#8D969C"/>
    <rect x="148.6" y="${y0 + 4}" width="2.8" height="${y1 - y0 - 4}" fill="#A9B2B7"/>
    <path d="M147.4 ${y0 + 8} h5.2 M147.4 ${y0 + 16} h5.2 M147.4 ${y0 + 24} h5.2 M147.4 ${y0 + 32} h5.2 M147.4 ${y0 + 40} h5.2 M147.4 ${y0 + 48} h5.2" stroke="#7F888E" stroke-width="1" fill="none"/>
    <rect x="146" y="${y1}" width="8" height="${y2 - y1}" rx="3.5" fill="rgba(52,58,66,0.62)"/>
    <rect x="147.4" y="${y1 + 3}" width="1.6" height="${y2 - y1 - 8}" rx="0.8" fill="rgba(255,255,255,0.55)"/>
    <path d="M146 ${y2 - 2} L150 ${tip} L154 ${y2 - 2} Z" fill="#6B7279"/>
    <circle cx="150" cy="${tip - 0.5}" r="1.3" fill="#1d2b3a"/>
  </g>`;
}
function setPiece(d, side, opts) {
  const d2 = copy(d); d2.shape = "coaster"; d2.hardware = "none"; d2.tassel = Object.assign({}, d2.tassel, { type: "none" });
  const one = renderPiece(d2, side, { edit: true });
  const cups = [[92, 212], [208, 212], [92, 330], [208, 330]].map(([cx, cy]) => one.replace(/<svg viewBox="[^"]*"/, `<svg viewBox="46 158 208 208" x="${cx - 54}" y="${cy - 54}" width="108" height="108" overflow="hidden"`)).join("");
  return `<svg viewBox="${zoomBox(opts.zoom, opts.pan)}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(shapeName(d.shape))}">
    <defs><clipPath id="hold-clip"><rect x="28" y="148" width="244" height="246" rx="22"/></clipPath><filter id="hold-sh" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#3a2410" flood-opacity="0.28"/></filter></defs>
    ${cups}
  </svg>`;
}
function renderPiece(d, side = "front", opts = {}) {
  if (d.shape === "coaster-set" && !opts.edit) return setPiece(d, side, opts);
  syncBoard(d);
  if (isFresh(d)) d = Object.assign({}, d, { style: "clear" });
  ensureItems(d);
  const id = "k" + ++uid;
  const R = rng(20260);
  const [T, B] = bounds(d.shape);
  const [m1, m2] = METALS[d.metal];
  const tt = d.tassel;
  const glow = d.addins.glow && !blockedReason("glow", d);
  const interactive = !!opts.interactive && side === "front";

  const defs = `<defs>
    <linearGradient id="${id}-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${m1}"/><stop offset="1" stop-color="${m2}"/></linearGradient>
    <linearGradient id="${id}-tas" x1="0" y1="0" x2="0" y2="1"><stop offset="0.1" stop-color="${tt.color1}"/><stop offset="0.9" stop-color="${tt.ombre ? tt.color2 : tt.color1}"/></linearGradient>
    <radialGradient id="${id}-pearl" cx="0.35" cy="0.35" r="0.7"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#D9D2C6"/></radialGradient>
    ${(customShape(d.shape) || {}).wood ? `<pattern id="${id}-wood" patternUnits="userSpaceOnUse" width="300" height="440"><image href="images/wood/${(customShape(d.shape) || {}).wood}.jpg" width="300" height="440" preserveAspectRatio="xMidYMid slice"/></pattern>` : ""}
    <pattern id="${id}-ltr" patternUnits="userSpaceOnUse" width="70" height="70"><image href="images/letters/${d.letters.metal}.jpg" width="70" height="70" preserveAspectRatio="xMidYMid slice" style="filter:brightness(1.7) contrast(1.15) saturate(1.2)"/></pattern>
    <clipPath id="${id}-clip">${shapeMarkup(d.shape, "")}</clipPath>
    <filter id="${id}-ink" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="38" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="${id}-line" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="${id}-foam"><feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="${id}-soft"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="${id}-soft2" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.4"/></filter>
    <linearGradient id="${id}-sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.38"/><stop offset="0.28" stop-color="#fff" stop-opacity="0.08"/><stop offset="0.6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0.16"/></linearGradient>
    <filter id="${id}-softink" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="${id}-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="${id}-bev" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.1"/></filter>
    <filter id="${id}-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#000000" flood-opacity="0.16"/></filter>
  </defs>`;

  const plainBack = side === "back" && d.back === "plain";
  const fillRaw = plainBack ? "" : (d.shape === "game-ttt" ? tttLayer(d, id) : d.shape === "game-chess" ? chessLayer(d, id) : styleLayer(d, id, R, T, B)) + (d.shape === "domino-set" ? dominoLayer(d) : "") + scatterLayer(d, T, B) + glassLayer(d) + photoLayer(d) + lettersLayer(d, id) + paintLayer(d, id) + itemsLayer(d, id, interactive);
  const partClip = () => { const p = d.partial, a = Math.tan(((d.partialAngle || 0) * Math.PI) / 180), mid = T + (B - T) * p;
    if (d.partialSide === "left") return `<polygon points="0,-200 ${(300 * p + a * 420).toFixed(1)},-200 ${(300 * p - a * 420).toFixed(1)},640 0,640"/>`;
    if (d.partialSide === "right") return `<polygon points="300,-200 ${(300 * (1 - p) + a * 420).toFixed(1)},-200 ${(300 * (1 - p) - a * 420).toFixed(1)},640 300,640"/>`;
    return `<polygon points="-200,-200 500,-200 500,${(mid + a * 350).toFixed(1)} -200,${(mid - a * 350).toFixed(1)}"/>`; };
  const fill = (d.partial > 0 && d.partial < 1 && (customShape(d.shape) || {}).wood && fillRaw) ? `<clipPath id="${id}-part">${partClip()}</clipPath><g clip-path="url(#${id}-part)">${fillRaw}</g>` : fillRaw;

  // Hairline rim drawn INSIDE the mold outline (clipped), so the piece is exactly the mold's shape.
  const rim = `fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.2" stroke-linejoin="round"`;

  const flip = side === "back" ? `transform="matrix(-1 0 0 1 300 0)"` : "";
  const label = `${shapeName(d.shape)}, ${lab("style", d.style)}`;

  return `<svg viewBox="${zoomBox(opts.zoom, opts.pan)}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(label)}">
    ${defs}
    ${hasHardware(d.shape) ? `${d.hardware === "none" ? "" : tasselSvg(d, id)}
    
    ${d.hardware === "none" || d.hardware === "ringchain" ? "" : `<line x1="150" y1="110" x2="150" y2="${pinTop(d.shape)}" stroke="${METALS[d.metal][1]}" stroke-width="3"/>`}
    ${hardwareSvg(d, id)}` : ""}
    <g filter="url(#${id}-shadow)" ${flip}>
      <g transform="translate(0 3.2)" opacity="0.5">${shapeMarkup(d.shape, `fill="rgba(70,120,140,0.55)" pointer-events="none" filter="url(#${id}-bev)"`)}</g>
      ${glow ? `<g filter="url(#${id}-glow)" opacity="0.65">${shapeMarkup(d.shape, `fill="${d.addins.glow.color}"`)}</g>` : ""}
      <g clip-path="url(#${id}-clip)" class="resin">
        ${(customShape(d.shape) || {}).wood ? `<rect x="0" y="100" width="300" height="340" fill="url(#${id}-wood)"/>` : `<rect x="0" y="100" width="300" height="330" fill="rgba(176,214,226,0.55)"/>`}
        ${plainBack ? "" : penRefill(d)}${fill}
        ${CONFIG.showTexture ? gridLines(d.shape) + textureLayer(d.shape) : ""}
        ${(customShape(d.shape) || {}).texImg ? `<image href="images/textures/bm-${customShape(d.shape).texImg}.jpg" x="124" y="${customShape(d.shape).t}" width="52" height="${customShape(d.shape).b - customShape(d.shape).t}" preserveAspectRatio="xMidYMid slice" style="mix-blend-mode:hard-light" opacity="0.6" pointer-events="none"/>` : ""}
        <rect x="0" y="100" width="300" height="340" fill="url(#${id}-sheen)" pointer-events="none"/>
        ${shapeMarkup(d.shape, `fill="none" stroke="#fff" stroke-width="7" opacity="0.5" filter="url(#${id}-soft2)" pointer-events="none"`)}
        ${shapeMarkup(d.shape, `fill="none" stroke="rgba(14,63,87,0.22)" stroke-width="9" filter="url(#${id}-soft2)" pointer-events="none"`)}
        <g transform="translate(1.6 1.6)">${shapeMarkup(d.shape, `fill="none" stroke="#fff" stroke-width="3" opacity="0.7" filter="url(#${id}-bev)" pointer-events="none"`)}</g>
        <g transform="translate(-1.6 -1.8)">${shapeMarkup(d.shape, `fill="none" stroke="rgba(20,50,70,0.22)" stroke-width="3" filter="url(#${id}-bev)" pointer-events="none"`)}</g>
      </g>
      ${shapeMarkup(d.shape, rim + ' pointer-events="none"')}
    </g>
    ${holeMark(d, id)}
    <g class="live"></g>
  </svg>`;
}

/* =========================================================
   Panel (the options for each step)
   ========================================================= */
function chips(path, group, current, keys) {
  const opts = keys || Object.keys(I18N.en.labels[group]);
  return `<div class="chips">${opts.map((v) =>
    `<button type="button" class="chip ${String(current) === v ? "on" : ""}" aria-pressed="${String(current) === v}" data-set="${path}" data-value="${v}">${lab(group, v)}</button>`
  ).join("")}</div>`;
}
function yesNo(path, current) {
  return `<div class="chips">${["true", "false"].map((v) =>
    `<button type="button" class="chip ${String(current) === v ? "on" : ""}" aria-pressed="${String(current) === v}" data-set="${path}" data-value="${v}">${t(v === "true" ? "ui.yes" : "ui.no")}</button>`
  ).join("")}</div>`;
}
function field(label, inner, note = "") {
  return `<div class="field"><span class="field-label">${label}</span>${inner}${note ? `<p class="small-note">${note}</p>` : ""}</div>`;
}
const U = (k, v) => t("ui." + k, v);

// shows the real photo, and falls back to the drawing if the photo file is missing
function presetArt(p, d) {
  const drawing = renderPiece(d);
  if (!p.photo) return drawing;
  return `<img src="${esc(p.photo)}" alt="${esc(p.name)}" decoding="async" onerror="this.parentNode.classList.add('no-photo');this.remove()"><div class="fallback">${drawing}</div>`;
}

function reviewThumbs(d) {
  const bare = (o) => renderPiece(Object.assign(copy(d), { hardware: "none", tassel: Object.assign(copy(d.tassel), { type: "none" }) }, o || {}));
  const th = [];
  th.push([`<span class="rv-art">${renderPiece(d)}</span>`, shapeName(d.shape)]);
  if (d.style !== "clear" && d.style !== "ocean" && !isFresh(d)) th.push([`<span class="rv-dots">${d.colors.map((c) => `<span class="dot" style="background:${c}"></span>`).join("")}</span>`, lab("style", d.style)]);
  const gl = [...new Set((d.crush || []).map((c) => c[0]))];
  gl.slice(0, 4).forEach((g) => th.push([`<img src="images/glitter/${g}.png" alt="">`, glitterName(g)]));
  activeAddins(d).forEach((a) => th.push([`<img src="${a.img}" alt="">`, tr(a, "name")]));
  if (d.letters && d.letters.text) th.push([`<span class="rv-text">${esc(d.letters.text)}</span>`, t("ui.sLtH")]);
  if (d.hardware !== "none" && hasHardware(d.shape)) th.push([`<span class="rv-dots"><span class="dot" style="background:linear-gradient(135deg, ${METALS[d.metal][0]}, ${METALS[d.metal][1]})"></span></span>`, lab("hardware", d.hardware)]);
  const tas = d.tassel.photo && CONFIG.tassels.find((x) => x.id === d.tassel.photo);
  if (d.tassel.type !== "none" && tas) th.push([`<img src="images/tassels/${tas.id}.png" alt="">`, t("ui.tassel")]);
  if (d.second) th.push([`<span class="rv-text">${esc(d.second)}</span>`, t("sum.matching", { l: d.second })]);
  return th.map(([img, cap]) => `<figure class="rv"><div class="rv-img">${img}</div><figcaption>${esc(cap)}</figcaption></figure>`).join("");
}

const SEC_COL = { keychains: "#134B63", accessories: "#E8806C", statues: "#8C6BB1", kitchen: "#2E8B8B", paint: "#2F5FA8" };
const SEC_NAME = { keychains: "catKey", accessories: "catAcc", statues: "catStat", kitchen: "catKit", paint: "catPaint" };
function exampleBar() {
  if (!ui.example || ui.step === 0 || ui.step === LAST) return "";
  return `<div class="example-bar"><span>${U("exampleNote")}</span><button type="button" class="btn btn-ink small" data-action="exorder">${U("orderThis")}</button><button type="button" class="btn btn-line small" data-action="exedit">${U("keepEditing")}</button></div>`;
}
function secTag() {
  const k = ui.cat || (design.shape ? catOf(design.shape) : "");
  if (!k || ui.step === 0 || !SEC_NAME[k]) return "";
  return `<p class="sec-tag" style="--c:${SEC_COL[k]}"><span class="sec-dot"></span>${U(SEC_NAME[k])}</p>`;
}
/* ---------- Saves on this device: drafts, styles, open a design code ---------- */
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch (e) { return []; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
};
(function migrateDraft() {   // the first version kept a single draft
  try { const old = JSON.parse(localStorage.getItem("rc-draft") || "null"); if (old && old.design) { const l = store.get("rc-drafts"); l.push({ id: "d" + old.t, t: old.t, design: old.design, step: old.step, cat: old.cat, name: "Draft" }); store.set("rc-drafts", l); } localStorage.removeItem("rc-draft"); } catch (e) { /* ignore */ }
})();
const thumbOf = (d) => renderPiece(Object.assign(copy(d), { crush: (d.crush || []).slice(-300) })).replace(/<svg /, '<svg class="cart-svg" ');
function saveDraft() {
  const l = store.get("rc-drafts");
  const d2 = copy(design); delete d2.note;
  l.unshift({ id: "d" + Date.now(), t: Date.now(), name: shapeName(design.shape) + " – " + lab("style", design.style), design: d2, step: ui.step, cat: ui.cat, thumb: thumbOf(design) });
  if (l.length > 20) l.length = 20;
  if (store.set("rc-drafts", l)) toast(U("draftSaved"), U("openSaves"), () => openSaves()); else toast(U("draftFail"));
  renderSaves();
}
function openDraft(id) {
  const d = store.get("rc-drafts").find((x) => x.id === id);
  if (!d) return;
  design = merge(defaultDesign(), d.design); ui.cat = d.cat || ""; ui.visited = new Set([...Array(d.step + 1).keys()]); closeSaves(); go(d.step); window.scrollTo({ top: 0 });
}
const loadDraft = () => openSaves();
/* the piece in progress is saved automatically, so closing the phone never loses it */
const AUTO_KEY = "rc-auto";
function getAuto() { try { return JSON.parse(localStorage.getItem(AUTO_KEY) || "null"); } catch (e) { return null; } }
let autoTimer = 0;
function saveAuto() {
  clearTimeout(autoTimer);
  autoTimer = setTimeout(() => {
    if (!ui.chosen) return;
    const d2 = copy(design); delete d2.note;
    try { localStorage.setItem(AUTO_KEY, JSON.stringify({ t: Date.now(), design: d2, step: ui.step, cat: ui.cat, name: shapeName(design.shape) + " – " + lab("style", design.style) })); } catch (e) { /* storage full or blocked */ }
  }, 400);
}
function openAuto() {
  const d = getAuto(); if (!d) return false;
  design = merge(defaultDesign(), d.design); ui.cat = d.cat || ""; ui.chosen = true; ui.visited = new Set([...Array(d.step + 1).keys()]); closeSaves(); go(d.step); window.scrollTo({ top: 0 }); return true;
}
const hasDraft = () => store.get("rc-drafts").length > 0 || !!getAuto();
const STYLE_KEYS = ["style", "colors", "picked", "gradient", "ink", "inkDrops", "inkSize", "ocean", "crush", "deco", "edge", "edgeColor", "metal", "hardware", "tassel", "paint"];
function saveStyle() {
  const l = store.get("rc-styles");
  const snap = {}; STYLE_KEYS.forEach((k) => (snap[k] = copy(design[k])));
  snap.addins = {}; Object.keys(design.addins).forEach((id) => { snap.addins[id] = { amount: design.addins[id].amount, place: design.addins[id].place, color: design.addins[id].color }; });
  const n = l.reduce((m, s) => Math.max(m, s.n || 0), 0) + 1;
  l.push({ id: "s" + Date.now(), n, name: U("styleN", { n }), snap, dots: (design.picked || []).slice(0, 3), style: design.style });
  store.set("rc-styles", l);
  toast(U("styleSaved", { n }), U("openSaves"), () => openSaves());
  renderSaves(); renderPanel();
}
function applyStyle(id) {
  const s = store.get("rc-styles").find((x) => x.id === id);
  if (!s) return;
  STYLE_KEYS.forEach((k) => { design[k] = copy(s.snap[k]); });
  design.addins = {}; Object.keys(s.snap.addins).forEach((aid) => { design.addins[aid] = Object.assign({}, s.snap.addins[aid]); });
  design.paint = [];
  resetItems(design);
  closeSaves(); changed();
  toast(U("styleApplied", { name: s.name }));
}
function openFromCode(text) {
  let s = String(text || "").trim();
  const m = s.match(/#d=([^\s]+)/); if (m) s = m[1];
  try {
    const d = decodeDesign(decodeURIComponent(s));
    design = merge(defaultDesign(), d); if (!design.picked.length && !isFresh(design)) design.picked = [...new Set(design.colors)];
    ui.cat = catOf(design.shape); ui.visited = new Set([...Array(LAST + 1).keys()]); closeSaves(); go(LAST); return true;
  } catch (e) { return false; }
}
function renderSaves() {
  const dr = document.getElementById("saves-drawer");
  if (!dr) return;
  const ds = store.get("rc-drafts"), ss = store.get("rc-styles");
  const au = getAuto();
  dr.querySelector(".saves-drafts").innerHTML = (au ? `<li class="auto-li"><span class="cart-info"><strong>${U("autoSaved")}: ${esc(au.name || "")}</strong><small>${new Date(au.t).toLocaleString()}</small></span><button type="button" class="btn btn-ink small" data-sv="openauto">${U("open")}</button></li>` : "") + (ds.length ? ds.map((x) => `<li><span class="cart-thumb">${x.thumb || ""}</span><span class="cart-info"><strong>${esc(x.name)}</strong><small>${new Date(x.t).toLocaleString()}</small></span><button type="button" class="btn btn-ink small" data-sv="open" data-id="${x.id}">${U("open")}</button><button type="button" class="cart-x" data-sv="deldraft" data-id="${x.id}" aria-label="Delete">✕</button></li>`).join("") : (au ? "" : `<li class="cart-empty">${U("noDrafts")}</li>`));
  dr.querySelector(".saves-styles").innerHTML = ss.length ? ss.map((x) => `<li><span class="cart-info"><strong>${esc(x.name)}</strong><small>${esc(lab("style", x.style))} <span class="bs-dots">${(x.dots || []).map((c) => `<i style="background:${c}"></i>`).join("")}</span></small></span><button type="button" class="btn btn-ink small" data-sv="apply" data-id="${x.id}">${U("applyStyle")}</button><button type="button" class="cart-x" data-sv="delstyle" data-id="${x.id}" aria-label="Delete">✕</button></li>`).join("") : `<li class="cart-empty">${U("noStyles")}</li>`;
}
function openSaves() { const dr = document.getElementById("saves-drawer"); if (dr) { renderSaves(); dr.classList.add("open"); } }
function closeSaves() { const dr = document.getElementById("saves-drawer"); if (dr) dr.classList.remove("open"); }
(function buildSaves() {
  const dr = document.createElement("aside");
  dr.id = "saves-drawer"; dr.className = "cart-drawer";
  dr.innerHTML = `<div class="cart-back" data-sv="close"></div><div class="cart-panel"><div class="cart-head"><h2 data-i18n="ui.mySaves"></h2><button type="button" data-sv="close" aria-label="Close">✕</button></div>
    <h3 class="sv-h" data-i18n="ui.myDrafts"></h3><ul class="cart-list saves-drafts"></ul>
    <h3 class="sv-h" data-i18n="ui.myStyles"></h3><ul class="cart-list saves-styles"></ul>
    <h3 class="sv-h" data-i18n="ui.openCode"></h3><p class="small-note" data-i18n="ui.openCodeNote"></p>
    <div class="sv-code"><input type="text" id="sv-code" autocomplete="off" data-i18n-ph="ui.codePh"><button type="button" class="btn btn-ink small" data-sv="code" data-i18n="ui.open"></button></div><p class="small-note" id="sv-msg"></p></div>`;
  document.body.appendChild(dr);
  applyStaticText();
  dr.addEventListener("click", (e) => {
    const b = e.target.closest("[data-sv]"); if (!b) return;
    const k = b.dataset.sv, id = b.dataset.id;
    if (k === "close") closeSaves();
    else if (k === "open") openDraft(id);
    else if (k === "openauto") openAuto();
    else if (k === "deldraft") { store.set("rc-drafts", store.get("rc-drafts").filter((x) => x.id !== id)); renderSaves(); }
    else if (k === "apply") applyStyle(id);
    else if (k === "delstyle") { store.set("rc-styles", store.get("rc-styles").filter((x) => x.id !== id)); renderSaves(); renderPanel(); }
    else if (k === "code") { const ok = openFromCode(document.getElementById("sv-code").value); if (!ok) document.getElementById("sv-msg").textContent = U("codeBad"); }
  });
})();
function stylesBar() {
  const ss = store.get("rc-styles");
  if (!ss.length || ui.step < 1 || ui.step > 3) return "";
  return `<div class="styles-bar"><span>${U("myStyles")}:</span>${ss.map((x) => `<button type="button" class="chip" data-sv-apply="${x.id}">${esc(x.name)} <span class="bs-dots">${(x.dots || []).map((c) => `<i style="background:${c}"></i>`).join("")}</span></button>`).join("")}</div>`;
}
document.addEventListener("click", (e) => { const b = e.target.closest("[data-sv-apply]"); if (b) applyStyle(b.dataset.svApply); });

/* ---------- Inspiration: five ready looks, drawn on whatever mold is chosen, from Anna's own colours and materials ---------- */
function sprinkle(d, gid, n, seed, xa = 20, xb = 280) {
  const R = rng(hashText(seed + d.shape)), [T, B] = bounds(d.shape);
  let tries = 0;
  while (n > 0 && tries++ < n * 40) {
    const x = xa + R() * (xb - xa), y = T + R() * (B - T);
    if (!insideShape(d.shape, x, y)) continue;
    d.crush.push([gid, Math.round(x), Math.round(y), Math.floor(R() * 360), Math.round(85 + R() * 40)]); n--;
  }
}
/* A piece may only sit where all of it is inside the mold, never even slightly over the edge. */
// 3D pieces (charms, little roses, butterflies, pressed flowers) are drawn bigger on small molds such as letters and tags, so they fill the space and poke out
const POKE_GROUPS = ["small", "seaanimals", "metalsea", "charms", "flowers"];
function pokeScale(ad, shape) {
  if (!ad || !POKE_GROUPS.includes(ad.group)) return 1;
  const sh = shape || (typeof design !== "undefined" ? design.shape : "");
  const c = CONFIG.shapes.find((x) => x.id === sh);
  if (c && c.size === "thin") return 1.15;
  return !c || !c.size || c.size === "small" ? 1.6 : c.size === "medium" ? 1.25 : 1;
}
function itemRadius(id) { const ad = CONFIG.addins.find((x) => x.id === id); return ((ad && ad.size) || 30) * pokeScale(ad) * 0.5 * 0.9; }
function itemFits(shape, x, y, id) {
  const r = itemRadius(id);
  if (!insideShape(shape, x, y)) return false;
  for (let k = 0; k < 12; k++) { const an = (k / 12) * Math.PI * 2; if (!insideShape(shape, x + Math.cos(an) * r, y + Math.sin(an) * r)) return false; if (!insideShape(shape, x + Math.cos(an) * r * 0.55, y + Math.sin(an) * r * 0.55)) return false; }
  return true;
}
const LAYOUT = [[0.5, 0.28], [0.4, 0.5], [0.62, 0.62], [0.45, 0.8], [0.6, 0.38], [0.36, 0.7]];
function placeNear(d, id, tx, ty, taken) {
  const r = itemRadius(id);
  for (let rad = 0; rad < 150; rad += 4) for (let k = 0; k < 16; k++) {
    const an = (k / 16) * Math.PI * 2 + rad, x = Math.round(tx + Math.cos(an) * rad), y = Math.round(ty + Math.sin(an) * rad * 1.3);
    if (!itemFits(d.shape, x, y, id)) continue;
    if (taken.every(([ox, oy, or]) => Math.hypot(ox - x, oy - y) > (or + r) * 0.9)) return [x, y];
  }
  return null;
}
// lay out every piece that has no position yet: composed, fully inside, not on top of each other
function layoutItems(d) {
  const [T, B] = bounds(d.shape), h = B - T, taken = [[150, pinTop(d.shape) + 14, 22]];   // keep clear of the key hole
  const sandY = d.style === "ocean" && d.ocean.sand !== "none" ? T + h * { low: 0.8, middle: 0.64, high: 0.46 }[d.ocean.sand] : null;
  let n = 0;
  for (const id of Object.keys(d.addins)) {
    const sel = d.addins[id], ad = CONFIG.addins.find((x) => x.id === id);
    if (!ad || !ad.drag) continue;
    if (!fits(ad, d)) { delete d.addins[id]; continue; }
    let tx, ty;
    if (sandY) { tx = 110 + (n % 3) * 45; ty = sandY + (B - sandY) * (0.45 + 0.2 * (n % 2)); }
    else if (d.cluster) { const CL = [[0, 0], [30, -16], [-26, 24], [34, 30], [-4, 50]]; const q = CL[n % CL.length]; tx = 150 + q[0]; ty = T + h * 0.62 + q[1]; }
    else { const p = LAYOUT[n % LAYOUT.length]; tx = 40 + p[0] * 220; ty = T + p[1] * h; }
    const spot = placeNear(d, id, tx, ty, taken);
    n++;
    if (!spot) { delete d.addins[id]; continue; }
    sel.items = [[spot[0], spot[1], id === "frog" ? 0 : (n % 2 ? -12 : 14)]]; sel.moved = true;
    taken.push([spot[0], spot[1], itemRadius(id)]);
  }
}
const AI = (ids) => { const o = {}; ids.forEach((id) => (o[id] = { amount: "few", place: "anna", color: "#D4AF37" })); return o; };
function inkDrops(d, cols, spots) { const [T, B] = bounds(d.shape), h = B - T; d.inkDrops = spots.map(([ci, fx, fy, r]) => [ci, Math.round(150 + (fx - 0.5) * 150), Math.round(T + h * fy), r]); }
function inkLook(d, picked, spots, extra = {}) { d.style = "ink"; d.picked = picked; d.ink = Object.assign({}, d.ink, { flow: "spread", legacy: false, shimmer: "none", cells: false, background: "clear" }, extra); inkDrops(d, picked, spots); d.crush = []; }
function gradLook(d, picked, dir) { d.style = "gradient"; d.picked = picked; d.gradient = { direction: dir, glitter: "none" }; d.addins = {}; d.crush = []; }
const LOOKS = [
  { id: "ocean", apply(d) { d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "middle", size: "medium", dir: "flat" }); d.addins = AI(["sea-starfish", "sea-shell-scallop"]); d.crush = []; } },
  { id: "shellbeach", apply(d) { d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "high", size: "calm", dir: "flat" }); d.addins = AI(["sea-shell-pink", "sea-shell-cone"]); d.crush = []; } },
  { id: "stormsea", apply(d) { d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "low", size: "big", dir: "right" }); d.addins = AI(["sea-starfish"]); d.crush = []; } },
  { id: "seaglass", apply(d) {inkLook(d, ["#4F8A9C", "#7F9CC0", "#E6E0D8"], [[0, .42, .26, 22], [1, .6, .5, 22], [2, .4, .7, 16], [0, .58, .85, 14]]); d.deco = "natural"; d.addins = AI(["dried-blue"]); } },
  { id: "rosegold", apply(d) { gradLook(d, ["#B8693F", "#C9A99A", "#D9959C"], "diagonal"); sprinkle(d, "rosecopper", 120, "rg"); sprinkle(d, "pink", 60, "rg2"); sprinkle(d, "champagne", 50, "rg3"); } },
  { id: "sunset", apply(d) { gradLook(d, ["#D9742E", "#B04855", "#C89B2E"], "down"); } },
  { id: "goldenhour", apply(d) { gradLook(d, ["#C9A99A", "#C89B2E", "#8A5F3C"], "diagonal"); sprinkle(d, "gold", 100, "gh"); sprinkle(d, "lightgold", 70, "gh2"); sprinkle(d, "champagne", 40, "gh3"); } },
  { id: "forest", apply(d) { gradLook(d, ["#3A5F55", "#4C8A7C", "#E6E0D8"], "center"); } },
  { id: "deepsea", apply(d) { gradLook(d, ["#1F6BC0", "#4F8A9C", "#E6E0D8"], "down"); } },
  { id: "berry", apply(d) { gradLook(d, ["#8E3560", "#6A4B94", "#D9959C"], "right"); } },
  { id: "blossom", apply(d) {d.style = "clear"; d.deco = "natural"; d.addins = AI(["flower-pink", "flower-cream", "flower-mauve", "dried-pink"]); d.cluster = true; d.crush = []; sprinkle(d, "pink", 170, "bl"); sprinkle(d, "palerose", 140, "bl2"); sprinkle(d, "fuchsia", 30, "bl3"); } },
  { id: "lavender", apply(d) { d.style = "clear"; d.deco = "natural"; d.addins = AI(["flower-purple", "flower-mauve", "dried-lavender", "dried-blue"]); d.crush = []; d.cluster = true; sprinkle(d, "purple", 80, "lv"); sprinkle(d, "palerose", 30, "lv2"); } },
  { id: "royal", apply(d) { d.style = "clear"; d.deco = "charms"; d.addins = AI(["sm-crown-gold", "sm-heart-ruby", "sm-crown-rose"]); d.crush = []; sprinkle(d, "gold", 120, "ro"); sprinkle(d, "goldleaf", 80, "ro2"); } },
  { id: "garden", apply(d) { d.style = "clear"; d.deco = "charms"; d.addins = AI(["sm-butterfly-teal", "sm-rose-pink", "sm-ladybug", "sm-sunflower"]); d.crush = []; sprinkle(d, "pink", 70, "ga"); sprinkle(d, "green", 50, "ga2"); sprinkle(d, "palerose", 40, "ga3"); } },
  { id: "lucky", apply(d) { d.style = "clear"; d.deco = "charms"; d.addins = AI(["frog", "charm-coin", "sm-sunflower"]); d.crush = []; sprinkle(d, "goldleaf", 110, "lu"); sprinkle(d, "green", 60, "lu2"); } },
  { id: "sweet", apply(d) { d.style = "clear"; d.deco = "charms"; d.addins = AI(["sm-donut", "sm-bow-pink", "sm-heart-yellow", "sm-cookie"]); d.crush = []; sprinkle(d, "pink", 80, "sw"); sprinkle(d, "palerose", 70, "sw2"); sprinkle(d, "champagne", 50, "sw3"); } },
  { id: "goldleaf", apply(d) { d.style = "clear"; d.deco = ""; d.addins = {}; d.crush = []; sprinkle(d, "goldleaf", 190, "gl"); sprinkle(d, "gold", 60, "gl2"); } },
  { id: "pond", apply(d) { inkLook(d, ["#7FD8B2", "#3A9C5A", "#E6E0D8"], [[0, .36, .78, 20], [1, .45, .68, 15]]); d.addins = AI(["frog", "flower-teal"]); d.deco = ""; sprinkle(d, "green", 60, "po"); sprinkle(d, "aqua", 30, "po2"); } },
  { id: "midnight", apply(d) {inkLook(d, ["#4A5090", "#6A4B94", "#14151A"], [[0, .45, .22, 22], [1, .62, .42, 24], [2, .4, .62, 20], [0, .55, .82, 18]]); d.addins = {}; } },
  { id: "inkrose", apply(d) {inkLook(d, ["#D9959C", "#C97080", "#E6E0D8"], [[0, .45, .22, 22], [1, .6, .38, 20], [0, .4, .5, 20], [1, .58, .65, 22], [2, .45, .8, 16], [0, .6, .85, 14]]); d.deco = "natural"; d.addins = AI(["flower-pink"]); d.cluster = true; sprinkle(d, "pink", 30, "ir"); } },
  { id: "inkocean", apply(d) {inkLook(d, ["#1F6BC0", "#4F8A9C", "#E6E0D8"], [[0, .45, .24, 24], [1, .6, .48, 22], [0, .42, .68, 20], [2, .55, .84, 14]]); d.addins = {}; } },
  { id: "inkbutterfly", apply(d) { inkLook(d, ["#4F8A9C", "#1F6BC0", "#E6E0D8"], [[0, .42, .28, 22], [1, .6, .5, 22], [2, .45, .75, 16]]); d.deco = "charms"; d.addins = AI(["sm-butterfly-teal"]); sprinkle(d, "aqua", 25, "ib"); } },
  { id: "inkheart", apply(d) { inkLook(d, ["#C97080", "#D9959C", "#E6E0D8"], [[0, .45, .3, 22], [1, .58, .52, 22], [2, .42, .76, 16]]); d.deco = "charms"; d.addins = AI(["sm-heart-ruby", "sm-bow-pink"]); sprinkle(d, "pink", 25, "ih"); } },
  { id: "inkgoldcrown", apply(d) { inkLook(d, ["#14151A", "#C89B2E", "#E6E0D8"], [[0, .45, .28, 22], [1, .6, .5, 20], [2, .42, .78, 14]]); d.deco = "charms"; d.addins = AI(["sm-sunflower", "sm-butterfly-amber"]); sprinkle(d, "gold", 30, "ig"); } },
  { id: "inkturtle", apply(d) { inkLook(d, ["#4C8A7C", "#4F8A9C", "#E6E0D8"], [[0, .42, .3, 22], [1, .6, .52, 22], [2, .45, .78, 16]]); d.deco = "charms"; d.addins = AI(["sm-turtle-yellow", "sm-ladybug"]); sprinkle(d, "green", 25, "it"); } },
  { id: "inkcopper", apply(d) { inkLook(d, ["#B8693F", "#C89B2E", "#14151A"], [[0, .42, .3, 20], [1, .6, .55, 20], [2, .45, .8, 14]]); d.deco = "charms"; d.addins = AI(["sm-crown-bronze"]); sprinkle(d, "copper", 25, "ic"); } },
];
function lookDesign(look) { const d = copy(design); d.hardware = "none"; d.tassel.type = "none"; look.apply(d); normaliseStyle(d); applyPicked(d); layoutItems(d); delete d.cluster; return d; }
function inspirationHtml() {
  if (!ui.open.has("inspo")) return `<details class="inspo" data-key="inspo"><summary><span>${U("inspoH")}</span><span class="inspo-arrow" aria-hidden="true">⌄</span></summary></details>`;
  const ds = LOOKS.map((l) => [l, lookDesign(l)]);
  const groups = ["ocean", "gradient", "ink", "clear"].map((st) => {
    const items = ds.filter(([, d]) => d.style === st);
    if (!items.length) return "";
    return `<h4 class="looks-h">${esc(lab("style", st))}</h4><div class="looks">${items.map(([l, d]) => `<button type="button" class="look" data-look-id="${l.id}"><span class="look-art">${renderPiece(d)}</span><span class="look-name">${U("look_" + l.id)}</span></button>`).join("")}</div>`;
  }).join("");
  return `<details class="inspo" ${ui.open.has("inspo") ? "open" : ""} data-key="inspo"><summary><span>${U("inspoH")}</span><span class="inspo-arrow" aria-hidden="true">⌄</span></summary><p class="small-note">${U("inspoP")}</p>${groups}</details>`;
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-look-id]"); if (!b) return;
  const look = LOOKS.find((l) => l.id === b.dataset.lookId);
  look.apply(design); resetItems(design); applyPicked(design); layoutItems(design); delete design.cluster;
  changed();
});

/* ---------- The ready-made keychains rebuilt in the designer with Anna's own materials ---------- */
const PRESET_RECIPES = {
  "pink-heartbeat": (d) => { d.style = "ink"; d.picked = ["#C45160", "#D9959C", "#E6E0D8"]; d.ink = Object.assign({}, d.ink, { flow: "tight", cells: false, background: "clear", shimmer: "none", legacy: false }); inkDrops(d, d.picked, [[0, .5, .78, 20], [0, .4, .66, 14]]); sprinkle(d, "red", 70, "ph"); sprinkle(d, "hearts", 18, "ph2"); sprinkle(d, "rosecopper", 30, "ph3"); d.edge = "gold"; d.tassel = Object.assign(d.tassel, { type: "silk", photo: "cream" }); },
  "golden-hour": (d) => { d.style = "clear"; d.picked = []; sprinkle(d, "goldleaf", 150, "gh"); sprinkle(d, "gold", 40, "gh2"); d.tassel = Object.assign(d.tassel, { type: "silk", photo: "gold" }); },
  "andaman-bloom": (d) => { inkLook(d, ["#1F6BC0", "#4F8A9C", "#E6E0D8"], [[0, .62, .7, 24], [1, .55, .55, 16]]); d.addins = AI(["flower-blue", "flower-cream"]); d.deco = ""; d.metal = "silver"; d.hardware = "ring"; d.tassel = Object.assign(d.tassel, { type: "silk", photo: "greyblue" }); },
  "froggy-pond": (d) => { inkLook(d, ["#7FD8B2", "#3A9C5A", "#E6E0D8"], [[0, .35, .78, 18], [1, .42, .7, 14]]); d.addins = AI(["frog", "flower-teal"]); d.deco = ""; d.metal = "silver"; d.hardware = "ringchain"; d.edge = "painted"; d.tassel = Object.assign(d.tassel, { type: "silk", photo: "teal" }); },
  "phuket-shoreline": (d) => { d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "middle", size: "medium", dir: "flat" }); d.addins = AI(["sea-starfish"]); d.tassel = Object.assign(d.tassel, { type: "none", photo: "" }); },
};
function presetDesign(p) {
  const d = merge(defaultDesign(), p.design);
  d.addins = {}; d.crush = []; d.picked = []; d.inkDrops = []; d.deco = "";
  const f = PRESET_RECIPES[p.id];
  if (f) f(d); else if (!d.picked.length && !isFresh(d)) d.picked = [...new Set(d.colors)];
  normaliseStyle(d); applyPicked(d); resetItems(d); layoutItems(d);
  return d;
}

/* ---------- Every finished piece in the shop, rebuilt as a digital design ---------- */
const GALLERY_DESIGNS = {
  "g-key-w": { cat: "keychains", shape: "W", f(d) { inkLook(d, ["#4F8A9C", "#1F6BC0", "#E6E0D8"], [[0, .45, .3, 24], [1, .58, .52, 22], [2, .42, .76, 16]]); sprinkle(d, "cobalt", 110, "kw", 20, 150); sprinkle(d, "aqua", 40, "kwa", 20, 140); sprinkle(d, "cobalt", 12, "kw2", 150, 280); d.hardware = "ringchain"; } },
  "g-round-pendant": { cat: "keychains", shape: "circle", f(d) { d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "low", size: "medium", dir: "flat" }); d.addins = AI(["sea-starfish"]); d.hardware = "ringchain"; } },
  "g-key-es": { cat: "keychains", shape: "E", f(d) { d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "middle", size: "medium", dir: "flat" }); d.addins = AI(["sea-starfish"]); d.hardware = "ringchain"; } },
  "g-feather": { cat: "accessories", shape: "feather", f(d) { gradLook(d, ["#E6E0D8", "#F3EBDD", "#C89B2E"], "down"); sprinkle(d, "goldleaf", 25, "gf"); } },
  "g-chess-sand": { cat: "statues", shape: "game-chess", f(d) { d.style = "gradient"; d.chess = { a: { c1: "#8A5F3C", c2: "", foil: false }, b: { c1: "#7F9CC0", c2: "#9A9A92", foil: false } }; } },
  "g-gold-chess": { cat: "statues", shape: "game-chess", f(d) { d.style = "gradient"; d.chess = { a: { c1: "#E6E0D8", c2: "", foil: true }, b: { c1: "#14151A", c2: "", foil: true } }; } },
  "g-domino": { cat: "statues", shape: "domino-set", f(d) { inkLook(d, ["#1F6BC0", "#C89B2E"], [[0, .45, .3, 24], [1, .58, .52, 22], [2, .42, .76, 16]]); } },
  "g-ruffle-bowl": { cat: "kitchen", shape: "bowl", f(d) { gradLook(d, ["#E6E0D8", "#F3EBDD", "#C89B2E"], "diagonal"); sprinkle(d, "goldleaf", 30, "rb"); } },
  "g-lychee-bowl": { cat: "kitchen", shape: "bowl", f(d) { gradLook(d, ["#D9959C", "#C97080", "#D9959C"], "center"); } },
  "g-pinkboard": { cat: "cutting", shape: "board-rect", f(d) { d.cm = { w: 40, h: 25 }; gradLook(d, ["#D9742E", "#B04855", "#D9959C"], "down"); sprinkle(d, "gold", 60, "pb"); d.partial = 0.55; d.partialAngle = 14; } },
  "g-coffee-art": { cat: "paint", shape: "canvas-rect", f(d) { d.cm = { w: 30, h: 30 }; inkLook(d, ["#8A5F3C", "#E6E0D8", "#B8693F"], [[0, .45, .3, 26], [1, .55, .55, 22], [2, .42, .78, 16]]); } },
  "g-beach-lounger": { cat: "paint", shape: "canvas-rect", f(d) { d.cm = { w: 30, h: 40 }; d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "low", size: "medium", dir: "flat" }); d.addins = AI(["sea-shell-scallop"]); } },
  "g-feather-canvas": { cat: "paint", shape: "canvas-rect", f(d) { d.cm = { w: 40, h: 50 }; gradLook(d, ["#3A5F55", "#4C8A7C", "#C89B2E"], "diagonal"); sprinkle(d, "goldleaf", 40, "fc"); } },
  "g-purple-plate": { cat: "paint", shape: "canvas-rect", f(d) { d.cm = { w: 30, h: 30 }; gradLook(d, ["#6A4B94", "#C97080", "#C9A99A"], "diagonal"); sprinkle(d, "rosecopper", 60, "pp"); } },
  "g-sea-wide": { cat: "paint", shape: "canvas-rect", f(d) { d.cm = { w: 60, h: 40 }; d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "low", size: "big", dir: "flat" }); d.addins = AI(["sea-starfish"]); } },
  "g-sea-shells": { cat: "paint", shape: "canvas-rect", f(d) { d.cm = { w: 30, h: 40 }; d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "middle", size: "medium", dir: "flat" }); d.addins = AI(["sea-starfish", "sea-shell-scallop"]); } },
  "g-round": { cat: "paint", shape: "canvas-rect", f(d) { d.cm = { w: 30, h: 30 }; d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "low", size: "calm", dir: "flat" }); } },
  "g-paint3": { cat: "paint", shape: "canvas-rect", f(d) { d.cm = { w: 40, h: 50 }; inkLook(d, ["#6A4B94", "#C89B2E", "#E6E0D8"], [[0, .45, .3, 26], [1, .55, .55, 22], [2, .42, .78, 16]]); } },
  "g-paint4": { cat: "paint", shape: "canvas-rect", f(d) { d.cm = { w: 40, h: 50 }; inkLook(d, ["#3A5F55", "#C89B2E", "#E6E0D8"], [[0, .45, .3, 26], [1, .55, .55, 22], [2, .42, .78, 16]]); } },
  "g-canvas": { cat: "paint", shape: "canvas-rect", f(d) { d.cm = { w: 40, h: 50 }; d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "low", size: "medium", dir: "flat" }); d.addins = AI(["sea-starfish"]); } },
  "g-plum": { cat: "paint", shape: "canvas-rect", f(d) { d.cm = { w: 40, h: 50 }; inkLook(d, ["#8E3560", "#6A4B94", "#E6E0D8"], [[0, .45, .3, 26], [1, .55, .55, 22], [2, .42, .78, 16]]); } },
  "g-mosaic-bookmark": { cat: "accessories", shape: "bookmark", f(d) { inkLook(d, ["#6A4B94", "#1F6BC0", "#3A5F55"], [[0, .45, .3, 24], [1, .58, .52, 22], [2, .42, .76, 16]]); sprinkle(d, "clear", 40, "mb"); d.tassel = Object.assign(d.tassel, { type: "silk", photo: "greyblue" }); d.hardware = "ringchain"; } },
  "g-purple-pen": { cat: "accessories", shape: "pen", f(d) { inkLook(d, ["#6A4B94", "#9A9A92", "#E6E0D8"], [[0, .45, .3, 24], [1, .58, .52, 22], [2, .42, .76, 16]]); } },
  "g-wood-ocean-stand": { cat: "kitchen", shape: "wood-coaster", f(d) { d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "none", size: "medium", dir: "flat" }); d.addins = AI(["sea-starfish"]); d.partial = 0.55; d.partialSide = "left"; } },
  "g-night-round": { cat: "paint", shape: "canvas-rect", f(d) { d.cm = { w: 30, h: 30 }; inkLook(d, ["#14151A", "#4A5090", "#6A4B94"], [[0, .45, .3, 24], [1, .58, .52, 22], [2, .42, .76, 16]]); sprinkle(d, "gunmetal", 40, "nr"); } },
  "g-night-coaster": { cat: "paint", shape: "canvas-rect", f(d) { d.cm = { w: 15, h: 15 }; inkLook(d, ["#6A4B94", "#4A5090", "#14151A"], [[0, .45, .3, 24], [1, .58, .52, 22], [2, .42, .76, 16]]); d.deco = "natural"; d.addins = AI(["tree-small"]); sprinkle(d, "clear", 30, "nc"); } },
  "g-birthday-canvas": { cat: "paint", shape: "canvas-rect", f(d) { d.cm = { w: 30, h: 80 }; inkLook(d, ["#6A4B94", "#7F9CC0", "#E6E0D8"], [[0, .45, .3, 24], [1, .58, .52, 22], [2, .42, .76, 16]]); d.deco = "natural"; d.addins = AI(["flower-pink", "flower-blue"]); sprinkle(d, "clear", 120, "bc"); sprinkle(d, "cobalt", 50, "bc2"); } },
  "g-key-e": { cat: "keychains", shape: "E", f(d) { d.style = "clear"; d.picked = []; d.deco = "charms"; d.addins = AI(["charm-pistol", "charm-ak", "charm-ak-mini", "charm-m4"]); sprinkle(d, "goldleaf", 200, "ke"); sprinkle(d, "gold", 50, "ke2"); d.tassel = Object.assign(d.tassel, { type: "silk", photo: "gold" }); d.hardware = "ringchain"; } },
  "g-key-a-star": { cat: "keychains", shape: "A", f(d) { inkLook(d, ["#B8693F", "#8A5F3C", "#D9959C"], [[0, .5, .35, 22], [1, .55, .7, 20], [2, .4, .55, 12]]); sprinkle(d, "copper", 40, "ka"); d.tassel = Object.assign(d.tassel, { type: "silk", photo: "orange" }); d.hardware = "ringchain"; } },
  "g-key-k": { cat: "keychains", shape: "K", f(d) { inkLook(d, ["#1F6BC0", "#7F9CC0", "#E6E0D8"], [[0, .45, .35, 20], [1, .55, .65, 16], [2, .4, .5, 12]]); d.hardware = "none"; } },
  "g-key-tail": { cat: "keychains", shape: "g-tail", f(d) { inkLook(d, ["#1F6BC0", "#4F8A9C", "#E6E0D8"], [[0, .5, .35, 20], [1, .55, .62, 18], [2, .45, .8, 14]]); d.hardware = "ringchain"; } },
  "g-pen-blue": { cat: "accessories", shape: "pen", f(d) { gradLook(d, ["#1F6BC0", "#7F9CC0", "#C9A99A"], "down"); } },
  "g-pen-ink": { cat: "accessories", shape: "pen", f(d) { inkLook(d, ["#1F6BC0", "#4F8A9C", "#E6E0D8"], [[0, .5, .3, 12], [1, .5, .6, 12], [2, .5, .85, 9]]); } },
  "g-pen": { cat: "accessories", shape: "pen", f(d) { d.style = "clear"; d.deco = "natural"; d.picked = []; d.addins = AI(["dried-pink", "flower-red"]); sprinkle(d, "goldleaf", 70, "pn"); } },
  "g-hairpin": { cat: "accessories", shape: "hairpin", f(d) { inkLook(d, ["#1F6BC0", "#6A4B94", "#7F9CC0"], [[0, .45, .3, 24], [1, .58, .52, 22], [2, .42, .76, 16]]); } },
  "g-bookmark": { cat: "accessories", shape: "bookmark", f(d) { d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "low", size: "medium", dir: "flat" }); d.addins = AI(["sea-starfish"]); d.tassel = Object.assign(d.tassel, { type: "silk", photo: "greyblue" }); d.hardware = "ringchain"; } },
  "g-paint1": { cat: "kitchen", shape: "soap", f(d) { d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "low", size: "medium", dir: "flat" }); } },
  "g-coaster-sea": { cat: "kitchen", shape: "coaster-set", f(d) { d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "low", size: "medium", dir: "flat" }); d.addins = AI(["sea-starfish"]); } },
  "g-coaster-ink": { cat: "kitchen", shape: "coaster-set", f(d) { inkLook(d, ["#1F6BC0", "#6A4B94", "#E6E0D8"], [[0, .45, .35, 24], [1, .6, .6, 22], [2, .4, .8, 16]]); sprinkle(d, "goldleaf", 60, "ci"); } },
  "g-coaster-stone": { cat: "kitchen", shape: "coaster", f(d) { gradLook(d, ["#B8693F", "#C9A99A", "#8A5F3C"], "diagonal"); sprinkle(d, "copper", 60, "cs"); } },
  "g-platter": { cat: "kitchen", shape: "tray-round", f(d) { d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "low", size: "big", dir: "flat" }); d.addins = AI(["sea-starfish"]); } },
  "g-nuts-dish": { cat: "kitchen", shape: "tray-round", f(d) { inkLook(d, ["#1F6BC0", "#4F8A9C", "#E6E0D8"], [[0, .4, .35, 26], [1, .6, .6, 24], [2, .45, .8, 18]]); } },
  "g-fruit-bowl": { cat: "kitchen", shape: "bowl", f(d) { gradLook(d, ["#1F6BC0", "#7F9CC0", "#E6E0D8"], "center"); } },
  "g-tealight": { cat: "kitchen", shape: "coaster", f(d) { inkLook(d, ["#4F8A9C", "#1F6BC0", "#E6E0D8"], [[0, .5, .4, 24], [1, .55, .65, 20], [2, .4, .55, 12]]); } },
  "g-tail": { cat: "cutting", shape: "board-whale-tail", f(d) { d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "middle", size: "big", dir: "flat" }); d.addins = AI(["sea-starfish"]); d.partial = 0.7; } },
  "g-woodtray": { cat: "cutting", shape: "board-rect", f(d) { d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "low", size: "medium", dir: "flat" }); d.partial = 0.6; d.partialAngle = 12; d.partialSide = "left"; } },
  "g-paddle": { cat: "cutting", shape: "board-rect", f(d) { d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "middle", size: "medium", dir: "left" }); d.addins = AI(["sea-shell-scallop"]); d.partial = 0.6; d.partialAngle = 10; } },
  "g-tree": { cat: "cutting", shape: "board-rect", f(d) { inkLook(d, ["#1F6BC0", "#4F8A9C", "#C9A99A"], [[0, .45, .4, 26], [1, .6, .65, 22], [2, .4, .78, 14]]); d.partial = 0.5; d.partialAngle = 12; } },
  "g-copper": { cat: "cutting", shape: "board-rect", f(d) { gradLook(d, ["#B8693F", "#C9A99A", "#C89B2E"], "diagonal"); sprinkle(d, "copper", 70, "gc"); d.partial = 0.55; d.partialAngle = -12; } },
};
function galleryDesign(key) {
  const g = GALLERY_DESIGNS[key]; if (!g) return null;
  const d = defaultDesign(); d.shape = g.shape; d.hardware = "none"; d.tassel.type = "none"; d.crush = []; d.addins = {}; d.deco = ""; d.picked = [];
  g.f(d); normaliseStyle(d); applyPicked(d); resetItems(d); layoutItems(d);
  if (customShape(d.shape) && customShape(d.shape).wood && d.style !== "ocean") { /* wood stays visible under the resin */ }
  return { d, cat: g.cat };
}

/* Ready-made step for sections other than keychains: pieces Anna already made in that section, rebuilt as digital designs */
function readyView() {
  const cat = ui.cat;
  const order = ["keychains", "accessories", "statues", "kitchen", "cutting", "paint"];
  const names = { keychains: U("catKey"), accessories: U("catAcc"), statues: U("catStat"), kitchen: U("catKit"), cutting: U("catCut"), paint: U("catPaint") };
  const caps = {};
  CONFIG.gallery.forEach((t) => t.items.forEach((it) => { if (it.img) caps[it.img.split("/").pop().replace(/\.\w+$/, "")] = it.cap; }));
  const card = (k) => { const gd = galleryDesign(k); if (!gd) return ""; return `<div class="card"><div class="card-art rl-pair"><figure><img src="images/real/${k}.jpg" alt="" loading="lazy" decoding="async"><figcaption>${U("realLife")}</figcaption></figure><figure><span class="rl-svg">${renderPiece(gd.d)}</span><figcaption>${U("designLbl")}</figcaption></figure></div><span class="card-name">${esc(caps[k] || k)}</span><div class="card-actions"><button type="button" class="btn btn-ink small" data-action="gallery" data-id="${k}" data-go="review">${U("orderThis")}</button><button type="button" class="btn btn-line small" data-action="gallery" data-id="${k}" data-go="edit">${U("changeIt")}</button></div></div>`; };
  const presetCards = (cat && cat !== "keychains") ? "" : CONFIG.presets.filter((p) => p.id !== "phuket-shoreline").map((p) => { const d = presetDesign(p); return `<div class="card"><div class="card-art rl-pair">${p.photo ? `<figure><img src="${esc(p.photo)}" alt="" loading="lazy" decoding="async"><figcaption>${U("realLife")}</figcaption></figure>` : ""}<figure><span class="rl-svg">${renderPiece(d)}</span><figcaption>${U("designLbl")}</figcaption></figure></div><span class="card-name">${p.name}</span><span class="card-text">${tr(p, "blurb")}</span><div class="card-actions"><button type="button" class="btn btn-ink small" data-action="preset" data-id="${p.id}" data-go="review">${U("orderThis")}</button><button type="button" class="btn btn-line small" data-action="preset" data-id="${p.id}" data-go="edit">${U("changeIt")}</button></div></div>`; }).join("");
  const secs = (cat ? [cat] : order).map((c) => {
    const keys = Object.keys(GALLERY_DESIGNS).filter((k) => GALLERY_DESIGNS[k].cat === c);
    const html = (c === "keychains" ? presetCards : "") + keys.map(card).join("");
    return html ? `<h3 class="mold-group">${names[c] || c}</h3><div class="cards presets">${html}</div>` : "";
  }).join("");
  if (!secs) return `<h2>${U("s0h")}</h2><p class="hint">${U("noReady")}</p><div class="field"><button type="button" class="btn btn-ink" data-action="scratch">${U("fromScratch")}</button></div>`;
  return `<h2>${U("s0h")}</h2><p class="hint">${U("s0p")}</p>${secs}<div class="field"><button type="button" class="btn btn-line" data-action="scratch">${U("fromScratch")}</button></div>`;
}

// the style is already chosen when a finished piece is opened, so go straight on to editing it
function afterStyle(d) { if (isGame(d.shape)) return 4; return d.style === "clear" ? INSIDE_STEP : d.style === "ocean" ? 5 : 4; }

/* ---------- Design helper: the customer describes what they want, we make 5 options ---------- */
const HELP_COLORS = { red: "#B04855", crimson: "#B04855", pink: "#D9959C", rose: "#C97080", blush: "#D9959C", magenta: "#8E3560", purple: "#6A4B94", lilac: "#9C86C4", violet: "#6A4B94", blue: "#1F6BC0", navy: "#4A5090", "light blue": "#7F9CC0", turquoise: "#4F8A9C", teal: "#4F8A9C", green: "#4C8A7C", mint: "#7FB59A", emerald: "#4C8A7C", yellow: "#C89B2E", gold: "#C89B2E", orange: "#D9742E", copper: "#B8693F", brown: "#8A5F3C", black: "#14151A", grey: "#9A9A92", gray: "#9A9A92", silver: "#9A9A92", white: "#E6E0D8", cream: "#E6E0D8", peach: "#C9A99A" };
const HELP_GLITTER = { red: "red", pink: "pink", rose: "palerose", purple: "purple", blue: "cobalt", navy: "navy", turquoise: "aqua", teal: "aqua", green: "green", gold: "gold", yellow: "lightgold", orange: "copper", copper: "copper", black: "black", white: "clear", cream: "champagne", silver: "clear", grey: "gunmetal", gray: "gunmetal" };
const HELP_SHAPES = [[/domino/, "domino-set", "Domino set"], [/chess/, "game-chess", "Chess board"], [/tic.?tac|noughts/, "game-ttt", "Tic-tac-toe"], [/bookmark/, "bookmark", "Bookmark"], [/pen\b/, "pen", "Pen"], [/hair ?pin|hair ?clip|bun pin|\bpin\b|\bclip\b/, "hairpin", "Butterfly bun pin"], [/comb|hair/, "comb", "Hair comb"], [/cup|coaster/, "coaster", "Cup stand"], [/bowl/, "bowl", "Seafood bowl"], [/soap/, "soap", "Soap dish"], [/canvas|painting/, "canvas-rect", "Canvas"], [/board|tray/, "board-rect", "Wooden board"], [/heart/, "heart", "Heart keychain"], [/star\b/, "star", "Star keychain"], [/circle|round/, "circle", "Round keychain"]];
var helperParse = function (text) {
  const t = " " + text.toLowerCase().replace(/[^a-z\s]/g, " ") + " ";
  let shape = "tag", label = "Keychain";
  const lm = text.match(/\bletter\s+([a-zA-Z])\b/i) || text.match(/\binitial\s+([a-zA-Z])\b/i);
  if (lm) { shape = lm[1].toUpperCase(); label = "Letter " + shape; }
  else for (const [re, id, nm] of HELP_SHAPES) if (re.test(t)) { shape = id; label = nm; break; }
  const found = [];
  Object.keys(HELP_COLORS).forEach((k) => { const i = t.indexOf(" " + k + " "); const i2 = t.indexOf(" " + k); if (i2 >= 0 && (i >= 0 || t.indexOf(" " + k + "s") >= 0)) found.push([i2, k]); });
  found.sort((a, b) => a[0] - b[0]);
  const names = []; found.forEach(([, k]) => { if (!names.includes(k) && !(k === "blue" && names.includes("light blue"))) names.push(k); });
  const cols = names.map((k) => HELP_COLORS[k]);
  const uniq = [...new Set(cols)];
  const glitterWord = /glitter|sparkle|shimmer|shiny/.test(t), little = /little|bit|some|light|subtle/.test(t);
  return { shape, label, names, cols: uniq, glitter: glitterWord, glitterAmt: glitterWord ? (little ? 40 : 110) : 0, hearts: /heart|love/.test(t), butterfly: /butterfl/.test(t), flower: /flower|floral|bloom|rose/.test(t), stars: /\bstar|stars/.test(t), gold: /gold/.test(t), sea: /sea|ocean|beach|shell|starfish/.test(t), crown: /crown|princess|queen/.test(t) };
}
const HELP_AUD = [
  ["kid", /\b(kid|child|son|daughter|boy|girl|toddler|baby|niece|nephew|little)\b|\b([3-9]|1[0-2])\s*(y|yo|year)/],
  ["teen", /\b(teen|teenager|1[3-9]\s*(y|yo|year)|high school|student)\b/],
  ["senior", /\b(grandma|grandmother|grandpa|grandfather|granddad|grandad|granny|elderly|senior|6\d|7\d|8\d)\b/],
  ["mom", /\b(mom|mum|mother|mama)\b/], ["dad", /\b(dad|father|papa)\b/],
  ["partner", /\b(boyfriend|girlfriend|wife|husband|partner|love|anniversary|valentine)\b/],
  ["friend", /\b(friend|bestie|sister|brother)\b/], ["work", /\b(boss|colleague|coworker|teacher|office|client)\b/]];
const HELP_LIKES = { frog: /frog/, cat: /\bcat|kitten/, bear: /\bbear/, guns: /\bgun|pistol|rifle|army|military|shoot/, money: /money|rich|dollar|cash|boss/, sea: /sea|ocean|beach|shell|starfish|wave|mermaid/, flower: /flower|floral|bloom|garden/, butterfly: /butterfl/, hearts: /heart/, crown: /crown|princess|queen|royal/, stars: /\bstar/, game: /game|play|chess|domino|tic|puzzle/, coffee: /coffee|latte|cafe|cappuccino|espresso|barista/ };
const HELP_AUDCOL = { boy: ["blue", "light blue", "navy"], girl: ["pink", "lilac", "rose"], kid: ["pink", "light blue", "yellow"], teen: ["purple", "black", "turquoise"], senior: ["rose", "cream", "gold"], mom: ["rose", "cream", "gold"], dad: ["navy", "grey", "brown"], partner: ["red", "pink", "gold"], friend: ["lilac", "turquoise", "pink"], work: ["navy", "silver", "white"] };
const _helperParse0 = helperParse;
helperParse = function (text) {
  const sp = _helperParse0(text), low = text.toLowerCase();
  sp.aud = (HELP_AUD.find(([, re]) => re.test(low)) || [""])[0];
  sp.likes = Object.keys(HELP_LIKES).filter((k) => HELP_LIKES[k].test(low));
  sp.hearts = /heart/.test(low); sp.gift = /gift|present|birthday|anniversary|surprise|souvenir|memory|memories|photo/.test(low);
  sp.named = sp.shape !== "tag" || /keychain|key ?ring|charm/.test(low);
  sp.gender = /\b(boy|son|nephew|brother|boyfriend|husband|dad|father|grandpa|grandfather|granddad|grandad|uncle|he|his)\b/.test(low) ? "boy" : /\b(girl|daughter|niece|sister|girlfriend|wife|mom|mum|mother|grandma|grandmother|granny|aunt|she|her)\b/.test(low) ? "girl" : "";
  sp.dark = /\b(dark|black|moody|deep|night|elegant|classy)\b/.test(low);
  sp.autoCol = !sp.cols.length;
  if (sp.autoCol) { const pick = sp.dark ? ["black", "navy", "grey"] : sp.likes.includes("frog") ? ["green", "mint", "cream"] : sp.likes.includes("sea") ? ["blue", "turquoise", "white"] : sp.likes.includes("guns") ? ["black", "grey", "gold"] : sp.likes.includes("money") ? ["green", "gold", "black"] : (sp.gender && ["kid", "teen", "friend", "partner", ""].includes(sp.aud) && HELP_AUDCOL[sp.gender]) || HELP_AUDCOL[sp.aud] || ["pink", "blue", "gold"]; sp.names = pick; sp.cols = pick.map((k) => HELP_COLORS[k]); }
  if (!sp.glitter) { sp.glitter = true; sp.glitterAmt = sp.aud === "kid" || sp.aud === "teen" ? 90 : 60; }
  if (sp.likes.includes("hearts")) sp.hearts = true; if (sp.likes.includes("butterfly")) sp.butterfly = true; if (sp.likes.includes("flower")) sp.flower = true; if (sp.likes.includes("crown")) sp.crown = true; if (sp.likes.includes("stars")) sp.stars = true; if (sp.likes.includes("sea")) sp.sea = true;
  return sp;
};
// charms that suit the person; the first ones that physically fit are used
function helperCharms(spec, v) {
  const L = spec.likes, a = [];
  if (L.includes("frog")) a.push("frog");
  if (L.includes("guns")) a.push("charm-pistol", "charm-ak-mini", "charm-m4");
  if (L.includes("money")) a.push("charm-moneybag-mini", "charm-dollar", "charm-coin");
  if (spec.hearts) a.push("sm-heart-ruby", "sm-heart-blue");
  if (spec.butterfly) a.push("sm-butterfly-pink", "sm-butterfly-teal");
  if (spec.crown) a.push("sm-crown-gold");
  if (spec.flower) a.push("flower-pink", "flower-cream");
  const def = { kid: ["frog", "sm-butterfly-pink", "sm-heart-ruby"], teen: ["sm-butterfly-teal", "sm-heart-blue", "charm-coin"], senior: ["flower-cream", "sm-heart-ruby"], mom: ["flower-pink", "sm-heart-ruby", "sm-butterfly-pink"], dad: ["charm-coin", "sm-heart-blue"], partner: ["sm-heart-ruby", "sm-heart-ruby"], friend: ["sm-butterfly-teal", "sm-heart-blue"], work: ["charm-coin", "sm-crown-gold"] }[spec.aud] || ["sm-heart-ruby", "sm-butterfly-pink", "flower-pink"];
  const all = [...new Set([...a, ...def])];
  return all.slice(v % 2, v % 2 + 4).concat(all);
}
// the 5 products offered, by who it is for
function helperPlan(spec) {
  const sh = spec.shape, L = spec.likes;
  const keep = spec.named && sh !== "tag" ? sh : null;
  const by = { kid: ["tag", "comb", "pen", "game-ttt", "bookmark"], teen: ["heart", "domino-set", "pen", "comb", "game-chess"], senior: ["bookmark", "coaster", "soap", "domino-set", "comb"], mom: ["bookmark", "coaster", "comb", "soap", "tag"], dad: ["game-chess", "domino-set", "pen", "coaster", "tag"], partner: ["heart", "bookmark", "game-chess", "comb", "tag"], friend: ["tag", "pen", "comb", "game-ttt", "bookmark"], work: ["pen", "coaster", "bookmark", "tag", "domino-set"], "": ["tag", "bookmark", "domino-set", "pen", "comb"] }[spec.aud].slice();
  if (L.includes("game") && !by.includes("domino-set")) by[2] = "domino-set";
  if (L.includes("sea")) by[1] = "soap";
  let shapes = by;
  if (keep) shapes = [keep, keep, keep, by.find((x) => x !== keep) || "tag", by.filter((x) => x !== keep)[1] || "heart"];
  const styles = keep ? ["ink", "clear", "ink", "ink", "clear"] : ["ink", "ink", "clear", "ink", "ink"];
  return shapes.map((shape, i) => ({ shape, style: spec.sea && !isGame(shape) && i % 2 ? "ocean" : styles[i], i }));
}
const HELP_SHAPE_NAME = { tag: "Keychain", heart: "Heart keychain", comb: "Hair comb", pen: "Pen", bookmark: "Bookmark", coaster: "Cup stand", soap: "Soap dish", "domino-set": "Domino set", "game-chess": "Chess set", "game-ttt": "Tic-tac-toe", circle: "Round keychain", star: "Star keychain" };
function helperBuild(spec, opt) {
  const v = opt.i, shape = opt.shape;
  const d = defaultDesign();
  d.shape = shape; d.hardware = "none"; d.tassel.type = "none"; d.crush = []; d.addins = {}; d.deco = ""; d.picked = [];
  if (hasHardware(shape) && !isGame(shape)) d.hardware = "ringchain";
  const base = spec.cols.slice(); const pad = ["#E6E0D8", "#C9A99A", "#C89B2E"]; while (base.length < 3) base.push(pad[base.length - 1] || "#E6E0D8");
  const rot = v % 3, cols = [base[rot], base[(rot + 1) % 3], base[(rot + 2) % 3]];
  const gl = HELP_GLITTER[spec.names[v % spec.names.length]] || HELP_GLITTER[spec.names[0]] || "gold";
  const amt = Math.min(spec.glitterAmt, 70) * 0.7;
  const spots = [[0, .45, .3, 24], [1, .58, .52, 22], [2, .42, .76, 16]];
  let style = opt.style;
  if (style === "clear" && noClear(shape)) style = "ink";
  if (isGame(shape) && style === "ocean") style = "gradient";
  if (style === "ocean") { d.style = "ocean"; d.ocean = Object.assign({}, d.ocean, { sand: "low", size: "medium", dir: "flat" }); d.addins = AI(["sea-starfish"]); }
  else if (style === "gradient") gradLook(d, cols, ["down", "diagonal", "center"][v % 3]);
  else if (style === "ink") inkLook(d, cols, spots);
  else { d.style = "clear"; d.picked = []; }
  if (style === "clear") sprinkle(d, spec.gold ? "goldleaf" : gl, 80 + amt, "hp" + v);
  if (style !== "ocean") {
    sprinkle(d, gl, Math.round(amt), "hg" + v);
        if (spec.hearts) sprinkle(d, "hearts", 16, "hh" + v);
    if (spec.stars) sprinkle(d, "stars", 16, "hs" + v);
    if (spec.gold) sprinkle(d, "goldleaf", 40 + v * 10, "hl" + v);
  }
  // charms: every option gets some where they physically fit (not on blended gradients, games or cup stands)
  if (style === "ink" || style === "clear") {
    const pool = helperCharms(spec, v), natural = pool.filter((x) => /^flower/.test(x)), chm = pool.filter((x) => !/^flower/.test(x));
    for (const mode of (v % 2 && natural.length ? ["natural", "charms"] : ["charms", "natural"])) {
      d.deco = mode; d.addins = {}; const ids = mode === "natural" ? natural : chm; let n = 0; const max = moldRank(shape) <= 0 ? 1 : v === 4 ? 2 : 3;
      ids.forEach((id) => { const ad = CONFIG.addins.find((x) => x.id === id); if (n < max && ad && !d.addins[id] && fits(ad, d)) { d.addins[id] = { amount: "few", place: "anna", color: ad.color }; n++; } });
      if (n) break; d.deco = "";
    }
  }
  if (isGame(shape) && shape !== "domino-set") {
    d.chess = { a: { c1: base[0], c2: "", foil: true }, b: { c1: base[1], c2: "", foil: true } };
    if (v % 2) d.chess = { a: { c1: "", c2: base[0], foil: true }, b: { c1: base[1], c2: base[2], foil: true } };
    if (shape === "game-ttt") d.chess = { a: { c1: base[0], c2: "", foil: false }, b: { c1: base[1], c2: "", foil: false } };
    d.style = "gradient";
  }
  normaliseStyle(d); applyPicked(d); resetItems(d); layoutItems(d);
  return d;
}

// Helper v3: pick from Anna's own ready-made designs (they look right), matched to colour, person and interest
const HELP_CATS = { seniorM: ["cutting", "statues", "kitchen", "paint", "accessories"], dadA: ["cutting", "statues", "paint", "kitchen", "keychains"], kid: ["keychains", "accessories", "statues", "paint", "kitchen"], teen: ["keychains", "statues", "accessories", "paint", "cutting"], senior: ["paint", "kitchen", "cutting", "accessories", "keychains"], mom: ["paint", "kitchen", "cutting", "accessories", "keychains"], dad: ["cutting", "statues", "paint", "kitchen", "keychains"], partner: ["paint", "keychains", "cutting", "accessories", "statues"], friend: ["keychains", "accessories", "statues", "paint", "kitchen"], work: ["cutting", "paint", "kitchen", "accessories", "keychains"], "": ["keychains", "statues", "paint", "accessories", "cutting"] };
function hexRgb(h) { const n = parseInt(h.replace("#", ""), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function helperDesignCols(d) { return d.style === "ocean" ? ["#1F6BC0", "#4F8A9C"] : (d.picked || []).filter((c) => /^#/.test(c)); }
function helperScore(spec, d, k) {
  const mine = helperDesignCols(d), want = spec.cols.map(hexRgb);
  let sc = 0;
  if (mine.length && want.length) { const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]); const m = mine.map(hexRgb); sc -= want.reduce((t, w) => t + Math.min(...m.map((x) => dist(x, w))), 0) / want.length; } else sc -= 200;
  if (spec.dark && mine.length) { const lum = mine.map(hexRgb).reduce((t, c) => t + (c[0] + c[1] + c[2]) / 3, 0) / mine.length; sc -= lum * 1.2; }
  if (spec.likes.includes("coffee") && /coffee/.test(k)) sc += 600;
  if (spec.likes.includes("sea") && d.style === "ocean") sc += 160;
  if (spec.likes.includes("sea") && d.shape === "canvas-rect" && d.style === "ocean") sc += 120;
  const grownMan = spec.gender === "boy" && ["senior", "dad", "work", "partner", ""].includes(spec.aud);
  if (grownMan && /^(hairpin|comb|heart)$/.test(d.shape)) sc -= 5000;
  if (spec.gender === "girl" && ["mom", "senior", "partner", "friend", "teen", "kid"].includes(spec.aud) && /^(hairpin|comb)$/.test(d.shape)) sc += 90;
  if (spec.likes.includes("game") && isGame(d.shape)) sc += 160;
  if (!spec.likes.includes("sea") && d.style === "ocean" && !spec.autoCol) sc -= 60;
  return sc;
}
function helperPicks(spec) {
  const all = Object.keys(GALLERY_DESIGNS).map((k) => { const g = galleryDesign(k); return g && { k, d: g.d, cat: g.cat, sc: helperScore(spec, g.d, k) + ((hashText(k + spec.names.join()) % 40) - 20) }; }).filter(Boolean);
  const order = (spec.aud === "senior" && spec.gender === "boy" ? HELP_CATS.seniorM : HELP_CATS[spec.aud] || HELP_CATS[""]).slice();
  const named = spec.named && spec.shape !== "tag" ? catOf(spec.shape) : "";
  const res = [], used = new Set();
  const take = (cat, n) => all.filter((x) => x.cat === cat && !used.has(x.k)).sort((a, b) => b.sc - a.sc).slice(0, n).forEach((x) => { used.add(x.k); res.push(x); });
  if (named) { all.filter((x) => x.d.shape === spec.shape).sort((a, b) => b.sc - a.sc).slice(0, 2).forEach((x) => { used.add(x.k); res.push(x); }); if (!res.length) take(named, 1); }
  order.forEach((c) => { if (res.length < 5 && c !== named) take(c, 1); });
  while (res.length < 5) { const r = all.filter((x) => !used.has(x.k)).sort((a, b) => b.sc - a.sc)[0]; if (!r) break; used.add(r.k); res.push(r); }
  const out = res.slice(0, 5);
  if (!out.some((x) => x.d.shape === "canvas-rect")) {
    const cv = all.filter((x) => x.d.shape === "canvas-rect" && !used.has(x.k) && !/coffee/.test(x.k) === !spec.likes.includes("coffee") || x.d.shape === "canvas-rect" && !used.has(x.k)).sort((a, b) => b.sc - a.sc)[0];
    if (cv) out[Math.min(3, out.length - 1)] = cv;
  }
  // grown men do not get hair accessories
  return out;
}
// grown-ups get dried flowers, children get small colourful charms, only where the piece can hold them
function helperCharmUp(spec, src) {
  const d = copy(src);
  if ((d.style !== "ink" && d.style !== "clear") || Object.keys(d.addins || {}).length || isGame(d.shape) || catOf(d.shape) === "cutting") return d;
  const kid = spec.aud === "kid" || (spec.aud === "teen" && !spec.dark);
  const tries = kid ? [["charms", ["frog", "sm-butterfly-pink", "sm-heart-ruby", "sm-butterfly-teal"]]] : [["natural", spec.dark ? ["dried-lavender", "dried-wheat"] : ["dried-pink", "dried-wheat", "dried-lavender"]]];
  for (const [mode, ids] of tries) {
    const keep = d.deco; d.deco = mode; let n = 0;
    ids.forEach((id) => { const ad = CONFIG.addins.find((x) => x.id === id); if (n < 2 && ad && fits(ad, d)) { d.addins[id] = { amount: "few", place: "anna", color: ad.color }; n++; } });
    if (n) { resetItems(d); layoutItems(d); return d; } d.deco = keep;
  }
  return d;
}
// recolour one of Anna's ink or gradient pieces to the colours asked for
function helperRecolor(spec, src) {
  const d = copy(src);
  if (spec.autoCol && !spec.gender && !spec.dark) return d;
  if ((d.style === "ink" || d.style === "gradient") && d.picked && d.picked.length) { const b = spec.cols.slice(); const pad = ["#E6E0D8", "#C9A99A", "#C89B2E"]; while (b.length < 3) b.push(pad[b.length - 1]); d.picked = b.slice(0, 3); d.style = "gradient"; d.gradient = { direction: ["diagonal", "down", "center"][hashText(src.shape + spec.names.join()) % 3], glitter: "none" }; applyPicked(d); }
  if (isGame(d.shape) && d.shape !== "domino-set" && d.chess) { const b = spec.cols.slice(); while (b.length < 3) b.push("#E6E0D8"); d.chess = { a: { c1: b[0], c2: "", foil: true }, b: { c1: b[1], c2: b[2], foil: true } }; }
  return d;
}
function helperTitle2(p) {
  const d = p.d, c = CONFIG.shapes.find((x) => x.id === d.shape) || {};
  const nm = isLetter(d.shape) ? "Letter " + d.shape + " keychain" : ({ "canvas-rect": "Canvas", "board-rect": "Wooden cutting board", "board-whale-tail": "Wooden cutting board" })[d.shape] || HELP_SHAPE_NAME[d.shape] || c.name || "Piece";
  const sea = d.shape === "canvas-rect" && d.style === "ocean" ? "Sea canvas" : "";
  if (sea) return sea;
  if (d.shape === "canvas-rect" && /coffee/.test(p.k)) return "Coffee art canvas";
  const lbl = { cutting: "wooden board", paint: "canvas", statues: "game set", kitchen: "for the table", accessories: "accessory", keychains: "keychain" }[p.cat] || "";
  return nm + (lbl && !nm.toLowerCase().includes(lbl) ? " · " + lbl : "");
}
function helperTitle(spec, d, opt) {
  const nm = isLetter(d.shape) ? "Letter " + d.shape + " keychain" : HELP_SHAPE_NAME[d.shape] || (CONFIG.shapes.find((x) => x.id === d.shape) || {}).name || "Piece";
  const ch = Object.keys(d.addins).map((id) => (CONFIG.addins.find((x) => x.id === id) || {}).name).filter(Boolean);
  const style = { ink: "swirled ink", gradient: "smooth blend", clear: "clear with glitter", ocean: "sea style" }[d.style] || "";
  return nm + " · " + style + (ch.length ? " + " + ch.slice(0, 2).join(", ").toLowerCase() : " + glitter");
}
function helperView() {
  const opts = ui.helperOpts || [];
  const T = (en, th, ru) => ({ th, ru }[ui.lang] || en);
  const sp = ui.helperSpec || {};
  const audN = { kid: "a child", teen: "a teen", senior: "an older person", mom: "mom", dad: "dad", partner: "a partner", friend: "a friend", work: "a colleague" }[sp.aud];
  return `<button type="button" class="btn btn-line small" data-action="choiceback">${U("catBack")}</button>
    <h2>${T("Describe your design", "บอกแบบที่อยากได้", "Опиши свой дизайн")}</h2>
    <p class="hint">${T("Tell me who it is for (age too), what they like, colours, a pet or a hobby. I will suggest 5 different pieces with charms and glitter, and you pick one.", "บอกว่าทำให้ใคร (อายุด้วย) เขาชอบอะไร สี สัตว์เลี้ยง หรืองานอดิเรก เราจะแนะนำ 5 ชิ้นที่ต่างกัน มีชาร์มและกากเพชร", "Расскажи, для кого (и возраст), что нравится, цвета, питомец или хобби. Я предложу 5 разных изделий с шармами и блёстками.")}</p>
    <div class="field"><textarea id="helper-text" rows="3" placeholder="${esc(T("e.g. A present for my 8 year old niece, she loves frogs and green", "เช่น ของขวัญหลานสาวอายุ 8 ขวบ ชอบกบและสีเขียว", "например: подарок племяннице 8 лет, любит лягушек и зелёный"))}">${esc(ui.helperText || "")}</textarea>
      <div class="helper-row"><button type="button" class="btn btn-ink" data-action="helpergo">${T("Suggest 5 options", "แนะนำ 5 แบบ", "Предложить 5 вариантов")}</button><button type="button" class="btn btn-line mic-btn ${ui.listening ? "rec" : ""}" data-action="helpermic" aria-pressed="${!!ui.listening}">🎤 ${ui.listening ? T("Listening… tap to stop", "กำลังฟัง… แตะเพื่อหยุด", "Слушаю… нажми, чтобы остановить") : T("Speak instead", "พูดแทนการพิมพ์", "Сказать голосом")}</button></div><p class="small-note" id="mic-note">${ui.micMsg || ""}</p></div>
    ${opts.length ? `<p class="small-note">${T("Understood as", "เข้าใจว่า", "Понял как")}: <b>${audN ? T("a gift for ", "ของขวัญสำหรับ ", "подарок для ") + esc(audN) : T("your idea", "ไอเดียของคุณ", "твоя идея")}</b>${sp.likes.length ? " · " + T("likes", "ชอบ", "любит") + " " + esc(sp.likes.join(", ")) : ""} · ${T("colours", "สี", "цвета")}: ${esc(sp.names.join(", "))}${sp.dark ? " (" + T("dark", "เข้ม", "тёмные") + ")" : ""} · ${T("suggested", "แนะนำ", "предлагаю")}: ${esc([...new Set(ui.helperTitles.map((x) => x.split(" · ")[0].toLowerCase()))].join(", "))}</p>
    <div class="cards presets">${opts.map((d, i) => `<div class="card"><div class="card-art rl-pair"><figure><img src="images/real/${ui.helperKeys[i]}.jpg" alt="" loading="lazy" decoding="async" onerror="this.parentNode.style.display='none';this.closest('.rl-pair').classList.add('solo')"><figcaption>${T("Made by Anna", "ผลงานจริง", "Работа Анны")}</figcaption></figure><figure><span class="rl-svg">${renderPiece(d)}</span><figcaption>${T("Design", "ดีไซน์", "Дизайн")}</figcaption></figure></div><span class="card-name">${T("Option", "แบบที่", "Вариант")} ${i + 1}: ${esc(ui.helperTitles[i])}</span><div class="card-actions"><button type="button" class="btn btn-ink small" data-action="helperpick" data-i="${i}" data-go="edit">${U("changeIt")}</button><button type="button" class="btn btn-line small" data-action="helperpick" data-i="${i}" data-go="review">${U("orderThis")}</button></div></div>`).join("")}${true ? `<a class="card" href="collage.html"><div class="card-art"><span class="rl-svg" style="display:grid;place-items:center;aspect-ratio:3/4;font-size:54px">🖼️</span></div><span class="card-name">${T("Recommended: upload your photos and we make a personal canvas", "แนะนำ: อัปโหลดรูปแล้วเราทำแคนวาสส่วนตัวให้", "Рекомендуем: загрузи фото, и мы сделаем личный холст")}</span><div class="card-actions"><span class="btn btn-ink small">${T("Create my canvas", "สร้างแคนวาส", "Создать холст")}</span></div></a>` : ""}</div>` : ""}`;
}
const STEP_VIEWS = [
  // 0 Ready-made
  () => ui.helper ? helperView() : (!ui.cat && !ui.pickReady) ? `<div class="start-hero"><h2>${U("choiceH")}</h2><div class="start-cards">
      <button type="button" class="start-card" data-action="pickready"><i>🖼️</i><b>${U("choiceReady")}</b><span>${({ th: "ดูผลงานจริงของเราและสั่งได้เลย", ru: "Готовые работы, которые можно заказать" }[ui.lang]) || "Browse our finished pieces and order one"}</span></button>
      <button type="button" class="start-card star" data-action="helper"><em>${({ th: "แนะนำ", ru: "Советуем" }[ui.lang]) || "Smart tip"}</em><i>✨</i><b>${U("helperBtn")}</b><span>${({ th: "บอกว่าให้ใคร ชอบอะไร เราเลือกแบบให้ 5 แบบ", ru: "Расскажи, для кого, и я предложу 5 вариантов" }[ui.lang]) || "Tell us who it is for and get 5 ideas"}</span></button>
      <button type="button" class="start-card" data-action="designown"><i>🎨</i><b>${U("choiceOwn")}</b><span>${({ th: "เลือกแม่พิมพ์ สี กากเพชร ทำเองทุกขั้นตอน", ru: "Выбери форму, цвета и блёстки сам" }[ui.lang]) || "Pick the mould, colours and glitter yourself, scroll down"}</span></button>
    </div></div>` + STEP_VIEWS[1]() : (ui.pickReady && !ui.cat ? `<button type="button" class="btn btn-line small" data-action="choiceback">${U("catBack")}</button>` : "") + readyView(),

  // 1 Mold (category first)
  () => {
    const CATS = [
      { id: "keychains", name: U("catKey"), text: U("catKeyP"), shape: "A" },
      { id: "accessories", name: U("catAcc"), text: U("catAccP"), shape: "bookmark" },
      { id: "statues", name: U("catStat"), text: U("catStatP"), shape: "game-chess" },
      { id: "kitchen", name: U("catKit"), text: U("catKitP"), shape: "coaster-set" },
      { id: "cutting", name: U("catCut"), text: U("catCutP"), shape: "board-rect" },
      { id: "paint", name: U("catPaint"), text: U("catPaintP"), shape: "canvas-rect" },
      { id: "gift", name: U("catGift"), text: U("catGiftP"), shape: "circle" },
    ];
    if (!ui.cat) {
      return `<a class="btn btn-line small" href="index.html">${U("backHome")}</a>${hasDraft() ? `<button type="button" class="btn btn-ink small" data-action="loaddraft">${U("draftContinue")}</button>` : ""}<h2>${U("catH")}</h2><p class="hint">${U("catP")}</p>
      <div class="cards cats">${CATS.map((c) => {
        const d = merge(copy(design), { shape: c.shape, hardware: "none" });
        if (c.shape === "A") d.font = "block";
        const imgs = (CONFIG.references[c.id] || []).map((r) => r.img).slice(0, 8);
        const art = imgs.length ? `<span class="card-art cat-slides"><span class="slides">${imgs.concat(imgs[0]).map((im) => `<img src="${im}" alt="" decoding="async">`).join("")}</span></span>` : `<span class="card-art">${renderPiece(d)}</span>`;
        const inner = `${art}<span class="card-name">${c.name}</span><span class="card-text">${c.text}</span>`;
        const col = { keychains: "#134B63", accessories: "#E8806C", statues: "#8C6BB1", kitchen: "#2E8B8B", cutting: "#B5803E", paint: "#2F5FA8", gift: "#C45160" }[c.id] || "#134B63";
        return c.href ? `<a class="card cat photo" style="--c:${col}" href="${c.href}">${inner}</a>` : `<button type="button" class="card cat photo" style="--c:${col}" data-action="cat" data-id="${c.id}">${inner}</button>`;
      }).join("")}</div>`;
    }
    const card = (label, shape, on, extra = "") => {
      const d = merge(copy(design), { shape, hardware: "none" });
      if (extra) Object.assign(d, JSON.parse(extra));
      return `<button type="button" class="card ${on ? "on" : ""}" aria-pressed="${on}" data-action="mold" data-shape="${shape}" ${extra ? `data-extra='${extra}'` : ""}><span class="card-art">${renderPiece(d)}</span><span class="card-name">${label}</span></button>`;
    };
    const ICON = { bookmark: "🔖", "bm-paw": "🐾", "bm-bunny": "🐰", "bm-cat": "🐱", feather: "🪶", comb: "COMB", "comb-moon": "MOON", hairpin: "🦋", pen: "✒️", blade: "🖊️", "bm-glass1": "💎", "bm-glass2": "💎", "bm-pebbles": "🪨", "bm-hearts": "💗", "bm-paws": "🐾" };
    const COMB = '<svg viewBox="0 0 40 24" width="30" height="22"><path d="M3 4h34v6H3z" fill="#C9A47A"/><path d="M5 10v11M10 10v11M15 10v11M20 10v11M25 10v11M30 10v11M35 10v11" stroke="#8A6A45" stroke-width="2.4" stroke-linecap="round"/></svg>';
    const MOON = '<svg viewBox="0 0 40 24" width="30" height="22"><path d="M3 20C3 9 11 3 20 3s17 6 17 17z" fill="#C9A47A"/><path d="M8 20v-4M13 20v-5M18 20v-5M23 20v-5M28 20v-5M33 20v-4" stroke="#8A6A45" stroke-width="2.4" stroke-linecap="round"/></svg>';
    const icon = (id) => { const i = ICON[id]; return i ? `<i class="mold-ico">${i === "COMB" ? COMB : i === "MOON" ? MOON : i}</i>` : ""; };
    const byIds = (ids) => ids.map((id) => CONFIG.shapes.find((x) => x.id === id)).filter(Boolean)
      .map((sh) => card(icon(sh.id) + tr(sh, "name"), sh.id, design.shape === sh.id)).join("");
    const sizeEditor = (title, ids, key, extra = "") => {
      const cm = design.cm || { w: 30, h: 40 };
      const num = (k, v) => `<label class="cm-field"><span>${U(k === "w" ? "cmWidth" : "cmHeight")}</span><input type="number" inputmode="decimal" min="10" max="200" step="1" data-cm="${k}" value="${v}"><b>cm</b></label><input type="range" min="10" max="200" step="1" data-cm="${k}" value="${v}" aria-label="${U(k === "w" ? "cmWidth" : "cmHeight")}">`;
      const rec = [[20, 20], [30, 40], [40, 50], [50, 70], [60, 90]].map(([w, h]) => `<button type="button" class="chip" data-cm-set="${w}x${h}">${w} × ${h}</button>`).join("");
      return `<div class="field size-box"><div class="size-prev" id="size-prev"><div class="size-rect" id="size-rect" style="aspect-ratio:${cm.w} / ${cm.h}"><b>${cm.w} × ${cm.h} cm</b></div></div><span class="field-label">${U("cmTitle")}</span><div class="cm-row">${num("w", cm.w)}</div><div class="cm-row">${num("h", cm.h)}</div><div class="chips"><span class="small-note">${U("cmRecommended")}</span>${rec}</div>${extra}</div>`;
    };
    const cupCards = () => {
      const one = (id, label) => {
        const sh = CONFIG.shapes.find((x) => x.id === id); if (!sh) return "";
        const on = design.shape === id, d = merge(copy(design), { shape: id, hardware: "none" }), n = on ? design.qty || 1 : 1;
        return `<div class="card cupcard ${on ? "on" : ""}"><button type="button" class="cup-art" aria-pressed="${on}" data-action="mold" data-shape="${id}"><span class="card-art">${renderPiece(d)}</span><span class="card-name">${label}</span></button><div class="qty sm"><button type="button" data-qty="-1" aria-label="-" ${n <= 1 ? "disabled" : ""}>−</button><b>${n}</b><button type="button" data-qty="1" aria-label="+" ${n >= 50 ? "disabled" : ""}>+</button></div></div>`;
      };
      return one("coaster", tr(CONFIG.shapes.find((x) => x.id === "coaster"), "name")) + one("wood-coaster", tr(CONFIG.shapes.find((x) => x.id === "wood-coaster") || {}, "name")) + byIds(["coaster-set"]);
    };
    const group = (title, html, key = "") => `<h3 class="mold-group" ${key ? `id="grp-${key}"` : ""}>${title}</h3><div class="cards molds">${html}</div>`;
    const isL = isLetter(design.shape) || isNumber(design.shape);
    let body = "";
    if (ui.cat === "keychains") {
      body = group(U("grpLetters"), card(U("fontBlock"), isL ? design.shape : "A", isL && design.font !== "groovy", '{"font":"block"}') + card(U("fontGroovy"), isL ? design.shape : "A", isL && design.font === "groovy", '{"font":"groovy"}'), "letters")
        + group(U("grpPendants"), byIds(PENDANTS.concat(SEA_KEYCHAINS)), "pendants");
    } else if (ui.cat === "accessories") {
      const sub = (t, ids) => `<h4 class="looks-h">${t}</h4><div class="cards molds">${byIds(ids)}</div>`;
      body = group(U("grpPens"), byIds(["pen", "blade"]), "pens")
        + group(U("grpCombs"), byIds(["comb", "comb-moon", "hairpin"]), "combs")
        + `<h3 class="mold-group" id="grp-bookmarks">${U("grpBookmarksAll")}</h3>` + sub(U("bmPlain"), ["bookmark"]) + sub(U("bmAnimals"), ["bm-paw", "bm-bunny", "bm-cat"]) + sub(U("bmNature"), ["feather"]) + sub(U("bmTextured"), ["bm-glass1", "bm-glass2", "bm-pebbles", "bm-hearts", "bm-paws"]);
    } else if (ui.cat === "paint") {
      body = sizeEditor(U("catPaint"), ["canvas-rect"], "paintings", `<p class="small-note">${U("canvasNote")}</p>`);
    } else if (ui.cat === "statues") {
      body = group(U("grpGames"), byIds(["game-ttt", "game-chess", "domino-set"]), "games")+ `<p class="small-note">${U("moreSoon")}</p>`;
    } else if (ui.cat === "cutting") {
      const cm = design.cm || { w: 30, h: 40 };
      const num = (k, v) => `<label class="cm-field"><span>${U(k === "w" ? "cmWidth" : "cmHeight")}</span><input type="number" inputmode="decimal" min="10" max="200" step="1" data-cm="${k}" value="${v}"><b>cm</b></label><input type="range" min="10" max="200" step="1" data-cm="${k}" value="${v}" aria-label="${U(k === "w" ? "cmWidth" : "cmHeight")}">`;
      const rec = [[30, 20], [40, 25], [50, 30], [60, 40]].map(([w, h]) => `<button type="button" class="chip" data-cm-set="${w}x${h}">${w} × ${h}</button>`).join("");
      body = `<div class="field size-box">
          <span class="field-label">${U("cmTitle")}</span><div class="cm-row">${num("w", cm.w)}</div><div class="cm-row">${num("h", cm.h)}</div><div class="chips"><span class="small-note">${U("cmRecommended")}</span>${rec}</div><p class="small-note">${U("cmNote")}</p>
        </div>${(() => { const L = (en, th, ru) => ({ th, ru }[ui.lang] || en), cur = design.partial ? (design.partialSide || "top") + (design.partialAngle ? "-diag" : "") : "full"; const o = [["full", L("Resin on the whole board", "เรซิ่นทั้งแผ่น", "Смола на всей доске")], ["top", L("Top part only", "เฉพาะด้านบน", "Только верх")], ["left", L("Left part only", "เฉพาะด้านซ้าย", "Только слева")], ["right", L("Right part only", "เฉพาะด้านขวา", "Только справа")], ["top-diag", L("Top, diagonal edge", "ด้านบน ขอบเฉียง", "Верх, диагональ")], ["left-diag", L("Left, diagonal edge", "ด้านซ้าย ขอบเฉียง", "Слева, диагональ")]]; return `<div class="field"><span class="field-label">${L("Where is the resin?", "เรซิ่นอยู่ตรงไหน", "Где смола?")}</span><div class="chips">${o.map(([k, n]) => `<button type="button" class="chip ${cur === k ? "on" : ""}" data-cover="${k}">${n}</button>`).join("")}</div></div>`; })()}${field(U("customShapeCard"), `<input type="file" accept="image/*" id="shape-photo">${ui.photo ? `<img class="ref-photo" src="${ui.photo}" alt="">` : ""}`, U("customShapeNote2"))}`;
    } else if (ui.cat === "gift") {
      body = `<div class="big-cards">` + group(U("grpPhoto"), `<a class="card" href="collage.html"><span class="card-art has-photo"><img src="images/real/g-collage.jpg" alt=""></span><span class="card-name">${U("uploadPhotos")}</span></a>` + byIds(["frame-oval"]), "photo") + `</div><p class="small-note">${U("photoNote")}</p>`;
    } else {
      body = group(U("grpCups"), cupCards(), "cups") + `<p class="small-note">${U("cupsNote")}</p>`
        + group(U("grpSoap"), byIds(["soap"]), "soap")
        + group(U("grpBowls"), byIds(["bowl", "bowl-big"]), "bowls") + `<p class="small-note">${U("bowlNote")}</p>`
        + group(U("grpTrays"), byIds(["tray-round", "tray-oval", "tray-tall"]), "trays") + `<p class="small-note">${U("traysNote")}</p>`
        + group(U("grpLight"), byIds(["light-holder"]), "light");
    }
    const refs = (CONFIG.references && CONFIG.references[ui.cat]) || [];
    const refHtml = refs.length ? `<section class="example-work"><div class="ex-head"><h3>${U("refTitle")}</h3><p>${U("refSub")}</p></div><div class="refs">${refs.map((r) => { const key = r.img.split("/").pop().replace(/\.\w+$/, ""); const pre = CONFIG.presets.find((p) => p.photo === r.img); const href = GALLERY_DESIGNS[key] ? `design.html?gallery=${key}` : pre ? `design.html?preset=${pre.id}` : ""; const img = `<img src="${r.img}" alt="" decoding="async">`; return `<figure>${href ? `<a href="${href}" class="ex-link">${img}<span class="ex-open">${U("seeDigital")}</span></a>` : img}<figcaption>${esc(r.cap)}</figcaption></figure>`; }).join("")}</div></section>` : "";
    return `<button type="button" class="btn btn-line small" data-action="cat" data-id="">${U("catBack")}</button>
      <h2>${U("sMoldH")}</h2><p class="hint">${U("sMoldP")}</p>${body}${refHtml}`;
  },

  // 2 Letter
  () => {
    const keys = (isNumber(design.shape) ? "0123456789" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ").split("");
    return `
    <h2>${U("s1h")}</h2>
    <p class="hint">${U("s1p")}</p>
    ${isLetter(design.shape) || isNumber(design.shape) ? field(U("fontStyle"), chips("font", "font", design.font)) : ""}
    <div class="chips"><button type="button" class="chip ${isLetter(design.shape) ? "on" : ""}" data-action="mold" data-shape="A">${U("moldLetters")}</button>${design.font === "groovy" ? "" : `<button type="button" class="chip ${isNumber(design.shape) ? "on" : ""}" data-action="mold" data-shape="1">${U("moldNumbers")}</button>`}</div>
    <div class="letters">${keys.map((k) =>
      `<button type="button" class="letter ${design.shape === k ? "on" : ""}" aria-pressed="${design.shape === k}" data-set="shape" data-value="${k}">${k}</button>`).join("")}</div>
    ${field(U("second"),
      `<div class="letters">${[""].concat(keys).map((k) => { const on = (design.second || "") === k; return `<button type="button" class="letter ${on ? "on" : ""}" aria-pressed="${on}" data-set="second" data-value="${on && k ? "" : k}">${k || "—"}</button>`; }).join("")}</div>`,
      U("secondNote"))}`;
  },

  // 3 Style
  () => `
    <h2>${U("s2h")}</h2>
    <p class="hint">${U("s2p")}</p>
    ${inspirationHtml()}
    <div class="cards">${Object.keys(I18N.en.labels.style).filter((st) => !(noClear(design.shape) && st === "clear")).map((st) => {
      const d = merge(copy(design), { style: st, picked: design.picked.length ? design.picked : DEFAULT_COLORS.slice(), ink: Object.assign({}, design.ink, { legacy: true }) });
      applyPicked(d);
      return `<button type="button" class="card ${design.style === st ? "on" : ""}" aria-pressed="${design.style === st}" data-set="style" data-value="${st}">
        <span class="card-art">${renderPiece(d)}</span>
        <span class="card-name">${lab("style", st)}</span>
        <span class="card-text">${lab("styleText", st)}</span>
      </button>`;
    }).join("")}</div>`,

  // 4 Colours (comes before the style details)
  () => {
    if (isGame(design.shape)) return chessPanel();
    if (design.style === "clear") {
      return `<h2>${U("s4h")}</h2><p class="hint">${U("s4clearP")}</p>
        <button type="button" class="btn btn-ink" data-action="goto" data-step="3">${U("changeStyle")}</button>
        `;
    }
    const picked = design.picked;
    const nameOf = (hex) => { const c = CONFIG.colors.find((x) => x.hex === hex); return c ? tr(c, "name") : hex; };
    return `<h2>${U("s4h")}</h2>
      <p class="hint">${U("s4p")}</p>
      ${field(U("palettes"), `<div class="chips">${CONFIG.palettes.map((p, i) =>
        `<button type="button" class="chip" data-action="palette" data-i="${i}"><span class="dots">${p.colors.map((c) => `<span class="dot" style="background:${c}"></span>`).join("")}</span>${tr(p, "name")}</button>`).join("")}</div>`)}
      ${field(U("yourColours"), `<div class="slots">${[0, 1, 2].map((i) => picked[i]
        ? `<button type="button" class="slot on" data-action="slot" data-i="${i}" aria-label="${esc(nameOf(picked[i]))}"><span class="blob" style="background:${picked[i]}"></span>${esc(nameOf(picked[i]))} ✕</button>`
        : `<span class="slot"><span class="blob empty"></span>${U("pickOne")}</span>`).join("")}</div>`)}
      ${field(U("allColours"), `<div class="swatches">${CONFIG.colors.map((c) =>
        `<button type="button" class="swatch ${picked.includes(c.hex) ? "on" : ""}" style="background:${c.hex}" title="${esc(tr(c, "name"))}" aria-label="${esc(tr(c, "name"))}" aria-pressed="${picked.includes(c.hex)}" data-action="swatch" data-hex="${c.hex}"></button>`).join("")}</div>`)}
      `;
  },

  // 5 Details (after the colours)
  () => {
    if (design.style === "clear") return `<h2>${U("s3clearH")}</h2><p class="hint">${U("s3clearP")}</p>`;
    if (design.style === "gradient") {
      return `<h2>${U("s3gradH")}</h2><p class="hint">${U("s3gradP")}</p>
        ${field(U("direction"), chips("gradient.direction", "direction", design.gradient.direction))}`;
    }
    if (design.style === "ink") {
      const k = design.ink;
      return `<h2>${U("s3inkH")}</h2><p class="hint">${U("s3inkP")}</p>
        <p class="ink-warn">${U("inkWarn")}</p>
        ${field(U("inkFlow"), `<div class="cards flow-cards">${["spread", "tight"].map((v) => `<button type="button" class="card ${k.flow === v ? "on" : ""}" aria-pressed="${k.flow === v}" data-set="ink.flow" data-value="${v}"><span class="card-name">${U(v === "spread" ? "inkFlowWide" : "inkFlowTight")}</span><span class="card-text">${U(v === "spread" ? "inkFlowWideP" : "inkFlowTightP")}</span></button>`).join("")}</div>`)}
        ${design.picked.length ? field(U("inkDrop"), `<div class="slots ink-colours">${design.picked.map((hex, i) => `<button type="button" class="slot ${ui.inkCol === i ? "on" : ""}" data-action="inkcol" data-i="${i}"><span class="blob" style="background:${hex}"></span>${esc(colorName(hex))}</button>`).join("")}</div>
          <div class="chips brush-sizes">${["s", "m", "l"].map((v) => `<button type="button" class="chip brush ${design.inkSize === v ? "on" : ""}" data-set="inkSize" data-value="${v}"><span class="brush-dot" style="width:${{ s: 8, m: 16, l: 28 }[v]}px;height:${{ s: 8, m: 16, l: 28 }[v]}px"></span>${U("glSz")[v]}</button>`).join("")}</div>
          <div class="chips"><button type="button" class="btn btn-line small" data-action="inkundo" ${design.inkDrops.length ? "" : "disabled"}>${U("glUndo")}</button><button type="button" class="btn btn-line small" data-action="inkclear" ${design.inkDrops.length ? "" : "disabled"}>${U("inkClear")}</button></div>`, U("inkDropNote")) : `<p class="small-note">${U("inkPickFirst")} <button type="button" class="btn btn-line small" data-action="goto" data-step="4">${U("colours")}</button></p>`}`;
    }
    const o = design.ocean;
    return `<h2>${U("s3oceanH")}</h2><p class="hint">${U("s3oceanP")}</p>
      ${field(U("sand"), chips("ocean.sand", "sand", o.sand, ["low", "middle", "high"]))}
      ${field(U("waveSize"), chips("ocean.size", "waveSize", o.size))}
      ${field(U("waveDir"), chips("ocean.dir", "waveDir", o.dir))}
      <p class="small-note">${U("oceanNote2")}</p>`;
  },

  // 6 Glitter
  () => {
    const cur = ui.pour.id;
    const grid = CONFIG.glitters.map((g) =>
      `<button type="button" class="gl ${cur === g.id ? "on" : ""}" aria-pressed="${cur === g.id}" data-glitter="${g.id}" data-gdrag="${g.id}" title="${esc(tr(g, "name"))}">
        <span class="gl-img"><img src="images/glitter/${g.id}.png" alt="" draggable="false"></span><span class="gl-name">${tr(g, "name")}</span></button>`).join("");
    const seg = (key, vals, current, group) => `<div class="chips">${vals.map((v) =>
      `<button type="button" class="chip ${current === v ? "on" : ""}" aria-pressed="${current === v}" data-pour="${key}" data-value="${v}">${U(group)[v]}</button>`).join("")}</div>`;
    return `
    <h2>${U("sGlH")}</h2>
    <p class="hint">${U("sGlP")}</p>
    ${field(U("glSize"), `<div class="chips brush-sizes">${["s", "m", "l"].map((v) => `<button type="button" class="chip brush ${ui.pour.size === v ? "on" : ""}" aria-pressed="${ui.pour.size === v}" data-pour="size" data-value="${v}"><span class="brush-dot" style="width:${{ s: 6, m: 16, l: 30 }[v]}px;height:${{ s: 6, m: 16, l: 30 }[v]}px"></span>${U("glSz")[v]}</button>`).join("")}</div>`)}
    <div class="gl-grid">${grid}</div>
    ${cur ? `<p class="gl-hint">${U("glHint", { name: glitterName(cur) })}</p>` : ""}
    
    <div class="chips">
      <button type="button" class="btn btn-line small" data-action="glfill" ${cur ? "" : "disabled"}>${U("glFill")}</button>
      <button type="button" class="btn btn-line small" data-action="glundo" ${ui.pourHistory.length ? "" : "disabled"}>${U("glUndo")}</button>
      <button type="button" class="btn btn-line small" data-action="glclear" ${design.crush.length ? "" : "disabled"}>${U("glClear")}</button>
    </div>`;
  },

  // 7 Inside (tiny metal letters and your photo are part of this step)
  () => {
    const L = design.letters;
    const lettersBlock = `<div class="addin ${L.text ? "on" : ""}">
      ${field(U("ltText"), `<input class="text-input wide-input" type="text" maxlength="4" autocomplete="off" aria-label="${U("ltText")}" data-set="letters.text" data-ltr="1" value="${esc(L.text)}" placeholder="${esc(U("ltPh"))}">`, U("ltNote"))}
      ${field(U("ltMetal"), `<div class="chips">${["gold", "yellow", "copper", "silver", "chrome", "black"].map((m) =>
        `<button type="button" class="chip ${L.metal === m ? "on" : ""}" aria-pressed="${L.metal === m}" data-set="letters.metal" data-value="${m}"><span class="dot lt-dot" style="background:url(images/letters/${m}.jpg) center/cover"></span>${lab("lmetal", m)}</button>`).join("")}</div>`, L.text ? U("ltDrag") : "")}
    </div>`;
    const photoBlock = `
    ${field("", `<input type="file" accept="image/*" id="piece-photo">${design.photo.on && ui.photo ? `
      <div class="field"><span class="field-label">${U("photoZoom")}</span><input type="range" min="1" max="3" step="0.05" value="${design.photo.zoom}" data-set="photo.zoom" data-num="1"></div>
      <div class="field"><span class="field-label">${U("photoX")}</span><input type="range" min="-100" max="100" step="2" value="${design.photo.x}" data-set="photo.x" data-num="1"></div>
      <div class="field"><span class="field-label">${U("photoY")}</span><input type="range" min="-150" max="150" step="2" value="${design.photo.y}" data-set="photo.y" data-num="1"></div>
      <button type="button" class="btn btn-line small" data-action="photooff">${U("photoRemove")}</button>` : ""}`, U("photoNote2"))}
`;
    const decoPick = `<div class="field"><span class="field-label">${U("decoQ")}</span><div class="cards deco-cards">
      <button type="button" class="card deco ${design.deco === "natural" ? "on" : ""}" data-action="deco" data-id="natural"><span class="deco-pics charms-pics"><i><img src="images/sea/starfish.png" alt=""></i><i><img src="images/sea/shell-scallop.png" alt=""></i><i><img src="images/flowers/pink.png" alt=""></i><i><img src="images/dried/lavender.png" alt=""></i></span><span class="card-name">${U("decoNat")}</span><span class="card-text">${U("decoNatP")}</span></button>
      <button type="button" class="card deco ${design.deco === "charms" ? "on" : ""}" data-action="deco" data-id="charms"><span class="deco-pics charms-pics"><i><img src="images/small/frog-green.png" alt=""></i><i><img src="images/small/crown-gold.png" alt=""></i><i><img src="images/small/butterfly-teal.png" alt=""></i><i><img src="images/small/rose-pink.png" alt=""></i></span><span class="card-name">${U("decoCharm")}</span><span class="card-text">${U("decoCharmP")}</span></button></div></div>`;
    const decoPick2 = isCup(design.shape) ? decoPick.replace(/<button type="button" class="card deco[^"]*" data-action="deco" data-id="charms">[\s\S]*?<\/button>/, "") : decoPick;
    if (!design.deco && design.style !== "ocean") return `<h2>${U("s5h")}</h2><p class="hint">${U("decoHint")} ${U("note3d")}</p>${decoPick2}`;
    if (design.shape === "frame-oval") design.deco = design.deco || "charms";
    const list = CONFIG.addins.filter((a) => fits(a, design));
    const itemHtml = (a0) => {
      const fk = familyOf(a0.id);
      let a = a0;
      if (fk) {
        const F = FAMILIES[fk];
        if (a0.id !== F.ids[0]) return "";
        const cur = F.ids.find((id) => design.addins[id]) || ui.fam[fk] || F.ids[0];
        a = CONFIG.addins.find((x) => x.id === cur) || a0;
        const dots = F.random ? "" : F.ids.map((id, i) => `<button type="button" class="fam-dot ${F.thumb ? "thumb" : ""} ${cur === id ? "on" : ""}" style="background:${F.thumb ? `#fff url(${(CONFIG.addins.find((x) => x.id === id) || {}).img}) center/contain no-repeat` : F.cols[i]}" data-action="variant" data-fam="${fk}" data-id="${id}" aria-label="${esc(F.name)} ${i + 1}"></button>`).join("");
        const sel0 = design.addins[a.id], on0 = !!sel0;
        return `<div class="addin ${on0 ? "on" : ""}"><button type="button" class="addin-head" data-action="addin" data-id="${a.id}" aria-pressed="${on0}"><span class="em" style="background:#E9F1F0 url(${a.img}) center/contain no-repeat"></span><span class="nm">${tr({ name: F.name, name_th: (PHRASES.th || {})[F.name], name_ru: (PHRASES.ru || {})[F.name] }, "name")}</span><span class="tick">${on0 ? U("added") : U("add")}</span></button>${F.random ? "" : `<div class="fam-dots"><span class="small-note">${F.thumb ? U("pickKind") : U("pickColour")}</span>${dots}</div>`}</div>`;
      }
      const sel = design.addins[a.id];
      const reason = blockedReason(a.id, design);
      const on = !!sel && !reason;
      const body = "";
      return `<div class="addin ${on ? "on" : ""} ${reason ? "off" : ""}">
        <button type="button" class="addin-head" data-action="addin" data-id="${a.id}" aria-pressed="${on}" ${reason ? "disabled" : ""}>
          <span class="em" data-drag="${a.id}" title="${esc(U("dropHint"))}" style="background:#E9F1F0 url(${a.img}) center/contain no-repeat"></span>
          <span class="nm">${tr(a, "name")}${POKE_GROUPS.includes(a.group) ? `<small class="poke">${U("poke3d")}</small>` : ""}</span>
          <span class="tick">${on ? U("added") : U("add")}</span>
        </button>
        ${reason ? `<p class="why">${reason}</p>` : ""}
        ${body}
      </div>`;
    };
    // one folded section per kind of piece, so the list stays calm
    const order = [];
    list.forEach((a) => { const k = a.group || "frog"; if (!order.includes(k)) order.push(k); });
    window.FAMILIES = {
  butterfly: { name: "Butterfly", ids: ["sm-butterfly-teal", "sm-butterfly-pink", "sm-butterfly-sunset", "sm-butterfly-amber", "sm-butterfly-brown", "sm-butterfly-black"], cols: ["#4F9FA3", "#E58FA6", "#E7A24A", "#D8B66A", "#8A5A3A", "#2A2A30"] },
  heart: { name: "Heart", ids: ["sm-heart-ruby", "sm-heart-blue", "sm-heart-yellow", "sm-heart-black"], cols: ["#C8283A", "#2F5FC4", "#E8C23A", "#1E1E22"] },
  crown: { name: "Crown", ids: ["sm-crown-gold", "sm-crown-rose", "sm-crown-bronze"], cols: ["#D4A93C", "#D9959C", "#A56B3E"] },
  rose: { name: "Rose", ids: ["sm-rose-pink", "sm-rose-red", "sm-rose-champagne", "sm-rose-purple", "sm-rose-blue"], cols: ["#E58FA6", "#B5232F", "#E3C9A8", "#7E4FB5", "#8FB6D9"] },
  turtle: { name: "Turtle", ids: ["sm-turtle-pink", "sm-turtle-yellow", "sm-turtle-brown"], cols: ["#E58FA6", "#E8C23A", "#8A5A3A"] },
  crab: { name: "Crab", ids: ["sm-crab-red", "sm-crab-yellow", "sm-crab-green"], cols: ["#C8283A", "#E8C23A", "#4C9A4A"] },
  metalsea: { name: "Metal seashell (not natural)", thumb: true, ids: ["sm-shell-gold", "sm-shell-blue", "sm-starfish-gold"] },
  scallop: { name: "Scallop shell", ids: ["sea-shell-scallop", "sea-shell-pink"], cols: ["#F2DCCB", "#EFA9A0"] },
  silver: { name: "Random silver charm", random: true, ids: ["sm-metal-wing", "sm-metal-horn", "sm-metal-moth", "sm-metal-bird"] },
  pressed: { name: "Pressed flower", ids: ["flower-red", "flower-orange", "flower-yellow", "flower-mint", "flower-teal", "flower-blue", "flower-purple", "flower-plum", "flower-magenta", "flower-pink", "flower-mauve", "flower-cream"], cols: ["#9C2F2F", "#B8683A", "#A8903A", "#5FA58E", "#2F8F8A", "#233F8F", "#6A3FA0", "#8A3A8A", "#A83A78", "#C07A8A", "#B07A9A", "#E8E0C8"] },
  paperflower: { name: "Paper flower", ids: ["pf-blue", "pf-pink", "pf-pink2", "pf-magenta", "pf-magenta2", "pf-purple", "pf-purple2"], cols: ["#5F86D8", "#F4A0BB", "#E8809C", "#C2308A", "#D43A9C", "#7B4BC4", "#A98AD0"] },
  paperrose: { name: "Paper rose", ids: ["pf-rose", "pf-rose2", "pf-rose3", "pf-whiterose", "pf-whiterose2", "pf-whiterose3"], cols: ["#C8283A", "#F08A78", "#D95870", "#F4F0EA", "#EFE6D4", "#F2E3C8"] },
  silkflower: { name: "Silk flower", ids: ["silk-yellow", "silk-lime"], cols: ["#E8C23A", "#A8D060"] },
  babysbreath: { name: "Baby's breath", ids: ["dried-blue", "dried-pink"], cols: ["#8FB0D8", "#E8A5B8"] },
  tree: { name: "Tree", ids: ["tree-green", "tree-pink", "tree-orange", "tree-yellow"], cols: ["#4C9A4A", "#E58FA6", "#E07A2E", "#E8C23A"] },
  rifle: { name: "Rifle", thumb: true, ids: ["charm-ak", "charm-ak-long", "charm-ak-mini", "charm-m4"] },
  dollar: { name: "Dollar sign", thumb: true, ids: ["charm-dollar", "charm-dollar-stones"] },
  moneybag: { name: "Money bag", thumb: true, ids: ["charm-moneybag", "charm-moneybag-mini"] },
};
window.familyOf = (id) => Object.keys(FAMILIES).find((k) => FAMILIES[k].ids.includes(id));
ui.fam = ui.fam || {};
const RANK = ["sea", "metalsea", "seaanimals", "small", "charms", "flowers", "dried", "paperflowers", "trees", "nature", "lights"];
    order.sort((x, y) => (RANK.indexOf(x) < 0 ? 99 : RANK.indexOf(x)) - (RANK.indexOf(y) < 0 ? 99 : RANK.indexOf(y)));
    const RECOMMENDED = ["sea"];
    const sections = order.map((k) => {
      const items = list.filter((a) => (a.group || "frog") === k);
      const n = items.filter((a) => design.addins[a.id]).length;
      const title = k === "frog" ? tr(items[0], "name") : U(k + "H");
      const note = k === "frog" ? "" : `<p class="small-note">${U(k + "P")}</p>`;
      const open = ui.open.has(k);
      return `<details class="ins-sec" data-key="${k}" ${open ? "open" : ""}>
        <summary><span class="ins-pics">${items.slice(0, 3).map((a) => `<i style="background:#F3EEE6 url(${a.img}) center/contain no-repeat"></i>`).join("")}</span><span class="ins-title">${title}</span>${RECOMMENDED.includes(k) ? `<span class="rec-tag">${U("recommended")}</span>` : ""}<span class="ins-count">${n ? U("nAdded", { n }) : `<b class="see-all">${U("seeAll")} ↓</b>`}</span></summary>
        <div class="ins-body">${note}${items.map(itemHtml).join("")}</div></details>`;
    });
    const lettersOpen = ui.open.has("letters"), photoOpen = ui.open.has("photo");
    return `
    <h2>${U("s5h")}</h2>
    <p class="hint">${U("dragPlace")} ${design.style === "ocean" ? "" : `<button type="button" class="btn btn-ink small" data-action="deco" data-id="">${U("decoChange")}</button>`}</p>
    ${design.deco === "charms" && design.style !== "ocean" ? `<details class="ins-sec" data-key="letters" ${lettersOpen ? "open" : ""}><summary><span class="ins-title">${U("sLtH")}</span><span class="ins-count">${L.text ? esc(L.text) : ""}</span></summary><div class="ins-body">${lettersBlock}</div></details>` : ""}
    ${sections.join("")}
    ${moldRank(design.shape) === 2 && design.style !== "ocean" ? `<details class="ins-sec" data-key="photo" ${photoOpen ? "open" : ""}><summary><span class="ins-title">${U("photoH")}</span><span class="ins-count">${design.photo.on ? U("added") : ""}</span></summary><div class="ins-body">${photoBlock}</div></details>` : ""}`;
  },

  // 9 Chain
  () => `
    <h2>${U("s7h")}</h2>
    <p class="hint">${U("s7p")}</p>
    ${field(U("metal"), `<div class="chips">${["gold", "silver"].map((v) =>
      `<button type="button" class="chip ${design.metal === v ? "on" : ""}" aria-pressed="${design.metal === v}" data-set="metal" data-value="${v}"><span class="dot" style="background:linear-gradient(135deg, ${METALS[v][0]}, ${METALS[v][1]})"></span>${lab("metal", v)}</button>`).join("")}</div>`)}
    ${field(U("type"), `<div class="cards">${["none", "ringchain"].map((v) => {
      return `<button type="button" class="card ${design.hardware === v ? "on" : ""}" aria-pressed="${design.hardware === v}" data-set="hardware" data-value="${v}">
        <span class="card-name">${lab("hardware", v)}</span><span class="card-text">${lab("hardwareTip", v)}</span></button>`;
    }).join("")}</div>`)}`,

  // 10 Tassel
  () => {
    const tt = design.tassel;
    return `
    <h2>${U("s8h")}</h2>
    <p class="hint">${U("s8p")}</p>
    ${field(U("realTassels"), `<div class="gl-grid">${CONFIG.tassels.map((x) =>
      `<button type="button" class="gl ${tt.photo === x.id && tt.type !== "none" ? "on" : ""}" aria-pressed="${tt.photo === x.id}" data-action="tassel" data-id="${x.id}"><span class="gl-img tas-img"><img src="images/tassels/${x.id}.png" alt=""></span><span class="gl-name">${x.name}</span></button>`).join("")}</div>`)}
    ${tt.type !== "none" ? `<button type="button" class="btn btn-line small" data-action="notassel">${U("noTassel")}</button>` : ""}`;
  },

  // 11 Review
  () => {
    const pr = priceOf(design);
    return `
    <h2>${catOf(design.shape) === "keychains" ? U("s9h") : U("yourDesign")}</h2>
    <p class="hint">${U("s9p")}</p>
    <div class="rev-thumbs">${reviewThumbs(design)}</div>
    <p>${U("designCode")}: <span class="code">${designCode(design)}</span></p>
    <ul class="summary">${summaryLines(design).map(([k, v]) => `<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join("")}</ul>
    ${qtyBlock()}
    ${SHOW_PRICES ? field(U("price"), `<ul class="prices">${pr.lines.map(([k, v]) => `<li><span>${esc(k)}</span><span>${money(v)}</span></li>`).join("")}
      <li class="sum"><span>${U("total")}</span><span>${money(pr.total)}</span></li></ul>`,
      U("readyIn", { time: tr(CONFIG, "readyTime") }) + " " + U("handmade")) : `<p class="small-note">${U("readyIn", { time: tr(CONFIG, "readyTime") })} ${U("handmade")}</p>`}
    ${field(U("note"), `<textarea data-set="note" placeholder="${esc(U("notePh"))}">${esc(design.note)}</textarea>`)}
    ${field(U("photo"), `<input type="file" accept="image/*" id="photo-input">${ui.photo ? `<img class="ref-photo" src="${ui.photo}" alt="">` : ""}`, U("photoNote"))}
    <div class="send-row">
      <a class="btn btn-ink wide" href="${igLink()}" target="_blank" rel="noopener" data-action="dm">${U("sendDM")}</a>
      <button type="button" class="btn btn-line wide" data-action="copylink">${U("copyLink")}</button>
    </div>
    <div class="send-row"><button type="button" class="btn btn-ink wide" data-action="addcart">${U("addCart")}</button><button type="button" class="btn btn-line wide" data-action="draft">${U("saveDraft")}</button></div>
    <div class="send-row"><button type="button" class="btn btn-line wide" data-action="savestyle">${U("saveStyleBtn")}</button><button type="button" class="btn btn-line wide" data-action="opensaves">${U("mySaves")}</button></div>
    <p class="small-note">${U("codeShare")}</p><div class="sv-code"><input type="text" readonly value="${esc(shareLink())}" aria-label="${U("designCode")}"><button type="button" class="btn btn-line small" data-action="copycode">${U("copyCode")}</button></div>
    ${field(U("message"), `<textarea class="order-text" readonly id="order-text" aria-label="${U("message")}">${esc(orderText())}</textarea>`, U("messageNote"))}
    <p class="small-note">${U("customOrders")}</p>`;
  },
];

/* =========================================================
   Big view tools (move / paint / zoom)
   ========================================================= */
function brushColor() {
  if (ui.brush.color) return ui.brush.color;
  return ui.brush.tool === "gold" ? "#D4AF37" : design.style === "clear" ? "#29B7A3" : design.colors[0];
}
function renderStudioTools() {
  const box = els.studioTools;
  if (!ui.full) { box.innerHTML = ""; return; }
  const B = (k) => t("big." + k);
  const seg = (action, val, cur, label) => `<button type="button" class="chip ${cur === val ? "on" : ""}" aria-pressed="${cur === val}" data-tool="${action}" data-value="${val}">${label}</button>`;
  const cols = [...new Set([...design.colors, "#FFFFFF", "#D4AF37", ...CONFIG.colors.map((c) => c.hex)].map((c) => c.toUpperCase()))];
  const bc = brushColor().toUpperCase();
  const gl = ui.step === GLITTER_STEP && design.style !== "ocean";
  const zoom = `<label class="zoom"><span>${B("zoom")}</span><input type="range" min="1" max="4" step="0.25" value="${ui.zoom}" data-tool="zoom" aria-label="${B("zoom")}"></label>`;
  if (!gl) { box.innerHTML = `<div class="tool-row">${zoom}</div>`; return; }
  const cur = ui.pour.id;
  box.innerHTML = `
    <div class="ft-title">${U("sGlH")}</div>
    <div class="ft-grid">${CONFIG.glitters.map((g) => `<button type="button" class="ft-g ${cur === g.id ? "on" : ""}" data-glitter="${g.id}" title="${esc(tr(g, "name"))}" aria-label="${esc(tr(g, "name"))}" aria-pressed="${cur === g.id}"><img src="images/glitter/${g.id}.png" alt=""></button>`).join("")}</div>
    <div class="ft-sizes">${["s", "m", "l"].map((v) => `<button type="button" class="chip brush ${ui.pour.size === v ? "on" : ""}" data-pour="size" data-value="${v}" title="${U("glSz")[v]}"><span class="brush-dot" style="width:${{ s: 6, m: 14, l: 26 }[v]}px;height:${{ s: 6, m: 14, l: 26 }[v]}px"></span></button>`).join("")}</div>
    <div class="ft-actions">
      <button type="button" class="btn btn-line small" data-action="glfill" ${cur ? "" : "disabled"}>${U("glFill")}</button>
      <button type="button" class="btn btn-line small" data-action="glundo" ${ui.pourHistory.length ? "" : "disabled"}>${U("glUndo")}</button>
      <button type="button" class="btn btn-line small" data-action="glclear" ${design.crush.length ? "" : "disabled"}>${U("glClear")}</button>
    </div>
    ${zoom}`;
}

/* =========================================================
   Rendering and events
   ========================================================= */
const $ = (id) => document.getElementById(id);
const els = {
  stage: $("stage"), preview: $("preview"), panel: $("panel"), steps: $("steps"), hint: $("stage-hint"),
  total: $("total"), back: $("back"), next: $("next"), toast: $("toast"),
  toastText: $("toast-text"), toastAction: $("toast-action"), studioTools: $("studio-tools"),
};

const GLITTER_STEP = 6;
const DETAILS_STEP = 5;
const inking = () => ui.step === DETAILS_STEP && design.style === "ink" && design.picked.length > 0 && !(false);
const pouring = () => !!ui.pour.id && ui.step === GLITTER_STEP && !(false);
function hasDraggables() {
  return activeAddins(design).some((a) => a.drag);
}
function renderHint() {
  let h = "";
  if (ui.side === "back") h = ui.full ? t("big.backHint") : "";
  else if (pouring()) h = U("glHint", { name: glitterName(ui.pour.id) });
  else if (inking()) h = U("inkHint");
  else if (ui.full) h = hasDraggables() ? t("big.moveHint") : "";
  else if (hasDraggables()) h = U("dragHint");
  els.hint.textContent = h;
}
let showTimer = 0;
function showcaseHtml() {
  const seen = new Set(), list = [];
  CONFIG.presets.forEach((p) => { if (!seen.has(p.photo)) { seen.add(p.photo); list.push([p.photo, p.name]); } });
  Object.values(CONFIG.references || {}).forEach((arr) => arr.forEach((r) => { if (r.img && !seen.has(r.img)) { seen.add(r.img); list.push([r.img, r.cap]); } }));
  list.push(list[0]);
  return `<div class="showcase"><div class="show-track">${list.map(([im, c]) => `<figure><img src="${im}" alt="" decoding="async"><figcaption>${esc(c)}</figcaption></figure>`).join("")}</div><p class="show-note">${U("showNote")}</p></div>`;
}
function startShowcase() {
  clearInterval(showTimer);
  const tr = els.preview.querySelector(".show-track"); if (!tr) return;
  const n = tr.children.length; let at = 0;
  tr.addEventListener("transitionend", () => { if (at >= n - 1) { tr.style.transition = "none"; at = 0; tr.style.transform = "translateX(0)"; void tr.offsetWidth; tr.style.transition = ""; } });
  showTimer = setInterval(() => { if (document.hidden) return; at += 1; tr.style.transform = `translateX(-${at * 100}%)`; }, 4200);
}
function startCatSlides() {
  clearInterval(startCatSlides.t);
  const sl = [...els.panel.querySelectorAll(".cat-slides .slides")];
  if (!sl.length) return;
  const st = sl.map((el, i) => ({ el, n: el.children.length, at: 0, wait: i }));
  st.forEach((s) => s.el.addEventListener("transitionend", () => { if (s.at >= s.n - 1) { s.el.style.transition = "none"; s.at = 0; s.el.style.transform = "translateX(0)"; void s.el.offsetWidth; s.el.style.transition = ""; } }));
  startCatSlides.t = setInterval(() => { if (document.hidden) return; st.forEach((s) => { if (s.n < 2) return; if (s.wait-- > 0) return; s.at += 1; s.el.style.transform = `translateX(-${s.at * 100}%)`; }); }, 3600);
}
const showingShowcase = () => (ui.step === 0 || (ui.step === 1 && !ui.chosen)) && !ui.full;
function renderPreview() {
  syncBoard(design);
  document.body.classList.toggle("noprev", showingShowcase());
  if (showingShowcase()) { els.preview.innerHTML = ""; els.stage.classList.add("showing"); return; }
  els.stage.classList.remove("showing");
  els.preview.innerHTML = renderPiece(design, ui.side, { interactive: true, edit: ui.step > 1 && ui.step !== LAST, zoom: ui.zoom, pan: ui.pan });
  els.preview.classList.toggle("painting", false && ui.side === "front");
  renderHint();
  if (typeof markSelected === "function") markSelected();
}
function renderTotal() {
  const box = els.total.parentNode;
  box.hidden = !SHOW_PRICES;
  if (SHOW_PRICES) els.total.textContent = money(priceOf(design).total);
}
function renderSteps() {
  const names = t("steps");
  const ord = stepOrder() || names.map((_, k) => k);
  els.steps.innerHTML = ord.map((i) => [names[i], i]).map(([name, i]) => ((!hasHardware(design.shape) && (i === LAST - 2 || i === LAST - 1)) || (i === INSIDE_STEP && noInside(design)) || skipStep(i, design)) ? "" :
    `<button type="button" class="step ${i === ui.step ? "current" : ""} ${ui.visited.has(i) && i !== ui.step ? "done" : ""}" data-step="${i}" ${i === ui.step ? 'aria-current="step"' : ""}>${name}</button>`
  ).join("");
  const cur = els.steps.querySelector(".current");
  if (cur) els.steps.scrollTo({ left: cur.offsetLeft - els.steps.clientWidth / 2 + cur.clientWidth / 2 });
}
function renderPanel() {
  syncBoard(design);
  els.panel.innerHTML = exampleBar() + secTag() + stylesBar() + STEP_VIEWS[ui.step]();
  startCatSlides();
  els.back.hidden = ui.step === 0;
  $("bigview").hidden = ui.step < 3;
  els.next.hidden = ui.step === LAST || ui.step === 0 || (ui.step === 1 && !(ui.chosen || (ui.cat && catOf(design.shape) === ui.cat)));
  const bc = $("bar-cart"), bb = $("bar-buy");
  if (bc) { bc.hidden = bb.hidden = ui.step !== LAST; bc.textContent = U("addCart"); bb.textContent = U("buyNow"); }
  els.next.textContent = ui.step === 0 ? U("startDesigning") : ui.step === LAST - 1 ? U("toReview") : U("next");
  els.back.textContent = U("back");
  renderBarSummary();
}
function renderBarSummary() {
  const box = document.getElementById("bar-summary");
  if (!box) return;
  const d = design;
  const tas = d.tassel.photo && d.tassel.type !== "none" ? (CONFIG.tassels.find((x) => x.id === d.tassel.photo) || {}).name : "";
  const dots = d.style !== "ocean" && d.picked && d.picked.length ? `<span class="bs-dots">${d.picked.map((c) => `<i style="background:${c}"></i>`).join("")}</span>` : "";
  box.innerHTML = `<span class="bs-item"><small>${U("bsShape")}</small><b>${esc(shapeName(d.shape))}</b></span>
    <span class="bs-item"><small>${U("bsStyle")}</small><b>${esc(lab("style", d.style))}</b></span>
    ${dots ? `<span class="bs-item"><small>${U("colours")}</small>${dots}</span>` : ""}
    ${tas ? `<span class="bs-item"><small>${U("tassel")}</small><b>${esc(tas)}</b></span>` : ""}`;
}
function renderStatic() {
  applyStaticText();
}
function render() {
  saveAuto();
  curFont = design.font || "block";
  renderStatic();
  renderPreview();
  renderTotal();
  renderSteps();
  renderPanel();
  renderStudioTools();
}
function swing() { /* no flicker: the piece no longer bounces when it changes */ }
// Each style keeps only its own settings, so nothing from the previous style stays on the piece.
function normaliseStyle(d) {
  if (d.ocean && d.ocean.sand === "none") d.ocean.sand = "low";
  if (d.ink) { d.ink.shimmer = "none"; d.ink.cells = false; d.ink.background = "clear"; }
  if (d.style === "ink") { d.ink.cells = false; d.ink.background = "clear"; }
  if (d.style === "ocean") { d.picked = []; d.colors = DEFAULT_COLORS.slice(); d.inkDrops = []; d.crush = []; d.letters.text = ""; d.gradient = { direction: "down", glitter: "none" }; }
  else if (d.style === "clear") { d.picked = []; d.colors = DEFAULT_COLORS.slice(); d.inkDrops = []; }
  else if (d.style === "gradient") { d.inkDrops = []; }
}
function changed() {
  normaliseStyle(design);
  const keepY = window.scrollY;
  setTimeout(() => { if (Math.abs(window.scrollY - keepY) > 2) window.scrollTo(0, keepY); }, 0);
  applyPicked(design);
  setTimeout(renderBarSummary, 0);
  design.paint = [];
  for (const id of Object.keys(design.addins)) { const ad = CONFIG.addins.find((x) => x.id === id); if (!ad || !fits(ad, design)) delete design.addins[id]; }
  if (noInside(design) || design.style === "ocean") design.letters.text = "";
  if (design.style === "ocean") design.crush = [];
  render();
  swing();
}
const LETTER_STEP = 2;
function go(step) {
  if (step === 1 && !ui.cat && !(new URLSearchParams(location.search)).has("start") && design.shape) ui.cat = ui.cat || catOf(design.shape);
  const dir = step >= ui.step ? 1 : -1;
  step = Math.max(0, Math.min(LAST, step));
  if (step === LETTER_STEP && !isLetter(design.shape) && !isNumber(design.shape)) step += dir;
  if (step === INSIDE_STEP && noInside(design)) step += dir;
  while (skipStep(step, design) && step > 0 && step < LAST) step += dir;
  if (design.style === "clear" && (step === 6 || step === 7) && !ui.visited) step = step;
  if (!hasHardware(design.shape) && (step === LAST - 2 || step === LAST - 1)) step = dir > 0 ? LAST : LAST - 3;
  ui.step = Math.max(0, Math.min(LAST, step));
  if (ui.step > 1) ui.chosen = true;
  ui.visited.add(ui.step);
  render();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = document.querySelector(".studio").getBoundingClientRect().top + window.scrollY - (window.innerWidth < 900 ? els.stage.offsetHeight : 0) - 8;
  window.scrollTo({ top: Math.max(0, Math.min(window.scrollY, top)), behavior: reduce ? "auto" : "smooth" });
}

let toastTimer;
function toast(msg, actionLabel, action) {
  els.toastText.textContent = msg;
  els.toastAction.hidden = !actionLabel;
  els.toastAction.textContent = actionLabel || "";
  els.toastAction.onclick = action ? () => { action(); els.toast.classList.remove("show"); } : null;
  els.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), actionLabel ? 5000 : 2600);
}

/* ---------- Surprise me & Start over ---------- */
function surprise() {
  const before = copy(design);
  const cols = CONFIG.colors.map((c) => c.hex);
  const d = defaultDesign();
  d.shape = design.shape; d.second = design.second; d.note = design.note;
  d.style = pick(["clear", "gradient", "gradient", "ink", "ink", "ocean"]);
  d.picked = Math.random() < 0.7 ? copy(pick(CONFIG.palettes).colors) : [pick(cols), pick(cols), pick(cols)];
  d.colors = d.picked.slice();
  d.gradient = { direction: pick(["down", "right", "diagonal", "center"]), glitter: "none" };
  d.ink = { amount: pick(["light", "medium", "bold"]), background: pick(["clear", "white", "cloudy"]),
    spread: pick(["all", "all", "top", "bottom", "left", "right"]), cells: Math.random() < 0.6, shimmer: "none" };
  d.ocean = { sand: pick(["low", "middle", "middle", "high"]), wave: pick(["top", "middle", "bottom", "diagonal"]),
    foam: pick(["soft", "frothy"]), sandColor: pick(["natural", "natural", "white", "golden", "pink"]) };
  const natural = ["frog", "sea-starfish", "sea-shell-mix1", "sea-shell-mix2", "sea-shell-mix3", "sea-shell-mix4", "sea-shell-scallop", "sea-shell-cone"];
  let pool = CONFIG.addins.filter((a) => a.group !== "charms" && !blockedReason(a.id, d)).sort(() => Math.random() - 0.5);
  
  pool.slice(0, 1 + Math.floor(Math.random() * 3)).forEach((a) => {
    d.addins[a.id] = { amount: a.img ? "few" : pick(["few", "some", "lots"]), place: "anna", color: natural.includes(a.id) ? a.color : pick(cols) };
  });
  d.metal = pick(["gold", "silver", "rose", "black"]);
  d.hardware = pick(["ring", "ringchain", "ringchain", "lobster", "swivel", "carabiner"]);
  d.tassel = { type: pick(["silk", "silk", "cotton", "none"]), ombre: Math.random() < 0.6, color1: pick(cols), color2: pick(cols), cord: pick(["gold", "silver", "match", "twist"]) };
  d.crush = [];
  for (let k = 0; k < 1 + Math.floor(Math.random() * 2); k++) fillGlass(d, pick(CONFIG.glitters).id, 0.35 + Math.random() * 0.4);
  design = d;
  ui.pourHistory = [];
  ui.side = "front";
  if (ui.step < 3) { ui.step = 3; ui.visited.add(3); }
  changed();
  toast(U("surprised"), U("undo"), () => { design = before; changed(); });
}

function startOver() {
  ui.chosen = false;
  const before = copy(design);
  const step = ui.step;
  design = defaultDesign();
  ui.side = "front";
  ui.visited = new Set([0]);
  go(0);
  toast(U("startedOver"), U("undo"), () => { design = before; go(step); });
}

/* ---------- Panel events ---------- */
function addDesignToCart() {
  const d2 = copy(design); if (d2.crush.length > 500) d2.crush = d2.crush.slice(-500);
  const sub = summaryLines(design, "en").slice(0, 3).map(([k, v]) => v).join(" · ");
  const ok = addToCart({ title: shapeName(design.shape, "en") + ((design.qty || 1) > 1 && CUP_SHAPES.includes(design.shape) ? " ×" + design.qty : "") + " – " + lab("style", design.style, "en"), sub, thumb: renderPiece(d2).replace(/<svg /, '<svg class="cart-svg" '), text: orderText().split("\n").slice(1).join("\n") });
  toast(ok ? U("addedCart") : U("cartFail"));
}
$("bar-cart").addEventListener("click", addDesignToCart);
$("bar-buy").addEventListener("click", () => { copyText(orderText()).catch(() => {}); window.open(igLink(), "_blank", "noopener"); });
els.panel.addEventListener("click", (e) => {
  const gl = e.target.closest("[data-glitter]");
  if (gl) {
    ui.pour.id = ui.pour.id === gl.dataset.glitter ? "" : gl.dataset.glitter;
    renderPanel(); renderHint();
    return;
  }
  const pr = e.target.closest("[data-pour]");
  if (pr) { ui.pour[pr.dataset.pour] = pr.dataset.value; renderPanel(); return; }
  const el = e.target.closest("[data-set], [data-action]");
  if (!el || el.disabled) return;

  if (el.dataset.set && el.tagName === "BUTTON") {
    const path = el.dataset.set;
    setPath(design, path, parseVal(el.dataset.value));
    if (path === "tassel.type") design.tassel.photo = "";
    if (path === "font") { if (design.font === "groovy" && isNumber(design.shape)) design.shape = "A"; resetItems(design); changed(); return; }
    if (path === "shape") {
      resetItems(design);
      if (!design.letters.moved) [design.letters.x, design.letters.y] = bestTextSpot(design.shape);
    }
    if (path === "style" && ui.step === 3) { changed(); setTimeout(() => go(neighbour(1)), 280); return; }
    const m = path.match(/^addins\.(\w+)\.(amount|place)$/);
    if (m) { delete design.addins[m[1]].items; delete design.addins[m[1]].moved; }
    changed();
    return;
  }

  const action = el.dataset.action;
  if (action === "preset") {
    const p = CONFIG.presets.find((x) => x.id === el.dataset.id);
    design = presetDesign(p);
    ui.side = "front";
    go(el.dataset.go === "review" ? LAST : 1);
    swing();
  } else if (action === "gallery") {
    const gd = galleryDesign(el.dataset.id);
    if (gd) { design = gd.d; ui.cat = gd.cat; ui.side = "front"; ui.visited = new Set([0, 1, 2, 3]); ui.chosen = true; go(el.dataset.go === "review" ? LAST : afterStyle(design)); swing(); }
  } else if (action === "tassel") {
    design.tassel.photo = design.tassel.photo === el.dataset.id ? "" : el.dataset.id;
    if (design.tassel.photo && design.tassel.type === "none") design.tassel.type = "silk";
    if (design.tassel.photo && design.hardware === "none") design.hardware = "ringchain";
    changed();
  } else if (action === "addcart") {
    addDesignToCart();
  } else if (action === "exorder") {
    ui.example = false; go(LAST);
  } else if (action === "exedit") {
    ui.example = false; renderPanel();
  } else if (action === "savestyle") {
    saveStyle();
  } else if (action === "opensaves") {
    openSaves();
  } else if (action === "copycode") {
    copyText(shareLink()).then(() => toast(U("linkCopied"))).catch(() => toast(U("linkFail")));
  } else if (action === "draft") {
    saveDraft();
  } else if (action === "inkcol") {
    ui.inkCol = Number(el.dataset.i); renderPanel();
  } else if (action === "inkundo") {
    design.inkDrops.pop(); renderPanel(); renderPreview();
  } else if (action === "inkclear") {
    design.inkDrops = []; renderPanel(); renderPreview();
  } else if (action === "variant") {
    const fk = el.dataset.fam, F = FAMILIES[fk], to = el.dataset.id;
    const have = F.ids.find((id) => design.addins[id]);
    ui.fam[fk] = to;
    if (have && have !== to) { design.addins[to] = Object.assign({}, design.addins[have]); delete design.addins[have]; }
    changed();
  } else if (action === "loaddraft") {
    openSaves();
  } else if (action === "deco") {
    design.deco = el.dataset.id;
    for (const id of Object.keys(design.addins)) { const ad = CONFIG.addins.find((x) => x.id === id); if (!ad || !fits(ad, design)) delete design.addins[id]; }
    renderPanel(); renderPreview(); renderTotal();
  } else if (action === "notassel") {
    design.tassel.photo = ""; design.tassel.type = "none"; changed();
  } else if (action === "photooff") {
    design.photo.on = false; ui.photo = ""; changed();
  } else if (action === "ltshuffle") {
    design.letters.seed = Math.floor(Math.random() * 9999);
    changed();
  } else if (action === "glfill") {
    const n = fillGlass(design, ui.pour.id);
    ui.pourHistory.push(n);
    changed();
  } else if (action === "glundo") {
    const n = ui.pourHistory.pop() || 0;
    design.crush.splice(Math.max(0, design.crush.length - n), n);
    changed();
  } else if (action === "glclear") {
    design.crush = [];
    ui.pourHistory = [];
    changed();
  } else if (action === "cat") {
    ui.cat = el.dataset.id; ui.chosen = catOf(design.shape) === ui.cat && ui.cat !== "cutting" && ui.cat !== "paint" ? ui.chosen : false;
    const from0 = ui.step === 0; if (from0) ui.pickReady = false;
    if ((ui.cat === "cutting" || ui.cat === "paint") && catOf(design.shape) !== ui.cat) {
      design.shape = ui.cat === "paint" ? "canvas-rect" : "board-rect"; applyDefaults(design); design.style = ui.cat === "paint" ? "gradient" : "clear"; design.addins = {}; design.crush = []; resetItems(design); ui.chosen = true; ui.zoom = 1; ui.pan = [0, 0];
      if (from0) go(1); else changed();
    } else if (from0) go(1); else renderPanel();
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  } else if (action === "mold") {
    ui.chosen = true;
    design.shape = el.dataset.shape;
    if (el.dataset.extra) Object.assign(design, JSON.parse(el.dataset.extra));
    applyDefaults(design);
    if (customShape(design.shape) && customShape(design.shape).wood) design.style = "clear";
    if (isGame(design.shape)) design.style = "gradient";
    if (design.shape === "frame-oval") { design.style = "gradient"; design.deco = "charms"; }
    if (design.shape === "canvas-rect" && design.style === "clear") design.style = "gradient";
    if (isCup(design.shape)) { if (design.style === "clear") design.style = "gradient"; design.deco = "natural"; design.addins = {}; }
    design.letters.moved = false;
    [design.letters.x, design.letters.y] = bestTextSpot(design.shape);
    resetItems(design);
    ui.zoom = 1; ui.pan = [0, 0];
    changed();
  } else if (action === "helper") {
    ui.helper = true; ui.pickReady = false; renderPanel(); window.scrollTo({ top: 0 }); return;
  } else if (action === "helpermic") {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const note = $("mic-note");
    if (!SR) { if (note) ui.micMsg = note.innerHTML = U("micNo") + (window.self !== window.top ? ` <a href="${location.href}" target="_blank" rel="noopener"><b>${({ th: "เปิดในแท็บใหม่", ru: "Открыть в отдельной вкладке" }[ui.lang]) || "Open in its own tab"}</b></a>` : ""); return; }
    if (ui.rec) { ui.rec.stop(); return; }
    const box = $("helper-text"), base = box.value ? box.value.trim() + " " : "";
    const rec = new SR(); ui.rec = rec;
    rec.lang = { th: "th-TH", ru: "ru-RU" }[ui.lang] || "en-US"; rec.interimResults = true; rec.continuous = true;
    rec.onresult = (ev) => { let txt = ""; for (let i = 0; i < ev.results.length; i++) txt += ev.results[i][0].transcript; ui.helperText = base + txt; const bx = $("helper-text"); if (bx) bx.value = ui.helperText; };
    rec.onerror = (ev) => { const n = { set innerHTML(h) { ui.micMsg = h; const x = $("mic-note"); if (x) x.innerHTML = h; }, set textContent(t) { ui.micMsg = esc(t); const x = $("mic-note"); if (x) x.innerHTML = esc(t); } }; const T = (en, th, ru) => ({ th, ru }[ui.lang] || en), e = ev.error, framed = window.self !== window.top;
      const open = framed ? ` <a href="${location.href}" target="_blank" rel="noopener"><b>${T("Open in its own tab", "เปิดในแท็บใหม่", "Открыть в отдельной вкладке")}</b></a>` : "";
      if (e === "not-allowed" || e === "service-not-allowed") n.innerHTML = (framed ? T("The microphone is blocked inside this preview.", "ไมโครโฟนถูกบล็อกในหน้าตัวอย่างนี้", "Микрофон заблокирован в этом предпросмотре.") : U("micDenied")) + open;
      else if (e === "no-speech") n.textContent = T("I did not hear anything. Tap again and speak.", "ไม่ได้ยินเสียง ลองแตะอีกครั้งแล้วพูด", "Ничего не слышно. Нажми ещё раз и говори.");
      else if (e === "audio-capture") n.textContent = T("No microphone found on this device.", "ไม่พบไมโครโฟน", "Микрофон не найден.");
      else if (e !== "aborted") n.innerHTML = U("micNo") + " (" + esc(e || "?") + ")" + open; };
    rec.onend = () => { ui.rec = null; ui.listening = false; const keep = ($("helper-text") || {}).value; ui.helperText = keep || ui.helperText; if (ui.helper) { const y = window.scrollY; renderPanel(); window.scrollTo(0, y); } };
    ui.micMsg = ""; ui.listening = true; try { rec.start(); } catch (err) { ui.listening = false; ui.rec = null; ui.micMsg = esc(String(err.message || err)); }
    renderPanel(); const b2 = $("helper-text"); if (b2) b2.value = base;
    return;
  } else if (action === "helpergo") {
    if (ui.rec) ui.rec.stop();
    const txt = ($("helper-text") || {}).value || ""; ui.helperText = txt;
    if (!txt.trim()) { toast(U("helperEmpty")); return; }
    ui.helperSpec = helperParse(txt); const picks = helperPicks(ui.helperSpec); const sp0 = ui.helperSpec, plan = helperPlan(sp0);
    // 3 of Anna's pieces recoloured to the request, plus 2 new pieces made for it
    const thin = (sh) => (CONFIG.shapes.find((x) => x.id === sh) || {}).size === "thin";
    const made = [plan[0], plan.find((o) => o.shape !== plan[0].shape && !isGame(o.shape)) || plan[1]].map((o, n) => ({ k: "", d: helperBuild(sp0, Object.assign({}, o, { style: thin(o.shape) ? "gradient" : "ink", i: n * 2 })), cat: catOf(o.shape) }));
    const mixed = [made[0], picks[0], picks[1], made[1], picks[2]];
    picks.length = 0; mixed.forEach((m) => picks.push(m));
    ui.helperKeys = picks.map((p) => p.k); ui.helperOpts = picks.map((p) => (p.k ? helperCharmUp(sp0, helperRecolor(sp0, p.d)) : p.d)); ui.helperTitles = picks.map((p) => helperTitle2(p));
    renderPanel(); return;
  } else if (action === "helperpick") {
    const d = ui.helperOpts[Number(el.dataset.i)]; if (!d) return;
    design = copy(d); ui.helper = false; ui.cat = catOf(design.shape); ui.chosen = true; ui.visited = new Set([0, 1, 2, 3]);
    go(el.dataset.go === "review" ? LAST : afterStyle(design)); swing(); return;
  } else if (action === "pickready") {
    ui.pickReady = true; renderPanel(); window.scrollTo({ top: 0 }); return;
  } else if (action === "choiceback") {
    ui.pickReady = false; ui.helper = false; renderPanel(); window.scrollTo({ top: 0 }); return;
  } else if (action === "designown") {
    const g = document.querySelector(".cards.cats"); if (g) g.scrollIntoView({ behavior: "smooth", block: "start" }); return;
  } else if (action === "scratch") {
    ui.pickReady = false;
    design = defaultDesign();
    go(1);
  } else if (action === "goto") {
    go(Number(el.dataset.step));
  } else if (action === "palette") {
    design.picked = copy(CONFIG.palettes[Number(el.dataset.i)].colors);
    changed();
  } else if (action === "slot") {
    design.picked.splice(Number(el.dataset.i), 1);
    changed();
  } else if (action === "swatch") {
    const at = design.picked.indexOf(el.dataset.hex);
    if (at >= 0) design.picked.splice(at, 1);
    else if (design.picked.length < 3) design.picked.push(el.dataset.hex);
    else { toast(U("maxColours")); return; }
    changed();
  } else if (action === "addin") {
    let a = CONFIG.addins.find((x) => x.id === el.dataset.id);
    { const fk0 = familyOf(a.id); if (fk0 && FAMILIES[fk0].random && !FAMILIES[fk0].ids.some((id) => design.addins[id])) { const F0 = FAMILIES[fk0]; a = CONFIG.addins.find((x) => x.id === F0.ids[Math.floor(Math.random() * F0.ids.length)]); } else if (fk0 && FAMILIES[fk0].random) { a = CONFIG.addins.find((x) => x.id === FAMILIES[fk0].ids.find((id) => design.addins[id])); } }
    if (design.addins[a.id]) delete design.addins[a.id];
    else if (POKE_GROUPS.includes(a.group) && moldRank(design.shape) === 0 && Object.keys(design.addins).filter((k) => { const x = CONFIG.addins.find((y) => y.id === k); return x && POKE_GROUPS.includes(x.group); }).length >= 3) { toast(U("maxCharms")); return; }
    else {
      const [T, B] = bounds(design.shape), n = Object.keys(design.addins).length;
      const taken = Object.keys(design.addins).flatMap((k) => (design.addins[k].items || []).map(([x, y]) => [x, y, itemRadius(k)]));
      const p = LAYOUT[n % LAYOUT.length];
      const spot = placeNear(design, a.id, 40 + p[0] * 220, T + p[1] * (B - T), taken) || placeNear(design, a.id, 150, (T + B) / 2, taken);
      if (!spot) { toast(U("noRoom")); return; }
      design.addins[a.id] = { amount: "few", place: "anna", color: a.color, items: [[spot[0], spot[1], 0]], moved: true };
    }
    changed();
  } else if (action === "shuffle") {
    const a = CONFIG.addins.find((x) => x.id === el.dataset.id);
    const sel = design.addins[a.id];
    sel.items = genItems(a, sel, design, Math.random);
    delete sel.moved;
    renderPreview();
    swing();
  } else if (action === "onemore") {
    const sel = design.addins[el.dataset.id];
    const [x, y] = randomSpot(design, sel.place, Math.random);
    sel.items.push([x, y, Math.round(Math.random() * 40 - 20)]);
    renderPreview();
    swing();
  } else if (action === "dm") {
    copyText(orderText())
      .then(() => toast(U("copied")))
      .catch(() => toast(U("copyFail")));
  } else if (action === "copylink") {
    copyText(shareLink())
      .then(() => toast(U("linkCopied")))
      .catch(() => toast(U("linkFail")));
  }
});

els.panel.addEventListener("input", (e) => {
  const el = e.target;
  if (!el.dataset.set) return;
  let v = el.value;
  if (el.dataset.upper) {
    v = v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 1);
    el.value = v;
  }
  if (el.dataset.ltr) {
    v = v.toUpperCase().replace(/[^A-Z0-9 &]/g, "").slice(0, 4);
    if (v !== el.value) el.value = v;
    if (!design.letters.moved) [design.letters.x, design.letters.y] = bestTextSpot(design.shape);
  }
  if (el.dataset.num) v = Number(v);
  setPath(design, el.dataset.set, v);
  renderPreview();
  renderTotal();
  const box = $("order-text");
  if (box) box.value = orderText();
});
els.panel.addEventListener("toggle", (e) => {
  const d = e.target;
  if (!d.classList || !(d.classList.contains("ins-sec") || d.classList.contains("inspo"))) return;
  if (d.open) ui.open.add(d.dataset.key); else ui.open.delete(d.dataset.key);
  if (d.dataset.key === "inspo" && d.open && !d.querySelector(".looks")) { const y = window.scrollY; renderPanel(); window.scrollTo(0, y); }
}, true);
els.panel.addEventListener("change", (e) => {
  if (e.target.type === "color") renderPanel();
  if (e.target.id === "piece-photo" && e.target.files[0]) {
    const url = URL.createObjectURL(e.target.files[0]);
    const im = new Image();
    im.onload = () => { if (ui.photo) URL.revokeObjectURL(ui.photo); ui.photo = url; ui.photoDims = [im.naturalWidth, im.naturalHeight]; design.photo = { on: true, x: 0, y: 0, zoom: 1 }; changed(); };
    im.src = url;
    return;
  }
  if ((e.target.id === "photo-input" || e.target.id === "shape-photo") && e.target.files[0]) {
    if (ui.photo) URL.revokeObjectURL(ui.photo);
    ui.photo = URL.createObjectURL(e.target.files[0]);
    renderPanel();
  }
});

/* ---------- Drag items & paint on the preview ---------- */
let gesture = null;

function svgPoint(e) {
  const svg = els.preview.querySelector("svg");
  const pt = svg.createSVGPoint();
  pt.x = e.clientX; pt.y = e.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

els.preview.addEventListener("pointerdown", (e) => {
  if (ui.side !== "front") return;
  const p = svgPoint(e);
  if (inking()) {
    if (!insideShape(design.shape, p.x, p.y)) return;
    e.preventDefault();
    addInk(p.x, p.y);
    renderPanel();
    return;
  }
  if (pouring()) {
    if (!nearShape(design.shape, p.x, p.y)) return;
    e.preventDefault();
    gesture = { type: "pour", lx: p.x, ly: p.y, n: 0, g: els.preview.querySelector("g.crush") };
    gesture.n += addStamp(gesture, p.x, p.y);
    els.preview.setPointerCapture(e.pointerId);
    return;
  }
  if (false) {
    if (!insideShape(design.shape, p.x, p.y)) return;
    e.preventDefault();
    const live = els.preview.querySelector(".live");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", brushColor());
    path.setAttribute("stroke-width", BRUSH[ui.brush.size]);
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("opacity", ui.brush.tool === "ink" ? "0.85" : "0.6");
    if (ui.brush.tool !== "ink") path.setAttribute("stroke-dasharray", "1 6");
    live.appendChild(path);
    gesture = { type: "paint", pts: [Math.round(p.x), Math.round(p.y)], path };
    path.setAttribute("d", strokePath(gesture.pts));
    els.preview.setPointerCapture(e.pointerId);
    return;
  }
  const ltr = e.target.closest(".ltr");
  if (ltr && design.letters.text) {
    e.preventDefault();
    gesture = { type: "ltr", el: ltr, sx: p.x, sy: p.y, ox: design.letters.x, oy: design.letters.y };
    els.preview.setPointerCapture(e.pointerId);
    return;
  }
  const item = e.target.closest(".item");
  if (!item) {
    if (ui.zoom <= 1 && Object.values(design.addins).some((s) => s.items && s.items.length)) { e.preventDefault(); marqueeStart(e); return; }
    if (ui.zoom > 1) {
      e.preventDefault();
      gesture = { type: "pan", sx: e.clientX, sy: e.clientY, ox: ui.pan[0], oy: ui.pan[1] };
      els.preview.setPointerCapture(e.pointerId);
    }
    return;
  }
  e.preventDefault();
  const id = item.dataset.id, i = Number(item.dataset.i);
  const it = design.addins[id].items[i];
  if (e.shiftKey) { if (!ui.sels.some((q) => q.id === id && q.i === i)) ui.sels.push({ id, i }); } else if (!ui.sels.some((q) => q.id === id && q.i === i)) ui.sels = [{ id, i }];
  markSelected();
  gesture = { type: "drag", id, i, el: item, sx: p.x, sy: p.y, ox: it[0], oy: it[1] };
  item.classList.add("dragging");
  els.preview.setPointerCapture(e.pointerId);
});

els.preview.addEventListener("pointermove", (e) => {
  if (!gesture) return;
  const p = svgPoint(e);
  if (gesture.type === "ltr") {
    const p = svgPoint(e), L = design.letters;
    L.x = Math.round(Math.max(20, Math.min(280, gesture.ox + p.x - gesture.sx)));
    L.y = Math.round(Math.max(120, Math.min(420, gesture.oy + p.y - gesture.sy)));
    gesture.el.setAttribute("transform", `translate(${L.x} ${L.y}) rotate(${L.layout === "scatter" ? 0 : L.rot})`);
    if (L.layout === "scatter") renderPreview();
    return;
  }
  if (gesture.type === "ink") {
    const p = svgPoint(e);
    if (Math.hypot(p.x - gesture.lx, p.y - gesture.ly) < 14) return;
    gesture.lx = p.x; gesture.ly = p.y;
    if (insideShape(design.shape, p.x, p.y)) addInk(p.x, p.y);
    return;
  }
  if (gesture.type === "pour") {
    const p = svgPoint(e);
    if (Math.hypot(p.x - gesture.lx, p.y - gesture.ly) < Math.max(4, GLASS_RADIUS[ui.pour.size] * 0.7)) return;
    gesture.lx = p.x; gesture.ly = p.y;
    if (nearShape(design.shape, p.x, p.y)) gesture.n += addStamp(gesture, p.x, p.y);
    return;
  }
  if (gesture.type === "marquee") { marqueeMove(e); return; }
  if (gesture.type === "pan") {
    const svg = els.preview.querySelector("svg");
    const k = (300 / ui.zoom) / svg.getBoundingClientRect().width;
    ui.pan = [gesture.ox - (e.clientX - gesture.sx) * k, gesture.oy - (e.clientY - gesture.sy) * k];
    svg.setAttribute("viewBox", zoomBox(ui.zoom, ui.pan));
    return;
  }
  if (gesture.type === "drag") {
    const it = design.addins[gesture.id].items[gesture.i];
    it[0] = Math.round(Math.max(0, Math.min(300, gesture.ox + p.x - gesture.sx)));
    it[1] = Math.round(Math.max(100, Math.min(440, gesture.oy + p.y - gesture.sy)));
    gesture.el.setAttribute("transform", `translate(${it[0]} ${it[1]}) rotate(${it[2]})`);
    gesture.el.classList.toggle("leaving", !insideShape(design.shape, it[0], it[1]));
  } else {
    const pts = gesture.pts;
    const lx = pts[pts.length - 2], ly = pts[pts.length - 1];
    if (Math.hypot(p.x - lx, p.y - ly) < 3) return;
    pts.push(Math.round(p.x), Math.round(p.y));
    gesture.path.setAttribute("d", strokePath(pts));
  }
});

let inkRaf = 0;
function addInk(x, y) {
  design.inkDrops.push([Math.min(ui.inkCol, design.picked.length - 1), Math.round(x), Math.round(y), { s: 12, m: 20, l: 32 }[design.inkSize]]);
  if (design.inkDrops.length > 160) design.inkDrops.shift();
  cancelAnimationFrame(inkRaf); inkRaf = requestAnimationFrame(renderPreview);
}
function endGesture() {
  if (!gesture) return;
  const g = gesture;
  gesture = null;
  if (g.type === "marquee") { g.box.remove(); return; }
  if (g.type === "pan") return;
  if (g.type === "ltr") { design.letters.moved = true; const box = $("order-text"); if (box) box.value = orderText(); return; }
  if (g.type === "ink") { renderPanel(); const box = $("order-text"); if (box) box.value = orderText(); return; }
  if (g.type === "pour") {
    ui.pourHistory.push(g.n);
    renderPanel();
    renderStudioTools();
    const box = $("order-text");
    if (box) box.value = orderText();
    return;
  }
  if (g.type === "drag") {
    const sel = design.addins[g.id];
    const it = sel.items[g.i];
    if (!itemFits(design.shape, it[0], it[1], g.id)) {
      sel.items.splice(g.i, 1);
      if (!sel.items.length) delete design.addins[g.id];
      toast(U("removed"));
      render();
    } else {
      sel.moved = true;
      g.el.classList.remove("dragging");
      renderTotal();
    }
  } else {
    if (design.paint.length >= 40) design.paint.shift();
    design.paint.push({ tool: ui.brush.tool, color: brushColor(), size: ui.brush.size, pts: g.pts });
    renderPreview();
    renderTotal();
    renderStudioTools();
  }
  const box = $("order-text");
  if (box) box.value = orderText();
}
els.preview.addEventListener("pointerup", endGesture);
els.preview.addEventListener("pointercancel", endGesture);

// draw new chips straight into the picture while the finger moves
function addStamp(g, x, y) {
  const before = design.crush.length;
  const add = stamp(design, ui.pour.id, Math.round(x), Math.round(y));
  if (g.g) g.g.insertAdjacentHTML("beforeend", add.map(glassSprite).join(""));
  const over = before + add.length - design.crush.length;   // oldest chips that were dropped
  for (let i = 0; i < over && g.g && g.g.firstChild; i++) g.g.removeChild(g.g.firstChild);
  return add.length;
}

/* ---------- Zoom (buttons, slider, ctrl+wheel) ---------- */
function setZoom(z) {
  ui.zoom = Math.max(1, Math.min(4, Math.round(z * 4) / 4));
  if (ui.zoom === 1) ui.pan = [0, 0];
  renderPreview();
  renderStudioTools();
}
$("zoomin").addEventListener("click", () => setZoom(ui.zoom + 0.5));
$("zoomout").addEventListener("click", () => setZoom(ui.zoom - 0.5));
els.preview.addEventListener("wheel", (e) => {
  if (!e.ctrlKey && !e.metaKey && !ui.full) return;
  e.preventDefault();
  setZoom(ui.zoom + (e.deltaY < 0 ? 0.25 : -0.25));
}, { passive: false });

/* ---------- Drag an item from the list onto the keychain (like Canva) ---------- */
let tray = null, suppressClick = false;
els.panel.addEventListener("pointerdown", (e) => {
  const h = e.target.closest("[data-drag], [data-gdrag]");
  if (!h || e.button > 0) return;
  tray = { id: h.dataset.drag || h.dataset.gdrag, glass: !!h.dataset.gdrag, x: e.clientX, y: e.clientY, ghost: null, pid: e.pointerId };
  h.setPointerCapture(e.pointerId);
});
els.panel.addEventListener("pointermove", (e) => {
  if (!tray) return;
  if (!tray.ghost) {
    if (Math.hypot(e.clientX - tray.x, e.clientY - tray.y) < 6) return;
    const a = tray.glass ? null : CONFIG.addins.find((x) => x.id === tray.id);
    tray.ghost = document.createElement("div");
    tray.ghost.className = "drag-ghost";
    if (tray.glass) tray.ghost.style.background = `url(images/glitter/${tray.id}.png) center/cover, #3E8E99`;
    else tray.ghost.style.background = a.color;
    document.body.appendChild(tray.ghost);
    els.preview.classList.add("drop-target");
  }
  tray.ghost.style.left = e.clientX + "px";
  tray.ghost.style.top = e.clientY + "px";
});
function endTray(e, cancel) {
  if (!tray) return;
  const t0 = tray;
  tray = null;
  if (!t0.ghost) return;
  t0.ghost.remove();
  els.preview.classList.remove("drop-target");
  suppressClick = true;
  setTimeout(() => (suppressClick = false), 0);
  if (cancel) return;
  const svg = els.preview.querySelector("svg");
  const r = svg.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
  const p = svgPoint(e);
  if (!nearShape(design.shape, p.x, p.y)) { toast(U("dropInside")); return; }
  if (t0.glass) {
    const n = stamp(design, t0.id, Math.round(p.x), Math.round(p.y), "l", ui.pour.size).length;
    ui.pourHistory.push(n);
    changed();
    return;
  }
  if (!itemFits(design.shape, p.x, p.y, t0.id)) { toast(U("dropInside")); return; }
  dropAddin(t0.id, Math.round(p.x), Math.round(p.y));
}
els.panel.addEventListener("pointerup", (e) => endTray(e, false));
els.panel.addEventListener("pointercancel", (e) => endTray(e, true));
els.panel.addEventListener("click", (e) => { if (suppressClick) { e.stopPropagation(); e.preventDefault(); } }, true);

function dropAddin(id, x, y) {
  const a = CONFIG.addins.find((v) => v.id === id);
  if (blockedReason(id, design)) { toast(blockedReason(id, design)); return; }
  const [T, B] = bounds(design.shape);
  const place = y < T + (B - T) * 0.38 ? "top" : y > T + (B - T) * 0.62 ? "bottom" : "middle";
  if (!design.addins[id]) design.addins[id] = { amount: "few", place, color: a.color };
  const sel = design.addins[id];
  if (a.drag) {
    if (!Array.isArray(sel.items)) sel.items = [];
    if (a.single) sel.items = [];
    sel.items.push([x, y, a.id === "frog" ? 0 : Math.round(Math.random() * 40 - 20)]);
    sel.moved = true;
  } else {
    sel.place = place;
  }
  changed();
}

/* ---------- Big view ---------- */
function setFull(on) {
  ui.full = on;
  els.stage.classList.toggle("full", on);
  document.body.classList.toggle("locked", on);
  renderPreview();
  renderStudioTools();
  if (on) $("done").focus();
}
els.studioTools.addEventListener("click", (e) => {
  const gb = e.target.closest("[data-glitter], [data-pour], [data-action]");
  if (gb && !gb.disabled) {
    if (gb.dataset.glitter) { ui.pour.id = ui.pour.id === gb.dataset.glitter ? "" : gb.dataset.glitter; }
    else if (gb.dataset.pour) { ui.pour[gb.dataset.pour] = gb.dataset.value; }
    else if (gb.dataset.action === "glfill" && ui.pour.id) { ui.pourHistory.push(fillGlass(design, ui.pour.id)); }
    else if (gb.dataset.action === "glundo") { const n = ui.pourHistory.pop() || 0; design.crush.splice(Math.max(0, design.crush.length - n), n); }
    else if (gb.dataset.action === "glclear") { design.crush = []; ui.pourHistory = []; }
    renderPreview(); renderStudioTools(); renderPanel(); e.stopPropagation(); return;
  }
  const b = e.target.closest("[data-tool]");
  if (!b || b.disabled || b.type === "range") return;
  const tool = b.dataset.tool, v = b.dataset.value;
  if (tool === "mode") ui.mode = v;
  else if (tool === "brush") { ui.brush.tool = v; ui.brush.color = ""; }
  else if (tool === "size") ui.brush.size = v;
  else if (tool === "color") ui.brush.color = v;
  else if (tool === "undo") { design.paint.pop(); renderTotal(); }
  else if (tool === "clear") { design.paint = []; renderTotal(); }
  renderPreview();
  renderStudioTools();
});
els.studioTools.addEventListener("input", (e) => {
  if (e.target.dataset.tool === "zoom") {
    ui.zoom = Number(e.target.value);
    if (ui.zoom === 1) ui.pan = [0, 0];
    renderPreview();
  }
});
$("bigview").addEventListener("click", () => setFull(true));
$("done").addEventListener("click", () => { setFull(false); renderPanel(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && ui.full) { setFull(false); renderPanel(); } });
$("bigview").addEventListener("dblclick", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && ui.full) { setFull(false); renderPanel(); }
});

/* ---------- Other buttons ---------- */
els.steps.addEventListener("click", (e) => {
  const b = e.target.closest("[data-step]");
  if (b) go(Number(b.dataset.step));
});
// Clear resin and ink dye: things inside (charms, flowers) come before glitter and sprinkles.
const stepOrder = () => (design.shape === "frame-oval" ? [0, 1, INSIDE_STEP, COLOURS_STEP, GLITTER_STEP_NO, LAST] : design.style === "clear" ? [0, 1, 2, 3, 7, 6, 8, 9, 10] : design.style === "ink" ? [0, 1, 2, 3, 4, 5, 7, 6, 8, 9, 10] : null);
function neighbour(dir) {
  const o = stepOrder();
  if (!o) return ui.step + dir;
  const k = o.indexOf(ui.step);
  return k < 0 ? ui.step + dir : o[Math.max(0, Math.min(o.length - 1, k + dir))];
}
els.next.addEventListener("click", () => { if (ui.step === 0) { ui.pickReady = false; ui.cat = ""; } go(neighbour(1)); });
els.back.addEventListener("click", () => {
  if (ui.step === 1 && ui.cat) { ui.cat = ""; ui.chosen = false; renderPanel(); renderPreview(); window.scrollTo({ top: 0 }); return; }
  if (ui.step === 0 && ui.pickReady) { ui.pickReady = false; renderPanel(); return; }
  if (ui.step === 1) { ui.cat = ""; ui.pickReady = false; }
  go(neighbour(-1));
});
$("startover").addEventListener("click", startOver);
$("savedraft").addEventListener("click", saveDraft);
$("mysaves").addEventListener("click", openSaves);
$("savestyle").addEventListener("click", saveStyle);
onLangChange(render);

/* ---------- Open a shared design link (…#d=...) ---------- */
function loadFromLink() {
  const preset = new URLSearchParams(location.search).get("preset");
  const p = CONFIG.presets.find((x) => x.id === preset);
  if (p) {
    design = presetDesign(p); ui.example = true;
    ui.step = 1;
    ui.visited = new Set([0, 1]);
  }
  const params = new URLSearchParams(location.search);
  const gk = params.get("gallery"), gd = gk && galleryDesign(gk);
  if (gd) { ui.example = true; design = gd.d; ui.cat = gd.cat; ui.step = afterStyle(design); ui.visited = new Set([0, 1, 2, 3, ui.step]); }
  if (params.get("cat")) { ui.cat = params.get("cat"); ui.step = 1; ui.visited = new Set([0, 1]); ui.jump = params.get("group") || ""; }
  if ((ui.cat === "cutting" || ui.cat === "paint") && catOf(design.shape) !== ui.cat) { design.shape = ui.cat === "paint" ? "canvas-rect" : "board-rect"; design.style = ui.cat === "paint" ? "gradient" : "clear"; design.addins = {}; design.crush = []; ui.chosen = true; }
  if (params.has("start")) { ui.step = 0; ui.visited = new Set([0]); ui.cat = ""; ui.pickReady = false; }
  const letter = (params.get("letter") || "").toUpperCase();
  if (letter) ui.cat = "keychains";
  if (/^[A-Z0-9]$/.test(letter)) { design.shape = letter; resetItems(design); ui.step = 2; ui.visited = new Set([0, 1, 2]); }
  if (p || gd || /^[A-Z0-9]$/.test(letter)) ui.chosen = true;
  const m = location.hash.match(/d=([^&]+)/);
  if (!m) return;
  try {
    design = merge(defaultDesign(), decodeDesign(decodeURIComponent(m[1]))); if (!design.picked.length && !isFresh(design)) design.picked = [...new Set(design.colors)];
    ui.step = LAST; ui.chosen = true;
    ui.visited = new Set([...Array(STEP_COUNT).keys()]);
  } catch (err) {
    console.warn("Could not read shared design", err);
  }
}

loadFromLink();
renderChrome();
render();
if (new URLSearchParams(location.search).has("saves")) setTimeout(openSaves, 300);
if (ui.jump) setTimeout(() => { const el = document.getElementById("grp-" + ui.jump); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 250);
if (document.fonts && document.fonts.load) {
  Promise.all([document.fonts.load("20px 'Archivo Black'"), document.fonts.load("20px 'Bagel Fat One'")]).catch(() => {}).then(() => { maskCache = {}; render(); });
}
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => { maskCache = {}; render(); });
}

/* board size: type or drag */
els.panel.addEventListener("input", (e) => {
  const el = e.target.closest("[data-cm]");
  if (!el) return;
  const k = el.dataset.cm, v = Math.max(10, Math.min(200, Math.round(Number(el.value) || 0)));
  if (!design.cm) design.cm = { w: 30, h: 40 };
  if (el.type === "number" && (el.value === "" || Number(el.value) < 10)) return;   // let the person finish typing
  design.cm[k] = v;
  els.panel.querySelectorAll(`[data-cm="${k}"]`).forEach((x) => { if (x !== el) x.value = v; });
  const sr = $("size-rect"); if (sr) { sr.style.aspectRatio = `${design.cm.w} / ${design.cm.h}`; sr.querySelector("b").textContent = `${design.cm.w} × ${design.cm.h} cm`; }
  renderPreview(); renderBarSummary();
  const box = $("order-text"); if (box) box.value = orderText();
});
els.panel.addEventListener("click", (e) => {
  const b = e.target.closest("[data-cover]");
  if (!b) return;
  const k = b.dataset.cover;
  if (k === "full") { design.partial = 0; design.partialSide = ""; design.partialAngle = 0; }
  else { const [side, diag] = k.split("-"); design.partial = design.partial || 0.55; design.partialSide = side === "top" ? "" : side; design.partialAngle = diag ? 14 : 0; }
  renderPanel(); renderPreview();
});
els.panel.addEventListener("click", (e) => {
  const b = e.target.closest("[data-cm-set]");
  if (!b) return;
  const [w, h] = b.dataset.cmSet.split("x").map(Number);
  design.cm = { w, h };
  renderPanel(); renderPreview(); renderBarSummary();
});

els.panel.addEventListener("click", (e) => {
  const b = e.target.closest("[data-chess]");
  if (!b) return;
  const [sec, key] = b.dataset.chess.split(".");
  if (!design.chess) design.chess = defaultDesign().chess;
  design.chess[sec][key] = key === "foil" ? !!b.dataset.v : b.dataset.v;
  renderPanel(); renderPreview(); renderBarSummary();
  const box = $("order-text"); if (box) box.value = orderText();
});

els.panel.addEventListener("click", (e) => {
  const b = e.target.closest("[data-qty]"); if (!b) return;
  const cc = b.closest(".cupcard");
  if (cc) { const m = cc.querySelector("[data-action=mold]"); if (m && design.shape !== m.dataset.shape) { design.qty = 1; m.click(); } }
  design.qty = Math.max(1, Math.min(50, (design.qty || 1) + Number(b.dataset.qty)));
  renderPanel(); renderBarSummary();
  const box = $("order-text"); if (box) box.value = orderText();
});
