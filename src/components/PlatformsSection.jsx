import { PLATFORMS_FEATURED, PLATFORMS_SECONDARY } from './platforms/platformsData'
import PlatformCardArtwork from './platforms/PlatformCardArtwork'

function PlatformCardCopy({ card, compact = false }) {
  const textClass = card.textOnDark ? 'text-white' : 'text-zinc-900'
  const descClass = card.textOnDark ? 'text-white/90' : 'text-zinc-800'
  const titleClass = compact
    ? 'text-base font-bold leading-snug sm:text-lg'
    : 'text-base font-bold leading-snug sm:text-lg sm:text-xl'
  const mobileDescription = card.descriptionMobile ?? card.description

  return (
    <div className={`platform-card__copy min-w-0 flex flex-col sm:flex-1 ${textClass}`}>
      <h3 className={titleClass}>{card.title}</h3>
      <p
        className={`mt-1.5 line-clamp-2 text-xs font-normal leading-snug sm:text-sm sm:leading-relaxed ${compact ? 'sm:line-clamp-3' : 'sm:line-clamp-none'} ${descClass}`}
      >
        <span className="sm:hidden">{mobileDescription}</span>
        <span className="hidden sm:inline">{card.description}</span>
      </p>
    </div>
  )
}

function PlatformCard({ card, compact = false }) {
  const logoLarge =
    !compact && (card.id === 'instagram' || card.id === 'tiktok')

  return (
    <article
      className={`platform-card platform-card--${card.id}${compact ? ' platform-card--compact' : ' platform-card--featured'}`}
      style={
        card.bgGradient
          ? { background: card.bgGradient }
          : { backgroundColor: card.bg }
      }
    >
      <div className="platform-card__pattern" aria-hidden />
      <div className="platform-card__inner">
        <div className="platform-card__art shrink-0">
          <PlatformCardArtwork platform={card.id} compact={compact} large={logoLarge} />
        </div>
        <PlatformCardCopy card={card} compact={compact} />
      </div>
    </article>
  )
}

export default function PlatformsSection() {
  return (
    <section
      id="platforms"
      className="platforms-section relative z-[1] px-4 py-12 sm:px-6 sm:py-16"
      aria-labelledby="platforms-heading"
    >
      <div className="mx-auto max-w-6xl xl:max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="platforms-heading" className="section-title">
            Built for every platform you care about
          </h2>
          <p className="section-subtitle">
            Deep platform expertise, not surface-level integrations.
          </p>
        </div>

        <div className="platforms-bento mt-8 sm:mt-10">
          <div className="platforms-bento__row platforms-bento__row--featured">
            {PLATFORMS_FEATURED.map((card) => (
              <PlatformCard key={card.id} card={card} />
            ))}
          </div>
          <div className="platforms-bento__row platforms-bento__row--secondary">
            {PLATFORMS_SECONDARY.map((card) => (
              <PlatformCard key={card.id} card={card} compact />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
