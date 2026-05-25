import { FaLinkedin } from 'react-icons/fa6'
import { SiFacebook, SiInstagram, SiTiktok, SiX } from 'react-icons/si'

const PLATFORM_LOGOS = {
  instagram: SiInstagram,
  tiktok: SiTiktok,
  linkedin: FaLinkedin,
  x: SiX,
  facebook: SiFacebook,
}

export default function PlatformCardArtwork({ platform, compact = false, large = false }) {
  const Icon = PLATFORM_LOGOS[platform]
  if (!Icon) return null

  const sizeClass = large
    ? ' platform-logo--large'
    : compact
      ? ' platform-logo--compact'
      : ' platform-logo--featured'

  return (
    <div
      className={`platform-logo platform-logo--${platform}${sizeClass}`}
      aria-hidden
    >
      <Icon />
    </div>
  )
}
