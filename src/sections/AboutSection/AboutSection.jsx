import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './AboutSection.module.css'

import logoIlkw from '../../assets/ilkw-logo-header.svg'
import bulbImage from './assets/about-bulb.webp'
import bulbVideo from './assets/about-bulb.webm'
import tableLampImage from './assets/about-table-lamp.webp'
import tableLampVideo from './assets/about-table-lamp.webm'

const INTRO_PARTICLE_COUNT = 900
const INTRO_PARTICLE_COUNT_MOBILE = 520
const INTRO_DURATION = 6800
const INTRO_HOLD = 1300 / INTRO_DURATION
const INTRO_FRAME_INTERVAL = 1000 / 45
const INTRO_MAX_PIXEL_RATIO = 1.5
const INTRO_CENTER_Y_RATIO = 0.46
const INTRO_SINCE_OFFSET_RATIO = 0.008
const INTRO_SCROLL_DISTANCE_RATIO = 0.5
const INTRO_MAX_PROGRESS_STEP = 0.018
const ABOUT_STORY_VIDEO =
  'https://res.cloudinary.com/dg9hg29hc/video/upload/ADORABLE_ANYWHERE_DUMBO13_-_YouTube_-_Chrome_2026-06-22_11-23-20_zhldeh.mp4'

function easeInOutCubic(value) {
  return value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2
}

function getFontSizeToken(tokenName, fallback) {
  const tokenValue = getComputedStyle(document.documentElement).getPropertyValue(tokenName)
  return Number.parseFloat(tokenValue) || fallback
}

function StoryTypedLines({ lines, progress, startIndex = 0, totalWords, strongFirst = false }) {
  let wordIndex = startIndex

  return lines.map((line, lineIndex) => {
    const words = line.split(' ')

    return (
      <span className={styles.storyTypedLine} key={`${line}-${lineIndex}`}>
        {words.map((word, index) => {
          const currentIndex = wordIndex
          const visible = progress * totalWords >= currentIndex + 1
          wordIndex += 1

          return (
            <span
              className={`${styles.storyTypedWord} ${
                visible ? styles.storyTypedWordVisible : ''
              }`}
              key={`${word}-${currentIndex}`}
            >
              {strongFirst && currentIndex === startIndex ? <strong>{word}</strong> : word}
              {index < words.length - 1 ? '\u00a0' : ''}
            </span>
          )
        })}
      </span>
    )
  })
}

function sampleIntroTextPoints(width, height, particleCount) {
  const mask = document.createElement('canvas')
  const maskContext = mask.getContext('2d', { willReadFrequently: true })
  const centerX = width / 2
  const centerY = height * INTRO_CENTER_Y_RATIO
  const sinceSize = getFontSizeToken('--fs-title-4', 70)
  const yearSize = getFontSizeToken('--fs-display-1', 180)
  const textCenterY = centerY - width * 0.01
  const textLeft = width * 0.409
  const maskWidth = Math.ceil(width * 0.3)
  const maskHeight = Math.ceil(width * 0.2)
  const maskLeft = centerX - maskWidth / 2
  const maskTop = textCenterY - maskHeight / 2
  const step = Math.max(3, Math.round(width / 420))

  mask.width = maskWidth
  mask.height = maskHeight
  maskContext.fillStyle = '#fff'
  maskContext.textAlign = 'left'
  maskContext.textBaseline = 'middle'
  maskContext.font = `italic 400 ${sinceSize}px "Playfair Display", "Times New Roman", serif`
  maskContext.fillText(
    'Since',
    textLeft - maskLeft + width * INTRO_SINCE_OFFSET_RATIO,
    maskHeight / 2 - yearSize * 0.42,
  )
  maskContext.font = `600 ${yearSize}px Arial, sans-serif`
  maskContext.fillText('1962', textLeft - maskLeft, maskHeight / 2 + sinceSize * 0.62)

  const pixels = maskContext.getImageData(0, 0, maskWidth, maskHeight).data
  const points = []

  for (let y = 0; y < maskHeight; y += step) {
    for (let x = 0; x < maskWidth; x += step) {
      if (pixels[(y * maskWidth + x) * 4 + 3] > 96) {
        points.push({
          x: maskLeft + x + (Math.random() - 0.5) * step,
          y: maskTop + y + (Math.random() - 0.5) * step,
        })
      }
    }
  }

  for (let index = points.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const currentPoint = points[index]
    points[index] = points[swapIndex]
    points[swapIndex] = currentPoint
  }

  if (points.length === 0) return Array.from({ length: particleCount }, () => ({ x: centerX, y: centerY }))

  return Array.from({ length: particleCount }, (_, index) => points[index % points.length])
}

function AboutIntroParticles({ onComplete }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let animationFrame = null
    let lastFrameTime = 0
    let particles = []
    let completed = false
    let renderRatio = 1
    let displayedProgress = 0
    let targetProgress = 0

    const buildParticles = () => {
      renderRatio = Math.min(window.devicePixelRatio || 1, INTRO_MAX_PIXEL_RATIO)
      const width = window.innerWidth
      const height = Math.max(window.innerHeight, width * 0.5625)
      const centerX = width / 2
      const centerY = height * INTRO_CENTER_Y_RATIO
      const ringRadius = Math.min(width, height) * 0.22
      const particleCount =
        width <= 768 ? INTRO_PARTICLE_COUNT_MOBILE : INTRO_PARTICLE_COUNT
      const textPoints = sampleIntroTextPoints(width, height, particleCount)

      canvas.width = Math.round(width * renderRatio)
      canvas.height = Math.round(height * renderRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(renderRatio, 0, 0, renderRatio, 0, 0)
      context.clearRect(0, 0, width, height)

      particles = Array.from({ length: particleCount }, (_, index) => {
        const angle = (index / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.2
        const radius = ringRadius + (Math.random() - 0.5) * width * 0.045
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        const textPoint = textPoints[index]

        return {
          x,
          y,
          px: x,
          py: y,
          targetX: textPoint.x,
          targetY: textPoint.y,
          angle,
          radius,
          size: 0.45 + Math.random() * 1.35,
          speed: 0.42 + Math.random() * 0.82,
          jitter: Math.random() * Math.PI * 2,
          orbitOffset: (Math.random() - 0.5) * 0.22,
        }
      })
    }

    const draw = (now) => {
      if (now - lastFrameTime < INTRO_FRAME_INTERVAL) {
        animationFrame = requestAnimationFrame(draw)
        return
      }

      lastFrameTime = now
      const scrollDistance = Math.max(
        window.innerWidth * INTRO_SCROLL_DISTANCE_RATIO,
        window.innerHeight * 0.72,
      )
      displayedProgress += Math.min(
        Math.max(targetProgress - displayedProgress, 0),
        INTRO_MAX_PROGRESS_STEP,
      )

      const progress = displayedProgress
      const elapsed = progress * INTRO_DURATION
      const gather = easeInOutCubic(Math.min(Math.max((progress - INTRO_HOLD) / 0.34, 0), 1))
      const write = easeInOutCubic(Math.min(Math.max((progress - INTRO_HOLD - 0.24) / 0.36, 0), 1))
      const particleFade =
        1 - easeInOutCubic(Math.min(Math.max((write - 0.72) / 0.28, 0), 1))
      const width = canvas.width / renderRatio
      const height = canvas.height / renderRatio
      const centerX = width / 2
      const centerY = height * INTRO_CENTER_Y_RATIO
      context.globalCompositeOperation = 'source-over'
      context.clearRect(0, 0, width, height)
      context.lineCap = 'round'
      context.shadowBlur = 0

      particles.forEach((particle) => {
        const freeSpin = elapsed * 0.00042 * particle.speed
        const ringAngle =
          particle.angle +
          particle.orbitOffset +
          freeSpin +
          Math.sin(elapsed * 0.0012 + particle.jitter) * 0.045 * (1 - gather)
        const ringRadius =
          particle.radius + Math.sin(elapsed * 0.0015 + particle.jitter) * width * 0.014 * (1 - gather)
        const ringX = centerX + Math.cos(ringAngle) * ringRadius
        const ringY = centerY + Math.sin(ringAngle) * ringRadius
        const wander =
          Math.sin(elapsed * 0.002 + particle.jitter * 1.7) * width * 0.018 * gather * (1 - gather)
        const gatheredX =
          ringX + (particle.targetX + Math.cos(particle.jitter) * wander - ringX) * gather
        const gatheredY =
          ringY + (particle.targetY + Math.sin(particle.jitter) * wander - ringY) * gather
        const targetX = gatheredX
        const targetY = gatheredY

        particle.px = particle.x
        particle.py = particle.y
        particle.x += (targetX - particle.x) * (0.12 + write * 0.1)
        particle.y += (targetY - particle.y) * (0.12 + write * 0.1)

        const velocity = Math.hypot(particle.x - particle.px, particle.y - particle.py)
        const ringGlow = 1 - gather
        const lineFade = particleFade
        const alpha =
          Math.min(0.94, 0.24 + velocity / 18 + ringGlow * 0.25 + gather * 0.3) * lineFade
        const weight =
          particle.size *
          (0.68 + Math.min(velocity / 20, 0.62) + ringGlow * 0.38 + gather * 0.24) *
          (0.55 + lineFade * 0.45)

        if (alpha > 0.01) {
          context.beginPath()
          context.strokeStyle = `rgba(247, 242, 232, ${alpha})`
          context.lineWidth = weight
          context.moveTo(particle.px, particle.py)
          context.lineTo(particle.x, particle.y)
          context.stroke()
        }

        if (gather > 0.52) {
          const pointAlpha = Math.min(0.96, (gather - 0.52) * 2.4) * particleFade
          context.beginPath()
          context.fillStyle = `rgba(255, 252, 246, ${pointAlpha})`
          context.arc(particle.x, particle.y, Math.max(0.65, particle.size * 0.72), 0, Math.PI * 2)
          context.fill()
        }
      })

      if (write > 0.78) {
        const solidTextOpacity = (write - 0.78) / 0.22
        const sinceSize = getFontSizeToken('--fs-title-4', 70)
        const yearSize = getFontSizeToken('--fs-display-1', 180)
        const textCenterY = centerY - width * 0.01
        const textLeft = width * 0.409

        context.save()
        context.textAlign = 'left'
        context.textBaseline = 'middle'
        context.fillStyle = `rgba(255, 255, 255, ${solidTextOpacity})`
        context.font = `italic 400 ${sinceSize}px "Playfair Display", "Times New Roman", serif`
        context.fillText(
          'Since',
          textLeft + width * INTRO_SINCE_OFFSET_RATIO,
          textCenterY - yearSize * 0.42,
        )
        context.font = `600 ${yearSize}px Arial, sans-serif`
        context.fillText('1962', textLeft, textCenterY + sinceSize * 0.62)
        context.restore()
      }

      if (progress >= 1 && !completed) {
        completed = true
        onComplete()
      }
      animationFrame = requestAnimationFrame(draw)
    }

    const handleWheel = (event) => {
      if (completed || event.deltaY <= 0) return
      event.preventDefault()
      const scrollDistance = Math.max(
        window.innerWidth * INTRO_SCROLL_DISTANCE_RATIO,
        window.innerHeight * 0.72,
      )
      targetProgress = Math.min(targetProgress + event.deltaY / scrollDistance, 1)
    }

    buildParticles()
    animationFrame = requestAnimationFrame(draw)
    window.addEventListener('resize', buildParticles)
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('resize', buildParticles)
      window.removeEventListener('wheel', handleWheel)
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [onComplete])

  return <canvas className={styles.introParticles} ref={canvasRef} aria-hidden="true" />
}

function AboutTravelLight({ active, aboutRef, legacyLightRef, storyFromRef }) {
  const canvasRef = useRef(null)
  const lightRef = useRef(null)

  useEffect(() => {
    if (!active) return undefined

    const canvas = canvasRef.current
    const light = lightRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !light || !context) return undefined

    let animationFrame = null
    let renderRatio = 1
    let current = null
    let previous = null
    let lastProgress = -1
    const trail = []

    const resizeCanvas = () => {
      renderRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(window.innerWidth * renderRatio)
      canvas.height = Math.round(window.innerHeight * renderRatio)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(renderRatio, 0, 0, renderRatio, 0, 0)
      trail.length = 0
    }

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
    const smooth = (value) => value * value * (3 - 2 * value)
    const cubicPoint = (start, controlOne, controlTwo, end, progress) => {
      const inverse = 1 - progress
      return {
        x:
          inverse ** 3 * start.x +
          3 * inverse ** 2 * progress * controlOne.x +
          3 * inverse * progress ** 2 * controlTwo.x +
          progress ** 3 * end.x,
        y:
          inverse ** 3 * start.y +
          3 * inverse ** 2 * progress * controlOne.y +
          3 * inverse * progress ** 2 * controlTwo.y +
          progress ** 3 * end.y,
      }
    }

    const getTarget = () => {
      const about = aboutRef.current
      const legacyLight = legacyLightRef.current
      const storyFrom = storyFromRef.current
      if (!about || !legacyLight || !storyFrom) return null

      const aboutRect = about.getBoundingClientRect()
      const aboutTop = aboutRect.top + window.scrollY
      const legacyRect = legacyLight.getBoundingClientRect()
      const storyRect = storyFrom.getBoundingClientRect()
      const introHeight = Math.max(window.innerHeight, window.innerWidth * 0.5625)
      const startDocument = {
        x: window.innerWidth * 0.5,
        y: aboutTop + introHeight * INTRO_CENTER_Y_RATIO + window.innerWidth * 0.075,
      }
      const legacyDocument = {
        x: legacyRect.left + window.scrollX + legacyRect.width * 0.78,
        y: legacyRect.top + window.scrollY + legacyRect.height * 0.58,
      }
      const storyDocument = {
        x: storyRect.left + window.scrollX + storyRect.width * 0.5,
        y: storyRect.top + window.scrollY + storyRect.height * 0.55,
      }
      const firstStart = Math.max(aboutTop, startDocument.y - window.innerHeight * 0.55)
      const firstEnd = Math.max(firstStart + window.innerHeight * 0.7, legacyDocument.y - window.innerHeight * 0.38)
      const secondEnd = Math.max(
        firstEnd + window.innerHeight * 0.9,
        aboutTop + window.innerWidth * 1.55 - window.innerHeight * 0.12,
      )

      if (window.scrollY < firstStart - 10 || window.scrollY > secondEnd + window.innerHeight * 0.12) {
        return null
      }

      let position
      let totalProgress

      if (window.scrollY <= firstEnd) {
        const progress = smooth(clamp((window.scrollY - firstStart) / (firstEnd - firstStart), 0, 1))
        const start = { x: startDocument.x, y: startDocument.y - window.scrollY }
        const end = { x: legacyDocument.x, y: legacyDocument.y - window.scrollY }
        position = cubicPoint(
          start,
          { x: start.x + window.innerWidth * 0.18, y: start.y + window.innerHeight * 0.3 },
          { x: end.x - window.innerWidth * 0.2, y: end.y - window.innerHeight * 0.22 },
          end,
          progress,
        )
        totalProgress = progress * 0.5
      } else {
        const progress = smooth(clamp((window.scrollY - firstEnd) / (secondEnd - firstEnd), 0, 1))
        const start = { x: legacyDocument.x, y: legacyDocument.y - window.scrollY }
        const end = {
          x: storyRect.left + storyRect.width * 0.48,
          y: storyRect.top + storyRect.height * 0.55,
        }
        position = cubicPoint(
          start,
          { x: start.x + window.innerWidth * 0.22, y: start.y + window.innerHeight * 0.24 },
          { x: end.x + window.innerWidth * 0.24, y: end.y - window.innerHeight * 0.2 },
          end,
          progress,
        )
        totalProgress = 0.5 + progress * 0.5
      }

      return { ...position, progress: totalProgress }
    }

    const drawTrail = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (let index = trail.length - 1; index >= 0; index -= 1) {
        trail[index].life -= 0.026
        if (trail[index].life <= 0) trail.splice(index, 1)
      }

      context.lineCap = 'round'
      context.lineJoin = 'round'
      for (let index = 1; index < trail.length; index += 1) {
        const before = trail[Math.max(0, index - 2)]
        const previousPoint = trail[index - 1]
        const point = trail[index]
        const alpha = Math.min(previousPoint.life, point.life) * 0.34
        context.beginPath()
        context.moveTo((before.x + previousPoint.x) / 2, (before.y + previousPoint.y) / 2)
        context.quadraticCurveTo(
          previousPoint.x,
          previousPoint.y,
          (previousPoint.x + point.x) / 2,
          (previousPoint.y + point.y) / 2,
        )
        context.strokeStyle = `rgba(255, 205, 132, ${alpha})`
        context.lineWidth = 2
        context.shadowColor = `rgba(255, 231, 184, ${alpha * 0.9})`
        context.shadowBlur = 7
        context.stroke()
      }
      context.shadowBlur = 0
    }

    const animate = () => {
      const target = getTarget()

      if (!target) {
        current = null
        previous = null
        trail.length = 0
        light.style.opacity = '0'
        drawTrail()
        animationFrame = requestAnimationFrame(animate)
        return
      }

      if (!current) current = { x: target.x, y: target.y }
      previous = { ...current }
      current.x += (target.x - current.x) * 0.14
      current.y += (target.y - current.y) * 0.14

      if (
        !trail.length ||
        Math.hypot(current.x - trail[trail.length - 1].x, current.y - trail[trail.length - 1].y) > 2.5
      ) {
        trail.push({ x: current.x, y: current.y, life: 1 })
      }

      if (
        (lastProgress < 0.5 && target.progress >= 0.5) ||
        (lastProgress < 0.99 && target.progress >= 0.99)
      ) {
        light.classList.remove(styles.travelLightSpark)
        void light.offsetWidth
        light.classList.add(styles.travelLightSpark)
      }
      lastProgress = target.progress

      drawTrail()
      const angle = Math.atan2(current.y - previous.y, current.x - previous.x) * (180 / Math.PI)
      light.style.left = `${current.x}px`
      light.style.top = `${current.y}px`
      light.style.opacity = '1'
      light.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`
      animationFrame = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animationFrame = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [active, aboutRef, legacyLightRef, storyFromRef])

  return (
    <>
      <canvas ref={canvasRef} className={styles.travelLightCanvas} aria-hidden="true" />
      <span ref={lightRef} className={styles.travelLight} aria-hidden="true">
        <span className={styles.travelLightTail} />
        <span className={styles.travelLightCore} />
      </span>
    </>
  )
}

function AboutStoryLight({
  active,
  aboutRef,
  legacyTargetRef,
  storyTargetRef,
  videoTargetRef,
  endingTargetRef,
  onReveal,
}) {
  const canvasRef = useRef(null)
  const lightRef = useRef(null)

  useEffect(() => {
    if (!active) return undefined

    const about = aboutRef.current
    const canvas = canvasRef.current
    const light = lightRef.current
    const context = canvas?.getContext('2d')
    if (!about || !canvas || !light || !context) return undefined

    const trailPoints = []
    const revealed = new Set([0])
    let stops = []
    let renderRatio = 1
    let currentX = window.innerWidth * 0.5
    let currentY = window.innerHeight * 0.5
    let previousX = currentX
    let previousY = currentY
    let previousTargetScroll = 0
    let lightProgress = 0
    let flashingStop = -1
    let flashTimer = null
    let animationFrame = null

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
    const smooth = (value) => value * value * value * (value * (value * 6 - 15) + 10)
    const catmullRom = (p0, p1, p2, p3, progress) => {
      const progressSquared = progress * progress
      const progressCubed = progressSquared * progress
      return 0.5 * (
        2 * p1 +
        (-p0 + p2) * progress +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * progressSquared +
        (-p0 + 3 * p1 - 3 * p2 + p3) * progressCubed
      )
    }

    const sectionPoint = (element, xRatio = 0.5, yRatio = 0.5) => {
      if (!element) return null
      const aboutTop = about.getBoundingClientRect().top + window.scrollY
      const rect = element.getBoundingClientRect()
      return {
        x: rect.left + rect.width * xRatio,
        y: rect.top + window.scrollY - aboutTop + rect.height * yRatio,
      }
    }

    const buildStops = () => {
      const introHeight = Math.max(window.innerHeight, window.innerWidth * 0.5625)
      const legacy = sectionPoint(legacyTargetRef.current, 0.78, 0.58)
      const story = sectionPoint(storyTargetRef.current, 0.5, 0.55)
      const video = sectionPoint(videoTargetRef.current, 0.68, 0.42)
      const ending = sectionPoint(endingTargetRef.current, 0.62, 0.5)
      if (!legacy || !story || !video || !ending) return

      stops = [
        {
          x: window.innerWidth * 0.5,
          y: introHeight * INTRO_CENTER_Y_RATIO + window.innerWidth * 0.075,
        },
        legacy,
        story,
        video,
        ending,
      ]
    }

    const resizeCanvas = () => {
      renderRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(window.innerWidth * renderRatio)
      canvas.height = Math.round(window.innerHeight * renderRatio)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(renderRatio, 0, 0, renderRatio, 0, 0)
      trailPoints.length = 0
      buildStops()
    }

    const getTargetScroll = () => {
      const aboutTop = about.getBoundingClientRect().top + window.scrollY
      return window.scrollY - aboutTop + window.innerHeight * 0.65
    }

    const getPathPosition = (scrollPosition) => {
      if (!stops.length) return null
      if (scrollPosition <= stops[0].y) return stops[0]

      for (let index = 0; index < stops.length - 1; index += 1) {
        const stop = stops[index]
        const next = stops[index + 1]
        if (scrollPosition <= next.y) {
          const progress = smooth(clamp((scrollPosition - stop.y) / (next.y - stop.y), 0, 1))
          const previous = stops[Math.max(0, index - 1)]
          const afterNext = stops[Math.min(stops.length - 1, index + 2)]
          return {
            x: clamp(
              catmullRom(previous.x, stop.x, next.x, afterNext.x, progress),
              24,
              window.innerWidth - 24,
            ),
            y: catmullRom(previous.y, stop.y, next.y, afterNext.y, progress),
          }
        }
      }

      return stops[stops.length - 1]
    }

    const sparkleAndReveal = (index) => {
      if (revealed.has(index)) return
      revealed.add(index)
      flashingStop = index
      light.classList.remove(styles.travelLightSpark)
      void light.offsetWidth
      light.classList.add(styles.travelLightSpark)
      onReveal(index)

      window.clearTimeout(flashTimer)
      flashTimer = window.setTimeout(() => {
        flashingStop = -1
        light.classList.remove(styles.travelLightSpark)
      }, 450)
    }

    const drawTrail = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (let index = trailPoints.length - 1; index >= 0; index -= 1) {
        trailPoints[index].life -= 0.012
        if (trailPoints[index].life <= 0) trailPoints.splice(index, 1)
      }

      context.lineCap = 'round'
      context.lineJoin = 'round'
      for (let index = 1; index < trailPoints.length; index += 1) {
        const previousPoint = trailPoints[index - 1]
        const point = trailPoints[index]
        const beforePrevious = trailPoints[Math.max(0, index - 2)]
        const alpha = Math.min(previousPoint.life, point.life) * 0.34
        context.beginPath()
        context.moveTo(
          (beforePrevious.x + previousPoint.x) / 2,
          (beforePrevious.y + previousPoint.y) / 2,
        )
        context.quadraticCurveTo(
          previousPoint.x,
          previousPoint.y,
          (previousPoint.x + point.x) / 2,
          (previousPoint.y + point.y) / 2,
        )
        context.strokeStyle = `rgba(255, 205, 132, ${alpha})`
        context.lineWidth = 2.2
        context.shadowColor = `rgba(255, 231, 184, ${alpha * 0.8})`
        context.shadowBlur = 7
        context.stroke()
      }
      context.shadowBlur = 0
    }

    const animate = () => {
      if (!stops.length) buildStops()
      if (!stops.length) {
        animationFrame = requestAnimationFrame(animate)
        return
      }

      const aboutTop = about.getBoundingClientRect().top + window.scrollY
      const scrollInside = window.scrollY - aboutTop
      const targetScroll = getTargetScroll()
      const clampedScroll = clamp(targetScroll, stops[0].y, stops[stops.length - 1].y)
      const targetScrollDelta = Math.abs(clampedScroll - previousTargetScroll)
      const fastProgressThreshold = Math.max(85, window.innerHeight * 0.1)

      stops.forEach((stop, index) => {
        if (
          index > 0 &&
          !revealed.has(index) &&
          previousTargetScroll < stop.y &&
          clampedScroll >= stop.y &&
          targetScrollDelta > fastProgressThreshold
        ) {
          sparkleAndReveal(index)
        }
      })

      const progressDistance = clampedScroll - lightProgress
      const maxProgressStep = Math.max(8, Math.min(24, window.innerHeight * 0.02))
      lightProgress += clamp(progressDistance, -maxProgressStep, maxProgressStep)

      const maxProgressLag = 180
      if (clampedScroll - lightProgress > maxProgressLag) lightProgress = clampedScroll - maxProgressLag
      else if (lightProgress - clampedScroll > maxProgressLag) lightProgress = clampedScroll + maxProgressLag

      const target = getPathPosition(lightProgress)
      const targetViewportY = target.y - scrollInside
      previousX = currentX
      previousY = currentY
      currentX += (target.x - currentX) * 0.065
      currentY += (targetViewportY - currentY) * 0.065

      const lastTrailPoint = trailPoints[trailPoints.length - 1]
      if (
        !lastTrailPoint ||
        Math.hypot(currentX - lastTrailPoint.x, currentY - lastTrailPoint.y) > 3
      ) {
        trailPoints.push({ x: currentX, y: currentY, life: 1 })
      }

      drawTrail()
      const angle = Math.atan2(currentY - previousY, currentX - previousX) * (180 / Math.PI)
      light.style.left = `${currentX}px`
      light.style.top = `${currentY}px`
      light.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`

      stops.forEach((stop, index) => {
        if (index === 0 || revealed.has(index)) return
        const stopViewportY = stop.y - scrollInside
        const distance = Math.hypot(currentX - stop.x, currentY - stopViewportY)
        if (lightProgress >= stop.y - 70 && distance < 10) sparkleAndReveal(index)
        else if (lightProgress > stop.y + 120) sparkleAndReveal(index)
      })

      const insideRevealedContent = stops.some((stop, index) => {
        if (index === 0 || !revealed.has(index) || flashingStop === index) return false
        return Math.hypot(currentX - stop.x, currentY - (stop.y - scrollInside)) < 36
      })

      light.style.opacity =
        targetScroll >= stops[0].y &&
        targetScroll <= stops[stops.length - 1].y + window.innerHeight * 0.12 &&
        !insideRevealedContent
          ? '1'
          : '0'

      previousTargetScroll = clampedScroll
      animationFrame = requestAnimationFrame(animate)
    }

    resizeCanvas()
    const initialScroll = getTargetScroll()
    previousTargetScroll = initialScroll
    lightProgress = initialScroll
    window.addEventListener('resize', resizeCanvas)
    animationFrame = requestAnimationFrame(animate)

    return () => {
      window.clearTimeout(flashTimer)
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [
    active,
    aboutRef,
    endingTargetRef,
    legacyTargetRef,
    onReveal,
    storyTargetRef,
    videoTargetRef,
  ])

  return (
    <>
      <canvas ref={canvasRef} className={styles.travelLightCanvas} aria-hidden="true" />
      <span ref={lightRef} className={styles.travelLight} aria-hidden="true">
        <span className={styles.travelLightTail} />
        <span className={styles.travelLightCore} />
      </span>
    </>
  )
}

function AboutSvgStoryLight({
  active,
  aboutRef,
  legacyTargetRef,
  storyDaysRef,
  storySecondImageRef,
  videoTargetRef,
  endingTargetRef,
  storyPhase,
  onReveal,
}) {
  const guidePathRef = useRef(null)
  const tailGlowRef = useRef(null)
  const tailCoreRef = useRef(null)
  const lightRef = useRef(null)

  useEffect(() => {
    if (!active) return undefined

    const about = aboutRef.current
    const guidePath = guidePathRef.current
    const light = lightRef.current
    if (!about || !guidePath || !light) return undefined

    const trail = Array.from({ length: 14 }, () => ({ x: 0, y: 0 }))
    const revealed = new Set()
    let segments = []
    let current = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 }
    let flashTimer = null
    let animationFrame = null

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
    const ease = (value) => value * value * (3 - 2 * value)

    const sectionPoint = (element, xRatio = 0.5, yRatio = 0.5) => {
      if (!element) return null
      const aboutTop = about.getBoundingClientRect().top + window.scrollY
      const rect = element.getBoundingClientRect()
      return {
        x: rect.left + rect.width * xRatio,
        y: rect.top + window.scrollY - aboutTop + rect.height * yRatio,
      }
    }

    const curve = (start, end, horizontalBend) => {
      const verticalDistance = Math.max(140, end.y - start.y)
      const controlOne = {
        x: clamp(start.x + horizontalBend * window.innerWidth, 28, window.innerWidth - 28),
        y: start.y + verticalDistance * 0.34,
      }
      const controlTwo = {
        x: clamp(end.x - horizontalBend * window.innerWidth * 0.72, 28, window.innerWidth - 28),
        y: end.y - verticalDistance * 0.3,
      }
      return `M ${start.x} ${start.y} C ${controlOne.x} ${controlOne.y}, ${controlTwo.x} ${controlTwo.y}, ${end.x} ${end.y}`
    }

    const appendCurve = (path, start, end, horizontalBend) => {
      const nextCurve = curve(start, end, horizontalBend)
      return `${path} ${nextCurve.replace(/^M [^C]+/, '')}`
    }

    const buildSegments = () => {
      const introHeight = Math.max(window.innerHeight, window.innerWidth * 0.5625)
      const start = {
        x: window.innerWidth * 0.5,
        y: introHeight * INTRO_CENTER_Y_RATIO - window.innerWidth * 0.005,
      }
      const legacy = sectionPoint(legacyTargetRef.current, 0.74, 0.58)
      const days = sectionPoint(storyDaysRef.current, 0.5, 0.58)
      const secondImageExit = sectionPoint(storySecondImageRef.current, 0.52, 1.08)
      const video = sectionPoint(videoTargetRef.current, 0.5, 0.5)
      const videoExit = sectionPoint(videoTargetRef.current, 0.5, 1.08)
      const ending = sectionPoint(endingTargetRef.current, 0.5, 0.55)
      if (!legacy || !days || !secondImageExit || !video || !videoExit || !ending) return

      const firstPath = appendCurve(curve(start, legacy, 0.16), legacy, days, -0.2)
      segments = [
        {
          d: firstPath,
          startScroll: Math.max(0, start.y - window.innerHeight * 0.52),
          endScroll: days.y - window.innerHeight * 0.5,
          visible: () => storyPhase !== 'second' && storyPhase !== 'after',
          targets: [
            { index: 1, progress: 0.48 },
            { index: 2, progress: 0.985 },
          ],
        },
        {
          d: curve(secondImageExit, video, 0.2),
          startScroll: secondImageExit.y - window.innerHeight * 0.7,
          endScroll: video.y - window.innerHeight * 0.5,
          visible: () => storyPhase === 'after',
          targets: [{ index: 3, progress: 0.985 }],
        },
        {
          d: curve(videoExit, ending, -0.18),
          startScroll: videoExit.y - window.innerHeight * 0.72,
          endScroll: ending.y - window.innerHeight * 0.5,
          visible: () => storyPhase === 'after',
          targets: [{ index: 4, progress: 0.985 }],
        },
      ]
    }

    const buildSmoothLine = (points) => {
      if (!points.length) return ''
      const path = [`M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`]
      for (let index = 1; index < points.length - 1; index += 1) {
        const centerX = (points[index].x + points[index + 1].x) / 2
        const centerY = (points[index].y + points[index + 1].y) / 2
        path.push(
          `Q ${points[index].x.toFixed(2)} ${points[index].y.toFixed(2)} ${centerX.toFixed(2)} ${centerY.toFixed(2)}`,
        )
      }
      const last = points[points.length - 1]
      path.push(`L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`)
      return path.join(' ')
    }

    const updateTrail = (x, y, visible) => {
      if (!visible) {
        trail.forEach((point) => {
          point.x = x
          point.y = y
        })
        tailGlowRef.current?.setAttribute('d', '')
        tailCoreRef.current?.setAttribute('d', '')
        return
      }

      trail[0].x = x
      trail[0].y = y
      for (let index = 1; index < trail.length; index += 1) {
        const point = trail[index]
        const previous = trail[index - 1]
        const follow = Math.max(0.2, 0.44 - index * 0.01)
        point.x += (previous.x - point.x) * follow
        point.y += (previous.y - point.y) * follow
      }
      const path = buildSmoothLine(trail)
      tailGlowRef.current?.setAttribute('d', path)
      tailCoreRef.current?.setAttribute('d', path)
    }

    const sparkleAndReveal = (index) => {
      if (revealed.has(index)) return
      revealed.add(index)
      light.classList.remove(styles.travelLightSpark)
      void light.offsetWidth
      light.classList.add(styles.travelLightSpark)
      onReveal(index)
      window.clearTimeout(flashTimer)
      flashTimer = window.setTimeout(() => {
        light.classList.remove(styles.travelLightSpark)
      }, 450)
    }

    const animate = () => {
      if (!segments.length) buildSegments()
      const aboutTop = about.getBoundingClientRect().top + window.scrollY
      const scrollInside = window.scrollY - aboutTop

      segments.forEach((segment) => {
        if (!segment.visible()) return
        segment.targets.forEach((target) => {
          const triggerScroll =
            segment.startScroll +
            (segment.endScroll - segment.startScroll) * target.progress
          if (scrollInside >= triggerScroll) sparkleAndReveal(target.index)
        })
      })

      const activeSegment = segments.find(
        (segment) =>
          scrollInside >= segment.startScroll &&
          scrollInside <= segment.endScroll &&
          segment.visible(),
      )

      if (!activeSegment) {
        light.style.opacity = '0'
        updateTrail(current.x, current.y, false)
        animationFrame = requestAnimationFrame(animate)
        return
      }

      guidePath.setAttribute('d', activeSegment.d)
      const totalLength = guidePath.getTotalLength()
      const progress = ease(
        clamp(
          (scrollInside - activeSegment.startScroll) /
            (activeSegment.endScroll - activeSegment.startScroll),
          0,
          1,
        ),
      )
      const point = guidePath.getPointAtLength(totalLength * progress)
      const targetX = point.x
      const targetY = point.y - scrollInside

      current.x += (targetX - current.x) * 0.1
      current.y += (targetY - current.y) * 0.1
      updateTrail(current.x, current.y, true)

      light.style.left = `${current.x}px`
      light.style.top = `${current.y}px`
      light.style.opacity = progress > 0.992 ? '0' : '1'

      activeSegment.targets.forEach((target) => {
        if (progress >= target.progress) sparkleAndReveal(target.index)
      })

      animationFrame = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      segments = []
      buildSegments()
    }

    buildSegments()
    window.addEventListener('resize', handleResize)
    animationFrame = requestAnimationFrame(animate)

    return () => {
      window.clearTimeout(flashTimer)
      window.removeEventListener('resize', handleResize)
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [
    active,
    aboutRef,
    endingTargetRef,
    legacyTargetRef,
    onReveal,
    storyDaysRef,
    storyPhase,
    storySecondImageRef,
    videoTargetRef,
  ])

  return (
    <>
      <svg className={styles.travelLightCanvas} aria-hidden="true">
        <path ref={guidePathRef} className={styles.travelLightGuide} />
        <path ref={tailGlowRef} className={styles.travelLightTrailGlow} />
        <path ref={tailCoreRef} className={styles.travelLightTrailCore} />
      </svg>
      <span ref={lightRef} className={styles.travelLight} aria-hidden="true">
        <span className={styles.travelLightCore} />
      </span>
    </>
  )
}

function AboutSection() {
  const aboutRef = useRef(null)
  const legacyRef = useRef(null)
  const endingRef = useRef(null)
  const previousStoryPhaseRef = useRef('before')
  const introHasLeftRef = useRef(false)
  const [introCycle, setIntroCycle] = useState(0)
  const [legacyRevealed, setLegacyRevealed] = useState(false)
  const [storyPhase, setStoryPhase] = useState('before')
  const [storyProgress, setStoryProgress] = useState(0)
  const [storyCycle, setStoryCycle] = useState(0)
  const [endingRevealed, setEndingRevealed] = useState(false)

  const handleIntroComplete = useCallback(() => {}, [])

  useEffect(() => {
    const legacy = legacyRef.current
    if (!legacy) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        setLegacyRevealed(entry.isIntersecting)
      },
      {
        rootMargin: '0px 0px 18% 0px',
        threshold: 0.01,
      },
    )

    observer.observe(legacy)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const updateIntroCycle = () => {
      if (window.scrollY > window.innerHeight * 0.65) {
        introHasLeftRef.current = true
        return
      }

      if (window.scrollY <= 8 && introHasLeftRef.current) {
        introHasLeftRef.current = false
        setIntroCycle((cycle) => cycle + 1)
      }
    }

    window.addEventListener('scroll', updateIntroCycle, { passive: true })
    updateIntroCycle()

    return () => window.removeEventListener('scroll', updateIntroCycle)
  }, [])

  useEffect(() => {
    const targets = [[endingRef.current, setEndingRevealed]].filter(([element]) => element)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = targets.find(([element]) => element === entry.target)
          if (!target) return
          target[1](entry.isIntersecting && entry.intersectionRatio >= 0.18)
        })
      },
      { threshold: [0, 0.18] },
    )

    targets.forEach(([element]) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let scrollFrame = null

    const updateStoryPhase = () => {
      const about = aboutRef.current
      if (!about) return

      const aboutTop = about.getBoundingClientRect().top + window.scrollY
      const start = aboutTop + window.innerWidth * 1.18
      const distance = window.innerWidth * 1.48
      const progress = (window.scrollY - start) / distance
      const clampedProgress = Math.min(Math.max(progress, 0), 1)

      let nextPhase = 'after'
      if (progress < 0) nextPhase = 'before'
      else if (progress < 0.7) nextPhase = 'first'
      else if (progress < 1) nextPhase = 'second'

      if (
        nextPhase === 'first' &&
        previousStoryPhaseRef.current === 'before'
      ) {
        setStoryCycle((cycle) => cycle + 1)
      }

      previousStoryPhaseRef.current = nextPhase
      setStoryPhase(nextPhase)
      setStoryProgress(clampedProgress)

      scrollFrame = null
    }

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateStoryPhase)
    }

    updateStoryPhase()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (scrollFrame) cancelAnimationFrame(scrollFrame)
    }
  }, [])

  return (
    <section ref={aboutRef} className={styles.about} aria-label="일광전구 브랜드 소개">
      <header className={styles.header}>
        <img className={styles.logo} src={logoIlkw} alt="ILKW." />
        <button className={styles.menu} type="button">
          → Menu
        </button>
      </header>

      <div className={styles.introAtmosphere} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <AboutIntroParticles key={introCycle} onComplete={handleIntroComplete} />
      <div
        ref={legacyRef}
        className={`${styles.legacy} ${legacyRevealed ? styles.legacyRevealed : ''}`}
      >
        <div className={styles.legacyCopy}>
          <h2 className="fs-title-2">
            <span>A Legacy of </span>
            <em>Light</em>
          </h2>
          <p className="fs-sub-1">
            백열전구가 일상을 밝히던 시절부터 오늘에 이르기까지,
            <br />
            일광전구는 60년 동안 사람들의 일상에 빛을 더해왔습니다.
          </p>
        </div>

        <div className={styles.legacyGallery}>
          <video
            src={bulbVideo}
            poster={bulbImage}
            autoPlay
            muted
            loop
            playsInline
            aria-label="어두운 공간에서 은은하게 깜빡이는 백열전구"
          />
          <video
            src={tableLampVideo}
            poster={tableLampImage}
            autoPlay
            muted
            loop
            playsInline
            aria-label="사람의 잔상이 스쳐 지나가는 조명 공간"
          />
        </div>
      </div>

      <div
        key={storyCycle}
        style={{
          '--story-media-mask': `${
            (1 - Math.min(Math.max((storyProgress - 0.52) / 0.18, 0), 1)) * 50
          }%`,
          '--story-media-brightness':
            0.18 + Math.min(Math.max((storyProgress - 0.52) / 0.18, 0), 1) * 0.72,
          '--story-media-scale':
            1.06 - Math.min(Math.max((storyProgress - 0.52) / 0.18, 0), 1) * 0.06,
        }}
        className={`${styles.story} fs-title-3 ${
          storyPhase === 'first' || storyPhase === 'second' ? styles.storyRevealed : ''
        } ${
          storyPhase === 'first' || storyPhase === 'second' ? styles.storyPinned : ''
        } ${storyPhase === 'second' || storyPhase === 'after' ? styles.storyPhaseTwo : ''} ${
          storyPhase === 'after' ? styles.storyPassed : ''
        }`}
      >
        <p className={styles.storyLead}>
          <StoryTypedLines
            lines={[
              'From the days',
              'when incandescent bulbs lit',
              'everyday life to the present day,',
            ]}
            progress={Math.min(storyProgress / 0.48, 1)}
            totalWords={24}
          />
        </p>

        <video
          className={styles.storyMedia}
          src={ABOUT_STORY_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          aria-label="ILKW 브랜드 영상"
        />

        <p className={`${styles.storyClosing} ${styles.storyClosingYears}`}>
          <StoryTypedLines
            lines={['for over 60 years,']}
            progress={Math.min(storyProgress / 0.48, 1)}
            startIndex={13}
            totalWords={24}
          />
        </p>

        <p className={`${styles.storyClosing} ${styles.storyClosingStatement}`}>
          <StoryTypedLines
            lines={['ILKWANG has brought light', 'into people’s lives.']}
            progress={Math.min(storyProgress / 0.48, 1)}
            startIndex={17}
            totalWords={24}
            strongFirst
          />
        </p>

        <div className={styles.storySecond}>
          <p className={styles.storyLead}>
            <StoryTypedLines
              lines={['Decades of technology', 'and a philosophy', 'shaped over time.']}
              progress={Math.min(Math.max((storyProgress - 0.7) / 0.29, 0), 1)}
              totalWords={25}
            />
          </p>

          <p className={`${styles.storyClosing} ${styles.storyClosingYears}`}>
            <StoryTypedLines
              lines={['Beyond a single', 'source of light,']}
              progress={Math.min(Math.max((storyProgress - 0.7) / 0.29, 0), 1)}
              startIndex={9}
              totalWords={25}
            />
          </p>

          <p className={`${styles.storyClosing} ${styles.storyClosingStatement}`}>
            <StoryTypedLines
              lines={['we continue to understand people', 'and the spaces they inhabit.']}
              progress={Math.min(Math.max((storyProgress - 0.7) / 0.29, 0), 1)}
              startIndex={15}
              totalWords={25}
            />
          </p>
        </div>
      </div>

      <div
        ref={endingRef}
        className={`${styles.ending} ${endingRevealed ? styles.endingRevealed : ''}`}
      >
        <p className={`${styles.tagline} fs-title-4`}>
          Better <em>Life,</em> Better <em>Light,</em>
        </p>
      </div>
    </section>
  )
}

export default AboutSection
