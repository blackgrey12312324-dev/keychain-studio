"use strict";

/* =========================================================
   ✏️  EDIT HERE — everything Anna can change easily
   Prices are in Thai baht. These are EXAMPLE prices.
   For Thai / Russian words, add name_th / name_ru (or blurb_th...).
   ========================================================= */
const CONFIG = {
  /* ---- Shop details ---- */
  shopName: "Resincraftcode",
  instagram: "resincraftcode",
  facebook: "https://www.facebook.com/search/top?q=Resincraftcode%20Anna",   // ✏️ paste your real Facebook page link

  readyTime: "about 5–7 days",
  readyTime_th: "ประมาณ 5–7 วัน",
  readyTime_ru: "примерно 5–7 дней",
  currency: "฿",
  showPrices: false,   // prices are hidden for now; set to true when Anna is ready

  prices: {
    base: 150,
    secondKeychain: 120,
    style: { clear: 0, gradient: 0, ink: 20, ocean: 40 },
    edge: { none: 0, gold: 20, silver: 20, rose: 20, painted: 20 },
    back: { same: 0, plain: 0, different: 30 },
    hardware: { ring: 0, ringchain: 10, lobster: 15, swivel: 20, carabiner: 20, wristlet: 30 },
    tassel: { none: 0, cotton: 10, silk: 20 },
    ombre: 10,
    paint: 20,                             // if the customer paints on it
    extra: { none: 0, ribbon: 10, pompom: 15, beads: 15, charm: 20 },
  },

  // Anna's real colours
  colors: [
    { name: "Cobalt blue", name_th: "น้ำเงินโคบอลต์", name_ru: "Кобальтовый синий", hex: "#1F4FD1" },
    { name: "Turquoise", name_th: "เทอร์ควอยซ์", name_ru: "Бирюзовый", hex: "#22C1C3" },
    { name: "Aqua", name_th: "ฟ้าน้ำทะเล", name_ru: "Аква", hex: "#9FE7E3" },
    { name: "Navy", name_th: "กรมท่า", name_ru: "Тёмно-синий", hex: "#14213D" },
    { name: "Sky blue", name_th: "ฟ้า", name_ru: "Небесно-голубой", hex: "#A9C8EC" },
    { name: "Lavender", name_th: "ลาเวนเดอร์", name_ru: "Лавандовый", hex: "#B9A6E8" },
    { name: "Purple", name_th: "ม่วง", name_ru: "Фиолетовый", hex: "#6A4C93" },
    { name: "Blush pink", name_th: "ชมพูอ่อน", name_ru: "Нежно-розовый", hex: "#F6A8C4" },
    { name: "Soft pink", name_th: "ชมพูพาสเทล", name_ru: "Пудрово-розовый", hex: "#F3C6DD" },
    { name: "Ruby red", name_th: "แดงทับทิม", name_ru: "Рубиновый", hex: "#D7263D" },
    { name: "Peach", name_th: "พีช", name_ru: "Персиковый", hex: "#F7B89A" },
    { name: "Sunset orange", name_th: "ส้มพระอาทิตย์ตก", name_ru: "Закатный оранжевый", hex: "#FF8C42" },
    { name: "Pale yellow", name_th: "เหลืองอ่อน", name_ru: "Бледно-жёлтый", hex: "#FFF4C2" },
    { name: "Lime", name_th: "เขียวมะนาว", name_ru: "Лаймовый", hex: "#9BD93C" },
    { name: "Mint", name_th: "มิ้นต์", name_ru: "Мятный", hex: "#A8E6CF" },
    { name: "Forest green", name_th: "เขียวป่า", name_ru: "Лесной зелёный", hex: "#2E7D4F" },
    { name: "Gold", name_th: "ทอง", name_ru: "Золотой", hex: "#D4AF37" },
    { name: "Cream", name_th: "ครีม", name_ru: "Кремовый", hex: "#F1E3C6" },
    { name: "Sea foam", name_th: "ฟองทะเล", name_ru: "Морская пена", hex: "#E9FBF8" },
    { name: "Pearl white", name_th: "ขาวมุก", name_ru: "Жемчужно-белый", hex: "#F5F3EE" },
  ],

  palettes: [
    { name: "Sunset", name_th: "พระอาทิตย์ตก", name_ru: "Закат", colors: ["#FF8C42", "#F6A8C4", "#D4AF37"] },
    { name: "Andaman Sea", name_th: "ทะเลอันดามัน", name_ru: "Андаманское море", colors: ["#1F4FD1", "#22C1C3", "#F5F3EE"] },
    { name: "Matcha", name_th: "มัทฉะ", name_ru: "Матча", colors: ["#2E7D4F", "#A8E6CF", "#F5F3EE"] },
    { name: "Galaxy", name_th: "กาแล็กซี", name_ru: "Галактика", colors: ["#14213D", "#6A4C93", "#B9A6E8"] },
  ],

  // Things inside the resin.
  // drag: true = customers can drag each piece around.
  // single: true = only one amount (no "a little / a lot").
  addins: [
    { id: "goldleaf", name: "Gold leaf flakes", name_th: "ทองคำเปลว", name_ru: "Хлопья потали", price: 15, color: "#D4AF37" },
    { id: "hearts", name: "Heart glitter", name_th: "กากเพชรหัวใจ", name_ru: "Глиттер-сердечки", price: 10, color: "#D7263D", drag: true },
    { id: "stars", name: "Star confetti", name_th: "คอนเฟตติดาว", name_ru: "Звёздочки", price: 10, color: "#F5C842", drag: true },
    { id: "frog", name: "Mini frog", name_th: "กบจิ๋ว", name_ru: "Мини-лягушка", price: 20, color: "#9BD93C", drag: true, single: true },
    { id: "starfish", name: "Tiny starfish", name_th: "ปลาดาวจิ๋ว", name_ru: "Морская звёздочка", price: 15, color: "#F1E3C6", drag: true },
    { id: "shells", name: "Mini shells", name_th: "เปลือกหอยจิ๋ว", name_ru: "Мини-ракушки", price: 15, color: "#F7D6C8", drag: true },
    { id: "pearl", name: "Pearls", name_th: "ไข่มุก", name_ru: "Жемчужины", price: 10, color: "#F5F3EE", drag: true },
    { id: "flower-teal", name: "Teal pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/teal.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-magenta", name: "Magenta pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/magenta.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-purple", name: "Purple pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/purple.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-plum", name: "Plum pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/plum.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-cream", name: "Cream pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/cream.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-pink", name: "Pink pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/pink.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-mauve", name: "Mauve pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/mauve.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-mint", name: "Mint pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/mint.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-yellow", name: "Yellow pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/yellow.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-orange", name: "Orange pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/orange.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-red", name: "Red pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/red.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-blue", name: "Blue pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/blue.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "charm-pistol", name: "Gold pistol", price: 0, color: "#D4AF37", drag: true, group: "charms", img: "images/charms/pistol.png", size: 52 },
    { id: "charm-pistol2", name: "Silver pistol", price: 0, color: "#D4AF37", drag: true, group: "charms", img: "images/charms/pistol2.png", size: 52 },
    { id: "charm-ak-long", name: "Long rifle with crystals", price: 0, color: "#D4AF37", drag: true, group: "charms", img: "images/charms/ak-long.png", size: 60 },
    { id: "charm-ak", name: "Rifle with crystals", price: 0, color: "#D4AF37", drag: true, group: "charms", img: "images/charms/ak.png", size: 52 },
    { id: "charm-ak-mini", name: "Mini rifle", price: 0, color: "#D4AF37", drag: true, group: "charms", img: "images/charms/ak-mini.png", size: 44 },
    { id: "charm-m4", name: "M4 rifle", price: 0, color: "#D4AF37", drag: true, group: "charms", img: "images/charms/m4.png", size: 55 },
    { id: "charm-moneybag-mini", name: "Mini money bag", price: 0, color: "#D4AF37", drag: true, group: "charms", img: "images/charms/moneybag-mini.png", size: 29 },
    { id: "charm-moneybag", name: "Money bag", price: 0, color: "#D4AF37", drag: true, group: "charms", img: "images/charms/moneybag.png", size: 36 },
    { id: "charm-dollar", name: "Dollar sign", price: 0, color: "#D4AF37", drag: true, group: "charms", img: "images/charms/dollar.png", size: 31 },
    { id: "charm-dollar-stones", name: "Dollar sign with crystals", price: 0, color: "#D4AF37", drag: true, group: "charms", img: "images/charms/dollar-stones.png", size: 31 },
    { id: "charm-banknote", name: "Banknote", price: 0, color: "#D4AF37", drag: true, group: "charms", img: "images/charms/banknote.png", size: 39 },
    { id: "charm-coin", name: "Coin", price: 0, color: "#D4AF37", drag: true, group: "charms", img: "images/charms/coin.png", size: 29 },
    { id: "glow", name: "Glow in the dark", name_th: "เรืองแสงในที่มืด", name_ru: "Светится в темноте", price: 20, color: "#7CF5E0", single: true },
  ],


  // Crushed glass glitter: real photos of Anna's chips live in images/glitter/<id>.png
  glitters: [
    { id: "clear", name: "Clear" },
    { id: "rainbow", name: "Rainbow mix" },
    { id: "iridescent", name: "Iridescent dark" },
    { id: "black", name: "Black" },
    { id: "gunmetal", name: "Gunmetal" },
    { id: "navy", name: "Navy" },
    { id: "cobalt", name: "Cobalt blue" },
    { id: "aqua", name: "Aqua" },
    { id: "green", name: "Green" },
    { id: "olive", name: "Olive gold" },
    { id: "gold", name: "Gold" },
    { id: "champagne", name: "Champagne" },
    { id: "lightgold", name: "Light gold" },
    { id: "copper", name: "Copper" },
    { id: "rosecopper", name: "Rose copper" },
    { id: "palerose", name: "Pale rose" },
    { id: "pink", name: "Pink" },
    { id: "fuchsia", name: "Fuchsia" },
    { id: "red", name: "Red" },
    { id: "purple", name: "Purple" },
    { id: "plum", name: "Plum" },
  ],

  // Add-ins that don't work with some styles (greyed out, not hidden)
  incompatible: {
    glow: {
      styles: ["ink"],
      why: "Glow is hard to see under thick ink. Try Clear or Colour & glitter.",
      why_th: "เรืองแสงจะมองไม่ค่อยเห็นใต้หมึกเข้ม ลองสไตล์ใสหรือสีและกากเพชร",
      why_ru: "Свечение плохо видно под чернилами. Попробуй прозрачный стиль или градиент.",
    },
  },

  shapes: [
    { id: "tag", name: "Tag", name_th: "แท็ก", name_ru: "Бирка" },
    { id: "heart", name: "Heart", name_th: "หัวใจ", name_ru: "Сердце" },
    { id: "circle", name: "Circle", name_th: "วงกลม", name_ru: "Круг" },
    { id: "star", name: "Star", name_th: "ดาว", name_ru: "Звезда" },
  ],

  // Ready-made designs. To use your real photo: put it in /images and write
  // photo: "images/pink-heartbeat.jpg". If photo is empty, a drawing is shown.
  presets: [
    {
      id: "pink-heartbeat", name: "Pink Heartbeat", photo: "images/pink-heartbeat.jpg",
      blurb: "Pink and red shimmer with heart glitter and gold edges.",
      blurb_th: "ประกายชมพูแดง กากเพชรหัวใจ และขอบทอง",
      blurb_ru: "Розово-красное мерцание, сердечки и золотой край.",
      design: {
        shape: "S", style: "gradient", colors: ["#F5F3EE", "#F6A8C4", "#D7263D"],
        gradient: { direction: "down", glitter: "none" },
        addins: { hearts: { amount: "some", place: "middle", color: "#D7263D" } },
        edge: "gold", back: "same", metal: "gold", hardware: "ringchain",
        tassel: { type: "silk", ombre: true, color1: "#F3C6DD", color2: "#F7B89A", cord: "twist" },
      },
    },
    {
      id: "golden-hour", name: "Golden Hour", photo: "images/golden-hour.jpg",
      blurb: "Crystal clear resin packed with gold leaf.",
      blurb_th: "เรซินใสเต็มไปด้วยทองคำเปลว",
      blurb_ru: "Прозрачная смола, полная потали.",
      design: {
        shape: "O", style: "clear",
        addins: { goldleaf: { amount: "lots", place: "anna", color: "#D4AF37" } },
        edge: "none", metal: "gold", hardware: "ringchain",
        tassel: { type: "silk", ombre: false, color1: "#E9C85A", color2: "#E9C85A", cord: "gold" },
      },
    },
    {
      id: "andaman-bloom", name: "Andaman Bloom", photo: "images/andaman-bloom.jpg",
      blurb: "Pressed flowers flowing into cobalt and turquoise ink.",
      blurb_th: "ดอกไม้แห้งไหลไปสู่หมึกสีน้ำเงินและเทอร์ควอยซ์",
      blurb_ru: "Сухоцветы, перетекающие в синие и бирюзовые чернила.",
      design: {
        shape: "A", style: "ink", colors: ["#1F4FD1", "#22C1C3", "#F5F3EE"],
        ink: { amount: "bold", background: "cloudy", spread: "right", cells: true, shimmer: "none" },
        addins: { "flower-blue": { amount: "some", place: "top", color: "#D4AF37" } },
        edge: "none", back: "different", metal: "silver", hardware: "ring",
        tassel: { type: "cotton", ombre: false, color1: "#A9C8EC", color2: "#A9C8EC", cord: "match" },
      },
    },
    {
      id: "froggy-pond", name: "Froggy Pond", photo: "images/froggy-pond.jpg",
      blurb: "A tiny frog, a dried flower and green shimmer.",
      blurb_th: "กบจิ๋ว ดอกไม้แห้ง และประกายสีเขียว",
      blurb_ru: "Крошечная лягушка, сухоцвет и зелёное мерцание.",
      design: {
        shape: "E", style: "clear",
        addins: {
          frog: { amount: "few", place: "bottom", color: "#9BD93C" },
          "flower-teal": { amount: "few", place: "top", color: "#D4AF37" },
        },
        edge: "painted", edgeColor: "#2BA59A", metal: "silver", hardware: "ringchain",
        tassel: { type: "silk", ombre: true, color1: "#FFF4C2", color2: "#A8E6CF", cord: "match" },
      },
    },
    {
      id: "phuket-shoreline", name: "Phuket Shoreline", photo: "images/phuket-shoreline.jpg",
      blurb: "Blue sea, foamy wave, sand, a tiny starfish and a pearl.",
      blurb_th: "ทะเลสีฟ้า คลื่นฟอง ทราย ปลาดาวจิ๋ว และไข่มุก",
      blurb_ru: "Синее море, пенная волна, песок, морская звёздочка и жемчужина.",
      design: {
        shape: "tag", style: "ocean", colors: ["#1F4FD1", "#22C1C3", "#E9FBF8"],
        ocean: { sand: "middle", wave: "bottom", foam: "frothy", sandColor: "natural" },
        addins: {
          starfish: { amount: "few", place: "bottom", color: "#F1E3C6" },
          pearl: { amount: "few", place: "bottom", color: "#F5F3EE" },
        },
        edge: "none", metal: "gold", hardware: "ringchain",
        tassel: { type: "none", ombre: false, color1: "#A9C8EC", color2: "#A9C8EC", cord: "gold" },
      },
    },
  ],
};

/* =========================================================
   ✏️ REVIEWS — paste your real customer reviews here.
   While this list is empty, the home page shows your Instagram instead.
   Example:
   { name: "Mai", place: "Phuket", text: "So pretty, my friend loved it!", text_th: "", text_ru: "", photo: "images/review-mai.jpg" },
   ========================================================= */
const REVIEWS = [
];

/* =========================================================
   ✏️ "SEND YOUR IDEA" page settings
   ========================================================= */
const IDEA = {
  fromPrice: 200,   // "from ฿200"
  sizes: [
    { id: "s", name: "Small (about 4 cm)", name_th: "เล็ก (ประมาณ 4 ซม.)", name_ru: "Маленький (около 4 см)" },
    { id: "m", name: "Standard (about 5–6 cm)", name_th: "มาตรฐาน (ประมาณ 5–6 ซม.)", name_ru: "Стандартный (около 5–6 см)" },
    { id: "l", name: "Large (about 7–8 cm)", name_th: "ใหญ่ (ประมาณ 7–8 ซม.)", name_ru: "Большой (около 7–8 см)" },
  ],
};

