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

const getAboutLayoutWidth = () => Math.min(window.innerWidth, 1920)
const ABOUT_STORY_VIDEO =
  'https://res.cloudinary.com/dg9hg29hc/video/upload/ADORABLE_ANYWHERE_DUMBO13_-_YouTube_-_Chrome_2026-06-22_11-23-20_zhldeh.mp4'

function easeInOutCubic(value) {
  return value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getFontSizeToken(tokenName, fallback) {
  const tokenValue = getComputedStyle(document.documentElement).getPropertyValue(tokenName)
  return Number.parseFloat(tokenValue) || fallback
}

function StoryTypedLines({
  lines,
  progress,
  startIndex = 0,
  totalWords,
  strongFirst = false,
  strongWords = [],
}) {
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
              {(strongFirst && currentIndex === startIndex) || strongWords.includes(word) ? (
                <span className={styles.storyTypedAccent}>{word}</span>
              ) : (
                word
              )}
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
  const [endingProgress, setEndingProgress] = useState(0)
  const [endingPhase, setEndingPhase] = useState('before')
  const [glowProgress, setGlowProgress] = useState(0)
  const [endingOverlayOpacity, setEndingOverlayOpacity] = useState(0)
  const [historyOverlayProgress, setHistoryOverlayProgress] = useState(0)

  const handleIntroComplete = useCallback(() => {}, [])

  useEffect(() => {
    const legacy = legacyRef.current
    if (!legacy) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 단방향 latch: 한 번 보이면 reveal 유지(다시 false로 안 내림).
        // 예전엔 isIntersecting을 그대로 넣어, 큰 화면서 .legacy가 observer 범위를
        // 벗어나는 순간 legacyRevealed=false → .legacyCopy opacity:0 으로 사라졌다.
        if (entry.isIntersecting) {
          setLegacyRevealed(true)
          observer.disconnect()
        }
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
    let scrollFrame = null

    const updateStoryPhase = () => {
      const about = aboutRef.current
      if (!about) return

      const aboutTop = about.getBoundingClientRect().top + window.scrollY
      const layoutWidth = getAboutLayoutWidth()
      const start = aboutTop + layoutWidth * 1.18
      const distance = layoutWidth * 3.05
      const progress = (window.scrollY - start) / distance
      const clampedProgress = Math.min(Math.max(progress, 0), 1.3)

      let nextPhase = 'after'
      if (progress < 0) nextPhase = 'before'
      else if (progress < 0.86) nextPhase = 'first'
      else if (progress < 1.3) nextPhase = 'second'

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

  // 태그라인이 다 떠오르는 시점부터 일정 거리만큼 .ending을 화면에 고정(position:fixed)해
  // 두고, 그동안 빛이 점처럼 나타나 커진 뒤 페이드되며 History로 넘어간다.
  // 고정해두는 만큼 .about의 전체 높이도 늘려줘야 실제로 그만큼 스크롤할 거리가 생긴다.
  const PIN_DISTANCE_RATIO = 2.2 // 뷰포트 높이의 220%만큼 고정 구간
  const HOLD_FRAC = 0.25 // 고정 구간의 앞 25% — 빛 없이 정지
  const GROW_END_FRAC = 0.86 // 25~86% — 빛이 점에서 천천히 커짐
  // 75~100% — 전체가 서서히 사라지며 History로 핸드오프

  useEffect(() => {
    const about = aboutRef.current
    if (!about) return undefined

    const applyHeight = () => {
      const bufferPx = window.innerHeight * PIN_DISTANCE_RATIO
      about.style.height = `calc(660.75 * var(--about-vw) + ${bufferPx}px)`
    }

    applyHeight()
    window.addEventListener('resize', applyHeight)
    return () => window.removeEventListener('resize', applyHeight)
  }, [])

  useEffect(() => {
    const updateEndingProgress = () => {
      const about = aboutRef.current
      if (!about) return

      const aboutTop = about.getBoundingClientRect().top + window.scrollY
      const vwPx = (v) => (v / 100) * getAboutLayoutWidth()
      const bufferPx = window.innerHeight * PIN_DISTANCE_RATIO
      const pinStartPx = aboutTop + vwPx(570.75) + window.innerHeight * 0.18
      // .about의 실제 끝(= History 시작 지점)에 핀이 정확히 끝나도록 맞춰서
      // 핀 해제 후 빈 검정 구간이 남지 않게 한다
      const pinEndPx = aboutTop + vwPx(660.75) + bufferPx
      const pinDistancePx = pinEndPx - pinStartPx
      const scrollY = window.scrollY

      if (scrollY < pinStartPx) {
        // 아직 고정 전 — 일반 스크롤 흐름에서 태그라인이 떠오르는 중
        const ending = endingRef.current
        const rect = ending ? ending.getBoundingClientRect() : null
        const progress = rect
          ? clamp((window.innerHeight * 0.82 - rect.top) / (window.innerHeight * 0.95), 0, 1)
          : 0
        setEndingProgress(progress)
        setEndingPhase('before')
        setGlowProgress(0)
        setEndingOverlayOpacity(0)
        setHistoryOverlayProgress(0)
      } else if (scrollY <= pinEndPx) {
        const pinProgress = clamp((scrollY - pinStartPx) / pinDistancePx, 0, 1)
        const grow = clamp((pinProgress - HOLD_FRAC) / (GROW_END_FRAC - HOLD_FRAC), 0, 1)
        // 빛이 다 커진 뒤(GROW_END_FRAC~1)에는 배경 자체가 검정에서 크림색으로 바뀐다
        const toCream = clamp((pinProgress - GROW_END_FRAC) / (1 - GROW_END_FRAC), 0, 1)
        setEndingProgress(1)
        setEndingPhase('pinned')
        setGlowProgress(grow)
        setEndingOverlayOpacity(toCream)
        setHistoryOverlayProgress(clamp((toCream - 0.16) / 0.84, 0, 1))
      } else {
        const afterProgress = clamp(
          (scrollY - pinEndPx - window.innerHeight * 0.45) / (window.innerHeight * 0.45),
          0,
          1,
        )
        setEndingProgress(1)
        setEndingPhase('after')
        setGlowProgress(1)
        setEndingOverlayOpacity(1)
        setHistoryOverlayProgress(1 - afterProgress)
      }
    }

    updateEndingProgress()
    window.addEventListener('scroll', updateEndingProgress, { passive: true })
    window.addEventListener('resize', updateEndingProgress)

    return () => {
      window.removeEventListener('scroll', updateEndingProgress)
      window.removeEventListener('resize', updateEndingProgress)
    }
  }, [])

  const firstTaglineProgress = easeInOutCubic(clamp(endingProgress / 0.48, 0, 1))
  const secondTaglineProgress = easeInOutCubic(clamp((endingProgress - 0.52) / 0.48, 0, 1))
  const endingContentFade = easeInOutCubic(clamp((glowProgress - 0.18) / 0.42, 0, 1))
  const getTaglinePhraseStyle = (progress) => ({
    opacity: progress * (1 - endingContentFade),
    filter: `blur(${(1 - progress) * 0.65}vw) brightness(${0.24 + progress * 0.76})`,
    transform: `translateY(${(1 - progress) * 4.6}vw)`,
  })
  // 빛은 고정 구간의 hold가 끝난 뒤부터 점처럼 나타나 점점 커진다
  const endingGlowFade = easeInOutCubic(clamp((endingOverlayOpacity - 0.62) / 0.38, 0, 1))
  const endingGlowScale = 0.04 + glowProgress * 4.6
  const endingGlowOpacity = clamp(glowProgress / 0.15, 0, 1) * (1 - endingGlowFade)
  const endingHistoryTitleProgress = easeInOutCubic(historyOverlayProgress)
  const historyScreenOpacity =
    endingPhase === 'pinned'
      ? easeInOutCubic(endingOverlayOpacity)
      : historyOverlayProgress > 0
        ? 1
        : 0
  // 검정(0) -> 크림(1)으로 배경색 자체를 보간 — History와 같은 색이라 핀이 풀려도 끊김이 없다
  const endingBgColor = `rgb(${255 * endingOverlayOpacity}, ${247 * endingOverlayOpacity}, ${234 * endingOverlayOpacity})`
  const storyLeadProgress = clamp(storyProgress / 0.24, 0, 1)
  const storyMediaProgress = clamp((storyProgress - 0.28) / 0.16, 0, 1)
  const storyClosingProgress = clamp((storyProgress - 0.48) / 0.26, 0, 1)
  const storySecondProgress = clamp((storyProgress - 0.86) / 0.32, 0, 1)

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

      <AboutIntroParticles key={`intro-${introCycle}`} onComplete={handleIntroComplete} />
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
        key={`story-${storyCycle}`}
        style={{
          '--story-media-mask': `${(1 - storyMediaProgress) * 50}%`,
          '--story-media-brightness': 0.18 + storyMediaProgress * 0.72,
          '--story-media-scale': 1.06 - storyMediaProgress * 0.06,
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
            lines={['From the days', 'when incandescent bulbs lit']}
            progress={storyLeadProgress}
            totalWords={13}
            strongWords={['incandescent']}
          />
        </p>

        <p className={styles.storyLeadSide}>
          <StoryTypedLines
            lines={['everyday', 'life to -']}
            progress={storyLeadProgress}
            startIndex={8}
            totalWords={14}
          />
        </p>

        <p className={styles.storyLeadTail}>
          <StoryTypedLines
            lines={['the present day,']}
            progress={storyLeadProgress}
            startIndex={11}
            totalWords={14}
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
            progress={storyClosingProgress}
            totalWords={11}
          />
        </p>

        <p className={`${styles.storyClosing} ${styles.storyClosingStatement}`}>
          <StoryTypedLines
            lines={['ILKWANG has brought light', 'into people’s lives.']}
            progress={storyClosingProgress}
            startIndex={4}
            totalWords={11}
            strongFirst
          />
        </p>

        <div className={styles.storySecond}>
          <p className={styles.storyLead}>
            <StoryTypedLines
              lines={['Decades of technology', 'and a philosophy shaped', 'over time.']}
              progress={storySecondProgress}
              totalWords={25}
              strongWords={['technology']}
            />
          </p>

          <p className={`${styles.storyClosing} ${styles.storyClosingYears}`}>
            <StoryTypedLines
              lines={['Beyond a single', 'source of light,']}
              progress={storySecondProgress}
              startIndex={9}
              totalWords={25}
            />
          </p>

          <p className={`${styles.storyClosing} ${styles.storyClosingBridge}`}>
            <StoryTypedLines
              lines={['we continue to']}
              progress={storySecondProgress}
              startIndex={15}
              totalWords={25}
            />
          </p>

          <p className={`${styles.storyClosing} ${styles.storyClosingStatement}`}>
            <StoryTypedLines
              lines={['understand people and the', 'spaces they inhabit.']}
              progress={storySecondProgress}
              startIndex={18}
              totalWords={25}
              strongWords={['spaces']}
            />
          </p>
        </div>
      </div>

      <div
        ref={endingRef}
        className={`${styles.ending} ${endingPhase === 'pinned' ? styles.endingPinned : ''}`}
        style={{
          '--glow-scale': endingGlowScale,
          '--glow-opacity': endingGlowOpacity,
          backgroundColor: endingBgColor,
        }}
      >
        <div className={styles.endingGlow} aria-hidden="true" />
        <p className={`${styles.tagline} fs-title-4`}>
          <span className={styles.taglinePhrase} style={getTaglinePhraseStyle(firstTaglineProgress)}>
            Better <em>Life,</em>
          </span>
          <span className={styles.taglinePhrase} style={getTaglinePhraseStyle(secondTaglineProgress)}>
            Better <em>Light,</em>
          </span>
        </p>
      </div>
      <div
        className={styles.historyScreenOverlay}
        style={{ opacity: historyScreenOpacity }}
        aria-hidden="true"
      />
      <h2
        className={styles.historyTitleOverlay}
        style={{
          opacity: endingHistoryTitleProgress,
          filter: `blur(${(1 - endingHistoryTitleProgress) * 1.2}vw)`,
        }}
        aria-hidden="true"
      >
        <span className={styles.historyTitlePlain}>our</span>
        <em>History</em>
      </h2>
    </section>
  )
}

export default AboutSection
