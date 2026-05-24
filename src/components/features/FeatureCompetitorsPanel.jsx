import { useCallback, useEffect, useRef, useState } from 'react'
import {
  COMPETITOR_ALERTS,
  COMPETITOR_BASE_FOLLOWERS,
  COMPETITOR_BRANDS,
  COMPETITOR_DELTAS,
  createSparkHistory,
  ease,
  fmtEng,
  fmtFollowers,
  lerp,
  randInt,
} from './featureCompetitorsData'
import './featureCompetitors.css'

const INITIAL_BAR_WIDTHS = [72, 36, 88, 52]
const INITIAL_BADGES = [
  { f: '▲ 3.2%', e: '▲ 0.9%', fC: 'up', eC: 'up' },
  { f: '▼ 1.1%', e: '▼ 0.4%', fC: 'dn', eC: 'dn' },
  { f: '▲ 5.8%', e: '▲ 2.1%', fC: 'up', eC: 'up' },
  { f: '▲ 0.8%', e: '▼ 1.3%', fC: 'up', eC: 'dn' },
]
const INITIAL_BAR_PCTS = ['+3.2%', '-1.1%', '+5.8%', '+0.8%']

function makeCardDisplay(brand) {
  const badges = INITIAL_BADGES[brand.id]
  return {
    followers: fmtFollowers(brand.initialFollowers),
    eng: fmtEng(brand.initialEng),
    fBadge: badges.f,
    eBadge: badges.e,
    fBadgeClass: badges.fC,
    eBadgeClass: badges.eC,
    fDimmed: false,
    eDimmed: false,
  }
}

export default function FeatureCompetitorsPanel() {
  const brandsRef = useRef(
    COMPETITOR_BRANDS.map((b) => ({
      followers: b.initialFollowers,
      eng: b.initialEng,
    })),
  )
  const tickRef = useRef(0)
  const rafIdsRef = useRef([])
  const timeoutIdsRef = useRef([])

  const [sparkHistories, setSparkHistories] = useState(() =>
    COMPETITOR_BRANDS.map(() => createSparkHistory()),
  )
  const [cardDisplays, setCardDisplays] = useState(() =>
    COMPETITOR_BRANDS.map((b) => makeCardDisplay(b)),
  )
  const [barWidths, setBarWidths] = useState(INITIAL_BAR_WIDTHS)
  const [barPcts, setBarPcts] = useState(INITIAL_BAR_PCTS)
  const [barPctOpacity, setBarPctOpacity] = useState(() => COMPETITOR_BRANDS.map(() => 1))
  const [alerts, setAlerts] = useState({})

  const animNum = useCallback((i, field, from, to, duration, fmt) => {
    const start = performance.now()
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const val = lerp(from, to, ease(p))
      setCardDisplays((prev) => {
        const next = [...prev]
        next[i] = { ...next[i], [field]: fmt(val) }
        return next
      })
      if (p < 1) {
        const id = requestAnimationFrame(step)
        rafIdsRef.current.push(id)
      }
    }
    const id = requestAnimationFrame(step)
    rafIdsRef.current.push(id)
  }, [])

  const flashBadge = useCallback((i, field, updateFn) => {
    const dimKey = field === 'f' ? 'fDimmed' : 'eDimmed'
    setCardDisplays((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], [dimKey]: true }
      return next
    })
    const id = setTimeout(() => {
      setCardDisplays((prev) => {
        const next = [...prev]
        const updated = updateFn(next[i])
        next[i] = { ...updated, [dimKey]: false }
        return next
      })
    }, 170)
    timeoutIdsRef.current.push(id)
  }, [])

  const updateCard = useCallback(
    (i) => {
      const d = COMPETITOR_DELTAS[i]
      const fd = d.fDelta()
      const ed = d.eDelta()
      const brand = brandsRef.current[i]
      const newF = Math.max(50000, brand.followers + fd)
      const newE = Math.max(1, Math.min(18, brand.eng + ed))
      const fUp = fd >= 0
      const eUp = ed >= 0
      const oldF = brand.followers
      const oldE = brand.eng
      brandsRef.current[i] = { followers: newF, eng: newE }

      animNum(i, 'followers', oldF, newF, 800, fmtFollowers)
      animNum(i, 'eng', oldE, newE, 800, fmtEng)

      flashBadge(i, 'f', (card) => ({
        ...card,
        fBadge: `${fUp ? '▲' : '▼'} ${Math.abs((fd / oldF) * 100).toFixed(1)}%`,
        fBadgeClass: fUp ? 'up' : 'dn',
      }))
      flashBadge(i, 'e', (card) => ({
        ...card,
        eBadge: `${eUp ? '▲' : '▼'} ${Math.abs(ed).toFixed(1)}%`,
        eBadgeClass: eUp ? 'up' : 'dn',
      }))
    },
    [animNum, flashBadge],
  )

  const tickSparks = useCallback(() => {
    setSparkHistories((prev) => prev.map((hist) => [...hist.slice(1), randInt(20, 90)]))
  }, [])

  const updateBars = useCallback(() => {
    const growths = brandsRef.current.map(
      (b, i) => ((b.followers - COMPETITOR_BASE_FOLLOWERS[i]) / COMPETITOR_BASE_FOLLOWERS[i]) * 100,
    )
    const vals = growths.map((g) => Math.max(5, Math.min(98, 50 + g * 8)))
    setBarWidths(vals)
    setBarPctOpacity(COMPETITOR_BRANDS.map(() => 0))
    const id = setTimeout(() => {
      setBarPcts(growths.map((g) => `${g >= 0 ? '+' : ''}${g.toFixed(1)}%`))
      setBarPctOpacity(COMPETITOR_BRANDS.map(() => 1))
    }, 200)
    timeoutIdsRef.current.push(id)
  }, [])

  const showAlert = useCallback((cardIdx) => {
    const text = COMPETITOR_ALERTS[randInt(0, COMPETITOR_ALERTS.length - 1)]
    setAlerts((prev) => ({ ...prev, [cardIdx]: { text, phase: 'in' } }))
    const id1 = setTimeout(() => {
      setAlerts((prev) => {
        if (!prev[cardIdx]) return prev
        return { ...prev, [cardIdx]: { ...prev[cardIdx], phase: 'out' } }
      })
      const id2 = setTimeout(() => {
        setAlerts((prev) => {
          const next = { ...prev }
          delete next[cardIdx]
          return next
        })
      }, 320)
      timeoutIdsRef.current.push(id2)
    }, 2500)
    timeoutIdsRef.current.push(id1)
  }, [])

  useEffect(() => {
    COMPETITOR_BRANDS.forEach((_, i) => {
      timeoutIdsRef.current.push(setTimeout(() => updateCard(i), 400 + i * 300))
    })

    const interval = setInterval(() => {
      const i = tickRef.current % 4
      updateCard(i)
      tickSparks()
      updateBars()
      if (tickRef.current % 2 === 0) showAlert(randInt(1, 3))
      tickRef.current += 1
    }, 2200)

    return () => {
      clearInterval(interval)
      timeoutIdsRef.current.forEach(clearTimeout)
      rafIdsRef.current.forEach(cancelAnimationFrame)
    }
  }, [updateCard, tickSparks, updateBars, showAlert])

  return (
    <div className="feature-competitors-viewport" aria-hidden>
      <div className="feature-competitors-shell">
        <div className="fc-tbar">
          <div className="fc-dot" style={{ background: '#ff5f57' }} />
          <div className="fc-dot" style={{ background: '#ffbd2e' }} />
          <div className="fc-dot" style={{ background: '#28c840' }} />
          <div className="fc-tbar-title">Metriwo · Competitors</div>
          <div className="fc-tbar-live">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Live
          </div>
        </div>

        <div className="fc-body">
          <div className="fc-hrow">
            <div className="fc-htitle">Market Watch</div>
            <div className="fc-period-pills">
              <div className="fc-pill off">7d</div>
              <div className="fc-pill on">30d</div>
              <div className="fc-pill off">90d</div>
            </div>
          </div>

          <div className="fc-cards-grid">
            {COMPETITOR_BRANDS.map((brand, i) => {
              const display = cardDisplays[i]
              const history = sparkHistories[i]
              const mx = Math.max(...history)
              const alert = alerts[brand.id]

              return (
                <div
                  key={brand.id}
                  id={`fc-card-${brand.id}`}
                  className={`fc-comp-card${brand.isYou ? ' you' : ''}`}
                >
                  {brand.isYou && <div className="fc-you-badge">You</div>}
                  {alert && (
                    <div className={`fc-alert-pill${alert.phase === 'out' ? ' out' : ''}`}>
                      <span className="fc-alert-dot" />
                      {alert.text}
                    </div>
                  )}
                  <div className="fc-brand-row">
                    <div className="fc-brand-logo" style={brand.logoStyle}>
                      {brand.logo}
                    </div>
                    <div>
                      <div className="fc-brand-name">{brand.name}</div>
                      <div className="fc-brand-handle">{brand.handle}</div>
                    </div>
                  </div>
                  <div className="fc-stat-row">
                    <div className="fc-mini-stat">
                      <div className="fc-mini-label">Followers</div>
                      <div className="fc-mini-val">{display.followers}</div>
                      <div
                        className={`fc-mini-badge ${display.fBadgeClass}${display.fDimmed ? ' fc-dimmed' : ''}`}
                      >
                        {display.fBadge}
                      </div>
                    </div>
                    <div className="fc-mini-stat">
                      <div className="fc-mini-label">Eng. Rate</div>
                      <div className="fc-mini-val">{display.eng}</div>
                      <div
                        className={`fc-mini-badge ${display.eBadgeClass}${display.eDimmed ? ' fc-dimmed' : ''}`}
                      >
                        {display.eBadge}
                      </div>
                    </div>
                  </div>
                  <div className="fc-spark">
                    {history.map((h, j) => {
                      const pct = (h / mx) * 100
                      return (
                        <div
                          key={j}
                          className="fc-sb"
                          style={{
                            height: `${pct}%`,
                            background: brand.sparkColor,
                            opacity: 0.3 + (pct / 100) * 0.7,
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="fc-compare-section">
            <div className="fc-compare-title">Follower Growth · 30 days</div>
            {COMPETITOR_BRANDS.map((brand, i) => (
              <div key={brand.id} className="fc-compare-row">
                <div
                  className="fc-comp-row-logo"
                  style={brand.compareRowLogoStyle ?? brand.logoStyle}
                >
                  {brand.logo}
                </div>
                <div
                  className="fc-comp-row-name"
                  style={brand.compareNameStyle}
                >
                  {brand.name}
                </div>
                <div className="fc-bar-track">
                  <div
                    className="fc-bar-fill"
                    style={{
                      width: `${barWidths[i]}%`,
                      background: brand.barColor,
                      animationDelay: `${0.1 + i * 0.1}s`,
                    }}
                  />
                </div>
                <div className="fc-bar-pct" style={{ opacity: barPctOpacity[i] }}>
                  {barPcts[i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
