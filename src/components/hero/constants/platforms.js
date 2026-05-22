import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from 'react-icons/si'

/**
 * Social platforms shown in the hero typewriter, search selector, and account mock data.
 * Each entry includes a Simple Icons component for consistent monotone logos.
 */
export const PLATFORMS = [
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

/** Default platform when the hero loads (Instagram). */
export const DEFAULT_PLATFORM =
  PLATFORMS.find((p) => p.id === 'instagram') ?? PLATFORMS[0]
