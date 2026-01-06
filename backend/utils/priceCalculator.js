// backend/utils/priceCalculator.js

const PRICING_DATA = {
  grayscale: {
    A4: {
      "75gsm": { single: 1.0, double: 0.65 },
      "100gsm": { single: 1.5, double: 1.0 },
      bond_100: { single: 1.5, double: 1.0 },
    },
    fls: {
      "75gsm": { single: 1.3, double: 1.0 },
      green_90: { single: 2.0, double: 1.5 },
    },
    A3: {
      "75gsm": { single: 3.0, double: 2.0 },
      "100gsm": { single: 4.0, double: 3.0 },
    },
  },
  color: {
    A4: {
      "100gsm": { single: 8.0, double: 6.0 },
      "130gsm": { single: 9.0, double: 7.0 },
      "170gsm": { single: 10.0, double: 8.0 },
      "270gsm": { single: 12.0, double: 8.0 },
      photo_180: { single: 12.0, double: 0 },
      gold_300: { single: 22.0, double: 15.0 },
    },
    A3: {
      "75gsm": { single: 11.0, double: 8.0 },
      "100gsm": { single: 11.0, double: 8.0 },
      "130gsm": { single: 11.0, double: 8.5 },
      "170gsm": { single: 12.0, double: 9.0 },
      "270gsm": { single: 14.0, double: 10.0 },
    },
    "Sticker 12x18": {
      "130gsm": { single: 12.0, double: 9.0 },
      "170gsm": { single: 13.0, double: 9.5 },
      "270gsm": { single: 14.0, double: 10.0 },
      sticker_170: { single: 14.0, double: 0 },
    },
    "Sticker 13x19": {
      "130gsm": { single: 13.0, double: 9.0 },
      "170gsm": { single: 14.0, double: 10.5 },
      "270gsm": { single: 15.0, double: 11.5 },
      sticker_170: { single: 15.0, double: 0 },
      sticker_clear: { single: 30.0, double: 0 },
      sticker_pvc: { single: 30.0, double: 0 },
      "Non Tearable": { single: 45.0, double: 0 },
      sticker_gold: { single: 45.0, double: 0 },
      sticker_silver: { single: 45.0, double: 0 },
    },
    A2: {
      line_90: { single: 40.0, double: 0 },
      img_90: { single: 80.0, double: 0 },
    },
    A1: {
      line_90: { single: 80.0, double: 0 },
      img_90: { single: 160.0, double: 0 },
    },
    A0: {
      line_90: { single: 160.0, double: 0 },
      img_90: { single: 290.0, double: 0 },
    },
  },
  binding: {
    none: 0,
    corner: 0,
    spiral_binding: 40,
    wiro: 60,
    soft: 30,
    hard_morocco: 100,
    perfect: 100,
    hard_lam: 100,
    rexin: 250,
  },
};

const calculateBackendPrice = (pages, copies, options) => {
  try {
    const { printType, size, media, sides, binding, lamination, cover } =
      options;

    // 1. Base Print Rate Check
    const typeData = PRICING_DATA[printType];
    if (!typeData) throw new Error(`Invalid printType: ${printType}`);

    const sizeData = typeData[size];
    if (!sizeData) throw new Error(`Invalid size: ${size} for ${printType}`);

    const mediaData = sizeData[media];
    if (!mediaData) throw new Error(`Invalid media: ${media} for size ${size}`);

    const rate =
      sides === "double" && mediaData.double > 0
        ? mediaData.double
        : mediaData.single;

    let total = pages * rate * copies;

    // 2. Binding & Finishing
    const restrictedSizes = [
      "A0",
      "A1",
      "A2",
      "A3",
      "fls",
      "Sticker 12x18",
      "Sticker 13x19",
    ];
    if (!restrictedSizes.includes(size)) {
      const bindCost = PRICING_DATA.binding[binding] || 0;
      total += bindCost * copies;

      if (binding !== "none" && binding !== "corner") {
        if (lamination !== "None") total += 20 * copies;
        if (cover !== "No Cover Page") total += 50 * copies;
      }
    }

    return Math.round(total * 100) / 100; // Standardize to 2 decimals
  } catch (err) {
    console.error("[DEBUG-CALC-ERR]", err.message);
    return -1; // Error indicator
  }
};

module.exports = { calculateBackendPrice };
