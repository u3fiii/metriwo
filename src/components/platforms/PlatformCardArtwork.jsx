export default function PlatformCardArtwork({ variant }) {
  switch (variant) {
    case 'tiktok-priority':
      return <TikTokPriorityArtwork />
    case 'instagram-stickers':
      return <InstagramStickersArtwork />
    case 'youtube-cards':
      return <YoutubeCardsArtwork />
    case 'facebook-controls':
      return <FacebookControlsArtwork />
    default:
      return null
  }
}

function TikTokPriorityArtwork() {
  const rows = [
    { label: 'High', icon: '▲', iconClass: 'text-red-500' },
    { label: 'Medium', icon: '◆', iconClass: 'text-amber-400' },
    { label: 'Lowest', icon: '▼▼', iconClass: 'text-blue-500 text-[10px]' },
  ]

  return (
    <div className="platform-art platform-art--priority">
      {rows.map((row) => (
        <div key={row.label} className="platform-art-priority__row">
          <span className={`platform-art-priority__icon ${row.iconClass}`}>{row.icon}</span>
          <span className="platform-art-priority__label">{row.label}</span>
        </div>
      ))}
    </div>
  )
}

function InstagramStickersArtwork() {
  const stickers = ['😊', '🏖', '🛍', '📎', '↗']

  return (
    <div className="platform-art platform-art--stickers">
      {stickers.map((emoji, i) => (
        <span
          key={emoji}
          className="platform-art-sticker"
          style={{ transform: `rotate(${(i - 2) * 8}deg)` }}
        >
          {emoji}
        </span>
      ))}
    </div>
  )
}

function YoutubeCardsArtwork() {
  return (
    <div className="platform-art platform-art--youtube-cards">
      <div className="platform-art-yt-card platform-art-yt-card--back">
        <span className="text-lg">🎁</span>
        <span className="text-xs font-semibold text-zinc-700">Gifts</span>
      </div>
      <div className="platform-art-yt-card platform-art-yt-card--front">
        <span className="text-lg">🛒</span>
        <span className="text-xs font-semibold text-zinc-700">Groce...</span>
      </div>
    </div>
  )
}

function FacebookControlsArtwork() {
  return (
    <div className="platform-art platform-art--controls">
      <span className="platform-art-controls__mic" aria-hidden>
        🎤
      </span>
      <span className="platform-art-controls__btn platform-art-controls__btn--minus">−</span>
      <span className="platform-art-controls__btn platform-art-controls__btn--plus">+</span>
    </div>
  )
}
