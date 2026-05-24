import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DEMO_INIT,
  MSG_POOL,
  PLATFORMS_BARS,
  PORTRAIT_SOURCES,
  POSTS_POOL,
  SPARK_INIT,
} from './heroDashboardData'
import './heroDashboard.css'

const SCENE_SIZE = 580

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

function formatReachM(v) {
  return `${(v / 1_000_000).toFixed(1)}M`
}

function sparkColor(i) {
  if (i >= 5) return '#5B3AFF'
  if (i >= 3) return '#A29BFE'
  return '#D2CEFD'
}

function pickUnused(used, length) {
  let next
  do {
    next = rInt(0, length - 1)
  } while (used.has(next))
  return next
}

function normalizeDemo(vals) {
  let v = [...vals]
  const sum = v.reduce((a, b) => a + b, 0)
  v = v.map((x) => Math.round((x / sum) * 100))
  v[0] += 100 - v.reduce((a, b) => a + b, 0)
  return v
}

export default function HeroDashboard() {
  const scalerRef = useRef(null)
  const fValRef = useRef(248600)
  const eValRef = useRef(4.8)
  const rchValRef = useRef(1.2)
  const postsValRef = useRef(7)

  const [scale, setScale] = useState(1)
  const [fNum, setFNum] = useState('248.6K')
  const [fBadge, setFBadge] = useState({
    text: '▲ 3.2% this week',
    up: true,
    flash: false,
  })
  const [sparkH, setSparkH] = useState(SPARK_INIT)
  const [eNum, setENum] = useState('4.8%')
  const [eBadge, setEBadge] = useState({ text: '▲ 0.6%', up: true, flash: false })
  const [rchNum, setRchNum] = useState('1.2M')
  const [rchBadge, setRchBadge] = useState({ text: '▲ 8%', up: true, flash: false })
  const [postsNum, setPostsNum] = useState('7')
  const [postsBadge, setPostsBadge] = useState({
    text: '▲ 3 new',
    up: true,
    flash: false,
  })
  const [bars, setBars] = useState(() => PLATFORMS_BARS.map((b) => ({ ...b })))
  const [fadingBars, setFadingBars] = useState({})
  const [demo, setDemo] = useState(() => DEMO_INIT.map((d) => ({ ...d })))
  const [fadingDemo, setFadingDemo] = useState({})
  const [inboxIdx, setInboxIdx] = useState([0, 1])
  const [inboxFlash, setInboxFlash] = useState(false)
  const [postIdx, setPostIdx] = useState(0)
  const [postFlash, setPostFlash] = useState(false)
  const [portraitIndex, setPortraitIndex] = useState(0)
  const portraitSrc = PORTRAIT_SOURCES[portraitIndex] ?? PORTRAIT_SOURCES[0]

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
    }, 210)
  }, [])

  useEffect(() => {
    const el = scalerRef.current
    if (!el) return undefined
    const update = () => setScale(Math.min(1, el.clientWidth / SCENE_SIZE))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const delta = rInt(-9000, 13000)
      const fromVal = fValRef.current
      const newVal = Math.max(180000, fromVal + delta)
      const pct = (delta / fromVal) * 100
      const up = delta >= 0
      fValRef.current = newVal

      animNum(setFNum, fromVal, newVal, 900, formatFollowers)
      flashBadge(setFBadge, () => ({
        text: `${up ? '▲' : '▼'} ${Math.abs(pct).toFixed(1)}% this week`,
        up,
      }))
      setSparkH((prev) => [...prev.slice(1), rInt(20, 100)])
    }, 3400)
    return () => clearInterval(id)
  }, [animNum, flashBadge])

  useEffect(() => {
    const id = setInterval(() => {
      const delta = rand(-0.9, 1)
      const from = eValRef.current
      const newVal = Math.max(1.2, Math.min(9.8, from + delta))
      const up = delta >= 0
      eValRef.current = newVal

      animNum(setENum, from, newVal, 800, (v) => `${v.toFixed(1)}%`)
      flashBadge(setEBadge, () => ({
        text: `${up ? '▲' : '▼'} ${Math.abs(delta).toFixed(1)}%`,
        up,
      }))
    }, 3100)
    return () => clearInterval(id)
  }, [animNum, flashBadge])

  useEffect(() => {
    const id = setInterval(() => {
      const delta = rand(-0.08, 0.15)
      const from = rchValRef.current
      const newVal = Math.max(0.8, Math.min(2.4, from + delta))
      const up = delta >= 0
      rchValRef.current = newVal

      animNum(setRchNum, from * 1_000_000, newVal * 1_000_000, 800, formatReachM)
      flashBadge(setRchBadge, () => ({
        text: `${up ? '▲' : '▼'} ${Math.abs(Math.round(delta * 100))}%`,
        up,
      }))
    }, 3800)
    return () => clearInterval(id)
  }, [animNum, flashBadge])

  useEffect(() => {
    const id = setInterval(() => {
      const delta = rInt(-2, 4)
      const from = postsValRef.current
      const newVal = Math.max(1, Math.min(18, from + delta))
      const up = delta >= 0
      postsValRef.current = newVal

      animNum(setPostsNum, from, newVal, 600, (v) => String(Math.round(v)))
      flashBadge(setPostsBadge, () => ({
        text: `${up ? '▲' : '▼'} ${Math.abs(delta)} new`,
        up,
      }))
    }, 4200)
    return () => clearInterval(id)
  }, [animNum, flashBadge])

  useEffect(() => {
    const id = setInterval(() => {
      setBars((prev) =>
        prev.map((b) => ({
          ...b,
          val: Math.max(10, Math.min(98, b.val + rInt(-13, 16))),
        })),
      )
      const fade = {}
      PLATFORMS_BARS.forEach((_, i) => {
        fade[i] = true
      })
      setFadingBars(fade)
      setTimeout(() => setFadingBars({}), 210)
    }, 2700)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const vals = normalizeDemo([
        rInt(25, 44),
        rInt(32, 48),
        rInt(10, 20),
        rInt(6, 14),
      ])
      setDemo((prev) => prev.map((d, i) => ({ ...d, val: vals[i] })))
      const fade = {}
      DEMO_INIT.forEach((_, i) => {
        fade[i] = true
      })
      setFadingDemo(fade)
      setTimeout(() => setFadingDemo({}), 300)
    }, 3800)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setInboxFlash(true)
      setTimeout(() => {
        setInboxIdx((prev) => {
          const used = new Set(prev)
          const next = pickUnused(used, MSG_POOL.length)
          return [next, prev[0]]
        })
        setInboxFlash(false)
      }, 260)
    }, 2500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setPostFlash(true)
      setTimeout(() => {
        setPostIdx((i) => (i + 1) % POSTS_POOL.length)
        setPostFlash(false)
      }, 260)
    }, 3600)
    return () => clearInterval(id)
  }, [])

  const sparkMax = Math.max(...sparkH)
  const post = POSTS_POOL[postIdx]

  return (
    <div
      ref={scalerRef}
      className="hero-orbit-scaler"
      style={{ height: SCENE_SIZE * scale }}
    >
      <div
        className="hero-orbit-scene"
        style={{ transform: `scale(${scale})` }}
        role="img"
        aria-label="Animated Metriwo social analytics orbit dashboard"
      >
        <svg className="hero-orbit-rings" viewBox="0 0 580 580" aria-hidden>
          <circle
            cx="290"
            cy="290"
            r="140"
            fill="none"
            stroke="#d4d4d8"
            strokeWidth="1.5"
            strokeDasharray="8 7"
          />
          <circle
            cx="290"
            cy="290"
            r="235"
            fill="none"
            stroke="#d4d4d8"
            strokeWidth="1.5"
            strokeDasharray="10 8"
          />
        </svg>

        <div className="center-portrait">
          <img
            src={portraitSrc}
            alt="Metriwo creator"
            loading="eager"
            decoding="async"
            onError={() => {
              setPortraitIndex((i) =>
                i < PORTRAIT_SOURCES.length - 1 ? i + 1 : i,
              )
            }}
          />
        </div>

        {/* Inner: Engagement */}
        <div
          className="orbit-card orbit-float-f0"
          style={{ left: 345, top: 155, width: 112, padding: '9px 10px' }}
        >
          <div className="lbl">Engagement</div>
          <div className="num lg">{eNum}</div>
          <div
            className={`bdg ${eBadge.up ? 'bu' : 'bd'}`}
            style={{
              opacity: eBadge.flash ? 0 : 1,
              transform: eBadge.flash ? 'translateY(-3px)' : 'translateY(0)',
            }}
          >
            {eBadge.text}
          </div>
        </div>

        {/* Inner: Reach */}
        <div
          className="orbit-card orbit-float-f1"
          style={{
            left: 108,
            top: 238,
            width: 74,
            padding: '8px 9px',
            animationDelay: '1.1s',
          }}
        >
          <div className="lbl xs">Reach</div>
          <div className="num sm">{rchNum}</div>
          <div
            className={`bdg xs ${rchBadge.up ? 'bu' : 'bd'}`}
            style={{
              opacity: rchBadge.flash ? 0 : 1,
              transform: rchBadge.flash ? 'translateY(-3px)' : 'translateY(0)',
            }}
          >
            {rchBadge.text}
          </div>
        </div>

        {/* Inner: Scheduled */}
        <div
          className="orbit-card orbit-float-f2"
          style={{
            left: 188,
            top: 392,
            width: 120,
            padding: '8px 10px',
            animationDelay: '2.3s',
          }}
        >
          <div className="card-header">
            <div className="lbl" style={{ margin: 0 }}>
              Scheduled
            </div>
            <div className="live-pill">
              <span className="live-pill-dot" />
              Live
            </div>
          </div>
          <div
            className="sched-row"
            style={{
              opacity: postFlash ? 0 : 1,
              transform: postFlash ? 'translateX(-4px)' : 'translateX(0)',
            }}
          >
            <div className="sched-em" style={{ background: post.bg }}>
              {post.emoji}
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="sched-title">{post.title}</div>
              <div className="sched-date">{post.date}</div>
            </div>
          </div>
        </div>

        {/* Outer: Followers */}
        <div
          className="orbit-card orbit-float-f3"
          style={{
            left: 44,
            top: 44,
            width: 148,
            padding: '10px 12px',
            animationDelay: '0.5s',
          }}
        >
          <div className="lbl">Total Followers</div>
          <div className="num">{fNum}</div>
          <div
            className={`bdg ${fBadge.up ? 'bu' : 'bd'}`}
            style={{
              opacity: fBadge.flash ? 0 : 1,
              transform: fBadge.flash ? 'translateY(-3px)' : 'translateY(0)',
            }}
          >
            {fBadge.text}
          </div>
          <div className="sp">
            {sparkH.map((h, i) => (
              <div
                key={i}
                className="sb"
                style={{
                  height: `${(h / sparkMax) * 100}%`,
                  background: sparkColor(i),
                }}
              />
            ))}
          </div>
        </div>

        {/* Outer: Posts Today */}
        <div
          className="orbit-card orbit-float-f4"
          style={{
            left: 422,
            top: 92,
            width: 86,
            padding: '8px 10px',
            animationDelay: '1.9s',
          }}
        >
          <div className="lbl xs">Posts Today</div>
          <div className="num md">{postsNum}</div>
          <div
            className={`bdg xs ${postsBadge.up ? 'bu' : 'bd'}`}
            style={{
              opacity: postsBadge.flash ? 0 : 1,
              transform: postsBadge.flash ? 'translateY(-3px)' : 'translateY(0)',
            }}
          >
            {postsBadge.text}
          </div>
        </div>

        {/* Outer: Platform Reach */}
        <div
          className="orbit-card orbit-float-f5"
          style={{
            left: 448,
            top: 302,
            width: 136,
            padding: '9px 11px',
            animationDelay: '3.2s',
          }}
        >
          <div className="card-header tight">
            <div className="lbl" style={{ margin: 0 }}>
              Platform Reach
            </div>
            <span className="live-dot-sm" />
          </div>
          {bars.map((b, i) => (
            <div key={b.lbl} className="br">
              <span className="bar-lbl" style={{ color: b.color }}>
                {b.lbl}
              </span>
              <div className="bt">
                <div
                  className="bf"
                  style={{
                    width: `${b.val}%`,
                    background: b.color,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              </div>
              <span className="bar-val" style={{ opacity: fadingBars[i] ? 0 : 1 }}>
                {b.val}%
              </span>
            </div>
          ))}
        </div>

        {/* Outer: Inbox */}
        <div
          className="orbit-card orbit-float-f6"
          style={{
            left: 332,
            top: 462,
            width: 138,
            padding: '9px 11px',
            animationDelay: '0.8s',
          }}
        >
          <div className="lbl" style={{ marginBottom: 4 }}>
            Inbox
          </div>
          {inboxIdx.map((idx, i) => {
            const m = MSG_POOL[idx]
            return (
              <div
                key={`${idx}-${i}`}
                className={`inbox-row${i === 0 ? ' bordered' : ''}`}
                style={{
                  opacity: inboxFlash ? 0 : 1,
                  transform: inboxFlash ? 'translateY(-4px)' : 'translateY(0)',
                }}
              >
                <div className="av" style={{ background: m.color }}>
                  {m.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="inbox-name">{m.name}</div>
                  <div className="inbox-text">{m.text}</div>
                </div>
                <div
                  className="udot"
                  style={{ animationDelay: i === 0 ? '0.2s' : '0.7s' }}
                />
              </div>
            )
          })}
        </div>

        {/* Outer: Demographics */}
        <div
          className="orbit-card orbit-float-f7"
          style={{
            left: 18,
            top: 348,
            width: 112,
            padding: '8px 10px',
            animationDelay: '2.7s',
          }}
        >
          <div className="lbl">Demographics</div>
          <div className="demo-list">
            {demo.map((d, i) => (
              <div key={d.label} className="demo-row">
                <div className="demo-dot" style={{ background: d.color }} />
                <span className="demo-label">{d.label}</span>
                <div className="demo-track">
                  <div
                    className="demo-fill"
                    style={{ width: `${d.val}%`, background: d.color }}
                  />
                </div>
                <span className="demo-pct" style={{ opacity: fadingDemo[i] ? 0 : 1 }}>
                  {d.val}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
