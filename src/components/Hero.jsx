import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import HeroArtwork from './hero/HeroArtwork'
import HeroAuthModal from './hero/HeroAuthModal'
import {
  DEFAULT_PLATFORM,
  PLATFORMS,
  TYPEWRITER_MAX_LABEL,
} from './hero/constants/platforms'

function PlatformLogo({ Icon, className = 'h-4 w-4 shrink-0' }) {
  return <Icon className={className} aria-hidden />
}

function useTypewriter(
  strings,
  { typingDelay = 45, deletingDelay = 25, pauseMs = 1200, switchDelay = 100 } = {},
) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = strings[index % strings.length]
    let timeout

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pauseMs)
    } else if (deleting && text === '') {
      timeout = setTimeout(() => {
        setDeleting(false)
        setIndex((i) => (i + 1) % strings.length)
      }, switchDelay)
    } else if (deleting) {
      timeout = setTimeout(
        () => setText(current.slice(0, text.length - 1)),
        deletingDelay,
      )
    } else {
      timeout = setTimeout(
        () => setText(current.slice(0, text.length + 1)),
        typingDelay,
      )
    }

    return () => clearTimeout(timeout)
  }, [text, deleting, index, strings, typingDelay, deletingDelay, pauseMs, switchDelay])

  return { text, index }
}

const MOCK_ACCOUNTS = {
  instagram: [
    { username: 'nike', name: 'Nike', followers: '306M' },
    { username: 'natgeo', name: 'National Geographic', followers: '283M' },
    { username: 'cristiano', name: 'Cristiano Ronaldo', followers: '651M' },
  ],
  tiktok: [
    { username: 'charlidamelio', name: "Charli D'Amelio", followers: '155M' },
    { username: 'khaby.lame', name: 'Khabane Lame', followers: '162M' },
    { username: 'bellapoarch', name: 'Bella Poarch', followers: '93M' },
  ],
  linkedin: [
    { username: 'microsoft', name: 'Microsoft', followers: '22M' },
    { username: 'satyanadella', name: 'Satya Nadella', followers: '11M' },
    { username: 'google', name: 'Google', followers: '32M' },
  ],
  facebook: [
    { username: 'meta', name: 'Meta', followers: '110M' },
    { username: 'cocacola', name: 'Coca-Cola', followers: '107M' },
    { username: 'nike', name: 'Nike', followers: '39M' },
  ],
  x: [
    { username: 'elonmusk', name: 'Elon Musk', followers: '198M' },
    { username: 'nasa', name: 'NASA', followers: '82M' },
    { username: 'openai', name: 'OpenAI', followers: '4.2M' },
  ],
}

const FAKE_RESULT_TEMPLATES = [
  { suffix: '', followers: '2.4M' },
  { suffix: ' Official', followers: '890K' },
  { suffix: ' HQ', followers: '156K' },
  { suffix: ' Live', followers: '42K' },
]

function slugFromQuery(query) {
  const slug = query.toLowerCase().replace(/[^a-z0-9]/g, '')
  return slug || 'creator'
}

function getDisplayAccounts(query, platformId) {
  const q = query.trim()
  if (!q) return []

  const base = MOCK_ACCOUNTS[platformId] ?? []
  const lower = q.toLowerCase()
  const matches = base.filter(
    (a) =>
      a.username.toLowerCase().includes(lower) || a.name.toLowerCase().includes(lower),
  )

  const results = [...matches]
  const slug = slugFromQuery(q)

  for (let i = 0; results.length < 3 && i < FAKE_RESULT_TEMPLATES.length; i++) {
    const template = FAKE_RESULT_TEMPLATES[i]
    const username = i === 0 ? slug : `${slug}${i + 1}`
    if (results.some((r) => r.username === username)) continue

    results.push({
      username,
      name: `${q}${template.suffix}`,
      followers: template.followers,
    })
  }

  return results.slice(0, 4)
}

export default function Hero() {
  const { text: typewriterText, index: typewriterIndex } = useTypewriter(
    PLATFORMS.map((p) => p.typewriter),
  )
  const typewriterPlatform = PLATFORMS[typewriterIndex % PLATFORMS.length]

  const [platform, setPlatform] = useState(DEFAULT_PLATFORM)
  const [searchPlaceholder, setSearchPlaceholder] = useState('username')
  const [platformOpen, setPlatformOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [accountsOpen, setAccountsOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authAccount, setAuthAccount] = useState(null)
  const searchRef = useRef(null)
  const platformRef = useRef(null)

  const displayAccounts = getDisplayAccounts(query, platform.id)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const syncPlaceholder = () => {
      setSearchPlaceholder(mq.matches ? 'Enter any name or username' : 'username')
    }
    syncPlaceholder()
    mq.addEventListener('change', syncPlaceholder)
    return () => mq.removeEventListener('change', syncPlaceholder)
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setAccountsOpen(false)
      }
      if (platformRef.current && !platformRef.current.contains(e.target)) {
        setPlatformOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleQueryChange(value) {
    setQuery(value)
    setAccountsOpen(value.trim().length > 0)
  }

  function selectAccount(account) {
    setAuthAccount(account)
    setQuery(account.username)
    setAccountsOpen(false)
    setAuthModalOpen(true)
  }

  function closeAuthModal() {
    setAuthModalOpen(false)
    setAuthAccount(null)
  }

  return (
    <section className="relative z-[1] flex min-h-screen flex-col px-4 pb-6 pt-20 sm:px-6 lg:pt-24">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-6 sm:gap-8 lg:flex-row-reverse lg:items-center lg:gap-0 lg:px-20 xl:max-w-7xl xl:gap-0">
        <HeroArtwork />

        {/* Title, subtitle, search — right */}
        <div className="flex w-full flex-1 flex-col items-center text-center lg:items-start lg:text-left lg:gap-2">
          <h1 className="flex flex-col items-center gap-5 overflow-visible text-center text-2xl font-medium leading-tight tracking-tight text-zinc-900 sm:text-4xl lg:block lg:gap-0 lg:text-left lg:text-2xl lg:leading-normal">
            <span className="lg:inline">Scale your brand on </span>
            <span
              className="typewriter-slot mx-auto inline-grid shrink-0 grid-cols-1 grid-rows-1 overflow-visible text-center font-bold lg:mx-0 lg:mt-2 lg:text-left"
              aria-live="polite"
              aria-atomic="true"
            >
              {/* Invisible sizer — locks width & height (no shift while typing) */}
              <span
                className="invisible col-start-1 row-start-1 inline-flex items-baseline whitespace-nowrap text-[40px] leading-[1.25] pb-[0.14em] lg:text-7xl lg:leading-[1.2] lg:pb-[0.2em]"
                aria-hidden
              >
                {TYPEWRITER_MAX_LABEL}
                <span className="ml-0.5 inline-block w-[3px] shrink-0" />
              </span>
              {/* Visible layer — same grid cell as sizer */}
              <span className="col-start-1 row-start-1 inline-flex items-baseline justify-center overflow-visible whitespace-nowrap text-[40px] leading-[1.25] lg:justify-start lg:text-7xl lg:leading-[1.2]">
                <span
                  className="typewriter-gradient-text transition-[background-image] duration-300"
                  style={{
                    backgroundImage: typewriterPlatform.typewriterGradient,
                  }}
                >
                  {typewriterText}
                </span>
                <span
                  className="ml-0.5 inline-block w-[3px] shrink-0 align-middle transition-[background] duration-300"
                  style={{
                    height: '0.85em',
                    background: typewriterPlatform.typewriterGradient,
                    animation: 'blink-cursor 1s step-end infinite',
                  }}
                  aria-hidden
                />
              </span>
            </span>
          </h1>

          <p className="mt-3 max-w-md text-lg font-regular text-zinc-600 sm:text-base lg:text-[14px]">
            The only all-in-one social management tool you&apos;ll ever need
          </p>

          <div
            ref={searchRef}
            className="relative mt-5 w-full max-w-[445px] overflow-visible sm:mt-6"
          >
            <div className="flex w-full items-center gap-2 rounded-lg bg-[#ffffff60] py-2 pl-4 pr-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-zinc-200/80 transition-[background-color,box-shadow,ring-color,ring-width] duration-300 ease-in-out hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:ring-[3px] hover:ring-zinc-300/70 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#5B3AFF]">
              <Search
                className="h-[18px] w-[18px] shrink-0 text-zinc-400"
                strokeWidth={2}
                aria-hidden
              />
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onFocus={() => {
                  if (query.trim()) setAccountsOpen(true)
                }}
                placeholder={searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-zinc-900 outline-none placeholder:font-light placeholder:text-zinc-400"
              />

              <div ref={platformRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setPlatformOpen((o) => !o)
                    setAccountsOpen(false)
                  }}
                  className="flex items-center gap-2 rounded-lg bg-[#ffffffa4] px-3.5 py-2 text-sm font-medium text-zinc-600 transition-opacity hover:opacity-90"
                >
                  <PlatformLogo
                    Icon={platform.Icon}
                    className="h-4 w-4 text-zinc-700"
                  />
                  <span>{platform.label}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${platformOpen ? 'rotate-180' : ''}`}
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </button>

                {platformOpen && (
                  <ul className="absolute left-0 top-full z-20 mt-2 w-full min-w-0 rounded-lg bg-white p-1 shadow-[0_12px_40px_rgba(0,0,0,0.12)] ring-1 ring-zinc-100">
                    {PLATFORMS.map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setPlatform(p)
                            setPlatformOpen(false)
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-lg p-2 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 ${
                            platform.id === p.id ? 'bg-zinc-100 text-zinc-900' : ''
                          }`}
                        >
                          <PlatformLogo
                            Icon={p.Icon}
                            className="h-[18px] w-[18px] text-zinc-700"
                          />
                          {p.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Accounts dropdown */}
            {accountsOpen && displayAccounts.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-10 mt-2 max-h-64 overflow-auto rounded-lg bg-white p-1 text-left shadow-[0_12px_40px_rgba(0,0,0,0.12)] ring-1 ring-zinc-100">
                {displayAccounts.map((account, index) => (
                  <li key={`${account.username}-${index}`}>
                    <button
                      type="button"
                      onClick={() => selectAccount(account)}
                      className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-zinc-100"
                    >
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                        style={{ backgroundColor: platform.color }}
                      >
                        {account.name.charAt(0)}
                      </span>
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block truncate text-sm font-semibold text-zinc-900">
                          {account.name}
                        </span>
                        <span className="block truncate text-xs font-light text-zinc-500">
                          @{account.username} · {account.followers} followers
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

          </div>
        </div>
      </div>

      <HeroAuthModal
        open={authModalOpen}
        onClose={closeAuthModal}
        account={authAccount}
        platformLabel={platform.label}
        platformColor={platform.color}
      />
    </section>
  )
}
