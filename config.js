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
  showPrices: false,
  showTexture: false,   // inner pattern lines on textured molds (off = clean outline only)   // prices are hidden for now; set to true when Anna is ready

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

  // Anna's real epoxy pigment colours (from her bottles)
  colors: [
    { name: "Royal blue", name_th: "น้ำเงินรอยัล", name_ru: "Королевский синий", hex: "#1F6BC0" },
    { name: "Indigo", name_th: "น้ำเงินคราม", name_ru: "Индиго", hex: "#4A5090" },
    { name: "Steel blue", name_th: "ฟ้าเหล็ก", name_ru: "Стальной синий", hex: "#7F9CC0" },
    { name: "Teal", name_th: "เขียวน้ำทะเล", name_ru: "Морская волна", hex: "#4F8A9C" },
    { name: "Emerald", name_th: "เขียวมรกต", name_ru: "Изумруд", hex: "#4C8A7C" },
    { name: "Deep green", name_th: "เขียวเข้ม", name_ru: "Тёмно-зелёный", hex: "#3A5F55" },
    { name: "Black", name_th: "ดำ", name_ru: "Чёрный", hex: "#14151A" },
    { name: "Graphite", name_th: "เทากราไฟต์", name_ru: "Графит", hex: "#55524F" },
    { name: "Pewter", name_th: "เทาพิวเตอร์", name_ru: "Олово", hex: "#9A9A92" },
    { name: "White pearl", name_th: "ขาวมุก", name_ru: "Белый перламутр", hex: "#E6E0D8" },
    { name: "Champagne rose", name_th: "แชมเปญโรส", name_ru: "Розовое шампанское", hex: "#C9A99A" },
    { name: "Soft pink", name_th: "ชมพูอ่อน", name_ru: "Нежно-розовый", hex: "#D9959C" },
    { name: "Pink", name_th: "ชมพู", name_ru: "Розовый", hex: "#C97080" },
    { name: "Rose red", name_th: "แดงกุหลาบ", name_ru: "Розово-красный", hex: "#B04855" },
    { name: "Magenta", name_th: "แมเจนต้า", name_ru: "Маджента", hex: "#8E3560" },
    { name: "Purple", name_th: "ม่วง", name_ru: "Фиолетовый", hex: "#6A4B94" },
    { name: "Orange", name_th: "ส้ม", name_ru: "Оранжевый", hex: "#D9742E" },
    { name: "Burnt orange", name_th: "ส้มเข้ม", name_ru: "Жжёный оранжевый", hex: "#B5532F" },
    { name: "Copper", name_th: "ทองแดง", name_ru: "Медь", hex: "#B8693F" },
    { name: "Bronze", name_th: "บรอนซ์", name_ru: "Бронза", hex: "#8A5F3C" },
    { name: "Antique gold", name_th: "ทองโบราณ", name_ru: "Старое золото", hex: "#A88A3C" },
    { name: "Gold", name_th: "ทอง", name_ru: "Золото", hex: "#C89B2E" },
  ],

  palettes: [
    { name: "Deep sea", name_th: "ทะเลลึก", name_ru: "Глубокое море", colors: ["#1F6BC0", "#4F8A9C", "#E6E0D8"] },
    { name: "Lagoon", name_th: "ลากูน", name_ru: "Лагуна", colors: ["#4C8A7C", "#4F8A9C", "#E6E0D8"] },
    { name: "Sky", name_th: "ท้องฟ้า", name_ru: "Небо", colors: ["#7F9CC0", "#9A9A92", "#E6E0D8"] },
    { name: "Sunset", name_th: "พระอาทิตย์ตก", name_ru: "Закат", colors: ["#D9742E", "#B04855", "#C89B2E"] },
    { name: "Rose gold", name_th: "โรสโกลด์", name_ru: "Розовое золото", colors: ["#B8693F", "#C9A99A", "#D9959C"] },
    { name: "Blush", name_th: "ชมพูอ่อน", name_ru: "Румянец", colors: ["#D9959C", "#C97080", "#E6E0D8"] },
    { name: "Berry", name_th: "เบอร์รี่", name_ru: "Ягодный", colors: ["#8E3560", "#6A4B94", "#D9959C"] },
    { name: "Midnight", name_th: "เที่ยงคืน", name_ru: "Полночь", colors: ["#14151A", "#4A5090", "#6A4B94"] },
    { name: "Forest", name_th: "ป่า", name_ru: "Лес", colors: ["#3A5F55", "#4C8A7C", "#E6E0D8"] },
    { name: "Black & gold", name_th: "ดำและทอง", name_ru: "Чёрное и золото", colors: ["#14151A", "#C89B2E", "#C9A99A"] },
    { name: "Copper earth", name_th: "ทองแดงดิน", name_ru: "Медная земля", colors: ["#8A5F3C", "#B8693F", "#C9A99A"] },
    { name: "Smoke", name_th: "ควัน", name_ru: "Дымка", colors: ["#55524F", "#9A9A92", "#E6E0D8"] },
    { name: "Autumn", name_th: "ใบไม้ร่วง", name_ru: "Осень", colors: ["#B5532F", "#A88A3C", "#8A5F3C"] },
  ],


  // Things inside the resin.
  // drag: true = customers can drag each piece around.
  // single: true = only one amount (no "a little / a lot").
  addins: [
    { id: "frog", name: "Mini frog", name_th: "กบจิ๋ว", name_ru: "Мини-лягушка", price: 20, color: "#9BD93C", drag: true, single: true, group: "small", img: "images/small/frog-green.png", size: 60, fx: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.35))" },
    { id: "flower-red", name: "Red pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/red.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-orange", name: "Orange pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/orange.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-yellow", name: "Yellow pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/yellow.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-mint", name: "Mint pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/mint.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-teal", name: "Teal pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/teal.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-blue", name: "Blue pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/blue.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-purple", name: "Purple pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/purple.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-plum", name: "Plum pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/plum.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-magenta", name: "Magenta pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/magenta.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-pink", name: "Pink pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/pink.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-mauve", name: "Mauve pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/mauve.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "flower-cream", name: "Cream pressed flower", price: 0, color: "#D4AF37", drag: true, group: "flowers", img: "images/flowers/cream.png", size: 46, fx: "saturate(1.5) brightness(1.4) contrast(1.05) drop-shadow(0 0.6px 0.8px rgba(0,0,0,0.28))" },
    { id: "pf-blue", name: "Blue paper flower", price: 0, color: "#D4AF37", drag: true, group: "paperflowers", img: "images/paperflowers/blue.png", size: 72, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "pf-pink", name: "Pink paper flower", price: 0, color: "#D4AF37", drag: true, group: "paperflowers", img: "images/paperflowers/pink.png", size: 72, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "pf-pink2", name: "Rose pink paper flower", price: 0, color: "#D4AF37", drag: true, group: "paperflowers", img: "images/paperflowers/pink2.png", size: 72, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "pf-magenta", name: "Magenta paper flower", price: 0, color: "#D4AF37", drag: true, group: "paperflowers", img: "images/paperflowers/magenta.png", size: 72, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "pf-magenta2", name: "Fuchsia paper flower", price: 0, color: "#D4AF37", drag: true, group: "paperflowers", img: "images/paperflowers/magenta2.png", size: 72, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "pf-purple", name: "Purple paper flower", price: 0, color: "#D4AF37", drag: true, group: "paperflowers", img: "images/paperflowers/purple.png", size: 72, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "pf-purple2", name: "Lilac paper flower", price: 0, color: "#D4AF37", drag: true, group: "paperflowers", img: "images/paperflowers/purple2.png", size: 72, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "pf-rose", name: "Red paper rose", price: 0, color: "#D4AF37", drag: true, group: "paperflowers", img: "images/paperflowers/rose.png", size: 58, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "pf-rose2", name: "Coral paper rose", price: 0, color: "#D4AF37", drag: true, group: "paperflowers", img: "images/paperflowers/rose2.png", size: 58, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "pf-rose3", name: "Pink-red paper rose", price: 0, color: "#D4AF37", drag: true, group: "paperflowers", img: "images/paperflowers/rose3.png", size: 58, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "pf-whiterose", name: "White paper rose", price: 0, color: "#D4AF37", drag: true, group: "paperflowers", img: "images/paperflowers/whiterose.png", size: 58, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "pf-whiterose2", name: "Ivory paper rose", price: 0, color: "#D4AF37", drag: true, group: "paperflowers", img: "images/paperflowers/whiterose2.png", size: 58, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "pf-whiterose3", name: "Cream paper rose", price: 0, color: "#D4AF37", drag: true, group: "paperflowers", img: "images/paperflowers/whiterose3.png", size: 58, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "dried-lavender", name: "Dried lavender", price: 0, color: "#D4AF37", drag: true, group: "dried", img: "images/dried/lavender.png", size: 100, fx: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.3))" },
    { id: "dried-blue", name: "Blue baby's breath", price: 0, color: "#D4AF37", drag: true, group: "dried", img: "images/dried/blue.png", size: 90, fx: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.3))" },
    { id: "dried-pink", name: "Pink baby's breath", price: 0, color: "#D4AF37", drag: true, group: "dried", img: "images/dried/pink.png", size: 80, fx: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.3))" },
    { id: "dried-wheat", name: "Wheat ear", price: 0, color: "#D4AF37", drag: true, group: "dried", img: "images/dried/wheat.png", size: 90, fx: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.3))" },
    { id: "nat-salak", name: "Snake-fruit pod", price: 0, color: "#8A6A4A", drag: true, single: true, group: "nature", img: "images/nature/salak.png", size: 46, fx: "drop-shadow(0 1px 2px rgba(0,0,0,0.35))" },
    { id: "nat-spruce", name: "Spruce cone", price: 0, color: "#8A6A4A", drag: true, single: true, group: "nature", img: "images/nature/spruce.png", size: 54, fx: "drop-shadow(0 1px 2px rgba(0,0,0,0.35))" },
    { id: "nat-smallcone", name: "Small closed cone", price: 0, color: "#8A6A4A", drag: true, single: true, group: "nature", img: "images/nature/smallcone.png", size: 44, fx: "drop-shadow(0 1px 2px rgba(0,0,0,0.35))" },
    { id: "nat-seed", name: "Round seed pod", price: 0, color: "#8A6A4A", drag: true, single: true, group: "nature", img: "images/nature/seed.png", size: 34, fx: "drop-shadow(0 1px 2px rgba(0,0,0,0.35))" },
    { id: "nat-pinecone", name: "Pine cone", price: 0, color: "#8A6A4A", drag: true, single: true, group: "nature", img: "images/nature/pinecone.png", size: 56, fx: "drop-shadow(0 1px 2px rgba(0,0,0,0.35))" },
    { id: "nat-walnut", name: "Walnut shell", price: 0, color: "#8A6A4A", drag: true, single: true, group: "nature", img: "images/nature/walnut.png", size: 60, fx: "drop-shadow(0 1px 2px rgba(0,0,0,0.35))" },
    { id: "led-light", name: "Mini LED light", price: 0, color: "#FFE9A8", drag: true, single: true, group: "lights", img: "images/lights/led.png", size: 52, fx: "drop-shadow(0 0 6px rgba(255,214,120,0.95)) drop-shadow(0 1px 1.5px rgba(0,0,0,0.3))" },
    { id: "tree-small", name: "Small green tree", price: 0, color: "#D4AF37", drag: true, group: "trees", img: "images/trees/small.png", size: 62, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "silk-yellow", name: "Yellow silk flower", price: 0, color: "#D4AF37", drag: true, group: "paperflowers", img: "images/paperflowers/silk-yellow.png", size: 60, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "silk-lime", name: "Lime silk flower", price: 0, color: "#D4AF37", drag: true, group: "paperflowers", img: "images/paperflowers/silk-lime.png", size: 60, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "tree-pink", name: "Pink blossom tree", price: 0, color: "#D4AF37", drag: true, single: true, group: "trees", img: "images/trees/pink.png", size: 120, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "tree-orange", name: "Autumn orange tree", price: 0, color: "#D4AF37", drag: true, single: true, group: "trees", img: "images/trees/orange.png", size: 120, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "tree-green", name: "Green tree", price: 0, color: "#D4AF37", drag: true, single: true, group: "trees", img: "images/trees/green.png", size: 120, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "tree-yellow", name: "Yellow tree", price: 0, color: "#D4AF37", drag: true, single: true, group: "trees", img: "images/trees/yellow.png", size: 120, fx: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" },
    { id: "charm-pistol", name: "Gold pistol", price: 0, color: "#D4AF37", drag: true, group: "charms", img: "images/charms/pistol.png", size: 52 },
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
  ],


  // Crushed glass glitter: real photos of Anna's chips live in images/glitter/<id>.png
  glitters: [
    { id: "clear", name: "Clear", pal: ["#B9C4C8", "#D6DEE0", "#EEF3F4", "#FFFFFF", "#C6D2D6", "#E4EAEC"] },
    { id: "black", name: "Black", pal: ["#000000", "#000001", "#000002", "#010103", "#020204", "#040407", "#08080A", "#161618", "#39373F"] },
    { id: "gunmetal", name: "Gunmetal", pal: ["#000000", "#000002", "#060409", "#0F0E0E", "#141414", "#181B1D", "#28282A", "#4F514F", "#969995"] },
    { id: "navy", name: "Navy", pal: ["#000203", "#00000F", "#000019", "#03061B", "#00101F", "#03102F", "#161A37", "#2E3952", "#4C5E80"] },
    { id: "cobalt", name: "Cobalt blue", pal: ["#000000", "#000009", "#000413", "#00121C", "#04192B", "#131D3A", "#2E3542", "#686A79", "#AFC3FF"] },
    { id: "aqua", name: "Aqua", pal: ["#000000", "#000408", "#0C1E1B", "#253433", "#3D4A50", "#6F8078", "#C9D8E2", "#FFFFFF", "#FFFFFF"] },
    { id: "green", name: "Green", pal: ["#000000", "#000800", "#0B1509", "#1C2716", "#27371E", "#374A25", "#4E5A43", "#9AA78F", "#F3FFF0"] },
    { id: "olive", name: "Olive gold", pal: ["#000000", "#0B0500", "#241700", "#392E05", "#53440F", "#6D6449", "#B2B3AF", "#FFFFFA", "#FFFFFF"] },
    { id: "gold", name: "Gold", pal: ["#030000", "#1A0300", "#280F0E", "#4B2704", "#5E3615", "#76502A", "#AA854C", "#FFEFCE", "#FFFFFF"] },
    { id: "champagne", name: "Champagne", pal: ["#0F0000", "#27150A", "#402A19", "#503830", "#614D3C", "#7E6853", "#B49F8D", "#FFFFF4", "#FFFFFF"] },
    { id: "lightgold", name: "Light gold", pal: ["#040000", "#1F1100", "#37250B", "#423524", "#504C37", "#837350", "#C8C3B3", "#FFFFFF", "#FFFFFF"] },
    { id: "copper", name: "Copper", pal: ["#000000", "#040000", "#100001", "#270000", "#291303", "#431906", "#57231F", "#8A6A62", "#FFE6D7"] },
    { id: "rosecopper", name: "Rose copper", pal: ["#1B0300", "#3B0800", "#401916", "#4C251F", "#51302A", "#633C32", "#80574F", "#E2BDB1", "#FFFFFF"] },
    { id: "palerose", name: "Pale rose", pal: ["#1F0905", "#381B15", "#47292C", "#543838", "#5E3E4C", "#755F54", "#9F827B", "#FEE1DC", "#FFFFFF"] },
    { id: "pink", name: "Pink", pal: ["#150000", "#270009", "#3C0715", "#4E0F20", "#511F29", "#63273D", "#863C58", "#CD8AA3", "#FFFFFF"] },
    { id: "fuchsia", name: "Fuchsia", pal: ["#110000", "#1E0001", "#29000B", "#310614", "#430714", "#471222", "#5C2230", "#883C6D", "#DE8FA7"] },
    { id: "red", name: "Red", pal: ["#180000", "#280000", "#390004", "#45070C", "#4C1316", "#5E2023", "#8E3032", "#FA7B83", "#FFF6FF"] },
    { id: "purple", name: "Purple", pal: ["#0C000A", "#190119", "#260E20", "#2C192B", "#372031", "#3F2D3A", "#5B374B", "#94577B", "#E8C0E1"] },
    { id: "plum", name: "Plum", pal: ["#000000", "#000000", "#040000", "#060006", "#0B0508", "#240014", "#37202A", "#8A2276", "#B296A5"] },
    // sprinkles that are drawn as tiny shapes instead of photographed chips
    { id: "goldleaf", name: "Gold leaf flakes", name_th: "ทองคำเปลว", name_ru: "Хлопья потали", shape: "flake" },
    { id: "hearts", name: "Heart glitter", name_th: "กากเพชรหัวใจ", name_ru: "Глиттер-сердечки", shape: "heart" },
    { id: "stars", name: "Star confetti", name_th: "คอนเฟตติดาว", name_ru: "Звёздочки", shape: "star" },
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

  // Big 3D paper flowers and roses (for canvases and bigger molds)
  paperFlowers: [
    { id: "nat-salak", name: "Snake-fruit pod", img: "images/nature/salak.png" },
    { id: "nat-spruce", name: "Spruce cone", img: "images/nature/spruce.png" },
    { id: "nat-smallcone", name: "Small closed cone", img: "images/nature/smallcone.png" },
    { id: "nat-seed", name: "Round seed pod", img: "images/nature/seed.png" },
    { id: "nat-pinecone", name: "Pine cone", img: "images/nature/pinecone.png" },
    { id: "nat-walnut", name: "Walnut shell", img: "images/nature/walnut.png" },
    { id: "dried-lavender", name: "Dried lavender", img: "images/dried/lavender.png" },
    { id: "dried-blue", name: "Blue baby's breath", img: "images/dried/blue.png" },
    { id: "dried-pink", name: "Pink baby's breath", img: "images/dried/pink.png" },
    { id: "dried-wheat", name: "Wheat ear", img: "images/dried/wheat.png" },
    { id: "tree-small", name: "Small green tree", img: "images/trees/small.png" },
    { id: "silk-yellow", name: "Yellow silk flower", img: "images/paperflowers/silk-yellow.png" },
    { id: "silk-lime", name: "Lime silk flower", img: "images/paperflowers/silk-lime.png" },
    { id: "tree-pink", name: "Pink blossom tree", img: "images/trees/pink.png" },
    { id: "tree-orange", name: "Autumn orange tree", img: "images/trees/orange.png" },
    { id: "tree-green", name: "Green tree", img: "images/trees/green.png" },
    { id: "tree-yellow", name: "Yellow tree", img: "images/trees/yellow.png" },
    { id: "blue", name: "Blue paper flower" },
    { id: "pink", name: "Pink paper flower" },
    { id: "pink2", name: "Rose pink paper flower" },
    { id: "magenta", name: "Magenta paper flower" },
    { id: "magenta2", name: "Fuchsia paper flower" },
    { id: "purple", name: "Purple paper flower" },
    { id: "purple2", name: "Lilac paper flower" },
    { id: "rose", name: "Red paper rose" },
    { id: "rose2", name: "Coral paper rose" },
    { id: "rose3", name: "Pink-red paper rose" },
    { id: "whiterose", name: "White paper rose" },
    { id: "whiterose2", name: "Ivory paper rose" },
    { id: "whiterose3", name: "Cream paper rose" },
  ],

  // Real tassels (photos in images/tassels). kx = where the knot sits across the picture.
  tassels: [
    { id: "black", name: "Black", hex: "#1A1A1C", kx: 0.42, ratio: 0.406 },
    { id: "navy", name: "Navy", hex: "#1B2A6B", kx: 0.42, ratio: 0.406 },
    { id: "cream", name: "Cream to grey", hex: "#C9C2B0", kx: 0.42, ratio: 0.406 },
    { id: "gold", name: "Gold", hex: "#A98524", kx: 0.42, ratio: 0.406 },
    { id: "teal", name: "Yellow to teal", hex: "#9CC9C0", kx: 0.42, ratio: 0.406 },
    { id: "greyblue", name: "Grey blue", hex: "#8E9BB0", kx: 0.42, ratio: 0.406 },
    { id: "green", name: "Lime green", hex: "#8BE04B", kx: 0.42, ratio: 0.406 },
    { id: "orange", name: "Orange", hex: "#F2561D", kx: 0.42, ratio: 0.406 },
  ],

  shapes: [
    { id: "tag", name: "Tag", name_th: "แท็ก", name_ru: "Бирка" },
    { id: "heart", name: "Heart", name_th: "หัวใจ", name_ru: "Сердце" },
    { id: "circle", name: "Circle", name_th: "วงกลม", name_ru: "Круг" },
    { id: "pick", size: "small", name: "Teardrop", name_th: "หยดน้ำ", name_ru: "Капля", d: "M105 200 C 135 190 165 190 195 200 C 215 206 215 232 205 262 C 195 310 172 372 150 388 C 128 372 105 310 95 262 C 85 232 85 206 105 200 Z", t: 190, b: 388, pin: 205 },
    { id: "oval", name: "Oval tag", size: "small", d: "M160 195 L154.1 195.4 L151 200.5 L138.1 201.3 L125.1 205.2 L110.2 214.2 L104 220.1 L97.7 228.3 L93.8 236.1 L91 247.5 L89.5 326.2 L89.9 335.6 L93 348.2 L101.6 363.1 L112.2 373.2 L118.1 377.2 L126.7 381.1 L144.3 385 L156.5 385 L169.4 382.6 L182.3 377.2 L190.5 371.7 L197.2 365.4 L203.5 356.8 L207 349 L209.4 337.2 L210.5 249.5 L207 233.8 L200.3 222 L194.1 215.4 L179.6 206 L164.7 201.3 L162.7 197 Z", t: 195, b: 385, pin: 195 },
    { id: "square", name: "Rounded square", size: "small", d: "M86.3 206.8 L79.5 216.5 L77.3 224.8 L75.2 318.7 L76.6 328.4 L80.9 337.1 L90.6 345 L96.8 347.1 L104.7 348.2 L194.6 350 L207.6 347.1 L215.8 341.4 L220.9 333.5 L223.4 323.4 L224.8 245 L224.5 225.5 L222.3 217.6 L218 210.8 L214.7 207.6 L207.6 203.2 L196.4 201.1 L103.2 200 L93.2 202.5 Z", t: 200, b: 350, pin: 175 },
    { id: "curved", name: "Curved tag", size: "small", d: "M92 195 C 140 188 160 188 208 195 C 206 235 204 270 218 320 C 232 362 200 392 150 392 C 100 392 68 362 82 320 C 96 270 94 235 92 195 Z", t: 188, b: 392, pin: 205 },
    { id: "halfheart-l", name: "Half heart (left)", size: "small", d: "M150 392 C 60 330 26 270 38 212 C 50 154 122 140 150 196 Z", t: 150, b: 392, pin: 195 },
    { id: "halfheart-r", name: "Half heart (right)", size: "small", d: "M150 196 C 178 140 250 154 262 212 C 274 270 240 330 150 392 Z", t: 150, b: 392, pin: 195 },
    { id: "wing", name: "Wing", size: "small", d: "M150 125 C 218 190 222 330 150 400 C 78 330 82 190 150 125 Z", t: 125, b: 400, pin: 140 },
    { id: "pen", name: "Pen (click style)", size: "small", nohw: true, d: "M143.1 112 L139.3 113.5 L138.8 122.3 L133.4 125.1 L132.5 128.6 L133.8 356.2 L135.7 367.8 L142 390.9 L142 401.9 L143 406.5 L146.8 411 L153 412 L156.9 410.3 L160.3 405.3 L160.9 388.8 L165.2 371.3 L167.5 356.2 L164.5 127.8 L162.8 124.2 L157.6 120.9 L157.4 115 L155.7 112.6 Z", t: 112, b: 412, pin: 112 },
    { id: "blade", name: "Pen (slim, pointed)", size: "small", nohw: true, d: "M146.3 100 L142.8 102.6 L140.9 107.6 L131.2 189.5 L126 258.7 L125.3 312 L127.9 349.9 L135.3 390.7 L141.5 410.8 L145.4 414.7 L150.7 416 L155.6 414.9 L160 410.6 L167.6 381.3 L173.4 342.8 L174.7 297.3 L170.4 230.8 L159.7 142 L153.9 105.4 L150.6 100.7 Z", t: 100, b: 416, pin: 100 },
    { id: "bookmark", name: "Blank bookmark", size: "thin", d: "M136 128 L164 128 Q170 128 170 134 L170 396 Q170 408 158 408 L142 408 Q130 408 130 396 L130 134 Q130 128 136 128 Z", t: 115, b: 410, pin: 125 },
    { id: "bm-paw", name: "Paw bookmark", size: "thin", d: "M157 410 L166.9 406.7 L172.8 401.8 L176.4 396.2 L178.3 388.1 L172.1 168.9 L176.7 161.4 L177.7 152.6 L174.1 141.4 L168.2 134.6 L156.7 128.7 L145.9 128 L137.1 130.6 L130.8 134.6 L123.6 144.4 L121.7 151.6 L122.3 161.7 L127.2 170.9 L126.9 387.4 L130.5 398.2 L136.4 404.8 L146.2 409.3 Z", t: 128, b: 410, pin: 135 },
    { id: "bm-bunny", name: "Bunny bookmark", size: "thin", d: "M164.9 108 L161.6 108.7 L156 114 L150.7 123.9 L148.1 133.3 L146.4 133 L144.9 129.9 L144.2 124.6 L141.1 117.9 L136.8 112.1 L132.2 108.7 L128.6 108.5 L125 110.2 L121.1 116.7 L119.2 124.4 L120.2 138.6 L125.7 158.3 L119.7 170.1 L117.8 183.6 L121.1 194.4 L124 199 L129.3 203.8 L124.7 225.7 L128.6 395.8 L132.7 405.4 L136.8 408.8 L140.4 410 L171.9 408.1 L178.4 403.3 L181.8 395.8 L178.2 226.4 L171.7 202.3 L177.7 196.8 L180.3 192.5 L182 187.2 L182.2 179 L179.6 167.9 L172.1 155.4 L176.2 136.4 L175.5 121 L170.5 110.9 Z", t: 108, b: 410, pin: 120 },
    { id: "bm-cat", name: "Cat bookmark", size: "thin", d: "M162.8 165 L160.7 165.6 L155.6 172.3 L145.4 172.7 L140.9 166.4 L138.3 165 L135 165.4 L132.4 168.1 L126.4 179.9 L124.6 186 L120.3 188.3 L118.5 190.9 L119.7 195.8 L122.2 198.5 L123.4 202.1 L127 205.8 L127.9 210.5 L130.5 212.9 L127.7 225.8 L130.9 397.8 L132.1 402.7 L134 405.7 L138.7 409.2 L142.8 410 L162.8 409.4 L168.1 408.4 L171.5 406.5 L174.2 403.1 L176.4 396.9 L173.6 228.6 L172.7 222.1 L169.5 212.1 L172.1 209.3 L172.9 205.6 L176.4 201.5 L177.2 198 L181.1 193.6 L181.5 191.3 L179.5 188 L175.4 186 L173.8 180.3 L166.6 166.8 Z", t: 165, b: 410, pin: 185 },
    { id: "feather", name: "Feather", size: "thin", d: "M136.7 418 L142.3 414.1 L150.3 391.5 L153.1 388.2 L163.3 382.2 L170.6 369.7 L174.9 355.5 L172.1 340.2 L177.7 330.9 L181.2 318.8 L185 310.8 L186.3 304.6 L186.1 298.1 L188.5 290.8 L188.7 284.9 L186.8 277.8 L187.2 269.9 L185.7 254.1 L186.6 244 L183.5 212.5 L172.8 170.7 L157 137.4 L148.2 124.1 L143.6 119.8 L129.2 112.2 L124.9 112 L120.3 113.9 L115.2 119.3 L113.2 124.9 L111.3 138.5 L113 147.4 L111.9 165 L112.4 189 L114.3 198.9 L114.1 207.7 L115.4 215.9 L113.9 229.1 L115.6 236.9 L114.7 249.6 L118.6 262.5 L120.6 276.8 L119.9 286.9 L122.5 295.9 L122.9 306.3 L126.2 314.5 L127.2 326.1 L133.9 339.3 L133.5 346.2 L131.1 352.2 L130.5 367.3 L136.1 381.1 L136.1 385.2 L128.3 407.2 L127.9 411.7 L130.7 416.7 Z", t: 112, b: 418, pin: 130 },
    { id: "comb", name: "Hair comb (handle)", size: "thin", nohw: true, d: "M139 350 L152.3 349.7 L175.9 346.4 L179.5 343.6 L181.2 338.6 L180.2 294.6 L180.3 246.6 L178.7 242.4 L175.3 239 L168.7 237.8 L162.3 234 L159.3 231 L156.5 226.3 L154.6 218.4 L154.3 200.6 L155.4 200.2 L154.6 199.4 L155.4 188.3 L158.2 174.3 L161 166.6 L162.7 157.5 L163.8 156.3 L163 155.6 L161.8 147.4 L160.3 146.7 L159 143.7 L157.8 143.4 L155.4 140.2 L152.3 139.7 L150.9 137.8 L141.2 137 L133.4 138.7 L125.5 143.9 L122.5 147.8 L120.4 152.4 L119 159.7 L122.6 209 L122.2 229.2 L119.7 258.2 L118.8 283 L120.8 328.3 L122.5 337.1 L125.8 343.1 L131.2 347.5 Z", t: 137, b: 350, pin: 137 },
    { id: "comb-moon", name: "Half-moon comb", size: "thin", d: "M26 280.4 L25.7 295.9 L28.7 313.4 L31.3 318.8 L33.7 320.9 L37 322 L263.1 322 L268 320 L270.4 316.4 L273.1 305.7 L274.3 294.4 L274 279.6 L271.6 270.3 L265.3 260.5 L256.2 253.6 L239.3 245.3 L220.8 239.1 L199.8 234.9 L176.9 232.5 L149.3 232 L114.3 234.6 L89.5 238.8 L69.3 244.5 L51.3 251.7 L37.5 259.6 L30.1 268.3 Z", t: 232, b: 322, pin: 240, nohw: true },
    { id: "tray-oval", name: "Oval tray", size: "big", d: "M146.6 115 L126.9 118.1 L115.4 122.6 L106.4 127.9 L92.3 141.4 L82.2 159.7 L78.8 172.7 L77.1 188.4 L75.4 305.8 L77.1 330.2 L81.1 350.8 L87.3 365.7 L93.5 374.7 L103.9 384.5 L119.3 393.5 L135.9 398.6 L152.8 400 L173.4 396.3 L188 389.6 L201.5 378.6 L212.2 364 L218.9 348 L222.9 329.4 L224.6 305.2 L224.6 257.6 L220.6 189.6 L215.8 166.2 L209.4 151 L198.1 135.8 L184 124.8 L164.6 117 Z", t: 115, b: 400, pin: 120 },
    { id: "board", name: "Serving board", size: "medium", d: "M172.3 112 L141.8 115.2 L138.6 117.1 L137.8 122.3 L140.7 157.7 L138.4 164.2 L133.4 169.3 L128.3 171.1 L122 171.1 L103.5 165.7 L98.9 165.5 L93.6 167.6 L89.6 173.5 L85 391.1 L87.7 398.9 L95.1 404.8 L202.4 405 L209.4 401.8 L212.9 397.6 L215 392.4 L212.3 306.1 L211 197.7 L209.1 191.8 L206 188 L200.9 185.5 L183.5 181.9 L178 178.5 L173.2 172.4 L170.6 160.2 L175.5 115.8 Z", t: 112, b: 405, pin: 125 },
    { id: "tray-rect", name: "Rectangle tray (cut corners)", size: "big", d: "M60 205 H240 L262 227 V353 L240 375 H60 L38 353 V227 Z", t: 205, b: 375, pin: 200 },
    { id: "frame-oval", name: "Picture in the oval frame", size: "big", custom: true, d: "M30 262 A120 95 0 1 0 270 262 A120 95 0 1 0 30 262Z", t: 167, b: 357, pin: 167 },
    { id: "tray-tall", name: "Large rectangle tray", size: "big", custom: true, d: "M81.7 140 L218.3 140 L218.3 395 L81.7 395 Z", t: 140, b: 395, pin: 140 },
    { id: "game-ttt", name: "Tic-tac-toe board", size: "thin", d: "M70 160 H230 Q242 160 242 172 V328 Q242 340 230 340 H70 Q58 340 58 328 V172 Q58 160 70 160 Z", t: 160, b: 340, pin: 160, grid: { x0: 64, y0: 166, x1: 236, y1: 334, n: 3 } },
    { id: "game-chess", name: "Chess board", size: "thin", d: "M48 180 H252 V384 H48 Z", t: 180, b: 384, pin: 180, grid: { x0: 54, y0: 186, x1: 246, y1: 378, n: 8 } },
    { id: "coaster", name: "Cup stand", size: "medium", nohw: true, d: "M146.4 162 L131.1 163.8 L109.6 171 L93.8 180 L77.6 194.4 L66.9 208.7 L57.9 227.2 L52.5 247.8 L51.6 265.4 L55.2 288.7 L62.4 307.6 L72.2 323.3 L85.7 338.2 L101.9 349.9 L117.6 357.1 L137.4 361.6 L154.5 362 L174.3 358.9 L193.6 351.7 L208.4 342.7 L223.3 329.2 L234 314.8 L243.9 293.7 L248 274.8 L248.4 253.7 L243.9 231.7 L235.8 212.8 L224.2 195.7 L213.8 185.4 L203 177.3 L185.1 168.3 L164.4 162.9 Z", t: 162, b: 362, pin: 162 },
    { id: "wood-slice", name: "Wood slice", size: "medium", wood: "slice", d: "M101.2 168.8 L82.9 179.3 L63.3 201.2 L60.7 207 L57.7 208.7 L50.9 221.7 L50.5 224.7 L48.6 226.6 L46 234.2 L44 254.4 L46.3 260.9 L46.6 265.8 L54.8 281.2 L66.9 295.2 L86.1 308.6 L102.8 322.3 L111.9 332.1 L116.8 340.6 L121.4 343.3 L124 349.8 L126.6 352.4 L134.8 355.3 L139.7 360.2 L146.2 363.8 L157.3 366.4 L166.2 371.3 L176 372 L192.3 368.7 L217.5 359.3 L226.3 353.4 L239.7 338 L247.5 317.8 L253.1 312.5 L253.4 309.3 L254.4 308.6 L252.1 299.2 L256 292 L254.4 286.1 L253.7 261.3 L252.1 257.3 L252.7 251.1 L251.4 243.3 L249.1 238.1 L248.8 232.8 L247.2 231.2 L246.5 226 L243.3 221.4 L242.6 217.5 L240 214.6 L237.7 207.7 L234.1 203.4 L233.5 200.5 L230.2 197.9 L227.6 193 L215.8 181.2 L213.9 180.9 L210.9 177.3 L201.4 170.8 L193 168.2 L186.1 167.5 L184.1 166.2 L177.6 166.2 L170.7 164.2 L162.9 164.6 L158 163.6 L157.7 162.3 L147.9 160.3 L130.9 160 L119.1 162.3 Z", t: 160, b: 372, pin: 165 },
    { id: "wood-round", name: "Round wooden board", size: "medium", wood: "teak", d: "M144.8 128 L128 131.6 L122.7 135.5 L119.8 141.9 L120.9 177 L117.7 187 L110.9 194.8 L96.6 203.8 L82.6 214.9 L70.1 228.8 L61.9 241.7 L51.9 268.1 L49.4 283.1 L49 297.1 L51.2 314.9 L57.6 334.6 L68.3 352.8 L81.2 367.5 L96.9 379.6 L114.1 388.2 L131.2 393.2 L150.5 395 L171.6 392.9 L193.4 385.3 L210.6 375 L224.9 361.8 L236.3 346.4 L244.9 328.9 L249.9 309.9 L251 292.8 L249.9 278.5 L245.6 260.2 L233.5 234.2 L215.6 213.4 L189.1 194.8 L181.3 185.2 L178.8 175.5 L179.1 148 L177.7 137.3 L174.1 133 L164.8 129.4 Z", t: 128, b: 395, pin: 140 },
    { id: "wood-tray", name: "Bamboo tray", size: "big", wood: "tray", d: "M73.5 150 L226.5 150 L226.5 400 L73.5 400 Z", t: 150, b: 400, pin: 150 },
    { id: "heartset", name: "Best-friend heart set (2 halves)", size: "small", d: "M142 392 C52 330 18 270 30 212 C42 154 114 140 142 196 L142 248 C158 248 158 278 142 278 Z M158 196 C186 140 258 154 270 212 C282 270 248 330 158 392 L158 278 C172 278 172 248 158 248 Z", t: 150, b: 392, pin: 190 },
    { id: "g-starfish", name: "Starfish", size: "small", mold: "groovy", d: "M132.4 183.7 Q150 144 167.6 183.7 Q185.3 223.5 228.5 228 Q271.7 232.4 239.4 261.5 Q207.1 290.5 216.1 333 Q225.2 375.6 187.6 353.8 Q150 332 112.4 353.8 Q74.8 375.6 83.9 333 Q92.9 290.5 60.6 261.5 Q28.3 232.4 71.5 228 Q114.7 223.5 132.4 183.7 Z", t: 142, b: 402, pin: 158 },
    { id: "g-shell", name: "Scallop shell", size: "small", mold: "groovy", d: "M150 396 L 23.2 300.2 Q3.8 265.6 40.8 251.3 Q36.7 211.8 76.3 213.3 Q88.2 175.5 124 192.7 Q150 162.7 176 192.7 Q211.8 175.5 223.7 213.3 Q263.3 211.8 259.2 251.3 Q296.2 265.6 276.8 300.2 Z", t: 142, b: 396, pin: 158 },
    { id: "g-paw", name: "Paw print", size: "small", mold: "groovy", d: "M65.7 281.2 L73.5 287.4 L73.7 289.5 L68.8 300.5 L66.3 312.0 L66.0 318.1 L67.3 329.7 L68.9 335.7 L73.9 346.8 L81.1 356.9 L85.7 361.8 L96.1 370.1 L107.9 376.9 L114.6 379.6 L128.3 383.7 L142.7 385.7 L157.3 385.7 L171.7 383.7 L178.8 381.9 L192.1 376.9 L198.2 373.7 L209.3 366.1 L218.9 356.9 L222.8 351.9 L228.9 341.3 L232.7 329.9 L234.0 317.9 L232.7 306.1 L231.1 300.3 L226.2 288.3 L227.2 286.4 L234.3 281.2 L239.1 276.3 L244.8 267.8 L247.6 261.4 L249.6 254.8 L250.5 247.9 L250.5 241.3 L248.7 232.2 L246.3 226.7 L243.0 222.0 L239.0 218.3 L234.3 215.5 L226.3 213.4 L220.7 213.6 L212.5 215.7 L210.1 214.7 L209.3 212.8 L210.3 202.9 L209.9 195.5 L207.6 185.1 L204.9 178.9 L201.5 173.5 L197.3 169.2 L192.6 165.9 L187.5 163.9 L182.2 163.2 L176.8 163.8 L171.4 165.6 L166.2 168.7 L161.6 172.8 L157.3 178.1 L152.4 186.7 L149.9 188.0 L147.6 186.7 L142.7 178.1 L138.5 172.9 L131.2 167.0 L126.0 164.5 L120.5 163.3 L112.3 164.0 L104.9 167.4 L100.5 171.2 L96.7 176.1 L93.7 181.9 L91.4 188.5 L90.1 195.5 L89.7 202.9 L90.7 212.8 L89.9 214.7 L87.5 215.7 L79.3 213.6 L73.7 213.4 L65.7 215.5 L61.0 218.3 L57.0 222.0 L53.7 226.7 L51.3 232.2 L49.5 241.3 L49.5 247.9 L50.4 254.8 L52.4 261.4 L55.2 267.8 L60.9 276.3 Z", t: 163, b: 385, pin: 188 },
    { id: "g-tail", name: "Mermaid tail", size: "small", mold: "groovy", d: "M150 142 C 163 142 172 152 172 178 C 172 218 186 246 214 270 C 244 296 266 322 262 352 C 260 366 246 368 232 358 C 208 342 176 338 150 354 C 124 338 92 342 68 358 C 54 368 40 366 38 352 C 34 322 56 296 86 270 C 114 246 128 218 128 178 C 128 152 137 142 150 142 Z", t: 142, b: 368, pin: 158 },
    { id: "g-jelly", name: "Jellyfish", size: "small", mold: "groovy", d: "M62 266 C 62 184 100 142 150 142 C 200 142 238 184 238 266 C 238 276 226 280 218 276 L 222 282 L 222 362 Q 208 376 194 362 L 194 282 L 193 282 L 193 384 Q 179 398 165 384 L 165 282 L 164 282 L 164 370 Q 150 384 136 370 L 136 282 L 135 282 L 135 384 Q 121 398 107 384 L 107 282 L 106 282 L 106 358 Q 92 372 78 358 L 78 282 L 62 266 Z", t: 142, b: 396, pin: 158 },
    { id: "g-dolphin", name: "Dolphin", size: "small", mold: "groovy", d: "M52 214 C 60 188 92 168 128 160 C 142 142 160 138 168 150 C 175 160 168 168 178 172 C 214 184 238 218 236 262 C 234 300 214 330 200 352 C 232 346 258 358 262 382 C 232 380 206 372 190 378 C 170 392 150 392 140 380 C 140 340 146 300 126 270 C 108 246 84 244 66 238 C 54 234 50 224 52 214 Z", t: 138, b: 394, pin: 154 },
    { id: "bm-glass1", name: "Shattered glass bookmark (fine)", size: "thin", texImg: "glass1", tex: "glass", seed: 11, d: "M130 125 V400 Q130 410 140 410 H160 Q170 410 170 400 V125 Q170 115 160 115 H140 Q130 115 130 125Z", t: 115, b: 410, pin: 115 },
    { id: "bm-glass2", name: "Shattered glass bookmark (large)", size: "thin", texImg: "glass2", tex: "glass", seed: 29, d: "M130 125 V400 Q130 410 140 410 H160 Q170 410 170 400 V125 Q170 115 160 115 H140 Q130 115 130 125Z", t: 115, b: 410, pin: 115 },
    { id: "bm-pebbles", name: "Pebbles bookmark", size: "thin", texImg: "pebbles", tex: "pebbles", seed: 5, d: "M130 125 V400 Q130 410 140 410 H160 Q170 410 170 400 V125 Q170 115 160 115 H140 Q130 115 130 125Z", t: 115, b: 410, pin: 115 },
    { id: "bm-hearts", name: "Hearts bookmark", size: "thin", texImg: "hearts", tex: "hearts", seed: 8, d: "M130 125 V400 Q130 410 140 410 H160 Q170 410 170 400 V125 Q170 115 160 115 H140 Q130 115 130 125Z", t: 115, b: 410, pin: 115 },
    { id: "bm-paws", name: "Paws and bones bookmark", size: "thin", texImg: "paws", tex: "paws", seed: 3, d: "M130 125 V400 Q130 410 140 410 H160 Q170 410 170 400 V125 Q170 115 160 115 H140 Q130 115 130 125Z", t: 115, b: 410, pin: 115 },
    { id: "hairpin", name: "Butterfly bun pin", size: "thin", nohw: true, d: "M105.4 110.9 L90.7 117.2 L87 121.9 L87.3 127.7 L101.2 148.9 L111.4 160.5 L121.4 167.1 L134 171 L134.3 180.7 L136.9 188.1 L149.2 200.9 L156.6 205.4 L159.2 209.3 L161.5 228.7 L163.1 232.4 L167.6 235.8 L172.6 235.8 L176.5 232.9 L178.1 230.1 L178.6 217.7 L184.9 215.9 L187.5 220.3 L189.6 361 L185.7 375.2 L185.2 386.5 L186.7 399.6 L189.9 410.9 L194.6 417 L200.7 418 L206.7 413.3 L208.5 403 L210.1 346.3 L209.1 248.4 L213 198.3 L212.7 182.3 L209.6 167.6 L202.2 150 L192.8 135.8 L181.8 124 L168.1 112.7 L163.1 111.7 L158.4 116.4 L156.6 116.4 L145.5 111.1 L131.1 108 L116.4 108.5 Z", t: 108, b: 418, pin: 130 },
    { id: "coaster-set", name: "Cup stand set (4 + holder)", size: "medium", nohw: true, set: 4, d: "M40 212 A52 52 0 1 0 144 212 A52 52 0 1 0 40 212Z M156 212 A52 52 0 1 0 260 212 A52 52 0 1 0 156 212Z M40 330 A52 52 0 1 0 144 330 A52 52 0 1 0 40 330Z M156 330 A52 52 0 1 0 260 330 A52 52 0 1 0 156 330Z", t: 160, b: 382, pin: 160 },
    { id: "coaster-stone", name: "Cup stand with stone pattern", size: "medium", nohw: true, tex: "stones", seed: 4, d: "M50 262 A100 100 0 1 0 250 262 A100 100 0 1 0 50 262Z", t: 162, b: 362, pin: 162 },
    { id: "wood-coaster", name: "Wooden cup stand", size: "medium", nohw: true, wood: "slice", d: "M101.2 168.8 L82.9 179.3 L63.3 201.2 L60.7 207 L57.7 208.7 L50.9 221.7 L50.5 224.7 L48.6 226.6 L46 234.2 L44 254.4 L46.3 260.9 L46.6 265.8 L54.8 281.2 L66.9 295.2 L86.1 308.6 L102.8 322.3 L111.9 332.1 L116.8 340.6 L121.4 343.3 L124 349.8 L126.6 352.4 L134.8 355.3 L139.7 360.2 L146.2 363.8 L157.3 366.4 L166.2 371.3 L176 372 L192.3 368.7 L217.5 359.3 L226.3 353.4 L239.7 338 L247.5 317.8 L253.1 312.5 L253.4 309.3 L254.4 308.6 L252.1 299.2 L256 292 L254.4 286.1 L253.7 261.3 L252.1 257.3 L252.7 251.1 L251.4 243.3 L249.1 238.1 L248.8 232.8 L247.2 231.2 L246.5 226 L243.3 221.4 L242.6 217.5 L240 214.6 L237.7 207.7 L234.1 203.4 L233.5 200.5 L230.2 197.9 L227.6 193 L215.8 181.2 L213.9 180.9 L210.9 177.3 L201.4 170.8 L193 168.2 L186.1 167.5 L184.1 166.2 L177.6 166.2 L170.7 164.2 L162.9 164.6 L158 163.6 L157.7 162.3 L147.9 160.3 L130.9 160 L119.1 162.3 Z", t: 160, b: 372, pin: 165 },
    { id: "tray-round", name: "Circular epoxy tray", size: "big", d: "M30 262 A120 120 0 1 0 270 262 A120 120 0 1 0 30 262 Z", t: 142, b: 382, pin: 142 },
    { id: "soap", name: "Soap dish", size: "medium", nohw: true, d: "M25.7 214.2 L25 352.9 L45.8 375.1 L49.8 376.6 L251.6 375.5 L254.6 374.4 L274.6 353.6 L275 217.1 L273.9 214.2 L254.2 194.9 L249.8 193.8 L48 193.4 Z", t: 193, b: 377, pin: 193 },
    { id: "light-holder", name: "Light holder", size: "medium", nohw: true, d: "M203 200.7 L198.6 199 L171.7 199.4 L164.6 202.1 L159.5 206.5 L156.1 206.5 L151 203.4 L144.9 203.1 L137.8 206.8 L135 206.8 L129.3 202.1 L123.2 200 L98.3 200 L90.9 202.1 L87.1 205.8 L82 223.5 L83.7 239.1 L74.9 243.2 L69.8 247.6 L67.4 252.7 L68.1 262.9 L57.6 269.7 L47.7 280.2 L45.3 284.7 L45 289.4 L47.7 295.5 L55.5 302.3 L92.6 361.8 L99 369.6 L102.8 371 L199.3 370.6 L205.7 364.9 L245.5 299.6 L253.3 292.5 L255 288.4 L255 283.3 L252.3 277.2 L240.7 265.3 L229.9 259.5 L229.9 250.3 L227.5 244.9 L223.4 241.2 L214.6 237.8 L211.8 235 L211.5 218.4 L207.1 205.8 Z", t: 199, b: 371, pin: 199 },
    { id: "bowl", name: "Seafood bowl", size: "medium", nohw: true, d: "M105.1 189 L93.2 194.5 L85 202.1 L70.9 203.7 L61.1 208.6 L57.3 211.9 L53.5 218.4 L52.9 225.5 L43.2 230.4 L36.6 239.6 L35.5 246.7 L37.2 263.5 L35 268.4 L35 273.3 L49.7 335.3 L52.4 339.6 L62.7 348.3 L64.9 356 L70.9 363 L82.8 369.6 L95.4 371.7 L104.6 379.9 L113.3 383.7 L119.3 384.8 L142.7 383.7 L153.5 387 L162.2 387 L174.7 383.7 L182.4 378.8 L195.9 378.3 L208.5 373.4 L213.9 369 L218.2 363 L230.2 358.1 L237.3 352.2 L241.1 346.2 L242.7 336.9 L250.9 326.6 L264.5 274.4 L265 265.2 L261.2 255.4 L262.3 238 L259.6 231.4 L254.7 226.5 L244.9 221.7 L243.8 214 L237.8 207 L227.5 202.1 L213.9 201 L207.9 193.9 L195.4 187.9 L190 186.9 L169.8 189.6 L159.5 184.1 L148.1 183 L136.7 185.8 L128.5 190.1 L114.4 187.9 Z", t: 183, b: 387, pin: 183 },
    { id: "bowl-big", name: "Seafood bowl (big)", size: "big", nohw: true, d: "M96.4 155.3 L82.1 161.8 L72.3 170.9 L55.4 172.8 L43.7 178.7 L39.2 182.6 L34.6 190.4 L34 198.8 L22.3 204.7 L14.5 215.7 L13.2 224.2 L15.1 244.3 L12.5 250.2 L12.5 256 L30.1 330.1 L33.3 335.3 L45.7 345.7 L48.3 354.8 L55.4 363.3 L69.7 371.1 L84.7 373.7 L95.7 383.4 L106.1 388 L113.3 389.3 L141.2 388 L154.2 391.9 L164.6 391.9 L179.6 388 L188.7 382.1 L204.9 381.5 L219.9 375.6 L226.4 370.4 L231.6 363.3 L245.9 357.4 L254.3 350.3 L258.9 343.1 L260.8 332.1 L270.6 319.7 L286.8 257.3 L287.5 246.3 L282.9 234.6 L284.2 213.8 L281 206 L275.1 200.1 L263.4 194.3 L262.1 185.2 L255 176.7 L242.6 170.9 L226.4 169.6 L219.2 161.1 L204.3 154 L197.8 152.7 L173.7 155.9 L161.4 149.4 L147.7 148.1 L134.1 151.4 L124.3 156.6 L107.4 154 Z", t: 148, b: 392, pin: 148 },
    { id: "board-rect", name: "Normal wooden board (rectangle)", size: "big", wood: "bamboo", custom: true, d: "M30 130 H270 V410 H30 Z", t: 130, b: 410, pin: 130 },
    { id: "board-whale-tail", name: "Whale tail board", size: "big", wood: "teak", custom: true, d: "M150 405 C 140 405 138 385 140 350 C 142 310 138 270 118 240 C 100 214 60 198 30 150 C 28 135 40 128 52 134 C 90 150 118 160 150 205 C 182 160 210 150 248 134 C 260 128 272 135 270 150 C 240 198 200 214 182 240 C 162 270 158 310 160 350 C 162 385 160 405 150 405 Z", t: 128, b: 405, pin: 128 },
    { id: "board-whale", name: "Fin whale board", size: "big", wood: "teak", custom: true, d: "M20 275 C 30 245 70 232 130 236 C 160 220 170 200 180 212 C 186 222 190 232 200 238 C 235 240 255 232 262 214 C 272 206 286 208 288 220 C 286 236 274 250 258 262 C 272 272 284 286 282 302 C 270 298 258 290 246 282 C 200 298 120 314 70 308 C 40 304 22 292 20 275 Z", t: 200, b: 314, pin: 200 },
    { id: "domino-set", name: "Domino set", size: "medium", nohw: true, set: 4, d: "M50 150 H128 Q138 150 138 160 V258 Q138 268 128 268 H50 Q40 268 40 258 V160 Q40 150 50 150 Z M172 150 H250 Q260 150 260 160 V258 Q260 268 250 268 H172 Q162 268 162 258 V160 Q162 150 172 150 Z M50 282 H128 Q138 282 138 292 V390 Q138 400 128 400 H50 Q40 400 40 390 V292 Q40 282 50 282 Z M172 282 H250 Q260 282 260 292 V390 Q260 400 250 400 H172 Q162 400 162 390 V292 Q162 282 172 282 Z", t: 150, b: 400, pin: 150 },
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
        shape: "S", style: "gradient", colors: ["#EFEAE6", "#E58FA6", "#C45160"],
        gradient: { direction: "down", glitter: "none" },
        addins: { hearts: { amount: "some", place: "middle", color: "#C45160" } },
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
        shape: "A", style: "ink", colors: ["#1C6FC9", "#29B7A3", "#EFEAE6"],
        ink: { amount: "bold", background: "cloudy", spread: "right", cells: true, shimmer: "none", legacy: true },
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
        shape: "tag", style: "ocean", colors: ["#1C6FC9", "#29B7A3", "#EFEAE6"],
        ocean: { sand: "middle", wave: "bottom", foam: "frothy", sandColor: "natural" },
        addins: {
          starfish: { amount: "few", place: "bottom", color: "#F1E3C6" },
          pearl: { amount: "few", place: "bottom", color: "#EFEAE6" },
        },
        edge: "none", metal: "gold", hardware: "ringchain",
        tassel: { type: "none", ombre: false, color1: "#A9C8EC", color2: "#A9C8EC", cord: "gold" },
      },
    },
  ],
};

// Small resin charms and decorations (cut from Anna's photos). Small, so they fit anywhere.
CONFIG.smallItems = [
  { id: "crab-green", name: "Green crab" },
  { id: "crab-yellow", name: "Yellow crab" },
  { id: "crab-red", name: "Red crab" },
  { id: "turtle-brown", name: "Brown turtle" },
  { id: "turtle-pink", name: "Pink turtle" },
  { id: "turtle-yellow", name: "Yellow turtle" },
  { id: "butterfly-black", name: "Black butterfly" },
  { id: "butterfly-amber", name: "Amber butterfly" },
  { id: "butterfly-teal", name: "Teal butterfly" },
  { id: "butterfly-sunset", name: "Sunset butterfly" },
  { id: "butterfly-pink", name: "Pink butterfly" },
  { id: "butterfly-brown", name: "Brown butterfly" },
  { id: "heart-ruby", name: "Ruby heart" },
  { id: "heart-blue", name: "Blue heart" },
  { id: "heart-yellow", name: "Yellow heart" },
  { id: "heart-black", name: "Black gold heart" },
  { id: "crown-rose", name: "Rose gold crown" },
  { id: "crown-bronze", name: "Bronze crown" },
  { id: "crown-gold", name: "Gold crown" },
  { id: "ladybug", name: "Ladybug" },
  { id: "rose-champagne", name: "Champagne rose" },
  { id: "rose-pink", name: "Pink rose" },
  { id: "rose-red", name: "Red rose" },
  { id: "rose-blue", name: "Blue rose" },
  { id: "rose-purple", name: "Purple rose" },
  { id: "sunflower", name: "Sunflower" },
  { id: "shell-blue", name: "Blue shell" },
  { id: "shell-gold", name: "Gold shell" },
  { id: "bow-pink", name: "Pink bow" },
  { id: "starfish-gold", name: "Gold starfish" },
  { id: "metal-wing", name: "Silver wing" },
  { id: "metal-horn", name: "Silver horn" },
  { id: "metal-moth", name: "Silver moth" },
  { id: "metal-bird", name: "Silver bird" },
];
CONFIG.smallItems.forEach((s) => {
  s.img = `images/small/${s.id}.png`;
  CONFIG.addins.push({ id: `sm-${s.id}`, name: s.name, price: 0, color: "#D4AF37", drag: true, metal: /^(shell|starfish)/.test(s.id), group: /^(shell|starfish)/.test(s.id) ? "metalsea" : /^(crab|turtle)/.test(s.id) ? "seaanimals" : "small", img: s.img, size: 32, fx: "drop-shadow(0 1px 1.2px rgba(0,0,0,0.35))" });
  CONFIG.paperFlowers.push({ id: `sm-${s.id}`, name: s.name, img: s.img });
});

// Real sea items (starfish and shells from Anna's photos). Recommended for beach and sea pieces.
CONFIG.seaItems = [
  { id: "starfish", name: "Starfish", size: 42, single: true },
  { id: "shell-scallop", name: "Scallop shell", size: 38 },
  { id: "shell-pink", name: "Pink scallop shell", size: 38 },
  { id: "shell-cone", name: "Cone shell", size: 34 },
  { id: "shell-snail", name: "Snail shell", size: 34 },
];
CONFIG.seaItems.forEach((s) => {
  s.img = `images/sea/${s.id}.png`;
  CONFIG.addins.push({ id: `sea-${s.id}`, name: s.name, price: 0, color: "#D4AF37", drag: true, group: "sea", single: !!s.single, noAmount: true, img: s.img, size: s.size, fx: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.35))" });
  CONFIG.paperFlowers.push({ id: `sea-${s.id}`, name: s.name, img: s.img });
});

// Photos of pieces Anna already made, shown inside each section as a reference.
// To add one: put the photo in images/real/ and add a line here.
CONFIG.references = {
  keychains: [{ img: "images/real/g-round.jpg", cap: "Sea pour pendant" }, { img: "images/real/g-saeed.jpg", cap: "Name in sand letters" }],
  accessories: [{ img: "images/real/g-bookmark.jpg", cap: "Sea bookmark with tassel" }, { img: "images/real/g-pen.jpg", cap: "Pen with dried flowers and gold leaf" }],
  statues: [{ img: "images/real/g-domino.jpg", cap: "Domino set" }],
  kitchen: [{ img: "images/real/g-woodtray.jpg", cap: "Cheese board" }, { img: "images/real/g-paddle.jpg", cap: "Paddle board" }],
  cutting: [{ img: "images/real/g-woodtray.jpg", cap: "Cheese board" }, { img: "images/real/g-paddle.jpg", cap: "Sea paddle board" }, { img: "images/real/g-tree.jpg", cap: "Bath board" }, { img: "images/real/g-copper.jpg", cap: "Copper abstract board" }],
  paint: [{ img: "images/real/g-canvas.jpg", cap: "Sea canvas" }, { img: "images/real/g-plum.jpg", cap: "Plum abstract" }],
  gift: [{ img: "images/real/g-collage.jpg", cap: "Photo collage" }],
};

// Photos and videos of finished pieces, shown in the shop. One group per section (same names as the sections on the home page).
// To add one: put the file in images/real/ and add { img: "images/real/name.jpg", cap: "text" }
// (or { video: "images/real/name.mp4", poster: "images/real/name.jpg", cap: "text" }) under a theme.
CONFIG.gallery = [
  { theme: "Keychains", items: [{ img: "images/real/g-key-w.jpg", cap: "Clear letter W with mermaid tail charm" }, { img: "images/real/g-round-pendant.jpg", cap: "Sea round pendant with starfish" }, { img: "images/real/g-key-es.jpg", cap: "Sea letters E and S with starfish" }, { img: "images/real/g-key-e.jpg", cap: "Gold letter E with tassel" }, { img: "images/real/g-key-a-star.jpg", cap: "Letter A and star with tassel" }, { img: "images/real/g-key-k.jpg", cap: "Blue ink letter K" }, { img: "images/real/g-key-tail.jpg", cap: "Mermaid tail pendant" }] },
    { theme: "Accessories", items: [{ img: "images/real/g-feather.jpg", cap: "Gold feather bookmark" }, { img: "images/real/g-pen-blue.jpg", cap: "Blue and sand gradient pen" }, { img: "images/real/g-pen-ink.jpg", cap: "Blue ink pen" }, { img: "images/real/g-hairpin.jpg", cap: "Butterfly bun pin" }, { img: "images/real/g-pen.jpg", cap: "Pen with dried flowers and gold leaf" }, { img: "images/real/g-bookmark.jpg", cap: "Sea bookmark with tassel" }] },
  { theme: "Games & decor", items: [{ img: "images/real/g-chess-sand.jpg", cap: "Sea chess board with sand and shells" }, { img: "images/real/g-domino.jpg", cap: "Domino set" }] },
  { theme: "Dining & restaurant", items: [{ img: "images/real/g-coaster-sea.jpg", cap: "Sea cup stands with starfish" }, { img: "images/real/g-coaster-ink.jpg", cap: "Ink cup stands with gold leaf" }, { img: "images/real/g-coaster-stone.jpg", cap: "Copper stone-pattern stand" }, { img: "images/real/g-paint1.jpg", cap: "Blue and sand soap dish" }, { img: "images/real/g-ruffle-bowl.jpg", cap: "White and gold ruffle bowl with dried flowers" }, { img: "images/real/g-lychee-bowl.jpg", cap: "Pink ruffle bowl" }, { img: "images/real/g-fruit-bowl.jpg", cap: "Sea fruit bowl" }, { img: "images/real/g-nuts-dish.jpg", cap: "Wavy serving dish" }, { img: "images/real/g-platter.jpg", cap: "Sea platter" }, { img: "images/real/g-tealight.jpg", cap: "Tea light holder" }] },
  { theme: "Wooden cutting boards", items: [{ img: "images/real/g-pinkboard.jpg", cap: "Sunset beach wooden board" }, { img: "images/real/g-tail.jpg", cap: "Mermaid tail board" }, { img: "images/real/g-woodtray.jpg", cap: "Cheese board" }, { img: "images/real/g-paddle.jpg", cap: "Sea paddle board" }, { img: "images/real/g-tree.jpg", cap: "Bath board" }] },
  { theme: "Canvas", items: [{ img: "images/real/g-coffee-art.jpg", cap: "Coffee resin art" }, { img: "images/real/g-beach-lounger.jpg", cap: "Small beach canvas with sun lounger" }, { img: "images/real/g-feather-canvas.jpg", cap: "Green feather canvas" }, { img: "images/real/g-purple-plate.jpg", cap: "Purple and rose gold round piece" }, { img: "images/real/g-sea-wide.jpg", cap: "Wide sea canvas with a boat" }, { img: "images/real/g-sea-shells.jpg", cap: "Sea canvas with shells and starfish" }, { img: "images/real/g-round.jpg", cap: "Sea pour" }, { img: "images/real/g-paint3.jpg", cap: "Purple and gold" }, { img: "images/real/g-paint4.jpg", cap: "Green and gold" }, { img: "images/real/g-canvas.jpg", cap: "Sea canvas" }, { img: "images/real/g-plum.jpg", cap: "Plum abstract" }] },
];

// "Example work" shown at the end of each section in the designer: built from the gallery so it never goes out of date.
(() => {
  const themeOf = { keychains: "Keychains", accessories: "Accessories", statues: "Games & decor", kitchen: "Dining & restaurant", cutting: "Wooden cutting boards", paint: "Canvas", gift: "Custom gifts" };
  const refs = {};
  for (const k in themeOf) {
    const th = CONFIG.gallery.find((g) => g.theme === themeOf[k]);
    refs[k] = th ? th.items.filter((i) => i.img).map((i) => ({ img: i.img, cap: i.cap })) : [];
  }
  refs.keychains = CONFIG.presets.map((p) => ({ img: p.photo, cap: p.name })).concat(refs.keychains);
  CONFIG.references = refs;
})();

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

