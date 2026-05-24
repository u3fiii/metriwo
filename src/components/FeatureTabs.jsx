import { useState } from 'react'
import { FEATURE_TABS } from './features/featureTabsData'
import FeaturePanelArtwork from './features/FeaturePanelArtwork'
import FeatureMobileCarousel from './features/FeatureMobileCarousel'

export default function FeatureTabs() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = FEATURE_TABS[activeIndex]
  const { theme, content } = active

  return (
    <section
      id="features"
      className="relative z-[1] px-4 py-16 sm:px-6 sm:py-24"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl xl:max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="features-heading"
            className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl"
          >
            Everything you need to grow on social
          </h2>
          <p className="mt-3 text-xl font-medium text-zinc-600 sm:text-base">
            Four powerful tools. One intelligent platform.
          </p>
        </div>

        {/* Mobile: Embla carousel */}
        <div className="lg:hidden">
          <FeatureMobileCarousel />
        </div>

        {/* Desktop: tab bar + panel */}
        <div className="mt-10 hidden justify-center sm:mt-12 lg:flex">
          <div
            className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-[12px] border-2 border-zinc-200 bg-white p-1.5"
            role="tablist"
            aria-label="Feature categories"
          >
            {FEATURE_TABS.map((tab, index) => {
              const isActive = index === activeIndex
              const TabIcon = tab.Icon

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`feature-panel-${tab.id}`}
                  id={`feature-tab-${tab.id}`}
                  onClick={() => setActiveIndex(index)}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-out sm:px-5 ${
                    isActive
                      ? 'bg-[#5B3AFF] text-white'
                      : 'bg-transparent text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  <TabIcon
                    className={`h-4 w-4 shrink-0 transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-zinc-900'
                    }`}
                    strokeWidth={2.25}
                    aria-hidden
                  />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div
          id={`feature-panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`feature-tab-${active.id}`}
          className="feature-panel mt-8 hidden overflow-hidden rounded-3xl ring-1 transition-[background,box-shadow] duration-500 ease-out sm:mt-10 lg:block"
          style={{
            background: theme.panelBg,
            boxShadow: `0 24px 64px -12px ${theme.panelRing}`,
            ['--feature-accent']: theme.accent,
          }}
        >
          <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-12 xl:p-14">
            <div className="feature-panel__copy order-2 lg:order-1">
              <p
                className="text-xs font-semibold uppercase tracking-widest transition-colors duration-500"
                style={{ color: theme.eyebrow }}
              >
                {content.eyebrow}
              </p>
              <h3
                className="mt-3 text-2xl font-semibold leading-tight tracking-tight transition-colors duration-500 sm:text-3xl lg:text-[2rem]"
                style={{ color: theme.title }}
              >
                {content.title}
              </h3>
              <p
                className="mt-4 max-w-lg text-sm font-light leading-relaxed transition-colors duration-500 sm:text-base"
                style={{ color: theme.body }}
              >
                {content.description}
              </p>
              <ul className="mt-6 space-y-3">
                {content.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-3 text-sm font-medium transition-colors duration-500 sm:text-[15px]"
                    style={{ color: theme.body }}
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-500"
                      style={{ backgroundColor: theme.bullet }}
                      aria-hidden
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-8 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-90"
                style={{ backgroundColor: theme.accent }}
              >
                Learn more
              </button>
            </div>

            <div className="feature-panel__art order-1 flex items-center justify-center lg:order-2">
              <FeaturePanelArtwork
                key={active.id}
                variant={content.artwork}
                accent={theme.accent}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
