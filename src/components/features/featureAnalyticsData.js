export const DASH_WIDTH = 560
export const VIEWPORT_SIZE = 400
export const VIEWPORT_SCALE = VIEWPORT_SIZE / DASH_WIDTH

export const CHART_W = 400
export const CHART_H = 130
export const CHART_PAD_L = 28
export const CHART_PAD_R = 8
export const CHART_N = 31

export const PLATFORM_BARS = [
  { lbl: 'IG', color: '#E1306C', val: 84 },
  { lbl: 'FB', color: '#1877F2', val: 61 },
  { lbl: 'X', color: '#444', val: 48 },
  { lbl: 'LI', color: '#0A66C2', val: 37 },
  { lbl: 'TT', color: '#FF0050', val: 72 },
]

export const DEMO_COLORS = ['#5B3AFF', '#A29BFE', '#00B894', '#FDCB6E']
export const DEMO_INIT = [34, 41, 15, 10]
export const DEMO_LABELS = ['18–24', '25–34', '35–44', '45+']

export const POST_POOL = [
  { e: '🎯', bg: '#FFF0F6', title: 'Summer campaign', reach: '485K', eng: '9.2%' },
  { e: '📊', bg: '#EEF5FF', title: 'Q2 product reel', reach: '312K', eng: '7.8%' },
  { e: '🌿', bg: '#F0FDF4', title: 'Sustainability', reach: '201K', eng: '11.4%' },
  { e: '🚀', bg: '#FFF8EE', title: 'Product launch', reach: '728K', eng: '14.1%' },
  { e: '✨', bg: '#F5F0FF', title: 'Feature reveal', reach: '390K', eng: '8.6%' },
  { e: '🔥', bg: '#FFF4F0', title: 'Flash sale', reach: '915K', eng: '18.3%' },
]

export function initReachData() {
  return Array.from({ length: CHART_N }, () => Math.floor(Math.random() * 2400000 + 400000))
}

export function initEngData() {
  return Array.from({ length: CHART_N }, () => Math.random() * 8 + 4)
}
