/* Photos on a canvas: upload any number of photos, set the canvas size, drag, resize and cut each photo (square, rounded, circle, heart). */
const TXT = {
  en: { title: "Photos on a canvas", sub: "Upload your photos and place them on a white canvas, like in Canva. Set any canvas size, move and resize each photo, and cut it into a heart, circle or square.", size: "Canvas size", w: "Width (cm)", h: "Height (cm)", add: "Upload photos", addHint: "You can add as many as you like.", shape: "Cut the photo as", square: "Square", rounded: "Rounded", circle: "Circle", heart: "Heart", zoom: "Zoom inside the cut", size2: "Photo size", front: "Bring to front", del: "Delete photo", empty: "Upload photos to start. Then drag them on the canvas.", name: "Your name", note: "Notes", send: "Send by DM", copied: "Copied! Paste it in the DM and attach your photos.", sel: "Selected photo", none: "Tap a photo on the canvas to edit it.", bg: "Canvas colour", white: "White", sand: "Sand", count: "photos" },
  th: { title: "รูปภาพบนผืนผ้าใบ", sub: "อัปโหลดรูปและจัดวางบนผ้าใบสีขาวเหมือนใน Canva ตั้งขนาดผ้าใบได้ตามต้องการ ย้ายและปรับขนาดแต่ละรูป และตัดเป็นหัวใจ วงกลม หรือสี่เหลี่ยม", size: "ขนาดผ้าใบ", w: "กว้าง (ซม.)", h: "สูง (ซม.)", add: "อัปโหลดรูป", addHint: "เพิ่มได้ไม่จำกัด", shape: "ตัดรูปเป็น", square: "สี่เหลี่ยม", rounded: "มุมมน", circle: "วงกลม", heart: "หัวใจ", zoom: "ซูมในกรอบ", size2: "ขนาดรูป", front: "นำมาไว้ด้านหน้า", del: "ลบรูป", empty: "อัปโหลดรูปเพื่อเริ่ม แล้วลากบนผ้าใบ", name: "ชื่อของคุณ", note: "หมายเหตุ", send: "ส่งทาง DM", copied: "คัดลอกแล้ว วางใน DM และแนบรูป", sel: "รูปที่เลือก", none: "แตะรูปบนผ้าใบเพื่อแก้ไข", bg: "สีผ้าใบ", white: "ขาว", sand: "ทราย", count: "รูป" },
  ru: { title: "Фото на холсте", sub: "Загрузи фото и расположи их на белом холсте, как в Canva. Любой размер холста, двигай и меняй размер каждого фото, вырезай сердцем, кругом или квадратом.", size: "Размер холста", w: "Ширина (см)", h: "Высота (см)", add: "Загрузить фото", addHint: "Можно добавить сколько угодно.", shape: "Вырезать фото как", square: "Квадрат", rounded: "Скруглённый", circle: "Круг", heart: "Сердце", zoom: "Масштаб внутри", size2: "Размер фото", front: "На передний план", del: "Удалить фото", empty: "Загрузи фото, потом перетащи их на холст.", name: "Твоё имя", note: "Пожелания", send: "Отправить в DM", copied: "Скопировано! Вставь в DM и приложи фото.", sel: "Выбранное фото", none: "Нажми на фото на холсте, чтобы изменить.", bg: "Цвет холста", white: "Белый", sand: "Песок", count: "фото" },
};
const L = (k) => (TXT[ui.lang] || TXT.en)[k] || TXT.en[k];
const S = { w: 40, h: 50, bg: "#FFFFFF", items: [], sel: -1, name: "", note: "" };
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
  const defs = S.items.map((it, i) => clipFor(it, "c" + i)).join("");
  const body = S.items.map((it, i) => { const [ix, iy, iw, ih] = cover(it); return `<g class="ph" data-i="${i}" clip-path="url(#c${i})" style="cursor:move"><image href="${it.url}" x="${ix}" y="${iy}" width="${iw}" height="${ih}" preserveAspectRatio="none"/></g>`; }).join("");
  let sel = "";
  const it = S.items[S.sel];
  if (it) {
    const x = it.x - it.w / 2, y = it.y - it.h / 2;
    const hs = Math.max(S.w, S.h) * 0.018;
    sel = `<rect x="${x}" y="${y}" width="${it.w}" height="${it.h}" fill="none" stroke="#19708A" stroke-width="${hs / 4}" stroke-dasharray="${hs} ${hs / 2}" pointer-events="none"/><rect class="grip" x="${x + it.w - hs}" y="${y + it.h - hs}" width="${hs * 2}" height="${hs * 2}" rx="${hs / 3}" fill="#19708A" stroke="#fff" stroke-width="${hs / 5}" style="cursor:nwse-resize"/>`;
  }
  return `<div class="sz-wrap"><span class="sz-label">${Math.round(S.w)} × ${Math.round(S.h)} cm</span><i class="sz-grip r" data-grip="r"></i><i class="sz-grip b" data-grip="b"></i><i class="sz-grip c" data-grip="c"></i><svg id="cs" viewBox="0 0 ${S.w} ${S.h}" style="width:100%;max-width:${S.w * PX}px;height:auto;touch-action:none;background:${S.bg};box-shadow:0 12px 34px rgba(14,63,87,.22);border-radius:4px"><defs>${defs}</defs>${body}${sel}${S.items.length ? "" : `<text x="${S.w / 2}" y="${S.h / 2}" text-anchor="middle" font-size="${S.w / 32}" fill="#9AA">${esc2(L("empty"))}</text>`}</svg></div>`;
}
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
        <div class="chips">${chip(S.bg === "#FFFFFF", 'data-bg="#FFFFFF"', L("white"))}${chip(S.bg === "#F3E7D3", 'data-bg="#F3E7D3"', L("sand"))}</div></div>
      <div class="field"><span class="field-label">${L("add")}</span><input type="file" accept="image/*" multiple id="cl-file"><p class="small-note">${L("addHint")} (${S.items.length} ${L("count")})</p></div>
      <div class="field cl-sel"><span class="field-label">${L("sel")}</span>${it ? `
        <div class="chips">${["square", "rounded", "circle", "heart"].map((s) => chip(it.shape === s, `data-shape="${s}"`, L(s))).join("")}</div>
        <label class="cm-field"><span>${L("size2")}</span></label><input type="range" min="3" max="${Math.max(S.w, S.h)}" step="0.5" value="${it.w}" data-psize="1" style="width:100%;accent-color:#19708A">
        <label class="cm-field"><span>${L("zoom")}</span></label><input type="range" min="1" max="4" step="0.05" value="${it.z}" data-pzoom="1" style="width:100%;accent-color:#19708A">
        <div class="chips"><button type="button" class="chip" data-front="1">${L("front")}</button><button type="button" class="chip" data-del="1">${L("del")}</button></div>` : `<p class="small-note">${L("none")}</p>`}</div>
      <div class="field"><span class="field-label">${L("name")}</span><input type="text" id="cl-name" value="${esc2(S.name)}"></div>
      <div class="field"><span class="field-label">${L("note")}</span><textarea id="cl-note" rows="2">${esc2(S.note)}</textarea></div>
      <div class="send-row"><a class="btn btn-ink wide" id="cl-send" href="${igLink()}" target="_blank" rel="noopener">${L("send")}</a></div>
    </div></div></section>`;
}
function redrawStage() { document.getElementById("cl-stage").innerHTML = svg(); }
function orderText() {
  const lines = ["Hi Anna! I'd like a photo canvas 💛", "", `Canvas size: ${S.w} × ${S.h} cm`, `Photos: ${S.items.length}`];
  S.items.forEach((it, i) => lines.push(`#${i + 1} ${it.name}: ${it.shape}, ${it.w.toFixed(1)} cm wide, at ${(it.x / S.w * 100).toFixed(0)}% across and ${(it.y / S.h * 100).toFixed(0)}% down`));
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
