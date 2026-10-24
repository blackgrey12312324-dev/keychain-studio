"use strict";

/* =========================================================
   Home page (index.html) and "Send your idea" page (idea.html).
   Photos, presets and reviews come from config.js.
   ========================================================= */
const H = (k, v) => t("home." + k, v);
const I = (k, v) => t("idea." + k, v);

// which real photo shows each style on the home page
const STYLE_PHOTOS = {
  clear: "images/golden-hour.jpg",
  gradient: "images/pink-heartbeat.jpg",
  ink: "images/andaman-bloom.jpg",
  ocean: "images/phuket-shoreline.jpg",
};

/* ---------------- Home ---------------- */
function renderHome() {
  const root = document.getElementById("home");
  if (!root) return;
  const presets = CONFIG.presets;

  const reviews = REVIEWS.length
    ? `<section class="section" id="reviews">
        <div class="wrap">
          <h2>${H("reviewsTitle")}</h2>
          <div class="reviews">${REVIEWS.map((r) => `
            <figure class="review">
              ${r.photo ? `<img src="${esc(r.photo)}" alt="" loading="lazy">` : ""}
              <blockquote>${esc(tr(r, "text"))}</blockquote>
              <figcaption>${esc(r.name)}${r.place ? `, ${esc(r.place)}` : ""}</figcaption>
            </figure>`).join("")}
          </div>
        </div>
      </section>`
    : "";

  root.innerHTML = `
    <section class="hero">
      <div class="hero-text">
        <h1>${H("heroTitle")}</h1>
        <p class="lead">${H("heroText")}</p>
        <div class="btn-row">
          <a class="btn btn-ink" href="design.html?start=1">${H("heroCta")}</a>
          <a class="btn btn-line" href="#shop">${H("heroCta2")}</a>
        </div>
      </div>
    </section>

    <section class="section letters-band" aria-labelledby="letters-h">
      <div class="wrap">
        <div class="section-head">
          <h2 id="letters-h">${H("lettersTitle")}</h2>
          <p>${H("lettersSub")}</p>
        </div>
        <div class="make-grid">${[
          ["Keychains & necklaces", "design.html?cat=keychains", [["Letter keychains (block, groovy)", "design.html?cat=keychains&group=letters"], ["Pendants to wear on a chain", "design.html?cat=keychains&group=pendants"], ["Heart sets for two", "design.html?cat=keychains&group=pendants"], ["Sea shapes", "design.html?cat=keychains&group=sea"]]],
          ["Accessories", "design.html?cat=accessories", [["Bookmarks", "design.html?cat=accessories&group=bookmarks"], ["Hair combs and bun pin", "design.html?cat=accessories&group=combs"], ["Pens", "design.html?cat=accessories&group=pens"]]],
          ["Statues & decor", "design.html?cat=statues", [["Hearts and hexagons", "design.html?cat=statues&group=statues"], ["Word molds", "design.html?cat=statues&group=statues"], ["Games", "design.html?cat=statues&group=statues"]]],
          ["Kitchen & table", "design.html?cat=kitchen", [["Cup stands (single or set of 4)", "design.html?cat=kitchen&group=cups"], ["Serving boards", "design.html?cat=kitchen&group=boards"], ["Trays and wooden bases", "design.html?cat=kitchen&group=boards"]]],
          ["Wooden cutting boards", "canvas.html?kind=board", [["Any size, any shape", "canvas.html?kind=board"], ["Send the size or a picture of the shape", "canvas.html?kind=board"]]],
          ["Paintings", "design.html?cat=paint", [["Sea style", "canvas.html?kind=beach"], ["Abstract", "canvas.html?kind=abstract"], ["Resin on wood", "canvas.html?kind=board"], ["Photo canvas", "canvas.html?kind=photo"], ["Any size, any shape", "design.html?cat=paint"]]],
          ["Custom gifts", "canvas.html?kind=photo", [["Your photo on a canvas", "canvas.html?kind=photo"], ["Photo in a circle or any shape", "canvas.html?kind=photo"]]],
        ].map(([title, href, subs]) => `<div class="make"><h3><a href="${href}">${title}</a></h3><ul class="subs">${subs.map(([x, hr]) => `<li><a href="${hr}">${x}</a></li>`).join("")}</ul><a class="text-link" href="${href}">Open</a></div>`).join("")}
      </div>
    </section>

    <section class="section" id="shop">
      <div class="wrap">
        <div class="section-head">
          <h2>${H("readyTitle")}</h2>
          <p>${H("readySub")}</p>
        </div>
        <div class="products">${presets.map((p) => `
          <article class="product">
            <a class="product-photo" href="design.html?preset=${p.id}"><img src="${p.photo}" alt="${esc(p.name)}" loading="lazy"></a>
            <h3><a href="design.html?preset=${p.id}">${esc(p.name)}</a></h3>
            <p>${esc(tr(p, "blurb"))}</p>
            <a class="text-link" href="design.html?preset=${p.id}">${H("customise")}</a>
          </article>`).join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head"><h2>${H("galleryTitle")}</h2><p>${H("gallerySub")}</p></div>
        <div class="gallery">${["g-saeed", "g-canvas", "g-woodtray", "g-tail", "g-bookmark", "g-plum", "g-paddle", "g-domino", "g-copper", "g-pen", "g-tree", "g-collage"].map((n) => `<img src="images/real/${n}.jpg" alt="" loading="lazy">`).join("")}<video src="images/real/lamp.mp4" poster="images/real/lamp.jpg" autoplay muted loop playsinline></video></div>
      </div>
    </section>

    <section class="section ways">
      <div class="wrap">
        <h2>${H("waysTitle")}</h2>
        <div class="ways-grid">
          <a class="way" href="#shop"><span class="way-n">1</span><h3>${H("way1T")}</h3><p>${H("way1P")}</p><span class="text-link">${H("way1C")}</span></a>
          <a class="way" href="design.html?start=1"><span class="way-n">2</span><h3>${H("way2T")}</h3><p>${H("way2P")}</p><span class="text-link">${H("way2C")}</span></a>
          <a class="way" href="idea.html"><span class="way-n">3</span><h3>${H("way3T")}</h3><p>${H("way3P")}</p><span class="text-link">${H("way3C")}</span></a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <h2>${H("stylesTitle")}</h2>
          <p>${H("stylesSub")}</p>
        </div>
        <div class="styles">${Object.keys(STYLE_PHOTOS).map((s) => `
          <figure class="style-card">
            <img src="${STYLE_PHOTOS[s]}" alt="" loading="lazy">
            <figcaption><strong>${lab("style", s)}</strong><span>${lab("styleText", s)}</span></figcaption>
          </figure>`).join("")}
        </div>
      </div>
    </section>

    <section class="section how">
      <div class="wrap">
        <h2>${H("howTitle")}</h2>
        <ol class="how-steps">
          ${[1, 2, 3, 4].map((n) => `<li><span class="how-n">${n}</span><h3>${H(`how${n}T`)}</h3><p>${H(`how${n}P`)}</p></li>`).join("")}
        </ol>
      </div>
    </section>

    <section class="section story">
      <div class="wrap story-grid">
        <img src="images/andaman-bloom.jpg" alt="" loading="lazy">
        <div>
          <h2>${H("storyTitle")}</h2>
          <p>${H("storyP1")}</p>
          <p>${H("storyP2")}</p>
        </div>
      </div>
    </section>

    ${reviews}

    <section class="section instagram">
      <div class="wrap ig-grid">
        <div>
          <h2>${H("igTitle")}</h2>
          <p>${H("igText")}</p>
          <a class="btn btn-line" href="https://www.instagram.com/${CONFIG.instagram}/" target="_blank" rel="noopener">${H("igCta", { handle: CONFIG.instagram })}</a>
        </div>
        <div class="ig-photos">${presets.slice(0, 4).map((p) =>
          `<a href="https://www.instagram.com/${CONFIG.instagram}/" target="_blank" rel="noopener"><img src="${p.photo}" alt="" loading="lazy"></a>`).join("")}</div>
      </div>
    </section>

    <section class="section faq" id="faq">
      <div class="wrap narrow">
        <h2>${H("faqTitle")}</h2>
        ${[1, 2, 3, 4, 5].map((n) => `<details><summary>${H(`q${n}`)}</summary><p>${H(`a${n}`)}</p></details>`).join("")}
      </div>
    </section>`;
}

/* ---------------- Send your idea ---------------- */
const idea = { photo: "", photoName: "", shape: "letter", letter: "", which: "tag", size: "m", hardware: "ringchain", tassel: "yes", describe: "", colours: "", date: "", name: "" };

function ideaText() {
  const shape = idea.shape === "letter" ? `Letter/number: ${idea.letter || "?"}`
    : idea.shape === "shape" ? `Shape: ${tr(CONFIG.shapes.find((s) => s.id === idea.which), "name", "en")}`
    : "My own shape (from my photo)";
  const size = tr(IDEA.sizes.find((s) => s.id === idea.size), "name", "en");
  const lines = [
    "Hi Anna! I have an idea for a custom keychain.",
    "",
    "Idea: " + (idea.describe.trim() || "(see my photo)"),
    shape,
    "Size: " + size,
    "Chain: " + lab("hardware", idea.hardware, "en"),
    "Tassel: " + (idea.tassel === "yes" ? "Yes" : "No"),
  ];
  if (idea.colours.trim()) lines.push("Colours: " + idea.colours.trim());
  if (idea.date) lines.push("Needed by: " + idea.date);
  if (idea.name.trim()) lines.push("Name: " + idea.name.trim());
  if (idea.photo) lines.push("", "(I'll attach my photo in this chat)");
  if (ui.lang !== "en") lines.push("Language: " + { th: "Thai", ru: "Russian" }[ui.lang]);
  return lines.join("\n");
}

function renderIdea() {
  const root = document.getElementById("idea");
  if (!root) return;
  const opt = (name, val, label, cur) =>
    `<label class="opt"><input type="radio" name="${name}" value="${val}" ${cur === val ? "checked" : ""}><span>${label}</span></label>`;
  root.innerHTML = `
    <div class="idea-grid">
      <div class="idea-photo">
        <label class="drop ${idea.photo ? "has" : ""}">
          <input type="file" accept="image/*" id="idea-file">
          ${idea.photo ? `<img src="${idea.photo}" alt="">` : ""}
          <span class="drop-text"><strong>${idea.photo ? I("photoChange") : I("photoBtn")}</strong><small>${I("photoHint")}</small></span>
        </label>
      </div>
      <form class="idea-form" novalidate>
        <h1>${I("title")}</h1>
        <p class="lead">${I("sub")}</p>
        <p class="price-note">${I("from", { price: money(IDEA.fromPrice) })}</p>

        <label class="field"><span class="field-label">${I("describe")}</span>
          <textarea name="describe" rows="4" placeholder="${esc(I("describePh"))}">${esc(idea.describe)}</textarea></label>

        <fieldset class="field"><legend class="field-label">${I("shape")}</legend>
          <div class="opts">${opt("shape", "letter", I("shapeLetter"), idea.shape)}${opt("shape", "shape", I("shapeShape"), idea.shape)}${opt("shape", "custom", I("shapeCustom"), idea.shape)}</div>
          ${idea.shape === "letter" ? `<label class="sub-field"><span>${I("letterLabel")}</span><input class="letter-input" name="letter" maxlength="2" value="${esc(idea.letter)}" autocomplete="off"></label>` : ""}
          ${idea.shape === "shape" ? `<div class="opts sub-field">${CONFIG.shapes.map((s) => opt("which", s.id, tr(s, "name"), idea.which)).join("")}</div>` : ""}
        </fieldset>

        <fieldset class="field"><legend class="field-label">${I("size")}</legend>
          <div class="opts">${IDEA.sizes.map((s) => opt("size", s.id, tr(s, "name"), idea.size)).join("")}</div>
        </fieldset>

        <fieldset class="field"><legend class="field-label">${I("hardware")}</legend>
          <div class="opts">${Object.keys(I18N.en.labels.hardware).map((h) => opt("hardware", h, lab("hardware", h), idea.hardware)).join("")}</div>
        </fieldset>

        <fieldset class="field"><legend class="field-label">${I("tassel")}</legend>
          <div class="opts">${opt("tassel", "yes", I("tasselYes"), idea.tassel)}${opt("tassel", "no", I("tasselNo"), idea.tassel)}</div>
        </fieldset>

        <label class="field"><span class="field-label">${I("colours")}</span>
          <input name="colours" value="${esc(idea.colours)}" placeholder="${esc(I("coloursPh"))}"></label>
        <div class="field two">
          <label><span class="field-label">${I("date")}</span><input type="date" name="date" value="${esc(idea.date)}"></label>
          <label><span class="field-label">${I("name")}</span><input name="name" value="${esc(idea.name)}" placeholder="${esc(I("namePh"))}"></label>
        </div>

        <p class="form-error" id="idea-error" role="alert"></p>
        <a class="btn btn-ink wide" id="idea-send" href="${igLink()}" target="_blank" rel="noopener">${I("send")}</a>
        <p class="small">${I("note")}</p>

        <details class="message-box"><summary>${I("message")}</summary>
          <textarea readonly id="idea-message" rows="9">${esc(ideaText())}</textarea></details>
      </form>
    </div>`;
}

function bindIdea() {
  const root = document.getElementById("idea");
  if (!root) return;
  root.addEventListener("input", (e) => {
    const el = e.target;
    if (!el.name) return;
    if (el.type === "radio") return;
    idea[el.name] = el.name === "letter" ? el.value.toUpperCase() : el.value;
    if (el.name === "letter") el.value = idea.letter;
    const box = document.getElementById("idea-message");
    if (box) box.value = ideaText();
  });
  root.addEventListener("change", (e) => {
    const el = e.target;
    if (el.type === "radio") {
      idea[el.name] = el.value;
      renderIdea();
    }
    if (el.id === "idea-file" && el.files[0]) {
      if (idea.photo) URL.revokeObjectURL(idea.photo);
      idea.photo = URL.createObjectURL(el.files[0]);
      renderIdea();
    }
  });
  root.addEventListener("click", (e) => {
    const send = e.target.closest("#idea-send");
    if (!send) return;
    const err = document.getElementById("idea-error");
    if (!idea.describe.trim() && !idea.photo) {
      e.preventDefault();
      err.textContent = I("required");
      root.querySelector("textarea[name=describe]").focus();
      return;
    }
    err.textContent = "";
    copyText(ideaText()).then(() => toast(I("copied"))).catch(() => toast(I("copyFail")));
  });
}

let toastTimer;
function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.querySelector("#toast-text").textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
}

/* ---------------- Start ---------------- */
renderChrome();
renderHome();
renderIdea();
bindIdea();
onLangChange(() => { renderHome(); renderIdea(); });
