import { useCallback, useEffect, useRef, useState } from 'react'
import logoHeader from '../assets/logo-header.png'

// Slight pull-back then overshoot — feels like anticipation + bounce
const DOT_EASING = 'cubic-bezier(0.55, -0.15, 0.25, 1.35)'

const NAV_LINKS = [
  { label: 'Home', href: '#', sectionId: null },
  { label: 'Features', href: '#features', sectionId: 'features' },
  { label: 'Platforms', href: '#platforms', sectionId: 'platforms' },
  { label: 'Pricing', href: '#pricing', sectionId: 'pricing' },
]

const SCROLL_SPY_OFFSET = 140

function getSectionTop(element) {
  return element.getBoundingClientRect().top + window.scrollY
}

function getActiveIndexFromScroll() {
  const marker = window.scrollY + SCROLL_SPY_OFFSET
  let activeIndex = 0

  NAV_LINKS.forEach((link, index) => {
    if (!link.sectionId) return
    const section = document.getElementById(link.sectionId)
    if (!section) return
    if (marker >= getSectionTop(section)) activeIndex = index
  })

  return activeIndex
}

export default function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [dotLeft, setDotLeft] = useState(0)
  const [scrolledDown, setScrolledDown] = useState(false)

  const navRef = useRef(null)
  const linkRefs = useRef([])
  const lastScrollY = useRef(0)

  // Center the dot under the active link (relative to the nav container)
  const moveDotToLink = useCallback((index) => {
    const nav = navRef.current
    const link = linkRefs.current[index]
    if (!nav || !link) return

    const navRect = nav.getBoundingClientRect()
    const linkRect = link.getBoundingClientRect()
    const centerX = linkRect.left - navRect.left + linkRect.width / 2

    setDotLeft(centerX)
  }, [])

  useEffect(() => {
    moveDotToLink(activeIndex)

    const onResize = () => moveDotToLink(activeIndex)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [activeIndex, moveDotToLink])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY

      if (y > lastScrollY.current && y > 8) {
        setScrolledDown(true)
      } else if (y < lastScrollY.current) {
        setScrolledDown(false)
      }

      lastScrollY.current = y
      setActiveIndex(getActiveIndexFromScroll())
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed left-0 right-0 z-50 px-4 transition-all duration-500 ease-out sm:px-6 ${
        scrolledDown ? 'top-3 scale-95' : 'top-5'
      }`}
    >
      {/* ~80% of previous max-w-5xl (64rem → 51.2rem) */}
      <div className="mx-auto flex max-w-[50.2rem] items-center justify-between rounded-full border border-white/60 bg-white/50 px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl backdrop-saturate-150">
        <a href="#" className="flex shrink-0 items-center">
          <img
            src={logoHeader}
            alt="metriwo"
            className="h-[1.6rem] w-auto object-contain sm:h-[1.8rem]"
            draggable={false}
          />
        </a>

        <nav
          ref={navRef}
          className="relative hidden items-center gap-6 pb-2 md:flex translate-y-1"
        >
          {NAV_LINKS.map((link, index) => {
            const isActive = index === activeIndex

            return (
              <a
                key={link.label}
                ref={(el) => {
                  linkRefs.current[index] = el
                }}
                href={link.href}
                onClick={() => setActiveIndex(index)}
                className={`text-sm transition-all ${
                  isActive
                    ? 'font-semibold text-zinc-900'
                    : 'font-medium text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {link.label}
              </a>
            )
          })}

          {/* Single dot — slides between links */}
          <span
            className="pointer-events-none absolute bottom-0 h-1.5 w-1.5 rounded-full bg-zinc-900"
            style={{
              left: dotLeft,
              transform: 'translateX(-50%)',

              transition: `left 0.6s ${DOT_EASING}`,
            }}
            aria-hidden
          />
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            className="hidden text-sm font-medium text-zinc-700 hover:text-zinc-900 sm:inline-flex"
          >
            Log in
          </button>
          <button
            type="button"
            className="rounded-full bg-[#5B3AFF] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:px-5 sm:py-2.5"
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  )
}
