import { CONFIG } from '../config.js'

let tokenClient  = null
let accessToken  = null

// ── AUTH ──────────────────────────────────────────────────────────────────────
export function loadGoogleAuth() {
  return new Promise(resolve => {
    if (window.google?.accounts?.oauth2) { resolve(); return }
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.onload = resolve
    document.head.appendChild(s)
  })
}

export function initTokenClient(onSuccess, onError) {
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CONFIG.GOOGLE_CLIENT_ID,
    scope: CONFIG.SCOPES,
    callback: r => {
      if (r.error) { onError(r.error); return }
      accessToken = r.access_token
      onSuccess(r)
    },
  })
}

export function requestToken() {
  if (!tokenClient) throw new Error('Token client not initialised')
  tokenClient.requestAccessToken({ prompt: '' })
}

export function isAuthenticated() { return !!accessToken }

export function signOut() {
  if (accessToken) { window.google.accounts.oauth2.revoke(accessToken); accessToken = null }
}

// ── SHEETS API HELPERS ────────────────────────────────────────────────────────
async function sheetsGet(range) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${encodeURIComponent(range)}`
  const r = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
  const d = await r.json()
  if (d.error) throw new Error(d.error.message)
  return d.values || []
}

async function sheetsPut(range, values) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`
  const r = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values })
  })
  const d = await r.json()
  if (d.error) throw new Error(d.error.message)
  return d
}

async function sheetsAppend(range, values) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values })
  })
  const d = await r.json()
  if (d.error) throw new Error(d.error.message)
  return d
}

// Consignor names stored in localStorage — no Sheets tab needed

// ── GET NEXT ROW ──────────────────────────────────────────────────────────────
async function getNextRow(sheetName) {
  const values = await sheetsGet(`${sheetName}!A:A`)
  return Math.max(values.length + 1, CONFIG.DATA_START_ROW)
}

// ── SAVE DRAFT (Step 2) ───────────────────────────────────────────────────────
export async function saveDraft(tab, analysis, consignorName) {
  const today = new Date().toISOString().split('T')[0]
  const isLuxury = tab === 'luxury'
  const sheetName = isLuxury ? CONFIG.SHEETS.LUXURY : CONFIG.SHEETS.LOCAL

  const row = isLuxury ? [
    '',                           // A: Item # (fill later)
    analysis.item_type || '',     // B: Name
    analysis.brand || '',         // C: Brand
    analysis.model || '',         // D: Model/Size
    '',                           // E: Retail
    analysis.condition || '',     // F: Condition
    '',                           // G: URL
    today,                        // H: Date Added
    consignorName || '',          // I: Owner
    [analysis.colour, analysis.material, analysis.notable_features].filter(Boolean).join(' · '),
    '',                           // K: Resale (Claude fills via Apps Script)
    '',                           // L: List Price
    '',                           // M: Cut
    '',                           // N: Owner Payout
    '',                           // O: Platform
    '',                           // P: Title
    '',                           // Q: Description
    '',                           // R: SEO
    '',                           // S: Date Listed
    'Draft',                      // T: Status
  ] : [
    '',
    analysis.item_type || '',
    analysis.brand?.split(' ')[0] || '',  // Category
    analysis.brand || '',
    analysis.model || '',
    analysis.dimensions || '',
    analysis.colour || '',
    analysis.condition || '',
    '',
    today,
    consignorName || '',
    analysis.visible_flaws || 'None visible',
    '', '', '', '', '', '', '', '', '', '', '', '',
    '',
    '',
    'Draft',
  ]

  const nextRow = await getNextRow(sheetName)
  await sheetsPut(`${sheetName}!A${nextRow}`, [row])
  return nextRow
}

// ── FINALIZE (Step 3) ─────────────────────────────────────────────────────────
export async function finalizeListing(tab, rowNumber, listing, analysis) {
  const isLuxury = tab === 'luxury'
  const sheetName = isLuxury ? CONFIG.SHEETS.LUXURY : CONFIG.SHEETS.LOCAL

  if (isLuxury) {
    // Update the gold columns + status
    const updates = [
      { range: `${sheetName}!K${rowNumber}`, value: listing.price_recommended ? `$${listing.price_recommended}` : '' },
      { range: `${sheetName}!L${rowNumber}`, value: listing.price_optimistic ? `$${listing.price_optimistic}` : '' },
      { range: `${sheetName}!O${rowNumber}`, value: listing.best_platform || '' },
      { range: `${sheetName}!P${rowNumber}`, value: listing.fb_title || '' },
      { range: `${sheetName}!Q${rowNumber}`, value: listing.fb_description || '' },
      { range: `${sheetName}!R${rowNumber}`, value: listing.seo_keywords || '' },
      { range: `${sheetName}!T${rowNumber}`, value: 'Ready to List' },
    ]
    for (const u of updates) {
      await sheetsPut(u.range, [[u.value]])
    }
  } else {
    const updates = [
      { range: `${sheetName}!M${rowNumber}`, value: listing.price_recommended ? `$${listing.price_recommended}` : '' },
      { range: `${sheetName}!R${rowNumber}`, value: listing.best_platform || '' },
      { range: `${sheetName}!S${rowNumber}`, value: listing.fb_title || '' },
      { range: `${sheetName}!T${rowNumber}`, value: listing.fb_description || '' },
      { range: `${sheetName}!U${rowNumber}`, value: listing.kijiji_title || '' },
      { range: `${sheetName}!V${rowNumber}`, value: listing.kijiji_description || '' },
      { range: `${sheetName}!W${rowNumber}`, value: listing.seo_keywords || '' },
      { range: `${sheetName}!AA${rowNumber}`, value: 'Ready to List' },
    ]
    for (const u of updates) {
      await sheetsPut(u.range, [[u.value]])
    }
  }
}
