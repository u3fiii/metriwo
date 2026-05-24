export const REPORT_WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']

export const REPORT_INITIAL_BAR_DATA = [320, 480, 410, 590, 520, 680, 610, 740]

export const REPORT_DONUT_DATA = [38, 28, 18, 10, 6]

export const REPORT_DONUT_COLORS = ['#0D9F6E', '#A29BFE', '#1877F2', '#FDCB6E', '#E1306C']

export const REPORT_DONUT_LEGEND = [
  { color: '#0D9F6E', label: 'IG 38%' },
  { color: '#A29BFE', label: 'TT 28%' },
  { color: '#1877F2', label: 'FB 18%' },
  { color: '#FDCB6E', label: 'Other 16%' },
]

export const REPORT_KPIS = [
  { label: 'Total Reach', value: '2.4M', badge: '▲ 12.4%', badgeClass: 'up' },
  { label: 'Followers', value: '248K', badge: '▲ 3.2%', badgeClass: 'up' },
  { label: 'Engagement', value: '8.2%', badge: '▲ 0.9%', badgeClass: 'up' },
  { label: 'Posts', value: '142', badge: '▼ 4', badgeClass: 'dn' },
]

export const REPORT_KPI_FLICKERS = [
  { val: () => rand(2.2, 2.7), fmt: (v) => `${v.toFixed(1)}M` },
  { val: () => randInt(240, 260), fmt: (v) => `${v}K` },
  { val: () => rand(7.8, 8.8), fmt: (v) => `${v.toFixed(1)}%` },
  { val: () => randInt(138, 148), fmt: (v) => String(v) },
]

function rand(a, b) {
  return Math.random() * (b - a) + a
}

export function randInt(a, b) {
  return Math.floor(rand(a, b + 1))
}
