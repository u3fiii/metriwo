import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DEMO_INIT,
  MOBILE_CHART_HEIGHTS,
  MOBILE_PLATFORMS,
  MSG_POOL,
  PLATFORMS_BARS,
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

function mobileBarColor(i) {
  return sparkColor(i)
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

function MetriwoLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 50 52" fill="none" aria-hidden>
      <path
        d="M25.4946 19.3359L30.5053 29.3761L37.8035 19.3359L44.2642 29.3761"
        stroke="#5B3AFF"
        strokeWidth="6.388"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="19.6687" cy="28.6707" r="3.66871" fill="#5B3AFF" />
    </svg>
  )
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
  const [mobileBars, setMobileBars] = useState(MOBILE_CHART_HEIGHTS)
  const [mFol, setMFol] = useState('248K')
  const [mRch, setMRch] = useState('2.4M')
  const [mEng, setMEng] = useState('8.2%')
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
  const [barVals, setBarVals] = useState(() => PLATFORMS_BARS.map((b) => b.val))
  const [fadingBars, setFadingBars] = useState({})
  const [fadingMobile, setFadingMobile] = useState({})
  const [demo, setDemo] = useState(() => DEMO_INIT.map((d) => ({ ...d })))
  const [fadingDemo, setFadingDemo] = useState({})
  const [inboxIdx, setInboxIdx] = useState([0, 1])
  const [inboxFlash, setInboxFlash] = useState(false)
  const [mobileInboxFlash, setMobileInboxFlash] = useState(false)
  const [postIdx, setPostIdx] = useState(0)
  const [postFlash, setPostFlash] = useState(false)

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

  const syncMobileBars = useCallback((heights) => {
    const mx = Math.max(...heights)
    setMobileBars(heights.map((h) => (h / mx) * 100))
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
      setMFol(`${(newVal / 1000).toFixed(0)}K`)
      flashBadge(setFBadge, () => ({
        text: `${up ? '▲' : '▼'} ${Math.abs(pct).toFixed(1)}% this week`,
        up,
      }))
      setSparkH((prev) => {
        const next = [...prev.slice(1), rInt(20, 100)]
        syncMobileBars(next)
        return next
      })
    }, 3400)
    return () => clearInterval(id)
  }, [animNum, flashBadge, syncMobileBars])

  useEffect(() => {
    const id = setInterval(() => {
      const delta = rand(-0.9, 1)
      const from = eValRef.current
      const newVal = Math.max(1.2, Math.min(9.8, from + delta))
      const up = delta >= 0
      eValRef.current = newVal

      animNum(setENum, from, newVal, 800, (v) => `${v.toFixed(1)}%`)
      setMEng(`${newVal.toFixed(1)}%`)
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
      setMRch(`${newVal.toFixed(1)}M`)
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
      setBarVals((prev) =>
        prev.map((v) => Math.max(10, Math.min(98, v + rInt(-13, 16)))),
      )
      const fade = {}
      const mFade = {}
      PLATFORMS_BARS.forEach((_, i) => {
        fade[i] = true
        mFade[i] = true
      })
      setFadingBars(fade)
      setFadingMobile(mFade)
      setTimeout(() => {
        setFadingBars({})
        setFadingMobile({})
      }, 210)
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
      setMobileInboxFlash(true)
      setTimeout(() => {
        setInboxIdx((prev) => {
          const used = new Set(prev)
          const next = pickUnused(used, MSG_POOL.length)
          return [next, prev[0]]
        })
        setInboxFlash(false)
        setMobileInboxFlash(false)
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
  const mobileBarMax = Math.max(...mobileBars)

  return (
    <div
      ref={scalerRef}
      className="hero-orbit-scaler"
      style={{ height: SCENE_SIZE * scale }}
    >
      <div
        className="hero-tile-scene"
        style={{ transform: `scale(${scale})` }}
        role="img"
        aria-label="Animated Metriwo social analytics dashboard with phone preview and floating metrics"
      >
        <svg
          className="tile-ring-svg tile-ring-svg--inner"
          viewBox="0 0 580 580"
          aria-hidden
        >
          <circle
            cx="290"
            cy="290"
            r="146"
            fill="none"
            stroke="#d4d4d8"
            strokeWidth="1.5"
            strokeDasharray="18 12"
          />
        </svg>
        <svg
          className="tile-ring-svg tile-ring-svg--outer"
          viewBox="0 0 580 580"
          aria-hidden
        >
          <circle
            cx="290"
            cy="290"
            r="240"
            fill="none"
            stroke="#d4d4d8"
            strokeWidth="1.5"
            strokeDasharray="22 14"
          />
        </svg>

        <div className="tile-screen-wrap">
          <div className="tile-db">
            <div className="tile-db-nav">
              <div className="tile-db-logo-row">
                <MetriwoLogo />
                <span className="tile-db-logo-text">metriwo</span>
              </div>
              <div className="tile-db-nav-right">
                <div className="tile-db-notif">
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#5B3AFF"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    aria-hidden
                  >
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 01-3.46 0" />
                  </svg>
                </div>
                <div className="tile-db-ava">R</div>
              </div>
            </div>

            <div className="tile-db-kpis">
              <div className="tile-db-kpi">
                <div className="tile-db-kpi-l">Followers</div>
                <div className="tile-db-kpi-v">{mFol}</div>
                <div className="tile-db-kpi-b">▲ 3.2%</div>
              </div>
              <div className="tile-db-kpi">
                <div className="tile-db-kpi-l">Reach</div>
                <div className="tile-db-kpi-v">{mRch}</div>
                <div className="tile-db-kpi-b">▲ 12%</div>
              </div>
              <div className="tile-db-kpi">
                <div className="tile-db-kpi-l">Eng.</div>
                <div className="tile-db-kpi-v">{mEng}</div>
                <div className="tile-db-kpi-b">▲ 0.9%</div>
              </div>
            </div>

            <div className="tile-db-chart">
              <div className="tile-db-chart-hdr">
                <span className="tile-db-chart-title">Weekly Reach</span>
                <span className="tile-db-chart-tag">30d</span>
              </div>
              <div className="tile-db-bars-card">
                <div className="tile-db-bars">
                  {mobileBars.map((h, i) => (
                    <div
                      key={i}
                      className="tile-db-bar"
                      style={{
                        height: `${(h / mobileBarMax) * 100}%`,
                        background: mobileBarColor(i),
                      }}
                    />
                  ))}
                </div>
                <div className="tile-db-xlbls">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((lbl, i) => (
                    <span key={`${lbl}-${i}`} className="tile-db-xl">
                      {lbl}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="tile-db-plat">
              <div className="tile-db-plat-hdr">Platforms</div>
              <div className="tile-db-plat-card">
                {MOBILE_PLATFORMS.map((p, i) => (
                  <div key={p.name} className="tile-db-prow">
                    <span className="tile-db-pname" style={{ color: p.color }}>
                      {p.name}
                    </span>
                    <div className="tile-db-ptrack">
                      <div
                        className="tile-db-pfill"
                        style={{
                          width: `${barVals[i]}%`,
                          background: p.color,
                        }}
                      />
                    </div>
                    <span
                      className="tile-db-pval"
                      style={{ opacity: fadingMobile[i] ? 0 : 1 }}
                    >
                      {barVals[i]}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="tile-db-inbox">
              <div className="tile-db-inbox-hdr">
                <span className="tile-db-inbox-title">Inbox</span>
                <span className="tile-db-inbox-badge">
                  <span className="tile-db-inbox-dot" />
                  3 new
                </span>
              </div>
              <div className="tile-db-inbox-card">
                {inboxIdx.map((idx, i) => {
                  const m = MSG_POOL[idx]
                  return (
                    <div
                      key={`mobile-${idx}-${i}`}
                      className="tile-db-imsg"
                      style={{ opacity: mobileInboxFlash ? 0 : 1 }}
                    >
                      <div className="tile-db-iav" style={{ background: m.color }}>
                        {m.initials}
                      </div>
                      <div className="tile-db-ibody">
                        <div className="tile-db-iname">{m.name}</div>
                        <div className="tile-db-itext">{m.text}</div>
                      </div>
                      <div className="tile-db-idot" />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div
          className="tile-card tile-float-f0"
          style={{ left: 348, top: 148, width: 112, padding: '9px 10px' }}
        >
          <div className="tile-lbl">Engagement</div>
          <div className="tile-num" style={{ fontSize: 20 }}>
            {eNum}
          </div>
          <div
            className={`tile-bdg ${eBadge.up ? 'tile-bu' : 'tile-bd'}`}
            style={{
              opacity: eBadge.flash ? 0 : 1,
              transform: eBadge.flash ? 'translateY(-3px)' : 'translateY(0)',
            }}
          >
            {eBadge.text}
          </div>
        </div>

        <div
          className="tile-card tile-float-f1"
          style={{ left: 102, top: 240, width: 74, padding: '8px 9px' }}
        >
          <div className="tile-lbl" style={{ fontSize: 6.5 }}>
            Reach
          </div>
          <div className="tile-num" style={{ fontSize: 16 }}>
            {rchNum}
          </div>
          <div
            className={`tile-bdg ${rchBadge.up ? 'tile-bu' : 'tile-bd'}`}
            style={{
              fontSize: 6.5,
              padding: '1.5px 5px',
              opacity: rchBadge.flash ? 0 : 1,
              transform: rchBadge.flash ? 'translateY(-3px)' : 'translateY(0)',
            }}
          >
            {rchBadge.text}
          </div>
        </div>

        <div
          className="tile-card tile-float-f2"
          style={{ left: 185, top: 396, width: 120, padding: '8px 10px' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 5,
            }}
          >
            <div className="tile-lbl" style={{ margin: 0 }}>
              Scheduled
            </div>
            <div className="tile-live-pill">
              <span className="tile-live-pill-dot" />
              Live
            </div>
          </div>
          <div
            className="tile-sched-row"
            style={{
              opacity: postFlash ? 0 : 1,
              transform: postFlash ? 'translateX(-4px)' : 'translateX(0)',
            }}
          >
            <div className="tile-sched-em" style={{ background: post.bg }}>
              {post.emoji}
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="tile-sched-title">{post.title}</div>
              <div className="tile-sched-date">{post.date}</div>
            </div>
          </div>
        </div>

        <div
          className="tile-card tile-float-f3"
          style={{ left: 38, top: 40, width: 148, padding: '10px 12px' }}
        >
          <div className="tile-lbl">Total Followers</div>
          <div className="tile-num">{fNum}</div>
          <div
            className={`tile-bdg ${fBadge.up ? 'tile-bu' : 'tile-bd'}`}
            style={{
              opacity: fBadge.flash ? 0 : 1,
              transform: fBadge.flash ? 'translateY(-3px)' : 'translateY(0)',
            }}
          >
            {fBadge.text}
          </div>
          <div className="tile-sp">
            {sparkH.map((h, i) => (
              <div
                key={i}
                className="tile-sb"
                style={{
                  height: `${(h / sparkMax) * 100}%`,
                  background: sparkColor(i),
                }}
              />
            ))}
          </div>
        </div>

        <div
          className="tile-card tile-float-f4"
          style={{ left: 426, top: 86, width: 86, padding: '8px 10px' }}
        >
          <div className="tile-lbl" style={{ fontSize: 6.5 }}>
            Posts Today
          </div>
          <div className="tile-num" style={{ fontSize: 19 }}>
            {postsNum}
          </div>
          <div
            className={`tile-bdg ${postsBadge.up ? 'tile-bu' : 'tile-bd'}`}
            style={{
              fontSize: 6.5,
              padding: '1.5px 5px',
              opacity: postsBadge.flash ? 0 : 1,
              transform: postsBadge.flash ? 'translateY(-3px)' : 'translateY(0)',
            }}
          >
            {postsBadge.text}
          </div>
        </div>

        <div
          className="tile-card tile-float-f5"
          style={{ left: 452, top: 298, width: 112, padding: '9px 11px' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <div className="tile-lbl" style={{ margin: 0 }}>
              Platform
            </div>
            <span className="tile-live-dot-sm" />
          </div>
          {PLATFORMS_BARS.map((b, i) => (
            <div key={b.lbl} className="tile-br">
              <span className="tile-bar-lbl" style={{ color: b.color }}>
                {b.lbl}
              </span>
              <div className="tile-bt">
                <div
                  className="tile-bf"
                  style={{
                    width: `${barVals[i]}%`,
                    background: b.color,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              </div>
              <span
                className="tile-bar-val"
                style={{ opacity: fadingBars[i] ? 0 : 1 }}
              >
                {barVals[i]}%
              </span>
            </div>
          ))}
        </div>

        <div
          className="tile-card tile-float-f6"
          style={{ left: 334, top: 450, width: 140, padding: '9px 11px' }}
        >
          <div className="tile-lbl" style={{ marginBottom: 5 }}>
            Inbox
          </div>
          {inboxIdx.map((idx, i) => {
            const m = MSG_POOL[idx]
            return (
              <div
                key={`outer-${idx}-${i}`}
                className={`tile-inbox-row${i === 0 ? ' bordered' : ''}`}
                style={{
                  opacity: inboxFlash ? 0 : 1,
                  transform: inboxFlash ? 'translateY(-4px)' : 'translateY(0)',
                }}
              >
                <div className="tile-av" style={{ background: m.color }}>
                  {m.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="tile-inbox-name">{m.name}</div>
                  <div className="tile-inbox-text">{m.text}</div>
                </div>
                <div
                  className="tile-udot"
                  style={{ animationDelay: i === 0 ? '0.2s' : '0.5s' }}
                />
              </div>
            )
          })}
        </div>

        <div
          className="tile-card tile-float-f7"
          style={{ left: 14, top: 352, width: 112, padding: '8px 10px' }}
        >
          <div className="tile-lbl">Demographics</div>
          <div className="tile-demo-list">
            {demo.map((d, i) => (
              <div key={d.label} className="tile-demo-row">
                <div className="tile-demo-dot" style={{ background: d.color }} />
                <span className="tile-demo-label">{d.label}</span>
                <div className="tile-demo-track">
                  <div
                    className="tile-demo-fill"
                    style={{ width: `${d.val}%`, background: d.color }}
                  />
                </div>
                <span
                  className="tile-demo-pct"
                  style={{ opacity: fadingDemo[i] ? 0 : 1 }}
                >
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
