import { useState } from 'react'
import { BILLING_OPTIONS, PRICING_PLANS } from './pricing/pricingData'

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
          <h2
            id="pricing-heading"
            className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl"
          >
            Flexible pricing for everyone
          </h2>
          <p className="mt-3 text-sm font-light text-zinc-600 sm:text-base">
            Choose a plan that fits you and your budget, no hidden fees.
          </p>
        </div>

        <div className="mt-10 flex justify-center sm:mt-12 lg:mt-6">
          <div
            className="inline-flex items-center gap-1 rounded-[12px] border-2 border-zinc-200 bg-white p-1.5"
            role="tablist"
            aria-label="Billing period"
          >
            {BILLING_OPTIONS.map((option) => {
              const isActive = billing === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setBilling(option.id)}
                  className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-300 ease-out ${
                    isActive
                      ? 'bg-[#5B3AFF] text-white'
                      : 'bg-transparent text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4 sm:mt-12 lg:mt-8">
          {PRICING_PLANS.map((plan) => {
            const price = plan.prices[billing]
            const isPro = plan.highlighted

            return (
              <article
                key={plan.id}
                className={`flex w-[340px] max-w-full flex-col rounded-[24px] bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.06)] sm:p-7 ${
                  isPro ? 'border-[4px] border-[#5B3AFF]' : 'border border-zinc-200'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-zinc-900">{plan.name}</h3>
                  {isPro && (
                    <span className="rounded-md bg-[#EEEAFF] px-2.5 py-1 text-xs font-semibold text-[#5B3AFF]">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-sm font-light text-zinc-500">
                  {plan.description}
                </p>

                <hr className="mt-5 border-zinc-200" />

                <p className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-zinc-900">
                    ${price}
                  </span>
                  <span className="text-sm font-light text-zinc-500">/ month</span>
                </p>

                <hr className="mt-5 border-zinc-200" />

                <ul className="mt-5 flex flex-1 flex-col gap-3.5">
                  {plan.features.map((feature, index) => (
                    <li
                      key={`${plan.id}-${index}`}
                      className="flex min-w-0 items-start gap-3 text-sm text-zinc-700"
                    >
                      <feature.Icon
                        className="mt-0.5 h-4 w-4 shrink-0 text-zinc-800"
                        strokeWidth={2}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1 truncate font-normal leading-snug">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`mt-8 w-full rounded-full py-3.5 text-sm font-semibold transition-opacity hover:opacity-90 ${
                    isPro ? 'bg-[#5B3AFF] text-white' : 'bg-zinc-100 text-zinc-700'
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
