import { useState } from 'react'
import { motion } from 'framer-motion'
import { BILLING_OPTIONS, PRICING_PLANS } from './pricing/pricingData'

const TAB_ACTIVATE_TRANSITION = { duration: 0.2, ease: 'easeInOut' }

export default function PricingSection() {
  const [billing, setBilling] = useState('monthly')

  return (
    <section
      id="pricing"
      className="relative z-[1] px-4 py-16 sm:px-6 sm:py-24"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-6xl xl:max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="pricing-heading" className="section-title">
            Flexible pricing for everyone
          </h2>
          <p className="section-subtitle">
            Choose a plan that fits you and your budget, no hidden fees.
          </p>
        </div>

        <div className="mt-10 flex justify-center sm:mt-12 lg:mt-6">
          <div
            className="inline-flex items-center gap-0.5 rounded-[11px] border border-zinc-200 bg-white p-1"
            role="tablist"
            aria-label="Billing period"
          >
            {BILLING_OPTIONS.map((option) => {
              const isActive = billing === option.id
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setBilling(option.id)}
                  initial={false}
                  animate={{ scale: isActive ? [1, 0.97, 1] : 1 }}
                  transition={TAB_ACTIVATE_TRANSITION}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors duration-300 ease-out ${
                    isActive
                      ? 'bg-[#5B3AFF] text-white'
                      : 'bg-transparent text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  {option.label}
                </motion.button>
              )
            })}
          </div>
        </div>

        <div className="pricing-cards mt-10 sm:mt-12 lg:mt-8">
          {PRICING_PLANS.map((plan) => {
            const price = plan.prices[billing]
            const isPro = plan.highlighted
            const isFree = plan.id === 'free'
            return (
              <article
                key={plan.id}
                className="flex h-full min-h-0 w-full max-w-[340px] flex-col rounded-[24px] border border-zinc-200 bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.06)] sm:p-7"
              >
                <div className="shrink-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-zinc-900">{plan.name}</h3>
                    {isPro && (
                      <span className="rounded-md bg-[#EEEAFF] px-2.5 py-1 text-xs font-semibold text-[#5B3AFF]">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm font-normal text-zinc-600">
                    {plan.description}
                  </p>
                </div>

                <div className="mt-5 flex min-h-0 flex-1 flex-col">
                  <hr className="border-zinc-200" />

                  <p className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-zinc-900">
                      ${price}
                    </span>
                    <span className="text-sm font-light text-zinc-500">/ month</span>
                  </p>

                  <hr className="mt-5 border-zinc-200" />

                  <p className="mt-5 text-sm font-semibold text-zinc-900">What&apos;s included</p>

                  <ul className="mt-3 flex flex-1 flex-col gap-3.5">
                    {plan.features.map((feature, index) => (
                      <li
                        key={`${plan.id}-${index}`}
                        className="flex min-w-0 items-start gap-3 text-sm text-zinc-700"
                      >
                        <feature.Icon
                          className="mt-0.5 h-4 w-4 shrink-0 text-zinc-900"
                          strokeWidth={2}
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1 font-normal leading-snug">
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  disabled={isFree}
                  className={`mt-8 w-full shrink-0 rounded-full py-3.5 text-sm font-semibold transition-colors ${
                    isPro
                      ? 'bg-[#5B3AFF] text-white hover:opacity-90'
                      : isFree
                        ? 'cursor-not-allowed bg-zinc-100 text-zinc-400 opacity-60'
                        : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
