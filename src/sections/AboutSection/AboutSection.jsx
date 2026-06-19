import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './AboutSection.module.css'

import logoIlkw from '../../assets/ilkw-logo-header.svg'
import bulbImage from './assets/about-bulb.webp'
import tableLampImage from './assets/about-table-lamp.webp'
import livingRoomImage from './assets/about-living-room.webp'
import cafeImage from '../../assets/spaces/cafe-studio.jpg'

const INTRO_PARTICLE_COUNT = 900
const INTRO_PARTICLE_COUNT_MOBILE = 520
const INTRO_DURATION = 6800
const INTRO_HOLD = 1300 / INTRO_DURATION
const INTRO_FRAME_INTERVAL = 1000 / 45
const INTRO_MAX_PIXEL_RATIO = 1.5

function easeInOutCubic(value) {
  return value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2
}

function sampleIntroTextPoints(width, height, particleCount) {
  const mask = document.createElement('canvas')
  const maskContext = mask.getContext('2d', { willReadFrequently: true })
  const centerX = width / 2
  const centerY = height / 2
  const sinceSize = width * 0.058
  const yearSize = width * 0.094
  const textCenterY = centerY - width * 0.01
  const maskWidth = Math.ceil(width * 0.3)
  const maskHeight = Math.ceil(width * 0.2)
  const maskLeft = centerX - maskWidth / 2
  const maskTop = textCenterY - maskHeight / 2
  const step = Math.max(3, Math.round(width / 420))

  mask.width = maskWidth
  mask.height = maskHeight
  maskContext.fillStyle = '#fff'
  maskContext.textAlign = 'center'
  maskContext.textBaseline = 'middle'
  maskContext.font = `italic ${sinceSize}px Georgia, serif`
  maskContext.fillText('Since', maskWidth / 2, maskHeight / 2 - yearSize * 0.42)
  maskContext.font = `600 ${yearSize}px Arial, sans-serif`
  maskContext.fillText('1962', maskWidth / 2, maskHeight / 2 + sinceSize * 0.62)

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
    let startTime = null
    let lastFrameTime = 0
    let particles = []
    let completed = false
    let renderRatio = 1

    const buildParticles = () => {
      renderRatio = Math.min(window.devicePixelRatio || 1, INTRO_MAX_PIXEL_RATIO)
      const width = window.innerWidth
      const height = Math.max(window.innerHeight, width * 0.5625)
      const centerX = width / 2
      const centerY = height / 2
      const ringRadius = Math.min(width, height) * 0.31
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
      if (!startTime) startTime = now
      const elapsed = now - startTime
      const progress = Math.min(elapsed / INTRO_DURATION, 1)
      const gather = easeInOutCubic(Math.min(Math.max((progress - INTRO_HOLD) / 0.34, 0), 1))
      const write = easeInOutCubic(Math.min(Math.max((progress - INTRO_HOLD - 0.24) / 0.36, 0), 1))
      const width = canvas.width / renderRatio
      const height = canvas.height / renderRatio
      const centerX = width / 2
      const centerY = height / 2
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
        const lineFade = 1 - write * 0.72
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
          const pointAlpha = Math.min(0.96, (gather - 0.52) * 2.4)
          context.beginPath()
          context.fillStyle = `rgba(255, 252, 246, ${pointAlpha})`
          context.arc(particle.x, particle.y, Math.max(0.65, particle.size * 0.72), 0, Math.PI * 2)
          context.fill()
        }
      })

      if (write > 0.78) {
        const solidTextOpacity = (write - 0.78) / 0.22
        const sinceSize = width * 0.058
        const yearSize = width * 0.094
        const textCenterY = centerY - width * 0.01

        context.save()
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillStyle = `rgba(255, 255, 255, ${solidTextOpacity})`
        context.font = `italic ${sinceSize}px Georgia, serif`
        context.fillText('Since', centerX, textCenterY - yearSize * 0.42)
        context.font = `600 ${yearSize}px Arial, sans-serif`
        context.fillText('1962', centerX, textCenterY + sinceSize * 0.62)
        context.restore()
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(draw)
      } else if (!completed) {
        completed = true
        onComplete()
      }
    }

    buildParticles()
    animationFrame = requestAnimationFrame(draw)
    window.addEventListener('resize', buildParticles)

    return () => {
      window.removeEventListener('resize', buildParticles)
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [onComplete])

  return <canvas className={styles.introParticles} ref={canvasRef} aria-hidden="true" />
}

function AboutSection() {
  const legacyLightRef = useRef(null)
  const storyLightRef = useRef(null)
  const aboutRef = useRef(null)
  const legacyScrollStartRef = useRef(0)
  const [yearRevealed, setYearRevealed] = useState(false)
  const [legacyRevealed, setLegacyRevealed] = useState(false)
  const [storyRevealed, setStoryRevealed] = useState(false)
  const [storyPhase, setStoryPhase] = useState('before')

  const handleIntroComplete = useCallback(() => {
    setYearRevealed(true)
  }, [])

  useEffect(() => {
    if (!yearRevealed) return

    legacyScrollStartRef.current = window.scrollY
    let scrollFrame = null

    const updateLegacyLight = () => {
      const light = legacyLightRef.current
      if (!light) return

      const distance = window.innerWidth * 0.42
      const progress = Math.min(
        Math.max((window.scrollY - legacyScrollStartRef.current) / distance, 0),
        1,
      )
      const curveX =
        Math.sin(progress * Math.PI * 2.4) * (1 - progress) * 5.5 + progress * 18

      light.style.opacity = progress > 0 && progress < 0.98 ? '0.85' : '0'
      light.style.transform = `translate(calc(-50% + ${curveX}vw), calc(-50% + ${
        progress * 41
      }vw)) scale(${0.65 + progress * 0.7})`

      if (progress >= 0.98) setLegacyRevealed(true)
      scrollFrame = null
    }

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateLegacyLight)
    }

    updateLegacyLight()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (scrollFrame) cancelAnimationFrame(scrollFrame)
    }
  }, [yearRevealed])

  useEffect(() => {
    if (!legacyRevealed) return

    let scrollFrame = null

    const updateStoryLight = () => {
      const light = storyLightRef.current
      if (!light) return

      const start = window.innerWidth * 0.62
      const distance = window.innerWidth * 0.82
      const progress = Math.min(Math.max((window.scrollY - start) / distance, 0), 1)
      const curveX = Math.sin(progress * Math.PI * 2.1) * (1 - progress) * 8

      light.style.opacity = progress > 0 && progress < 0.98 ? '0.82' : '0'
      light.style.transform = `translate(calc(-50% + ${curveX}vw), calc(-50% + ${
        progress * 105
      }vw)) scale(${0.62 + progress * 0.65})`

      if (progress >= 0.98) setStoryRevealed(true)
      scrollFrame = null
    }

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateStoryLight)
    }

    updateStoryLight()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (scrollFrame) cancelAnimationFrame(scrollFrame)
    }
  }, [legacyRevealed])

  useEffect(() => {
    let scrollFrame = null

    const updateStoryPhase = () => {
      const about = aboutRef.current
      if (!about) return

      const aboutTop = about.getBoundingClientRect().top + window.scrollY
      const start = aboutTop + window.innerWidth * 1.55
      const distance = window.innerWidth * 0.56
      const progress = (window.scrollY - start) / distance

      if (progress < 0) setStoryPhase('before')
      else if (progress < 0.5) setStoryPhase('first')
      else if (progress < 1) setStoryPhase('second')
      else setStoryPhase('after')

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

      <AboutIntroParticles onComplete={handleIntroComplete} />

      <div
        ref={legacyLightRef}
        className={`${styles.legacyTravelLight} ${styles.legacyLightMoving} ${
          legacyRevealed ? styles.legacyLightArrived : ''
        }`}
        aria-hidden="true"
      >
        <span className={styles.glowDot} />
      </div>

      <div className={`${styles.legacy} ${legacyRevealed ? styles.legacyRevealed : ''}`}>
        <span className={styles.arrivalFlash} aria-hidden="true" />

        <div className={styles.legacyCopy}>
          <h2>A Legacy of Light</h2>
          <p>
            백열전구가 일상을 밝히던 시절부터 오늘에 이르기까지,
            <br />
            일광전구는 60년 동안 사람들의 일상에 빛을 더해왔습니다.
          </p>
        </div>

        <div className={styles.legacyGallery}>
          <img src={bulbImage} alt="어두운 공간을 밝히는 백열전구" />
          <img src={tableLampImage} alt="테이블 위 작은 조명" />
        </div>
      </div>

      <div
        ref={storyLightRef}
        className={`${styles.storyTravelLight} ${storyRevealed ? styles.storyLightArrived : ''}`}
        aria-hidden="true"
      >
        <span className={styles.glowDot} />
      </div>

      <div
        className={`${styles.story} ${storyRevealed ? styles.storyRevealed : ''} ${
          storyPhase === 'first' || storyPhase === 'second' ? styles.storyPinned : ''
        } ${storyPhase === 'second' ? styles.storyPhaseTwo : ''} ${
          storyPhase === 'after' ? styles.storyPassed : ''
        }`}
      >
        <span className={styles.storyArrivalFlash} aria-hidden="true" />

        <p className={styles.storyLead}>
          From the days
          <br />
          when incandescent bulbs lit
          <br />
          everyday life to the present
          <br />
          day,
        </p>

        <img
          className={styles.storyImage}
          src={livingRoomImage}
          alt="일광전구의 빛으로 채워진 거실"
        />

        <p className={styles.storyClosing}>
          <span className={`${styles.storyClosingLine} ${styles.storyClosingLineFirst}`}>
            for over 60 years,
          </span>
          <span className={styles.storyClosingLine}>
            <strong>ILKWANG</strong> has brought light
          </span>
          <span className={styles.storyClosingLine}>into people’s lives.</span>
        </p>

        <div className={styles.storySecond}>
          <p className={styles.storyLead}>
            Decades of technology
            <br />
            and a philosophy
            <br />
            shaped over time.
          </p>

          <img className={styles.storyImage} src={cafeImage} alt="" />

          <p className={styles.storyClosing}>
            <span className={`${styles.storyClosingLine} ${styles.storyClosingLineFirst}`}>
              Beyond a single
            </span>
            <span className={styles.storyClosingLine}>source of light,</span>
            <span className={styles.storyClosingLine}>we continue to understand people</span>
            <span className={styles.storyClosingLine}>and the spaces they inhabit.</span>
          </p>
        </div>
      </div>

      <div className={styles.videoPlaceholder} role="img" aria-label="브랜드 영상 미리보기">
        <img src={bulbImage} alt="" />
      </div>

      <div className={styles.ending}>
        <p className={styles.tagline}>
          Better <em>Life,</em> Better <em>Light,</em>
        </p>
      </div>
    </section>
  )
}

export default AboutSection
