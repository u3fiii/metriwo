/** Official / recognizable brand fills for platform cards */
export const PLATFORM_BRAND_BACKGROUNDS = {
  instagram:
    'linear-gradient(45deg, #f09433 0%, #e6683c 18%, #dc2743 36%, #cc2366 54%, #bc1888 72%, #833ab4 100%)',
  tiktok: 'linear-gradient(160deg, #25f4ee 0%, #010101 22%, #010101 78%, #fe2c55 100%)',
  linkedin: '#0A66C2',
  x: '#000000',
  facebook: '#1877F2',
}

export const PLATFORMS_FEATURED = [
  {
    id: 'instagram',
    layout: 'vertical-art-top',
    bgGradient: PLATFORM_BRAND_BACKGROUNDS.instagram,
    textOnDark: true,
    emphasized: true,
    title: 'Master Instagram Growth',
    description:
      'Grow engagement with smart scheduling and auto-replies. Track story performance, optimize posting times, and convert comments into DMs automatically.',
    artwork: 'instagram-stickers',
  },
  {
    id: 'tiktok',
    layout: 'horizontal',
    bgGradient: PLATFORM_BRAND_BACKGROUNDS.tiktok,
    textOnDark: true,
    emphasized: true,
    title: 'Dominate TikTok Trends',
    description:
      'Grow engagement with smart scheduling and auto-replies. Track story performance, optimize posting times, and convert comments into DMs automatically.',
    artwork: 'tiktok-priority',
  },
]

export const PLATFORMS_SECONDARY = [
  {
    id: 'linkedin',
    layout: 'vertical-text-top',
    bg: PLATFORM_BRAND_BACKGROUNDS.linkedin,
    textOnDark: true,
    emphasized: false,
    title: 'Grow on LinkedIn',
    description:
      'Schedule posts, track impressions, and engage professionals from one dashboard built for B2B creators.',
    artwork: 'linkedin-metrics',
  },
  {
    id: 'x',
    layout: 'vertical-art-top',
    bg: PLATFORM_BRAND_BACKGROUNDS.x,
    textOnDark: true,
    emphasized: false,
    title: 'Own the conversation on X',
    description:
      'Publish threads, monitor mentions, and reply in real time without leaving Metriwo.',
    artwork: 'x-threads',
  },
  {
    id: 'facebook',
    layout: 'vertical-art-top',
    bg: PLATFORM_BRAND_BACKGROUNDS.facebook,
    textOnDark: true,
    emphasized: false,
    title: 'Grow your Facebook community',
    description:
      'Grow engagement with smart scheduling and auto-replies. Track story performance, optimize posting times, and convert comments into DMs automatically.',
    artwork: 'facebook-controls',
  },
]

export const PLATFORMS_CARDS = [...PLATFORMS_FEATURED, ...PLATFORMS_SECONDARY]
