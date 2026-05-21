import Navbar from './components/Navbar'
import Hero from './components/Hero'

export default function App() {
  return (
    <div className="min-h-screen bg-[#f5f4f2] text-zinc-900">
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  )
}
