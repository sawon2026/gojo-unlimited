import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Fixed right-side 3D robot.
 * - Drag (mouse/touch) to orbit left/right
 * - Scroll progress + active section drive pose/lights
 */
export default function Robot3D({ section = 0, progress = 0 }) {
  const wrapRef = useRef(null)
  const stateRef = useRef({
    section: 0,
    progress: 0,
    yaw: 0.35,
    pitch: -0.08,
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
    const w0 = () => wrap.clientWidth || 320
    const h0 = () => wrap.clientHeight || 480

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, w0() / h0(), 0.1, 50)
    camera.position.set(0, 1.15, 4.2)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(w0(), h0())
    renderer.outputColorSpace = THREE.SRGBColorSpace
    wrap.appendChild(renderer.domElement)

    // lights
    const amb = new THREE.AmbientLight(0x6a8cff, 0.55)
    scene.add(amb)
    const key = new THREE.DirectionalLight(0xffffff, 1.15)
    key.position.set(3, 5, 4)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x38a0ff, 0.85)
    rim.position.set(-3, 2, -2)
    scene.add(rim)
    const point = new THREE.PointLight(0x9fe4ff, 1.2, 12)
    point.position.set(0, 2.2, 2)
    scene.add(point)

    // materials
    const matBody = new THREE.MeshStandardMaterial({
      color: 0x1a2333,
      metalness: 0.72,
      roughness: 0.28,
    })
    const matAccent = new THREE.MeshStandardMaterial({
      color: 0x38a0ff,
      metalness: 0.4,
      roughness: 0.35,
      emissive: 0x0a3a70,
      emissiveIntensity: 0.6,
    })
    const matEye = new THREE.MeshStandardMaterial({
      color: 0x9fe4ff,
      emissive: 0x38a0ff,
      emissiveIntensity: 1.4,
      metalness: 0.2,
      roughness: 0.2,
    })
    const matJoint = new THREE.MeshStandardMaterial({
      color: 0x0d1420,
      metalness: 0.85,
      roughness: 0.4,
    })

    const robot = new THREE.Group()
    scene.add(robot)

    // torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.35, 0.7), matBody)
    torso.position.y = 1.15
    robot.add(torso)

    // chest panel
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.55, 0.12), matAccent)
    chest.position.set(0, 1.25, 0.38)
    robot.add(chest)

    // head
    const head = new THREE.Group()
    head.position.y = 2.05
    robot.add(head)
    const skull = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.7, 0.7), matBody)
    head.add(skull)
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.12), matEye)
    visor.position.set(0, 0.08, 0.36)
    head.add(visor)
    // antenna
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8), matJoint)
    ant.position.set(0.28, 0.5, 0)
    head.add(ant)
    const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), matEye)
    antTip.position.set(0.28, 0.7, 0)
    head.add(antTip)

    // arms
    function makeArm(side) {
      const g = new THREE.Group()
      g.position.set(side * 0.75, 1.55, 0)
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.75, 0.28), matBody)
      upper.position.y = -0.35
      g.add(upper)
      const joint = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), matJoint)
      joint.position.y = -0.75
      g.add(joint)
      const lower = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.7, 0.24), matBody)
      lower.position.y = -1.15
      g.add(lower)
      const hand = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.3), matAccent)
      hand.position.y = -1.55
      g.add(hand)
      robot.add(g)
      return g
    }
    const armL = makeArm(-1)
    const armR = makeArm(1)

    // legs
    function makeLeg(side) {
      const g = new THREE.Group()
      g.position.set(side * 0.32, 0.45, 0)
      const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.55, 0.35), matBody)
      thigh.position.y = -0.25
      g.add(thigh)
      const shin = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.5, 0.32), matBody)
      shin.position.y = -0.75
      g.add(shin)
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.16, 0.5), matJoint)
      foot.position.set(0, -1.05, 0.06)
      g.add(foot)
      robot.add(g)
      return g
    }
    const legL = makeLeg(-1)
    const legR = makeLeg(1)

    // base ring (subtle)
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.9, 0.03, 8, 48),
      matAccent
    )
    ring.rotation.x = Math.PI / 2
    ring.position.y = 0.02
    robot.add(ring)

    // ground soft shadow disc
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.1, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 })
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = 0.01
    scene.add(shadow)

    // drag rotate
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
      stateRef.current.pitch = Math.max(-0.45, Math.min(0.35, stateRef.current.pitch + dy * 0.005))
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

      // idle sway unless dragging
      const idleYaw = reduced ? 0 : Math.sin(t * 0.7) * 0.06
      const idleBob = reduced ? 0 : Math.sin(t * 1.4) * 0.03

      robot.rotation.y = st.yaw + idleYaw
      robot.rotation.x = st.pitch
      robot.position.y = idleBob

      // section-based pose
      // 0 hero: wave-ish
      // 1 roles: arms open
      // 2 about: nod / hands front
      const targetArmL = sec === 0 ? -0.6 - p * 0.4 : sec === 1 ? -1.1 : -0.35
      const targetArmR = sec === 0 ? 0.4 + Math.sin(t * 3) * 0.25 * (1 - p) : sec === 1 ? 1.1 : 0.35
      armL.rotation.z = THREE.MathUtils.lerp(armL.rotation.z, targetArmL, 0.08)
      armR.rotation.z = THREE.MathUtils.lerp(armR.rotation.z, targetArmR, 0.08)
      armL.rotation.x = THREE.MathUtils.lerp(armL.rotation.x, sec === 2 ? -0.5 : 0.1, 0.08)
      armR.rotation.x = THREE.MathUtils.lerp(armR.rotation.x, sec === 2 ? -0.5 : 0.1, 0.08)

      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, Math.sin(t * 0.9) * 0.15 + (sec - 1) * 0.1, 0.1)
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, sec === 2 ? 0.15 : -0.05 + p * 0.1, 0.08)

      // emissive pulse by section
      const pulse = 0.8 + 0.4 * Math.sin(t * 2.5)
      matEye.emissiveIntensity = 1.1 + pulse * 0.4
      matAccent.emissiveIntensity = 0.4 + p * 0.5 + sec * 0.15
      point.intensity = 0.9 + p * 0.6

      legL.rotation.x = Math.sin(t * 1.2) * 0.04
      legR.rotation.x = Math.sin(t * 1.2 + Math.PI) * 0.04
      ring.rotation.z = t * 0.4

      renderer.render(scene, camera)
      raf = requestAnimationFrame(frame)
    }

    if (document.hidden) {
      /* pause later */
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
      matBody.dispose()
      matAccent.dispose()
      matEye.dispose()
      matJoint.dispose()
      if (renderer.domElement.parentNode === wrap) wrap.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="robot-stage" ref={wrapRef} aria-label="3D robot — drag to rotate">
      <p className="robot-hint mono">drag to rotate</p>
    </div>
  )
}
