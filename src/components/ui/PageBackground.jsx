/**
 * Fixed page backdrop: subtle gray gradient + soft blurred color orbs.
 * pointer-events-none so it never blocks clicks.
 */
export default function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-r from-[#f6f5f4] via-[#f3f2f0] to-[#eeedeb]" />

      <div className="absolute -left-24 top-[12%] h-[28rem] w-[50rem] rounded-full bg-[red]/5 blur-[200px]" />
      <div
        className="absolute bottom-[35%] right-[10%] h-[16rem] w-[16rem] rounded-full bg-[green]/10
       blur-[200px]"
      />
    </div>
  )
}
