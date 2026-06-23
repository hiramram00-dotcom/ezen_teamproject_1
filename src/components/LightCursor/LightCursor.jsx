import { useEffect, useRef } from 'react'
import styles from './LightCursor.module.css'

const TRAIL_POINTS = 14

function isInteractiveTarget(target) {
  return Boolean(target?.closest?.('[data-cursor="pointer"]'))
}

function createTrailPoints(x, y) {
  return Array.from({ length: TRAIL_POINTS }, () => ({
    x,
    y,
  }))
}

function buildSmoothLine(points) {
  if (!points.length) return ''

  const path = [`M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`]

  for (let i = 1; i < points.length - 1; i += 1) {
    const xc = (points[i].x + points[i + 1].x) / 2
    const yc = (points[i].y + points[i + 1].y) / 2
    path.push(
      `Q ${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)} ${xc.toFixed(2)} ${yc.toFixed(2)}`,
    )
  }

  const last = points[points.length - 1]
  path.push(`L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`)

  return path.join(' ')
}

function buildSmoothSegment(points) {
  if (points.length < 2) return ''

  const path = []

  for (let i = 1; i < points.length - 1; i += 1) {
    const xc = (points[i].x + points[i + 1].x) / 2
    const yc = (points[i].y + points[i + 1].y) / 2
    path.push(
      `Q ${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)} ${xc.toFixed(2)} ${yc.toFixed(2)}`,
    )
  }

  const last = points[points.length - 1]
  path.push(`L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`)

  return path.join(' ')
}

function buildTaperedTrailPath(points, headWidth, tailWidth) {
  if (points.length < 2) return ''

  const left = []
  const right = []

  for (let i = 0; i < points.length; i += 1) {
    const point = points[i]
    const next = points[Math.min(i + 1, points.length - 1)]
    const prev = points[Math.max(i - 1, 0)]
    const dx = next.x - prev.x
    const dy = next.y - prev.y
    const length = Math.hypot(dx, dy) || 1
    const normalX = -dy / length
    const normalY = dx / length
    const progress = i / (points.length - 1)
    const width = tailWidth + (headWidth - tailWidth) * (1 - progress) ** 1.65
    const half = width / 2

    left.push({
      x: point.x + normalX * half,
      y: point.y + normalY * half,
    })
    right.push({
      x: point.x - normalX * half,
      y: point.y - normalY * half,
    })
  }

  const reversedRight = right.reverse()
  const tailPoint = left[left.length - 1]

  return [
    buildSmoothLine(left),
    `L ${tailPoint.x.toFixed(2)} ${tailPoint.y.toFixed(2)}`,
    `L ${reversedRight[0].x.toFixed(2)} ${reversedRight[0].y.toFixed(2)}`,
    buildSmoothSegment(reversedRight),
    'Z',
  ].join(' ')
}

function LightCursor() {
  const rootRef = useRef(null)
  const lightRef = useRef(null)
  const tailGlowRef = useRef(null)
  const tailCoreRef = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const trail = useRef(createTrailPoints(0, 0))
  const previous = useRef({ x: 0, y: 0 })
  const rafRef = useRef(0)
  const hasMovedRef = useRef(false)

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

    if (!finePointer.matches) {
      return undefined
    }

    document.documentElement.classList.add('has-light-cursor')

    const moveCursor = () => {
      current.current.x += (pointer.current.x - current.current.x) * 0.28
      current.current.y += (pointer.current.y - current.current.y) * 0.28

      const dx = current.current.x - previous.current.x
      const dy = current.current.y - previous.current.y
      const speed = Math.hypot(dx, dy)

      trail.current[0].x = current.current.x
      trail.current[0].y = current.current.y

      for (let i = 1; i < trail.current.length; i += 1) {
        const point = trail.current[i]
        const previousPoint = trail.current[i - 1]
        const ease = Math.max(0.2, 0.44 - i * 0.01)

        point.x += (previousPoint.x - point.x) * ease
        point.y += (previousPoint.y - point.y) * ease
      }

      const glowPath = buildTaperedTrailPath(trail.current, 36, 1.5)
      const corePath = buildTaperedTrailPath(trail.current, 15, 0.6)
      const lightTransform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`
      const opacity = Math.min(0.82, Math.max(0.24, speed * 0.045))

      if (lightRef.current) lightRef.current.style.transform = lightTransform
      if (tailGlowRef.current) {
        tailGlowRef.current.setAttribute('d', glowPath)
        tailGlowRef.current.style.opacity = opacity
      }
      if (tailCoreRef.current) {
        tailCoreRef.current.setAttribute('d', corePath)
        tailCoreRef.current.style.opacity = opacity * 0.72
      }

      previous.current.x = current.current.x
      previous.current.y = current.current.y
      rafRef.current = requestAnimationFrame(moveCursor)
    }

    const handlePointerMove = (event) => {
      pointer.current.x = event.clientX
      pointer.current.y = event.clientY

      if (!hasMovedRef.current) {
        current.current.x = event.clientX
        current.current.y = event.clientY
        trail.current = createTrailPoints(event.clientX, event.clientY)
        previous.current.x = event.clientX
        previous.current.y = event.clientY
        rootRef.current?.classList.add(styles.isVisible)
        hasMovedRef.current = true
      }

      const showPointer = isInteractiveTarget(event.target)
      rootRef.current?.classList.toggle(styles.isPointer, showPointer)
    }

    const handlePointerDown = () => rootRef.current?.classList.add(styles.isPressed)
    const handlePointerUp = () => rootRef.current?.classList.remove(styles.isPressed)
    const handlePointerLeave = () => rootRef.current?.classList.remove(styles.isVisible)
    const handlePointerEnter = () => {
      if (hasMovedRef.current) rootRef.current?.classList.add(styles.isVisible)
    }

    rafRef.current = requestAnimationFrame(moveCursor)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    window.addEventListener('pointerup', handlePointerUp, { passive: true })
    document.addEventListener('mouseleave', handlePointerLeave)
    document.addEventListener('mouseenter', handlePointerEnter)

    return () => {
      document.documentElement.classList.remove('has-light-cursor')
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('mouseleave', handlePointerLeave)
      document.removeEventListener('mouseenter', handlePointerEnter)
    }
  }, [])

  return (
    <div ref={rootRef} className={styles.cursor} aria-hidden="true">
      <svg className={styles.tailSvg}>
        <defs>
          <linearGradient id="light-cursor-tail" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.72)" />
            <stop offset="32%" stopColor="rgba(255, 235, 182, 0.5)" />
            <stop offset="72%" stopColor="rgba(255, 187, 104, 0.18)" />
            <stop offset="100%" stopColor="rgba(255, 187, 104, 0)" />
          </linearGradient>
        </defs>
        <path ref={tailGlowRef} className={styles.tailGlow} />
        <path ref={tailCoreRef} className={styles.tailCore} />
      </svg>
      <span ref={lightRef} className={styles.lightCore} />
    </div>
  )
}

export default LightCursor
