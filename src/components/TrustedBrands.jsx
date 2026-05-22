import sassLogo from '../assets/logos/sass.svg'
import hboLogo from '../assets/logos/hbo.svg'
import xboxLogo from '../assets/logos/xbox.svg'
import cocaColaLogo from '../assets/logos/coca-cola.svg'
import netflixLogo from '../assets/logos/netflix.svg'
import spotifyLogo from '../assets/logos/spotify.svg'

const brands = [
  { name: 'Sass', src: sassLogo },
  { name: 'HBO', src: hboLogo },
  { name: 'Xbox', src: xboxLogo },
  { name: 'Coca-Cola', src: cocaColaLogo },
  { name: 'Netflix', src: netflixLogo },
  { name: 'Spotify', src: spotifyLogo },
]

function LogoItem({ brand }) {
  return (
    <li
      className="flex shrink-0 items-center justify-center px-10 sm:px-14"
      aria-label={brand.name}
    >
      <img
        src={brand.src}
        alt={brand.name}
        className="trusted-brand-logo"
        loading="lazy"
        draggable={false}
      />
    </li>
  )
}

export default function TrustedBrands() {
  const track = [...brands, ...brands]

  return (
    <section
      className="relative z-[1] px-4 py-16 sm:px-6 sm:py-20"
      aria-labelledby="trusted-brands-title"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="trusted-brands-title"
          className="mb-10 text-center text-[18px] font-semibold text-gray-900"
        >
          Trusted by leading Brands
        </h2>

        <div className="trusted-brands-mask relative overflow-hidden">
          <ul className="trusted-brands-track flex w-max items-center">
            {track.map((brand, index) => (
              <LogoItem key={`${brand.name}-${index}`} brand={brand} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
