const rituals = [
  {
    eyebrow: 'A softer beginning',
    title: 'Meet with context, not just criteria.',
    copy: 'A considered way for Maithil families and individuals to begin meaningful conversations while keeping culture, consent, and privacy in view.',
  },
  {
    eyebrow: 'Made for real lives',
    title: 'Across cities. Close to home.',
    copy: 'Thoughtful profiles for the people building lives between Mithila, India, and the wider world.',
  },
  {
    eyebrow: 'Always in your hands',
    title: 'Your story stays yours.',
    copy: 'Share only what feels right. Cultural details and family context will be designed with care and expert review.',
  },
]

const commitments = ['Cultural care', 'Clear consent', 'Human pace']

export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f1e9] text-[#20322c]">
      <section className="relative mx-auto max-w-[1440px] px-6 pb-20 pt-6 sm:px-10 lg:px-16 lg:pb-28 lg:pt-8">
        <div className="absolute -right-36 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#d9e4d2] opacity-70 blur-3xl" aria-hidden="true" />
        <div className="absolute left-[-12rem] top-[24rem] h-[26rem] w-[26rem] rounded-full bg-[#edd6c2] opacity-60 blur-3xl" aria-hidden="true" />

        <header className="relative z-10 flex items-center justify-between border-b border-[#20322c]/15 pb-5">
          <a href="#top" className="flex items-center gap-3" aria-label="Milan home">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-[#20322c]/25 text-sm font-semibold tracking-[0.2em]">M</span>
            <span className="font-serif text-xl tracking-[-0.03em]">Milan</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-[#20322c]/70 md:flex" aria-label="Primary navigation">
            <a className="transition-colors hover:text-[#20322c]" href="#why-milan">Why Milan</a>
            <a className="transition-colors hover:text-[#20322c]" href="#values">Our values</a>
            <a className="transition-colors hover:text-[#20322c]" href="#notes">Journal</a>
          </nav>
          <a href="#interest" className="rounded-full border border-[#20322c]/30 px-4 py-2 text-sm font-medium transition-colors hover:bg-[#20322c] hover:text-[#f5f1e9]">Join the list</a>
        </header>

        <div id="top" className="relative z-10 grid gap-14 pb-12 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-20 lg:pb-20 lg:pt-28">
          <div>
            <p className="mb-7 text-xs font-semibold uppercase tracking-[0.24em] text-[#a65d3f]">For the Maithil community</p>
            <h1 className="max-w-3xl font-serif text-[clamp(3.7rem,8vw,7.6rem)] leading-[0.9] tracking-[-0.07em] text-[#20322c]">A thoughtful way to find your <em className="font-normal text-[#a65d3f]">Milan.</em></h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[#20322c]/70">A contemporary matrimonial space rooted in Maithil values, open conversation, and the belief that a good match begins with being understood.</p>
            <div className="mt-10 flex flex-wrap items-center gap-4" id="interest">
              <a href="#values" className="rounded-full bg-[#a65d3f] px-6 py-3 text-sm font-semibold text-[#fffaf1] transition-transform hover:-translate-y-0.5">Explore the idea</a>
              <span className="text-sm text-[#20322c]/55">Early concept · Community-led</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[30rem] lg:justify-self-end">
            <div className="relative aspect-[0.82] overflow-hidden rounded-[11rem_11rem_1.25rem_1.25rem] bg-[#d3dfcf] shadow-[0_24px_80px_rgba(32,50,44,0.16)]">
              <div className="absolute inset-x-0 bottom-0 h-3/4 bg-[radial-gradient(ellipse_at_50%_100%,#a65d3f_0%,#bb7958_34%,transparent_35%),linear-gradient(135deg,transparent_35%,#c6d6c0_35%,#c6d6c0_56%,transparent_56%)] opacity-90" />
              <div className="absolute left-[12%] top-[14%] h-24 w-24 rounded-full border border-[#fffaf1]/70" />
              <div className="absolute right-[13%] top-[22%] h-10 w-10 rounded-full bg-[#fffaf1]/70" />
              <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between text-[#fffaf1]">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] opacity-75">A living tradition</p>
                  <p className="mt-2 font-serif text-3xl tracking-[-0.04em]">Rooted, open, together.</p>
                </div>
                <span className="mb-1 text-2xl" aria-hidden="true">↗</span>
              </div>
            </div>
            <p className="mt-4 text-right text-xs uppercase tracking-[0.18em] text-[#20322c]/45">Concept direction 01 / Mithila modern</p>
          </div>
        </div>

        <div className="relative z-10 grid gap-4 border-t border-[#20322c]/15 pt-6 sm:grid-cols-3" id="values">
          {commitments.map((commitment, index) => (
            <div key={commitment} className="flex items-center gap-3 text-sm text-[#20322c]/70">
              <span className="font-mono text-xs text-[#a65d3f]">0{index + 1}</span>
              <span>{commitment}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="why-milan" className="border-y border-[#20322c]/10 bg-[#20322c] px-6 py-20 text-[#f5f1e9] sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d99a78]">The point of view</p>
              <h2 className="mt-5 max-w-md font-serif text-5xl leading-[0.95] tracking-[-0.06em] sm:text-6xl">More than a profile.</h2>
            </div>
            <div className="grid gap-10 md:grid-cols-3">
              {rituals.map((ritual, index) => (
                <article key={ritual.title} className="border-t border-[#f5f1e9]/20 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d99a78]">{ritual.eyebrow}</p>
                  <h3 className="mt-6 font-serif text-2xl leading-tight tracking-[-0.04em]">{ritual.title}</h3>
                  <p className="mt-5 text-sm leading-7 text-[#f5f1e9]/65">{ritual.copy}</p>
                  <span className="mt-8 block font-mono text-xs text-[#f5f1e9]/35">0{index + 1}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="notes" className="mx-auto max-w-[1440px] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="flex flex-col justify-between gap-6 border-b border-[#20322c]/15 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a65d3f]">Before we build</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight tracking-[-0.05em] sm:text-5xl">A platform shaped with the people it serves.</h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-[#20322c]/60">This is an early visual direction. Cultural matching workflows remain intentionally open for validation with Maithil experts.</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3 text-sm text-[#20322c]/65">
          {['Community listening', 'Expert review', 'Accessible by default'].map((item) => <span key={item} className="rounded-full border border-[#20322c]/20 px-4 py-2">{item}</span>)}
        </div>
      </section>

      <footer className="border-t border-[#20322c]/10 px-6 py-7 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-3 text-xs uppercase tracking-[0.16em] text-[#20322c]/45 sm:flex-row">
          <span>Milan / A Maithil matrimonial concept</span>
          <span>Phase 1 visual exploration</span>
        </div>
      </footer>
    </main>
  )
}
