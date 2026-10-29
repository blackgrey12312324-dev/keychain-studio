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

/* ---------------- Photo slides on the Create custom cards ---------------- */
function slidesFor(n, img) {
  const keys = ["keychains", "accessories", "statues", "kitchen", "cutting", "paint", "gift", "send"];
  const k = keys[n];
  let list = (CONFIG.references && CONFIG.references[k]) || [];
  list = list.map((r) => r.img);
  const first = img.split("|")[0];
  if (k === "keychains") list = ["images/real/g-key-e.jpg", "images/real/g-key-a-star.jpg", "images/real/g-key-k.jpg", "images/phuket-shoreline.jpg", "images/real/g-key-green.jpg", "images/real/g-key-tail.jpg"];
  else list = [first].concat(list.filter((x) => x !== first));
  return list.slice(0, 7).length ? list.slice(0, 7) : [first];
}
function startSlides() {
  document.querySelectorAll(".slides").forEach((el, i) => {
    const n = el.children.length;
    if (n < 2 || el._t) return;
    el.appendChild(el.children[0].cloneNode(true));   // copy of the first photo so it can keep sliding the same way
    let at = 0;
    const mark = () => [...el.children].forEach((im, k) => im.classList.toggle("cur", k === at || (at === n && k === 0 && false)));
    mark();
    el.addEventListener("transitionend", (e) => {
      if (e.target !== el || at < n) return;
      el.style.transition = "none"; at = 0; el.style.transform = "translateX(0)"; mark();
      void el.offsetWidth; el.style.transition = "";
    });
    el._t = setInterval(() => {
      if (document.hidden) return;
      at += 1; el.style.transform = `translateX(-${at * 100}%)`; mark();
    }, 8000 + i * 700);
  });
}
new MutationObserver(() => startSlides()).observe(document.documentElement, { childList: true, subtree: true });

/* ---------------- Shop buy buttons ---------------- */
function buyBtns(id, name, img, section) {
  return `<div class="buy"><button type="button" class="btn btn-line small" data-buy="cart" data-name="${esc(name)}" data-img="${esc(img)}" data-id="${esc(id)}" data-sec="${esc(section)}">${t("shop.addCart", null)}</button><button type="button" class="btn btn-ink small" data-buy="now" data-name="${esc(name)}" data-img="${esc(img)}" data-id="${esc(id)}" data-sec="${esc(section)}">${t("shop.buyNow", null)}</button></div>`;
}
function buyItem(el) {
  const link = el.dataset.sec === "preset" ? `\nOpen the design: ${location.href.split("#")[0].replace(/[^/]*$/, "")}design.html?preset=${el.dataset.id}` : "";
  return { title: el.dataset.name, sub: el.dataset.sec === "preset" ? "Ready-made keychain" : el.dataset.sec, thumb: `<img src="${el.dataset.img}" alt="">`, text: `From the shop (${el.dataset.sec === "preset" ? "Keychains" : el.dataset.sec}): ${el.dataset.name}${link}` };
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-buy]");
  if (!b) return;
  const item = buyItem(b);
  if (b.dataset.buy === "cart") {
    addToCart(item);
    b.textContent = "✓ " + t("shop.added", null);
    setTimeout(() => (b.textContent = t("shop.addCart", null)), 1600);
    document.getElementById("cart-btn").classList.add("bump");
    setTimeout(() => document.getElementById("cart-btn").classList.remove("bump"), 700);
  } else {
    const text = `Hi Anna! I'd like to order 1 piece 💛\n\n#1 ${item.title}\n${item.text}`;
    copyText(text).catch(() => {});
    window.open(igLink(), "_blank", "noopener");
  }
});

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
      <div class="sea" aria-hidden="true">
        <svg class="wave w1" viewBox="0 0 2880 200" preserveAspectRatio="none"><path d="M0 100 C 240 40 480 160 720 100 C 960 40 1200 160 1440 100 C 1680 40 1920 160 2160 100 C 2400 40 2640 160 2880 100 V200 H0 Z"/></svg>
        <svg class="wave w2" viewBox="0 0 2880 200" preserveAspectRatio="none"><path d="M0 120 C 200 60 520 170 720 110 C 940 50 1220 170 1440 120 C 1640 60 1960 170 2160 110 C 2380 50 2660 170 2880 120 V200 H0 Z"/></svg>
        <svg class="wave w3" viewBox="0 0 2880 200" preserveAspectRatio="none"><path d="M0 130 C 260 90 460 170 720 130 C 980 90 1180 170 1440 130 C 1700 90 1900 170 2160 130 C 2420 90 2620 170 2880 130 V200 H0 Z"/></svg>
        <span class="sun"></span>
      </div>
      <div class="hero-text">
        <p class="eyebrow">${H("heroEyebrow")}</p>
        <h1>${H("heroTitle2")}</h1>
        <p class="lead">${H("heroText2")}</p>
        <div class="btn-row">
          <a class="btn btn-ink btn-big" href="design.html?start=1">${H("heroCta")}</a>
          <a class="btn btn-line btn-big" href="#shop">${H("heroCta2")}</a>
        </div>
        <p class="signature">${H("heroSign")}</p>
      </div>
      <div class="hero-strip" aria-hidden="true">${["g-round", "g-bookmark", "g-coaster-sea", "g-canvas", "g-pen-red", "g-domino"].map((n) => `<img src="images/real/${n}.jpg" alt="" loading="lazy">`).join("")}</div>
    </section>

    <section class="section" id="shop">
      <div class="wrap">
        <div class="section-head">
          <h2>${H("readyTitle")}</h2>
          <p>${H("readySub")}</p>
        </div>
        <h3 class="theme-h rec-h" style="margin-top:0">Recommended sea designs</h3>
        <div class="gallery rec">${[["g-fruit-bowl", "Sea fruit bowl"], ["g-tail", "Mermaid tail board"], ["g-canvas", "Sea canvas"], ["g-round", "Sea pour"], ["g-coaster-sea", "Sea cup stands with starfish"], ["g-paddle", "Sea paddle board"], ["g-bookmark", "Sea bookmark with tassel"], ["g-platter", "Sea platter"], ["g-sea-shells", "Sea canvas with shells and starfish"]].map(([n, c]) => `<figure><img src="images/real/${n}.jpg" alt="${c}" loading="lazy"><figcaption><strong>${c}</strong></figcaption>${buyBtns(n, c, "images/real/" + n + ".jpg", "Recommended sea designs")}</figure>`).join("")}</div>
        <div class="themes">${CONFIG.gallery.filter((t) => t.items.length).map((t) => `
          <h3 class="theme-h">${esc(t.theme)}</h3>
          <div class="gallery">${t.theme === "Keychains" ? presets.map((p) => `<figure class="ready"><a href="design.html?preset=${p.id}"><img src="${p.photo}" alt="${esc(p.name)}" loading="lazy"></a><figcaption><strong>${esc(p.name)}</strong><span>${esc(tr(p, "blurb"))}</span></figcaption>${buyBtns(p.id, p.name, p.photo, "preset")}</figure>`).join("") : ""}${t.items.map((it) => it.video
            ? `<figure><video src="${it.video}" poster="${it.poster || ""}" autoplay muted loop playsinline></video><figcaption><strong>${esc(it.cap)}</strong></figcaption>${buyBtns((it.img || it.cap).replace(/\W+/g, "-"), it.cap, it.img || it.poster, t.theme)}</figure>`
            : `<figure><img src="${it.img}" alt="${esc(it.cap)}" loading="lazy"><figcaption><strong>${esc(it.cap)}</strong></figcaption>${buyBtns(it.img.replace(/\W+/g, "-"), it.cap, it.img, t.theme)}</figure>`).join("")}</div>`).join("")}
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
          ["Keychains", "design.html?cat=keychains", "images/phuket-shoreline.jpg|images/real/g-key-tail.jpg", "#134B63", [["Letters", "design.html?cat=keychains&group=letters"], ["Shapes & tags", "design.html?cat=keychains&group=pendants"]]],
          ["Accessories", "design.html?cat=accessories", "images/real/g-bookmark.jpg|images/real/g-pen-blue.jpg", "#E8806C", [["Bookmarks", "design.html?cat=accessories&group=bookmarks"], ["Hair pieces", "design.html?cat=accessories&group=combs"], ["Pens", "design.html?cat=accessories&group=pens"]]],
          ["Games & decor", "design.html?cat=statues", "images/real/g-domino.jpg|images/real/lamp.jpg", "#8C6BB1", [["Domino", "design.html?cat=statues&group=statues"], ["Chess", "design.html?cat=statues&group=statues"]]],
          ["Dining & restaurant", "design.html?cat=kitchen", "images/real/g-coaster-sea.jpg|images/real/g-fruit-bowl.jpg", "#2E8B8B", [["Cup stands", "design.html?cat=kitchen&group=cups"], ["Boards & trays", "design.html?cat=kitchen&group=boards"]]],
          ["Wooden cutting boards", "canvas.html?kind=board", "images/real/g-tail.jpg|images/real/g-paddle.jpg", "#B5803E", [["Custom size", "canvas.html?kind=board"], ["Custom shape", "canvas.html?kind=board"]]],
          ["Any size canvas", "canvas.html?kind=beach", "images/real/g-canvas.jpg|images/real/g-sea-wide.jpg", "#2F5FA8", [["Sea style", "canvas.html?kind=beach"], ["Abstract", "canvas.html?kind=abstract"]]],
          ["Custom gifts", "canvas.html?kind=photo", "images/real/g-collage.jpg|images/real/g-saeed.jpg", "#C45160", [["Your photo, any shape", "canvas.html?kind=photo"], ["Your style, your theme", "canvas.html?kind=photo"]]],
          ["Send us a photo", "idea.html", "images/real/g-saeed.jpg", "#6B7A8F", [["Send a photo, we will tell you if we can make it", "idea.html"], ["Contact us", "idea.html"]]],
        ].map(([title, href, img, col, subs], n) => `<div class="make" id="sec-${["keychains","accessories","statues","kitchen","cutting","paint","gift","send"][n]}" style="--c:${col}"><a class="make-img" href="${href}"><span class="slides" data-n="${slidesFor(n, img).length}">${slidesFor(n, img).map((im) => `<img src="${im}" alt="" loading="lazy">`).join("")}</span></a><div class="make-body"><h3><a href="${href}">${title}</a></h3><div class="chips-row">${subs.map(([x, hr, hl]) => `<a class="pill${hl ? " pill-hl" : ""}" href="${hr}">${x}</a>`).join("")}</div></div></div>`).join("")}
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
        <div class="styles styles-3">${[["Colour", "Pick from 28 epoxy colours, glitter and ink swirls.", "images/pink-heartbeat.jpg"], ["Small pieces inside", "Flowers, shells, charms, gold leaf and tiny letters.", "images/golden-hour.jpg"], ["Your photos", "Custom photos set into resin, in any shape.", "images/real/g-collage.jpg"]].map(([n, d, im]) => `
          <a class="style-card" href="design.html?start=1" style="text-decoration:none;color:inherit">
            <img src="${im}" alt="" loading="lazy">
            <span class="style-cap"><strong>${n}</strong><span>${d}</span></span>
          </a>`).join("")}
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
