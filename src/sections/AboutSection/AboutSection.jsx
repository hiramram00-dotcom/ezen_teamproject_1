import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './AboutSection.module.css'

import logoIlkw from '../../assets/ilkw-logo-header.svg'
import bulbImage from './assets/about-bulb.webp'
import tableLampImage from './assets/about-table-lamp.webp'
import livingRoomImage from './assets/about-living-room.webp'
import cafeImage from '../../assets/spaces/cafe-studio.jpg'

const INTRO_PARTICLE_COUNT = 1200
const INTRO_DURATION = 6800
const INTRO_HOLD = 0.44

function easeInOutCubic(value) {
  return value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2
}

function sampleTextPoints(width, height, layout) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const ratio = window.devicePixelRatio || 1

  canvas.width = width * ratio
  canvas.height = height * ratio
  context.scale(ratio, ratio)
  context.clearRect(0, 0, width, height)
  context.fillStyle = '#fff'
  context.textAlign = 'center'
  context.textBaseline = 'middle'

  layout.forEach((line) => {
    context.font = line.font
    context.fillText(line.text, width / 2, line.y)
  })

  const image = context.getImageData(0, 0, canvas.width, canvas.height).data
  const points = []
  const step = Math.max(3, Math.round(width / 230))

  for (let y = 0; y < canvas.height; y += step * ratio) {
    for (let x = 0; x < canvas.width; x += step * ratio) {
      const alpha = image[(y * canvas.width + x) * 4 + 3]
      if (alpha > 80) points.push({ x: x / ratio, y: y / ratio })
    }
  }

  return points
}

function AboutIntroParticles({ onComplete }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let animationFrame = null
    let startTime = null
    let particles = []
    let completed = false

    const buildParticles = () => {
      const ratio = window.devicePixelRatio || 1
      const width = window.innerWidth
      const height = Math.max(window.innerHeight, width * 0.5625)
      const centerX = width / 2
      const centerY = height / 2
      const ringRadius = Math.min(width, height) * 0.31
      const sinceSize = width * 0.058
      const yearSize = width * 0.094
      const textCenterY = centerY - width * 0.01

      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.clearRect(0, 0, width, height)

      const textPoints = sampleTextPoints(width, height, [
        {
          text: 'Since',
          font: `italic ${sinceSize}px Georgia, serif`,
          y: textCenterY - yearSize * 0.42,
        },
        {
          text: '1962',
          font: `600 ${yearSize}px Arial, sans-serif`,
          y: textCenterY + sinceSize * 0.62,
        },
      ])

      const targetPoints = Array.from({ length: INTRO_PARTICLE_COUNT }, (_, index) => {
        const point = textPoints[Math.floor((index / INTRO_PARTICLE_COUNT) * textPoints.length)]
        return point || { x: centerX, y: centerY }
      })

      particles = targetPoints.map((target) => {
        const targetAngle = Math.atan2(target.y - centerY, target.x - centerX)
        const angle = targetAngle + (Math.random() - 0.5) * 0.28
        const radius = ringRadius + (Math.random() - 0.5) * width * 0.045
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        return {
          x,
          y,
          px: x,
          py: y,
          targetX: target.x + (Math.random() - 0.5) * 1.2,
          targetY: target.y + (Math.random() - 0.5) * 1.2,
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
      if (!startTime) startTime = now
      const elapsed = now - startTime
      const progress = Math.min(elapsed / INTRO_DURATION, 1)
      const gather = easeInOutCubic(Math.min(Math.max((progress - INTRO_HOLD) / 0.34, 0), 1))
      const write = easeInOutCubic(Math.min(Math.max((progress - INTRO_HOLD - 0.24) / 0.36, 0), 1))
      const ratio = window.devicePixelRatio || 1
      const width = canvas.width / ratio
      const height = canvas.height / ratio
      const centerX = width / 2
      const centerY = height / 2
      const sinceSize = width * 0.058
      const yearSize = width * 0.094
      const textCenterY = centerY - width * 0.01

      context.globalCompositeOperation = 'source-over'
      context.clearRect(0, 0, width, height)

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
        const compactX = centerX + (particle.targetX - centerX) * 0.16
        const compactY = centerY + (particle.targetY - centerY) * 0.16
        const gatheredX = ringX + (compactX - ringX) * gather
        const gatheredY = ringY + (compactY - ringY) * gather
        const targetX = gatheredX
        const targetY = gatheredY

        particle.px = particle.x
        particle.py = particle.y
        particle.x += (targetX - particle.x) * 0.12
        particle.y += (targetY - particle.y) * 0.12

        const velocity = Math.hypot(particle.x - particle.px, particle.y - particle.py)
        const alpha = Math.min(0.78, 0.08 + velocity / 24 + gather * 0.34) * (1 - write * 0.42)
        const weight = particle.size * (0.34 + Math.min(velocity / 24, 0.55) + gather * 0.28)

        context.beginPath()
        context.strokeStyle = `rgba(247, 242, 232, ${alpha})`
        context.shadowColor = 'rgba(247, 242, 232, 0.42)'
        context.shadowBlur = 2.4 + write * 2
        context.lineWidth = weight
        context.moveTo(particle.px, particle.py)
        context.lineTo(particle.x, particle.y)
        context.stroke()
      })

      const textOpacity = write
      if (textOpacity > 0) {
        context.save()
        const revealWidth = width * 0.24 * textOpacity
        const revealHeight = width * 0.18 * textOpacity
        context.beginPath()
        context.rect(centerX - revealWidth / 2, textCenterY - revealHeight / 2, revealWidth, revealHeight)
        context.clip()
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillStyle = `rgba(255, 255, 255, ${0.92 * textOpacity})`
        context.shadowColor = `rgba(247, 242, 232, ${0.28 * textOpacity})`
        context.shadowBlur = 10 * textOpacity
        context.font = `italic ${sinceSize}px Georgia, serif`
        context.fillText('Since', centerX, textCenterY - yearSize * 0.42)
        context.shadowBlur = 5 * textOpacity
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
          for over 60 years,
          <br />
          <strong>ILKWANG</strong> has brought light
          <br />
          into people’s lives.
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
            Beyond a single
            <br />
            source of light,
            <br />
            we continue to understand people
            <br />
            and the spaces they inhabit.
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
