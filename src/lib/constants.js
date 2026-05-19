// ── CATEGORIES ────────────────────────────────────────────────────────────────

export const LUXURY_CATEGORIES = [
  { id: 'bags',        label: 'Bags',        icon: '👜' },
  { id: 'shoes',       label: 'Shoes',       icon: '👟' },
  { id: 'jewellery',   label: 'Jewellery',   icon: '💎' },
  { id: 'watches',     label: 'Watches',     icon: '⌚' },
  { id: 'clothing',    label: 'Clothing',    icon: '👗' },
  { id: 'accessories', label: 'Accessories', icon: '🧣' },
]

export const LOCAL_CATEGORIES = [
  { id: 'furniture',   label: 'Furniture',   icon: '🪑' },
  { id: 'homedecor',   label: 'Home Décor',  icon: '🏠' },
  { id: 'electronics', label: 'Electronics', icon: '📱' },
  { id: 'appliances',  label: 'Appliances',  icon: '🍳' },
  { id: 'outdoor',     label: 'Outdoor',     icon: '🌿' },
  { id: 'other',       label: 'Other',       icon: '📦' },
]

// ── SHOT GUIDES ───────────────────────────────────────────────────────────────

export const SHOT_GUIDES = {
  // LUXURY
  bags: [
    { id: 'front',    label: 'Front',           tip: 'Straight on, well lit',           example: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=70' },
    { id: 'side',     label: 'Side',            tip: 'Full side profile',               example: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=70' },
    { id: 'back',     label: 'Back',            tip: 'Full back panel',                 example: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=70' },
    { id: 'bottom',   label: 'Bottom',          tip: 'Base of the bag',                 example: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=70' },
    { id: 'interior', label: 'Interior',        tip: 'Open bag showing lining',         example: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=70' },
    { id: 'logo',     label: 'Logo / Brand',    tip: 'Close-up of logo or stamp',       example: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=70' },
    { id: 'hardware', label: 'Hardware',        tip: 'Clasps, zips, chains',            example: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=70' },
    { id: 'auth',     label: 'Authenticity',    tip: 'Auth card, serial, receipt',      example: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=70' },
    { id: 'overall',  label: 'Overall',         tip: 'Both views together with dustbag',example: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=70' },
  ],
  shoes: [
    { id: 'hero',     label: 'Hero Shot',       tip: 'Both shoes angled together',      example: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=70' },
    { id: 'side',     label: 'Side Profile',    tip: 'Outer side of each shoe',         example: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=70' },
    { id: 'front',    label: 'Front',           tip: 'Both shoes facing camera',        example: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&q=70' },
    { id: 'back',     label: 'Back / Heel',     tip: 'Both shoes from behind',          example: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=300&q=70' },
    { id: 'topdown',  label: 'Top Down',        tip: 'Looking straight down at both',   example: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&q=70' },
    { id: 'soles',    label: 'Soles',           tip: 'Both soles facing up',            example: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=70' },
    { id: 'logo',     label: 'Brand Logo',      tip: 'Insole stamp or embossing',       example: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=300&q=70' },
    { id: 'sizetag',  label: 'Size Tag',        tip: 'Insole size label',               example: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=300&q=70' },
    { id: 'overall',  label: 'Overall',         tip: 'Box, dustbag, accessories',       example: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=70' },
  ],
  jewellery: [
    { id: 'full',     label: 'Full Piece',      tip: 'Entire piece on white surface',   example: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&q=70' },
    { id: 'clasp',    label: 'Clasp',           tip: 'Close-up of clasp mechanism',     example: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&q=70' },
    { id: 'stamp',    label: 'Brand Stamp',     tip: 'e.g. CHANEL engraved on back',    example: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&q=70' },
    { id: 'passport', label: 'Auth Card',       tip: 'Passport, card, receipt',         example: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&q=70' },
    { id: 'draped',   label: 'Scale Shot',      tip: 'On surface to show scale/length', example: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&q=70' },
    { id: 'box',      label: 'Box & Extras',    tip: 'Original box, booklets, cards',   example: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=70' },
  ],
  watches: [
    { id: 'front',    label: 'Dial Face',       tip: 'Straight on, showing dial',       example: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=300&q=70' },
    { id: 'side',     label: 'Side / Crown',    tip: 'Side profile showing crown',      example: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=300&q=70' },
    { id: 'caseback', label: 'Case Back',       tip: 'Back of case with serial',        example: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=300&q=70' },
    { id: 'clasp',    label: 'Clasp / Buckle',  tip: 'Strap clasp and condition',       example: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=300&q=70' },
    { id: 'bracelet', label: 'Strap / Bracelet',tip: 'Strap condition both sides',      example: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=300&q=70' },
    { id: 'box',      label: 'Box & Papers',    tip: 'Original box, warranty, papers',  example: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=70' },
  ],
  clothing: [
    { id: 'front',    label: 'Front',           tip: 'Flat lay or on hanger',           example: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=70' },
    { id: 'back',     label: 'Back',            tip: 'Full back view',                  example: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=70' },
    { id: 'label',    label: 'Care Label',      tip: 'Size, brand, material label',     example: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=70' },
    { id: 'detail',   label: 'Detail Shot',     tip: 'Buttons, zips, texture',          example: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=70' },
    { id: 'flaws',    label: 'Condition',       tip: 'Any wear, pilling, marks',        example: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=70' },
  ],
  accessories: [
    { id: 'front',    label: 'Front',           tip: 'Main face, well lit',             example: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=70' },
    { id: 'back',     label: 'Back',            tip: 'Reverse side',                    example: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=70' },
    { id: 'logo',     label: 'Brand Label',     tip: 'Logo or brand marking',           example: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=70' },
    { id: 'detail',   label: 'Detail',          tip: 'Hardware, texture, pattern',      example: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=70' },
    { id: 'flaws',    label: 'Condition',       tip: 'Any wear or marks',               example: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=70' },
  ],

  // LOCAL
  furniture: [
    { id: 'front',    label: 'Front',           tip: 'Straight on in good light',       example: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=70' },
    { id: 'side',     label: 'Side',            tip: 'Full side profile',               example: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=70' },
    { id: 'back',     label: 'Back',            tip: 'Show full back panel',            example: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=70' },
    { id: 'top',      label: 'Top',             tip: 'Surface condition',               example: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=70' },
    { id: 'drawers',  label: 'Drawers Open',    tip: 'Inside drawers/storage',          example: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=70' },
    { id: 'detail',   label: 'Details',         tip: 'Hardware, texture, joints',       example: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=70' },
    { id: 'flaws',    label: 'Condition',       tip: 'Scratches, stains, damage',       example: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=70' },
    { id: 'label',    label: 'Label / Maker',   tip: 'Brand tag or maker mark',         example: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=70' },
    { id: 'inroom',   label: 'In Room',         tip: 'In situ to show scale',           example: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=70' },
  ],
  homedecor: [
    { id: 'front',    label: 'Front',           tip: 'Main face, well lit',             example: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&q=70' },
    { id: 'sides',    label: 'All Sides',       tip: 'Multiple angles',                 example: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&q=70' },
    { id: 'label',    label: 'Brand / Label',   tip: 'Any maker marks or labels',       example: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&q=70' },
    { id: 'flaws',    label: 'Condition',       tip: 'Chips, cracks, wear',             example: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&q=70' },
    { id: 'inroom',   label: 'In Room',         tip: 'Styled in context',               example: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&q=70' },
  ],
  electronics: [
    { id: 'front',    label: 'Screen On',       tip: 'Powered on showing it works',     example: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=70' },
    { id: 'back',     label: 'Back Panel',      tip: 'Full back with any labels',       example: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=70' },
    { id: 'ports',    label: 'Ports',           tip: 'All ports and connections',       example: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=70' },
    { id: 'serial',   label: 'Serial / Model',  tip: 'Model number tag',               example: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=70' },
    { id: 'screen',   label: 'Screen Condition',tip: 'Dead pixels, scratches',          example: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=70' },
    { id: 'extras',   label: 'Accessories',     tip: 'Cables, remote, manual, box',    example: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=70' },
  ],
  appliances: [
    { id: 'front',    label: 'Front',           tip: 'Clean front view',                example: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70' },
    { id: 'open',     label: 'Door Open',       tip: 'Interior condition',              example: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70' },
    { id: 'interior', label: 'Interior',        tip: 'Drum, shelves, racks, burners',   example: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70' },
    { id: 'panel',    label: 'Control Panel',   tip: 'All dials, buttons, display',     example: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70' },
    { id: 'model',    label: 'Model Tag',       tip: 'Inside door, back, or base',      example: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70' },
    { id: 'flaws',    label: 'Condition',       tip: 'Dents, scratches, damage',        example: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70' },
    { id: 'working',  label: 'Powered On',      tip: 'Show it works',                   example: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70' },
  ],
  outdoor: [
    { id: 'front',    label: 'Front',           tip: 'Main view in good light',         example: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=70' },
    { id: 'sides',    label: 'All Sides',       tip: 'Multiple angles',                 example: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=70' },
    { id: 'detail',   label: 'Material',        tip: 'Fabric, metal, wood condition',   example: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=70' },
    { id: 'flaws',    label: 'Wear / Rust',     tip: 'Any damage or weathering',        example: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=70' },
    { id: 'label',    label: 'Brand Tag',       tip: 'Any maker or brand marks',        example: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=70' },
  ],
  other: [
    { id: 'front',    label: 'Front',           tip: 'Main view',                       example: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&q=70' },
    { id: 'back',     label: 'Back',            tip: 'Reverse side',                    example: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&q=70' },
    { id: 'label',    label: 'Label / Tag',     tip: 'Brand, model, or size info',      example: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&q=70' },
    { id: 'detail',   label: 'Detail',          tip: 'Key feature or condition',        example: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&q=70' },
    { id: 'flaws',    label: 'Condition',       tip: 'Any wear or damage',              example: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&q=70' },
  ],
}

// ── CONDITIONS ────────────────────────────────────────────────────────────────
export const LUXURY_CONDITIONS  = ['New – Never Worn', 'Excellent', 'Very Good', 'Good', 'Fair']
export const LOCAL_CONDITIONS   = ['Like New', 'Excellent', 'Good – Minor Wear', 'Fair – Visible Wear', 'For Parts / As-Is']

// ── COMMISSION ────────────────────────────────────────────────────────────────
export const LUXURY_COMMISSION = 0.35

export function calcLocalFee(salePrice) {
  const p = Number(salePrice) || 0
  if (p < 200)  return { type: 'Flat $25',  yourCut: 25,        ownerPay: Math.max(0, p - 25) }
  if (p <= 500) return { type: '20%',       yourCut: p * 0.20,  ownerPay: p * 0.80 }
  return               { type: '15%',       yourCut: p * 0.15,  ownerPay: p * 0.85 }
}

export function calcLuxuryFee(salePrice, platformFeeRate = 0.12) {
  const p = Number(salePrice) || 0
  const net = p * (1 - platformFeeRate)
  return {
    platformFee: p * platformFeeRate,
    net,
    yourCut: net * LUXURY_COMMISSION,
    ownerPay: net * (1 - LUXURY_COMMISSION),
  }
}
