"use strict";

/* =========================================================
   The keychain designer (design.html).
   Prices, colours, add-ins and presets live in config.js.
   ========================================================= */
Object.assign(ui, {
  step: 0, visited: new Set([0]), side: "front", slot: 0, photo: "",
  full: false, mode: "move", zoom: 1, pan: [0, 0], brush: { tool: "ink", color: "", size: "m" },
});
const STEP_COUNT = I18N.en.steps.length;
const LAST = STEP_COUNT - 1;

/* =========================================================
   Design state
   ========================================================= */
function defaultDesign() {
  return {
    shape: "A",
    second: "",
    style: "gradient",
    colors: ["#1F4FD1", "#22C1C3", "#F5F3EE"],
    clearParts: false,
    gradient: { direction: "down", glitter: "fine" },
    ink: { amount: "medium", background: "clear", spread: "all", cells: true, shimmer: "pearl" },
    ocean: { sand: "middle", wave: "middle", foam: "frothy", sandColor: "natural" },
    addins: {},
    paint: [],
    edge: "none",
    edgeColor: "#2BA59A",
    back: "same",
    metal: "gold",
    hardware: "ringchain",
    tassel: { type: "silk", ombre: true, color1: "#F3C6DD", color2: "#F7B89A", cord: "gold" },
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
function activeAddins(d) {
  return CONFIG.addins.filter((a) => d.addins[a.id] && !blockedReason(a.id, d));
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
  if (P.back[d.back]) lines.push([L("back"), P.back[d.back]]);
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
    return [lab("amountInk", k.amount, lang), low(lab("spread", k.spread, lang)),
      t("sum.bg", null, lang) + ": " + low(lab("background", k.background, lang)),
      k.cells ? low(t("ui.cells", null, lang)) : "",
      k.shimmer !== "none" ? t("sum.shimmer", null, lang) + ": " + low(lab("shimmer", k.shimmer, lang)) : ""].filter(Boolean).join(", ");
  }
  if (d.style === "ocean") {
    const o = d.ocean;
    return [t("sum.sand", null, lang) + ": " + low(lab("sand", o.sand, lang)), t("sum.wave", null, lang) + ": " + low(lab("wave", o.wave, lang)),
      t("sum.foam", null, lang) + ": " + low(lab("foam", o.foam, lang)),
      o.sand !== "none" ? t("sum.sandColor", null, lang) + ": " + low(lab("sandColor", o.sandColor, lang)) : ""].filter(Boolean).join(", ");
  }
  return "";
}

function tasselText(d, lang) {
  const tt = d.tassel;
  if (tt.type === "none") return lab("tassel", "none", lang);
  const cols = tt.ombre ? t("sum.ombreTo", { a: colorName(tt.color1, lang), b: colorName(tt.color2, lang) }, lang) : colorName(tt.color1, lang);
  return `${lab("tassel", tt.type, lang)}, ${cols}, ${t("sum.cordIs", { c: lab("cord", tt.cord, lang) }, lang)}`;
}

function summaryLines(d, lang = ui.lang) {
  const S = (k, v) => t("sum." + k, v, lang);
  const L = [];
  L.push([S("shape"), shapeName(d.shape, lang)]);
  const det = styleDetails(d, lang);
  L.push([S("style"), lab("style", d.style, lang) + (det ? " (" + det + ")" : "")]);
  if (d.style !== "clear") L.push([S("colours"), d.colors.map((c) => colorName(c, lang)).join(", ")]);
  const ad = activeAddins(d).map((a) => {
    const s = d.addins[a.id];
    const parts = [tr(a, "name", lang)];
    const low = (x) => (lang === "en" ? x.toLowerCase() : x);
    if (!a.single) parts.push(low(lab("amount", s.amount, lang)));
    if (a.drag && s.moved) parts.push(S("placed"));
    else if (a.id !== "glow") parts.push(s.place === "anna" ? lab("place", "anna", lang).replace(" 💛", "") : low(lab("place", s.place, lang)));
    parts.push(colorName(s.color, lang));
    return parts.join(", ");
  });
  L.push([S("addins"), ad.length ? ad.join("; ") : S("none")]);
  if (d.paint.length) L.push([S("paint"), S("strokes", { n: d.paint.length })]);
  L.push([S("back"), lab("back", d.back, lang)]);
  L.push([S("chain"), `${lab("metal", d.metal, lang)}, ${lab("hardware", d.hardware, lang)}`]);
  L.push([S("tassel"), tasselText(d, lang)]);
  if (d.extra !== "none") L.push([S("extra"), lab("extra", d.extra, lang)]);
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
  return location.href.split("#")[0] + "#d=" + encodeURIComponent(encodeDesign(d));
}

// The message Anna receives is always in English, so she can read every order the same way.
function orderText() {
  const lines = ["Hi Anna! I designed a keychain on Keychain Studio 💛", "Design code: " + designCode(design), ""];
  for (const [k, v] of summaryLines(design, "en")) lines.push(`${k}: ${v}`);
  if (SHOW_PRICES) lines.push("", "Estimated price: " + money(priceOf(design, "en").total));
  if (design.note.trim()) lines.push("Note: " + design.note.trim());
  if (ui.photo) lines.push("(I'll send my reference photo in this chat 📷)");
  if (ui.lang !== "en") lines.push("Language: " + { th: "Thai", ru: "Russian" }[ui.lang]);
  lines.push("", "Open my exact design: " + shareLink());
  return lines.join("\n");
}

/* =========================================================
   Shapes: drawing + "is this point inside?" mask
   ========================================================= */
let uid = 0;
const LETTER_FONT = "'Nunito', 'Arial Rounded MT Bold', 'Arial Black', sans-serif";
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

function bounds(shape) {
  const b = { tag: [122, 394], heart: [150, 392], circle: [134, 390], star: [133, 400] };
  return b[shape] || [176, 392];
}
function pinTop(shape) {
  const p = { tag: 134, heart: 182, circle: 140, star: 140 };
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
    case "circle": return `<circle cx="150" cy="262" r="128" ${attrs}/>`;
    case "star": return `<path d="${starPath(150, 270, 136, 60, 5)}" ${attrs}/>`;
    default:
      return `<text x="150" y="392" text-anchor="middle" font-family="${LETTER_FONT.replace(/"/g, "'")}" font-weight="900" font-size="300" ${attrs}>${esc(shape)}</text>`;
  }
}

let maskCache = {};
function shapeMask(shape) {
  if (maskCache[shape]) return maskCache[shape];
  const c = document.createElement("canvas");
  c.width = 300; c.height = 440;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#000";
  if (shape === "tag") {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(82, 122, 136, 272, 18); else ctx.rect(82, 122, 136, 272);
    ctx.fill();
  } else if (shape === "heart") ctx.fill(new Path2D(HEART_D));
  else if (shape === "circle") { ctx.beginPath(); ctx.arc(150, 262, 128, 0, Math.PI * 2); ctx.fill(); }
  else if (shape === "star") ctx.fill(new Path2D(starPath(150, 270, 136, 60, 5)));
  else {
    ctx.font = `900 300px ${LETTER_FONT}`;
    ctx.textAlign = "center";
    ctx.fillText(shape, 150, 392);
  }
  const data = ctx.getImageData(0, 0, 300, 440).data;
  const fn = (x, y) => {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= 300 || y >= 440) return false;
    return data[(y * 300 + x) * 4 + 3] > 128;
  };
  return (maskCache[shape] = fn);
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
  const n = ADDIN_COUNTS[a.id][AMT[sel.amount] ?? 1];
  const items = [];
  const avoid = takenSpots(d).filter((it) => !(sel.items || []).includes(it));
  for (let i = 0; i < n; i++) {
    const [x, y] = randomSpot(d, sel.place, rand, a.id === "frog" ? 14 : 6, avoid.concat(items));
    items.push([x, y, a.id === "frog" ? 0 : Math.round(rand() * 40 - 20)]);
  }
  return items;
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

function styleLayer(d, id, R, T, B) {
  const c = d.colors;
  const h = B - T;
  if (d.style === "clear") return "";

  if (d.style === "gradient") {
    const g = d.gradient;
    const dirs = { down: [0, 0, 0, 1], right: [0, 0, 1, 0], diagonal: [0, 0, 1, 1] };
    const stops = c.map((col, i) => `<stop offset="${i / (c.length - 1)}" stop-color="${col}" stop-opacity="0.92"/>`).join("");
    const grad = g.direction === "center"
      ? `<radialGradient id="${id}-g" cx="0.5" cy="0.55" r="0.6">${stops}</radialGradient>`
      : `<linearGradient id="${id}-g" x1="${dirs[g.direction][0]}" y1="${dirs[g.direction][1]}" x2="${dirs[g.direction][2]}" y2="${dirs[g.direction][3]}">${stops}</linearGradient>`;
    const mask = d.clearParts
      ? `<mask id="${id}-m"><rect x="0" y="100" width="300" height="320" fill="#fff"/><ellipse cx="150" cy="${T + h * 0.5}" rx="190" ry="30" transform="rotate(-24 150 ${T + h * 0.5})" fill="#000" filter="url(#${id}-soft)"/></mask>`
      : "";
    return `<defs>${grad}${mask}</defs>
      <g ${d.clearParts ? `mask="url(#${id}-m)"` : ""}>
        <rect x="0" y="${T - 20}" width="300" height="${h + 40}" fill="url(#${id}-g)"/>
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
    const n = { light: 5, medium: 9, bold: 15 }[k.amount];
    const rBase = { light: 20, medium: 26, bold: 32 }[k.amount];
    const op = { light: 0.55, medium: 0.75, bold: 0.92 }[k.amount];
    let blobs = "";
    for (let i = 0; i < n; i++) {
      const r = rBase + R() * 18;
      blobs += `<ellipse cx="${(x0 + R() * (x1 - x0)).toFixed(0)}" cy="${(y0 + R() * (y1 - y0)).toFixed(0)}" rx="${(r * (0.9 + R() * 0.6)).toFixed(0)}" ry="${(r * (0.6 + R() * 0.5)).toFixed(0)}" fill="${c[i % 3]}" opacity="${op}"/>`;
    }
    s += `<g filter="url(#${id}-ink)">${blobs}</g>`;
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

  // ocean
  const o = d.ocean;
  const sandY = o.sand === "none" ? null : T + h * { low: 0.8, middle: 0.64, high: 0.46 }[o.sand];
  const seaBottom = sandY ?? B;
  let waveY = { top: T + h * 0.22, middle: T + h * 0.45, diagonal: T + h * 0.45 }[o.wave];
  if (o.wave === "bottom") waveY = sandY ? sandY - 4 : B - h * 0.18;
  const rot = o.wave === "diagonal" ? `transform="rotate(-24 150 ${waveY})"` : "";

  let s = `<defs><linearGradient id="${id}-sea" gradientUnits="userSpaceOnUse" x1="0" y1="${T}" x2="0" y2="${seaBottom}">
      <stop offset="0" stop-color="${c[0]}"/><stop offset="0.6" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/>
    </linearGradient></defs>
    <rect x="0" y="${T - 30}" width="300" height="${seaBottom - T + 50}" fill="url(#${id}-sea)"/>`;

  if (sandY) {
    let grains = "";
    for (let i = 0; i < 140; i++) {
      grains += `<circle cx="${(R() * 300).toFixed(1)}" cy="${(sandY + 4 + R() * (430 - sandY)).toFixed(1)}" r="${(0.5 + R()).toFixed(1)}" fill="${R() > 0.5 ? "#8C7650" : "#FFF6E0"}" opacity="0.6"/>`;
    }
    s += `<path d="M0 ${sandY} q 40 -8 80 0 t 80 0 t 80 0 t 80 0 V 430 H 0 Z" fill="${SAND[o.sandColor]}"/>${grains}`;
  }

  const foamW = o.foam === "frothy" ? 10 : 5;
  const lace = o.foam === "frothy" ? 70 : 30;
  let circles = "";
  for (let i = 0; i < lace; i++) {
    circles += `<circle cx="${(R() * 300).toFixed(1)}" cy="${(waveY - 4 + R() * 26).toFixed(1)}" r="${(1.5 + R() * 4.5).toFixed(1)}" fill="none" stroke="#fff" stroke-width="${(0.8 + R() * 0.9).toFixed(1)}" opacity="0.9"/>`;
  }
  s += `<g ${rot}>
      <rect x="-40" y="${waveY}" width="380" height="${Math.max(0, seaBottom - waveY)}" fill="#fff" opacity="0.18"/>
      <path d="M-20 ${waveY} q 25 -9 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0" fill="none" stroke="#fff" stroke-width="${foamW}" stroke-linecap="round" filter="url(#${id}-foam)"/>
      ${circles}
    </g>`;
  return s;
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

const HIT = { frog: 26, starfish: 18, flowers: 20, shells: 13, hearts: 11, stars: 11, pearl: 10 };
function itemsLayer(d, pid, interactive) {
  let s = "";
  for (const a of activeAddins(d)) {
    if (!a.drag) continue;
    const sel = d.addins[a.id];
    sel.items.forEach(([x, y, r], i) => {
      const R = rng(hashText(a.id) + i * 97);
      const hit = interactive ? `<circle r="${HIT[a.id] || 14}" fill="transparent"/>` : "";
      s += `<g class="${interactive ? "item" : ""}" data-id="${a.id}" data-i="${i}" transform="translate(${x} ${y}) rotate(${r})">${hit}${drawItem(a.id, sel.color, R, pid)}</g>`;
    });
  }
  return s;
}

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
  const ring = `<circle cx="150" cy="42" r="27" fill="none" stroke="${m}" stroke-width="5"/>`;
  const lobster = (y) => `<circle cx="150" cy="${y - 6}" r="6" fill="none" stroke="${m}" stroke-width="3"/>
    <path d="M150 ${y} c -14 0 -18 14 -18 26 c 0 16 10 26 18 30 c 8 -4 18 -14 18 -30 c 0 -12 -4 -26 -18 -26 z" fill="none" stroke="${m}" stroke-width="5"/>
    <rect x="160" y="${y + 18}" width="6" height="12" rx="2" fill="${m}"/>`;
  switch (d.hardware) {
    case "ring": return ring + jump(82) + jump(102);
    case "ringchain":
      return ring + [80, 93, 106, 119].map((y, i) => `<ellipse cx="150" cy="${y}" rx="${i % 2 ? 3.5 : 6}" ry="8" fill="none" stroke="${m}" stroke-width="3"/>`).join("");
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
  const cordColor = { gold: "#C8A13A", silver: "#AEB5BE", match: tt.color1, twist: tt.color1 }[tt.cord];
  const cordPath = "M152 70 C 190 70, 225 80, 232 112";
  let s = `<path d="${cordPath}" fill="none" stroke="${cordColor}" stroke-width="3.5" stroke-linecap="round"/>`;
  if (tt.cord === "twist") s += `<path d="${cordPath}" fill="none" stroke="#C8A13A" stroke-width="3.5" stroke-dasharray="4 4"/>`;
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
        s += `<circle cx="${(148 - 50 * k).toFixed(1)}" cy="${(70 + 120 * k).toFixed(1)}" r="${i % 2 ? 5 : 7}" fill="${i % 2 ? "#F5F3EE" : c}" stroke="rgba(0,0,0,0.12)"/>`;
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

function renderPiece(d, side = "front", opts = {}) {
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
    <clipPath id="${id}-clip">${shapeMarkup(d.shape, "")}</clipPath>
    <filter id="${id}-ink" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="38" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="${id}-line" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="${id}-foam"><feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="${id}-soft"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="${id}-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="${id}-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#08445C" flood-opacity="0.22"/></filter>
  </defs>`;

  const plainBack = side === "back" && d.back === "plain";
  const fill = plainBack ? "" : styleLayer(d, id, R, T, B) + scatterLayer(d, T, B) + paintLayer(d, id) + itemsLayer(d, id, interactive);

  // Hairline rim drawn INSIDE the mold outline (clipped), so the piece is exactly the mold's shape.
  const rim = `fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.6" stroke-linejoin="round"`;

  const flip = side === "back" ? `transform="matrix(-1 0 0 1 300 0)"` : "";
  const label = `${shapeName(d.shape)}, ${lab("style", d.style)}`;

  return `<svg viewBox="${zoomBox(opts.zoom, opts.pan)}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(label)}">
    ${defs}
    ${tasselSvg(d, id)}
    ${extraSvg(d, id)}
    <line x1="150" y1="110" x2="150" y2="${pinTop(d.shape)}" stroke="url(#${id}-metal)" stroke-width="3"/>
    ${hardwareSvg(d, id)}
    <g filter="url(#${id}-shadow)" ${flip}>
      ${glow ? `<g filter="url(#${id}-glow)" opacity="0.65">${shapeMarkup(d.shape, `fill="${d.addins.glow.color}"`)}</g>` : ""}
      <g clip-path="url(#${id}-clip)" class="resin">
        <rect x="0" y="100" width="300" height="330" fill="rgba(226,244,242,0.6)"/>
        ${fill}
        <path d="M40 100 L 118 100 L 18 430 L -60 430 Z" fill="#fff" opacity="0.22" pointer-events="none"/>
        <path d="M170 100 L 190 100 L 90 430 L 70 430 Z" fill="#fff" opacity="0.12" pointer-events="none"/>
        ${shapeMarkup(d.shape, rim + ' pointer-events="none"')}
      </g>
    </g>
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
  return `<img src="${esc(p.photo)}" alt="${esc(p.name)}" loading="lazy" onerror="this.parentNode.classList.add('no-photo');this.remove()"><div class="fallback">${drawing}</div>`;
}

const STEP_VIEWS = [
  // 0 Ready-made
  () => `
    <h2>${U("s0h")}</h2>
    <p class="hint">${U("s0p")}</p>
    <div class="cards presets">${CONFIG.presets.map((p) => {
      const d = merge(defaultDesign(), p.design);
      return `<div class="card">
        <div class="card-art ${p.photo ? "has-photo" : ""}">${presetArt(p, d)}</div>
        <span class="card-name">${p.name}</span>
        <span class="card-text">${tr(p, "blurb")}</span>
        ${SHOW_PRICES ? `<span class="card-price">${money(priceOf(d).total)}</span>` : ""}
        <div class="card-actions">
          <button type="button" class="btn btn-ink small" data-action="preset" data-id="${p.id}" data-go="review">${U("orderThis")}</button>
          <button type="button" class="btn btn-line small" data-action="preset" data-id="${p.id}" data-go="edit">${U("changeIt")}</button>
        </div>
      </div>`;
    }).join("")}</div>
    <div class="field"><button type="button" class="btn btn-line" data-action="scratch">${U("fromScratch")}</button></div>
    <p class="small-note">${U("handmade")}</p>`,

  // 1 Mold
  () => {
    const fam = moldFamily(design.shape);
    const molds = [
      { id: "letter", label: U("moldLetters"), shape: isLetter(design.shape) ? design.shape : "A" },
      { id: "number", label: U("moldNumbers"), shape: isNumber(design.shape) ? design.shape : "1" },
      ...CONFIG.shapes.map((sh) => ({ id: sh.id, label: tr(sh, "name"), shape: sh.id })),
    ];
    return `
    <h2>${U("sMoldH")}</h2>
    <p class="hint">${U("sMoldP")}</p>
    <div class="cards molds">${molds.map((m) => {
      const d = merge(copy(design), { shape: m.shape });
      return `<button type="button" class="card ${fam === m.id ? "on" : ""}" aria-pressed="${fam === m.id}" data-action="mold" data-shape="${m.shape}">
        <span class="card-art">${renderPiece(d)}</span>
        <span class="card-name">${m.label}</span>
      </button>`;
    }).join("")}</div>`;
  },

  // 2 Letter
  () => {
    const keys = (isNumber(design.shape) ? "0123456789" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ").split("");
    return `
    <h2>${U("s1h")}</h2>
    <p class="hint">${U("s1p")}</p>
    <div class="letters">${keys.map((k) =>
      `<button type="button" class="letter ${design.shape === k ? "on" : ""}" aria-pressed="${design.shape === k}" data-set="shape" data-value="${k}">${k}</button>`).join("")}</div>
    ${field(U("second"),
      `<input class="text-input" type="text" maxlength="1" autocomplete="off" aria-label="${U("second")}" data-set="second" data-upper="1" value="${esc(design.second)}" placeholder="—">`,
      U("secondNote"))}`;
  },

  // 3 Style
  () => `
    <h2>${U("s2h")}</h2>
    <p class="hint">${U("s2p")}</p>
    <div class="cards">${Object.keys(I18N.en.labels.style).map((st) => {
      const d = merge(copy(design), { style: st });
      return `<button type="button" class="card ${design.style === st ? "on" : ""}" aria-pressed="${design.style === st}" data-set="style" data-value="${st}">
        <span class="card-art">${renderPiece(d)}</span>
        <span class="card-name">${lab("style", st)}</span>
        <span class="card-text">${lab("styleText", st)}</span>
      </button>`;
    }).join("")}</div>`,

  // 4 Details
  () => {
    if (design.style === "clear") return `<h2>${U("s3clearH")}</h2><p class="hint">${U("s3clearP")}</p>`;
    if (design.style === "gradient") {
      return `<h2>${U("s3gradH")}</h2><p class="hint">${U("s3gradP")}</p>
        ${field(U("direction"), chips("gradient.direction", "direction", design.gradient.direction))}
        ${field(U("glitter"), chips("gradient.glitter", "glitter", design.gradient.glitter))}
        ${field(U("clearWindow"), yesNo("clearParts", design.clearParts), U("clearWindowNote"))}`;
    }
    if (design.style === "ink") {
      const k = design.ink;
      return `<h2>${U("s3inkH")}</h2><p class="hint">${U("s3inkP")}</p>
        ${field(U("inkAmount"), chips("ink.amount", "amountInk", k.amount))}
        ${field(U("inkWhere"), chips("ink.spread", "spread", k.spread))}
        ${field(U("background"), chips("ink.background", "background", k.background))}
        ${field(U("cells"), yesNo("ink.cells", k.cells))}
        ${field(U("shimmer"), chips("ink.shimmer", "shimmer", k.shimmer))}`;
    }
    const o = design.ocean;
    return `<h2>${U("s3oceanH")}</h2><p class="hint">${U("s3oceanP")}</p>
      ${field(U("sand"), chips("ocean.sand", "sand", o.sand))}
      ${field(U("wave"), chips("ocean.wave", "wave", o.wave))}
      ${field(U("foam"), chips("ocean.foam", "foam", o.foam))}
      ${o.sand !== "none" ? field(U("sandColor"), chips("ocean.sandColor", "sandColor", o.sandColor)) : ""}
      <p class="small-note">${U("oceanNote")}</p>`;
  },

  // 5 Colours
  () => {
    if (design.style === "clear") {
      return `<h2>${U("s4h")}</h2><p class="hint">${U("s4clearP")}</p>
        <button type="button" class="btn btn-line" data-action="goto" data-step="3">${U("changeStyle")}</button>
        <p class="small-note">${U("paintTip")}</p>`;
    }
    const names = design.style === "ocean" ? U("slotOcean") : design.style === "ink" ? U("slotInk") : U("slotGrad");
    const slot = ui.slot;
    return `<h2>${U("s4h")}</h2>
      <p class="hint">${U("s4p")}</p>
      ${field(U("palettes"), `<div class="chips">${CONFIG.palettes.map((p, i) =>
        `<button type="button" class="chip" data-action="palette" data-i="${i}"><span class="dots">${p.colors.map((c) => `<span class="dot" style="background:${c}"></span>`).join("")}</span>${tr(p, "name")}</button>`).join("")}</div>`)}
      ${field(U("yourColours"), `<div class="slots">${design.colors.map((c, i) =>
        `<button type="button" class="slot ${slot === i ? "on" : ""}" aria-pressed="${slot === i}" data-action="slot" data-i="${i}"><span class="blob" style="background:${c}"></span>${names[i]}</button>`).join("")}</div>`)}
      ${field(U("coloursFor", { name: names[slot] }), `<div class="swatches">${CONFIG.colors.map((c) =>
        `<button type="button" class="swatch" style="background:${c.hex}" title="${esc(tr(c, "name"))}" aria-label="${esc(tr(c, "name"))}" data-action="swatch" data-hex="${c.hex}"></button>`).join("")}</div>`)}
      ${field(U("anyColour"), `<div class="color-row"><input type="color" aria-label="${esc(names[slot])}" data-set="colors.${slot}" value="${design.colors[slot]}"><span class="small-note">${U("anyColourNote")}</span></div>`)}
      <p class="small-note">${U("paintTip")}</p>`;
  },

  // 6 Add-ins
  () => `
    <h2>${U("s5h")}</h2>
    <p class="hint">${U("s5p")}</p>
    ${CONFIG.addins.map((a) => {
      const sel = design.addins[a.id];
      const reason = blockedReason(a.id, design);
      const on = !!sel && !reason;
      const body = on ? `<div class="addin-body">
          ${a.single ? "" : `<div><span class="field-label">${U("howMuch")}</span>${chips(`addins.${a.id}.amount`, "amount", sel.amount)}</div>`}
          ${a.id === "glow" ? "" : `<div><span class="field-label">${U("where")}</span>${chips(`addins.${a.id}.place`, "place", sel.place)}</div>`}
          <div class="color-row"><span class="field-label">${U("colour")}</span><input type="color" aria-label="${esc(tr(a, "name"))}" data-set="addins.${a.id}.color" value="${sel.color}"></div>
          ${a.drag ? `<div class="chips">
            <button type="button" class="chip" data-action="shuffle" data-id="${a.id}">${U("shuffle")}</button>
            ${a.single ? "" : `<button type="button" class="chip" data-action="onemore" data-id="${a.id}">${U("oneMore")}</button>`}
          </div>` : ""}
        </div>` : "";
      return `<div class="addin ${on ? "on" : ""} ${reason ? "off" : ""}">
        <button type="button" class="addin-head" data-action="addin" data-id="${a.id}" aria-pressed="${on}" ${reason ? "disabled" : ""}>
          <span class="em" data-drag="${a.id}" title="${esc(U("dropHint"))}" style="background:${a.color}"></span>
          <span class="nm">${tr(a, "name")}</span>
          <span class="tick">${on ? U("added") : U("add")}</span>
        </button>
        ${reason ? `<p class="why">${reason}</p>` : ""}
        ${body}
      </div>`;
    }).join("")}`,

  // 7 Back
  () => `
    <h2>${U("s6h")}</h2>
    <p class="hint">${U("s6p")}</p>
    ${field(U("backSide"), chips("back", "back", design.back), design.back === "different" ? U("backNoteDiff") : U("backNoteSame"))}`,

  // 8 Chain
  () => `
    <h2>${U("s7h")}</h2>
    <p class="hint">${U("s7p")}</p>
    ${field(U("metal"), `<div class="chips">${Object.keys(METALS).map((v) =>
      `<button type="button" class="chip ${design.metal === v ? "on" : ""}" aria-pressed="${design.metal === v}" data-set="metal" data-value="${v}"><span class="dot" style="background:linear-gradient(135deg, ${METALS[v][0]}, ${METALS[v][1]})"></span>${lab("metal", v)}</button>`).join("")}</div>`)}
    ${field(U("type"), `<div class="cards">${Object.keys(I18N.en.labels.hardware).map((v) => {
      return `<button type="button" class="card ${design.hardware === v ? "on" : ""}" aria-pressed="${design.hardware === v}" data-set="hardware" data-value="${v}">
        <span class="card-name">${lab("hardware", v)}</span><span class="card-text">${lab("hardwareTip", v)}</span></button>`;
    }).join("")}</div>`)}`,

  // 9 Tassel
  () => {
    const tt = design.tassel;
    return `
    <h2>${U("s8h")}</h2>
    <p class="hint">${U("s8p")}</p>
    ${field(U("tassel"), chips("tassel.type", "tassel", tt.type), U("tasselNote"))}
    ${tt.type !== "none" ? `
      ${field(U("ombre"), yesNo("tassel.ombre", tt.ombre))}
      ${field(tt.ombre ? U("topColour") : U("tasselColour"), `<input type="color" aria-label="${U("tasselColour")}" data-set="tassel.color1" value="${tt.color1}">`)}
      ${tt.ombre ? field(U("bottomColour"), `<input type="color" aria-label="${U("bottomColour")}" data-set="tassel.color2" value="${tt.color2}">`) : ""}
      ${field(U("cord"), chips("tassel.cord", "cord", tt.cord))}` : ""}
    ${field(U("extra"), chips("extra", "extra", design.extra))}`;
  },

  // 10 Review
  () => {
    const pr = priceOf(design);
    return `
    <h2>${U("s9h")}</h2>
    <p class="hint">${U("s9p")}</p>
    <p>${U("designCode")}: <span class="code">${designCode(design)}</span></p>
    <ul class="summary">${summaryLines(design).map(([k, v]) => `<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join("")}</ul>
    ${SHOW_PRICES ? field(U("price"), `<ul class="prices">${pr.lines.map(([k, v]) => `<li><span>${esc(k)}</span><span>${money(v)}</span></li>`).join("")}
      <li class="sum"><span>${U("total")}</span><span>${money(pr.total)}</span></li></ul>`,
      U("readyIn", { time: tr(CONFIG, "readyTime") }) + " " + U("handmade")) : `<p class="small-note">${U("readyIn", { time: tr(CONFIG, "readyTime") })} ${U("handmade")}</p>`}
    ${field(U("note"), `<textarea data-set="note" placeholder="${esc(U("notePh"))}">${esc(design.note)}</textarea>`)}
    ${field(U("photo"), `<input type="file" accept="image/*" id="photo-input">${ui.photo ? `<img class="ref-photo" src="${ui.photo}" alt="">` : ""}`, U("photoNote"))}
    <div class="send-row">
      <a class="btn btn-ink wide" href="${igLink()}" target="_blank" rel="noopener" data-action="dm">${U("sendDM")}</a>
      <button type="button" class="btn btn-line wide" data-action="copylink">${U("copyLink")}</button>
    </div>
    ${field(U("message"), `<textarea class="order-text" readonly id="order-text" aria-label="${U("message")}">${esc(orderText())}</textarea>`, U("messageNote"))}
    <p class="small-note">${U("customOrders")}</p>`;
  },
];

/* =========================================================
   Big view tools (move / paint / zoom)
   ========================================================= */
function brushColor() {
  if (ui.brush.color) return ui.brush.color;
  return ui.brush.tool === "gold" ? "#D4AF37" : design.style === "clear" ? "#22C1C3" : design.colors[0];
}
function renderStudioTools() {
  const box = els.studioTools;
  if (!ui.full) { box.innerHTML = ""; return; }
  const B = (k) => t("big." + k);
  const seg = (action, val, cur, label) => `<button type="button" class="chip ${cur === val ? "on" : ""}" aria-pressed="${cur === val}" data-tool="${action}" data-value="${val}">${label}</button>`;
  const cols = [...new Set([...design.colors, "#FFFFFF", "#D4AF37", ...CONFIG.colors.map((c) => c.hex)].map((c) => c.toUpperCase()))];
  const bc = brushColor().toUpperCase();
  box.innerHTML = `
    <div class="tool-row">${seg("mode", "move", ui.mode, B("move"))}${seg("mode", "paint", ui.mode, B("paint"))}
      <label class="zoom"><span>${B("zoom")}</span><input type="range" min="1" max="4" step="0.25" value="${ui.zoom}" data-tool="zoom" aria-label="${B("zoom")}"></label>
    </div>
    ${ui.mode === "paint" ? `
      <div class="tool-row">${seg("brush", "ink", ui.brush.tool, B("ink"))}${seg("brush", "glitter", ui.brush.tool, B("glitterBrush"))}${seg("brush", "gold", ui.brush.tool, B("goldBrush"))}
        <span class="sep" aria-hidden="true"></span>${["s", "m", "l"].map((s) => seg("size", s, ui.brush.size, s.toUpperCase())).join("")}</div>
      <div class="tool-row swatch-row" role="group" aria-label="${B("brushColour")}">${cols.map((c) =>
        `<button type="button" class="swatch small ${c === bc ? "on" : ""}" style="background:${c}" aria-label="${esc(colorName(c))}" data-tool="color" data-value="${c}"></button>`).join("")}</div>
      <div class="tool-row">
        <button type="button" class="btn btn-line small" data-tool="undo" ${design.paint.length ? "" : "disabled"}>${B("undoPaint")}</button>
        <button type="button" class="btn btn-line small" data-tool="clear" ${design.paint.length ? "" : "disabled"}>${B("clearPaint")}</button>
      </div>` : ""}`;
}

/* =========================================================
   Rendering and events
   ========================================================= */
const $ = (id) => document.getElementById(id);
const els = {
  stage: $("stage"), preview: $("preview"), panel: $("panel"), steps: $("steps"), hint: $("stage-hint"),
  total: $("total"), back: $("back"), next: $("next"), flip: $("flip"), toast: $("toast"),
  toastText: $("toast-text"), toastAction: $("toast-action"), studioTools: $("studio-tools"),
};

function hasDraggables() {
  return activeAddins(design).some((a) => a.drag);
}
function renderHint() {
  let h = "";
  if (ui.side === "back") h = ui.full ? t("big.backHint") : "";
  else if (ui.full) h = ui.mode === "paint" ? t("big.paintHint") : hasDraggables() ? t("big.moveHint") : "";
  else if (hasDraggables()) h = U("dragHint");
  els.hint.textContent = h;
}
function renderPreview() {
  els.preview.innerHTML = renderPiece(design, ui.side, { interactive: true, zoom: ui.zoom, pan: ui.pan });
  els.preview.classList.toggle("painting", ui.full && ui.mode === "paint" && ui.side === "front");
  renderHint();
}
function renderTotal() {
  const box = els.total.parentNode;
  box.hidden = !SHOW_PRICES;
  if (SHOW_PRICES) els.total.textContent = money(priceOf(design).total);
}
function renderSteps() {
  const names = t("steps");
  els.steps.innerHTML = names.map((name, i) =>
    `<button type="button" class="step ${i === ui.step ? "current" : ""} ${ui.visited.has(i) && i !== ui.step ? "done" : ""}" data-step="${i}" ${i === ui.step ? 'aria-current="step"' : ""}>${name}</button>`
  ).join("");
  const cur = els.steps.querySelector(".current");
  if (cur) els.steps.scrollTo({ left: cur.offsetLeft - els.steps.clientWidth / 2 + cur.clientWidth / 2 });
}
function renderPanel() {
  els.panel.innerHTML = STEP_VIEWS[ui.step]();
  els.back.hidden = ui.step === 0;
  els.next.hidden = ui.step === LAST;
  els.next.textContent = ui.step === 0 ? U("startDesigning") : ui.step === LAST - 1 ? U("toReview") : U("next");
  els.back.textContent = U("back");
}
function renderStatic() {
  applyStaticText();
}
function render() {
  renderStatic();
  renderPreview();
  renderTotal();
  renderSteps();
  renderPanel();
  renderStudioTools();
}
function swing() {
  els.preview.classList.remove("swing");
  void els.preview.offsetWidth;
  els.preview.classList.add("swing");
}
function changed() {
  render();
  swing();
}
const LETTER_STEP = 2;
function go(step) {
  const dir = step >= ui.step ? 1 : -1;
  step = Math.max(0, Math.min(LAST, step));
  if (step === LETTER_STEP && !isLetter(design.shape) && !isNumber(design.shape)) step += dir;
  ui.step = Math.max(0, Math.min(LAST, step));
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
  d.colors = Math.random() < 0.6 ? copy(pick(CONFIG.palettes).colors) : [pick(cols), pick(cols), pick(cols)];
  d.gradient = { direction: pick(["down", "right", "diagonal", "center"]), glitter: pick(["fine", "chunky", "holo", "none"]) };
  d.clearParts = Math.random() < 0.25;
  d.ink = { amount: pick(["light", "medium", "bold"]), background: pick(["clear", "white", "cloudy"]),
    spread: pick(["all", "all", "top", "bottom", "left", "right"]), cells: Math.random() < 0.6, shimmer: pick(["none", "pearl", "gold"]) };
  d.ocean = { sand: pick(["low", "middle", "middle", "high"]), wave: pick(["top", "middle", "bottom", "diagonal"]),
    foam: pick(["soft", "frothy"]), sandColor: pick(["natural", "natural", "white", "golden", "pink"]) };
  const natural = ["frog", "starfish", "shells", "pearl", "goldleaf"];
  let pool = CONFIG.addins.filter((a) => !blockedReason(a.id, d)).sort(() => Math.random() - 0.5);
  if (d.style === "ocean") pool = [CONFIG.addins.find((a) => a.id === "starfish"), ...pool.filter((a) => a.id !== "starfish")];
  pool.slice(0, 1 + Math.floor(Math.random() * 3)).forEach((a) => {
    d.addins[a.id] = { amount: pick(["few", "some", "lots"]), place: "anna", color: natural.includes(a.id) ? a.color : pick(cols) };
  });
  d.metal = pick(["gold", "silver", "rose", "black"]);
  d.hardware = pick(["ring", "ringchain", "ringchain", "lobster", "swivel", "carabiner"]);
  d.tassel = { type: pick(["silk", "silk", "cotton", "none"]), ombre: Math.random() < 0.6, color1: pick(cols), color2: pick(cols), cord: pick(["gold", "silver", "match", "twist"]) };
  d.extra = Math.random() < 0.25 ? pick(["ribbon", "pompom", "beads", "charm"]) : "none";
  design = d;
  ui.side = "front";
  if (ui.step < 3) { ui.step = 3; ui.visited.add(3); }
  changed();
  toast(U("surprised"), U("undo"), () => { design = before; changed(); });
}

function startOver() {
  const before = copy(design);
  const step = ui.step;
  design = defaultDesign();
  ui.side = "front";
  ui.visited = new Set([0]);
  go(0);
  toast(U("startedOver"), U("undo"), () => { design = before; go(step); });
}

/* ---------- Panel events ---------- */
els.panel.addEventListener("click", (e) => {
  const el = e.target.closest("[data-set], [data-action]");
  if (!el || el.disabled) return;

  if (el.dataset.set && el.tagName === "BUTTON") {
    const path = el.dataset.set;
    setPath(design, path, parseVal(el.dataset.value));
    if (path === "shape") resetItems(design);
    const m = path.match(/^addins\.(\w+)\.(amount|place)$/);
    if (m) { delete design.addins[m[1]].items; delete design.addins[m[1]].moved; }
    changed();
    return;
  }

  const action = el.dataset.action;
  if (action === "preset") {
    const p = CONFIG.presets.find((x) => x.id === el.dataset.id);
    design = merge(defaultDesign(), p.design);
    ui.side = "front";
    go(el.dataset.go === "review" ? LAST : 1);
    swing();
  } else if (action === "mold") {
    design.shape = el.dataset.shape;
    resetItems(design);
    ui.zoom = 1; ui.pan = [0, 0];
    changed();
  } else if (action === "scratch") {
    design = defaultDesign();
    go(1);
  } else if (action === "goto") {
    go(Number(el.dataset.step));
  } else if (action === "palette") {
    design.colors = copy(CONFIG.palettes[Number(el.dataset.i)].colors);
    changed();
  } else if (action === "slot") {
    ui.slot = Number(el.dataset.i);
    renderPanel();
  } else if (action === "swatch") {
    design.colors[ui.slot] = el.dataset.hex;
    if (ui.slot < 2) ui.slot += 1;
    changed();
  } else if (action === "addin") {
    const a = CONFIG.addins.find((x) => x.id === el.dataset.id);
    if (design.addins[a.id]) delete design.addins[a.id];
    else design.addins[a.id] = { amount: "some", place: "anna", color: a.color };
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
  setPath(design, el.dataset.set, v);
  renderPreview();
  renderTotal();
  const box = $("order-text");
  if (box) box.value = orderText();
});
els.panel.addEventListener("change", (e) => {
  if (e.target.type === "color") renderPanel();
  if (e.target.id === "photo-input" && e.target.files[0]) {
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
  if (ui.full && ui.mode === "paint") {
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
  const item = e.target.closest(".item");
  if (!item) {
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
  gesture = { type: "drag", id, i, el: item, sx: p.x, sy: p.y, ox: it[0], oy: it[1] };
  item.classList.add("dragging");
  els.preview.setPointerCapture(e.pointerId);
});

els.preview.addEventListener("pointermove", (e) => {
  if (!gesture) return;
  const p = svgPoint(e);
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

function endGesture() {
  if (!gesture) return;
  const g = gesture;
  gesture = null;
  if (g.type === "pan") return;
  if (g.type === "drag") {
    const sel = design.addins[g.id];
    const it = sel.items[g.i];
    if (!insideShape(design.shape, it[0], it[1])) {
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
  const h = e.target.closest("[data-drag]");
  if (!h || e.button > 0) return;
  tray = { id: h.dataset.drag, x: e.clientX, y: e.clientY, ghost: null, pid: e.pointerId };
  h.setPointerCapture(e.pointerId);
});
els.panel.addEventListener("pointermove", (e) => {
  if (!tray) return;
  if (!tray.ghost) {
    if (Math.hypot(e.clientX - tray.x, e.clientY - tray.y) < 6) return;
    const a = CONFIG.addins.find((x) => x.id === tray.id);
    tray.ghost = document.createElement("div");
    tray.ghost.className = "drag-ghost";
    tray.ghost.style.background = a.color;
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
  if (!insideShape(design.shape, p.x, p.y)) { toast(U("dropInside")); return; }
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
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && ui.full) { setFull(false); renderPanel(); }
});

/* ---------- Other buttons ---------- */
els.steps.addEventListener("click", (e) => {
  const b = e.target.closest("[data-step]");
  if (b) go(Number(b.dataset.step));
});
els.next.addEventListener("click", () => go(ui.step + 1));
els.back.addEventListener("click", () => go(ui.step - 1));
els.flip.addEventListener("click", () => {
  ui.side = ui.side === "front" ? "back" : "front";
  renderPreview();
  swing();
});
$("surprise").addEventListener("click", surprise);
$("startover").addEventListener("click", startOver);
onLangChange(render);

/* ---------- Open a shared design link (…#d=...) ---------- */
function loadFromLink() {
  const preset = new URLSearchParams(location.search).get("preset");
  const p = CONFIG.presets.find((x) => x.id === preset);
  if (p) {
    design = merge(defaultDesign(), p.design);
    ui.step = 1;
    ui.visited = new Set([0, 1]);
  }
  const params = new URLSearchParams(location.search);
  if (params.has("start")) { ui.step = 1; ui.visited = new Set([0, 1]); }
  const letter = (params.get("letter") || "").toUpperCase();
  if (/^[A-Z0-9]$/.test(letter)) { design.shape = letter; resetItems(design); ui.step = 2; ui.visited = new Set([0, 1, 2]); }
  const m = location.hash.match(/d=([^&]+)/);
  if (!m) return;
  try {
    design = merge(defaultDesign(), decodeDesign(decodeURIComponent(m[1])));
    ui.step = LAST;
    ui.visited = new Set([...Array(STEP_COUNT).keys()]);
  } catch (err) {
    console.warn("Could not read shared design", err);
  }
}

loadFromLink();
renderChrome();
render();
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => { maskCache = {}; render(); });
}
