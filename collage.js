/* Photos on a canvas: upload any number of photos, set the canvas size, drag, resize and cut each photo (square, rounded, circle, heart). */
const TXT = {
  en: { title: "Photos on a canvas", sub: "Upload your photos and place them on a white canvas, like in Canva. Set any canvas size, move and resize each photo, and cut it into a heart, circle or square.", size: "Canvas size", w: "Width (cm)", h: "Height (cm)", add: "Upload photos", addHint: "You can add as many as you like.", shape: "Cut the photo as", square: "Square", rounded: "Rounded", circle: "Circle", heart: "Heart", zoom: "Zoom inside the cut", size2: "Photo size", front: "Bring to front", del: "Delete photo", empty: "Upload photos to start. Then drag them on the canvas.", name: "Your name", note: "Notes", send: "Send by DM", copied: "Copied! Paste it in the DM and attach your photos.", sel: "Selected photo", none: "Tap a photo on the canvas to edit it.", bg: "Canvas colour", white: "White", sand: "Sand", count: "photos" },
  th: { title: "รูปภาพบนผืนผ้าใบ", sub: "อัปโหลดรูปและจัดวางบนผ้าใบสีขาวเหมือนใน Canva ตั้งขนาดผ้าใบได้ตามต้องการ ย้ายและปรับขนาดแต่ละรูป และตัดเป็นหัวใจ วงกลม หรือสี่เหลี่ยม", size: "ขนาดผ้าใบ", w: "กว้าง (ซม.)", h: "สูง (ซม.)", add: "อัปโหลดรูป", addHint: "เพิ่มได้ไม่จำกัด", shape: "ตัดรูปเป็น", square: "สี่เหลี่ยม", rounded: "มุมมน", circle: "วงกลม", heart: "หัวใจ", zoom: "ซูมในกรอบ", size2: "ขนาดรูป", front: "นำมาไว้ด้านหน้า", del: "ลบรูป", empty: "อัปโหลดรูปเพื่อเริ่ม แล้วลากบนผ้าใบ", name: "ชื่อของคุณ", note: "หมายเหตุ", send: "ส่งทาง DM", copied: "คัดลอกแล้ว วางใน DM และแนบรูป", sel: "รูปที่เลือก", none: "แตะรูปบนผ้าใบเพื่อแก้ไข", bg: "สีผ้าใบ", white: "ขาว", sand: "ทราย", count: "รูป" },
  ru: { title: "Фото на холсте", sub: "Загрузи фото и расположи их на белом холсте, как в Canva. Любой размер холста, двигай и меняй размер каждого фото, вырезай сердцем, кругом или квадратом.", size: "Размер холста", w: "Ширина (см)", h: "Высота (см)", add: "Загрузить фото", addHint: "Можно добавить сколько угодно.", shape: "Вырезать фото как", square: "Квадрат", rounded: "Скруглённый", circle: "Круг", heart: "Сердце", zoom: "Масштаб внутри", size2: "Размер фото", front: "На передний план", del: "Удалить фото", empty: "Загрузи фото, потом перетащи их на холст.", name: "Твоё имя", note: "Пожелания", send: "Отправить в DM", copied: "Скопировано! Вставь в DM и приложи фото.", sel: "Выбранное фото", none: "Нажми на фото на холсте, чтобы изменить.", bg: "Цвет холста", white: "Белый", sand: "Песок", count: "фото" },
};
const L = (k) => (TXT[ui.lang] || TXT.en)[k] || TXT.en[k];
const S = { w: 40, h: 50, bg: "#FFFFFF", bg2: "#C9DDD4", mode: "solid", glit: "", items: [], sel: -1, name: "", note: "" };
const GL = { gold: ["#E6C463", "#C89B2E", "#FFF1C4"], silver: ["#E9EDF0", "#B9C2C8", "#FFFFFF"], pink: ["#F2B6C6", "#D97A97", "#FFE3EA"], blue: ["#9CC3F0", "#4F7FD0", "#E3F0FF"], copper: ["#E8A27C", "#B8693F", "#FFE0CC"] };
const DECOR = ["flower-red", "flower-orange", "flower-yellow", "flower-mint", "flower-teal", "flower-blue", "flower-purple", "flower-plum", "flower-pink", "flower-cream", "dried-lavender", "dried-pink", "dried-wheat", "sm-butterfly-teal", "sm-butterfly-pink", "sm-butterfly-amber", "sm-heart-ruby", "sm-heart-blue", "sm-rose-pink", "sm-rose-red", "sm-sunflower", "sm-ladybug", "sm-bow-pink", "sm-crown-gold", "sm-turtle-pink", "sm-crab-red", "frog", "sea-starfish", "sea-shell-scallop"];
const GRADS = [["#F2B6C6", "#C89B2E"], ["#C9DDD4", "#4F8A9C"], ["#6A4B94", "#D9959C"], ["#1F6BC0", "#E6E0D8"], ["#D9742E", "#B04855"], ["#14151A", "#C89B2E"]];
const PX = 8;   // preview pixels per cm
const esc2 = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const HEART = (cx, cy, s) => { const k = s / 100; const P = [[0, 30], [-5, 8], [-35, 0], [-50, 22], [-50, 50], [0, 100], [50, 50], [50, 22], [35, 0], [5, 8], [0, 30]]; return ""; };
// heart path inside a w x h box at (x, y)
function heartPath(x, y, w, h) {
  const X = (u) => (x + (u / 100) * w).toFixed(1), Y = (v) => (y + (v / 100) * h).toFixed(1);
  return `M${X(50)} ${Y(96)} C${X(8)} ${Y(64)} ${X(-4)} ${Y(30)} ${X(18)} ${Y(12)} C${X(34)} ${Y(-1)} ${X(50)} ${Y(14)} ${X(50)} ${Y(26)} C${X(50)} ${Y(14)} ${X(66)} ${Y(-1)} ${X(82)} ${Y(12)} C${X(104)} ${Y(30)} ${X(92)} ${Y(64)} ${X(50)} ${Y(96)} Z`;
}
function clipFor(it, id) {
  const x = it.x - it.w / 2, y = it.y - it.h / 2;
  if (it.shape === "circle") return `<clipPath id="${id}"><ellipse cx="${it.x}" cy="${it.y}" rx="${it.w / 2}" ry="${it.h / 2}"/></clipPath>`;
  if (it.shape === "heart") return `<clipPath id="${id}"><path d="${heartPath(x, y, it.w, it.h)}"/></clipPath>`;
  return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${it.w}" height="${it.h}" rx="${it.shape === "rounded" ? Math.min(it.w, it.h) * 0.12 : 0}"/></clipPath>`;
}
function cover(it) {   // image rectangle that covers the box, times zoom
  const r = it.nw / it.nh, br = it.w / it.h;
  let iw, ih; if (r > br) { ih = it.h; iw = ih * r; } else { iw = it.w; ih = iw / r; }
  iw *= it.z; ih *= it.z;
  return [it.x - iw / 2, it.y - ih / 2, iw, ih];
}
function svg() {
  const defs = S.items.map((it, i) => it.charm ? "" : clipFor(it, "c" + i)).join("") + `<linearGradient id="cbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${S.bg}"/><stop offset="1" stop-color="${S.bg2}"/></linearGradient>`;
  const glit = S.glit ? (() => { let seed = 9, o = ""; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647), cols = GL[S.glit], n = Math.round(S.w * S.h / 6); for (let k = 0; k < n; k++) { const x = r() * S.w, y = r() * S.h, q = 0.12 + r() * 0.28, a = r() * 6; o += `<polygon points="${[0, 1, 2, 3].map((j) => `${(x + Math.cos(a + j * 1.7) * q * (1 + (j % 2) * 0.6)).toFixed(2)},${(y + Math.sin(a + j * 1.7) * q).toFixed(2)}`).join(" ")}" fill="${cols[k % 3]}" opacity=".85"/>`; } return `<g pointer-events="none">${o}</g>`; })() : "";
  const body = S.items.map((it, i) => { if (it.charm) return `<image class="ph" data-i="${i}" href="${it.url}" x="${it.x - it.w / 2}" y="${it.y - it.h / 2}" width="${it.w}" height="${it.h}" preserveAspectRatio="xMidYMid meet" style="cursor:move;filter:drop-shadow(0 .4px .6px rgba(0,0,0,.35))"/>`; const [ix, iy, iw, ih] = cover(it); return `<g class="ph" data-i="${i}" clip-path="url(#c${i})" style="cursor:move"><image href="${it.url}" x="${ix}" y="${iy}" width="${iw}" height="${ih}" preserveAspectRatio="none"/></g>`; }).join("");
  let sel = "";
  const it = S.items[S.sel];
  if (it) {
    const x = it.x - it.w / 2, y = it.y - it.h / 2;
    const hs = Math.max(S.w, S.h) * 0.018;
    sel = `<rect x="${x}" y="${y}" width="${it.w}" height="${it.h}" fill="none" stroke="#19708A" stroke-width="${hs / 4}" stroke-dasharray="${hs} ${hs / 2}" pointer-events="none"/><rect class="grip" x="${x + it.w - hs}" y="${y + it.h - hs}" width="${hs * 2}" height="${hs * 2}" rx="${hs / 3}" fill="#19708A" stroke="#fff" stroke-width="${hs / 5}" style="cursor:nwse-resize"/>`;
  }
  return `<div class="sz-wrap"><span class="sz-label">${Math.round(S.w)} × ${Math.round(S.h)} cm</span><i class="sz-grip r" data-grip="r"></i><i class="sz-grip b" data-grip="b"></i><i class="sz-grip c" data-grip="c"></i><svg id="cs" viewBox="0 0 ${S.w} ${S.h}" style="width:100%;max-width:${S.w * PX}px;height:auto;touch-action:none;background:${S.mode === 'gradient' ? 'transparent' : S.bg};box-shadow:0 12px 34px rgba(14,63,87,.22);border-radius:4px"><defs>${defs}</defs>${S.mode === "gradient" ? `<rect width="${S.w}" height="${S.h}" fill="url(#cbg)"/>` : ""}${glit}${body}${sel}${S.items.length ? "" : `<text x="${S.w / 2}" y="${S.h / 2}" text-anchor="middle" font-size="${S.w / 32}" fill="#9AA">${esc2(L("empty"))}</text>`}</svg></div>`;
}
const T3 = (en, th, ru) => ({ th, ru }[ui.lang] || en);
function chip(on, attr, label) { return `<button type="button" class="chip ${on ? "on" : ""}" aria-pressed="${on}" ${attr}>${label}</button>`; }
function render() {
  const it = S.items[S.sel];
  const root = document.getElementById("collage");
  root.innerHTML = `<section class="section"><h1>${L("title")}</h1><p class="lead">${L("sub")}</p>
  <div class="cl-grid">
    <div class="cl-stage" id="cl-stage">${svg()}</div>
    <div class="cl-panel">
      <div class="field"><span class="field-label">${L("size")}</span>
        <div class="cm-row"><label class="cm-field"><span>${L("w")}</span><input type="number" min="5" max="300" data-s="w" step="1" value="${S.w}"></label><label class="cm-field"><span>${L("h")}</span><input type="number" min="5" max="300" data-s="h" step="1" value="${S.h}"></label></div>
        <div class="chips">${[[20, 20], [30, 40], [40, 50], [50, 70], [60, 90]].map(([w, h]) => chip(S.w === w && S.h === h, `data-size="${w}x${h}"`, `${w} × ${h}`)).join("")}</div>
        </div>
      <div class="field"><span class="field-label">${T3("Background", "พื้นหลัง", "Фон")}</span>
        <div class="chips">${chip(S.mode === "solid", 'data-mode="solid"', T3("One colour", "สีเดียว", "Один цвет"))}${chip(S.mode === "gradient", 'data-mode="gradient"', T3("Gradient", "ไล่สี", "Градиент"))}</div>
        <div class="swatches">${["#FFFFFF", "#F3E7D3"].concat(CONFIG.colors.map((c) => c.hex)).map((h) => `<button type="button" class="swatch ${S.bg.toLowerCase() === h.toLowerCase() ? "on" : ""}" data-bgc="1.${h}" style="background:${h}"></button>`).join("")}</div>
        ${S.mode === "gradient" ? `<p class="small-note">${T3("Beautiful combinations", "ชุดสีสวยๆ", "Красивые сочетания")}</p><div class="chips">${GRADS.map(([a, b], i) => `<button type="button" class="chip" data-grad="${i}"><span class="dot" style="background:linear-gradient(135deg,${a},${b});width:46px;height:18px;border-radius:9px;display:inline-block"></span></button>`).join("")}</div><p class="small-note">${T3("Second colour", "สีที่สอง", "Второй цвет")}</p><div class="swatches">${["#FFFFFF", "#F3E7D3"].concat(CONFIG.colors.map((c) => c.hex)).map((h) => `<button type="button" class="swatch ${S.bg2.toLowerCase() === h.toLowerCase() ? "on" : ""}" data-bgc="2.${h}" style="background:${h}"></button>`).join("")}</div>` : ""}</div>
      <div class="field"><span class="field-label">${T3("Glitter", "กากเพชร", "Блёстки")}</span><div class="chips">${chip(!S.glit, 'data-glit=""', T3("None", "ไม่มี", "Нет"))}${Object.keys(GL).map((k) => chip(S.glit === k, `data-glit="${k}"`, k[0].toUpperCase() + k.slice(1))).join("")}</div></div>
      <div class="field"><span class="field-label">${T3("Charms and flowers", "ชาร์มและดอกไม้", "Шармы и цветы")}</span><div class="gl-grid">${DECOR.map((id) => { const a = CONFIG.addins.find((x) => x.id === id); return a ? `<button type="button" class="gl" data-charm="${id}" title="${esc2(a.name)}"><span class="gl-img" style="padding:6px;box-sizing:border-box"><img src="${a.img}" alt="" style="object-fit:contain;width:100%;height:100%"></span></button>` : ""; }).join("")}</div><p class="small-note">${T3("They are 3D pieces, so they stand up from the canvas and are not flat.", "เป็นชิ้นงาน 3 มิติ ไม่แบน", "Они объёмные, не плоские.")}</p></div>
      <div class="field"><span class="field-label">${L("add")}</span><input type="file" accept="image/*" multiple id="cl-file"><p class="small-note">${L("addHint")} (${S.items.length} ${L("count")})</p></div>
      <div class="field cl-sel"><span class="field-label">${L("sel")}</span>${it ? `
        ${it.charm ? "" : `<div class="chips">${["square", "rounded", "circle", "heart"].map((s) => chip(it.shape === s, `data-shape="${s}"`, L(s))).join("")}</div>`}
        <label class="cm-field"><span>${L("size2")}</span></label><input type="range" min="3" max="${Math.max(S.w, S.h)}" step="0.5" value="${it.w}" data-psize="1" style="width:100%;accent-color:#19708A">
        ${it.charm ? "" : `<label class="cm-field"><span>${L("zoom")}</span></label><input type="range" min="1" max="4" step="0.05" value="${it.z}" data-pzoom="1" style="width:100%;accent-color:#19708A">`}
        <div class="chips"><button type="button" class="chip" data-front="1">${L("front")}</button><button type="button" class="chip" data-del="1">${L("del")}</button></div>` : `<p class="small-note">${L("none")}</p>`}</div>
      <div class="field"><span class="field-label">${L("name")}</span><input type="text" id="cl-name" value="${esc2(S.name)}"></div>
      <div class="field"><span class="field-label">${L("note")}</span><textarea id="cl-note" rows="2">${esc2(S.note)}</textarea></div>
      <div class="send-row"><a class="btn btn-ink wide" id="cl-send" href="${igLink()}" target="_blank" rel="noopener">${L("send")}</a></div>
    </div></div></section>`;
}
function redrawStage() { document.getElementById("cl-stage").innerHTML = svg(); }
function orderText() {
  const lines = ["Hi Anna! I'd like a photo canvas 💛", "", `Canvas size: ${S.w} × ${S.h} cm`, `Photos: ${S.items.length}`];
  S.items.forEach((it, i) => lines.push(`#${i + 1} ${it.name}${it.charm ? " (3D charm)" : ""}: ${it.charm ? "" : it.shape + ", "}${it.w.toFixed(1)} cm wide, at ${(it.x / S.w * 100).toFixed(0)}% across and ${(it.y / S.h * 100).toFixed(0)}% down`));
  lines.push(`Background: ${S.mode === "gradient" ? "gradient " + S.bg + " to " + S.bg2 : S.bg}`);
  if (S.glit) lines.push("Glitter: " + S.glit);
  if (S.name.trim()) lines.push("Name: " + S.name.trim());
  if (S.note.trim()) lines.push("Notes: " + S.note.trim());
  lines.push("(I'll attach my photos in this chat 📷)");
  return lines.join("\n");
}
function toastMsg(m) { const t = document.getElementById("toast"), x = document.getElementById("toast-text"); if (!t) return; x.textContent = m; t.classList.add("show"); clearTimeout(toastMsg._t); toastMsg._t = setTimeout(() => t.classList.remove("show"), 3200); }
const root = document.getElementById("collage");
root.addEventListener("change", (e) => {
  if (e.target.id === "cl-file") {
    [...e.target.files].forEach((f) => {
      const url = URL.createObjectURL(f), im = new Image();
      im.onload = () => {
        const base = Math.min(S.w, S.h) * 0.45, r = im.naturalWidth / im.naturalHeight;
        const n = S.items.length, w = base, h = base / Math.min(r, 1.6) * (r > 1 ? 1 : 1);
        S.items.push({ url, name: f.name.slice(0, 40), nw: im.naturalWidth, nh: im.naturalHeight, x: S.w / 2 + (n % 3 - 1) * base * 0.35, y: S.h / 2 + (n % 3 - 1) * base * 0.3, w, h: base, shape: "rounded", z: 1 });
        S.sel = S.items.length - 1; render();
      };
      im.src = url;
    });
    e.target.value = "";
  }
});
root.addEventListener("input", (e) => {
  const t = e.target, it = S.items[S.sel];
  if (t.dataset.s) { const v = Math.max(5, Math.min(300, Math.round(Number(t.value) || 0))); if (Number(t.value) >= 5) { S[t.dataset.s] = v; redrawStage(); } }
  else if (t.dataset.psize && it) { const r = it.h / it.w; it.w = Number(t.value); it.h = it.shape === "circle" || it.shape === "heart" ? it.w : it.w * r; redrawStage(); }
  else if (t.dataset.pzoom && it) { it.z = Number(t.value); redrawStage(); }
  else if (t.id === "cl-name") S.name = t.value;
  else if (t.id === "cl-note") S.note = t.value;
});
root.addEventListener("click", (e) => {
  const b = e.target.closest("button"), it = S.items[S.sel];
  if (e.target.closest("#cl-send")) { copyText(orderText()).then(() => toastMsg(L("copied"))).catch(() => {}); return; }
  if (!b) return;
  if (b.dataset.size) { const [w, h] = b.dataset.size.split("x").map(Number); S.w = w; S.h = h; render(); }
  else if (b.dataset.bg) { S.bg = b.dataset.bg; render(); }
  else if (b.dataset.grad) { [S.bg, S.bg2] = GRADS[Number(b.dataset.grad)]; S.mode = "gradient"; render(); }
  else if (b.dataset.mode) { S.mode = b.dataset.mode; render(); }
  else if (b.dataset.bgc) { const [k, h] = b.dataset.bgc.split("."); if (k === "1") S.bg = h; else S.bg2 = h; render(); }
  else if (b.hasAttribute("data-glit")) { S.glit = b.dataset.glit; render(); }
  else if (b.dataset.charm) { const a = CONFIG.addins.find((x) => x.id === b.dataset.charm), im = new Image(); im.onload = () => { const sz = Math.min(S.w, S.h) * 0.16; S.items.push({ charm: true, url: a.img, name: a.name, nw: im.naturalWidth, nh: im.naturalHeight, x: S.w / 2, y: S.h / 2, w: sz, h: sz, shape: "square", z: 1 }); S.sel = S.items.length - 1; render(); }; im.src = a.img; }
  else if (b.dataset.shape && it) { it.shape = b.dataset.shape; if (it.shape === "circle" || it.shape === "heart") it.h = it.w; render(); }
  else if (b.dataset.front && it) { S.items.push(S.items.splice(S.sel, 1)[0]); S.sel = S.items.length - 1; render(); }
  else if (b.dataset.del && it) { URL.revokeObjectURL(it.url); S.items.splice(S.sel, 1); S.sel = -1; render(); }
});
// drag to move, drag the corner to resize
let drag = null;
root.addEventListener("pointerdown", (e) => {
  const svgEl = e.target.closest("#cs"); if (!svgEl) return;
  const pt = (ev) => { const r = svgEl.getBoundingClientRect(); return [(ev.clientX - r.left) / r.width * S.w, (ev.clientY - r.top) / r.height * S.h]; };
  const [px, py] = pt(e);
  if (e.target.classList.contains("grip")) { const it = S.items[S.sel]; drag = { mode: "size", it, svgEl, w0: it.w, h0: it.h, p0: [px, py] }; }
  else {
    const g = e.target.closest(".ph");
    if (!g) { S.sel = -1; render(); return; }
    const i = Number(g.dataset.i), it = S.items[i];
    if (S.sel !== i) { S.sel = i; const keep = document.getElementById("cl-stage"); render(); }
    drag = { mode: "move", it: S.items[i], svgEl: document.getElementById("cs"), d: [px - it.x, py - it.y] };
  }
  e.preventDefault();
});
window.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const svgEl = document.getElementById("cs"), r = svgEl.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width * S.w, py = (e.clientY - r.top) / r.height * S.h, it = drag.it;
  if (drag.mode === "move") { it.x = Math.max(0, Math.min(S.w, px - drag.d[0])); it.y = Math.max(0, Math.min(S.h, py - drag.d[1])); }
  else { const k = Math.max(0.15, 1 + ((px - drag.p0[0]) + (py - drag.p0[1])) / (drag.w0 + drag.h0)); it.w = Math.max(2, drag.w0 * k); it.h = Math.max(2, drag.h0 * k); const sl = document.querySelector("[data-psize]"); if (sl) sl.value = it.w; }
  redrawStage();
});
window.addEventListener("pointerup", () => { drag = null; });
onLangChange && onLangChange(render);
renderChrome();
render();

/* drag the canvas edges to resize; whole centimetres only */
let szDrag = null;
root.addEventListener("pointerdown", (e) => {
  const g = e.target.closest("[data-grip]"); if (!g) return;
  const r = document.getElementById("cs").getBoundingClientRect();
  szDrag = { m: g.dataset.grip, x: e.clientX, y: e.clientY, w: S.w, h: S.h, cmx: S.w / r.width, cmy: S.h / r.height };
  e.preventDefault(); e.stopPropagation();
}, true);
window.addEventListener("pointermove", (e) => {
  if (!szDrag) return;
  const clamp = (v) => Math.max(5, Math.min(300, Math.round(v)));
  if (szDrag.m !== "b") S.w = clamp(szDrag.w + (e.clientX - szDrag.x) * szDrag.cmx);
  if (szDrag.m !== "r") S.h = clamp(szDrag.h + (e.clientY - szDrag.y) * szDrag.cmy);
  const w = document.querySelector("[data-s=w]"), h = document.querySelector("[data-s=h]");
  if (w) w.value = S.w; if (h) h.value = S.h;
  redrawStage();
});
window.addEventListener("pointerup", () => { if (szDrag) { szDrag = null; render(); } });
