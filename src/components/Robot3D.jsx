import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Sleek white female cyborg (procedural) — inspired by sci-fi android style.
 * Drag to orbit. Scroll/section drives pose & eye glow.
 */
export default function Robot3D({ section = 0, progress = 0 }) {
  const wrapRef = useRef(null)
  const stateRef = useRef({
    section: 0,
    progress: 0,
    yaw: 0.45,
    pitch: -0.05,
    dragging: false,
    lastX: 0,
    lastY: 0,
  })

  useEffect(() => {
    stateRef.current.section = section
    stateRef.current.progress = progress
  }, [section, progress])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const w0 = () => Math.max(wrap.clientWidth, 1)
    const h0 = () => Math.max(wrap.clientHeight, 1)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, w0() / h0(), 0.1, 40)
    camera.position.set(0, 1.35, 3.6)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(w0(), h0())
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    wrap.appendChild(renderer.domElement)

    // lighting — soft studio
    scene.add(new THREE.AmbientLight(0xffffff, 0.45))
    const key = new THREE.DirectionalLight(0xffffff, 1.35)
    key.position.set(2.5, 4, 3)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xb8d4ff, 0.55)
    fill.position.set(-3, 1.5, 1)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0x38a0ff, 0.7)
    rim.position.set(-1.5, 2, -3)
    scene.add(rim)
    const eyeLight = new THREE.PointLight(0x4df0ff, 1.4, 6)
    eyeLight.position.set(0, 2.15, 1.2)
    scene.add(eyeLight)

    // materials — glossy white armor + dark chrome + cyan eyes
    const whiteArmor = new THREE.MeshStandardMaterial({
      color: 0xf2f5fa,
      metalness: 0.55,
      roughness: 0.22,
    })
    const whiteSoft = new THREE.MeshStandardMaterial({
      color: 0xe8ecf4,
      metalness: 0.35,
      roughness: 0.35,
    })
    const darkChrome = new THREE.MeshStandardMaterial({
      color: 0x1a1e28,
      metalness: 0.92,
      roughness: 0.18,
    })
    const panelLine = new THREE.MeshStandardMaterial({
      color: 0xb8c0d0,
      metalness: 0.4,
      roughness: 0.4,
    })
    const cyanEye = new THREE.MeshStandardMaterial({
      color: 0x7ff6ff,
      emissive: 0x22d3ee,
      emissiveIntensity: 2.2,
      metalness: 0.1,
      roughness: 0.15,
    })
    const cyanDot = new THREE.MeshStandardMaterial({
      color: 0x5eead4,
      emissive: 0x14b8a6,
      emissiveIntensity: 1.6,
      metalness: 0.3,
      roughness: 0.25,
    })

    const robot = new THREE.Group()
    scene.add(robot)

    // ——— HEAD ———
    const head = new THREE.Group()
    head.position.y = 2.15
    robot.add(head)

    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.38, 48, 48), whiteArmor)
    skull.scale.set(0.92, 1.08, 0.95)
    head.add(skull)

    // face plate slight flatten
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 32), whiteSoft)
    face.scale.set(0.85, 0.95, 0.55)
    face.position.set(0, -0.02, 0.18)
    head.add(face)

    // jaw / chin
    const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 24), whiteArmor)
    jaw.scale.set(1.1, 0.7, 0.9)
    jaw.position.set(0, -0.22, 0.08)
    head.add(jaw)

    // eyes
    const eyeGeo = new THREE.SphereGeometry(0.045, 16, 16)
    const eyeL = new THREE.Mesh(eyeGeo, cyanEye)
    eyeL.position.set(-0.11, 0.05, 0.32)
    eyeL.scale.set(1.2, 0.7, 0.5)
    head.add(eyeL)
    const eyeR = eyeL.clone()
    eyeR.position.x = 0.11
    head.add(eyeR)

    // ear pods
    const earGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.08, 16)
    const earL = new THREE.Mesh(earGeo, darkChrome)
    earL.rotation.z = Math.PI / 2
    earL.position.set(-0.36, 0.02, 0)
    head.add(earL)
    const earR = earL.clone()
    earR.position.x = 0.36
    head.add(earR)

    // face panel lines (thin boxes)
    const line = (w, h, d, x, y, z, mat = panelLine) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
      m.position.set(x, y, z)
      head.add(m)
      return m
    }
    line(0.35, 0.012, 0.02, 0, 0.14, 0.33)
    line(0.28, 0.01, 0.02, 0, -0.08, 0.34)

    // ——— NECK ———
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.28, 16), darkChrome)
    neck.position.y = 1.82
    robot.add(neck)
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 12, 32), whiteArmor)
    collar.rotation.x = Math.PI / 2
    collar.position.y = 1.72
    robot.add(collar)

    // ——— TORSO ———
    const torso = new THREE.Group()
    torso.position.y = 1.15
    robot.add(torso)

    // upper chest (wider, feminine)
    const chest = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 32), whiteArmor)
    chest.scale.set(1.05, 0.85, 0.7)
    chest.position.y = 0.15
    torso.add(chest)

    // bust volume (subtle armor shape)
    const bustL = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), whiteSoft)
    bustL.scale.set(1, 1.1, 0.85)
    bustL.position.set(-0.2, 0.2, 0.28)
    torso.add(bustL)
    const bustR = bustL.clone()
    bustR.position.x = 0.2
    torso.add(bustR)

    // mid torso taper
    const mid = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 0.45, 24), whiteArmor)
    mid.position.y = -0.35
    torso.add(mid)

    // abs / lower plate
    const lower = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), whiteSoft)
    lower.scale.set(1.05, 0.7, 0.75)
    lower.position.y = -0.55
    torso.add(lower)

    // chest panel lines + cyan dots
    const chestLine = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.015, 0.02), panelLine)
    chestLine.position.set(0, 0.35, 0.42)
    torso.add(chestLine)

    function addDot(x, y, z) {
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), cyanDot)
      d.position.set(x, y, z)
      torso.add(d)
    }
    addDot(-0.25, 0.45, 0.4)
    addDot(0.25, 0.45, 0.4)
    addDot(0, 0.05, 0.48)
    addDot(-0.15, -0.35, 0.35)
    addDot(0.15, -0.35, 0.35)

    // shoulders
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 24), whiteArmor)
    shoulderL.scale.set(1.1, 0.85, 1)
    shoulderL.position.set(-0.55, 0.45, 0)
    torso.add(shoulderL)
    const shoulderR = shoulderL.clone()
    shoulderR.position.x = 0.55
    torso.add(shoulderR)

    // ——— ARMS ———
    function makeArm(side) {
      const g = new THREE.Group()
      g.position.set(side * 0.62, 1.45, 0)

      const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.35, 6, 12), darkChrome)
      upper.position.y = -0.28
      g.add(upper)

      const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), darkChrome)
      elbow.position.y = -0.55
      g.add(elbow)

      const lower = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.32, 6, 12), whiteArmor)
      lower.position.y = -0.85
      g.add(lower)

      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), whiteSoft)
      hand.scale.set(1, 0.7, 1.1)
      hand.position.y = -1.15
      g.add(hand)

      robot.add(g)
      return g
    }
    const armL = makeArm(-1)
    const armR = makeArm(1)

    // ——— HIPS + LEGS ———
    const hips = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), whiteArmor)
    hips.scale.set(1.4, 0.55, 0.9)
    hips.position.y = 0.52
    robot.add(hips)

    function makeLeg(side) {
      const g = new THREE.Group()
      g.position.set(side * 0.18, 0.45, 0)

      const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.28, 6, 12), whiteArmor)
      thigh.position.y = -0.25
      g.add(thigh)

      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), darkChrome)
      knee.position.y = -0.5
      g.add(knee)

      const shin = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.3, 6, 12), whiteArmor)
      shin.position.y = -0.78
      g.add(shin)

      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.28), darkChrome)
      foot.position.set(0, -1.05, 0.04)
      g.add(foot)

      robot.add(g)
      return g
    }
    const legL = makeLeg(-1)
    const legR = makeLeg(1)

    // soft ground shadow
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.85, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28 })
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = 0.01
    scene.add(shadow)

    // scale whole robot a bit
    robot.scale.setScalar(0.95)

    // interaction
    const onDown = (e) => {
      const p = e.touches ? e.touches[0] : e
      stateRef.current.dragging = true
      stateRef.current.lastX = p.clientX
      stateRef.current.lastY = p.clientY
    }
    const onMove = (e) => {
      if (!stateRef.current.dragging) return
      const p = e.touches ? e.touches[0] : e
      const dx = p.clientX - stateRef.current.lastX
      const dy = p.clientY - stateRef.current.lastY
      stateRef.current.lastX = p.clientX
      stateRef.current.lastY = p.clientY
      stateRef.current.yaw += dx * 0.008
      stateRef.current.pitch = Math.max(-0.4, Math.min(0.3, stateRef.current.pitch + dy * 0.005))
    }
    const onUp = () => {
      stateRef.current.dragging = false
    }

    wrap.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    wrap.addEventListener('touchstart', onDown, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)

    const onResize = () => {
      const w = w0()
      const h = h0()
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(wrap)

    let raf = null
    const t0 = performance.now()

    function frame(now) {
      const t = (now - t0) / 1000
      const st = stateRef.current
      const p = st.progress
      const sec = st.section

      const idleYaw = reduced ? 0 : Math.sin(t * 0.55) * 0.05
      const idleBob = reduced ? 0 : Math.sin(t * 1.2) * 0.02

      robot.rotation.y = st.yaw + idleYaw
      robot.rotation.x = st.pitch
      robot.position.y = idleBob

      // poses by section
      const targetArmL = sec === 0 ? -0.35 : sec === 1 ? -0.9 : -0.25
      const targetArmR = sec === 0 ? 0.25 + Math.sin(t * 2.2) * 0.2 : sec === 1 ? 0.9 : 0.25
      armL.rotation.z = THREE.MathUtils.lerp(armL.rotation.z, targetArmL, 0.07)
      armR.rotation.z = THREE.MathUtils.lerp(armR.rotation.z, targetArmR, 0.07)
      armL.rotation.x = THREE.MathUtils.lerp(armL.rotation.x, sec === 2 ? -0.4 : 0.05, 0.07)
      armR.rotation.x = THREE.MathUtils.lerp(armR.rotation.x, sec === 2 ? -0.4 : 0.05, 0.07)

      head.rotation.y = THREE.MathUtils.lerp(
        head.rotation.y,
        Math.sin(t * 0.7) * 0.12 + (sec - 1) * 0.08,
        0.08
      )
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, sec === 2 ? 0.12 : -0.04 + p * 0.08, 0.08)

      const pulse = 1.6 + 0.6 * Math.sin(t * 2.8)
      cyanEye.emissiveIntensity = pulse + sec * 0.2
      cyanDot.emissiveIntensity = 1.2 + 0.5 * Math.sin(t * 2.2 + 1)
      eyeLight.intensity = 1.1 + p * 0.5 + 0.3 * Math.sin(t * 2.5)

      legL.rotation.x = Math.sin(t * 1.1) * 0.03
      legR.rotation.x = Math.sin(t * 1.1 + Math.PI) * 0.03

      renderer.render(scene, camera)
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    const onVis = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf)
        raf = null
      } else if (!raf) {
        raf = requestAnimationFrame(frame)
      }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      wrap.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      wrap.removeEventListener('touchstart', onDown)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
      renderer.dispose()
      ;[whiteArmor, whiteSoft, darkChrome, panelLine, cyanEye, cyanDot].forEach((m) => m.dispose())
      if (renderer.domElement.parentNode === wrap) wrap.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="robot-stage" ref={wrapRef} aria-label="3D cyborg — drag to rotate">
      <p className="robot-hint mono">drag to rotate</p>
    </div>
  )
}
