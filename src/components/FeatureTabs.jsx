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
          <h2 id="features-heading" className="section-title">
            Everything you need to grow on social
          </h2>
          <p className="section-subtitle">
            Four powerful tools. One intelligent platform.
          </p>
        </div>

        {/* Mobile: Embla carousel */}
        <div className="lg:hidden">
          <FeatureMobileCarousel />
        </div>

        {/* Desktop: panel with tabs at top */}
        <div
          id={`feature-panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`feature-tab-${active.id}`}
          className="feature-panel mt-10 hidden overflow-hidden rounded-3xl ring-1 transition-[background,box-shadow] duration-500 ease-out sm:mt-12 lg:block"
          style={{
            background: theme.panelBg,
            boxShadow: `0 24px 64px -12px ${theme.panelRing}`,
            ['--feature-accent']: theme.accent,
          }}
        >
          <div className="flex justify-center px-6 pt-6 pb-5 sm:px-8 lg:px-10 lg:pt-8">
            <div
              className="inline-flex max-w-full flex-wrap items-center justify-center gap-0.5 rounded-[10px] border-2 border-black p-1"
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
                    className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all duration-300 ease-out ${
                      isActive
                        ? 'bg-black text-white'
                        : 'bg-transparent text-zinc-900 hover:bg-black/5'
                    }`}
                  >
                    <TabIcon
                      className={`h-3.5 w-3.5 shrink-0 transition-colors duration-300 ${
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

          <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-12 lg:pt-10 xl:p-14 xl:pt-12">
            <div className="feature-panel__copy order-2 lg:order-1">
              <p
                className="text-xs font-semibold uppercase tracking-widest transition-colors duration-500"
                style={{ color: theme.eyebrow }}
              >
                {content.eyebrow}
              </p>
              <h3
                className="section-title mt-3 transition-colors duration-500"
                style={{ color: theme.title }}
              >
                {content.title}
              </h3>
              <p
                className="section-subtitle mt-4 max-w-lg transition-colors duration-500"
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
