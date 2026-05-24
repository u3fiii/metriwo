import { useCallback, useEffect, useRef, useState } from 'react'
import { INBOX_REPLY_FULL, INBOX_REPLY_SHORT, INBOX_THREADS } from './featureEngagementData'
import './featureEngagement.css'

export default function FeatureEngagementPanel() {
  const shellRef = useRef(null)
  const chatMessagesRef = useRef(null)
  const animLockRef = useRef(false)
  const abortRef = useRef(false)
  const timeoutIdsRef = useRef([])

  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [repliedIds, setRepliedIds] = useState(() => new Set())
  const [highlightThread, setHighlightThread] = useState(0)
  const [activeChatThread, setActiveChatThread] = useState(0)
  const [selectBarVisible, setSelectBarVisible] = useState(false)
  const [checkAllChecked, setCheckAllChecked] = useState(false)
  const [selText, setSelText] = useState('Select all')
  const [selCountVisible, setSelCountVisible] = useState(false)
  const [selCount, setSelCount] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [inputActive, setInputActive] = useState(false)
  const [inputPlaceholder, setInputPlaceholder] = useState('Reply to all…')
  const [cursor, setCursor] = useState({ left: -30, top: 80 })
  const [sendPressed, setSendPressed] = useState(false)
  const [sendRipple, setSendRipple] = useState(false)
  const [chatMsgKey, setChatMsgKey] = useState(0)

  const unreadCount = Math.max(0, INBOX_THREADS.length - repliedIds.size)

  const clearTimeouts = useCallback(() => {
    timeoutIdsRef.current.forEach(clearTimeout)
    timeoutIdsRef.current = []
  }, [])

  const wait = useCallback(
    (ms) =>
      new Promise((resolve) => {
        const id = setTimeout(resolve, ms)
        timeoutIdsRef.current.push(id)
      }),
    [],
  )

  const getPos = useCallback((el) => {
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

  const typeInto = useCallback(
    (text, speed) =>
      new Promise((resolve) => {
        if (abortRef.current) {
          resolve()
          return
        }
        setInputValue('')
        setInputActive(true)
        let i = 0
        function step() {
          if (abortRef.current) {
            resolve()
            return
          }
          if (i < text.length) {
            setInputValue(text.slice(0, i + 1))
            i += 1
            const id = setTimeout(step, speed)
            timeoutIdsRef.current.push(id)
          } else {
            resolve()
          }
        }
        step()
      }),
    [],
  )

  useEffect(() => {
    const el = chatMessagesRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [activeChatThread, repliedIds, chatMsgKey])

  useEffect(() => {
    abortRef.current = false

    async function runLoop() {
      if (animLockRef.current || abortRef.current) return
      animLockRef.current = true

      setSelectedIds(new Set())
      setRepliedIds(new Set())
      setHighlightThread(0)
      setActiveChatThread(0)
      setSelectBarVisible(false)
      setCheckAllChecked(false)
      setSelCountVisible(false)
      setSelText('Select all')
      setSelCount(0)
      setInputValue('')
      setInputActive(false)
      setInputPlaceholder('Reply to all…')
      setSendPressed(false)
      setSendRipple(false)
      setChatMsgKey((k) => k + 1)
      setCursor({ left: -30, top: 80 })

      await wait(400)
      if (abortRef.current) return

      const tr0 = shellRef.current?.querySelector('#fe-tr-0')
      const p0 = getPos(tr0)
      if (p0) setCursor({ left: p0.x + p0.w * 0.5, top: p0.y + p0.h * 0.4 })
      await wait(700)
      if (abortRef.current) return

      setSelectBarVisible(true)
      await wait(300)
      if (abortRef.current) return

      const selBar = shellRef.current?.querySelector('#fe-select-bar')
      const spb = getPos(selBar)
      if (spb) setCursor({ left: spb.x + 14, top: spb.y + spb.h / 2 })
      await wait(600)
      if (abortRef.current) return

      setCheckAllChecked(true)
      setSelText('Selected')
      setSelCountVisible(true)

      const nextSelected = new Set()
      for (let i = 0; i < INBOX_THREADS.length; i++) {
        if (abortRef.current) return
        nextSelected.add(i)
        setSelectedIds(new Set(nextSelected))
        setSelCount(nextSelected.size)
        setHighlightThread(i)
        await wait(90)
      }
      await wait(300)
      if (abortRef.current) return

      const inp = shellRef.current?.querySelector('#fe-comp-input')
      const inpP = getPos(inp)
      if (inpP) setCursor({ left: inpP.x + inpP.w * 0.4, top: inpP.y + inpP.h * 0.5 })
      await wait(550)
      if (abortRef.current) return

      setInputActive(true)
      setInputPlaceholder('')
      await typeInto(INBOX_REPLY_SHORT, 38)
      await wait(300)
      if (abortRef.current) return

      const sendBtn = shellRef.current?.querySelector('#fe-send-btn')
      const sbp = getPos(sendBtn)
      if (sbp) setCursor({ left: sbp.x + sbp.w / 2, top: sbp.y + sbp.h / 2 })
      await wait(500)
      if (abortRef.current) return

      setSendPressed(true)
      setSendRipple(true)
      await wait(150)
      setSendPressed(false)
      await wait(270)
      setSendRipple(false)
      if (abortRef.current) return

      setInputValue('')
      setInputActive(false)
      setInputPlaceholder('Reply to all…')

      const replied = new Set()
      let remainingSelected = new Set(INBOX_THREADS.map((t) => t.id))

      for (let i = 0; i < INBOX_THREADS.length; i++) {
        if (abortRef.current) return
        replied.add(i)
        remainingSelected = new Set([...remainingSelected].filter((id) => id !== i))
        setRepliedIds(new Set(replied))
        setSelectedIds(new Set(remainingSelected))
        setHighlightThread(i)
        setActiveChatThread(i)
        setChatMsgKey((k) => k + 1)
        await wait(160)
      }

      setSelCountVisible(false)
      setCheckAllChecked(false)
      setSelectBarVisible(false)
      await wait(2200)

      animLockRef.current = false
      if (!abortRef.current) runLoop()
    }

    const startId = setTimeout(() => runLoop(), 600)
    timeoutIdsRef.current.push(startId)

    return () => {
      abortRef.current = true
      animLockRef.current = false
      clearTimeouts()
    }
  }, [clearTimeouts, getPos, typeInto, wait])

  const activeThread = INBOX_THREADS[activeChatThread] ?? INBOX_THREADS[0]
  const showReply = repliedIds.has(activeChatThread)

  return (
    <div className="feature-engagement-viewport" aria-hidden>
      <div className="feature-engagement-shell" ref={shellRef}>
        <div className="fe-tbar">
          <div className="fe-dot" style={{ background: '#ff5f57' }} />
          <div className="fe-dot" style={{ background: '#ffbd2e' }} />
          <div className="fe-dot" style={{ background: '#28c840' }} />
          <div className="fe-tbar-title">Metriwo · Inbox</div>
          <div className="fe-tbar-inbox">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#E91E8C" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Inbox
          </div>
        </div>

        <div className="fe-inbox-layout">
          <div className="fe-thread-list">
            <div className="fe-thread-hdr">
              Messages
              <span className="fe-unread-badge">{unreadCount}</span>
            </div>

            <div
              id="fe-select-bar"
              className={`fe-select-bar${selectBarVisible ? '' : ' hidden'}`}
            >
              <span className={`fe-check-all${checkAllChecked ? ' checked' : ''}`}>
                {checkAllChecked ? '✓' : ''}
              </span>
              <span>{selText}</span>
              {selCountVisible && <span className="fe-sel-count">{selCount}</span>}
            </div>

            <div className="fe-thread-scroll">
              {INBOX_THREADS.map((t) => {
                const classes = [
                  'fe-thread-item',
                  t.id === highlightThread ? 'active-thread' : '',
                  selectedIds.has(t.id) ? 'selected' : '',
                  repliedIds.has(t.id) ? 'replied' : '',
                ]
                  .filter(Boolean)
                  .join(' ')

                return (
                  <div key={t.id} id={`fe-tr-${t.id}`} className={classes}>
                    <div className="fe-t-avatar" style={{ background: t.color }}>
                      {t.name[1]?.toUpperCase()}
                    </div>
                    <div className="fe-t-body">
                      <div className="fe-t-meta">
                        <span className="fe-t-name">{t.name}</span>
                        <span className="fe-t-time">{t.time}</span>
                      </div>
                      <div className="fe-t-preview">
                        {repliedIds.has(t.id) ? '✓ Replied' : t.msg}
                      </div>
                    </div>
                    <div
                      className="fe-unread-dot"
                      style={{ background: repliedIds.has(t.id) ? '#00B894' : '#E91E8C' }}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="fe-chat-area">
            <div className="fe-chat-hdr">
              <div className="fe-chat-hdr-name">{activeThread.name}</div>
              <div className="fe-chat-hdr-sub">
                <div className="fe-plat-pip">
                  <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
                  </svg>
                </div>
                Instagram · 2m ago
              </div>
            </div>

            <div className="fe-chat-messages" ref={chatMessagesRef} key={chatMsgKey}>
              <div className="fe-msg-in fe-msg-in-anim">{activeThread.msg}</div>
              {showReply && (
                <div className="fe-msg-out fe-sent-pop">
                  {INBOX_REPLY_FULL}
                  <div className="fe-msg-time">
                    <span className="fe-msg-tick">✓✓</span> Sent
                  </div>
                </div>
              )}
            </div>

            <div className="fe-composer">
              <input
                id="fe-comp-input"
                className={`fe-comp-input${inputActive ? ' active' : ''}`}
                value={inputValue}
                readOnly
                placeholder={inputPlaceholder}
                tabIndex={-1}
              />
              <button
                id="fe-send-btn"
                type="button"
                className={`fe-send-btn${sendPressed ? ' pressed' : ''}`}
                tabIndex={-1}
              >
                {sendRipple && <div className="fe-ripple" />}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="fe-cursor" style={{ left: cursor.left, top: cursor.top }}>
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
