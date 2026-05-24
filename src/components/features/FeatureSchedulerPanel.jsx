import { useCallback, useEffect, useRef, useState } from 'react'
import { Calendar } from 'lucide-react'
import {
  SCHEDULER_CAL_START,
  SCHEDULER_DAYS,
  SCHEDULER_POST_OPTIONS,
  SCHEDULER_TIMES,
  SCHEDULER_VISIT_SEQUENCE,
  createInitialCalPosts,
} from './featureSchedulerData'
import './featureScheduler.css'

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function FeatureSchedulerPanel() {
  const shellRef = useRef(null)
  const visitIdxRef = useRef(0)
  const animRunningRef = useRef(false)
  const calPostsRef = useRef(createInitialCalPosts())
  const timeoutIdsRef = useRef([])

  const [calPosts, setCalPosts] = useState(() => createInitialCalPosts())
  const [highlightDay, setHighlightDay] = useState(null)
  const [clickedDay, setClickedDay] = useState(null)
  const [chipPopDay, setChipPopDay] = useState(null)
  const [cursor, setCursor] = useState({ left: 30, top: 60 })
  const [rippleDay, setRippleDay] = useState(null)
  const [snackbar, setSnackbar] = useState(null)

  const schedCount = Object.keys(calPosts).length

  const clearTimeouts = useCallback(() => {
    timeoutIdsRef.current.forEach(clearTimeout)
    timeoutIdsRef.current = []
  }, [])

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms)
    timeoutIdsRef.current.push(id)
    return id
  }, [])

  const getCellPos = useCallback((day) => {
    const cell = shellRef.current?.querySelector(`#fs-dc-${day}`)
    const shell = shellRef.current
    if (!cell || !shell) return null
    const cr = cell.getBoundingClientRect()
    const sr = shell.getBoundingClientRect()
    return {
      x: cr.left - sr.left + cr.width * 0.3,
      y: cr.top - sr.top + cr.height * 0.25,
    }
  }, [])

  const runVisitRef = useRef(null)

  const scheduleNext = useCallback(() => {
    schedule(() => runVisitRef.current?.(), 900)
  }, [schedule])

  const showSnackbar = useCallback(
    (day, time, onDone) => {
      setSnackbar({ day, time, phase: 'in' })
      schedule(() => {
        setSnackbar((prev) => (prev ? { ...prev, phase: 'out' } : null))
        schedule(() => {
          setSnackbar(null)
          onDone?.()
        }, 320)
      }, 1800)
    },
    [schedule],
  )

  runVisitRef.current = () => {
    if (animRunningRef.current) return
    animRunningRef.current = true

    const day = SCHEDULER_VISIT_SEQUENCE[visitIdxRef.current % SCHEDULER_VISIT_SEQUENCE.length]
    visitIdxRef.current += 1

    const pos = getCellPos(day)
    if (!pos) {
      animRunningRef.current = false
      scheduleNext()
      return
    }

    setCursor({ left: pos.x - 4, top: pos.y - 2 })

    schedule(() => {
      setHighlightDay(day)
      setClickedDay(null)
    }, 650)

    schedule(() => {
      setRippleDay(day)
      schedule(() => setRippleDay(null), 520)

      setHighlightDay(null)
      setClickedDay(day)
      setCursor({ left: pos.x - 2, top: pos.y })

      const time = pickRandom(SCHEDULER_TIMES)

      schedule(() => {
        const newPost = pickRandom(SCHEDULER_POST_OPTIONS)
        const nextPosts = { ...calPostsRef.current, [day]: newPost }
        calPostsRef.current = nextPosts
        setCalPosts(nextPosts)
        setChipPopDay(day)
        setClickedDay(day)

        showSnackbar(day, time, () => {
          setHighlightDay(null)
          setClickedDay(null)
          setChipPopDay(null)
          setCursor({ left: pos.x + 40, top: pos.y - 30 })
          animRunningRef.current = false
          scheduleNext()
        })
      }, 100)
    }, 1100)
  }

  useEffect(() => {
    calPostsRef.current = calPosts
  }, [calPosts])

  useEffect(() => {
    setCursor({ left: 30, top: 60 })
    schedule(() => runVisitRef.current?.(), 800)
    return clearTimeouts
  }, [clearTimeouts, schedule])

  return (
    <div className="feature-scheduler-viewport" aria-hidden>
      <div className="feature-scheduler-shell" ref={shellRef}>
        <div className="fs-tbar">
          <div className="fs-dot" style={{ background: '#ff5f57' }} />
          <div className="fs-dot" style={{ background: '#ffbd2e' }} />
          <div className="fs-dot" style={{ background: '#28c840' }} />
          <div className="fs-tbar-title">Metriwo · Schedule</div>
          <div className="fs-tbar-date">
            <Calendar size={12} strokeWidth={2} aria-hidden />
            May 2026
          </div>
        </div>

        <div className="fs-body">
          <div className="fs-cal-header">
            <div className="fs-cal-month">May 2026</div>
            <div className="fs-cal-header-right">
              <div className="fs-sched-count">{schedCount} scheduled</div>
              <div className="fs-cal-nav">
                <button type="button" className="fs-nav-btn" tabIndex={-1}>
                  ‹
                </button>
                <button type="button" className="fs-nav-btn" tabIndex={-1}>
                  ›
                </button>
              </div>
            </div>
          </div>

          <div className="fs-cal-grid">
            {SCHEDULER_DAYS.map((d) => (
              <div key={d} className="fs-day-hdr">
                {d}
              </div>
            ))}
            {Array.from({ length: SCHEDULER_CAL_START }).map((_, i) => (
              <div key={`empty-${i}`} className="fs-day-cell empty" />
            ))}
            {Array.from({ length: 31 }, (_, i) => {
              const d = i + 1
              const post = calPosts[d]
              const classes = [
                'fs-day-cell',
                d === 23 ? 'today' : '',
                highlightDay === d ? 'hovered' : '',
                clickedDay === d ? 'clicked' : '',
                post ? 'has-post' : '',
              ]
                .filter(Boolean)
                .join(' ')

              return (
                <div key={d} id={`fs-dc-${d}`} className={classes}>
                  <div className="fs-day-num">{d}</div>
                  {post && (
                    <div
                      className={`fs-post-chip ${post.status === 'pub' ? 'fs-chip-pub' : 'fs-chip-sched'}${chipPopDay === d ? ' fs-chip-pop' : ''}`}
                    >
                      <span>{post.emoji}</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.label}</span>
                    </div>
                  )}
                  {rippleDay === d && <div className="fs-ripple" />}
                </div>
              )
            })}
          </div>
        </div>

        <div
          className="fs-cursor"
          style={{ left: cursor.left, top: cursor.top }}
        >
          <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden>
            <path
              d="M4 1L4 18L8 14L11 20L13.5 19L10.5 13L16 13L4 1Z"
              fill="#1A1433"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {snackbar && (
          <div className={`fs-snackbar ${snackbar.phase}`}>
            <div className="fs-snack-dot" />
            <span>
              ✓ Scheduled for <strong>May {snackbar.day}</strong> at {snackbar.time}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
