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
    bgGradient: PLATFORM_BRAND_BACKGROUNDS.instagram,
    textOnDark: true,
    emphasized: true,
    title: 'Master Instagram Growth',
    description:
      'Grow engagement with smart scheduling and auto-replies. Track story performance, optimize posting times, and convert comments into DMs automatically.',
  },
  {
    id: 'tiktok',
    bgGradient: PLATFORM_BRAND_BACKGROUNDS.tiktok,
    textOnDark: true,
    emphasized: true,
    title: 'Dominate TikTok Trends',
    description:
      'Grow engagement with smart scheduling and auto-replies. Track story performance, optimize posting times, and convert comments into DMs automatically.',
  },
]

export const PLATFORMS_SECONDARY = [
  {
    id: 'linkedin',
    bg: PLATFORM_BRAND_BACKGROUNDS.linkedin,
    textOnDark: true,
    emphasized: false,
    title: 'Build authority on LinkedIn',
    description:
      'Publish with confidence, track what resonates with professionals, and turn profile views into real opportunities—all from one place.',
  },
  {
    id: 'x',
    bg: PLATFORM_BRAND_BACKGROUNDS.x,
    textOnDark: true,
    emphasized: false,
    title: 'Own the conversation on X',
    description:
      'Publish threads, monitor mentions, and reply in real time without leaving Metriwo.',
  },
  {
    id: 'facebook',
    bg: PLATFORM_BRAND_BACKGROUNDS.facebook,
    textOnDark: true,
    emphasized: false,
    title: 'Turn fans into loyal customers',
    description:
      'Schedule Page posts, measure reach and engagement, and keep conversations going so your community keeps coming back.',
  },
]

export const PLATFORMS_CARDS = [...PLATFORMS_FEATURED, ...PLATFORMS_SECONDARY]
