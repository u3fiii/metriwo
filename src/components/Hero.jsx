import { useEffect, useRef, useState } from 'react'
import heroImage from '../assets/hero.png'

function useTypewriter(strings, { typingDelay = 80, deletingDelay = 50, pauseMs = 1800 } = {}) {
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
      }, 400)
    } else if (deleting) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), deletingDelay)
    } else {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), typingDelay)
    }

    return () => clearTimeout(timeout)
  }, [text, deleting, index, strings, typingDelay, deletingDelay, pauseMs])

  return { text, platformIndex: index % strings.length }
}

const PLATFORMS = [
  {
    id: 'youtube',
    label: 'YouTube',
    typewriter: 'YouTube',
    color: '#FF0000',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .6 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.8ZM9.6 15.5V8.5l6.3 3.5-6.3 3.5Z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    typewriter: 'Instagram',
    color: '#E1306C',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M12 2.2c2.7 0 3 .01 4.04.06 1.02.05 1.57.22 1.94.37.49.19.84.42 1.2.78.37.37.6.72.78 1.2.15.37.32.92.37 1.94.05 1.04.06 1.34.06 4.04s-.01 3-.06 4.04c-.05 1.02-.22 1.57-.37 1.94a3.1 3.1 0 0 1-.78 1.2 3.1 3.1 0 0 1-1.2.78c-.37.15-.92.32-1.94.37-1.04.05-1.34.06-4.04.06s-3-.01-4.04-.06c-1.02-.05-1.57-.22-1.94-.37a3.1 3.1 0 0 1-1.2-.78 3.1 3.1 0 0 1-.78-1.2c-.15-.37-.32-.92-.37-1.94C2.2 15 2.2 14.7 2.2 12s.01-3 .06-4.04c.05-1.02.22-1.57.37-1.94.19-.49.42-.84.78-1.2.37-.37.72-.6 1.2-.78.37-.15.92-.32 1.94-.37C9 2.2 9.3 2.2 12 2.2Zm0 1.8c-2.6 0-2.9.01-3.93.06-.95.04-1.47.2-1.81.33-.46.18-.78.4-1.13.75-.35.35-.57.67-.75 1.13-.13.34-.29.86-.33 1.81-.04 1.03-.06 1.33-.06 3.93s.02 2.9.06 3.93c.04.95.2 1.47.33 1.81.18.46.4.78.75 1.13.35.35.67.57 1.13.75.34.13.86.29 1.81.33 1.03.04 1.33.06 3.93.06s2.9-.02 3.93-.06c.95-.04 1.47-.2 1.81-.33.46-.18.78-.4 1.13-.75.35-.35.57-.67.75-1.13.13-.34.29-.86.33-1.81.04-1.03.06-1.33.06-3.93s-.02-2.9-.06-3.93c-.04-.95-.2-1.47-.33-1.81a3.1 3.1 0 0 0-.75-1.13 3.1 3.1 0 0 0-1.13-.75c-.34-.13-.86-.29-1.81-.33-1.03-.04-1.33-.06-3.93-.06Zm0 3.4a5.6 5.6 0 1 1 0 11.2 5.6 5.6 0 0 1 0-11.2Zm0 1.8a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm6.4-2.5a1.3 1.3 0 1 1-2.6 0 1.3 1.3 0 0 1 2.6 0Z" />
      </svg>
    ),
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    typewriter: 'TikTok',
    color: '#010101',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.18 8.18 0 0 0 4.77 1.52V6.82a4.84 4.84 0 0 1-1-.13Z" />
      </svg>
    ),
  },
  {
    id: 'facebook',
    label: 'Facebook',
    typewriter: 'Facebook',
    color: '#1877F2',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3 1.79-4.66 4.53-4.66 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87v2.25h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07Z" />
      </svg>
    ),
  },
]

const MOCK_ACCOUNTS = {
  youtube: [
    { username: 'mkbhd', name: 'Marques Brownlee', followers: '19.8M' },
    { username: 'mrbeast', name: 'MrBeast', followers: '321M' },
    { username: 'linus', name: 'Linus Tech Tips', followers: '16.2M' },
  ],
  instagram: [
    { username: 'nike', name: 'Nike', followers: '306M' },
    { username: 'natgeo', name: 'National Geographic', followers: '283M' },
    { username: 'cristiano', name: 'Cristiano Ronaldo', followers: '651M' },
  ],
  tiktok: [
    { username: 'charlidamelio', name: 'Charli D\'Amelio', followers: '155M' },
    { username: 'khaby.lame', name: 'Khabane Lame', followers: '162M' },
    { username: 'bellapoarch', name: 'Bella Poarch', followers: '93M' },
  ],
  facebook: [
    { username: 'meta', name: 'Meta', followers: '110M' },
    { username: 'cocacola', name: 'Coca-Cola', followers: '107M' },
    { username: 'nike', name: 'Nike', followers: '39M' },
  ],
}

function ChevronDown({ className = '' }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-4 w-4 ${className}`}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5 shrink-0 text-zinc-400"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m17.5 17.5-4-4m1.5-5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
      />
    </svg>
  )
}

export default function Hero() {
  const { text: typewriterText, platformIndex } = useTypewriter(
    PLATFORMS.map((p) => p.typewriter),
  )
  const activeTypewriter = PLATFORMS[platformIndex]

  const [platform, setPlatform] = useState(PLATFORMS[1])
  const [platformOpen, setPlatformOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [accountsOpen, setAccountsOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const searchRef = useRef(null)
  const platformRef = useRef(null)

  const accounts = MOCK_ACCOUNTS[platform.id] ?? []
  const filteredAccounts = query.trim()
    ? accounts.filter(
        (a) =>
          a.username.toLowerCase().includes(query.toLowerCase()) ||
          a.name.toLowerCase().includes(query.toLowerCase()),
      )
    : accounts

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
    setSelectedAccount(null)
    setAccountsOpen(value.trim().length > 0)
  }

  function selectAccount(account) {
    setSelectedAccount(account)
    setQuery(account.username)
    setAccountsOpen(false)
  }

  return (
    <section className="flex min-h-screen flex-col px-4 pb-6 pt-20 sm:px-6 sm:pt-24">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-3 text-center sm:gap-4">
        <div className="w-full shrink-0">
          <img
            src={heroImage}
            alt="Metriwo analytics dashboards on mobile devices"
            className="mx-auto h-auto w-full max-w-[200px] object-contain sm:max-w-[260px] md:max-w-[300px]"
            draggable={false}
          />
        </div>

        {/* Title + typewriter */}
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl lg:text-[2.75rem]">
          Scale your brand on{' '}
          <span
            className="inline-block min-w-[11ch] text-left font-bold"
            style={{ color: activeTypewriter.color }}
          >
            {typewriterText}
            <span
              className="ml-0.5 inline-block w-[3px] bg-zinc-900 align-middle"
              style={{ height: '0.85em', animation: 'blink-cursor 1s step-end infinite' }}
              aria-hidden
            />
          </span>
        </h1>

        <p className="mx-auto max-w-xl text-sm font-light text-zinc-600 sm:text-base">
          The only all-in-one social management tool you&apos;ll ever need
        </p>

        {/* Search bar */}
        <div ref={searchRef} className="relative mx-auto mt-4 w-full max-w-2xl sm:mt-5">
          <div className="flex items-center gap-2 rounded-full bg-white py-2 pl-5 pr-2 shadow-[0_8px_40px_rgba(0,0,0,0.08)] ring-1 ring-zinc-200/80">
            <SearchIcon />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => query.trim() && setAccountsOpen(true)}
              placeholder="Enter any name or username"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-zinc-900 outline-none placeholder:font-light placeholder:text-zinc-400"
            />

            <div ref={platformRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setPlatformOpen((o) => !o)
                  setAccountsOpen(false)
                }}
                className="flex items-center gap-2 rounded-full bg-[#5B3AFF] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <span className="flex h-5 w-5 items-center justify-center">
                  {platform.icon}
                </span>
                <span>{platform.label}</span>
                <ChevronDown
                  className={`transition-transform ${platformOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {platformOpen && (
                <ul className="absolute right-0 top-full z-20 mt-2 min-w-[180px] overflow-hidden rounded-2xl bg-white py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] ring-1 ring-zinc-100">
                  {PLATFORMS.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setPlatform(p)
                          setPlatformOpen(false)
                          setSelectedAccount(null)
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-zinc-50 ${
                          platform.id === p.id
                            ? 'font-semibold text-[#5B3AFF]'
                            : 'font-medium text-zinc-700'
                        }`}
                      >
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: `${p.color}18`,
                            color: p.color,
                          }}
                        >
                          {p.icon}
                        </span>
                        {p.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Accounts dropdown */}
          {accountsOpen && filteredAccounts.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-10 mt-2 max-h-64 overflow-auto rounded-2xl bg-white py-2 text-left shadow-[0_12px_40px_rgba(0,0,0,0.12)] ring-1 ring-zinc-100">
              {filteredAccounts.map((account) => (
                <li key={account.username}>
                  <button
                    type="button"
                    onClick={() => selectAccount(account)}
                    className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-50"
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

          {accountsOpen && query.trim() && filteredAccounts.length === 0 && (
            <p className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white px-4 py-3 text-sm font-light text-zinc-500 shadow-lg ring-1 ring-zinc-100">
              No accounts found for &quot;{query}&quot; on {platform.label}
            </p>
          )}

          {/* Selected account preview */}
          {selectedAccount && (
            <div className="mt-4 rounded-2xl bg-white px-5 py-4 text-left shadow-[0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-zinc-100">
              <p className="text-xs font-medium uppercase tracking-wide text-[#5B3AFF]">
                {platform.label} profile
              </p>
              <p className="mt-1 text-lg font-semibold text-zinc-900">
                {selectedAccount.name}
              </p>
              <p className="text-sm font-light text-zinc-500">
                @{selectedAccount.username} · {selectedAccount.followers} followers
              </p>
              <p className="mt-2 text-xs font-light text-zinc-400">
                Account data preview — full analytics coming in the next step.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
