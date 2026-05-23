import logoHeader from '../assets/logo-black.png'

export default function CtaSection() {
  return (
    <section
      className="relative z-[1] px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <img
          src={logoHeader}
          alt=""
          className="mb-8 h-9 w-auto object-contain sm:h-10"
          draggable={false}
          aria-hidden
        />

        <h2
          id="cta-heading"
          className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
        >
          Stop Guessing. Start Growing.
        </h2>

        <p className="mt-4 max-w-lg text-sm font-normal text-zinc-600 sm:text-base">
          Join over 10,000 brands using Metriwo to scale their social media presence.
        </p>

        <button
          type="button"
          className="mt-8 rounded-full bg-[#5B3AFF] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(91,58,255,0.35)] transition-opacity hover:opacity-90 sm:px-10 sm:text-base"
        >
          Start Free Trial
        </button>

        <p className="mt-4 text-xs font-light text-zinc-500 sm:text-sm">
          No credit card required • 14-day free trial
        </p>
      </div>
    </section>
  )
}
