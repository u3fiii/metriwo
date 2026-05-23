import { useState } from 'react'
import { ArrowRight, ArrowUp, Mail } from 'lucide-react'
import { FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import logoHeader from '../assets/logo-header.png'
import { FOOTER_LINK_COLUMNS } from './footer/footerData'

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#', Icon: FaInstagram },
  { label: 'LinkedIn', href: '#', Icon: FaLinkedin },
  { label: 'X', href: '#', Icon: FaXTwitter },
]

export default function Footer() {
  const [email, setEmail] = useState('')

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleNewsletterSubmit(e) {
    e.preventDefault()
  }

  return (
    <div className="relative z-[1] p-2 md:p-4">
      <footer className="overflow-hidden rounded-[28px] bg-zinc-950 text-white">
        <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <div className="max-w-xs">
              <a href="#" className="inline-flex items-center gap-2">
                <img
                  src={logoHeader}
                  alt="metriwo"
                  className="h-8 w-auto brightness-0 invert sm:h-9"
                  draggable={false}
                />
              </a>
              <p className="mt-4 text-sm font-light leading-relaxed text-zinc-400">
                Everything social, all in one place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-12">
              {FOOTER_LINK_COLUMNS.map((column, columnIndex) => (
                <ul key={columnIndex} className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={`${columnIndex}-${link.label}`}>
                      <a
                        href={link.href}
                        className="text-sm font-medium text-white transition-opacity hover:opacity-80"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          <hr className="mt-10 border-zinc-800 sm:mt-12" />

          <div className="mt-8 flex flex-col items-stretch gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex w-fit items-center gap-2.5 rounded-full bg-zinc-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              Back to top
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-zinc-950">
                <ArrowUp className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </span>
            </button>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex w-full max-w-md items-center gap-2 rounded-full bg-white py-1.5 pl-4 pr-1.5 lg:mx-auto"
            >
              <Mail className="h-4 w-4 shrink-0 text-zinc-400" strokeWidth={2} aria-hidden />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:font-light placeholder:text-zinc-400"
              />
              <button
                type="submit"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white transition-opacity hover:opacity-90"
                aria-label="Subscribe to newsletter"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </button>
            </form>

            <div className="flex items-center gap-5 lg:justify-end">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-white transition-opacity hover:opacity-75"
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
