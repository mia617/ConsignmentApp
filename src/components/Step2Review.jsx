import { useState } from 'react'
import { LUXURY_CONDITIONS, LOCAL_CONDITIONS } from '../lib/constants.js'
import { saveDraft } from '../lib/googleSheets.js'

const FIELD_DEFS_LUXURY = [
  { key: 'brand',            label: 'Brand',            type: 'text' },
  { key: 'model',            label: 'Model / Style',    type: 'text' },
  { key: 'item_type',        label: 'Item Type',        type: 'text' },
  { key: 'material',         label: 'Material',         type: 'text' },
  { key: 'colour',           label: 'Colour',           type: 'text' },
  { key: 'condition',        label: 'Condition',        type: 'select' },
  { key: 'dimensions',       label: 'Dimensions',       type: 'text' },
  { key: 'accessories',      label: 'Includes',         type: 'text' },
  { key: 'visible_flaws',    label: 'Visible Flaws',    type: 'text' },
  { key: 'notable_features', label: 'Notable Features', type: 'text' },
]

const FIELD_DEFS_LOCAL = [
  { key: 'brand',            label: 'Brand / Make',     type: 'text' },
  { key: 'model',            label: 'Model Number',     type: 'text' },
  { key: 'item_type',        label: 'Item Type',        type: 'text' },
  { key: 'material',         label: 'Material',         type: 'text' },
  { key: 'colour',           label: 'Colour',           type: 'text' },
  { key: 'condition',        label: 'Condition',        type: 'select' },
  { key: 'dimensions',       label: 'Dimensions',       type: 'text' },
  { key: 'accessories',      label: 'Includes',         type: 'text' },
  { key: 'visible_flaws',    label: 'Condition Notes',  type: 'text' },
]

export default function Step2Review({
  tab, category, analysis,
  consignor, onConsignorChange,
  onNext, onBack, googleAuthed
}) {
  const [edited,   setEdited]   = useState({ ...analysis })
  const [saving,   setSaving]   = useState(false)
  const [draftRow, setDraftRow] = useState(null)
  const [saveMsg,  setSaveMsg]  = useState(null)
  const [listLoading, setListLoading] = useState(false)

  const isLuxury  = tab === 'luxury'
  const accent    = isLuxury ? '#1D1B18' : '#0D6B5E'
  const fieldDefs = isLuxury ? FIELD_DEFS_LUXURY : FIELD_DEFS_LOCAL
  const condOpts  = isLuxury ? LUXURY_CONDITIONS : LOCAL_CONDITIONS

  const update = (k, v) => setEdited(prev => ({ ...prev, [k]: v }))

  const qlScore = analysis.listing_quality_score || 0
  const qlLabel = analysis.listing_quality_label || 'Needs Work'
  const qlColor = qlScore >= 85 ? '#22C55E' : qlScore >= 65 ? '#F59E0B' : '#EF4444'
  const qlBg    = qlScore >= 85 ? '#F0FDF4' : qlScore >= 65 ? '#FFFBEB' : '#FEF2F2'

  const handleSaveDraft = async () => {
    if (!googleAuthed) return
    setSaving(true)
    try {
      const row = await saveDraft(tab, edited, consignor)
      setDraftRow(row)
      setSaveMsg('✓ Draft saved')
      setTimeout(() => setSaveMsg(null), 3000)
    } catch (err) {
      setSaveMsg(`Error: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    // Auto-save draft if not already saved, so Finalize button is never blocked
    let rowToPass = draftRow
    if (!rowToPass && googleAuthed) {
      setSaving(true)
      try {
        const row = await saveDraft(tab, edited, consignor)
        setDraftRow(row)
        rowToPass = row
      } catch (err) {
        console.warn('Auto-save draft failed:', err.message)
      } finally {
        setSaving(false)
      }
    }
    onNext(edited, rowToPass)
  }

  return (
    <div style={s.root}>

      {/* Item overview */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <div>
            <div style={s.eyebrow}>AI Analysis</div>
            <h2 style={s.cardTitle}>Review & Correct</h2>
            <p style={s.cardSub}>Edit any details the AI got wrong before generating listings.</p>
          </div>
          <div style={{
            ...s.confBadge,
            background: analysis.confidence_score >= 80 ? '#F0FDF4' : analysis.confidence_score >= 60 ? '#FFFBEB' : '#FEF2F2',
            color: analysis.confidence_score >= 80 ? '#166534' : analysis.confidence_score >= 60 ? '#92400E' : '#991B1B',
          }}>
            {analysis.confidence_score >= 80 ? '✓' : analysis.confidence_score >= 60 ? '~' : '!'} {analysis.confidence_score}% confident
          </div>
        </div>

        {/* Flags */}
        {analysis.flags?.length > 0 && (
          <div style={s.flagsBox}>
            <div style={s.flagsTitle}>⚠ Please verify these fields:</div>
            {analysis.flags.map((f, i) => (
              <div key={i} style={s.flagItem}>· {f}</div>
            ))}
          </div>
        )}

        {/* Fields */}
        <div style={s.fieldsGrid}>
          {fieldDefs.map(({ key, label, type }) => {
            const isFlagged = analysis.flags?.some(f =>
              f.toLowerCase().includes(key.split('_')[0].toLowerCase()))
            return (
              <div key={key} style={{
                ...s.fieldBox,
                borderColor: isFlagged ? '#FDE68A' : '#EDE8DF',
                background: isFlagged ? '#FFFBEB' : '#FAFAF8',
              }}>
                <label style={{ ...s.fieldLabel, color: isFlagged ? '#92400E' : '#A79B8A' }}>
                  {isFlagged ? '⚠ ' : ''}{label}
                </label>
                {type === 'select' ? (
                  <select style={s.fieldSelect} value={edited[key] || ''}
                    onChange={e => update(key, e.target.value)}>
                    <option value="">— select —</option>
                    {condOpts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input style={s.fieldInput}
                    value={edited[key] || ''}
                    onChange={e => update(key, e.target.value)}
                    placeholder="Not detected — add manually" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Listing quality */}
      <div style={{ ...s.card, background: qlBg, borderColor: qlColor + '44' }}>
        <div style={s.qlHeader}>
          <div>
            <div style={s.eyebrow}>Photo Analysis</div>
            <div style={s.qlTitle}>Listing Quality</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: qlColor, fontFamily: 'monospace' }}>
            {qlScore}/100 · {qlLabel}
          </div>
        </div>
        <div style={s.qlTrack}>
          <div style={{ ...s.qlFill, width: `${qlScore}%`, background: qlColor }} />
        </div>
        {analysis.photo_improvements?.length > 0 && (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {analysis.photo_improvements.map((imp, i) => (
              <li key={i} style={{ fontSize: 12, color: '#5C5147', lineHeight: 1.8 }}>· {imp}</li>
            ))}
          </ul>
        )}
        {analysis.photo_tip && (
          <div style={{ fontSize: 11, color: qlColor, fontStyle: 'italic', marginTop: 8 }}>
            📷 {analysis.photo_tip}
          </div>
        )}
      </div>

      {/* Missing shots */}
      {analysis.missing_shots?.length > 0 && (
        <div style={{ ...s.card, borderColor: '#FDE68A', background: '#FFFBEB' }}>
          <div style={s.eyebrow}>Missing Shots</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1D1B18', marginBottom: 10 }}>
            Add these for better pricing
          </div>
          {analysis.missing_shots.map((ms, i) => (
            <div key={i} style={s.missingItem}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>{ms.shot}</div>
              <div style={{ fontSize: 11, color: '#78350F', lineHeight: 1.5 }}>{ms.reason}</div>
            </div>
          ))}
        </div>
      )}

      {/* Consignor — simple text field with localStorage memory */}
      <div style={s.card}>
        <div style={s.eyebrow}>Consignor</div>
        <input
          style={s.consignorInput}
          value={consignor}
          onChange={e => onConsignorChange(e.target.value)}
          placeholder="Consignor name"
        />
      </div>

      {/* Actions */}
      <div style={s.actions}>
        <button style={s.backBtn} onClick={onBack}>← Back</button>
        <button
          style={{ ...s.draftBtn, borderColor: accent, color: saving ? '#999' : accent, opacity: saving ? 0.6 : 1 }}
          onClick={handleSaveDraft}
          disabled={saving || !googleAuthed}>
          {saving ? '⟳ Saving…' : saveMsg || (draftRow ? '✓ Saved' : '⊞ Save Draft')}
        </button>
        <button
          style={{ ...s.nextBtn, background: accent }}
          onClick={handleNext}>
          Generate Listings →
        </button>
      </div>
    </div>
  )
}

const s = {
  root: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: { background: '#fff', borderRadius: 24, border: '1px solid #EDE8DF', padding: 20, boxShadow: '0 2px 20px rgba(0,0,0,0.03)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  eyebrow: { fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A79B8A', marginBottom: 6, fontWeight: 600 },
  cardTitle: { fontSize: 20, fontWeight: 700, color: '#1D1B18', margin: '0 0 4px', letterSpacing: '-0.01em' },
  cardSub: { fontSize: 12, color: '#7A746B', margin: 0 },
  confBadge: { fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 20, flexShrink: 0 },

  flagsBox: { background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '10px 14px', marginBottom: 14 },
  flagsTitle: { fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 6 },
  flagItem: { fontSize: 12, color: '#78350F', lineHeight: 1.8 },

  fieldsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  fieldBox: { border: '1.5px solid', borderRadius: 12, padding: '10px 12px' },
  fieldLabel: { fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: 4 },
  fieldInput: { width: '100%', border: 'none', outline: 'none', fontSize: 13, color: '#1D1B18', background: 'transparent', fontFamily: 'inherit', padding: 0, display: 'block' },
  fieldSelect: { width: '100%', border: 'none', outline: 'none', fontSize: 13, color: '#1D1B18', background: 'transparent', fontFamily: 'inherit', padding: 0, display: 'block' },

  qlHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  qlTitle: { fontSize: 16, fontWeight: 700, color: '#1D1B18' },
  qlTrack: { height: 6, background: '#E5E0D8', borderRadius: 3, overflow: 'hidden', marginBottom: 12 },
  qlFill: { height: '100%', borderRadius: 3, transition: 'width 0.4s' },

  missingItem: { background: '#fff', borderRadius: 10, padding: '10px 12px', marginTop: 8, border: '1px solid #FDE68A' },

  consignorInput: {
    width: '100%',
    padding: '10px 12px',
    border: '1.5px solid #EDE8DF',
    borderRadius: 12,
    fontSize: 14,
    color: '#1D1B18',
    background: '#FAFAF8',
    fontFamily: 'inherit',
    outline: 'none',
    marginTop: 8,
    display: 'block',
  },

  actions: { display: 'flex', gap: 10 },
  backBtn: { padding: '13px 18px', background: '#fff', border: '1.5px solid #EDE8DF', borderRadius: 14, fontSize: 13, color: '#7A746B', cursor: 'pointer', fontFamily: 'inherit' },
  draftBtn: { flex: 1, padding: '13px 0', background: '#fff', border: '1.5px solid', borderRadius: 14, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
  nextBtn: { flex: 2, padding: '13px 0', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' },
}
