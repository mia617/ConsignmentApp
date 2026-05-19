import { useState, useRef } from 'react'
import { SHOT_GUIDES } from '../lib/constants.js'
import { toBase64 } from '../lib/claude.js'

export default function Step1Photos({ tab, category, setCategory, categories, onNext, loading }) {
  const [shotPhotos, setShotPhotos] = useState({})
  const shots = SHOT_GUIDES[category] || []
  const completed = shots.filter(s => shotPhotos[s.id]).length
  const progress = shots.length ? Math.round((completed / shots.length) * 100) : 0
  const isLuxury = tab === 'luxury'
  const accent = isLuxury ? '#1D1B18' : '#0D6B5E'

  const addPhoto = async (shotId, file) => {
    if (!file) return
    const b64 = await toBase64(file)
    setShotPhotos(prev => ({
      ...prev,
      [shotId]: { preview: URL.createObjectURL(file), b64, type: file.type, file }
    }))
  }

  const handleNext = () => {
    const images = Object.values(shotPhotos)
    if (!images.length) return
    onNext(images, shotPhotos)
  }

  return (
    <div style={s.root}>
      {/* Header card */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <div>
            <div style={s.eyebrow}>Guided Intake</div>
            <h2 style={s.cardTitle}>Let's get great photos</h2>
            <p style={s.cardSub}>Follow the guide below. You can add up to {shots.length} photos.</p>
          </div>
          <div style={{ ...s.progressPill, background: progress === 100 ? '#DCFCE7' : '#F6F2EC', color: progress === 100 ? '#166534' : '#8A7E6B' }}>
            {progress === 100 ? '✓ Complete' : `${progress}% Complete`}
          </div>
        </div>

        {/* Progress bar */}
        <div style={s.progressTrack}>
          <div style={{ ...s.progressFill, width: `${progress}%`, background: progress === 100 ? '#22C55E' : accent }} />
        </div>
      </div>

      {/* Category selector */}
      <div style={s.card}>
        <div style={s.eyebrow}>Categories</div>
        <div style={s.categoryRow}>
          {categories.map(cat => (
            <button key={cat.id}
              style={{
                ...s.catBtn,
                border: category === cat.id ? `2px solid ${accent}` : '2px solid #EDE8DF',
                background: category === cat.id ? (isLuxury ? '#1D1B18' : '#0D6B5E') : '#fff',
                color: category === cat.id ? '#fff' : '#555',
              }}
              onClick={() => setCategory(cat.id)}>
              <span style={{ fontSize: 18 }}>{cat.icon}</span>
              <span style={{ fontSize: 11, marginTop: 3 }}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Shot guide */}
      <div style={s.card}>
        <div style={s.shotHeader}>
          <div style={s.eyebrow}>{category.charAt(0).toUpperCase() + category.slice(1)} photo guide ({shots.length} photos)</div>
          <button style={{ ...s.viewGuideBtn, color: accent }}>📖 View guide</button>
        </div>

        <div style={s.shotGrid}>
          {shots.map((shot, idx) => {
            const photo = shotPhotos[shot.id]
            return (
              <div key={shot.id} style={{ ...s.shotCard, borderColor: photo ? accent : '#EDE8DF' }}>
                {/* Example / uploaded image */}
                <div style={s.shotImgWrap}>
                  {photo ? (
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                      <img src={photo.preview} alt="" style={s.shotImgUploaded} />
                      <div style={s.shotDoneBadge}>✓</div>
                    </div>
                  ) : (
                    <img src={shot.example} alt={shot.label} style={s.shotImgExample} />
                  )}
                </div>

                {/* Label */}
                <div style={s.shotInfo}>
                  <div style={s.shotNum}>{idx + 1}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: photo ? accent : '#1D1B18' }}>
                      {shot.label}
                    </div>
                    <div style={{ fontSize: 10, color: '#9A8A78', marginTop: 2 }}>
                      {photo ? 'Looks great' : shot.tip}
                    </div>
                  </div>
                  <label style={{ ...s.addBtn, borderColor: photo ? accent : '#D6CEC3', color: photo ? accent : '#666', cursor: 'pointer', marginLeft: 'auto' }}>
                    {photo ? '↺' : '+'}
                    <input type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => { if (e.target.files[0]) addPhoto(shot.id, e.target.files[0]) }} />
                  </label>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add more */}
        <label style={{ ...s.addMoreBtn, borderColor: '#EDE8DF', cursor: 'pointer' }}>
          <span style={{ fontSize: 20 }}>📷</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1D1B18' }}>Add more photos</div>
            <div style={{ fontSize: 11, color: '#9A8A78' }}>Click or tap to upload</div>
          </div>
          <input type="file" accept="image/*" multiple style={{ display: 'none' }}
            onChange={e => {
              Array.from(e.target.files).forEach((f, i) => {
                const unfilledShot = shots.find(sh => !shotPhotos[sh.id])
                if (unfilledShot) addPhoto(unfilledShot.id, f)
              })
            }} />
        </label>

        {/* Tip */}
        <div style={{ ...s.tipBar, borderColor: isLuxury ? '#EDE8DF' : '#CCFBF1', background: isLuxury ? '#FAFAF7' : '#F0FDFA' }}>
          <span style={{ color: isLuxury ? '#C9A84C' : '#0D9488' }}>✦</span>
          <span style={{ fontSize: 12, color: isLuxury ? '#8A7E6B' : '#0D6B5E' }}>
            {isLuxury
              ? 'Tip: Natural light, no filters, clear and close-up shots sell faster.'
              : 'Tip: Good lighting and all angles help buyers feel confident.'}
          </span>
        </div>
      </div>

      {/* How it works */}
      <div style={s.howCard}>
        {[
          { icon: '📷', title: '1. Take guided photos', desc: 'Follow our simple photo guide for your item category.' },
          { icon: '✦', title: '2. AI analyzes your item', desc: 'We identify details, estimate value, and suggest a price range.' },
          { icon: '🏷', title: '3. Get listing ready', desc: 'Review, edit, and generate optimized listings for local marketplaces.' },
        ].map(step => (
          <div key={step.title} style={s.howStep}>
            <span style={{ fontSize: 24 }}>{step.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1D1B18', marginBottom: 3 }}>{step.title}</div>
              <div style={{ fontSize: 11, color: '#9A8A78', lineHeight: 1.5 }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      {Object.keys(shotPhotos).length > 0 && (
        <button
          style={{ ...s.nextBtn, background: loading ? '#E5E0D8' : accent, color: loading ? '#999' : '#fff', cursor: loading ? 'not-allowed' : 'pointer' }}
          onClick={handleNext} disabled={loading}>
          {loading ? '⟳ Analysing photos…' : `Analyse ${completed} Photo${completed !== 1 ? 's' : ''} →`}
        </button>
      )}
    </div>
  )
}

const s = {
  root: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: { background: '#fff', borderRadius: 24, border: '1px solid #EDE8DF', padding: '20px', boxShadow: '0 2px 20px rgba(0,0,0,0.03)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  eyebrow: { fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A79B8A', marginBottom: 6, fontWeight: 600 },
  cardTitle: { fontSize: 22, fontWeight: 700, color: '#1D1B18', margin: '0 0 4px', letterSpacing: '-0.01em' },
  cardSub: { fontSize: 13, color: '#7A746B', margin: 0 },
  progressPill: { fontSize: 12, padding: '6px 14px', borderRadius: 20, fontWeight: 600, flexShrink: 0 },
  progressTrack: { height: 5, background: '#F0EBE3', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, transition: 'width 0.4s ease' },

  categoryRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 },
  catBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '10px 12px', borderRadius: 12, cursor: 'pointer', minWidth: 60, transition: 'all 0.15s', fontFamily: 'inherit' },

  shotHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  viewGuideBtn: { fontSize: 12, fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 },
  shotGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 },
  shotCard: { borderRadius: 16, border: '1.5px solid', overflow: 'hidden', background: '#FAFAF8', transition: 'all 0.2s' },
  shotImgWrap: { aspectRatio: '4/3', overflow: 'hidden', background: '#F2ECE4', position: 'relative' },
  shotImgExample: { width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 },
  shotImgUploaded: { width: '100%', height: '100%', objectFit: 'cover' },
  shotDoneBadge: { position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: '50%', background: '#22C55E', color: '#fff', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  shotInfo: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px' },
  shotNum: { width: 20, height: 20, borderRadius: '50%', background: '#F0EBE3', fontSize: 10, fontWeight: 700, color: '#8A7E6B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  addBtn: { width: 28, height: 28, borderRadius: 8, border: '1.5px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 'bold', background: '#fff', flexShrink: 0 },

  addMoreBtn: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: '1.5px dashed', borderRadius: 16, background: '#FAFAF8', marginBottom: 12 },
  tipBar: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, border: '1px solid', fontSize: 12 },

  howCard: { background: '#fff', borderRadius: 24, border: '1px solid #EDE8DF', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 2px 20px rgba(0,0,0,0.03)' },
  howStep: { display: 'flex', alignItems: 'flex-start', gap: 14 },

  nextBtn: { width: '100%', padding: '16px 0', border: 'none', borderRadius: 16, fontSize: 15, fontWeight: 700, letterSpacing: '0.01em', fontFamily: 'inherit', transition: 'all 0.2s', display: 'block' },
}
