import {
  BarChart3,
  CalendarClock,
  MessageCircle,
  Radar,
  FileBarChart,
} from 'lucide-react'

export const FEATURE_TABS = [
  {
    id: 'analytics',
    label: 'Analytics',
    Icon: BarChart3,
    mobileCardBg: '#E6E2FF',
    theme: {
      accent: '#5B3AFF',
      tabBg: 'rgba(91, 58, 255, 0.12)',
      panelBg: 'linear-gradient(135deg, #f3f0ff 0%, #ebe6ff 48%, #e8e4ff 100%)',
      panelRing: 'rgba(91, 58, 255, 0.18)',
      eyebrow: '#5B3AFF',
      title: '#1f1638',
      body: '#4b4563',
      bullet: '#5B3AFF',
    },
    content: {
      eyebrow: 'Deep insights',
      title: 'Track performance across every channel',
      description:
        'See followers, reach, and engagement in one dashboard. Compare posts, spot trends, and know what to publish next.',
      bullets: [
        'Real-time metrics for all connected accounts',
        'Post-level breakdowns and audience demographics',
        'Custom date ranges and exportable reports',
      ],
      artwork: 'analytics',
    },
  },
  {
    id: 'scheduler',
    label: 'Scheduler',
    Icon: CalendarClock,
    mobileCardBg: '#C8F5DC',
    theme: {
      accent: '#2563EB',
      tabBg: 'rgba(37, 99, 235, 0.12)',
      panelBg: 'linear-gradient(135deg, #eff6ff 0%, #e0edff 48%, #dbeafe 100%)',
      panelRing: 'rgba(37, 99, 235, 0.18)',
      eyebrow: '#2563EB',
      title: '#0f2347',
      body: '#3d4f6f',
      bullet: '#2563EB',
    },
    content: {
      eyebrow: 'Plan ahead',
      title: 'Schedule posts without switching apps',
      description:
        'Queue content for YouTube, Instagram, TikTok, and Facebook from a single calendar built for teams.',
      bullets: [
        'Drag-and-drop calendar with timezone support',
        'Best-time suggestions based on your audience',
        'Bulk upload and auto-publish when you are offline',
      ],
      artwork: 'scheduler',
    },
  },
  {
    id: 'engagement',
    label: 'Engagement',
    Icon: MessageCircle,
    mobileCardBg: '#F9D0E8',
    theme: {
      accent: '#DB2777',
      tabBg: 'rgba(219, 39, 119, 0.12)',
      panelBg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 48%, #fbcfe8 100%)',
      panelRing: 'rgba(219, 39, 119, 0.18)',
      eyebrow: '#DB2777',
      title: '#4a0d2e',
      body: '#6b3d55',
      bullet: '#DB2777',
    },
    content: {
      eyebrow: 'Stay close',
      title: 'Reply faster and never miss a mention',
      description:
        'Unified inbox for comments and DMs. Assign conversations, use saved replies, and keep your community active.',
      bullets: [
        'All platforms in one threaded inbox',
        'Team assignments and internal notes',
        'Sentiment tags to prioritize urgent messages',
      ],
      artwork: 'engagement',
    },
  },
  {
    id: 'competitors',
    label: 'Competitors',
    Icon: Radar,
    mobileCardBg: '#FEEAB8',
    theme: {
      accent: '#D97706',
      tabBg: 'rgba(217, 119, 6, 0.12)',
      panelBg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 48%, #fde68a 100%)',
      panelRing: 'rgba(217, 119, 6, 0.2)',
      eyebrow: '#D97706',
      title: '#451a03',
      body: '#6b4f2e',
      bullet: '#D97706',
    },
    content: {
      eyebrow: 'Market watch',
      title: 'Benchmark against brands in your space',
      description:
        'Monitor competitor growth, content cadence, and top-performing posts so you can adapt your strategy quickly.',
      bullets: [
        'Side-by-side follower and engagement charts',
        'Alerts when rivals spike or launch campaigns',
        'Hashtag and content format comparisons',
      ],
      artwork: 'competitors',
    },
  },
  {
    id: 'reports',
    label: 'Reports',
    Icon: FileBarChart,
    mobileCardBg: '#C6F6E3',
    theme: {
      accent: '#059669',
      tabBg: 'rgba(5, 150, 105, 0.12)',
      panelBg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 48%, #a7f3d0 100%)',
      panelRing: 'rgba(5, 150, 105, 0.18)',
      eyebrow: '#059669',
      title: '#064e3b',
      body: '#2d5f4f',
      bullet: '#059669',
    },
    content: {
      eyebrow: 'Share wins',
      title: 'Beautiful reports your clients will love',
      description:
        'Generate branded PDFs and live links in seconds. Perfect for agencies proving ROI without manual spreadsheets.',
      bullets: [
        'White-label templates with your logo',
        'Automated weekly and monthly delivery',
        'KPI snapshots with commentary blocks',
      ],
      artwork: 'reports',
    },
  },
]
