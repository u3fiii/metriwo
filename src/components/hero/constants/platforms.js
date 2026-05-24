import { FaLinkedin } from 'react-icons/fa6'
import { SiFacebook, SiInstagram, SiTiktok, SiX } from 'react-icons/si'

/**
 * Social platforms shown in the hero typewriter, search selector, and account mock data.
 * Order matches typewriter cycle: Instagram → TikTok → Facebook → LinkedIn → X.
 */
export const PLATFORMS = [
  {
    id: 'instagram',
    label: 'Instagram',
    typewriter: 'Instagram',
    color: '#E1306C',
    typewriterGradient:
      'linear-gradient(45deg, #f09433 0%, #e6683c 18%, #dc2743 36%, #cc2366 54%, #bc1888 72%, #833ab4 100%)',
    Icon: SiInstagram,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    typewriter: 'TikTok',
    color: '#010101',
    typewriterGradient:
      'linear-gradient(135deg, #0a0a0a 0%, #141414 42%, #25f4ee 72%, #fe2c55 100%)',
    Icon: SiTiktok,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    typewriter: 'Facebook',
    color: '#1877F2',
    typewriterGradient:
      'linear-gradient(135deg, #0a5dc2 0%, #1877f2 52%, #5ba3f5 100%)',
    Icon: SiFacebook,
  },
  {
    id: 'x',
    label: 'X',
    typewriter: 'Twitter',
    color: '#000000',
    typewriterGradient:
      'linear-gradient(135deg, #000000 0%, #141414 40%, #000400 100%)',
    Icon: SiX,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    typewriter: 'LinkedIn',
    color: '#0A66C2',
    typewriterGradient:
      'linear-gradient(135deg, #004182 0%, #0a66c2 50%, #378fe9 100%)',
    Icon: FaLinkedin,
  },
]

/** Longest typewriter label — reserves space to prevent layout shift while typing. */
export const TYPEWRITER_MAX_LABEL = PLATFORMS.reduce(
  (longest, p) => (p.typewriter.length > longest.length ? p.typewriter : longest),
  '',
)

/** Default platform when the hero loads (Instagram). */
export const DEFAULT_PLATFORM =
  PLATFORMS.find((p) => p.id === 'instagram') ?? PLATFORMS[0]
