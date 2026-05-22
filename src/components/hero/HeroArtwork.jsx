import LottieImport from 'lottie-react'
import heroLottie from '../../assets/hero-lottie.json'

const Lottie = LottieImport.default ?? LottieImport

export default function HeroArtwork() {
  return (
    <div className="flex w-full flex-1 items-center justify-center lg:justify-center">
      <Lottie
        animationData={heroLottie}
        loop
        className="h-[500px] w-[500px] max-w-full"
        aria-label="Metriwo product animation"
      />
    </div>
  )
}
