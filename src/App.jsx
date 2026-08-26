import { useRef } from 'react'
import FrameCanvas from './components/FrameCanvas'
import RevealStage from './components/RevealStage'
import GlyphRain from './components/GlyphRain'
import Thunder from './components/Thunder'
import { useInView, useScrollProgress, useSampled } from './lib/useInView'

const GLYPHS = '無下限呪術廻戦五条悟領域展開六眼無限虚式蒼赤紫強者01'

function AwakenSection() {
  const [sectionRef, progress] = useScrollProgress()
  const phase = useSampled(progress)

  return (
    <section ref={sectionRef} className="awaken" id="awaken">
      <div className="awaken-sticky">
        <GlyphRain
          glyphs={GLYPHS}
          color="#1b2a44"
          headColor="#5aa8e8"
          opacity={0.32}
          speed={34}
          density={0.55}
          fontSize={16}
        />
        <FrameCanvas name="awaken" progressRef={progress} ease={0.14} focusY={0.42} />

        <div className="awaken-ui">
          <p className="kicker">
            <span className="jp">呪術廻戦</span>
            <span className="rule" />
            Jujutsu Kaisen
          </p>

          <h1 className="awaken-title" style={{ '--p': phase }}>
            <span className="jp-huge" aria-hidden="true">六眼</span>
            <span className="latin">SIX EYES</span>
          </h1>

          <p className="awaken-sub">
            The strongest sorcerer.
            <br />
            <em>Keep scrolling — the eyes open.</em>
          </p>

          <div className="scroll-cue" data-done={phase > 0.9 ? 'true' : 'false'}>
            <span className="jp">下へ</span>
            <span className="cue-line" />
          </div>
        </div>

        <div className="awaken-meter" aria-hidden="true">
          <span style={{ transform: `scaleY(${phase})` }} />
        </div>
      </div>
    </section>
  )
}

function DomainSection() {
  const [sectionRef, progress] = useScrollProgress()
  const [inViewRef, inView] = useInView(0.3)
  const phase = useSampled(progress)

  return (
    <section className="monarch" id="domain" ref={sectionRef}>
      <div className="monarch-sticky" ref={inViewRef}>
        <FrameCanvas name="domain" progressRef={progress} ease={0.16} />

        <GlyphRain
          glyphs={GLYPHS}
          color="#2f4d7a"
          headColor="#7fd8ff"
          opacity={0.42}
          speed={64}
        />

        <div className="monarch-ui">
          <p className="kicker light">
            <span className="rule" />
            <span className="jp">領域展開</span>
          </p>
          <h2 className="monarch-title">
            <span className="latin">UNLIMITED</span>
            <span className="latin outline">VOID</span>
          </h2>
          <p className="monarch-sub">
            <span className="jp">無量空処</span>
            <br />
            Keep scrolling — the domain expands.
          </p>
        </div>

        <div className="monarch-meter" aria-hidden="true">
          <span style={{ transform: `scaleY(${phase})` }} />
        </div>
      </div>
    </section>
  )
}

function RevealSection() {
  return (
    <section className="reveal" id="reveal">
      <RevealStage
        bottom={`${import.meta.env.BASE_URL}img/gojo-sealed.webp`}
        top={`${import.meta.env.BASE_URL}img/gojo-awakened.webp`}
      />
      <div className="reveal-head">
        <p className="kicker light">
          <span className="rule" />
          <span className="jp">二つの顔</span>
        </p>
        <h2 className="reveal-title">
          <span className="latin">THE STRONGEST</span>
          <span className="jp-mid">最強</span>
        </h2>
        <p className="reveal-sub">
          Sweep the portrait. Blindfold on. Six Eyes open.
        </p>
      </div>
      <footer className="foot">
        <span className="jp">五条 悟</span>
        <span className="foot-rule" />
        <span>GOJO SATORU — fan tribute</span>
      </footer>
    </section>
  )
}

export default function App() {
  return (
    <main>
      <Thunder interval={600} />
      <AwakenSection />
      <DomainSection />
      <RevealSection />
    </main>
  )
}
