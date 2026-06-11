import { useEffect, useRef, useState } from 'react'
import styles from './SpacesSection.module.css'

import livingRoom from '../../assets/spaces/living-room.png'
import bedRoom from '../../assets/spaces/bed-room.png'
import cafeStudio from '../../assets/spaces/cafe-studio.jpg'

const spaces = [
  {
    title: 'Living Room',
    image: livingRoom,
    alt: '따뜻한 빛이 드는 거실 벤치와 펜던트 조명',
    caption: (
      <>
        가족들이 모이고 시간이 쌓이는 곳.
        <br />
        일광전구는 그 순간을 더욱 특별하게 만듭니다.
      </>
    ),
  },
  {
    title: 'Bed Room',
    image: bedRoom,
    alt: '은은한 벽 조명이 켜진 침실',
    caption: (
      <>
        하루의 긴 여정을 마무리하는 시간.
        <br />
        편안한 빛은 깊은 휴식으로 이어집니다.
      </>
    ),
  },
  {
    title: 'Dining Room',
    image: cafeStudio,
    alt: '창가 테이블 위에 놓인 일광전구 테이블 조명',
    caption: (
      <>
        매일의 식사가 더욱 따뜻해지도록.
        <br />
        식탁 위의 분위기를 완성합니다.
      </>
    ),
  },
]

const clamp = (value, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max)

const easeInOutCubic = (value) =>
  value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2

const TITLE_TRAVEL = 150
const LIVING_TO_BED = { start: 0.28, end: 0.58 }
const BED_TO_DINING = { start: 0.68, end: 0.98 }
const SCENE_ANCHORS = [0, LIVING_TO_BED.end, BED_TO_DINING.end]
const MAGNET_ANCHORS = SCENE_ANCHORS
const MAGNET_DURATION = 620
const AUTO_TRANSITION_DURATION = 1280

const getRangeProgress = (value, start, end) =>
  easeInOutCubic(clamp((value - start) / (end - start)))

function SpacesSection() {
  const transitionRef = useRef(null)
  const magnetFrameRef = useRef(null)
  const magnetTimerRef = useRef(null)
  const magnetingRef = useRef(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const section = transitionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const scrollableDistance = section.offsetHeight - window.innerHeight
      if (scrollableDistance <= 0) {
        setProgress(0)
        return
      }

      setProgress(clamp(-rect.top / scrollableDistance))
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  useEffect(() => {
    const getTransitionMetrics = () => {
      const section = transitionRef.current
      if (!section) return null

      const top = section.getBoundingClientRect().top + window.scrollY
      const distance = section.offsetHeight - window.innerHeight
      if (distance <= 0) return null

      return { distance, top }
    }

    const animateTo = (targetTop, duration = MAGNET_DURATION) => {
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      window.clearTimeout(magnetTimerRef.current)
      window.cancelAnimationFrame(magnetFrameRef.current)
      if (reduceMotion) {
        window.scrollTo({ top: targetTop, behavior: 'auto' })
        return
      }

      const startTop = window.scrollY
      const distance = targetTop - startTop
      const startedAt = performance.now()
      magnetingRef.current = true

      const animate = (time) => {
        const localProgress = clamp((time - startedAt) / duration)
        window.scrollTo({
          top: startTop + distance * easeInOutCubic(localProgress),
          behavior: 'auto',
        })

        if (localProgress < 1) {
          magnetFrameRef.current = window.requestAnimationFrame(animate)
          return
        }

        window.scrollTo({ top: targetTop, behavior: 'auto' })
        magnetingRef.current = false
      }

      magnetFrameRef.current = window.requestAnimationFrame(animate)
    }

    const getNextAnchor = (currentProgress, direction) => {
      const margin = 0.015

      if (direction > 0) {
        return SCENE_ANCHORS.find((anchor) => anchor > currentProgress + margin)
      }

      return [...SCENE_ANCHORS]
        .reverse()
        .find((anchor) => anchor < currentProgress - margin)
    }

    const applyMagnet = () => {
      if (magnetingRef.current) return

      const metrics = getTransitionMetrics()
      if (!metrics) return

      const currentProgress = clamp(
        (window.scrollY - metrics.top) / metrics.distance,
      )

      // 🚪 출구: 마지막 장면(다이닝, BED_TO_DINING.end=0.98) 지나면 마그넷 해제
      //  → Collabo로 자연스럽게 빠져나감. (스냅 연출은 그대로)
      //  이게 없으면 진행도가 0~1로 clamp돼서 섹션 끝/Collabo에서도 "0.98이 제일 가깝다"고
      //  판단해 도로 끌어올림 = space로 튕겨 Collabo 진입 불가였음.
      if (currentProgress >= BED_TO_DINING.end) return

      const nearestAnchor = MAGNET_ANCHORS.reduce((closest, anchor) =>
        Math.abs(anchor - currentProgress) <
        Math.abs(closest - currentProgress)
          ? anchor
          : closest,
      )
      const distanceToAnchor = Math.abs(nearestAnchor - currentProgress)

      if (distanceToAnchor < 0.004) return

      animateTo(metrics.top + metrics.distance * nearestAnchor)
    }

    const handleWheel = (event) => {
      const direction = Math.sign(event.deltaY)
      if (!direction || Math.abs(event.deltaY) < 1) return

      const metrics = getTransitionMetrics()
      if (!metrics) return

      const currentProgress = clamp(
        (window.scrollY - metrics.top) / metrics.distance,
      )
      const isInsideTransition =
        window.scrollY >= metrics.top - 2 &&
        window.scrollY <= metrics.top + metrics.distance + 2

      if (!isInsideTransition) return

      const targetAnchor = getNextAnchor(currentProgress, direction)
      if (targetAnchor === undefined) return

      event.preventDefault()
      if (magnetingRef.current) return

      animateTo(
        metrics.top + metrics.distance * targetAnchor,
        AUTO_TRANSITION_DURATION,
      )
    }

    const handleScroll = () => {
      window.clearTimeout(magnetTimerRef.current)
      magnetTimerRef.current = window.setTimeout(applyMagnet, 180)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('scroll', handleScroll)
      window.clearTimeout(magnetTimerRef.current)
      window.cancelAnimationFrame(magnetFrameRef.current)
    }
  }, [])

  const livingToBedProgress = getRangeProgress(
    progress,
    LIVING_TO_BED.start,
    LIVING_TO_BED.end,
  )
  const bedToDiningProgress = getRangeProgress(
    progress,
    BED_TO_DINING.start,
    BED_TO_DINING.end,
  )
  const activeImageIndex =
    bedToDiningProgress > 0.5 ? 2 : livingToBedProgress > 0.5 ? 1 : 0

  const getTitleStyle = (index) => {
    if (index === 0) {
      return {
        opacity: 1 - livingToBedProgress,
        transform: `translateY(${livingToBedProgress * TITLE_TRAVEL}px)`,
      }
    }

    if (index === 1) {
      const enteringFromLiving = (livingToBedProgress - 1) * TITLE_TRAVEL
      const leavingToDining = bedToDiningProgress * TITLE_TRAVEL

      return {
        opacity: Math.min(
          livingToBedProgress,
          1 - bedToDiningProgress,
        ),
        transform: `translateY(${
          bedToDiningProgress > 0 ? leavingToDining : enteringFromLiving
        }px)`,
      }
    }

    return {
      opacity: bedToDiningProgress,
      transform: `translateY(${(bedToDiningProgress - 1) * TITLE_TRAVEL}px)`,
    }
  }

  const getImageStyle = (index) => {
    if (index === 0) return { transform: 'translateY(0)' }

    const imageProgress = index === 1
      ? livingToBedProgress
      : bedToDiningProgress

    return {
      transform: `translateY(${(1 - imageProgress) * 100}%)`,
    }
  }

  return (
    <section className={styles.spaces} aria-label="공간 큐레이션">
      <div className={styles.inner}>
        <article className={styles.introPanel} aria-label="Spaces introduction">
          <div className={styles.introCopy}>
            <h2 className={styles.introTitle}>
              <span className={styles.spaceWord}>SPACE</span>
              <span>,</span>
              <br />
              <em>defined by</em>
              <span className={styles.ilkwWord}> ILKW.</span>
            </h2>
            <p className={styles.introDescription}>
              거실부터 침실, 다이닝룸까지.
              <br />
              공간에 맞는 일광전구의 역할을 제안합니다.
            </p>
          </div>
        </article>

        <div className={styles.transitionSection} ref={transitionRef}>
          <article className={styles.transitionStage}>
            <div className={styles.titleSlot} aria-live="polite">
              {spaces.map((space, index) => (
                <h2
                  className={styles.title}
                  key={space.title}
                  style={getTitleStyle(index)}
                >
                  {space.title}
                </h2>
              ))}
            </div>

            <div className={styles.imageFrame}>
              {spaces.map((space, index) => (
                <div
                  className={styles.imageLayer}
                  key={space.title}
                  style={getImageStyle(index)}
                >
                  <img
                    className={styles.image}
                    src={space.image}
                    alt={space.alt}
                    aria-hidden={index !== activeImageIndex}
                  />
                  {space.caption ? (
                    <p className={styles.imageCaption}>
                      {space.caption}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default SpacesSection
