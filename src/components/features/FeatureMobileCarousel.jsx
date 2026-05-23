import { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { FEATURE_TABS } from './featureTabsData'

const SLIDE_WIDTH_RATIO = 0.9

export default function FeatureMobileCarousel() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const viewportNodeRef = useRef(null)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: true,
    dragFree: false,
  })

  const setSlideWidth = useCallback(
    (viewport) => {
      if (!viewport) return
      const slideWidth = Math.round(viewport.clientWidth * SLIDE_WIDTH_RATIO)
      viewport.style.setProperty('--slide-size', `${slideWidth}px`)
    },
    [],
  )

  const setViewportRef = useCallback(
    (node) => {
      viewportNodeRef.current = node
      emblaRef(node)
      if (!node) return
      requestAnimationFrame(() => setSlideWidth(node))
    },
    [emblaRef, setSlideWidth],
  )

  const updateSlideStyles = useCallback(() => {
    if (!emblaApi) return

    const snapCount = FEATURE_TABS.length
    const snapped = emblaApi.selectedScrollSnap()
    setSelectedIndex(snapped % snapCount)

    emblaApi.slideNodes().forEach((slide) => {
      slide.classList.remove('is-snapped')
    })
    emblaApi.slideNodes()[snapped]?.classList.add('is-snapped')
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const setup = () => {
      requestAnimationFrame(() => {
        setSlideWidth(viewportNodeRef.current)
        emblaApi.reInit()
        emblaApi.scrollTo(0, false)
        updateSlideStyles()
      })
    }

    setup()

    emblaApi.on('select', updateSlideStyles)
    emblaApi.on('reInit', updateSlideStyles)
    emblaApi.on('scroll', updateSlideStyles)
    window.addEventListener('resize', setup)

    return () => {
      emblaApi.off('select', updateSlideStyles)
      emblaApi.off('reInit', updateSlideStyles)
      emblaApi.off('scroll', updateSlideStyles)
      window.removeEventListener('resize', setup)
    }
  }, [emblaApi, setSlideWidth, updateSlideStyles])

  function scrollTo(index) {
    emblaApi?.scrollTo(index)
  }

  return (
    <div className="feature-mobile-carousel -mx-4 mt-8 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)]">
      <div className="feature-mobile-carousel__viewport" ref={setViewportRef}>
        <div className="feature-mobile-carousel__container">
          {FEATURE_TABS.map((tab) => (
            <div key={tab.id} className="feature-mobile-carousel__slide">
              <article
                className="feature-mobile-card flex h-full flex-col items-center rounded-[28px] px-5 pb-8 pt-8 text-center sm:px-6"
                style={{ backgroundColor: tab.mobileCardBg }}
              >
                <h3 className="text-xl font-bold leading-snug text-zinc-900">
                  {tab.content.title}
                </h3>
                <p className="mt-3 text-sm font-normal leading-relaxed text-zinc-600">
                  {tab.content.description}
                </p>
                <button
                  type="button"
                  className="mt-6 rounded-full bg-zinc-900 px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Try for free
                </button>
              </article>
            </div>
          ))}
        </div>
      </div>

      <div
        className="mt-6 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Feature slides"
      >
        {FEATURE_TABS.map((tab, index) => {
          const isActive = index === selectedIndex
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to ${tab.label}`}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ease-out ${
                isActive ? 'w-6 bg-[#5B3AFF]' : 'w-2 bg-zinc-300'
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
