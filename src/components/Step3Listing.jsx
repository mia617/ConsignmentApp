import { useState } from 'react'
import { calcLocalFee, calcLuxuryFee, LUXURY_COMMISSION } from '../lib/constants.js'
import { finalizeListing } from '../lib/googleSheets.js'

const fmt = n => n ? `$${Math.round(n).toLocaleString()}` : '—'

export default function Step3Listing({ tab, listing, itemDetails, draftRow, onBack, onNewItem, googleAuthed }) {
  const [copied, setCopied]       = useState(null)
  const [finalizing, setFinalizing] = useState(false)
  const [finalized, setFinalized]   = useState(false)
  const [finalError, setFinalError] = useState(null)
  const [activeTab, setActiveTab]   = useState('fb')

  const isLuxury = tab === 'luxury'
  const accent   = isLuxury ? '#1D1B18' : '#0D6B5E'

  // Commission calc
  const recPrice = listing.price_recommended || 0
  const luxFee   = isLuxury ? calcLuxuryFee(recPrice) : null
  const localFee = !isLuxury ? calcLocalFee(recPrice) : null

  const copy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleFinalize = async () => {
    if (!googleAuthed || !draftRow) return
    setFinalizing(true)
    try {
      await finalizeListing(tab, draftRow, listing, itemDetails)
      setFinalized(true)
    } catch (err) {
      setFinalError(err.message)
    } finally {
      setFinalizing(false)
    }
  }

  return (
    <div style={s.root}>

      {/* Price card */}
      <div style={s.card}>
        <div style={s.eyebrow}>AI Pricing Research</div>
        <div style={s.priceGrid}>
          <PriceBox label="Fast Sale" value={fmt(listing.price_fast_sale)} sub="Sells 1–2 weeks" muted />
          <PriceBox label="Recommended" value={fmt(listing.price_recommended)} sub={`~${listing.days_to_sell_estimate || '?'} days`} accent={accent} highlight />
          <PriceBox label="Optimistic" value={fmt(listing.price_optimistic)} sub="If patient" muted />
        </div>
        {listing.reference_url && /^https?:\/\//i.test(listing.reference_url) && (
          <a href={listing.reference_url} target="_blank" rel="noreferrer" style={{ ...s.refLink, color: accent }}>
            View comparable listing ↗
          </a>
        )}
      </div>

      {/* Platform recommendation */}
      <div style={{ ...s.card, background: isLuxury ? '#1D1B18' : '#0D3D38' }}>
        <div style={{ ...s.eyebrow, color: isLuxury ? '#A79B8A' : '#5EEAD4' }}>Best Platform</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{listing.best_platform}</div>
        <div style={{ fontSize: 13, color: isLuxury ? '#C9C1B5' : '#99F6E4', lineHeight: 1.6, marginBottom: 12 }}>
          {listing.best_platform_reason}
        </div>
        {listing.seller_tip && (
          <div style={s.sellerTip}>
            <span style={{ fontWeight: 700, color: '#F59E0B' }}>Expert tip: </span>
            <span style={{ color: '#FEF3C7' }}>{listing.seller_tip}</span>
          </div>
        )}
        {listing.buyer_psychology && (
          <div style={{ ...s.sellerTip, background: 'rgba(255,255,255,0.06)', marginTop: 8 }}>
            <span style={{ fontWeight: 700, color: '#93C5FD' }}>Buyer insight: </span>
            <span style={{ color: '#DBEAFE' }}>{listing.buyer_psychology}</span>
          </div>
        )}
      </div>

      {/* Commission breakdown */}
      <div style={{ ...s.card, background: isLuxury ? '#FAFAF7' : '#F0FDFA', borderColor: isLuxury ? '#EDE8DF' : '#CCFBF1' }}>
        <div style={s.eyebrow}>Commission Breakdown</div>
        <div style={s.commRow}>
          <span style={s.commLabel}>Sale price</span>
          <span style={s.commVal}>{fmt(recPrice)}</span>
        </div>
        {isLuxury && luxFee && (
          <>
            <div style={s.commRow}>
              <span style={s.commLabel}>Platform fee (~12%)</span>
              <span style={{ ...s.commVal, color: '#EF4444' }}>−{fmt(luxFee.platformFee)}</span>
            </div>
            <div style={s.commRow}>
              <span style={s.commLabel}>Net after fees</span>
              <span style={s.commVal}>{fmt(luxFee.net)}</span>
            </div>
            <div style={s.commDivider} />
            <div style={s.commRow}>
              <span style={s.commLabel}>Your cut (35%)</span>
              <span style={{ ...s.commVal, color: '#16A34A', fontWeight: 700, fontSize: 16 }}>{fmt(luxFee.yourCut)}</span>
            </div>
            <div style={s.commRow}>
              <span style={s.commLabel}>Owner payout</span>
              <span style={{ ...s.commVal, color: '#2563EB', fontWeight: 700, fontSize: 16 }}>{fmt(luxFee.ownerPay)}</span>
            </div>
          </>
        )}
        {!isLuxury && localFee && (
          <>
            <div style={s.commRow}>
              <span style={s.commLabel}>Commission ({localFee.type})</span>
              <span style={{ ...s.commVal, color: '#16A34A', fontWeight: 700, fontSize: 16 }}>{fmt(localFee.yourCut)}</span>
            </div>
            <div style={s.commRow}>
              <span style={s.commLabel}>Owner payout</span>
              <span style={{ ...s.commVal, color: '#2563EB', fontWeight: 700, fontSize: 16 }}>{fmt(localFee.ownerPay)}</span>
            </div>
          </>
        )}
      </div>

      {/* Listings */}
      <div style={s.card}>
        <div style={s.eyebrow}>Generated Listings</div>
        <h2 style={s.cardTitle}>Ready to Post</h2>

        {/* Tab switcher */}
        <div style={s.listingTabs}>
          <button style={{ ...s.listingTab, ...(activeTab === 'fb' ? { background: accent, color: '#fff', border: `1px solid ${accent}` } : {}) }}
            onClick={() => setActiveTab('fb')}>📘 Facebook</button>
          <button style={{ ...s.listingTab, ...(activeTab === 'kijiji' ? { background: accent, color: '#fff', border: `1px solid ${accent}` } : {}) }}
            onClick={() => setActiveTab('kijiji')}>🟢 Kijiji</button>
          <button style={{ ...s.listingTab, ...(activeTab === 'seo' ? { background: accent, color: '#fff', border: `1px solid ${accent}` } : {}) }}
            onClick={() => setActiveTab('seo')}>🔎 SEO</button>
        </div>

        {activeTab === 'fb' && (
          <div style={s.listingBlock}>
            <div style={s.listingSection}>
              <div style={s.listingLabel}>Title</div>
              <div style={s.listingTitle}>{listing.fb_title}</div>
              <button style={s.copyBtn} onClick={() => copy(listing.fb_title, 'fb_title')}>
                {copied === 'fb_title' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div style={s.listingSection}>
              <div style={s.listingLabel}>Description</div>
              <div style={s.listingBody}>{listing.fb_description}</div>
              <button style={s.copyBtn} onClick={() => copy(listing.fb_description, 'fb_desc')}>
                {copied === 'fb_desc' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'kijiji' && (
          <div style={s.listingBlock}>
            <div style={s.listingSection}>
              <div style={s.listingLabel}>Title</div>
              <div style={s.listingTitle}>{listing.kijiji_title}</div>
              <button style={s.copyBtn} onClick={() => copy(listing.kijiji_title, 'kij_title')}>
                {copied === 'kij_title' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div style={s.listingSection}>
              <div style={s.listingLabel}>Description</div>
              <div style={s.listingBody}>{listing.kijiji_description}</div>
              <button style={s.copyBtn} onClick={() => copy(listing.kijiji_description, 'kij_desc')}>
                {copied === 'kij_desc' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div style={s.listingBlock}>
            <div style={s.listingLabel}>Search Tags</div>
            <div style={s.seoTags}>
              {(listing.seo_keywords || '').split(',').map((tag, i) => (
                <span key={i} style={s.seoTag}>{tag.trim()}</span>
              ))}
            </div>
            <button style={s.copyBtn} onClick={() => copy(listing.seo_keywords, 'seo')}>
              {copied === 'seo' ? '✓ Copied' : 'Copy All Tags'}
            </button>
          </div>
        )}
      </div>

      {/* Finalize */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button style={s.backBtn} onClick={onBack}>← Edit</button>
        <button style={{
          ...s.finalBtn,
          background: finalized ? '#DCFCE7' : accent,
          color: finalized ? '#166534' : '#fff',
          border: finalized ? '1.5px solid #86EFAC' : 'none',
          opacity: finalizing ? 0.7 : 1,
          cursor: (!googleAuthed || !draftRow) ? 'not-allowed' : 'pointer',
        }}
          onClick={handleFinalize}
          disabled={finalizing || finalized || !googleAuthed || !draftRow}>
          {finalizing ? '⟳ Saving…' : finalized ? '✓ Saved to Tracker!' : '⊞ Finalize to Tracker'}
        </button>
      </div>

      {finalError && <div style={s.errBox}>{finalError}</div>}

      {finalized && (
        <button style={s.newItemBtn} onClick={onNewItem}>
          + Start New Item
        </button>
      )}
    </div>
  )
}

function PriceBox({ label, value, sub, accent, highlight, muted }) {
  return (
    <div style={{
      flex: 1,
      background: highlight ? '#FAFAF7' : '#F7F5F0',
      border: highlight ? `2px solid ${accent}` : '1.5px solid #EDE8DF',
      borderRadius: 16,
      padding: '14px 12px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: muted ? '#A79B8A' : accent, fontWeight: 700, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: highlight ? 24 : 18, fontWeight: 700, color: highlight ? accent : '#5C5147', letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 10, color: '#A79B8A', marginTop: 4 }}>{sub}</div>
    </div>
  )
}

const s = {
  root: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: { background: '#fff', borderRadius: 24, border: '1px solid #EDE8DF', padding: 20, boxShadow: '0 2px 20px rgba(0,0,0,0.03)' },
  eyebrow: { fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A79B8A', marginBottom: 8, fontWeight: 600 },
  cardTitle: { fontSize: 20, fontWeight: 700, color: '#1D1B18', margin: '0 0 14px', letterSpacing: '-0.01em' },

  priceGrid: { display: 'flex', gap: 10, marginBottom: 12 },
  refLink: { fontSize: 12, fontWeight: 600, textDecoration: 'none' },

  sellerTip: { background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 14px', fontSize: 12, lineHeight: 1.65 },

  commRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  commLabel: { fontSize: 13, color: '#7A746B' },
  commVal: { fontSize: 14, fontWeight: 600, color: '#1D1B18', fontFamily: 'monospace' },
  commDivider: { height: 1, background: '#EDE8DF', margin: '8px 0' },

  listingTabs: { display: 'flex', gap: 6, marginBottom: 16 },
  listingTab: { flex: 1, padding: '8px 0', background: '#F7F5F0', border: '1px solid #EDE8DF', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#7A746B', transition: 'all 0.15s' },
  listingBlock: { display: 'flex', flexDirection: 'column', gap: 12 },
  listingSection: { background: '#FAFAF8', border: '1px solid #EDE8DF', borderRadius: 14, padding: '12px 14px' },
  listingLabel: { fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#A79B8A', fontWeight: 700, marginBottom: 6 },
  listingTitle: { fontSize: 14, fontWeight: 700, color: '#1D1B18', marginBottom: 10, lineHeight: 1.4 },
  listingBody: { fontSize: 13, color: '#5C5147', lineHeight: 1.7, marginBottom: 10 },
  copyBtn: { background: '#F0EBE3', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#5C5147', fontFamily: 'inherit' },

  seoTags: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  seoTag: { background: '#F0EBE3', borderRadius: 8, padding: '4px 10px', fontSize: 11, color: '#5C5147' },

  backBtn: { padding: '13px 18px', background: '#fff', border: '1.5px solid #EDE8DF', borderRadius: 14, fontSize: 13, color: '#7A746B', cursor: 'pointer', fontFamily: 'inherit' },
  finalBtn: { flex: 1, padding: '14px 0', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.2s' },
  errBox: { background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#DC2626' },
  newItemBtn: { width: '100%', padding: '14px 0', background: '#F7F5F0', border: '1.5px solid #EDE8DF', borderRadius: 14, fontSize: 14, fontWeight: 600, color: '#5C5147', cursor: 'pointer', fontFamily: 'inherit' },
}
