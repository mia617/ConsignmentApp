import { useState, useEffect } from 'react'
import { loadGoogleAuth, initTokenClient, requestToken, signOut } from '../lib/googleSheets.js'
import { callAnalysis, callListing } from '../lib/claude.js'
import { LUXURY_CATEGORIES, LOCAL_CATEGORIES, SHOT_GUIDES } from '../lib/constants.js'
import Step1Photos from './Step1Photos.jsx'
import Step2Review  from './Step2Review.jsx'
import Step3Listing from './Step3Listing.jsx'

export default function IntakeApp() {
  const [googleReady,  setGoogleReady]  = useState(false)
  const [googleAuthed, setGoogleAuthed] = useState(false)

  const [tab,      setTab]      = useState('luxury')
  const [category, setCategory] = useState('bags')
  const [step,     setStep]     = useState(1)
  const [consignor, setConsignor] = useState(
    () => localStorage.getItem('last_consignor') || ''
  )

  const [images,    setImages]    = useState([])
  const [analysis,  setAnalysis]  = useState(null)
  const [listing,   setListing]   = useState(null)
  const [confirmed, setConfirmed] = useState(null)
  const [draftRow,  setDraftRow]  = useState(null)

  const [loading,     setLoading]     = useState(false)
  const [listLoading, setListLoading] = useState(false)
  const [error,       setError]       = useState(null)

  const isLuxury   = tab === 'luxury'
  const accent     = isLuxury ? '#1D1B18' : '#0D6B5E'
  const categories = isLuxury ? LUXURY_CATEGORIES : LOCAL_CATEGORIES

  const handleConsignorChange = (val) => {
    setConsignor(val)
    localStorage.setItem('last_consignor', val)
  }

  // ── Google Auth ────────────────────────────────────────────────
  useEffect(() => {
    loadGoogleAuth().then(() => {
      initTokenClient(
        () => setGoogleAuthed(true),
        () => setGoogleAuthed(false)
      )
      setGoogleReady(true)
    })
  }, [])

  // Reset when tab changes
  useEffect(() => {
    setCategory(isLuxury ? 'bags' : 'furniture')
    setStep(1); setAnalysis(null); setListing(null); setImages([])
    setDraftRow(null); setError(null)
  }, [tab])

  // ── Step 1 → 2: Analyse photos ────────────────────────────────
  const handlePhotosNext = async (uploadedImages) => {
    setImages(uploadedImages)
    setLoading(true)
    setError(null)
    try {
      const shotGuide = SHOT_GUIDES[category] || []
      const result = await callAnalysis(uploadedImages, tab, category, shotGuide)
      setAnalysis(result)
      setStep(2)
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2 → 3: Generate listings ─────────────────────────────
  const handleReviewNext = async (confirmedDetails, savedDraftRow) => {
    setConfirmed(confirmedDetails)
    setDraftRow(savedDraftRow)
    setListLoading(true)
    setError(null)
    try {
      const result = await callListing(tab, category, confirmedDetails)
      setListing(result)
      setStep(3)
    } catch (err) {
      setError(err.message || 'Listing generation failed. Please try again.')
    } finally {
      setListLoading(false)
    }
  }

  const startOver = () => {
    setStep(1); setAnalysis(null); setListing(null)
    setImages([]); setDraftRow(null); setError(null)
  }

  // ── Auth gate ──────────────────────────────────────────────────
  if (!googleAuthed) {
    return (
      <div style={s.authGate}>
        <div style={s.authCard}>
          <div style={{ ...s.authLogo, background: accent }}>R</div>
          <h1 style={s.authTitle}>Resell Ready</h1>
          <p style={s.authSub}>AI-powered consignment intake assistant</p>
          <p style={s.authDesc}>Sign in with Google to connect your tracker and start intake.</p>
          <button
            style={{ ...s.authBtn, background: accent, opacity: googleReady ? 1 : 0.5 }}
            onClick={() => googleReady && requestToken()}
            disabled={!googleReady}>
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  const stepLabels = ['Photos', 'Review', 'Listing']

  return (
    <div style={s.root}>
      {/* ── HEADER ── */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={{ ...s.logo, background: accent }}>R</div>
          <div>
            <div style={s.appName}>Resell Ready</div>
            <div style={s.appSub}>AI-powered resale intake</div>
          </div>
        </div>
        <div style={s.headerRight}>
          <div style={s.tabPill}>
            <button
              style={{ ...s.tabBtn, ...(isLuxury ? s.tabActiveLux : {}) }}
              onClick={() => setTab('luxury')}>
              👑 Luxury
            </button>
            <button
              style={{ ...s.tabBtn, ...(!isLuxury ? s.tabActiveLocal : {}) }}
              onClick={() => setTab('local')}>
              🏠 Local
            </button>
          </div>
          <button style={s.signOutBtn} onClick={() => { signOut(); setGoogleAuthed(false) }}>
            Sign out
          </button>
        </div>
      </div>

      {/* ── STEP PROGRESS ── */}
      <div style={s.stepBar}>
        {stepLabels.map((label, idx) => {
          const num    = idx + 1
          const active = step === num
          const done   = step > num
          return (
            <div key={label} style={s.stepItem}>
              <div style={{
                ...s.stepCircle,
                background: done ? '#22C55E' : active ? accent : '#EDE8DF',
                color: done || active ? '#fff' : '#A79B8A',
                border: `2px solid ${done ? '#22C55E' : active ? accent : '#EDE8DF'}`,
              }}>
                {done ? '✓' : num}
              </div>
              <div style={{
                ...s.stepLabel,
                color: active ? accent : done ? '#22C55E' : '#A79B8A',
                fontWeight: active ? 700 : 400,
              }}>
                {label}
              </div>
              {idx < 2 && (
                <div style={{ ...s.stepLine, background: done ? '#22C55E' : '#EDE8DF' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* ── ERROR ── */}
      {error && (
        <div style={s.errBox}>
          <strong>Error:</strong> {error}
          <button style={s.errDismiss} onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* ── CONTENT ── */}
      <div style={s.content}>
        {(loading || listLoading) ? (
          <div style={s.loadingCard}>
            <div style={s.spinner} />
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1D1B18', marginTop: 16 }}>
              {loading ? 'Analysing your photos…' : 'Generating listings…'}
            </div>
            <div style={{ fontSize: 12, color: '#A79B8A', marginTop: 6 }}>
              {loading
                ? 'Identifying item, checking confidence, reviewing photo coverage'
                : 'Researching live pricing, writing optimized FB and Kijiji listings'}
            </div>
          </div>
        ) : (
          <>
            {step === 1 && (
              <Step1Photos
                tab={tab}
                category={category}
                setCategory={setCategory}
                categories={categories}
                onNext={handlePhotosNext}
                loading={loading}
              />
            )}
            {step === 2 && analysis && (
              <Step2Review
                tab={tab}
                category={category}
                analysis={analysis}
                consignor={consignor}
                onConsignorChange={handleConsignorChange}
                onNext={handleReviewNext}
                onBack={() => setStep(1)}
                googleAuthed={googleAuthed}
              />
            )}
            {step === 3 && listing && (
              <Step3Listing
                tab={tab}
                listing={listing}
                itemDetails={confirmed}
                draftRow={draftRow}
                onBack={() => setStep(2)}
                onNewItem={startOver}
                googleAuthed={googleAuthed}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

const s = {
  root: { minHeight: '100dvh', background: '#F7F5F0', fontFamily: "'Inter', system-ui, sans-serif", maxWidth: 680, margin: '0 auto' },

  authGate: { minHeight: '100dvh', background: '#F7F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  authCard: { background: '#fff', borderRadius: 28, border: '1px solid #EDE8DF', padding: '40px 32px', textAlign: 'center', maxWidth: 380, width: '100%', boxShadow: '0 4px 40px rgba(0,0,0,0.06)' },
  authLogo: { width: 56, height: 56, borderRadius: '50%', color: '#fff', fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  authTitle: { fontSize: 28, fontWeight: 700, color: '#1D1B18', margin: '0 0 6px', letterSpacing: '-0.02em' },
  authSub: { fontSize: 13, color: '#A79B8A', margin: '0 0 16px' },
  authDesc: { fontSize: 14, color: '#5C5147', margin: '0 0 24px', lineHeight: 1.6 },
  authBtn: { width: '100%', padding: '14px 0', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.2s' },

  header: { background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #EDE8DF', position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap', gap: 10 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  logo: { width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff', flexShrink: 0 },
  appName: { fontSize: 16, fontWeight: 700, color: '#1D1B18', letterSpacing: '-0.01em' },
  appSub: { fontSize: 10, color: '#A79B8A', letterSpacing: '0.08em', textTransform: 'uppercase' },
  headerRight: { display: 'flex', alignItems: 'center', gap: 8 },

  tabPill: { display: 'flex', background: '#F0EBE3', borderRadius: 20, padding: 3 },
  tabBtn: { padding: '6px 14px', borderRadius: 18, border: 'none', fontSize: 12, fontWeight: 600, color: '#7A746B', cursor: 'pointer', background: 'transparent', transition: 'all 0.15s', fontFamily: 'inherit' },
  tabActiveLux:   { background: '#1D1B18', color: '#fff' },
  tabActiveLocal: { background: '#0D6B5E', color: '#fff' },
  signOutBtn: { fontSize: 11, color: '#A79B8A', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 8px' },

  stepBar: { display: 'flex', alignItems: 'center', padding: '14px 24px', background: '#fff', borderBottom: '1px solid #EDE8DF' },
  stepItem: { display: 'flex', alignItems: 'center', flex: 1 },
  stepCircle: { width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 },
  stepLabel: { fontSize: 12, marginLeft: 8, whiteSpace: 'nowrap' },
  stepLine: { flex: 1, height: 2, marginLeft: 8, borderRadius: 1 },

  errBox: { background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '10px 16px', fontSize: 13, color: '#DC2626', margin: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  errDismiss: { background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', fontSize: 16, padding: 0 },

  content: { padding: '16px 20px 40px' },

  loadingCard: { background: '#fff', borderRadius: 24, border: '1px solid #EDE8DF', padding: '48px 32px', textAlign: 'center', boxShadow: '0 2px 20px rgba(0,0,0,0.03)' },
  spinner: { width: 40, height: 40, border: '3px solid #F0EBE3', borderTop: '3px solid #1D1B18', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' },
}
