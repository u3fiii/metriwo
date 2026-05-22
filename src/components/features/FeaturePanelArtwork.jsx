const artworkStyles = {
  analytics: 'feature-artwork feature-artwork--analytics',
  scheduler: 'feature-artwork feature-artwork--scheduler',
  engagement: 'feature-artwork feature-artwork--engagement',
  competitors: 'feature-artwork feature-artwork--competitors',
  reports: 'feature-artwork feature-artwork--reports',
}

export default function FeaturePanelArtwork({ variant, accent }) {
  return (
    <div
      className={artworkStyles[variant] ?? artworkStyles.analytics}
      style={{ '--feature-accent': accent }}
      aria-hidden
    >
      {variant === 'analytics' && <AnalyticsMock />}
      {variant === 'scheduler' && <SchedulerMock />}
      {variant === 'engagement' && <EngagementMock />}
      {variant === 'competitors' && <CompetitorsMock />}
      {variant === 'reports' && <ReportsMock />}
    </div>
  )
}

function AnalyticsMock() {
  return (
    <div className="feature-mock-card">
      <div className="feature-mock-card__header">
        <span className="feature-mock-dot" />
        <span className="feature-mock-dot" />
        <span className="feature-mock-dot" />
      </div>
      <div className="feature-mock-chart">
        <div className="feature-mock-bars">
          {[42, 68, 55, 82, 64, 91, 73].map((h, i) => (
            <span key={i} className="feature-mock-bar" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="feature-mock-line" />
      </div>
      <div className="feature-mock-stats">
        <div>
          <p className="feature-mock-label">Reach</p>
          <p className="feature-mock-value">2.4M</p>
        </div>
        <div>
          <p className="feature-mock-label">Engagement</p>
          <p className="feature-mock-value">8.2%</p>
        </div>
      </div>
    </div>
  )
}

function SchedulerMock() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="feature-mock-card">
      <div className="feature-mock-card__header">
        <span>March 2026</span>
      </div>
      <div className="feature-mock-calendar">
        {days.map((day) => (
          <span key={day} className="feature-mock-calendar__day">
            {day}
          </span>
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className={`feature-mock-calendar__cell ${[2, 5, 9, 11].includes(i) ? 'is-booked' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

function EngagementMock() {
  return (
    <div className="feature-mock-card feature-mock-card--chat">
      <div className="feature-mock-bubble feature-mock-bubble--in">
        Love the new reel — when is the next drop?
      </div>
      <div className="feature-mock-bubble feature-mock-bubble--out">
        Thanks! We post every Tuesday at 6 PM ✨
      </div>
      <div className="feature-mock-bubble feature-mock-bubble--in">
        Perfect, just turned on notifications.
      </div>
    </div>
  )
}

function CompetitorsMock() {
  const rows = [
    { name: 'Your brand', value: 78 },
    { name: 'Rival A', value: 62 },
    { name: 'Rival B', value: 54 },
  ]

  return (
    <div className="feature-mock-card">
      <p className="feature-mock-card__title">Follower growth · 30 days</p>
      <div className="feature-mock-compare">
        {rows.map((row) => (
          <div key={row.name} className="feature-mock-compare__row">
            <span className="feature-mock-compare__label">{row.name}</span>
            <span className="feature-mock-compare__track">
              <span className="feature-mock-compare__fill" style={{ width: `${row.value}%` }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportsMock() {
  return (
    <div className="feature-mock-card feature-mock-card--report">
      <div className="feature-mock-report__sheet">
        <div className="feature-mock-report__bar" />
        <div className="feature-mock-report__bar feature-mock-report__bar--short" />
        <div className="feature-mock-report__bar" />
        <div className="feature-mock-report__pie" />
      </div>
      <p className="feature-mock-report__caption">Q1 Performance · PDF ready</p>
    </div>
  )
}
