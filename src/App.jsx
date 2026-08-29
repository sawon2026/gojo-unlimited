import { useEffect, useState } from 'react'
import GlyphRain from './components/GlyphRain'
import Thunder from './components/Thunder'
import Robot3D from './components/Robot3D'
import { useScrollProgress, useSampled } from './lib/useInView'

const CODE_GLYPHS = 'SAWON01<>{}[]/;#*devhackopensourceappweb01'

const ROLES = [
  {
    title: 'App Developer',
    sub: 'Native and cross-platform products with clean architecture.',
  },
  {
    title: 'Web Developer',
    sub: 'Modern frontends, APIs, and full-stack delivery.',
  },
  {
    title: 'Ethical Hacker',
    sub: 'Security research, defensive mindset, responsible testing.',
  },
  {
    title: 'Open Source',
    sub: 'Public tools, libraries, and GitHub projects in the open.',
  },
]

const STACK = ['React', 'Vite', 'Node', 'Python', 'Linux', 'GitHub', 'API', 'CLI']

const PROJECTS = [
  {
    name: 'HEXVault',
    blurb: 'Security-minded tooling and open modules.',
    href: 'https://github.com/sawon2026',
  },
  {
    name: 'Portfolio Lab',
    blurb: 'Scroll-cinematic interfaces and interactive 3D.',
    href: 'https://github.com/sawon2026/gojo-unlimited',
  },
  {
    name: 'Public Repos',
    blurb: 'Experiments, CLIs, and builder utilities.',
    href: 'https://github.com/sawon2026?tab=repositories',
  },
]

function useActiveSection() {
  const [section, setSection] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const ids = ['hero', 'roles', 'work', 'contact']
    const onScroll = () => {
      const mid = window.innerHeight * 0.35
      let active = 0
      let best = Infinity
      ids.forEach((id, i) => {
        const el = document.getElementById(id)
        if (!el) return
        const r = el.getBoundingClientRect()
        const dist = Math.abs(r.top + r.height * 0.2 - mid)
        if (dist < best) {
          best = dist
          active = i
        }
      })
      setSection(Math.min(active, 2))
      const el = document.getElementById(ids[active])
      if (el) {
        const r = el.getBoundingClientRect()
        const total = el.offsetHeight - window.innerHeight
        const scrolled = Math.min(Math.max(-r.top, 0), Math.max(total, 1))
        setProgress(total > 0 ? scrolled / total : 0)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return { section, progress }
}

function HeroSection() {
  const [sectionRef, progress] = useScrollProgress()
  const phase = useSampled(progress)

  return (
    <section ref={sectionRef} className="hero" id="hero">
      <div className="hero-sticky">
        <GlyphRain
          glyphs={CODE_GLYPHS}
          color="#1e293b"
          headColor="#38bdf8"
          opacity={0.22}
          speed={26}
          density={0.45}
          fontSize={14}
        />

        <div className="hero-ui">
          <p className="kicker">
            <span className="mono">portfolio</span>
            <span className="rule" aria-hidden="true" />
            <span>sawon2026</span>
          </p>

          <h1 className="hero-title" style={{ '--p': phase }}>
            <span className="name-huge">SA W ON</span>
            <span className="name-sub">App · Web · Security · Open Source</span>
          </h1>

          <p className="hero-lead">
            I build products, tools, and public projects with a security-first mindset.
            <br />
            <em>Scroll to explore.</em>
          </p>

          <div className="hero-actions">
            <a className="btn btn-primary" href="#work">
              View work
            </a>
            <a
              className="btn btn-ghost"
              href="https://github.com/sawon2026"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>

          <div className="scroll-cue" data-done={phase > 0.9 ? 'true' : 'false'}>
            <span className="mono">scroll</span>
            <span className="cue-line" aria-hidden="true" />
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
          color="#334155"
          headColor="#7dd3fc"
          opacity={0.28}
          speed={42}
        />

        <div className="roles-ui">
          <p className="kicker light">
            <span className="rule" aria-hidden="true" />
            <span className="mono">what I do</span>
          </p>

          <ul className="role-list">
            {ROLES.map((r, i) => (
              <li
                key={r.title}
                className="role-item"
                data-active={phase > i / ROLES.length ? 'true' : 'false'}
              >
                <span className="role-idx" aria-hidden="true">
                  0{i + 1}
                </span>
                <div>
                  <h2>{r.title}</h2>
                  <p>{r.sub}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="stack" aria-label="Tech stack">
            {STACK.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
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

function WorkSection() {
  return (
    <section className="work" id="work">
      <div className="work-inner">
        <p className="kicker light">
          <span className="rule" aria-hidden="true" />
          <span className="mono">selected work</span>
        </p>
        <h2 className="section-title">Projects & public builds</h2>
        <p className="section-lead">
          Shipping in public — tools, experiments, and production-minded repos.
        </p>

        <ul className="project-grid">
          {PROJECTS.map((p) => (
            <li key={p.name}>
              <a
                className="project-card"
                href={p.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className="card-label">GitHub</span>
                <span className="card-title">{p.name}</span>
                <span className="card-body">{p.blurb}</span>
                <span className="card-cta">Open repository →</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className="contact" id="contact">
      <div className="contact-inner">
        <p className="kicker light">
          <span className="rule" aria-hidden="true" />
          <span className="mono">connect</span>
        </p>
        <h2 className="section-title">Let&apos;s build</h2>
        <p className="section-lead">
          Available for apps, web products, security-minded builds, and open collaboration.
        </p>

        <div className="contact-actions">
          <a
            className="btn btn-primary"
            href="https://github.com/sawon2026"
            target="_blank"
            rel="noreferrer"
          >
            Follow on GitHub
          </a>
          <a className="btn btn-ghost" href="https://github.com/sawon2026?tab=repositories">
            Browse repos
          </a>
        </div>

        <footer className="foot">
          <span className="mono">SA W ON</span>
          <span className="foot-rule" aria-hidden="true" />
          <span>builder · hacker · open source</span>
        </footer>
      </div>
    </section>
  )
}

export default function App() {
  const { section, progress } = useActiveSection()

  return (
    <main>
      <a className="skip-link" href="#hero">
        Skip to content
      </a>
      <Thunder interval={1000} flash={0.06} />
      <Robot3D section={section} progress={progress} />
      <HeroSection />
      <RolesSection />
      <WorkSection />
      <ContactSection />
    </main>
  )
}
