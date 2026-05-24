import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Calendar } from 'lucide-react'
import {
  CHART_H,
  CHART_N,
  CHART_PAD_L,
  CHART_PAD_R,
  CHART_W,
  DEMO_COLORS,
  DEMO_INIT,
  DEMO_LABELS,
  PLATFORM_BARS,
  POST_POOL,
  VIEWPORT_SCALE,
  initEngData,
  initReachData,
} from './featureAnalyticsData'
import './featureAnalytics.css'

function rand(min, max) {
  return Math.random() * (max - min) + min
}

function rInt(min, max) {
  return Math.floor(rand(min, max + 1))
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function ease(t) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
}

function normalizeDemo(vals) {
  let v = [...vals]
  const sum = v.reduce((a, b) => a + b, 0)
  v = v.map((x) => Math.round((x / sum) * 100))
  v[0] += 100 - v.reduce((a, b) => a + b, 0)
  return v
}

function buildPath(vals, minV, maxV) {
  const xs = vals.map((_, i) => CHART_PAD_L + (i / (CHART_N - 1)) * (CHART_W - CHART_PAD_L - CHART_PAD_R))
  const ys = vals.map((v) => CHART_H - ((v - minV) / (maxV - minV)) * CHART_H * 0.9 - CHART_H * 0.05)
  let d = `M${xs[0]},${ys[0]}`
  for (let i = 1; i < vals.length; i++) {
    const cx = (xs[i - 1] + xs[i]) / 2
    d += ` C${cx},${ys[i - 1]} ${cx},${ys[i]} ${xs[i]},${ys[i]}`
  }
  return { d, xs, ys }
}

function buildArea(vals, minV, maxV) {
  const { d, xs } = buildPath(vals, minV, maxV)
  return `${d} L${xs[CHART_N - 1]},${CHART_H} L${xs[0]},${CHART_H} Z`
}

function drawDonut(canvas, vals, colors) {
  const ctx = canvas.getContext('2d')
  const cx = 36
  const cy = 36
  const outer = 32
  const inner = 22
  ctx.clearRect(0, 0, 72, 72)
  const total = vals.reduce((a, b) => a + b, 0)
  let start = -Math.PI / 2
  vals.forEach((v, i) => {
    const slice = (v / total) * Math.PI * 2
    ctx.beginPath()
    ctx.arc(cx, cy, outer, start, start + slice)
    ctx.arc(cx, cy, inner, start + slice, start, true)
    ctx.closePath()
    ctx.fillStyle = colors[i]
    ctx.fill()
    start += slice
  })
}

export default function FeatureAnalyticsPanel() {
  const uid = useId().replace(/:/g, '')
  const reachRef = useRef(initReachData())
  const engRef = useRef(initEngData())
  const rxsRef = useRef([])
  const rysRef = useRef([])

  const linePathRef = useRef(null)
  const linePath2Ref = useRef(null)
  const areaPathRef = useRef(null)
  const areaPath2Ref = useRef(null)
  const dotsGroupRef = useRef(null)
  const activeDotRef = useRef(null)
  const hoverZoneRef = useRef(null)
  const tooltipRef = useRef(null)
  const chartWrapRef = useRef(null)
  const donutRef = useRef(null)

  const reachValRef = useRef(2.4)
  const followersRef = useRef(248600)
  const engValRef = useRef(8.2)
  const postsRef = useRef(142)

  const [sn0, setSn0] = useState('2.4M')
  const [sb0, setSb0] = useState({ text: '▲ 12.4%', up: true, flash: false })
  const [sn1, setSn1] = useState('248.6K')
  const [sb1, setSb1] = useState({ text: '▲ 3.2%', up: true, flash: false })
  const [sn2, setSn2] = useState('8.2%')
  const [sb2, setSb2] = useState({ text: '▲ 0.9%', up: true, flash: false })
  const [sn3, setSn3] = useState('142')
  const [sb3, setSb3] = useState({ text: '▼ 4 this wk', up: false, flash: false })
  const [bars, setBars] = useState(() => PLATFORM_BARS.map((b) => ({ ...b })))
  const [fadingBars, setFadingBars] = useState({})
  const [demo, setDemo] = useState(DEMO_INIT)
  const [donutCenter, setDonutCenter] = useState('248K')
  const [donutFading, setDonutFading] = useState(false)
  const [topPosts, setTopPosts] = useState([0, 3, 5])
  const [lineKey, setLineKey] = useState(0)

  const renderLines = useCallback(() => {
    const reachData = reachRef.current
    const engData = engRef.current
    const rMin = 0
    const rMax = 3200000
    const eMin = 0
    const eMax = 14

    const { d: rd, xs: rxs, ys: rys } = buildPath(reachData, rMin, rMax)
    const { d: ed } = buildPath(engData, eMin, eMax)

    if (linePathRef.current) linePathRef.current.setAttribute('d', rd)
    if (linePath2Ref.current) linePath2Ref.current.setAttribute('d', ed)
    if (areaPathRef.current) areaPathRef.current.setAttribute('d', buildArea(reachData, rMin, rMax))
    if (areaPath2Ref.current) areaPath2Ref.current.setAttribute('d', buildArea(engData, eMin, eMax))

    rxsRef.current = rxs
    rysRef.current = rys

    if (dotsGroupRef.current) {
      dotsGroupRef.current.innerHTML = ''
      const peakR = reachData.indexOf(Math.max(...reachData))
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      c.setAttribute('cx', String(rxs[peakR]))
      c.setAttribute('cy', String(rys[peakR]))
      c.setAttribute('r', '4')
      c.setAttribute('fill', '#5B3AFF')
      c.setAttribute('stroke', '#fff')
      c.setAttribute('stroke-width', '2')
      c.style.animation = 'fa-dot-pop 0.4s 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both'
      dotsGroupRef.current.appendChild(c)
    }
  }, [])

  useEffect(() => {
    renderLines()
    drawDonut(donutRef.current, demo, DEMO_COLORS)
  }, [renderLines, demo])

  useEffect(() => {
    const zone = hoverZoneRef.current
    const tooltip = tooltipRef.current
    const activeDot = activeDotRef.current
    if (!zone || !tooltip) return undefined

    const onMove = (e) => {
      const svg = zone.closest('svg')
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const scaleX = CHART_W / rect.width
      const mx = (e.clientX - rect.left) * scaleX
      let closest = 0
      let dist = 9999
      rxsRef.current.forEach((x, i) => {
        const d = Math.abs(x - mx)
        if (d < dist) {
          dist = d
          closest = i
        }
      })
      if (activeDot) {
        activeDot.setAttribute('cx', String(rxsRef.current[closest]))
        activeDot.setAttribute('cy', String(rysRef.current[closest]))
        activeDot.setAttribute('opacity', '1')
      }
      const r = reachRef.current[closest]
      const eng = engRef.current[closest]
      const rFmt = r >= 1000000 ? `${(r / 1000000).toFixed(1)}M` : `${Math.round(r / 1000)}K`
      tooltip.style.display = 'block'
      tooltip.textContent = `Reach: ${rFmt} · Eng: ${eng.toFixed(1)}%`
      const leftPx = (rxsRef.current[closest] / CHART_W) * rect.width
      tooltip.style.left = `${leftPx - tooltip.offsetWidth / 2}px`
      tooltip.style.top = `${(rysRef.current[closest] / CHART_H) * rect.height - 36}px`
    }

    const onLeave = () => {
      if (activeDot) activeDot.setAttribute('opacity', '0')
      tooltip.style.display = 'none'
    }

    zone.addEventListener('mousemove', onMove)
    zone.addEventListener('mouseleave', onLeave)
    return () => {
      zone.removeEventListener('mousemove', onMove)
      zone.removeEventListener('mouseleave', onLeave)
    }
  }, [lineKey])

  const animNum = useCallback((setter, from, to, dur, fmt) => {
    const start = performance.now()
    function step(now) {
      const p = Math.min((now - start) / dur, 1)
      setter(fmt(lerp(from, to, ease(p))))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [])

  const flashBadge = useCallback((setBadge, updater) => {
    setBadge((b) => ({ ...b, flash: true }))
    setTimeout(() => {
      setBadge((b) => ({ ...updater(b), flash: false }))
    }, 200)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const d = rand(-0.12, 0.18)
      const from = reachValRef.current
      const nv = Math.max(1.8, Math.min(4.2, from + d))
      const up = d >= 0
      reachValRef.current = nv
      animNum(setSn0, from * 1e6, nv * 1e6, 900, (v) => `${(v / 1e6).toFixed(1)}M`)
      flashBadge(setSb0, () => ({
        text: `${up ? '▲' : '▼'} ${Math.abs(d * 100).toFixed(1)}%`,
        up,
      }))
    }, 3500)
    return () => clearInterval(id)
  }, [animNum, flashBadge])

  useEffect(() => {
    const id = setInterval(() => {
      const d = rInt(-5000, 9000)
      const from = followersRef.current
      const nv = Math.max(200000, from + d)
      const up = d >= 0
      followersRef.current = nv
      animNum(setSn1, from, nv, 900, (v) =>
        v >= 1000 ? `${(v / 1000).toFixed(1)}K` : Math.round(v).toLocaleString(),
      )
      flashBadge(setSb1, () => ({
        text: `${up ? '▲' : '▼'} ${Math.abs((d / from) * 100).toFixed(1)}%`,
        up,
      }))
    }, 3200)
    return () => clearInterval(id)
  }, [animNum, flashBadge])

  useEffect(() => {
    const id = setInterval(() => {
      const d = rand(-0.5, 0.7)
      const from = engValRef.current
      const nv = Math.max(3, Math.min(15, from + d))
      const up = d >= 0
      engValRef.current = nv
      animNum(setSn2, from, nv, 800, (v) => `${v.toFixed(1)}%`)
      flashBadge(setSb2, () => ({
        text: `${up ? '▲' : '▼'} ${Math.abs(d).toFixed(1)}%`,
        up,
      }))
    }, 2900)
    return () => clearInterval(id)
  }, [animNum, flashBadge])

  useEffect(() => {
    const id = setInterval(() => {
      const d = rInt(-3, 6)
      const from = postsRef.current
      const nv = Math.max(80, from + d)
      const up = d >= 0
      postsRef.current = nv
      animNum(setSn3, from, nv, 600, (v) => String(Math.round(v)))
      flashBadge(setSb3, () => ({
        text: `${up ? '▲' : '▼'} ${Math.abs(d)} this wk`,
        up,
      }))
    }, 4000)
    return () => clearInterval(id)
  }, [animNum, flashBadge])

  useEffect(() => {
    const id = setInterval(() => {
      setBars((prev) =>
        prev.map((b) => ({
          ...b,
          val: Math.max(10, Math.min(98, b.val + rInt(-10, 14))),
        })),
      )
      const fade = {}
      PLATFORM_BARS.forEach((_, i) => {
        fade[i] = true
      })
      setFadingBars(fade)
      setTimeout(() => setFadingBars({}), 200)
    }, 2800)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const v = normalizeDemo([rInt(28, 42), rInt(35, 46), rInt(11, 19), rInt(6, 13)])
      setDemo(v)
      drawDonut(donutRef.current, v, DEMO_COLORS)
      v.forEach((_, i) => {
        setDonutFading(true)
      })
      setTimeout(() => {
        setDonutCenter(`${Math.round(rand(230, 280))}K`)
        setDonutFading(false)
      }, 220)
    }, 4200)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      reachRef.current.shift()
      reachRef.current.push(rInt(400000, 2800000))
      engRef.current.shift()
      engRef.current.push(rand(4, 12))
      renderLines()
      setLineKey((k) => k + 1)
    }, 3600)
    return () => clearInterval(id)
  }, [renderLines])

  useEffect(() => {
    const id = setInterval(() => {
      setTopPosts((prev) => {
        const pool = [0, 1, 2, 3, 4, 5].filter((i) => !prev.includes(i))
        const next = pool[rInt(0, pool.length - 1)]
        return [prev[1], prev[2], next]
      })
    }, 5000)
    return () => clearInterval(id)
  }, [])

  const areaGrad = `fa-areaGrad-${uid}`
  const areaGrad2 = `fa-areaGrad2-${uid}`

  return (
    <div className="feature-analytics-viewport" aria-hidden>
      <div
        className="feature-analytics-scaler"
        style={{ transform: `scale(${VIEWPORT_SCALE})` }}
      >
        <div className="feature-analytics-dash">
          <div className="titlebar">
            <div className="dot" style={{ background: '#ff5f57' }} />
            <div className="dot" style={{ background: '#ffbd2e' }} />
            <div className="dot" style={{ background: '#28c840' }} />
            <div className="titlebar-nav">
              <span className="active">Overview</span>
              <span className="muted">Posts</span>
              <span className="muted">Audience</span>
              <span className="muted">Reports</span>
            </div>
            <div className="titlebar-date">
              <Calendar size={13} strokeWidth={2} aria-hidden />
              May 2026
            </div>
          </div>

          <div className="statrow">
            <div className="stat stat-enter" style={{ animationDelay: '0.05s' }}>
              <div className="slbl">Total Reach</div>
              <div className="snum">{sn0}</div>
              <div
                className={`sbadge ${sb0.up ? 'up' : 'dn'}`}
                style={{
                  opacity: sb0.flash ? 0 : 1,
                  transform: sb0.flash ? 'translateY(-3px)' : 'translateY(0)',
                }}
              >
                {sb0.text}
              </div>
            </div>
            <div className="stat stat-enter" style={{ animationDelay: '0.12s' }}>
              <div className="slbl">Followers</div>
              <div className="snum">{sn1}</div>
              <div
                className={`sbadge ${sb1.up ? 'up' : 'dn'}`}
                style={{
                  opacity: sb1.flash ? 0 : 1,
                  transform: sb1.flash ? 'translateY(-3px)' : 'translateY(0)',
                }}
              >
                {sb1.text}
              </div>
            </div>
            <div className="stat stat-enter" style={{ animationDelay: '0.19s' }}>
              <div className="slbl">Engagement</div>
              <div className="snum">{sn2}</div>
              <div
                className={`sbadge ${sb2.up ? 'up' : 'dn'}`}
                style={{
                  opacity: sb2.flash ? 0 : 1,
                  transform: sb2.flash ? 'translateY(-3px)' : 'translateY(0)',
                }}
              >
                {sb2.text}
              </div>
            </div>
            <div className="stat stat-enter" style={{ animationDelay: '0.26s' }}>
              <div className="slbl">Posts</div>
              <div className="snum">{sn3}</div>
              <div
                className={`sbadge ${sb3.up ? 'up' : 'dn'}`}
                style={{
                  opacity: sb3.flash ? 0 : 1,
                  transform: sb3.flash ? 'translateY(-3px)' : 'translateY(0)',
                }}
              >
                {sb3.text}
              </div>
            </div>
          </div>

          <div className="chartarea">
            <div className="mainchartcol">
              <div className="chart-head">
                <div className="chart-title">Reach &amp; Engagement</div>
                <div className="periods">
                  <span className="period">7d</span>
                  <span className="period active">30d</span>
                  <span className="period">90d</span>
                </div>
              </div>

              <div className="chart-svg-wrap" ref={chartWrapRef}>
                <svg width="100%" viewBox={`0 0 ${CHART_W} ${CHART_H}`} style={{ display: 'block', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id={areaGrad} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5B3AFF" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#5B3AFF" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id={areaGrad2} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00B894" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#00B894" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="0" x2={CHART_W} y2="0" stroke="#f0eef8" strokeWidth="1" />
                  <line x1="0" y1="32" x2={CHART_W} y2="32" stroke="#f0eef8" strokeWidth="1" />
                  <line x1="0" y1="65" x2={CHART_W} y2="65" stroke="#f0eef8" strokeWidth="1" />
                  <line x1="0" y1="98" x2={CHART_W} y2="98" stroke="#f0eef8" strokeWidth="1" />
                  <line x1="0" y1="130" x2={CHART_W} y2="130" stroke="#f0eef8" strokeWidth="1" />
                  <text x="0" y="-4" fontSize="8" fill="#C0BDD4" fontFamily="Poppins, sans-serif">
                    3M
                  </text>
                  <text x="0" y="28" fontSize="8" fill="#C0BDD4" fontFamily="Poppins, sans-serif">
                    2M
                  </text>
                  <text x="0" y="62" fontSize="8" fill="#C0BDD4" fontFamily="Poppins, sans-serif">
                    1M
                  </text>
                  <text x="0" y="95" fontSize="8" fill="#C0BDD4" fontFamily="Poppins, sans-serif">
                    500K
                  </text>
                  <path ref={areaPathRef} fill={`url(#${areaGrad})`} opacity="0.8" />
                  <path ref={areaPath2Ref} fill={`url(#${areaGrad2})`} opacity="0.8" />
                  <path
                    ref={linePathRef}
                    fill="none"
                    stroke="#5B3AFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="line-anim"
                    style={{ animationDelay: '0.3s' }}
                  />
                  <path
                    ref={linePath2Ref}
                    fill="none"
                    stroke="#00B894"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="line-anim delay"
                    style={{ animationDelay: '0.5s' }}
                  />
                  <g ref={dotsGroupRef} />
                  <circle ref={activeDotRef} r="5" fill="#5B3AFF" stroke="#fff" strokeWidth="2" opacity="0" />
                  <rect
                    ref={hoverZoneRef}
                    x="0"
                    y="0"
                    width={CHART_W}
                    height={CHART_H}
                    fill="transparent"
                    style={{ cursor: 'crosshair' }}
                  />
                </svg>
                <div className="chart-tooltip" ref={tooltipRef} />
              </div>

              <div className="xlabels">
                {['May 1', 'May 5', 'May 10', 'May 15', 'May 20', 'May 25', 'May 31'].map((l) => (
                  <span key={l} className="xlabel">
                    {l}
                  </span>
                ))}
              </div>

              <div className="legend">
                <div className="legend-item">
                  <div className="legend-line" style={{ background: '#5B3AFF' }} />
                  Reach
                </div>
                <div className="legend-item">
                  <div className="legend-line eng" style={{ background: '#00B894' }} />
                  Engagement
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div className="postcardlbl">Top Posts</div>
                {topPosts.map((idx, i) => {
                  const p = POST_POOL[idx]
                  return (
                    <div
                      key={`${idx}-${i}`}
                      className="postrow post-enter"
                      style={{ animationDelay: `${i * 0.07}s` }}
                    >
                      <div className="postemoji" style={{ background: p.bg }}>
                        {p.e}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="post-title">{p.title}</div>
                        <div className="post-reach">{p.reach} reach</div>
                      </div>
                      <div className="post-eng">{p.eng}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="sidecol">
              <div className="pcard">
                <div className="pclbl">By Platform</div>
                {bars.map((b, i) => (
                  <div key={b.lbl} className="prow">
                    <span className="pbar-lbl" style={{ color: b.color, fontSize: 7, fontWeight: 700, width: 12 }}>
                      {b.lbl}
                    </span>
                    <div className="pbar-track">
                      <div
                        className="pbar-fill"
                        style={{
                          width: `${b.val}%`,
                          background: b.color,
                          animationDelay: `${0.3 + i * 0.15}s`,
                        }}
                      />
                    </div>
                    <span className="pbar-val" style={{ opacity: fadingBars[i] ? 0 : 1 }}>
                      {b.val}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="pcard">
                <div className="pclbl">Audience</div>
                <div className="donut-wrap">
                  <div className="donut-inner">
                    <canvas ref={donutRef} width={72} height={72} aria-hidden />
                    <div className="donut-center-num" style={{ opacity: donutFading ? 0 : 1 }}>
                      {donutCenter}
                      <div className="donut-center-lbl">total</div>
                    </div>
                  </div>
                </div>
                <div className="demo-legend">
                  {DEMO_LABELS.map((label, i) => (
                    <div key={label} className="demo-row">
                      <span className="demo-row-label">
                        <span className="demo-swatch" style={{ background: DEMO_COLORS[i] }} />
                        {label}
                      </span>
                      <span className="demo-pct">{demo[i]}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pcard centered">
                <div className="pclbl">Best time to post</div>
                <div className="best-time-num">6:00 PM</div>
                <div className="best-time-sub">Tuesdays &amp; Thursdays</div>
                <div className="best-time-pill">+38% avg reach</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
