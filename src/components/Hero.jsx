import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from 'react-icons/si'
import HeroArtwork from './hero/HeroArtwork'

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

  return { text }
}

const PLATFORMS = [
  {
    id: 'youtube',
    label: 'YouTube',
    typewriter: 'YouTube',
    color: '#FF0000',
    Icon: SiYoutube,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    typewriter: 'Instagram',
    color: '#E1306C',
    Icon: SiInstagram,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    typewriter: 'TikTok',
    color: '#010101',
    Icon: SiTiktok,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    typewriter: 'Facebook',
    color: '#1877F2',
    Icon: SiFacebook,
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
    { username: 'charlidamelio', name: "Charli D'Amelio", followers: '155M' },
    { username: 'khaby.lame', name: 'Khabane Lame', followers: '162M' },
    { username: 'bellapoarch', name: 'Bella Poarch', followers: '93M' },
  ],
  facebook: [
    { username: 'meta', name: 'Meta', followers: '110M' },
    { username: 'cocacola', name: 'Coca-Cola', followers: '107M' },
    { username: 'nike', name: 'Nike', followers: '39M' },
  ],
}

export default function Hero() {
  const { text: typewriterText } = useTypewriter(PLATFORMS.map((p) => p.typewriter))

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
    <section className="relative z-[1] flex min-h-screen flex-col px-4 pb-6 pt-20 sm:px-6 lg:pt-24">
      <div className="mx-auto flex  w-full max-w-6xl flex-1 flex-col items-center justify-center gap-0 lg:flex-row-reverse lg:items-center lg:gap-0 lg:px-20 xl:max-w-7xl xl:gap-0 ">
        <HeroArtwork />

        {/* Title, subtitle, search — right */}
        <div className="flex w-full flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="text-2xl font-medium leading-tight tracking-tight text-zinc-900 sm:text-4xl lg:text-2xl">
            Scale your brand on{' '}
            <span className="inline-block min-w-[11ch] text-left font-bold text-zinc-900 lg:mt-2 lg:text-6xl">
              {typewriterText}
              <span
                className="ml-0.5 inline-block w-[3px] bg-zinc-900 align-middle "
                style={{
                  height: '0.85em',
                  animation: 'blink-cursor 1s step-end infinite',
                }}
                aria-hidden
              />
            </span>
          </h1>

          <p className="mt-3 max-w-md text-lg font-regular text-zinc-600 sm:text-base lg:text-[14px]">
            The only all-in-one social management tool you&apos;ll ever need
          </p>

          <div
            ref={searchRef}
            className="relative mt-5 w-full max-w-[445px] overflow-visible sm:mt-6"
          >
            <div className="flex w-full items-center gap-2 rounded-lg bg-[#f1f1f350] py-2 pl-4 pr-2 shadow-[0_8px_40px_rgba(0,0,0,0.08)] ring-1 ring-zinc-200/80 transition-[background-color,box-shadow] duration-300 ease-in-out hover:ring-[3px] hover:ring-zinc-300/70 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#5B3AFF] focus-within:shadow-[0_8px_32px_rgba(91,58,255,0.12)]">
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
                placeholder="Enter any name or username"
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
                  <ul className="absolute right-0 top-full z-20 mt-2 min-w-[200px] rounded-lg bg-white p-1 shadow-[0_12px_40px_rgba(0,0,0,0.12)] ring-1 ring-zinc-100">
                    {PLATFORMS.map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setPlatform(p)
                            setPlatformOpen(false)
                            setSelectedAccount(null)
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
            {accountsOpen && filteredAccounts.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-10 mt-2 max-h-64 overflow-auto rounded-lg bg-white p-1 text-left shadow-[0_12px_40px_rgba(0,0,0,0.12)] ring-1 ring-zinc-100">
                {filteredAccounts.map((account) => (
                  <li key={account.username}>
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

            {accountsOpen && query.trim() && filteredAccounts.length === 0 && (
              <p className="absolute left-0 right-0 top-full mt-2 rounded-lg bg-white px-4 py-3 text-sm font-light text-zinc-500 shadow-lg ring-1 ring-zinc-100">
                No accounts found for &quot;{query}&quot; on {platform.label}
              </p>
            )}

            {/* Selected account preview */}
            {selectedAccount && (
              <div className="mt-4 rounded-lg bg-white px-5 py-4 text-left shadow-[0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-zinc-100">
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
      </div>
    </section>
  )
}
