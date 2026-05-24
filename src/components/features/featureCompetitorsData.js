export const COMPETITOR_ALERTS = ['🚀 Campaign spike!', '📈 +12% this week', '🔥 Viral post!', '⚡ Trending now']

export const COMPETITOR_DELTAS = [
  { fDelta: () => randInt(-3000, 8000), eDelta: () => rand(-0.5, 0.8) },
  { fDelta: () => randInt(-5000, 4000), eDelta: () => rand(-0.6, 0.4) },
  { fDelta: () => randInt(-2000, 12000), eDelta: () => rand(-0.3, 1.2) },
  { fDelta: () => randInt(-1000, 5000), eDelta: () => rand(-0.8, 0.3) },
]

export const COMPETITOR_BASE_FOLLOWERS = [248000, 312000, 189000, 421000]

function rand(a, b) {
  return Math.random() * (b - a) + a
}

function randInt(a, b) {
  return Math.floor(rand(a, b + 1))
}

export function createSparkHistory() {
  return Array.from({ length: 9 }, () => randInt(20, 90))
}

export const COMPETITOR_BRANDS = [
  {
    id: 0,
    name: 'Metriwo',
    handle: '@metriwo',
    logo: '⚡',
    logoStyle: { background: '#FEF3C7', fontSize: '15px' },
    isYou: true,
    sparkColor: '#D97706',
    barColor: '#D97706',
    compareNameStyle: { color: '#D97706', fontWeight: 700 },
    compareRowLogoStyle: { background: '#FEF3C7', fontSize: '11px' },
    initialFollowers: 248000,
    initialEng: 8.2,
  },
  {
    id: 1,
    name: 'HubSocial',
    handle: '@hubsocial',
    logo: 'Hb',
    logoStyle: { background: '#EEF5FF', color: '#1877F2', fontSize: '13px', fontWeight: 800 },
    sparkColor: '#1877F2',
    barColor: '#1877F2',
    initialFollowers: 312000,
    initialEng: 5.4,
  },
  {
    id: 2,
    name: 'Sproutly',
    handle: '@sproutly',
    logo: 'Sp',
    logoStyle: { background: '#FFF0F6', color: '#E91E8C', fontSize: '12px', fontWeight: 800 },
    sparkColor: '#E91E8C',
    barColor: '#E91E8C',
    compareRowLogoStyle: {
      background: '#FFF0F6',
      color: '#E91E8C',
      fontWeight: 800,
      fontSize: '8px',
    },
    initialFollowers: 189000,
    initialEng: 11.3,
  },
  {
    id: 3,
    name: 'Bufferfly',
    handle: '@bufferfly',
    logo: 'Bf',
    logoStyle: { background: '#F0FDF4', color: '#059669', fontSize: '12px', fontWeight: 800 },
    sparkColor: '#059669',
    barColor: '#059669',
    compareRowLogoStyle: {
      background: '#F0FDF4',
      color: '#059669',
      fontWeight: 800,
      fontSize: '8px',
    },
    initialFollowers: 421000,
    initialEng: 4.1,
  },
]

export function fmtFollowers(v) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`
  return String(v)
}

export function fmtEng(v) {
  return `${v.toFixed(1)}%`
}

export function lerp(a, b, t) {
  return a + (b - a) * t
}

export function ease(t) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
}

export { randInt }
