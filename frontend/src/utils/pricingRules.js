// utils/pricingRules.js

export const PRICING_DATA = {
    grayscale: {
        A4: {
            '75gsm': { name: 'A4 Paper (75 GSM)', single: 1.00, double: 0.65 },
            '100gsm': { name: 'A4 Paper (100 GSM)', single: 1.50, double: 1.00 },
            'bond_100': { name: 'A4 100 Bond (100 GSM)', single: 1.50, double: 1.00 },
        },
        fls: {
            '75gsm': { name: 'FLS Standard (75 GSM)', single: 1.30, double: 1.00 },
            'green_90': { name: 'FLS Green Paper (90 GSM)', single: 2.00, double: 1.50 },
        },
        A3: {
            '75gsm': { name: 'A3 Paper (75 GSM)', single: 3.00, double: 2.00 },
            '100gsm': { name: 'A3 Paper (100 GSM)', single: 4.00, double: 3.00 },
        }
    },
    color: {
        A4: {
            '100gsm': { name: 'A4 Paper (100 GSM)', single: 8.00, double: 6.00 },
            '130gsm': { name: 'A4 Paper (130 GSM)', single: 9.00, double: 7.00 },
            '170gsm': { name: 'A4 Paper (170 GSM)', single: 10.00, double: 8.00 },
            '270gsm': { name: 'A4 Paper (270 GSM)', single: 12.00, double: 8.00 },
            'photo_180': { name: 'A4 Photo Paper (180 GSM)', single: 12.00, double: 0 },
            'gold_300': { name: 'A4 Special Board Gold (300 GSM)', single: 22.00, double: 15.00 },
        },
        A3: {
            '75gsm': { name: 'A3 Paper (75 GSM)', single: 11.00, double: 8.00 },
            '100gsm': { name: 'A3 Paper (100 GSM)', single: 11.00, double: 8.00 },
            '130gsm': { name: 'A3 Art Paper 12x18 (130 GSM)', single: 11.00, double: 8.50 },
            '170gsm': { name: 'A3 Art Paper 12x18 (170 GSM)', single: 12.00, double: 9.00 },
            '270gsm': { name: 'A3 Art Paper 12x18 (270 GSM)', single: 14.00, double: 10.00 },
        },
        'Sticker 12x18': {
            '130gsm': { name: 'A4 Art Paper 12x18 (130 GSM)', single: 12.00, double: 9.00 },
            '170gsm': { name: 'A4 Art Paper 12x18 (170 GSM)', single: 13.00, double: 9.50 },
            '270gsm': { name: 'A4 Art Paper 12x18 (270 GSM)', single: 14.00, double: 10.00 },
            'sticker_170': { name: 'Sticker 12x18 (170 GSM)', single: 14.00, double: 0 },
        },
        'Sticker 13x19': {
            '130gsm': { name: 'Art Paper 13x19 (130 GSM)', single: 13.00, double: 9.00 },
            '170gsm': { name: 'Art Paper 13x19 (170 GSM)', single: 14.00, double: 10.50 },
            '270gsm': { name: 'Art Paper 13x19 (270 GSM)', single: 15.00, double: 11.50 },
            'sticker_170': { name: 'Sticker 13x19 (170 GSM)', single: 15.00, double: 0 },
            'sticker_clear': { name: 'Clear Sticker 13x19 (170 GSM)', single: 30.00, double: 0 },
            'sticker_pvc': { name: 'PVC White Sticker 13x19 (170 GSM)', single: 30.00, double: 0 },
            'Non Tearable': { name: 'Non Tearable 13x19 (170 GSM)', single: 45.00, double: 0 },
            'sticker_gold': { name: 'Gold Sticker 13x19 (170 GSM)', single: 45.00, double: 0 },
            'sticker_silver': { name: 'Silver Sticker 13x19 (170 GSM)', single: 45.00, double: 0 },
        },
        A2: {
            'line_90': { name: 'A2 Plans Line Drawings (90 GSM)', single: 40.00, double: 0 },
            'img_90': { name: 'A2 Plans Images (90 GSM)', single: 80.00, double: 0 },
            'cloth': { name: 'A2 Plans Cloth (90 GSM)', single: 175.00, double: 0 },
            'glossy': { name: 'A2 Photo Glossy (90 GSM)', single: 200.00, double: 0 },
        },
        A1: {
            'line_90': { name: 'A1 Plans Line Drawings (90 GSM)', single: 80.00, double: 0 },
            'img_90': { name: 'A1 Plans Images (90 GSM)', single: 160.00, double: 0 },
            'cloth': { name: 'A1 Plans Cloth (90 GSM)', single: 375.00, double: 0 },
            'glossy': { name: 'A1 Photo Glossy (90 GSM)', single: 400.00, double: 0 },
        },
        A0: {
            'line_90': { name: 'A0 Plans Line Drawings (90 GSM)', single: 160.00, double: 0 },
            'img_90': { name: 'A0 Plans Images (90 GSM)', single: 290.00, double: 0 },
            'cloth': { name: 'A0 Plans Cloth (90 GSM)', single: 700.00, double: 0 },
            'glossy': { name: 'A0 Photo Glossy (90 GSM)', single: 800.00, double: 0 },
        }
    },
    binding: {
        none: { name: 'Loose Sheets', cost: 0 },
        corner: { name: 'Corner Stapling', cost: 0 },
        spiral_binding: { name: 'Spiral Binding', cost: 40 },
        wiro: { name: 'Wiro Binding', cost: 60 },
        soft: { name: 'Soft Binding', cost: 30 },
        hard_morocco: { name: 'Hard Binding (Morocco)', cost: 100 },
        perfect: { name: 'Perfect Binding', cost: 100 },
        hard_lam: { name: 'Hard Binding (Lam)', cost: 100 },
        rexin: { name: 'Rexin Binding', cost: 250 },
    }
};

export const calculateItemPrice = (pages, copies, options) => {
    const { printType, size, media, sides, binding, lamination, cover } = options;

    // 1. Base Print Rate
    const mediaData = PRICING_DATA[printType]?.[size]?.[media];
    if (!mediaData) return 0;

    const rate = (sides === 'double' && mediaData.double > 0) ? mediaData.double : mediaData.single;
    let total = pages * rate * copies;

    // 2. Binding Cost (Restriction: No binding for large sizes)
    const restrictedSizes = ['A0', 'A1', 'A2', 'A3', 'fls', 'Sticker 12x18', 'Sticker 13x19'];
    if (!restrictedSizes.includes(size)) {
        const bindCost = PRICING_DATA.binding[binding]?.cost || 0;
        total += (bindCost * copies);

        // 3. Finishing Costs (Only if binding is selected)
        if (binding !== 'none' && binding !== 'corner') {
            if (lamination !== 'None') total += (20 * copies);
            if (cover !== 'No Cover Page') total += (50 * copies);
        }
    }

    return total;
};