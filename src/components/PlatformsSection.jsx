import { PLATFORMS_CARDS } from './platforms/platformsData'
import PlatformCardArtwork from './platforms/PlatformCardArtwork'

function PlatformCardCopy({ card }) {
  const textClass = card.textOnDark ? 'text-white' : 'text-zinc-900'
  const descClass = card.textOnDark ? 'text-white/90' : 'text-zinc-800'

  return (
    <div className={`platform-card__copy min-w-0 ${textClass}`}>
      <h3 className="text-xl font-bold leading-snug sm:text-2xl">{card.title}</h3>
      <p
        className={`mt-2 text-sm font-normal leading-relaxed sm:text-[15px] ${descClass}`}
      >
        {card.description}
      </p>
    </div>
  )
}

function PlatformCard({ card, className = '' }) {
  return (
    <article
      className={`platform-card platform-card--${card.layout} ${className}`}
      style={{ backgroundColor: card.bg }}
    >
      {card.layout === 'horizontal' ? (
        <div className="platform-card__inner platform-card__inner--horizontal">
          <div className="platform-card__art shrink-0">
            <PlatformCardArtwork variant={card.artwork} />
          </div>
          <PlatformCardCopy card={card} />
        </div>
      ) : card.layout === 'vertical-text-top' ? (
        <div className="platform-card__inner platform-card__inner--vertical">
          <PlatformCardCopy card={card} />
          <div className="platform-card__art mt-6 shrink-0">
            <PlatformCardArtwork variant={card.artwork} />
          </div>
        </div>
      ) : (
        <div className="platform-card__inner platform-card__inner--vertical">
          <div className="platform-card__art shrink-0">
            <PlatformCardArtwork variant={card.artwork} />
          </div>
          <div className="mt-6">
            <PlatformCardCopy card={card} />
          </div>
        </div>
      )}
    </article>
  )
}

export default function PlatformsSection() {
  const [tiktok, instagram, youtube, facebook] = PLATFORMS_CARDS

  return (
    <section
      id="platforms"
      className="platforms-section relative z-[1] px-4 py-16 sm:px-6 sm:py-24"
      aria-labelledby="platforms-heading"
    >
      <div className="mx-auto max-w-6xl xl:max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="platforms-heading"
            className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl"
          >
            Built for every platform you care about
          </h2>
          <p className="mt-3 text-sm font-light text-zinc-600 sm:text-base">
            Deep platform expertise, not surface-level integrations.
          </p>
          <button
            type="button"
            className="mt-6 rounded-full bg-[#5B3AFF] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Try for free
          </button>
        </div>

        <div className="platforms-bento mt-12 sm:mt-14">
          <PlatformCard card={tiktok} className="platforms-bento__tiktok" />
          <PlatformCard card={instagram} className="platforms-bento__instagram" />
          <PlatformCard card={youtube} className="platforms-bento__youtube" />
          <PlatformCard card={facebook} className="platforms-bento__facebook" />
        </div>
      </div>
    </section>
  )
}
