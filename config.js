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
    { id: "oval", name: "Oval tag", size: "small", d: "M80 230 A60 60 0 0 1 140 170 H160 A60 60 0 0 1 220 230 V335 A60 60 0 0 1 160 395 H140 A60 60 0 0 1 80 335 Z", t: 170, b: 395, pin: 150 },
    { id: "square", name: "Rounded square", size: "small", d: "M95 200 H205 Q225 200 225 220 V330 Q225 350 205 350 H95 Q75 350 75 330 V220 Q75 200 95 200 Z", t: 200, b: 350, pin: 175 },
    { id: "curved", name: "Curved tag", size: "small", d: "M85 175 C130 165 170 165 215 175 C 232 230 232 330 212 395 C170 380 130 380 88 395 C 68 330 68 230 85 175 Z", t: 170, b: 395, pin: 160 },
    { id: "halfheart-l", name: "Half heart (left)", size: "small", d: "M150 392 C 60 330 26 270 38 212 C 50 154 122 140 150 196 Z", t: 150, b: 392, pin: 195 },
    { id: "halfheart-r", name: "Half heart (right)", size: "small", d: "M150 196 C 178 140 250 154 262 212 C 274 270 240 330 150 392 Z", t: 150, b: 392, pin: 195 },
    { id: "wing", name: "Wing", size: "small", d: "M150 125 C 218 190 222 330 150 400 C 78 330 82 190 150 125 Z", t: 125, b: 400, pin: 140 },
    { id: "pen", name: "Pen", size: "small", d: "M130 130 Q150 112 170 130 V385 Q170 400 150 400 Q130 400 130 385 Z", t: 112, b: 400, pin: 125 },
    { id: "blade", name: "Blade bookmark", size: "small", d: "M150 105 C 195 200 195 340 150 410 C 105 340 105 200 150 105 Z", t: 105, b: 410, pin: 120 },
    { id: "player", name: "Music player", size: "small", d: "M85 175 H215 Q228 175 228 188 V372 Q228 385 215 385 H85 Q72 385 72 372 V188 Q72 175 85 175 Z", t: 175, b: 385, pin: 160 },
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

