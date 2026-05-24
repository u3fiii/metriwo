import FeatureAnalyticsPanel from './FeatureAnalyticsPanel'
import FeatureCompetitorsPanel from './FeatureCompetitorsPanel'
import FeatureEngagementPanel from './FeatureEngagementPanel'
import FeatureReportsPanel from './FeatureReportsPanel'
import FeatureSchedulerPanel from './FeatureSchedulerPanel'

const artworkStyles = {
  insights: 'feature-artwork feature-artwork--insights',
  scheduler: 'feature-artwork feature-artwork--scheduler',
  engagement: 'feature-artwork feature-artwork--engagement',
  competitors: 'feature-artwork feature-artwork--competitors',
  reports: 'feature-artwork feature-artwork--reports',
}

export default function FeaturePanelArtwork({ variant, accent }) {
  return (
    <div
      className={artworkStyles[variant] ?? artworkStyles.insights}
      style={{ '--feature-accent': accent }}
      aria-hidden
    >
      {variant === 'insights' && <FeatureAnalyticsPanel />}
      {variant === 'scheduler' && <FeatureSchedulerPanel />}
      {variant === 'engagement' && <FeatureEngagementPanel />}
      {variant === 'competitors' && <FeatureCompetitorsPanel />}
      {variant === 'reports' && <FeatureReportsPanel />}
    </div>
  )
}

