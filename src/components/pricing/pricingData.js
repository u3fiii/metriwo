import {
  BarChart3,
  Boxes,
  Compass,
  Eye,
  FileDown,
  FileSpreadsheet,
  History,
  Layers,
  ScanSearch,
  Sparkles,
} from 'lucide-react'

export const BILLING_OPTIONS = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'seasonally', label: 'Seasonally' },
]

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    description: 'Try Metriwo with the essentials',
    prices: { monthly: 0, seasonally: 0 },
    features: [
      { Icon: Compass, text: 'Explore Metriwo at no cost' },
      { Icon: ScanSearch, text: 'Public page analysis on 1 profile' },
      { Icon: BarChart3, text: 'Core statistics overview' },
      { Icon: Boxes, text: 'Access to tools' },
    ],
    cta: 'Start with Free',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Perfect for individuals and influencers',
    prices: { monthly: 19, seasonally: 15 },
    features: [
      { Icon: ScanSearch, text: 'Full public page analysis' },
      { Icon: Layers, text: 'All 5 major social platforms' },
      { Icon: Eye, text: 'Monitor up to 3 pages' },
      { Icon: FileDown, text: 'Export reports in limited formats' },
    ],
    cta: 'Start with Pro',
    highlighted: true,
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'Built for brands and agencies',
    prices: { monthly: 39, seasonally: 31 },
    features: [
      { Icon: History, text: 'Extended analytics & history' },
      { Icon: Eye, text: 'Monitor up to 10 pages' },
      { Icon: Sparkles, text: 'AI-powered report generation' },
      { Icon: FileSpreadsheet, text: 'Full export in PDF and Excel' },
    ],
    cta: 'Start with Agency',
    highlighted: false,
  },
]
