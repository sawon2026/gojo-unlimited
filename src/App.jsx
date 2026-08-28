import GlyphRain from './components/GlyphRain'
import Thunder from './components/Thunder'
import { useScrollProgress, useSampled } from './lib/useInView'

const CODE_GLYPHS = 'SAWON01<>{}[]/;#*devhackopensourceappweb01'

const ROLES = [
  { title: 'App Developer', sub: 'Native & cross-platform products' },
  { title: 'Web Developer', sub: 'Modern frontends & full-stack apps' },
  { title: 'Ethical Hacker', sub: 'Security research & defensive mindset' },
  { title: 'Open Source', sub: 'Tools, libraries & public projects' },
]

const STACK = [
  'React', 'Vite', 'Node', 'Python', 'GitHub', 'Linux', 'API', 'CLI',
]

function HeroSection() {
  const [sectionRef, progress] = useScrollProgress()
  const phase = useSampled(progress)

  return (
    <section ref={sectionRef} className="hero" id="hero">
      <div className="hero-sticky">
        <GlyphRain
          glyphs={CODE_GLYPHS}
          color="#1b2a44"
          headColor="#5aa8e8"
          opacity={0.28}
          speed={28}
          density={0.5}
          fontSize={15}
        />

        <div className="hero-ui">
          <p className="kicker">
            <span className="mono">portfolio</span>
            <span className="rule" />
            sawon2026
          </p>

          <h1 className="hero-title" style={{ '--p': phase }}>
            <span className="name-huge">SA W ON</span>
            <span className="name-sub">builder · hacker · open source</span>
          </h1>

          <p className="hero-lead">
            I build apps, websites, tools and open-source projects.
            <br />
            <em>Scroll — meet the work.</em>
          </p>

          <div className="scroll-cue" data-done={phase > 0.9 ? 'true' : 'false'}>
            <span className="mono">scroll</span>
            <span className="cue-line" />
          </div>
        </div>

        <div className="meter" aria-hidden="true">
          <span style={{ transform: `scaleY(${phase})` }} />
        </div>
      </div>
    </section>
  )
}

function RolesSection() {
  const [sectionRef, progress] = useScrollProgress()
  const phase = useSampled(progress)

  return (
    <section className="roles" id="roles" ref={sectionRef}>
      <div className="roles-sticky">
        <GlyphRain
          glyphs={CODE_GLYPHS}
          color="#2f4d7a"
          headColor="#7fd8ff"
          opacity={0.35}
          speed={48}
        />

        <div className="roles-ui">
          <p className="kicker light">
            <span className="rule" />
            <span className="mono">what I do</span>
          </p>

          <ul className="role-list" style={{ '--p': phase }}>
            {ROLES.map((r, i) => (
              <li
                key={r.title}
                className="role-item"
                style={{ '--i': i }}
                data-active={phase > i / ROLES.length ? 'true' : 'false'}
              >
                <span className="role-idx">0{i + 1}</span>
                <div>
                  <h2>{r.title}</h2>
                  <p>{r.sub}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="stack">
            {STACK.map((s) => (
              <span key={s} className="chip">{s}</span>
            ))}
          </div>
        </div>

        <div className="meter" aria-hidden="true">
          <span style={{ transform: `scaleY(${phase})` }} />
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section className="about" id="about">
      <div className="about-inner">
        <p className="kicker light">
          <span className="rule" />
          <span className="mono">about</span>
        </p>

        <h2 className="about-title">
          <span className="latin">CODE</span>
          <span className="accent">+</span>
          <span className="latin">CRAFT</span>
        </h2>

        <p className="about-body">
          I&apos;m <strong>SA W ON</strong> — app developer, web developer, ethical hacker,
          and open-source creator on GitHub. I ship tools, experiment with security,
          and build products end-to-end.
        </p>

        <div className="about-grid">
          <a
            className="card"
            href="https://github.com/sawon2026"
            target="_blank"
            rel="noreferrer"
          >
            <span className="card-label">GitHub</span>
            <span className="card-value">@sawon2026</span>
            <span className="card-hint">tools · repos · open source</span>
          </a>
          <div className="card">
            <span className="card-label">Focus</span>
            <span className="card-value">Full-stack + security</span>
            <span className="card-hint">apps · web · ethical hacking</span>
          </div>
          <div className="card">
            <span className="card-label">Status</span>
            <span className="card-value">Building in public</span>
            <span className="card-hint">shipping projects continuously</span>
          </div>
        </div>

        <footer className="foot">
          <span className="mono">SA W ON</span>
          <span className="foot-rule" />
          <span>portfolio · clean systems</span>
        </footer>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <main>
      <Thunder interval={900} flash={0.08} />
      <HeroSection />
      <RolesSection />
      <AboutSection />
    </main>
  )
}
