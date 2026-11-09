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
    { id: "pen", name: "Pen (click style)", size: "small", nohw: true, d: "M143.8 112 L141.5 113.7 L140.4 121.9 L135.6 124.7 L135.6 132.1 L134.7 132.4 L136.1 363.8 L138.4 379.4 L143.5 394.2 L144.1 408 L146.3 410.9 L150.8 412 L155.1 410 L156.8 407.5 L157.6 392.7 L162.7 377.4 L165.3 357.9 L163.9 246.3 L164.7 246 L163.6 181.4 L164.2 127.6 L163 124.5 L157.6 121.1 L156.5 112.6 Z", t: 112, b: 412, pin: 112 },
    { id: "blade", name: "Pen (slim, pointed)", size: "small", nohw: true, d: "M151.9 100 L148.1 100.6 L145.3 104.2 L135.8 163.3 L128.1 244.9 L126.1 294.4 L127 339.4 L131.4 373 L141.4 410.2 L144.4 414.3 L149.4 416 L155.6 413.8 L158.1 410.2 L166.4 381.6 L172.5 347.7 L173.9 317.1 L173.6 268.6 L166.9 181.9 L161.4 140 L156.4 113.6 L156.1 104.4 L154.7 101.7 Z", t: 100, b: 416, pin: 100 },
    { id: "bookmark", name: "Bookmark", size: "thin", d: "M130 125 V400 Q130 410 140 410 H160 Q170 410 170 400 V125 Q170 115 160 115 H140 Q130 115 130 125Z", t: 115, b: 410, pin: 125 },
    { id: "bm-paw", name: "Paw bookmark", size: "thin", d: "M157 410 L166.9 406.7 L172.8 401.8 L176.4 396.2 L178.3 388.1 L172.1 168.9 L176.7 161.4 L177.7 152.6 L174.1 141.4 L168.2 134.6 L156.7 128.7 L145.9 128 L137.1 130.6 L130.8 134.6 L123.6 144.4 L121.7 151.6 L122.3 161.7 L127.2 170.9 L126.9 387.4 L130.5 398.2 L136.4 404.8 L146.2 409.3 Z", t: 128, b: 410, pin: 135 },
    { id: "bm-bunny", name: "Bunny bookmark", size: "thin", d: "M169.1 108 L164.1 109 L158.9 113.9 L154.9 120.5 L150.7 132.3 L147.7 132 L145.1 122.8 L139.1 112.9 L132.6 108 L127.6 108.7 L125 111 L120.7 123.1 L121.4 137.3 L126.3 156.7 L119.7 168.9 L118.7 180 L122.7 192.2 L129.9 200.4 L124.7 222.2 L126.3 395.5 L128 401.1 L131.2 405.7 L136.5 409 L141.1 410 L166.1 409.7 L170.1 408.4 L176.3 402.4 L178.9 394.5 L178 229.7 L177 219.5 L171.1 198.8 L178.6 189.6 L180.9 182.3 L181.3 174.8 L178.6 164.9 L172.7 155.7 L177.6 136 L177.6 122.8 L174 112.3 Z", t: 108, b: 410, pin: 120 },
    { id: "bm-cat", name: "Cat bookmark", size: "thin", d: "M165.5 165 L161.9 165.6 L155.5 174.4 L153.9 175.2 L145 175.2 L137.6 165.8 L135.6 165 L132.3 165.8 L124 183.5 L122.9 189.9 L117.7 192.9 L116 195.4 L116.6 198.1 L120.7 202 L121.3 205.9 L125.1 208.9 L125.7 213.1 L129.6 216.1 L127.6 228.5 L128.5 396.5 L129.6 402 L131.8 405.6 L135.1 408.3 L139.8 410 L165.5 409.4 L171.3 405.6 L174 401.2 L175.1 396.7 L174.3 228.3 L171.8 215.5 L174.6 213.1 L175.1 208.4 L178.7 205.9 L179.3 202 L183.4 198.7 L184 195.4 L182.3 192.9 L177.6 189.9 L167.4 166.4 Z", t: 165, b: 410, pin: 185 },
    { id: "feather", name: "Feather", size: "thin", d: "M135 418 L140.9 414.1 L149.6 391.5 L163 383.3 L169.1 375.8 L170.3 369.7 L174.2 364.6 L174.7 360.2 L171.7 352 L170.8 344.5 L178.6 331.9 L180.6 323 L184.2 316.6 L185.9 309.3 L185.9 301.5 L188.7 294.5 L187.3 285.8 L188.1 238 L185.4 205.6 L177 177.7 L175.3 166.5 L165.2 142.2 L158 129.3 L151.8 122.3 L135.3 113.1 L128.1 112 L121.6 114.2 L117.7 117.9 L115.5 122.6 L113 136 L113.8 150.8 L111.9 166.5 L111.3 190 L113.8 219 L112.1 228 L113.8 237.8 L113 252.6 L117.4 276.3 L116.9 288.9 L119.4 298.4 L119.4 307.6 L123 318 L123.9 330.3 L130.9 341.4 L128.1 353.7 L127.2 364.9 L128.3 373 L132.5 383.1 L132.5 385.9 L123.9 409.9 L125 413.5 L128.1 416.6 Z", t: 112, b: 418, pin: 130 },
    { id: "comb", name: "Hair comb (handle)", size: "thin", d: "M139.8 350 L154.7 349.2 L175 346.2 L179 343.7 L180.9 339.5 L179.6 245 L177.9 241.8 L175.4 239.9 L168 237.8 L161.3 233.4 L157.7 229.2 L155.8 224.9 L153.7 211.9 L153.9 199.2 L156.9 177.9 L162.5 158.3 L162.3 151.6 L161.1 147.3 L155 140.8 L150.1 138.3 L143.6 137 L133.7 138.7 L126.9 142.5 L121.8 149 L119.1 159.6 L122.7 202.2 L122.7 223 L119.1 278.1 L119.3 302.8 L121 328.5 L122.7 337.3 L126.1 343.3 L133.4 348.5 Z", t: 137, b: 350, pin: 137 },
    { id: "comb-moon", name: "Half-moon comb", size: "thin", d: "M72 285 C 72 250 112 232 150 232 C 188 232 228 250 228 285 L228 309 L222 309 L222 285 L218 285 L218 312 L212 312 L212 285 L208 285 L208 315 L202 315 L202 285 L199 285 L199 317 L192 317 L192 285 L189 285 L189 319 L183 319 L183 285 L179 285 L179 320 L173 320 L173 285 L170 285 L170 321 L163 321 L163 285 L160 285 L160 322 L153 322 L153 285 L150 285 L150 322 L144 322 L144 285 L140 285 L140 322 L134 322 L134 285 L130 285 L130 321 L124 321 L124 285 L121 285 L121 320 L114 320 L114 285 L111 285 L111 318 L105 318 L105 285 L101 285 L101 316 L95 316 L95 285 L92 285 L92 313 L85 313 L85 285 L82 285 L82 310 L75 310 L75 285 L72 285 Z", t: 232, b: 322, pin: 240, nohw: true },
    { id: "tray-oval", name: "Oval tray", size: "big", d: "M146.6 115 L126.9 118.1 L115.4 122.6 L106.4 127.9 L92.3 141.4 L82.2 159.7 L78.8 172.7 L77.1 188.4 L75.4 305.8 L77.1 330.2 L81.1 350.8 L87.3 365.7 L93.5 374.7 L103.9 384.5 L119.3 393.5 L135.9 398.6 L152.8 400 L173.4 396.3 L188 389.6 L201.5 378.6 L212.2 364 L218.9 348 L222.9 329.4 L224.6 305.2 L224.6 257.6 L220.6 189.6 L215.8 166.2 L209.4 151 L198.1 135.8 L184 124.8 L164.6 117 Z", t: 115, b: 400, pin: 120 },
    { id: "board", name: "Serving board", size: "medium", d: "M172.3 112 L142.2 115.2 L138.5 117.7 L141 158.2 L138.1 165.2 L134.7 168.6 L130.2 170.9 L122 171.2 L103 165.5 L98.6 165.5 L93.8 167.7 L90 173.1 L85.3 391.4 L88.5 399.6 L96.1 405 L202.7 405 L210.3 401.2 L214.7 394.2 L210.9 195.5 L208.7 190.8 L204.6 187 L181.2 180.7 L176.1 176.5 L172.3 170.2 L170.7 160.1 L175.8 118 L175.2 114.2 Z", t: 112, b: 405, pin: 125 },
    { id: "tray-rect", name: "Rectangle tray (cut corners)", size: "big", d: "M60 205 H240 L262 227 V353 L240 375 H60 L38 353 V227 Z", t: 205, b: 375, pin: 200 },
    { id: "frame-oval", name: "Oval frame", size: "big", custom: true, d: "M30 262 A120 95 0 1 0 270 262 A120 95 0 1 0 30 262Z", t: 167, b: 357, pin: 167 },
    { id: "tray-tall", name: "Large rectangle tray", size: "big", custom: true, d: "M81.7 140 L218.3 140 L218.3 395 L81.7 395 Z", t: 140, b: 395, pin: 140 },
    { id: "hexagon", name: "Hexagon tray", size: "big", custom: true, d: "M150 130 L258 192 V332 L150 394 L42 332 V192 Z", t: 130, b: 394, pin: 130 },
    { id: "heart-tray", name: "Big heart tray", size: "big", custom: true, d: "M73 145.8 L60.2 151.4 L48.8 159.2 L36.5 172 L26.2 190.1 L20 214.3 L21 236.9 L26.2 257.5 L35.4 279.6 L49.3 303.3 L70.5 329.1 L93.1 351.7 L117.8 372.3 L138.9 386.7 L147.7 389.3 L159 387.8 L189.9 366.7 L209.5 349.7 L235.2 322.9 L257.9 292 L272.3 262.1 L278.5 238.5 L280 217.3 L276.4 196.8 L267.1 176.2 L262 168.4 L244 153 L224.4 144.8 L209 142.7 L190.4 144.8 L173.9 149.9 L154.9 159.2 L147.7 159.2 L125.5 148.9 L106 143.7 L91.6 142.7 Z", t: 143, b: 389, pin: 185 },
    { id: "game-ttt", name: "Tic-tac-toe board", size: "thin", d: "M62 150 H238 V400 H62 Z", t: 150, b: 400, pin: 150, grid: { x0: 72, y0: 160, x1: 228, y1: 318, n: 3 } },
    { id: "game-chess", name: "Chess board", size: "thin", d: "M48 180 H252 V384 H48 Z", t: 180, b: 384, pin: 180, grid: { x0: 54, y0: 186, x1: 246, y1: 378, n: 8 } },
    { id: "coaster", name: "Cup stand (single)", size: "medium", nohw: true, d: "M146.4 162 L131.1 163.8 L109.6 171 L93.8 180 L77.6 194.4 L66.9 208.7 L57.9 227.2 L52.5 247.8 L51.6 265.4 L55.2 288.7 L62.4 307.6 L72.2 323.3 L85.7 338.2 L101.9 349.9 L117.6 357.1 L137.4 361.6 L154.5 362 L174.3 358.9 L193.6 351.7 L208.4 342.7 L223.3 329.2 L234 314.8 L243.9 293.7 L248 274.8 L248.4 253.7 L243.9 231.7 L235.8 212.8 L224.2 195.7 L213.8 185.4 L203 177.3 L185.1 168.3 L164.4 162.9 Z", t: 162, b: 362, pin: 162 },
    { id: "love", name: "LOVE word", size: "medium", d: "M20.8 259.6 L20.8 270.1 L24.5 274.4 L24.5 325.3 L20 329.9 L20 340.9 L23.7 344.6 L73.8 344.3 L76.6 340.6 L77.2 325.6 L88.5 325.6 L104.4 339.8 L111.5 340.4 L119.1 335 L133.3 320 L141.2 308.1 L146 295.3 L157.6 295.6 L171.2 342.6 L174.4 344.6 L194.5 344.3 L197.3 341.2 L218.5 274.4 L229.9 274.4 L231.3 276.1 L231.3 324.5 L226.2 330.7 L227.3 343.2 L230.2 344.6 L275.8 344.6 L279.4 341.5 L280 318.6 L276 314 L276 284.3 L280 278.9 L280 261.3 L276 256.8 L151.4 255.7 L148 259.4 L147.5 270.4 L136.1 270.4 L126.5 267 L115.2 269.8 L102.7 269.8 L94.5 267 L86 267.9 L71 279.2 L70.4 294.8 L75.5 308.1 L75.2 320 L57.1 319.7 L57.1 275.5 L61.4 272.7 L60.5 257.7 L56.3 255.4 L24.5 255.7 Z", t: 255, b: 345, pin: 255 },
    { id: "wood-slice", name: "Wood slice", size: "medium", wood: "slice", d: "M83.4 178.7 L64.2 199.8 L60.7 206.7 L57.3 209.2 L46 233.8 L44 254.4 L46.5 265.8 L49.9 270.7 L52.4 277.6 L58.3 284.4 L59.2 287.4 L69.1 297.2 L83.4 306.6 L102 321.8 L112.4 332.6 L116.8 340.5 L122.2 344.5 L125.7 351.8 L135.5 355.8 L138.9 359.7 L148.3 364.6 L155.2 365.6 L166.5 371.5 L176.3 372 L186.2 370.5 L204.8 364.6 L217.6 359.2 L226 353.8 L239.8 338.1 L248.1 316.9 L253 313 L254.5 308.5 L253 297.7 L256 292.8 L254.5 285.9 L255 278.5 L252.6 249 L249.1 238.2 L249.1 232.8 L247.1 230.8 L245.2 222.5 L242.7 220.5 L242.2 216.1 L239.8 214.1 L233.4 199.8 L229.4 196.9 L228.9 194.4 L216.6 181.6 L213.7 180.7 L211.7 177.7 L201.9 170.8 L183.7 165.9 L159.6 163.9 L157.1 162 L149.3 160.5 L130.1 160 L119.7 162 L100.6 168.9 Z", t: 160, b: 372, pin: 165 },
    { id: "wood-round", name: "Round wooden board", size: "medium", wood: "teak", d: "M144.8 128 L128 131.6 L122.7 135.5 L119.8 141.9 L120.9 177 L117.7 187 L110.9 194.8 L96.6 203.8 L82.6 214.9 L70.1 228.8 L61.9 241.7 L51.9 268.1 L49.4 283.1 L49 297.1 L51.2 314.9 L57.6 334.6 L68.3 352.8 L81.2 367.5 L96.9 379.6 L114.1 388.2 L131.2 393.2 L150.5 395 L171.6 392.9 L193.4 385.3 L210.6 375 L224.9 361.8 L236.3 346.4 L244.9 328.9 L249.9 309.9 L251 292.8 L249.9 278.5 L245.6 260.2 L233.5 234.2 L215.6 213.4 L189.1 194.8 L181.3 185.2 L178.8 175.5 L179.1 148 L177.7 137.3 L174.1 133 L164.8 129.4 Z", t: 128, b: 395, pin: 140 },
    { id: "wood-tray", name: "Bamboo tray", size: "big", wood: "bamboo", d: "M73.5 150 L226.5 150 L226.5 400 L73.5 400 Z", t: 150, b: 400, pin: 150 },
    { id: "heartset", name: "Best-friend heart set (2 halves)", size: "small", d: "M142 392 C52 330 18 270 30 212 C42 154 114 140 142 196 L142 248 C158 248 158 278 142 278 Z M158 196 C186 140 258 154 270 212 C282 270 248 330 158 392 L158 278 C172 278 172 248 158 248 Z", t: 150, b: 392, pin: 190 },
    { id: "g-starfish", name: "Starfish", size: "small", mold: "groovy", d: "M166 163 L176 181 L190 196 L205 207 L224 215 L244 220 L256 227 L260 237 L254 250 L240 266 L230 283 L224 301 L222 321 L224 342 L221 356 L212 362 L198 361 L179 352 L160 348 L140 348 L121 352 L102 361 L88 362 L79 356 L76 342 L78 321 L76 301 L70 283 L60 266 L46 250 L40 237 L44 227 L56 220 L76 215 L95 207 L110 196 L124 181 L134 163 L145 153 L155 153Z", t: 135, b: 402, pin: 145 },
    { id: "g-shell", name: "Scallop shell", size: "small", mold: "groovy", d: "M150 395 L66 262 C 52 220 76 190 96 184 C 108 158 140 150 150 150 C 160 150 192 158 204 184 C 224 190 248 220 234 262 Z", t: 150, b: 395, pin: 160 },
    { id: "g-paw", name: "Paw print", size: "small", mold: "groovy", d: "M67 215 a28 28 0 1 0 56 0 a28 28 0 1 0 -56 0Z M112 180 a28 28 0 1 0 56 0 a28 28 0 1 0 -56 0Z M158 180 a28 28 0 1 0 56 0 a28 28 0 1 0 -56 0Z M203 215 a28 28 0 1 0 56 0 a28 28 0 1 0 -56 0Z M80 330 C 80 270 130 250 162 250 C 195 250 245 270 245 330 C 245 375 205 395 162 395 C 120 395 80 375 80 330Z", t: 152, b: 395, pin: 165 },
    { id: "g-tail", name: "Mermaid tail", size: "small", mold: "groovy", d: "M148 140 C157 138 164 148 174 160 C184 172 196 196 208 213 C220 231 239 251 248 267 C257 282 262 296 262 307 C262 318 259 329 248 334 C236 339 211 340 194 337 C178 334 163 314 148 314 C132 314 116 333 101 337 C86 341 68 339 58 335 C47 331 39 324 38 314 C36 303 40 288 48 274 C55 259 69 243 81 227 C93 210 106 188 118 173 C129 159 138 142 148 140Z", t: 140, b: 337, pin: 150 },
    { id: "g-jelly", name: "Jellyfish", size: "small", mold: "groovy", d: "M70 250 C 70 170 110 140 150 140 C 190 140 230 170 230 250 C 230 262 215 265 205 262 C 200 300 215 340 205 395 C 195 390 190 330 185 300 C 175 330 180 380 168 392 C 158 380 160 330 150 300 C 140 330 142 380 130 392 C 118 380 125 330 115 300 C 110 330 105 390 95 395 C 85 340 100 300 95 262 C 85 265 70 262 70 250Z", t: 140, b: 395, pin: 150 },
    { id: "g-dolphin", name: "Dolphin", size: "small", mold: "groovy", d: "M110 160 C112 154 128 145 138 141 C148 137 160 136 170 138 C180 140 191 146 198 155 C205 164 209 178 212 190 C215 202 211 218 216 230 C221 242 243 253 244 262 C245 271 227 272 222 282 C217 292 217 308 214 320 C211 332 203 343 205 355 C207 367 231 388 228 392 C225 396 201 382 188 382 C175 382 155 397 150 392 C145 387 160 367 160 352 C160 337 155 317 150 300 C145 283 134 264 128 248 C122 232 112 216 112 205 C112 194 125 188 125 180 C125 172 108 166 110 160Z", t: 138, b: 392, pin: 148 },
    { id: "bm-glass1", name: "Shattered glass bookmark (1)", size: "thin", tex: "glass", seed: 11, d: "M130 125 V400 Q130 410 140 410 H160 Q170 410 170 400 V125 Q170 115 160 115 H140 Q130 115 130 125Z", t: 115, b: 410, pin: 115 },
    { id: "bm-glass2", name: "Shattered glass bookmark (2)", size: "thin", tex: "glass", seed: 29, d: "M130 125 V400 Q130 410 140 410 H160 Q170 410 170 400 V125 Q170 115 160 115 H140 Q130 115 130 125Z", t: 115, b: 410, pin: 115 },
    { id: "bm-pebbles", name: "Pebbles bookmark", size: "thin", tex: "pebbles", seed: 5, d: "M130 125 V400 Q130 410 140 410 H160 Q170 410 170 400 V125 Q170 115 160 115 H140 Q130 115 130 125Z", t: 115, b: 410, pin: 115 },
    { id: "bm-hearts", name: "Hearts bookmark", size: "thin", tex: "hearts", seed: 8, d: "M130 125 V400 Q130 410 140 410 H160 Q170 410 170 400 V125 Q170 115 160 115 H140 Q130 115 130 125Z", t: 115, b: 410, pin: 115 },
    { id: "bm-paws", name: "Paws and bones bookmark", size: "thin", tex: "paws", seed: 3, d: "M130 125 V400 Q130 410 140 410 H160 Q170 410 170 400 V125 Q170 115 160 115 H140 Q130 115 130 125Z", t: 115, b: 410, pin: 115 },
    { id: "hairpin", name: "Butterfly bun pin", size: "thin", nohw: true, d: "M101.5 111.9 L88.9 118.6 L86.9 122.2 L87.7 128.5 L101.1 148.6 L112.9 161.6 L122 167.2 L134.2 170.7 L134.2 180.2 L137.8 189.2 L149.6 201.1 L156.3 205 L159.5 209.4 L161.4 227.9 L163.4 232.6 L168.1 235.8 L174.5 234.6 L178 229.9 L179.2 216.9 L185.1 216.1 L187.9 220.8 L189.8 358.1 L185.5 375.8 L185.1 385.7 L187.1 401.4 L190.2 411.7 L195.4 417.2 L200.1 418 L206.8 412.9 L208.4 405.4 L209.9 352.1 L209.2 240.5 L213.1 195.2 L212.3 179 L209.9 168.7 L202.8 151 L194.2 137.6 L180.8 123 L168.1 112.7 L163 111.5 L158.7 115.5 L155.1 115.5 L143.3 110.4 L132.3 108 L116.5 108.4 Z", t: 108, b: 418, pin: 130 },
    { id: "coaster-set", name: "Cup stand set (4 + holder)", size: "medium", nohw: true, set: 4, d: "M40 212 A52 52 0 1 0 144 212 A52 52 0 1 0 40 212Z M156 212 A52 52 0 1 0 260 212 A52 52 0 1 0 156 212Z M40 330 A52 52 0 1 0 144 330 A52 52 0 1 0 40 330Z M156 330 A52 52 0 1 0 260 330 A52 52 0 1 0 156 330Z", t: 160, b: 382, pin: 160 },
    { id: "coaster-stone", name: "Cup stand with stone pattern", size: "medium", nohw: true, tex: "stones", seed: 4, d: "M50 262 A100 100 0 1 0 250 262 A100 100 0 1 0 50 262Z", t: 162, b: 362, pin: 162 },
    { id: "coaster-pair", name: "Cup stands (pair)", size: "medium", nohw: true, set: 2, d: "M16 262 A66 66 0 1 0 148 262 A66 66 0 1 0 16 262 Z M152 262 A66 66 0 1 0 284 262 A66 66 0 1 0 152 262 Z", t: 196, b: 328, pin: 196 },
    { id: "coaster-trio", name: "Cup stands (three)", size: "medium", nohw: true, set: 3, d: "M94 184 A56 56 0 1 0 206 184 A56 56 0 1 0 94 184 Z M36 288 A56 56 0 1 0 148 288 A56 56 0 1 0 36 288 Z M152 288 A56 56 0 1 0 264 288 A56 56 0 1 0 152 288 Z", t: 128, b: 344, pin: 128 },
    { id: "wood-coaster", name: "Wooden cup stand", size: "medium", nohw: true, wood: "bamboo", d: "M50 262 A100 100 0 1 0 250 262 A100 100 0 1 0 50 262 Z", t: 162, b: 362, pin: 162 },
    { id: "tray-round", name: "Circular epoxy tray", size: "big", d: "M30 262 A120 120 0 1 0 270 262 A120 120 0 1 0 30 262 Z", t: 142, b: 382, pin: 142 },
    { id: "soap", name: "Soap dish", size: "medium", nohw: true, d: "M25.7 214.2 L25 352.9 L45.8 375.1 L49.8 376.6 L251.6 375.5 L254.6 374.4 L274.6 353.6 L275 217.1 L273.9 214.2 L254.2 194.9 L249.8 193.8 L48 193.4 Z", t: 193, b: 377, pin: 193 },
    { id: "light-holder", name: "Light holder", size: "medium", nohw: true, d: "M203 200.7 L198.6 199 L171.7 199.4 L164.6 202.1 L159.5 206.5 L156.1 206.5 L151 203.4 L144.9 203.1 L137.8 206.8 L135 206.8 L129.3 202.1 L123.2 200 L98.3 200 L90.9 202.1 L87.1 205.8 L82 223.5 L83.7 239.1 L74.9 243.2 L69.8 247.6 L67.4 252.7 L68.1 262.9 L57.6 269.7 L47.7 280.2 L45.3 284.7 L45 289.4 L47.7 295.5 L55.5 302.3 L92.6 361.8 L99 369.6 L102.8 371 L199.3 370.6 L205.7 364.9 L245.5 299.6 L253.3 292.5 L255 288.4 L255 283.3 L252.3 277.2 L240.7 265.3 L229.9 259.5 L229.9 250.3 L227.5 244.9 L223.4 241.2 L214.6 237.8 L211.8 235 L211.5 218.4 L207.1 205.8 Z", t: 199, b: 371, pin: 199 },
    { id: "bowl", name: "Seafood bowl", size: "medium", nohw: true, d: "M105.1 189 L93.2 194.5 L85 202.1 L70.9 203.7 L61.1 208.6 L57.3 211.9 L53.5 218.4 L52.9 225.5 L43.2 230.4 L36.6 239.6 L35.5 246.7 L37.2 263.5 L35 268.4 L35 273.3 L49.7 335.3 L52.4 339.6 L62.7 348.3 L64.9 356 L70.9 363 L82.8 369.6 L95.4 371.7 L104.6 379.9 L113.3 383.7 L119.3 384.8 L142.7 383.7 L153.5 387 L162.2 387 L174.7 383.7 L182.4 378.8 L195.9 378.3 L208.5 373.4 L213.9 369 L218.2 363 L230.2 358.1 L237.3 352.2 L241.1 346.2 L242.7 336.9 L250.9 326.6 L264.5 274.4 L265 265.2 L261.2 255.4 L262.3 238 L259.6 231.4 L254.7 226.5 L244.9 221.7 L243.8 214 L237.8 207 L227.5 202.1 L213.9 201 L207.9 193.9 L195.4 187.9 L190 186.9 L169.8 189.6 L159.5 184.1 L148.1 183 L136.7 185.8 L128.5 190.1 L114.4 187.9 Z", t: 183, b: 387, pin: 183 },
    { id: "bowl-big", name: "Seafood bowl (big)", size: "big", nohw: true, d: "M96.4 155.3 L82.1 161.8 L72.3 170.9 L55.4 172.8 L43.7 178.7 L39.2 182.6 L34.6 190.4 L34 198.8 L22.3 204.7 L14.5 215.7 L13.2 224.2 L15.1 244.3 L12.5 250.2 L12.5 256 L30.1 330.1 L33.3 335.3 L45.7 345.7 L48.3 354.8 L55.4 363.3 L69.7 371.1 L84.7 373.7 L95.7 383.4 L106.1 388 L113.3 389.3 L141.2 388 L154.2 391.9 L164.6 391.9 L179.6 388 L188.7 382.1 L204.9 381.5 L219.9 375.6 L226.4 370.4 L231.6 363.3 L245.9 357.4 L254.3 350.3 L258.9 343.1 L260.8 332.1 L270.6 319.7 L286.8 257.3 L287.5 246.3 L282.9 234.6 L284.2 213.8 L281 206 L275.1 200.1 L263.4 194.3 L262.1 185.2 L255 176.7 L242.6 170.9 L226.4 169.6 L219.2 161.1 L204.3 154 L197.8 152.7 L173.7 155.9 L161.4 149.4 L147.7 148.1 L134.1 151.4 L124.3 156.6 L107.4 154 Z", t: 148, b: 392, pin: 148 },
    { id: "board-rect", name: "Normal wooden board (rectangle)", size: "big", wood: "bamboo", custom: true, d: "M30 130 H270 V410 H30 Z", t: 130, b: 410, pin: 130 },
    { id: "board-whale-tail", name: "Whale tail board", size: "big", wood: "teak", custom: true, d: "M150 405 C 140 405 138 385 140 350 C 142 310 138 270 118 240 C 100 214 60 198 30 150 C 28 135 40 128 52 134 C 90 150 118 160 150 205 C 182 160 210 150 248 134 C 260 128 272 135 270 150 C 240 198 200 214 182 240 C 162 270 158 310 160 350 C 162 385 160 405 150 405 Z", t: 128, b: 405, pin: 128 },
    { id: "board-whale", name: "Fin whale board", size: "big", wood: "teak", custom: true, d: "M20 275 C 30 245 70 232 130 236 C 160 220 170 200 180 212 C 186 222 190 232 200 238 C 235 240 255 232 262 214 C 272 206 286 208 288 220 C 286 236 274 250 258 262 C 272 272 284 286 282 302 C 270 298 258 290 246 282 C 200 298 120 314 70 308 C 40 304 22 292 20 275 Z", t: 200, b: 314, pin: 200 },
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
  kitchen: [{ img: "images/real/g-woodtray.jpg", cap: "Wooden tray" }, { img: "images/real/g-paddle.jpg", cap: "Paddle board" }],
  cutting: [{ img: "images/real/g-woodtray.jpg", cap: "Resin on wood" }, { img: "images/real/g-paddle.jpg", cap: "Sea paddle board" }, { img: "images/real/g-tree.jpg", cap: "Wooden board with resin" }, { img: "images/real/g-copper.jpg", cap: "Copper abstract board" }],
  paint: [{ img: "images/real/g-canvas.jpg", cap: "Sea canvas" }, { img: "images/real/g-plum.jpg", cap: "Plum abstract" }],
  gift: [{ img: "images/real/g-collage.jpg", cap: "Photo collage" }],
};

// Photos and videos of finished pieces, shown in the shop. One group per section (same names as the sections on the home page).
// To add one: put the file in images/real/ and add { img: "images/real/name.jpg", cap: "text" }
// (or { video: "images/real/name.mp4", poster: "images/real/name.jpg", cap: "text" }) under a theme.
CONFIG.gallery = [
  { theme: "Keychains", items: [{ img: "images/real/g-key-e.jpg", cap: "Gold letter E with tassel" }, { img: "images/real/g-key-a-star.jpg", cap: "Letter A and star with tassel" }, { img: "images/real/g-key-k.jpg", cap: "Blue ink letter K" }, { img: "images/real/g-key-tail.jpg", cap: "Mermaid tail pendant" }] },
    { theme: "Accessories", items: [{ img: "images/real/g-pen-blue.jpg", cap: "Blue and sand gradient pen" }, { img: "images/real/g-pen-ink.jpg", cap: "Blue ink pen" }, { img: "images/real/g-hairpin.jpg", cap: "Butterfly bun pin" }, { img: "images/real/g-pen.jpg", cap: "Pen with dried flowers and gold leaf" }, { img: "images/real/g-bookmark.jpg", cap: "Sea bookmark with tassel" }] },
  { theme: "Games & decor", items: [{ img: "images/real/g-domino.jpg", cap: "Domino set" }, { video: "images/real/lamp.mp4", poster: "images/real/lamp.jpg", cap: "Resin lamp with LED lights (video)" }] },
  { theme: "Dining & restaurant", items: [{ img: "images/real/g-paint1.jpg", cap: "Blue and sand soap dish" }, { img: "images/real/g-coaster-sea.jpg", cap: "Sea cup stands with starfish" }, { img: "images/real/g-coaster-ink.jpg", cap: "Ink cup stands with gold leaf" }, { img: "images/real/g-coaster-stone.jpg", cap: "Copper stone-pattern stand" }, { img: "images/real/g-platter.jpg", cap: "Sea platter" }, { img: "images/real/g-nuts-dish.jpg", cap: "Wavy serving dish" }, { img: "images/real/g-fruit-bowl.jpg", cap: "Sea fruit bowl" }, { img: "images/real/g-tealight.jpg", cap: "Tea light holder" }] },
  { theme: "Wooden cutting boards", items: [{ img: "images/real/g-tail.jpg", cap: "Mermaid tail board" }, { img: "images/real/g-woodtray.jpg", cap: "Resin on wood" }, { img: "images/real/g-paddle.jpg", cap: "Sea paddle board" }, { img: "images/real/g-tree.jpg", cap: "Wooden board with resin" }, { img: "images/real/g-copper.jpg", cap: "Copper abstract board" }] },
  { theme: "Canvas", items: [{ img: "images/real/g-sea-wide.jpg", cap: "Wide sea canvas with a boat" }, { img: "images/real/g-sea-shells.jpg", cap: "Sea canvas with shells and starfish" }, { img: "images/real/g-round.jpg", cap: "Sea pour" }, { img: "images/real/g-paint3.jpg", cap: "Purple and gold" }, { img: "images/real/g-paint4.jpg", cap: "Green and gold" }, { img: "images/real/g-canvas.jpg", cap: "Sea canvas" }, { img: "images/real/g-plum.jpg", cap: "Plum abstract" }] },
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

