import logoHeader from '../assets/logo-header.png'

const navLinks = [
  { label: 'Home', href: '#', active: true },
  { label: 'Features', href: '#features' },
  { label: 'Platforms', href: '#platforms' },
  { label: 'Pricing', href: '#pricing' },
]

export default function Navbar() {
  return (
    <header className="fixed top-5 left-0 right-0 z-50 px-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between rounded-full bg-white px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <a href="#" className="flex shrink-0 items-center">
          <img
            src={logoHeader}
            alt="metriwo"
            className="h-8 w-auto object-contain sm:h-9"
            draggable={false}
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`relative text-sm transition-colors ${
                link.active
                  ? 'font-semibold text-zinc-900'
                  : 'font-medium text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {link.label}
              {link.active && (
                <span className="absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-zinc-900" />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="hidden text-sm font-medium text-zinc-700 hover:text-zinc-900 sm:inline-flex"
          >
            Log in
          </button>
          <button
            type="button"
            className="rounded-full bg-[#5B3AFF] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Try for free
          </button>
        </div>
      </div>
    </header>
  )
}
