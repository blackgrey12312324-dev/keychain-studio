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

  // Anna's real epoxy pigment colours (from her bottles)
  colors: [
    { name: "Dark blue", name_th: "น้ำเงินเข้ม", name_ru: "Тёмно-синий", hex: "#2F4FB5" },
    { name: "Royal blue", name_th: "น้ำเงินรอยัล", name_ru: "Королевский синий", hex: "#1C6FC9" },
    { name: "Sky blue", name_th: "ฟ้า", name_ru: "Небесно-голубой", hex: "#4F9BE0" },
    { name: "Teal", name_th: "เขียวน้ำทะเล", name_ru: "Морская волна", hex: "#2C93A8" },
    { name: "Turquoise", name_th: "เทอร์ควอยซ์", name_ru: "Бирюзовый", hex: "#29B7A3" },
    { name: "Mint", name_th: "มิ้นต์", name_ru: "Мятный", hex: "#7CCFB6" },
    { name: "Deep green", name_th: "เขียวเข้ม", name_ru: "Тёмно-зелёный", hex: "#2F5A4C" },
    { name: "Black", name_th: "ดำ", name_ru: "Чёрный", hex: "#1E1E20" },
    { name: "Graphite", name_th: "เทากราไฟต์", name_ru: "Графит", hex: "#4A4C4A" },
    { name: "Gunmetal", name_th: "เทาเมทัล", name_ru: "Тёмный металл", hex: "#7C7B76" },
    { name: "Silver", name_th: "เงิน", name_ru: "Серебро", hex: "#C9C9CB" },
    { name: "Pearl white", name_th: "ขาวมุก", name_ru: "Жемчужно-белый", hex: "#EFEAE6" },
    { name: "Champagne", name_th: "แชมเปญ", name_ru: "Шампань", hex: "#D9C2A8" },
    { name: "Gold", name_th: "ทอง", name_ru: "Золото", hex: "#D4A93C" },
    { name: "Yellow gold", name_th: "ทองเหลือง", name_ru: "Жёлтое золото", hex: "#C9B04E" },
    { name: "Antique gold", name_th: "ทองโบราณ", name_ru: "Старое золото", hex: "#9A7A2E" },
    { name: "Bronze", name_th: "บรอนซ์", name_ru: "Бронза", hex: "#A56B3E" },
    { name: "Copper", name_th: "ทองแดง", name_ru: "Медь", hex: "#C07445" },
    { name: "Rose copper", name_th: "ทองแดงโรส", name_ru: "Розовая медь", hex: "#C98B6E" },
    { name: "Orange", name_th: "ส้ม", name_ru: "Оранжевый", hex: "#E0792F" },
    { name: "Coral red", name_th: "แดงคอรัล", name_ru: "Коралловый", hex: "#D05563" },
    { name: "Rose red", name_th: "แดงกุหลาบ", name_ru: "Розово-красный", hex: "#C45160" },
    { name: "Soft pink", name_th: "ชมพูอ่อน", name_ru: "Нежно-розовый", hex: "#EBA3B0" },
    { name: "Pink", name_th: "ชมพู", name_ru: "Розовый", hex: "#E58FA6" },
    { name: "Light pink pearl", name_th: "ชมพูมุก", name_ru: "Розовый перламутр", hex: "#F2C3CE" },
    { name: "Magenta", name_th: "แดงม่วง", name_ru: "Маджента", hex: "#B2467D" },
    { name: "Violet blue", name_th: "ม่วงน้ำเงิน", name_ru: "Фиолетово-синий", hex: "#5A63C4" },
    { name: "Purple", name_th: "ม่วง", name_ru: "Фиолетовый", hex: "#7E4FB5" },
  ],

  palettes: [
    { name: "Sunset", name_th: "พระอาทิตย์ตก", name_ru: "Закат", colors: ["#E0792F", "#E58FA6", "#D4A93C"] },
    { name: "Andaman Sea", name_th: "ทะเลอันดามัน", name_ru: "Андаманское море", colors: ["#1C6FC9", "#29B7A3", "#EFEAE6"] },
    { name: "Forest", name_th: "ป่า", name_ru: "Лес", colors: ["#2F5A4C", "#7CCFB6", "#EFEAE6"] },
    { name: "Galaxy", name_th: "กาแล็กซี", name_ru: "Галактика", colors: ["#1E1E20", "#5A63C4", "#7E4FB5"] },
    { name: "Rose gold", name_th: "โรสโกลด์", name_ru: "Розовое золото", colors: ["#C98B6E", "#F2C3CE", "#D4A93C"] },
  ],

  // Things inside the resin.
  // drag: true = customers can drag each piece around.
  // single: true = only one amount (no "a little / a lot").
  addins: [
    { id: "goldleaf", name: "Gold leaf flakes", name_th: "ทองคำเปลว", name_ru: "Хлопья потали", price: 15, color: "#D4AF37" },
    { id: "hearts", name: "Heart glitter", name_th: "กากเพชรหัวใจ", name_ru: "Глиттер-сердечки", price: 10, color: "#C45160", drag: true },
    { id: "stars", name: "Star confetti", name_th: "คอนเฟตติดาว", name_ru: "Звёздочки", price: 10, color: "#F5C842", drag: true },
    { id: "frog", name: "Mini frog", name_th: "กบจิ๋ว", name_ru: "Мини-лягушка", price: 20, color: "#9BD93C", drag: true, single: true },
    { id: "starfish", name: "Tiny starfish", name_th: "ปลาดาวจิ๋ว", name_ru: "Морская звёздочка", price: 15, color: "#F1E3C6", drag: true },
    { id: "shells", name: "Mini shells", name_th: "เปลือกหอยจิ๋ว", name_ru: "Мини-ракушки", price: 15, color: "#F7D6C8", drag: true },
    { id: "pearl", name: "Pearls", name_th: "ไข่มุก", name_ru: "Жемчужины", price: 10, color: "#EFEAE6", drag: true },
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
    { id: "dried-lavender", name: "Dried lavender", price: 0, color: "#D4AF37", drag: true, group: "dried", img: "images/dried/lavender.png", size: 60, fx: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.3))" },
    { id: "dried-blue", name: "Blue baby's breath", price: 0, color: "#D4AF37", drag: true, group: "dried", img: "images/dried/blue.png", size: 90, fx: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.3))" },
    { id: "dried-pink", name: "Pink baby's breath", price: 0, color: "#D4AF37", drag: true, group: "dried", img: "images/dried/pink.png", size: 80, fx: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.3))" },
    { id: "dried-wheat", name: "Wheat ear", price: 0, color: "#D4AF37", drag: true, group: "dried", img: "images/dried/wheat.png", size: 70, fx: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.3))" },
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
    { id: "black", name: "Black", hex: "#1A1A1C", kx: 0.594, ratio: 0.733 },
    { id: "navy", name: "Navy", hex: "#1B2A6B", kx: 0.422, ratio: 0.86 },
    { id: "cream", name: "Cream to grey", hex: "#C9C2B0", kx: 0.611, ratio: 0.463 },
    { id: "gold", name: "Gold", hex: "#A98524", kx: 0.662, ratio: 0.557 },
    { id: "teal", name: "Yellow to teal", hex: "#9CC9C0", kx: 0.73, ratio: 0.476 },
    { id: "greyblue", name: "Grey blue", hex: "#8E9BB0", kx: 0.685, ratio: 0.662 },
    { id: "green", name: "Lime green", hex: "#8BE04B", kx: 0.544, ratio: 0.49 },
    { id: "orange", name: "Orange", hex: "#F2561D", kx: 0.397, ratio: 0.7 },
  ],

  shapes: [
    { id: "tag", name: "Tag", name_th: "แท็ก", name_ru: "Бирка" },
    { id: "heart", name: "Heart", name_th: "หัวใจ", name_ru: "Сердце" },
    { id: "circle", name: "Circle", name_th: "วงกลม", name_ru: "Круг" },
    { id: "pick", size: "small", name: "Teardrop", name_th: "หยดน้ำ", name_ru: "Капля" },
    { id: "oval", name: "Oval tag", size: "small", d: "M95 250 A55 55 0 0 1 205 250 V330 A55 55 0 0 1 95 330 Z", t: 195, b: 385, pin: 195 },
    { id: "square", name: "Rounded square", size: "small", d: "M95 200 H205 Q225 200 225 220 V330 Q225 350 205 350 H95 Q75 350 75 330 V220 Q75 200 95 200 Z", t: 200, b: 350, pin: 175 },
    { id: "curved", name: "Curved tag", size: "small", d: "M85 175 C130 165 170 165 215 175 C 232 230 232 330 212 395 C170 380 130 380 88 395 C 68 330 68 230 85 175 Z", t: 170, b: 395, pin: 160 },
    { id: "halfheart-l", name: "Half heart (left)", size: "small", d: "M150 392 C 60 330 26 270 38 212 C 50 154 122 140 150 196 Z", t: 150, b: 392, pin: 195 },
    { id: "halfheart-r", name: "Half heart (right)", size: "small", d: "M150 196 C 178 140 250 154 262 212 C 274 270 240 330 150 392 Z", t: 150, b: 392, pin: 195 },
    { id: "wing", name: "Wing", size: "small", d: "M150 125 C 218 190 222 330 150 400 C 78 330 82 190 150 125 Z", t: 125, b: 400, pin: 140 },
    { id: "pen", name: "Custom pen (straight)", size: "small", d: "M130 130 Q150 112 170 130 V385 Q170 400 150 400 Q130 400 130 385 Z", t: 112, b: 400, pin: 125 },
    { id: "blade", name: "Custom pen (pointed)", size: "small", d: "M150 105 C 195 200 195 340 150 410 C 105 340 105 200 150 105 Z", t: 105, b: 410, pin: 120 },
    { id: "player", name: "Music player", size: "small", d: "M85 175 H215 Q228 175 228 188 V372 Q228 385 215 385 H85 Q72 385 72 372 V188 Q72 175 85 175 Z", t: 175, b: 385, pin: 160 },
    { id: "bookmark", name: "Bookmark", size: "thin", d: "M130 125 V400 Q130 410 140 410 H160 Q170 410 170 400 V125 Q170 115 160 115 H140 Q130 115 130 125Z", t: 115, b: 410, pin: 125 },
    { id: "bm-paw", name: "Paw bookmark", size: "thin", d: "M110 168 A40 40 0 0 0 122 196 V400 Q122 410 132 410 H168 Q178 410 178 400 V196 A40 40 0 0 0 190 168 A40 40 0 1 0 110 168Z", t: 128, b: 410, pin: 135 },
    { id: "bm-bunny", name: "Bunny bookmark", size: "thin", d: "M112 230 A38 38 0 1 0 188 230 A38 38 0 1 0 112 230Z M118 160 A14 52 0 1 0 146 160 A14 52 0 1 0 118 160Z M154 160 A14 52 0 1 0 182 160 A14 52 0 1 0 154 160Z M122 240 V400 Q122 410 132 410 H168 Q178 410 168 410 H168 L178 400 V240Z", t: 108, b: 410, pin: 120 },
    { id: "bm-cat", name: "Cat bookmark", size: "thin", d: "M112 230 A38 38 0 1 0 188 230 A38 38 0 1 0 112 230Z M112 218 L150 196 L116 165Z M188 218 L184 165 L150 196Z M122 240 V400 Q122 410 132 410 H168 Q178 410 178 400 V240Z", t: 165, b: 410, pin: 185 },
    { id: "feather", name: "Feather", size: "thin", d: "M150 112 C 108 148 92 240 118 318 C 128 344 142 360 150 372 C 154 386 154 400 160 414 C 166 420 172 414 168 402 C 166 392 164 380 166 370 C 192 338 214 270 207 200 C 200 148 172 116 150 112Z", t: 112, b: 418, pin: 130 },
    { id: "comb", name: "Hair comb (handle)", size: "thin", d: "M126 150 Q126 137 150 137 Q174 137 174 150 V205 C174 218 200 220 225 226 V285 L225 350 L214 350 L214 285 L210 285 L210 350 L199 350 L199 285 L194 285 L194 350 L184 350 L184 285 L178 285 L178 350 L168 350 L168 285 L163 285 L163 350 L152 350 L152 285 L148 285 L148 350 L137 350 L137 285 L132 285 L132 350 L122 350 L122 285 L116 285 L116 350 L106 350 L106 285 L101 285 L101 350 L90 350 L90 285 L86 285 L86 350 L75 350 L75 285 L75 285 V226 C 100 220 126 218 126 205 Z", t: 137, b: 350, pin: 137 },
    { id: "comb-moon", name: "Half-moon comb", size: "thin", d: "M72 285 C 72 250 112 232 150 232 C 188 232 228 250 228 285 L228 309 L222 309 L222 285 L218 285 L218 312 L212 312 L212 285 L208 285 L208 315 L202 315 L202 285 L199 285 L199 317 L192 317 L192 285 L189 285 L189 319 L183 319 L183 285 L179 285 L179 320 L173 320 L173 285 L170 285 L170 321 L163 321 L163 285 L160 285 L160 322 L153 322 L153 285 L150 285 L150 322 L144 322 L144 285 L140 285 L140 322 L134 322 L134 285 L130 285 L130 321 L124 321 L124 285 L121 285 L121 320 L114 320 L114 285 L111 285 L111 318 L105 318 L105 285 L101 285 L101 316 L95 316 L95 285 L92 285 L92 313 L85 313 L85 285 L82 285 L82 310 L75 310 L75 285 L72 285 Z", t: 232, b: 322, pin: 240, nohw: true },
    { id: "tray-oval", name: "Oval tray", size: "big", d: "M50 215 A100 100 0 0 1 250 215 V300 A100 100 0 0 1 50 300 Z", t: 115, b: 400, pin: 120 },
    { id: "board", name: "Serving board", size: "medium", d: "M118 112 H182 V150 L205 165 H250 V405 H50 V165 H95 L118 150 Z", t: 112, b: 405, pin: 125 },
    { id: "tray-rect", name: "Rectangle tray (cut corners)", size: "big", d: "M60 205 H240 L262 227 V353 L240 375 H60 L38 353 V227 Z", t: 205, b: 375, pin: 200 },
    { id: "square-big", name: "Square", size: "big", d: "M52 190 H248 V386 H52 Z", t: 190, b: 386, pin: 170 },
    { id: "round-big", name: "Big round tray", size: "big", custom: true, d: "M22 262 A128 128 0 1 0 278 262 A128 128 0 1 0 22 262Z", t: 134, b: 390, pin: 134 },
    { id: "frame-oval", name: "Oval frame", size: "big", custom: true, d: "M30 262 A120 95 0 1 0 270 262 A120 95 0 1 0 30 262Z", t: 167, b: 357, pin: 167 },
    { id: "tray-tall", name: "Large rectangle tray", size: "big", custom: true, d: "M65 140 H235 V395 H65 Z", t: 140, b: 395, pin: 140 },
    { id: "hexagon", name: "Hexagon tray", size: "big", custom: true, d: "M150 130 L258 192 V332 L150 394 L42 332 V192 Z", t: 130, b: 394, pin: 130 },
    { id: "heart-tray", name: "Big heart tray", size: "big", custom: true, d: "M150 392 C 60 330, 26 270, 38 212 C 50 154, 122 140, 150 196 C 178 140, 250 154, 262 212 C 274 270, 240 330, 150 392 Z", t: 140, b: 392, pin: 182 },
    { id: "game-ttt", name: "Tic-tac-toe board", size: "thin", d: "M62 150 H238 V400 H62 Z", t: 150, b: 400, pin: 150, grid: { x0: 72, y0: 160, x1: 228, y1: 318, n: 3 } },
    { id: "game-chess", name: "Chess board", size: "thin", d: "M48 180 H252 V384 H48 Z", t: 180, b: 384, pin: 180, grid: { x0: 54, y0: 186, x1: 246, y1: 378, n: 8 } },
    { id: "coaster", name: "Cup stand (single)", size: "medium", nohw: true, d: "M50 262 A100 100 0 1 0 250 262 A100 100 0 1 0 50 262Z", t: 162, b: 362, pin: 162 },
    { id: "love", name: "LOVE word", size: "medium", d: "M32 250 H268 V350 H32 Z", t: 250, b: 350, pin: 250 },
    { id: "heart-stand", name: "Heart (medium)", size: "medium", d: "M150 380 C 70 325 40 270 50 225 C 60 175 125 165 150 215 C 175 165 240 175 250 225 C 260 270 230 325 150 380 Z", t: 170, b: 380, pin: 190 },
    { id: "wood-slice", name: "Wood slice", size: "medium", wood: "slice", d: "M62 250 C 60 190 110 160 170 165 C 235 170 258 215 252 275 C 248 330 220 372 160 372 C 100 372 64 322 62 250 Z", t: 160, b: 372, pin: 165 },
    { id: "wood-round", name: "Round wooden board", size: "medium", wood: "teak", d: "M135 128 H175 V175 C 235 190 262 235 262 290 C 262 355 215 395 150 395 C 85 395 38 355 38 290 C 38 235 65 190 125 175 V138 Z", t: 128, b: 395, pin: 140 },
    { id: "wood-tray", name: "Bamboo tray", size: "big", wood: "bamboo", d: "M55 150 H245 V400 H55 Z", t: 150, b: 400, pin: 150 },
    { id: "heartset", name: "Best-friend heart set (2 halves)", size: "small", d: "M142 392 C52 330 18 270 30 212 C42 154 114 140 142 196 L142 248 C158 248 158 278 142 278 Z M158 196 C186 140 258 154 270 212 C282 270 248 330 158 392 L158 278 C172 278 172 248 158 248 Z", t: 150, b: 392, pin: 190 },
    { id: "rect-tag", name: "Rectangle tag", size: "small", d: "M105 190 H195 Q205 190 205 200 V380 Q205 390 195 390 H105 Q95 390 95 380 V200 Q95 190 105 190Z", t: 190, b: 390, pin: 190 },
    { id: "wing-large", name: "Wing (large)", size: "small", d: "M150 115 C 205 150 215 270 150 395 C 85 270 95 150 150 115Z", t: 115, b: 395, pin: 125 },
    { id: "wing-small", name: "Wing (small)", size: "small", d: "M120 190 C 150 170 215 190 235 215 C 240 260 200 330 150 345 C 105 340 90 280 95 235 C 95 215 105 198 120 190Z", t: 170, b: 345, pin: 190 },
    { id: "g-starfish", name: "Starfish", size: "small", mold: "groovy", d: "M150 130L189 215L281 225L213 288L231 380L150 334L69 380L87 288L19 225L111 215Z", t: 130, b: 400, pin: 140 },
    { id: "g-shell", name: "Scallop shell", size: "small", mold: "groovy", d: "M150 395 L66 262 C 52 220 76 190 96 184 C 108 158 140 150 150 150 C 160 150 192 158 204 184 C 224 190 248 220 234 262 Z", t: 150, b: 395, pin: 160 },
    { id: "g-paw", name: "Paw print", size: "small", mold: "groovy", d: "M67 215 a28 28 0 1 0 56 0 a28 28 0 1 0 -56 0Z M112 180 a28 28 0 1 0 56 0 a28 28 0 1 0 -56 0Z M158 180 a28 28 0 1 0 56 0 a28 28 0 1 0 -56 0Z M203 215 a28 28 0 1 0 56 0 a28 28 0 1 0 -56 0Z M80 330 C 80 270 130 250 162 250 C 195 250 245 270 245 330 C 245 375 205 395 162 395 C 120 395 80 375 80 330Z", t: 152, b: 395, pin: 165 },
    { id: "g-tail", name: "Mermaid tail", size: "small", mold: "groovy", d: "M138 395 C 140 330 145 290 140 250 C 135 215 95 185 65 130 C 110 128 135 150 150 172 C 165 150 190 128 235 130 C 205 185 165 215 160 250 C 155 290 160 330 162 395Z", t: 128, b: 395, pin: 140 },
    { id: "g-jelly", name: "Jellyfish", size: "small", mold: "groovy", d: "M70 250 C 70 170 110 140 150 140 C 190 140 230 170 230 250 C 230 262 215 265 205 262 C 200 300 215 340 205 395 C 195 390 190 330 185 300 C 175 330 180 380 168 392 C 158 380 160 330 150 300 C 140 330 142 380 130 392 C 118 380 125 330 115 300 C 110 330 105 390 95 395 C 85 340 100 300 95 262 C 85 265 70 262 70 250Z", t: 140, b: 395, pin: 150 },
    { id: "g-dolphin", name: "Dolphin", size: "small", mold: "groovy", d: "M75 390 C 60 330 80 250 140 190 C 175 155 205 150 235 135 C 225 160 215 175 200 190 C 215 210 235 250 222 300 C 215 330 190 350 170 360 L 195 392 C 150 385 120 370 105 390Z", t: 135, b: 392, pin: 150 },
    { id: "bm-glass1", name: "Shattered glass bookmark (1)", size: "thin", tex: "glass", seed: 11, d: "M130 125 V400 Q130 410 140 410 H160 Q170 410 170 400 V125 Q170 115 160 115 H140 Q130 115 130 125Z", t: 115, b: 410, pin: 115 },
    { id: "bm-glass2", name: "Shattered glass bookmark (2)", size: "thin", tex: "glass", seed: 29, d: "M130 125 V400 Q130 410 140 410 H160 Q170 410 170 400 V125 Q170 115 160 115 H140 Q130 115 130 125Z", t: 115, b: 410, pin: 115 },
    { id: "bm-pebbles", name: "Pebbles bookmark", size: "thin", tex: "pebbles", seed: 5, d: "M130 125 V400 Q130 410 140 410 H160 Q170 410 170 400 V125 Q170 115 160 115 H140 Q130 115 130 125Z", t: 115, b: 410, pin: 115 },
    { id: "bm-hearts", name: "Hearts bookmark", size: "thin", tex: "hearts", seed: 8, d: "M130 125 V400 Q130 410 140 410 H160 Q170 410 170 400 V125 Q170 115 160 115 H140 Q130 115 130 125Z", t: 115, b: 410, pin: 115 },
    { id: "bm-paws", name: "Paws and bones bookmark", size: "thin", tex: "paws", seed: 3, d: "M130 125 V400 Q130 410 140 410 H160 Q170 410 170 400 V125 Q170 115 160 115 H140 Q130 115 130 125Z", t: 115, b: 410, pin: 115 },
    { id: "hairpin", name: "Butterfly bun pin", size: "thin", nohw: true, d: "M149 410 Q153 418 157 410 V215 H149 Z M157 215 C 190 165 172 118 135 112 C 105 108 92 150 106 186 C 116 207 138 216 157 215Z M153 232 C 120 228 98 250 106 276 C 116 296 144 286 153 262Z", t: 108, b: 418, pin: 130 },
    { id: "coaster-set", name: "Cup stand set (4 + holder)", size: "medium", nohw: true, set: 4, d: "M40 212 A52 52 0 1 0 144 212 A52 52 0 1 0 40 212Z M156 212 A52 52 0 1 0 260 212 A52 52 0 1 0 156 212Z M40 330 A52 52 0 1 0 144 330 A52 52 0 1 0 40 330Z M156 330 A52 52 0 1 0 260 330 A52 52 0 1 0 156 330Z", t: 160, b: 382, pin: 160 },
    { id: "coaster-stone", name: "Cup stand with stone pattern", size: "medium", nohw: true, tex: "stones", seed: 4, d: "M50 262 A100 100 0 1 0 250 262 A100 100 0 1 0 50 262Z", t: 162, b: 362, pin: 162 },
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
  { id: "bread-loaf", name: "Bread loaf" },
  { id: "donut", name: "Bear donut" },
  { id: "bear-cake", name: "Bear cake" },
  { id: "croissant", name: "Croissant" },
  { id: "ladybug", name: "Ladybug" },
  { id: "frog-green", name: "Green frog" },
  { id: "rose-champagne", name: "Champagne rose" },
  { id: "rose-pink", name: "Pink rose" },
  { id: "rose-red", name: "Red rose" },
  { id: "rose-blue", name: "Blue rose" },
  { id: "rose-purple", name: "Purple rose" },
  { id: "sunflower", name: "Sunflower" },
  { id: "gummy-bear", name: "Gummy bear" },
  { id: "shell-blue", name: "Blue shell" },
  { id: "shell-gold", name: "Gold shell" },
  { id: "cookie", name: "Cookie" },
  { id: "bow-pink", name: "Pink bow" },
  { id: "starfish-gold", name: "Gold starfish" },
  { id: "metal-wing", name: "Silver wing" },
  { id: "metal-horn", name: "Silver horn" },
  { id: "metal-moth", name: "Silver moth" },
  { id: "metal-bird", name: "Silver bird" },
];
CONFIG.smallItems.forEach((s) => {
  s.img = `images/small/${s.id}.png`;
  CONFIG.addins.push({ id: `sm-${s.id}`, name: s.name, price: 0, color: "#D4AF37", drag: true, group: "small", img: s.img, size: 32, fx: "drop-shadow(0 1px 1.2px rgba(0,0,0,0.35))" });
  CONFIG.paperFlowers.push({ id: `sm-${s.id}`, name: s.name, img: s.img });
});

// Real sea items (starfish and shells from Anna's photos). Recommended for beach and sea pieces.
CONFIG.seaItems = [
  { id: "starfish", name: "Real starfish", size: 42 },
  { id: "shell-mix1", name: "Shell mix 1", size: 44 },
  { id: "shell-mix2", name: "Shell mix 2", size: 44 },
  { id: "shell-mix3", name: "Shell mix 3", size: 44 },
  { id: "shell-mix4", name: "Shell mix 4", size: 44 },
  { id: "shell-scallop", name: "Scallop shell", size: 36 },
  { id: "shell-spiral", name: "Spiral shell", size: 30 },
];
CONFIG.seaItems.forEach((s) => {
  s.img = `images/sea/${s.id}.png`;
  CONFIG.addins.push({ id: `sea-${s.id}`, name: s.name, price: 0, color: "#D4AF37", drag: true, group: "sea", img: s.img, size: s.size, fx: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.35))" });
  CONFIG.paperFlowers.push({ id: `sea-${s.id}`, name: s.name, img: s.img });
});

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

