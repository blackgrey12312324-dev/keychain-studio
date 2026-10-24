"use strict";

/* =========================================================
   Canvas page (canvas.html): any size, beach style, or your own
   photo cropped into a shape. Drag the photo, zoom, then send by DM.
   ========================================================= */
Object.assign(I18N.en, {
  canvas: {
    backSections: "← Back to sections",
    title: "Design a canvas",
    sub: "Any size. Choose a look from our real pours, or add your own photo and choose the shape it is cut into.",
    kind: "What kind of canvas?", beach: "Sea style", abstract: "Abstract", photo: "Custom gift (my photo)", board: "Wooden cutting board", shapePhoto: "Shape or inspiration picture (optional)", shapeNote: "Type the size above, or upload a picture of the shape you want. Attach the same picture in the Instagram chat.",  colours: "Colours", shuffle: "Different crop", lookLabel: "Choose a look", lookNote: "These are photos of canvases Anna poured. Yours is poured by hand, so it will be similar but never identical. Tell us your colours in the note.", pickSlot: "Colour {n}",
    size: "Size (cm)", width: "Width", height: "Height", presets: "Quick sizes",
    shape: "Cut-out shape", shapes: { circle: "Circle", rect: "Rectangle", rounded: "Rounded", oval: "Oval", heart: "Heart", arch: "Arch", star: "Star" },
    photoLabel: "Your photo", choose: "Choose a photo", change: "Change photo",
    zoom: "Zoom", dragHint: "Drag the photo to move it. Use the slider or scroll to zoom.",
    empty: "Choose a photo to see it here",
    note: "Anything else?", notePh: "Colours, a name, a date, the beach you want…",
    name: "Your name", send: "Send by DM", copied: "Copied! Paste it in the DM and attach your photo.",
    copyFail: "Copy the message below and paste it in the DM.", message: "Your message",
    decor: "Paper flowers and trees", decorHint: "Tap one to add it, then drag it on the picture. Real 3D paper flowers and miniature trees.", flSize: "Flower size", flRemove: "Remove flower",
    boardNote: "Resin on a wooden cutting board, any size, any shape. Tell us the colours and mood you want.",
    beachNote: "Sea style canvases are poured by hand. Pick the look closest to what you want.", abstractNote: "Abstract canvases are poured by hand, so every one is unique. Pick the look closest to what you want.",
  },
});
const C = (k, v) => t("canvas." + k, v);

const SIZES = [[20, 20], [20, 30], [30, 30], [30, 40], [40, 50], [50, 70]];
const SHAPE_IDS = ["circle", "rect", "rounded", "oval", "heart", "arch", "star"];
const cv = { kind: "photo", w: 30, h: 40, shape: "rounded", photo: "", img: null, x: 0, y: 0, zoom: 1, note: "", name: "", decor: [], sel: -1, shapePhoto: "", seed: 3, look: 0 };
const q = new URLSearchParams(location.search);
if (["beach", "abstract", "photo", "board"].includes(q.get("kind"))) cv.kind = q.get("kind");
const OCCASION = (q.get("occasion") || "").slice(0, 40);

function rnd(seed) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
// generated pour: sea (bands, foam wave, sand) or abstract (swirls)
const LOOKS = {
  beach: [["canvas-beach", "Wave and sand"], ["canvas-sea", "Deep sea"], ["sea", "Ocean swirls"]],
  abstract: [["abs-purple", "Purple and gold"], ["abs-green", "Green and gold"], ["abs-plum", "Plum and flowers"], ["abs-copper", "Copper and pearl"]],
};
const ART = {};
function look() { const L = LOOKS[cv.kind]; return L[Math.min(cv.look || 0, L.length - 1)]; }
// real photo of Anna's pour, cropped to the canvas; "New crop" moves the crop
function artSvg(W, H) {
  const id = look()[0], R = rnd(cv.seed), im = ART[id];
  const base = `<rect width="${W}" height="${H}" fill="#223"/>`;
  if (!im) { const i = new Image(); i.onload = () => { ART[id] = i; renderStage(); }; i.src = `images/real/${id}.jpg`; return base; }
  const k = Math.max(W / im.naturalWidth, H / im.naturalHeight) * (1 + R() * 0.25);
  const w = im.naturalWidth * k, h = im.naturalHeight * k;
  return base + `<image href="images/real/${id}.jpg" x="${(-(w - W) * R()).toFixed(1)}" y="${(-(h - H) * R()).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" preserveAspectRatio="none"/>`;
}

/* path of the cut-out inside a W x H canvas (with a margin) */
function framePath(shape, W, H) {
  const m = Math.min(W, H) * 0.08;
  const x = m, y = m, w = W - 2 * m, h = H - 2 * m, cx = W / 2, cy = H / 2;
  switch (shape) {
    case "rect": return `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
    case "circle": { const r = Math.min(w, h) / 2; return `M${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}Z`; }
    case "oval": return `M${x} ${cy}A${w / 2} ${h / 2} 0 1 1 ${x + w} ${cy}A${w / 2} ${h / 2} 0 1 1 ${x} ${cy}Z`;
    case "arch": return `M${x} ${y + h}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}Z`;
    case "heart": {
      const s = Math.min(w, h);
      const ox = cx - s / 2, oy = cy - s / 2;
      const P = (a, b) => `${(ox + (a / 100) * s).toFixed(1)} ${(oy + (b / 100) * s).toFixed(1)}`;
      return `M${P(50, 92)}C${P(10, 62)} ${P(2, 34)} ${P(14, 20)}C${P(28, 4)} ${P(46, 12)} ${P(50, 28)}C${P(54, 12)} ${P(72, 4)} ${P(86, 20)}C${P(98, 34)} ${P(90, 62)} ${P(50, 92)}Z`;
    }
    case "star": {
      const R = Math.min(w, h) / 2, r = R * 0.45;
      let d = "";
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI / 5) * i - Math.PI / 2, rad = i % 2 ? r : R;
        d += (i ? "L" : "M") + (cx + rad * Math.cos(a)).toFixed(1) + " " + (cy + rad * Math.sin(a)).toFixed(1);
      }
      return d + "Z";
    }
    default: { // rounded
      const r = Math.min(w, h) * 0.12;
      return `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
    }
  }
}

function dims() {
  const k = 400 / Math.max(cv.w, cv.h);
  return [Math.round(cv.w * k), Math.round(cv.h * k)];
}

/* base "cover" size of the photo for the frame; zoom multiplies it */
function photoBox(W, H) {
  const im = cv.img;
  const m = Math.min(W, H) * 0.08, fw = W - 2 * m, fh = H - 2 * m;
  const base = Math.max(fw / im.naturalWidth, fh / im.naturalHeight);
  const pw = im.naturalWidth * base * cv.zoom, ph = im.naturalHeight * base * cv.zoom;
  return { pw, ph, x: W / 2 - pw / 2 + cv.x, y: H / 2 - ph / 2 + cv.y };
}

function renderStage() {
  const [W, H] = dims();
  const path = framePath(cv.shape, W, H);
  let inner;
  if (cv.kind === "beach" || cv.kind === "abstract") inner = artSvg(W, H);
  else if (cv.img) {
    const b = photoBox(W, H);
    inner = `<image href="${esc(cv.photo)}" x="${b.x.toFixed(1)}" y="${b.y.toFixed(1)}" width="${b.pw.toFixed(1)}" height="${b.ph.toFixed(1)}" preserveAspectRatio="none"/>`;
  } else {
    inner = `<rect width="${W}" height="${H}" fill="#E7EEF0"/><text x="${W / 2}" y="${H / 2}" text-anchor="middle" font-size="14" fill="#6B7780" font-family="Jost, sans-serif">${esc(C("empty"))}</text>`;
  }
  const dec = cv.decor.map((f, i) => `<image class="decor ${i === cv.sel ? "sel" : ""}" data-i="${i}" href="${CONFIG.paperFlowers.find((x) => x.id === f.id).img || "images/paperflowers/" + f.id + ".png"}" x="${f.x - f.s / 2}" y="${f.y - f.s / 2}" width="${f.s}" height="${f.s}" style="filter:drop-shadow(0 2px 2px rgba(0,0,0,0.35));cursor:move"/>`).join("");
  document.getElementById("cv-stage").innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(C("title"))}">
      <defs><clipPath id="cv-clip"><path d="${path}"/></clipPath></defs>
      <rect width="${W}" height="${H}" fill="${cv.kind === "board" ? "#C8975C" : "#fff"}"/>
      <g clip-path="url(#cv-clip)">${inner}</g>
      <path d="${path}" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>
      ${dec}
    </svg>`;
}

// update the photo in place (rebuilding the SVG would drop the drag)
function moveImage() {
  const el = document.querySelector("#cv-stage image");
  if (!el || !cv.img) return;
  const [W, H] = dims();
  const b = photoBox(W, H);
  el.setAttribute("x", b.x.toFixed(1)); el.setAttribute("y", b.y.toFixed(1));
  el.setAttribute("width", b.pw.toFixed(1)); el.setAttribute("height", b.ph.toFixed(1));
}

function cvText() {
  const lines = ["Hi Anna! I'd like a canvas.", "", `Kind: ${{ abstract: "Abstract", beach: "Sea style", photo: "Custom gift (my photo)", board: "Wooden cutting board" }[cv.kind]}`, `Size: ${cv.w} x ${cv.h} cm`];
  if (OCCASION) lines.splice(3, 0, `Occasion: ${OCCASION}`);
  if (cv.shapePhoto) lines.push("(I'll attach a picture of the shape I want)");
  if (cv.kind === "beach" || cv.kind === "abstract") lines.push("Look: " + look()[1] + " (like the photo in the app)");
  if (cv.kind === "photo") lines.push(`Cut-out shape: ${t("canvas.shapes." + cv.shape, null, "en")}`, cv.photo ? "(I'll attach my photo in this chat)" : "(photo to follow)");
  if (cv.decor.length) lines.push("Paper flowers: " + cv.decor.map((f) => CONFIG.paperFlowers.find((x) => x.id === f.id).name).join(", "));
  if (cv.note.trim()) lines.push("Note: " + cv.note.trim());
  if (cv.name.trim()) lines.push("Name: " + cv.name.trim());
  if (ui.lang !== "en") lines.push("Language: " + { th: "Thai", ru: "Russian" }[ui.lang]);
  return lines.join("\n");
}

function renderCanvas() {
  const root = document.getElementById("canvas");
  if (!root) return;
  const chip = (on, attrs, label) => `<button type="button" class="chip ${on ? "on" : ""}" aria-pressed="${on}" ${attrs}>${label}</button>`;
  root.innerHTML = `
    <div class="canvas-page">
      <div class="cv-stage" id="cv-stage"></div>
      <div class="cv-panel">
        <div><a class="btn btn-line small" href="design.html?start=1" style="margin-bottom:14px">${C("backSections")}</a><h1>${C("title")}</h1><p class="lead">${C("sub")}</p></div>
        <div class="field"><span class="field-label">${C("kind")}</span><div class="chips">
          ${chip(cv.kind === "beach", 'data-kind="beach"', C("beach"))}${chip(cv.kind === "abstract", 'data-kind="abstract"', C("abstract"))}${chip(cv.kind === "photo", 'data-kind="photo"', C("photo"))}${chip(cv.kind === "board", 'data-kind="board"', C("board"))}</div>
          ${OCCASION ? `<p class="small-note"><strong>${OCCASION.replace(/[<>&"]/g, "")}</strong></p>` : ""}${cv.kind === "board" ? `<p class="small-note">${C("boardNote")}</p>` : ""}
          ${cv.kind === "beach" ? `<p class="small-note">${C("beachNote")}</p>` : ""}${cv.kind === "abstract" ? `<p class="small-note">${C("abstractNote")}</p>` : ""}</div>
        <div class="field"><span class="field-label">${C("size")}</span>
          <div class="cv-size">
            <label>${C("width")} <input type="number" min="5" max="200" id="cv-w" value="${cv.w}"></label> ×
            <label>${C("height")} <input type="number" min="5" max="200" id="cv-h" value="${cv.h}"></label>
          </div>
          <div class="chips" style="margin-top:10px">${SIZES.map(([w, h]) => chip(cv.w === w && cv.h === h, `data-size="${w}x${h}"`, `${w}×${h}`)).join("")}</div></div>
        ${cv.kind === "beach" || cv.kind === "abstract" ? `<div class="field"><span class="field-label">${C("lookLabel")}</span>
          <div class="gl-grid">${LOOKS[cv.kind].map(([id, nm], i) => `<button type="button" class="gl ${cv.look === i ? "on" : ""}" data-look="${i}"><span class="gl-img"><img src="images/real/${id}.jpg" alt="" style="object-fit:cover"></span><span class="gl-name">${nm}</span></button>`).join("")}</div>
          <button type="button" class="btn btn-line small" style="margin-top:10px" data-shuffle="1">${C("shuffle")}</button>
          <p class="small-note">${C("lookNote")}</p></div>` : ""}
        ${cv.kind !== "photo" ? `<div class="field"><span class="field-label">${C("shapePhoto")}</span><input type="file" accept="image/*" id="cv-shape">${cv.shapePhoto ? `<img src="${cv.shapePhoto}" alt="" style="max-height:120px;margin-top:8px">` : ""}<p class="small-note">${C("shapeNote")}</p></div>` : ""}
        ${cv.kind === "photo" ? `
        <div class="field"><span class="field-label">${C("shape")}</span><div class="chips">
          ${SHAPE_IDS.map((s) => chip(cv.shape === s, `data-shape="${s}"`, C("shapes." + s))).join("")}</div></div>
        <div class="field"><span class="field-label">${C("photoLabel")}</span>
          <input type="file" accept="image/*" id="cv-file">
          ${cv.img ? `<div class="cv-zoom" style="margin-top:12px"><span>${C("zoom")}</span><input type="range" min="1" max="4" step="0.05" value="${cv.zoom}" id="cv-zoom" aria-label="${C("zoom")}"></div><p class="small-note">${C("dragHint")}</p>` : ""}</div>` : ""}
        <div class="field"><span class="field-label">${C("decor")}</span>
          <div class="gl-grid">${CONFIG.paperFlowers.map((f) => `<button type="button" class="gl" data-addflower="${f.id}" title="${esc(f.name)}"><span class="gl-img"><img src="${f.img || "images/paperflowers/" + f.id + ".png"}" alt=""></span><span class="gl-name">${f.name.replace(" paper", "")}</span></button>`).join("")}</div>
          <p class="small-note">${C("decorHint")}</p>
          ${cv.sel >= 0 && cv.decor[cv.sel] ? `<div class="cv-zoom"><span>${C("flSize")}</span><input type="range" min="30" max="260" step="2" value="${cv.decor[cv.sel].s}" id="cv-fsize" aria-label="${C("flSize")}"><button type="button" class="btn btn-line small" data-delflower="1">${C("flRemove")}</button></div>` : ""}</div>
        <div class="field"><span class="field-label">${C("name")}</span><input type="text" class="text-input" style="width:100%;font-size:1rem;text-transform:none" id="cv-name" value="${esc(cv.name)}"></div>
        <div class="field"><span class="field-label">${C("note")}</span><textarea id="cv-note" placeholder="${esc(C("notePh"))}">${esc(cv.note)}</textarea></div>
        <div class="field"><a class="btn btn-ink wide" id="cv-send" href="${igLink()}" target="_blank" rel="noopener">${C("send")}</a></div>
      </div>
    </div>`;
  renderStage();
}

const cvToast = (msg) => {
  document.getElementById("toast-text").textContent = msg;
  const el = document.getElementById("toast");
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2800);
};

document.addEventListener("click", (e) => {
  const sl = e.target.closest("[data-slot]");
  if (sl) { cv.slot = Number(sl.dataset.slot); renderCanvas(); return; }
  const lk = e.target.closest("[data-look]");
  if (lk) { cv.look = Number(lk.dataset.look); renderCanvas(); return; }
  if (e.target.closest("[data-shuffle]")) { cv.seed = Math.floor(Math.random() * 9999) + 1; renderCanvas(); return; }
  const af = e.target.closest("[data-addflower]");
  if (af) { const [W, H] = dims(); cv.decor.push({ id: af.dataset.addflower, x: Math.round(W / 2), y: Math.round(H / 2), s: Math.round(Math.min(W, H) * 0.3) }); cv.sel = cv.decor.length - 1; renderCanvas(); return; }
  if (e.target.closest("[data-delflower]")) { cv.decor.splice(cv.sel, 1); cv.sel = -1; renderCanvas(); return; }
  const b = e.target.closest("[data-kind],[data-size],[data-shape],#cv-send");
  if (!b) return;
  if (b.id === "cv-send") {
    copyText(cvText()).then(() => cvToast(C("copied"))).catch(() => cvToast(C("copyFail")));
    return;
  }
  if (b.dataset.kind) cv.kind = b.dataset.kind;
  if (b.dataset.size) [cv.w, cv.h] = b.dataset.size.split("x").map(Number);
  if (b.dataset.shape) { cv.shape = b.dataset.shape; cv.x = cv.y = 0; }
  renderCanvas();
});
document.addEventListener("input", (e) => {
  const id = e.target.id;
  if (id === "cv-w" || id === "cv-h") {
    const v = Math.max(5, Math.min(200, Number(e.target.value) || 0));
    if (v >= 5) { cv[id === "cv-w" ? "w" : "h"] = v; renderStage(); }
  } else if (id === "cv-fsize") { cv.decor[cv.sel].s = Number(e.target.value); renderStage(); }
  else if (id === "cv-zoom") { cv.zoom = Number(e.target.value); moveImage(); }
  else if (id === "cv-note") cv.note = e.target.value;
  else if (id === "cv-name") cv.name = e.target.value;
});
document.addEventListener("change", (e) => {
  if (e.target.id === "cv-w" || e.target.id === "cv-h") renderCanvas();
  if (e.target.id === "cv-shape" && e.target.files[0]) { cv.shapePhoto = URL.createObjectURL(e.target.files[0]); renderCanvas(); return; }
  if (e.target.id !== "cv-file" || !e.target.files[0]) return;
  if (cv.photo) URL.revokeObjectURL(cv.photo);
  const url = URL.createObjectURL(e.target.files[0]);
  const im = new Image();
  im.onload = () => { cv.photo = url; cv.img = im; cv.x = cv.y = 0; cv.zoom = 1; renderCanvas(); };
  im.src = url;
});

/* drag the photo, scroll to zoom */
let pan = null;
document.addEventListener("pointerdown", (e) => {
  const svg = e.target.closest("#cv-stage svg");
  if (!svg) return;
  const dc = e.target.closest(".decor");
  if (dc) {
    const i = Number(dc.dataset.i), f = cv.decor[i], k = dims()[0] / svg.getBoundingClientRect().width;
    cv.sel = i;
    pan = { flower: f, sx: e.clientX, sy: e.clientY, ox: f.x, oy: f.y, k };
    document.querySelectorAll("#cv-stage .decor").forEach((el) => el.classList.toggle("sel", el === dc));
    svg.setPointerCapture(e.pointerId);
    return;
  }
  if (!cv.img) return;
  pan = { sx: e.clientX, sy: e.clientY, ox: cv.x, oy: cv.y, k: dims()[0] / svg.getBoundingClientRect().width };
  svg.classList.add("drag");
  svg.setPointerCapture(e.pointerId);
});
document.addEventListener("pointermove", (e) => {
  if (!pan) return;
  if (pan.flower) {
    pan.flower.x = Math.round(pan.ox + (e.clientX - pan.sx) * pan.k);
    pan.flower.y = Math.round(pan.oy + (e.clientY - pan.sy) * pan.k);
    const el = document.querySelector(`#cv-stage .decor[data-i="${cv.sel}"]`);
    if (el) { el.setAttribute("x", pan.flower.x - pan.flower.s / 2); el.setAttribute("y", pan.flower.y - pan.flower.s / 2); }
    return;
  }
  cv.x = pan.ox + (e.clientX - pan.sx) * pan.k;
  cv.y = pan.oy + (e.clientY - pan.sy) * pan.k;
  moveImage();
});
const endPan = () => { const hadFlower = pan && pan.flower; pan = null; if (hadFlower) renderCanvas(); const s = document.querySelector("#cv-stage svg"); if (s) s.classList.remove("drag"); };
document.addEventListener("pointerup", endPan);
document.addEventListener("pointercancel", endPan);
document.addEventListener("wheel", (e) => {
  if (!cv.img || !e.target.closest("#cv-stage")) return;
  e.preventDefault();
  cv.zoom = Math.max(1, Math.min(4, cv.zoom + (e.deltaY < 0 ? 0.1 : -0.1)));
  const z = document.getElementById("cv-zoom");
  if (z) z.value = cv.zoom;
  moveImage();
}, { passive: false });

onLangChange(renderCanvas);
renderChrome();
renderCanvas();
