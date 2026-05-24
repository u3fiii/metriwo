import { useCallback, useEffect, useRef, useState } from 'react'
import {
  REPORT_DONUT_COLORS,
  REPORT_DONUT_DATA,
  REPORT_DONUT_LEGEND,
  REPORT_INITIAL_BAR_DATA,
  REPORT_KPI_FLICKERS,
  REPORT_KPIS,
  REPORT_WEEKS,
  randInt,
} from './featureReportsData'
import './featureReports.css'

function drawDonut(canvas) {
  const ctx = canvas.getContext('2d')
  const cx = 36
  const cy = 36
  const outer = 32
  const inner = 22
  ctx.clearRect(0, 0, 72, 72)
  const total = REPORT_DONUT_DATA.reduce((a, b) => a + b, 0)
  let start = -Math.PI / 2
  REPORT_DONUT_DATA.forEach((v, i) => {
    const slice = (v / total) * Math.PI * 2
    ctx.beginPath()
    ctx.arc(cx, cy, outer, start, start + slice)
    ctx.arc(cx, cy, inner, start + slice, start, true)
    ctx.closePath()
    ctx.fillStyle = REPORT_DONUT_COLORS[i]
    ctx.fill()
    start += slice
  })
}

export default function FeatureReportsPanel() {
  const shellRef = useRef(null)
  const donutRef = useRef(null)
  const abortRef = useRef(false)
  const animLockRef = useRef(false)
  const timeoutIdsRef = useRef([])
  const intervalIdsRef = useRef([])

  const [barData, setBarData] = useState(REPORT_INITIAL_BAR_DATA)
  const [kpis, setKpis] = useState(() =>
    REPORT_KPIS.map((k) => ({ ...k, dimmed: false })),
  )
  const [cursor, setCursor] = useState({ left: -30, top: 200 })
  const [exportPressed, setExportPressed] = useState(false)
  const [exportRipple, setExportRipple] = useState(false)
  const [btnShineRun, setBtnShineRun] = useState(false)
  const [pdfOverlay, setPdfOverlay] = useState(null)

  const clearTimers = useCallback(() => {
    timeoutIdsRef.current.forEach(clearTimeout)
    timeoutIdsRef.current = []
    intervalIdsRef.current.forEach(clearInterval)
    intervalIdsRef.current = []
  }, [])

  const wait = useCallback(
    (ms) =>
      new Promise((resolve) => {
        const id = setTimeout(resolve, ms)
        timeoutIdsRef.current.push(id)
      }),
    [],
  )

  const getPos = useCallback((selector) => {
    const el = shellRef.current?.querySelector(selector)
    const shell = shellRef.current
    if (!el || !shell) return null
    const er = el.getBoundingClientRect()
    const sr = shell.getBoundingClientRect()
    return {
      x: er.left - sr.left,
      y: er.top - sr.top,
      w: er.width,
      h: er.height,
    }
  }, [])

  const tickBars = useCallback(() => {
    setBarData((prev) =>
      prev.map((v) => Math.max(200, Math.min(900, v + randInt(-30, 50)))),
    )
  }, [])

  const showPdfExport = useCallback(
    () =>
      new Promise((resolve) => {
        setPdfOverlay({ progress: 0, label: 'Generating…', done: false, exiting: false })

        let pct = 0
        const tick = setInterval(() => {
          if (abortRef.current) {
            clearInterval(tick)
            resolve()
            return
          }
          pct += randInt(3, 8)
          if (pct >= 100) {
            pct = 100
            clearInterval(tick)
            setPdfOverlay((prev) =>
              prev ? { ...prev, progress: 100, label: 'Exporting…' } : null,
            )
            const completeId = setTimeout(() => {
              setPdfOverlay({ progress: 100, label: '', done: true, exiting: false })
              setCursor({ left: 220, top: 320 })
              const hideId = setTimeout(() => {
                setPdfOverlay((prev) => (prev ? { ...prev, exiting: true } : null))
                const removeId = setTimeout(() => {
                  setPdfOverlay(null)
                  resolve()
                }, 380)
                timeoutIdsRef.current.push(removeId)
              }, 1800)
              timeoutIdsRef.current.push(hideId)
            }, 200)
            timeoutIdsRef.current.push(completeId)
            return
          }
          setPdfOverlay((prev) => {
            if (!prev) return null
            return {
              ...prev,
              progress: pct,
              label: pct > 60 ? 'Exporting…' : 'Generating…',
            }
          })
        }, 80)
        intervalIdsRef.current.push(tick)
      }),
    [],
  )

  const runLoopRef = useRef(null)

  runLoopRef.current = async () => {
    if (animLockRef.current || abortRef.current) return
    animLockRef.current = true

    setExportPressed(false)
    setCursor({ left: 30, top: 300 })
    await wait(500)
    if (abortRef.current) return

    setCursor({ left: 120, top: 260 })
    await wait(700)
    if (abortRef.current) return
    tickBars()

    setCursor({ left: 200, top: 185 })
    await wait(600)
    if (abortRef.current) return

    const bp = getPos('#fr-export-btn')
    if (bp) {
      setCursor({ left: bp.x + bp.w * 0.3, top: bp.y + bp.h * 0.4 })
      await wait(700)
      if (abortRef.current) return

      setCursor({ left: bp.x + bp.w * 0.5, top: bp.y + bp.h * 0.5 })
      await wait(450)
      if (abortRef.current) return

      setExportPressed(true)
      setBtnShineRun(false)
      requestAnimationFrame(() => setBtnShineRun(true))
      setExportRipple(true)
      await wait(150)
      setExportPressed(false)
      await wait(310)
      setExportRipple(false)
      if (abortRef.current) return

      await wait(250)
      setCursor({ left: bp.x - 20, top: bp.y + 40 })
      await showPdfExport()
      if (abortRef.current) return
      await wait(600)
    } else {
      await wait(500)
    }

    animLockRef.current = false
    if (!abortRef.current) runLoopRef.current?.()
  }

  useEffect(() => {
    if (donutRef.current) drawDonut(donutRef.current)
  }, [])

  useEffect(() => {
    abortRef.current = false
    const startId = setTimeout(() => runLoopRef.current?.(), 800)
    timeoutIdsRef.current.push(startId)

    const kpiInterval = setInterval(() => {
      const idx = randInt(0, 3)
      const flicker = REPORT_KPI_FLICKERS[idx]
      setKpis((prev) => {
        const next = [...prev]
        next[idx] = { ...next[idx], dimmed: true }
        return next
      })
      const updateId = setTimeout(() => {
        setKpis((prev) => {
          const next = [...prev]
          next[idx] = {
            ...next[idx],
            value: flicker.fmt(flicker.val()),
            dimmed: false,
          }
          return next
        })
      }, 200)
      timeoutIdsRef.current.push(updateId)
    }, 3500)
    intervalIdsRef.current.push(kpiInterval)

    return () => {
      abortRef.current = true
      animLockRef.current = false
      clearTimers()
    }
  }, [clearTimers])

  const barMax = Math.max(...barData)

  return (
    <div className="feature-reports-viewport" aria-hidden>
      <div className="feature-reports-shell" ref={shellRef}>
        <div className="fr-tbar">
          <div className="fr-dot" style={{ background: '#ff5f57' }} />
          <div className="fr-dot" style={{ background: '#ffbd2e' }} />
          <div className="fr-dot" style={{ background: '#28c840' }} />
          <div className="fr-tbar-label">Metriwo · Reports</div>
          <div className="fr-tbar-actions">
            <div className="fr-share-btn">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0D9F6E" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share
            </div>
            <button
              id="fr-export-btn"
              type="button"
              className={`fr-export-btn${exportPressed ? ' pressed' : ''}`}
              tabIndex={-1}
            >
              <span className={`fr-btn-shine${btnShineRun ? ' run' : ''}`} />
              {exportRipple && <span className="fr-rip" />}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export PDF
            </button>
          </div>
        </div>

        <div className="fr-report-body">
          <div className="fr-rep-header">
            <div className="fr-rep-brand">
              <div className="fr-rep-logo">M</div>
              <div>
                <div className="fr-rep-title">Q2 Performance Report</div>
                <div className="fr-rep-sub">Metriwo · All platforms · Generated May 2026</div>
              </div>
            </div>
            <div className="fr-rep-period">Apr – May 2026</div>
          </div>

          <div className="fr-kpi-row">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="fr-kpi">
                <div className="fr-kpi-label">{kpi.label}</div>
                <div className={`fr-kpi-val${kpi.dimmed ? ' dimmed' : ''}`}>{kpi.value}</div>
                <div className={`fr-kpi-badge ${kpi.badgeClass}`}>{kpi.badge}</div>
              </div>
            ))}
          </div>

          <div className="fr-charts-row">
            <div className="fr-chart-block wide">
              <div className="fr-chart-title">Weekly Reach</div>
              <div className="fr-bar-chart">
                {barData.map((v, i) => {
                  const pct = (v / barMax) * 100
                  return (
                    <div key={REPORT_WEEKS[i]} className="fr-bar-col">
                      <div
                        className="fr-bar-rect"
                        style={{
                          height: `${pct}%`,
                          background: i === barData.length - 1 ? '#0D9F6E' : '#b2ddc8',
                        }}
                      />
                      <div className="fr-bar-lbl">{REPORT_WEEKS[i]}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="fr-chart-block">
              <div className="fr-chart-title">Platforms</div>
              <div className="fr-donut-wrap">
                <canvas ref={donutRef} width={72} height={72} aria-hidden />
                <div className="fr-donut-center">
                  <div className="fr-donut-num">5</div>
                  <div className="fr-donut-lbl">platforms</div>
                </div>
              </div>
              <div className="fr-donut-legend">
                {REPORT_DONUT_LEGEND.map((item) => (
                  <div key={item.label} className="fr-leg-row">
                    <div className="fr-leg-dot" style={{ background: item.color }} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {pdfOverlay && (
          <div className="fr-pdf-overlay">
            <div className={`fr-pdf-card${pdfOverlay.exiting ? ' exit' : ''}`}>
              <div className="fr-pdf-filename">
                <div className="fr-pdf-icon">PDF</div>
                <div>
                  <div>Q2_Performance_Report.pdf</div>
                  <div className="fr-pdf-meta">1 file · 3.2 MB · May 23, 2026</div>
                </div>
              </div>
              {!pdfOverlay.done ? (
                <div className="fr-progress-wrap">
                  <div className="fr-progress-track">
                    <div className="fr-progress-fill" style={{ width: `${pdfOverlay.progress}%` }} />
                  </div>
                  <div className="fr-progress-lbl">
                    <span>{pdfOverlay.label}</span>
                    <span>{pdfOverlay.progress}%</span>
                  </div>
                </div>
              ) : (
                <div className="fr-dl-badge">
                  <div className="fr-check-circle">✓</div>
                  <span>Download complete — saved to your device</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="fr-cursor" style={{ left: cursor.left, top: cursor.top }}>
          <svg width="18" height="22" viewBox="0 0 20 24" fill="none" aria-hidden>
            <path
              d="M4 1L4 18L8 14L11 20L13.5 19L10.5 13L16 13L4 1Z"
              fill="#1A1433"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
