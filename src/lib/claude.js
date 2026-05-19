// ── SYSTEM PROMPT ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Resell Ready AI — an expert resale intake, pricing, and listing assistant for luxury consignment and local marketplace selling in Calgary, Canada.

You act as a luxury authenticator, experienced reseller, consignment intake specialist, marketplace optimization expert, pricing strategist, and seller assistant.

CORE PRINCIPLES:
- Only identify details visible in the photos
- Explicitly state uncertainty instead of guessing
- Never hallucinate brands, models, or dimensions
- Never overestimate resale value or condition
- Prioritize accuracy and transparency over sounding confident
- Use phrases like "appears to be", "likely", "cannot confirm from photos", "branding resembles"

CONDITION SCALE (Luxury): New – Never Worn / Excellent / Very Good / Good / Fair
CONDITION SCALE (Local): Like New / Excellent / Good – Minor Wear / Fair – Visible Wear / For Parts / As-Is

Never overrate condition. If in doubt, rate lower.`

// ── CALL 1: PHOTO ANALYSIS ────────────────────────────────────────────────────
export function buildAnalysisPrompt(tab, category, shotGuide) {
  const shotNames = shotGuide.map(s => s.label).join(', ')
  const isLuxury = tab === 'luxury'

  return `TASK: PHASE 1 + PHASE 2 — Visual Analysis and Photo Review

Analyze the uploaded photos carefully. This is a ${isLuxury ? 'luxury' : 'local marketplace'} item in the category: ${category}.

PHASE 1 — VISUAL ANALYSIS:
Extract only what is visible. For each field, note if you cannot confirm it.

PHASE 2 — CONFIDENCE + MISSING INFO:
- Give an overall confidence score (0-100)
- List any fields you are uncertain about in the flags array
- Review which of these shots are present vs missing: ${shotNames}
- For each missing shot, explain WHY it matters for pricing or buyer trust
- Score the listing quality (0-100) based on photo coverage and quality
- Give specific photo improvement suggestions

Return ONLY valid JSON — no markdown, no backticks, no explanation:
{
  "item_type": "specific type e.g. Tote Bag / Chelsea Boot / Sectional Sofa",
  "brand": "brand name or null if not visible",
  "model": "model name if visible or null",
  "material": "primary material e.g. pebbled leather, solid oak, stainless steel",
  "colour": "primary colour(s)",
  "condition": "condition rating from the scale above",
  "dimensions": "visible or estimated dimensions or null",
  "accessories": "what is included e.g. dustbag, box, authenticity card or Unknown",
  "visible_flaws": "specific flaws visible or None visible",
  "notable_features": "key selling features e.g. gold hardware, Triomphe logo, original tags attached",
  "confidence_score": number 0-100,
  "flags": ["list of fields you are uncertain about e.g. brand not confirmed from label", "model estimated from style only"],
  "missing_shots": [
    { "shot": "shot name", "reason": "why this shot matters for pricing or buyer trust" }
  ],
  "listing_quality_score": number 0-100,
  "listing_quality_label": "Strong (85+) / Good (65-84) / Needs Work (under 65)",
  "photo_improvements": ["max 3 specific actionable suggestions"],
  "photo_tip": "one sentence overall feedback on the photo set"
}`
}

// ── CALL 2: PRICING + LISTINGS ────────────────────────────────────────────────
export function buildListingPrompt(tab, category, itemDetails) {
  const isLuxury = tab === 'luxury'

  const detailsStr = Object.entries(itemDetails)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')

  return `TASK: PHASE 3 + PHASE 4 — Pricing Research and Listing Generation

Item details (confirmed by seller):
${detailsStr}

Category: ${category} (${isLuxury ? 'Luxury' : 'Local Calgary marketplace'})

PHASE 3 — PRICING + MARKET INTELLIGENCE:
${isLuxury
  ? `Search Vestiaire Collective, Poshmark, The RealReal, and eBay SOLD listings for this exact item.
     Use live market data. Account for condition. Convert all USD to CAD at 1 USD = 1.36 CAD.
     Platform fee rates: Vestiaire 12%, Poshmark 20%, eBay 8% luxury, The RealReal 30%.`
  : `Search Facebook Marketplace and Kijiji Calgary for comparable items currently listed and recently sold.
     Research Canadian retail price for context. Account for local demand, condition, and pickup friction.`
}

Provide:
- price_low: conservative realistic floor
- price_recommended: optimal list price for reasonable sell speed
- price_fast_sale: price that moves it within 1-2 weeks
- price_optimistic: ceiling if patient and item is desirable
- days_to_sell_estimate: realistic number at recommended price
- best_platform: single best recommendation
- best_platform_reason: one specific sentence explaining why
- seller_tip: one expert insight this specific seller might not know — be specific to this item, brand, and market. Examples: "Chanel CC jewellery with the authenticity passport sells 40% faster on Vestiaire than without — lead with the passport photo." or "West Elm furniture moves fastest on Calgary FB Marketplace in September when people are furnishing new homes after summer moves."
- buyer_psychology: specific insight about the likely buyer for this item and how they shop. Example: "Buyers of pre-owned Prada on Vestiaire are experienced luxury shoppers who will scrutinize authentication details — they respond well to detailed provenance notes and will pay full price for clean documentation."

PHASE 4 — LISTING GENERATION:
Write listings that sound human, experienced, and trustworthy.
- No excessive emojis
- No fake urgency
- No exaggerated marketing language
- Mention flaws honestly
- Mention dimensions if available
- Mention what is included
- Sound natural and conversational
- Optimize for platform search algorithms

Return ONLY valid JSON — no markdown, no backticks, no explanation:
{
  "price_low": number CAD,
  "price_recommended": number CAD,
  "price_fast_sale": number CAD,
  "price_optimistic": number CAD,
  "days_to_sell_estimate": number,
  "best_platform": "platform name",
  "best_platform_reason": "specific one-sentence reason",
  "seller_tip": "specific expert insight for this item",
  "buyer_psychology": "specific insight about the buyer for this item",
  "fb_title": "Facebook Marketplace title max 80 chars",
  "fb_description": "Facebook listing 120-160 words casual honest local tone",
  "kijiji_title": "Kijiji title max 80 chars slightly more detail oriented",
  "kijiji_description": "Kijiji listing 160-200 words more detailed include all specs",
  "seo_keywords": "10-12 comma separated search tags optimized for platform search",
  "reference_url": "URL to a comparable sold or active listing if found or null"
}`
}

// ── API CALL (routes through Vercel serverless function) ──────────────────────
export async function callAnalysis(images, tab, category, shotGuide) {
  const prompt = buildAnalysisPrompt(tab, category, shotGuide)
  return callServer(images, prompt, SYSTEM_PROMPT)
}

export async function callListing(tab, category, itemDetails) {
  const prompt = buildListingPrompt(tab, category, itemDetails)
  return callServer([], prompt, SYSTEM_PROMPT)
}

async function callServer(images, prompt, system) {
  const response = await fetch('/api/identify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      images: images.map(img => ({ b64: img.b64, type: img.type })),
      prompt,
      system,
    })
  })

  let data
  const raw = await response.text()
  try { data = JSON.parse(raw) } catch { throw new Error(`Server error (${response.status})`) }

  if (!response.ok) throw new Error(data.error?.message || `API error ${response.status}`)

  const text  = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('')
  const clean = text.replace(/```json|```/gi, '').trim()
  const match = clean.match(/\{[\s\S]*\}/)
  if (!match) throw new Error("Couldn't parse response")

  return JSON.parse(match[0])
}

// ── FILE HELPERS ──────────────────────────────────────────────────────────────
export function toBase64(file) {
  return new Promise((res, rej) => {
    const canvas = document.createElement('canvas')
    const img = new Image()
    img.onload = () => {
      const MAX = 800
      let w = img.width, h = img.height
      if (w > h && w > MAX) { h = (h * MAX) / w; w = MAX }
      else if (h > MAX) { w = (w * MAX) / h; h = MAX }
      canvas.width = w; canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.6)
      res(dataUrl.split(',')[1])
    }
    img.onerror = rej
    img.src = URL.createObjectURL(file)
  })
}
