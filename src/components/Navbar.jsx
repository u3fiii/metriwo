import { useCallback, useEffect, useRef, useState } from 'react'
import { CircleDollarSign, Home, Layers, Sparkles } from 'lucide-react'
import logoHeader from '../assets/logo-header.png'

function MobileMenuToggle({ open, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`menu-btn ${className}`.trim()}
      aria-expanded={open}
      aria-label={open ? 'Close menu' : 'Open menu'}
    >
      <span className={`bar top ${open ? 'open' : ''}`} />
      <span className={`bar bottom ${open ? 'open' : ''}`} />
    </button>
  )
}

// Slight pull-back then overshoot — feels like anticipation + bounce
const DOT_EASING = 'cubic-bezier(0.55, -0.15, 0.25, 1.35)'

const NAV_LINKS = [
  { label: 'Home', href: '#', sectionId: null, icon: Home },
  { label: 'Features', href: '#features', sectionId: 'features', icon: Sparkles },
  { label: 'Platforms', href: '#platforms', sectionId: 'platforms', icon: Layers },
  { label: 'Pricing', href: '#pricing', sectionId: 'pricing', icon: CircleDollarSign },
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const navRef = useRef(null)
  const linkRefs = useRef([])
  const lastScrollY = useRef(0)
  const mobileNavRef = useRef(null)

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false)
  }, [])

  const moveDotToLink = useCallback((index) => {
    const nav = navRef.current
    const link = linkRefs.current[index]
    if (!nav || !link) return

    const update = () => {
      setDotLeft(link.offsetLeft + link.offsetWidth / 2)
    }

    update()
    requestAnimationFrame(update)
  }, [])

  const handleNavClick = useCallback(
    (index, sectionId) => {
      setActiveIndex(index)
      closeMobileMenu()

      if (sectionId) {
        const section = document.getElementById(sectionId)
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
      }

      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [closeMobileMenu],
  )

  useEffect(() => {
    if (mobileOpen) {
      setShowDropdown(true)
      return undefined
    }

    setDropdownOpen(false)
    setShowDropdown(false)
    return undefined
  }, [mobileOpen])

  useEffect(() => {
    if (!showDropdown || !mobileOpen) return undefined

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setDropdownOpen(true))
    })
    return () => cancelAnimationFrame(id)
  }, [showDropdown, mobileOpen])

  useEffect(() => {
    moveDotToLink(activeIndex)

    const onResize = () => moveDotToLink(activeIndex)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [activeIndex, moveDotToLink])

  useEffect(() => {
    const desktopMq = window.matchMedia('(min-width: 768px)')

    const onScroll = () => {
      const y = window.scrollY

      // Shrink-on-scroll only on desktop — mobile scroll bounce was resizing the bar
      if (desktopMq.matches) {
        if (y > lastScrollY.current + 4 && y > 16) {
          setScrolledDown(true)
        } else if (y < lastScrollY.current - 4 || y <= 8) {
          setScrolledDown(false)
        }
      } else {
        setScrolledDown(false)
      }

      lastScrollY.current = y
      setActiveIndex(getActiveIndexFromScroll())
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return undefined

    function onKey(e) {
      if (e.key === 'Escape') closeMobileMenu()
    }

    function onPointerDown(e) {
      if (mobileNavRef.current?.contains(e.target)) return
      closeMobileMenu()
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [mobileOpen, closeMobileMenu])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (mq.matches) closeMobileMenu()
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [closeMobileMenu])

  return (
    <header
      className={`fixed inset-x-0 z-50 w-full min-w-0 px-4 transition-[top] duration-500 ease-out sm:px-6 ${
        scrolledDown ? 'md:top-3' : ''
      } top-5`}
    >
      <div ref={mobileNavRef} className="relative mx-auto w-full min-w-0 max-w-[50.2rem]">
        <div
          className={`relative z-10 flex min-w-0 w-full items-center justify-between rounded-full border border-white/60 bg-white/50 px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl backdrop-saturate-150 transition-[transform,box-shadow] duration-500 ease-out ${
            scrolledDown ? 'md:scale-95' : ''
          }`}
        >
          <a
            href="#"
            className="flex shrink-0 items-center"
            onClick={() => handleNavClick(0, null)}
          >
            <img
              src={logoHeader}
              alt="metriwo"
              className="h-[1.6rem] w-auto object-contain sm:h-[1.8rem]"
              draggable={false}
            />
          </a>

          <nav
            ref={navRef}
            className="relative hidden translate-y-1 items-center gap-6 pb-2 md:flex"
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
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(index, link.sectionId)
                  }}
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

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="hidden text-sm font-medium text-zinc-700 hover:text-zinc-900 md:inline-flex"
            >
              Log in
            </button>
            <button
              type="button"
              className="rounded-full bg-[#5B3AFF] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:px-5 sm:py-2.5"
            >
              Sign Up
            </button>

            <div className="md:hidden">
              <MobileMenuToggle
                open={mobileOpen}
                onClick={() => setMobileOpen((open) => !open)}
                className="rounded-full text-zinc-800 transition-colors hover:bg-white/80"
              />
            </div>
          </div>
        </div>

        {showDropdown && (
          <div className="mobile-nav-dropdown-clip absolute inset-x-0 top-full z-0 md:hidden">
            <div
              className={`mobile-nav-dropdown ${dropdownOpen ? 'is-open' : ''}`}
            >
              <div className="pt-2">
                <div
                  className="rounded-2xl border border-white/80 bg-white/92 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-md backdrop-saturate-150"
                  role="menu"
                  aria-label="Navigation menu"
                >
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link, index) => {
                  const Icon = link.icon
                  return (
                    <button
                      key={link.label}
                      type="button"
                      role="menuitem"
                      onClick={() => handleNavClick(index, link.sectionId)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-white/50 hover:text-zinc-900"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                        <Icon className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                      </span>
                      {link.label}
                    </button>
                  )
                })}
              </nav>

              <div className="mt-1 flex flex-col gap-2 border-t border-white/50 px-1 pt-2">
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="w-full rounded-full bg-zinc-100 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-200"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="w-full rounded-full bg-[#5B3AFF] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Sign Up
                </button>
              </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
