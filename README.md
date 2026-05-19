# Resell Ready — Consignment Intake App

Mobile-first PWA for consignment photo intake, item identification, and Google Sheets tracking.

## Features
- 📷 Native camera access on mobile
- ✦ Luxury tab — shoes, bags, jewellery → Vestiaire, Poshmark, eBay, Facebook
- ⌂ Local tab — furniture, appliances, electronics → Facebook Marketplace + Kijiji Calgary
- ✅ Photo checklists with auto-detection of missing shots
- 🤖 Claude AI identification + pricing research
- 📊 One-tap save directly to Google Sheets tracker
- 📱 Installable as PWA on iPhone/Android home screen

---

## Setup & Deployment

### 1. Clone / push to GitHub
Push this folder to a new GitHub repo called `consignment-app`.

### 2. Create Vercel project
1. Go to vercel.com → New Project
2. Import your GitHub repo
3. Framework: Vite (auto-detected)
4. Click Deploy

### 3. Add your Vercel URL to Google OAuth
1. Go to console.cloud.google.com → APIs & Services → Credentials
2. Edit your OAuth Client ID
3. Add your Vercel URL to "Authorised JavaScript origins":
   `https://your-app-name.vercel.app`
4. Save

### 4. Update config.js (already done)
Your credentials are already set in `src/config.js`:
- Google OAuth Client ID ✓
- Google Sheet ID ✓

### 5. Set your Anthropic API key
When you open the app, tap ⚙ and enter your Anthropic API key.
It's stored locally on your device — never sent anywhere except Anthropic.

---

## Install on iPhone
1. Open your Vercel URL in Safari
2. Tap the Share button → "Add to Home Screen"
3. Name it "Resell Ready" → Add
4. Opens like a native app with no browser chrome

## Install on Android
1. Open your Vercel URL in Chrome
2. Tap the three-dot menu → "Add to Home screen"
3. Done

---

## Google Sheets Structure
The app writes to these sheet tabs:
- **Inventory** — luxury items (shoes, bags, jewellery)
- **Local Inventory** — furniture, appliances, electronics
- **Payout Log** — luxury sales payout tracking
- **Local Payout Log** — local sales payout tracking

---

## Development
```bash
npm install
npm run dev
```
App runs at http://localhost:5173

## Build
```bash
npm run build
```

---

## Commission Structure
**Luxury:** 35% of net sale (after platform fee)

**Local (Facebook/Kijiji):**
- Sale under $200 → flat $25 fee
- Sale $200–$500 → 20% commission
- Sale over $500 → 15% commission
# v2
