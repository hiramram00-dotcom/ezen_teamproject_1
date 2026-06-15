import { useEffect, useRef, useState } from 'react'
import styles from './AboutSection.module.css'

import logoIlkw from '../../assets/ilkw-logo-header.svg'
import bulbImage from './assets/about-bulb.webp'
import tableLampImage from './assets/about-table-lamp.webp'
import livingRoomImage from './assets/about-living-room.webp'
import cafeImage from '../../assets/spaces/cafe-studio.jpg'

function AboutSection() {
  const legacyLightRef = useRef(null)
  const storyLightRef = useRef(null)
  const aboutRef = useRef(null)
  const countFrameRef = useRef(null)
  const countTimerRef = useRef(null)
  const lightTimerRef = useRef(null)
  const legacyScrollStartRef = useRef(0)
  const [lightVisible, setLightVisible] = useState(false)
  const [lightArrived, setLightArrived] = useState(false)
  const [originMoving, setOriginMoving] = useState(false)
  const [year, setYear] = useState(null)
  const [yearRevealed, setYearRevealed] = useState(false)
  const [legacyRevealed, setLegacyRevealed] = useState(false)
  const [storyRevealed, setStoryRevealed] = useState(false)
  const [storyPhase, setStoryPhase] = useState('before')

  useEffect(() => {
    lightTimerRef.current = window.setTimeout(() => setLightVisible(true), 700)
    const originTimer = window.setTimeout(() => setOriginMoving(true), 1550)
    const arriveTimer = window.setTimeout(() => setLightArrived(true), 2300)

    return () => {
      if (lightTimerRef.current) window.clearTimeout(lightTimerRef.current)
      window.clearTimeout(originTimer)
      window.clearTimeout(arriveTimer)
      if (countTimerRef.current) window.clearTimeout(countTimerRef.current)
      if (countFrameRef.current) cancelAnimationFrame(countFrameRef.current)
    }
  }, [])

  useEffect(() => {
    if (!lightArrived || year !== null) return

    countTimerRef.current = window.setTimeout(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setYear(1962)
        setYearRevealed(true)
        return
      }

      const startTime = performance.now()
      const duration = 1350

      const count = (now) => {
        const progress = Math.min((now - startTime) / duration, 1)
        setYear(1900 + Math.floor(progress * 62))

        if (progress < 1) {
          countFrameRef.current = requestAnimationFrame(count)
        } else {
          setYear(1962)
          setYearRevealed(true)
          countFrameRef.current = null
        }
      }

      countFrameRef.current = requestAnimationFrame(count)
      countTimerRef.current = null
    }, 180)

    return () => {
      if (countTimerRef.current) window.clearTimeout(countTimerRef.current)
    }
  }, [lightArrived, year])

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

      <div className={`${styles.origin} ${originMoving ? styles.originRaised : ''}`}>
        <p className={styles.originLabel}>Since</p>
      </div>

      <div className={styles.since}>
        <strong
          className={`${styles.year} ${year !== null ? styles.yearCounting : ''} ${
            yearRevealed ? styles.yearRevealed : ''
          }`}
          aria-live="polite"
        >
          {year ?? '1962'}
        </strong>
      </div>

      <div
        className={`${styles.yearLight} ${lightVisible && year === null ? styles.lightVisible : ''} ${
          year !== null ? styles.lightHidden : ''
        }`}
        aria-hidden="true"
      >
        <span className={styles.glowDot} aria-hidden="true" />
      </div>

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
