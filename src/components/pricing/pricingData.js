import {
  BarChart3,
  Building2,
  Calendar,
  CalendarClock,
  FileText,
  Globe,
  Headphones,
  LayoutGrid,
  MessageCircle,
  Radar,
  Shield,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react'

export const BILLING_OPTIONS = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'seasonally', label: 'Seasonally' },
]

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for individuals and influencers',
    prices: { monthly: 0, seasonally: 0 },
    features: [
      { Icon: Globe, text: 'Public profile lookup' },
      { Icon: BarChart3, text: '1 account analytics' },
      { Icon: Calendar, text: '10 scheduled posts/mo' },
      { Icon: UserPlus, text: 'Save up to 3 profiles' },
    ],
    cta: 'Start with Free',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For creators ready to grow faster',
    prices: { monthly: 19, seasonally: 15 },
    features: [
      { Icon: Users, text: '5 connected accounts' },
      { Icon: CalendarClock, text: 'Unlimited scheduling' },
      { Icon: MessageCircle, text: 'Comments & DM inbox' },
      { Icon: TrendingUp, text: 'Competitor tracking' },
      { Icon: FileText, text: 'Exportable reports' },
    ],
    cta: 'Start with Pro',
    highlighted: true,
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'Built for teams managing multiple brands',
    prices: { monthly: 39, seasonally: 31 },
    features: [
      { Icon: LayoutGrid, text: 'Client workspaces' },
      { Icon: Building2, text: 'Unlimited team seats' },
      { Icon: Radar, text: 'White-label reports' },
      { Icon: Shield, text: 'Roles & permissions' },
      { Icon: Headphones, text: 'Priority support' },
    ],
    cta: 'Start with Agency',
    highlighted: false,
  },
]
