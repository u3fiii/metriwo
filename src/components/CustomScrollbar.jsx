import { useCallback, useEffect, useRef, useState } from 'react'

const THUMB_WIDTH = 8
const MIN_THUMB_HEIGHT = 48
const HIDE_DELAY_MS = 900

export default function CustomScrollbar() {
  const [thumbHeight, setThumbHeight] = useState(0)
  const [thumbTop, setThumbTop] = useState(0)
  const [visible, setVisible] = useState(false)
  const [grabbing, setGrabbing] = useState(false)
  const [canScroll, setCanScroll] = useState(false)

  const hideTimerRef = useRef(null)
  const dragRef = useRef(null)

  const updateMetrics = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    const scrollable = scrollHeight - clientHeight

    if (scrollable <= 0) {
      setCanScroll(false)
      return
    }

    setCanScroll(true)

    const ratio = clientHeight / scrollHeight
    const height = Math.max(MIN_THUMB_HEIGHT, clientHeight * ratio)
    const maxThumbTop = clientHeight - height
    const top = scrollable > 0 ? (scrollTop / scrollable) * maxThumbTop : 0

    setThumbHeight(height)
    setThumbTop(top)
  }, [])

  const reveal = useCallback(() => {
    const scrollable =
      document.documentElement.scrollHeight - document.documentElement.clientHeight
    if (scrollable <= 0) return

    setVisible(true)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      if (!dragRef.current) setVisible(false)
    }, HIDE_DELAY_MS)
  }, [])

  useEffect(() => {
    updateMetrics()

    const onScroll = () => {
      updateMetrics()
      reveal()
    }

    const onResize = () => updateMetrics()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [updateMetrics, reveal])

  function handleThumbMouseDown(e) {
    e.preventDefault()
    setGrabbing(true)
    dragRef.current = true
    setVisible(true)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)

    const startY = e.clientY
    const startScrollTop = document.documentElement.scrollTop
    const { clientHeight, scrollHeight } = document.documentElement
    const scrollable = scrollHeight - clientHeight
    const maxThumbTop = clientHeight - thumbHeight

    function onMouseMove(moveEvent) {
      const deltaY = moveEvent.clientY - startY
      const scrollDelta = maxThumbTop > 0 ? (deltaY / maxThumbTop) * scrollable : 0
      window.scrollTo(0, startScrollTop + scrollDelta)
    }

    function onMouseUp() {
      setGrabbing(false)
      dragRef.current = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      reveal()
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  if (!canScroll) return null

  return (
    <div
      className="pointer-events-none fixed inset-y-0 right-0 z-[100] hidden w-5 justify-center md:flex"
      aria-hidden
    >
      <div
        className="pointer-events-auto relative h-full"
        style={{ width: THUMB_WIDTH }}
        onMouseEnter={() => {
          setVisible(true)
          if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
        }}
        onMouseLeave={() => {
          if (!dragRef.current) reveal()
        }}
      >
        <div
          role="presentation"
          onMouseDown={handleThumbMouseDown}
          className={`absolute left-0 cursor-grab rounded-md transition-[opacity,background-color] duration-300 ease-out active:cursor-grabbing ${
            grabbing ? 'bg-zinc-600/80' : 'bg-zinc-400/40'
          }`}
          style={{
            width: THUMB_WIDTH,
            height: thumbHeight,
            top: thumbTop,
            opacity: visible ? 1 : 0,
          }}
        />
      </div>
    </div>
  )
}
