import DotGrid from './DotGrid'

export default function DotBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <DotGrid
        dotSize={2}
        gap={20}
        baseColor="#dbdadf"
        activeColor="#8A868C"
        proximity={120}
        shockRadius={250}
        shockStrength={5}
        resistance={750}
        returnDuration={1.5}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
