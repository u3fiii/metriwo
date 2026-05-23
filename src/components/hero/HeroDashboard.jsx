import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ALL_POSTS,
  AVATAR_COLORS,
  DEM_COLORS,
  DEM_LABELS,
  DEM_VALS_INIT,
  MSG_POOL,
  PLATFORMS_INIT,
  SPARK_INIT,
} from './heroDashboardData'
import './heroDashboard.css'

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

function formatFollowers(v) {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K`
  return Math.round(v).toLocaleString()
}

function pickUnusedIndex(used, length) {
  let next
  do {
    next = rInt(0, length - 1)
  } while (used.has(next))
  return next
}

export default function HeroDashboard() {
  const pieRef = useRef(null)
  const demValsRef = useRef([...DEM_VALS_INIT])
  const pieAnimRef = useRef(null)
  const fValRef = useRef(248600)
  const eValRef = useRef(4.8)

  const [fStat, setFStat] = useState('248.6K')
  const [fBadge, setFBadge] = useState({ text: '▲ 3.2% this week', up: true, fading: false })
  const [eStat, setEStat] = useState('4.8%')
  const [eBadge, setEBadge] = useState({ text: '▲ 0.6%', up: true, fading: false })
  const [sparkHistory, setSparkHistory] = useState(SPARK_INIT)
  const [activePosts, setActivePosts] = useState([0, 1, 2])
  const [postTick, setPostTick] = useState(0)
  const [platforms, setPlatforms] = useState(() => PLATFORMS_INIT.map((p) => ({ ...p })))
  const [activeInbox, setActiveInbox] = useState([0, 1])
  const [inboxTick, setInboxTick] = useState(0)
  const [demVals, setDemVals] = useState(DEM_VALS_INIT)
  const [pieCenter, setPieCenter] = useState('248K')
  const [pieCenterFading, setPieCenterFading] = useState(false)

  const animNum = useCallback((setter, from, to, dur, fmt) => {
    const start = performance.now()
    function step(now) {
      const p = Math.min((now - start) / dur, 1)
      setter(fmt(lerp(from, to, ease(p))))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [])

  const drawPie = useCallback((vals) => {
    const canvas = pieRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const pcx = 50
    const pcy = 50
    const pr = 44
    const pin = 28

    ctx.clearRect(0, 0, 100, 100)
    const total = vals.reduce((a, b) => a + b, 0)
    let sa = -Math.PI / 2
    vals.forEach((v, i) => {
      const sw = (v / total) * 2 * Math.PI
      ctx.beginPath()
      ctx.moveTo(pcx, pcy)
      ctx.arc(pcx, pcy, pr, sa, sa + sw)
      ctx.closePath()
      ctx.fillStyle = DEM_COLORS[i]
      ctx.fill()
      sa += sw
    })
    ctx.beginPath()
    ctx.arc(pcx, pcy, pin, 0, 2 * Math.PI)
    ctx.fillStyle = '#fff'
    ctx.fill()
    sa = -Math.PI / 2
    vals.forEach((v) => {
      const sw = (v / total) * 2 * Math.PI
      ctx.beginPath()
      ctx.moveTo(pcx + pin * Math.cos(sa), pcy + pin * Math.sin(sa))
      ctx.lineTo(pcx + pr * Math.cos(sa), pcy + pr * Math.sin(sa))
      ctx.strokeStyle = '#f3f2f0'
      ctx.lineWidth = 1.5
      ctx.stroke()
      sa += sw
    })
  }, [])

  const startPieAnim = useCallback(
    (toVals) => {
      const from = [...demValsRef.current]
      const start = performance.now()
      const dur = 700

      function animPie(now) {
        const p = Math.min((now - start) / dur, 1)
        const ep = ease(p)
        const cur = from.map((f, i) => lerp(f, toVals[i], ep))
        drawPie(cur)
        if (p < 1) {
          pieAnimRef.current = requestAnimationFrame(animPie)
        } else {
          demValsRef.current = [...toVals]
          setDemVals([...toVals])
        }
      }

      if (pieAnimRef.current) cancelAnimationFrame(pieAnimRef.current)
      pieAnimRef.current = requestAnimationFrame(animPie)
    },
    [drawPie],
  )

  useEffect(() => {
    drawPie(DEM_VALS_INIT)
    const sweepStart = performance.now() + 300

    function initSweep(now) {
      if (now < sweepStart) {
        requestAnimationFrame(initSweep)
        return
      }
      const p = Math.min((now - sweepStart) / 900, 1)
      const cur = DEM_VALS_INIT.map((v) => v * ease(p))
      drawPie(cur)
      if (p < 1) requestAnimationFrame(initSweep)
    }

    requestAnimationFrame(initSweep)
    return () => {
      if (pieAnimRef.current) cancelAnimationFrame(pieAnimRef.current)
    }
  }, [drawPie])

  useEffect(() => {
    const id = setInterval(() => {
      const delta = rInt(-8000, 12000)
      const fromVal = fValRef.current
      const newVal = Math.max(180000, fromVal + delta)
      const pct = (delta / fromVal) * 100
      const up = delta >= 0
      fValRef.current = newVal

      animNum(setFStat, fromVal, newVal, 900, formatFollowers)
      setFBadge((b) => ({ ...b, fading: true }))
      setTimeout(() => {
        setFBadge({
          text: `${up ? '▲' : '▼'} ${Math.abs(pct).toFixed(1)}% this week`,
          up,
          fading: false,
        })
      }, 220)
    }, 3200)
    return () => clearInterval(id)
  }, [animNum])

  useEffect(() => {
    const id = setInterval(() => {
      const delta = rand(-0.8, 0.9)
      const from = eValRef.current
      const newVal = Math.max(1.2, Math.min(9.8, from + delta))
      const up = delta >= 0
      eValRef.current = newVal

      animNum(setEStat, from, newVal, 800, (v) => `${v.toFixed(1)}%`)
      setEBadge((b) => ({ ...b, fading: true }))
      setTimeout(() => {
        setEBadge({
          text: `${up ? '▲' : '▼'} ${Math.abs(delta).toFixed(1)}%`,
          up,
          fading: false,
        })
      }, 220)

      setSparkHistory((prev) => {
        const next = [...prev.slice(1), Math.round(rand(20, 100))]
        return next
      })
    }, 2800)
    return () => clearInterval(id)
  }, [animNum])

  useEffect(() => {
    const id = setInterval(() => {
      setActivePosts((prev) => {
        const used = new Set(prev.slice(1))
        const next = pickUnusedIndex(used, ALL_POSTS.length)
        return [...prev.slice(1), next]
      })
      setPostTick((t) => t + 1)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setPlatforms((prev) =>
        prev.map((p) => {
          const delta = rInt(-12, 15)
          return { ...p, val: Math.max(10, Math.min(98, p.val + delta)) }
        }),
      )
    }, 2500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setActiveInbox((prev) => {
        const used = new Set([prev[0]])
        const next = pickUnusedIndex(used, MSG_POOL.length)
        return [next, prev[0]]
      })
      setInboxTick((t) => t + 1)
    }, 2600)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      let v = [rInt(25, 45), rInt(32, 48), rInt(10, 22), rInt(4, 12), rInt(2, 6)]
      const s = v.reduce((a, b) => a + b, 0)
      v = v.map((x) => Math.round((x / s) * 100))
      v[0] += 100 - v.reduce((a, b) => a + b, 0)
      startPieAnim(v)

      const totalF = Math.round(rand(220, 280))
      setPieCenterFading(true)
      setTimeout(() => {
        setPieCenter(`${totalF}K`)
        setPieCenterFading(false)
      }, 220)
    }, 3500)
    return () => clearInterval(id)
  }, [startPieAnim])

  const sparkMax = Math.max(...sparkHistory)

  const handleCardMove = (e) => {
    const card = e.currentTarget
    const r = card.getBoundingClientRect()
    const x = (((e.clientX - r.left) / r.width) * 100).toFixed(1)
    const y = (((e.clientY - r.top) / r.height) * 100).toFixed(1)
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, #fefefe 0%, #fff 55%)`
  }

  const handleCardLeave = (e) => {
    e.currentTarget.style.background = '#fff'
  }

  const demTotal = demVals.reduce((a, b) => a + b, 0)

  return (
    <div
      className="hero-dash"
      role="img"
      aria-label="Animated Metriwo analytics dashboard preview"
    >
      <div className="blob b1" aria-hidden />
      <div className="blob b2" aria-hidden />

      <div className="row">
        <div
          className="card"
          style={{ flex: 1.15, animationDelay: '0.05s' }}
          onMouseMove={handleCardMove}
          onMouseLeave={handleCardLeave}
        >
          <div className="lbl">Total Followers</div>
          <div className="stat">{fStat}</div>
          <div className={`badge ${fBadge.up ? 'bu' : 'bd-neg'} ${fBadge.fading ? 'fading' : ''}`}>
            {fBadge.text}
          </div>
          <div className="prow">
            <div className="picon pi-ig" title="Instagram">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
              </svg>
            </div>
            <div className="picon pi-fb">f</div>
            <div className="picon pi-x">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white" aria-hidden>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <div className="picon pi-li">in</div>
            <div className="picon pi-tt">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.78 1.52V6.82a4.85 4.85 0 01-1.01-.13z" fill="#69C9D0" />
                <path d="M18.59 5.69a4.83 4.83 0 01-3.77-4.25V1h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V8.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V7.75a8.18 8.18 0 004.78 1.52V5.82a4.85 4.85 0 01-1.01-.13z" fill="white" />
              </svg>
            </div>
          </div>
        </div>

        <div
          className="card"
          style={{ flex: 0.85, animationDelay: '0.12s' }}
          onMouseMove={handleCardMove}
          onMouseLeave={handleCardLeave}
        >
          <div className="lbl">Avg. Engagement</div>
          <div className="stat">{eStat}</div>
          <div className={`badge ${eBadge.up ? 'bu' : 'bd-neg'} ${eBadge.fading ? 'fading' : ''}`}>
            {eBadge.text}
          </div>
          <div className="spark">
            {sparkHistory.map((h, i) => {
              const intense = i >= 5
              const mid = i >= 3
              return (
                <div
                  key={i}
                  className="sb"
                  style={{
                    height: `${(h / sparkMax) * 100}%`,
                    background: intense ? '#5B3AFF' : mid ? '#A29BFE' : '#D2CEFD',
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>

      <div className="row">
        <div
          className="card"
          style={{ flex: 1.1, animationDelay: '0.2s' }}
          onMouseMove={handleCardMove}
          onMouseLeave={handleCardLeave}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div className="lbl" style={{ margin: 0 }}>
              Scheduled Posts
            </div>
            <div className="live-pill">
              <div className="live-dot" />
              Live
            </div>
          </div>
          <div className="post-list">
            {activePosts.slice(0, 3).map((idx, i) => {
              const p = ALL_POSTS[idx]
              return (
                <div
                  key={`${postTick}-${idx}-${i}`}
                  className="post-item"
                  style={{ animationDelay: `${i * 80 + 20}ms` }}
                >
                  <div className="post-thumb" style={{ background: p.bg }}>
                    {p.emoji}
                  </div>
                  <div className="post-meta">
                    <div className="post-title">{p.title}</div>
                    <div className="post-time">{p.time}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                    <div className="pr-num">{p.reach}</div>
                    <div className={`post-status ${p.status === 'pub' ? 'st-pub' : 'st-sched'}`}>
                      {p.status === 'pub' ? 'Published' : 'Scheduled'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div
          className="card"
          style={{ flex: 0.9, animationDelay: '0.28s', display: 'flex', flexDirection: 'column' }}
          onMouseMove={handleCardMove}
          onMouseLeave={handleCardLeave}
        >
          <div className="lbl">Platform Reach</div>
          {platforms.map((p, i) => (
            <div key={p.lbl} className="bar-row">
              <span className="bar-lbl" style={{ color: p.color }}>
                {p.lbl}
              </span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${p.val}%`, background: p.color }} />
              </div>
              <span className="bar-val">{p.val}%</span>
            </div>
          ))}
          <hr className="inbox-sep" />
          <div className="lbl" style={{ marginBottom: 6 }}>
            Inbox
          </div>
          {activeInbox.slice(0, 2).map((idx, i) => {
            const m = MSG_POOL[idx]
            return (
              <div
                key={`${inboxTick}-${idx}-${i}`}
                className="msg-row"
                style={{ animationDelay: `${i * 60 + 10}ms` }}
              >
                <div
                  className="avatar"
                  style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                >
                  {m.initials}
                </div>
                <div className="msg-info">
                  <div className="msg-name">{m.name}</div>
                  <div className="msg-text">{m.text}</div>
                </div>
                <div className="udot" />
              </div>
            )
          })}
        </div>
      </div>

      <div
        className="card"
        style={{ animationDelay: '0.36s' }}
        onMouseMove={handleCardMove}
        onMouseLeave={handleCardLeave}
      >
        <div className="lbl">Follower Demographics</div>
        <div className="pie-wrap">
          <div className="pie-cw">
            <canvas ref={pieRef} id="pieC" width={100} height={100} aria-hidden />
            <div className="pie-center">
              <div className={`pie-cn ${pieCenterFading ? 'fading' : ''}`}>{pieCenter}</div>
              <div className="pie-cl">total</div>
            </div>
          </div>
          <div className="legend">
            {demVals.map((v, i) => {
              const pct = Math.round((v / demTotal) * 100)
              return (
                <div key={DEM_LABELS[i]} className="leg-item">
                  <div className="leg-dot" style={{ background: DEM_COLORS[i] }} />
                  <span className="leg-name">{DEM_LABELS[i]}</span>
                  <div className="leg-bw">
                    <div
                      className="leg-bf"
                      style={{ width: `${pct}%`, background: DEM_COLORS[i] }}
                    />
                  </div>
                  <span className="leg-pct">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
