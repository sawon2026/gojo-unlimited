import { useEffect, useRef, useState } from 'react'

export function useInView(amount = 0.35) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: amount }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [amount])

  return [ref, inView]
}

export function useScrollProgress() {
  const sectionRef = useRef(null)
  const progress = useRef(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let raf = null

    const measure = () => {
      raf = null
      const r = el.getBoundingClientRect()
      const span = r.height - window.innerHeight
      progress.current = span <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / span))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure) }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return [sectionRef, progress]
}

export function useSampled(progress, step = 0.01) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let raf
    const tick = () => {
      setValue(v => (Math.abs(progress.current - v) > step ? progress.current : v))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progress, step])

  return value
}
