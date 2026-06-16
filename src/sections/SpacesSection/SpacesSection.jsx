import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import styles from './SpacesSection.module.css'

import livingRoomVideo from '../../assets/spaces/spaces-livingroom.mp4'
import bedRoomVideo from '../../assets/spaces/spaces-bedroom.mp4'
import diningRoom from '../../assets/spaces/dining-room.webp'

gsap.registerPlugin(Observer, ScrollToPlugin)

const spaces = [
  {
    title: 'Living Room',
    media: livingRoomVideo,
    mediaType: 'video',
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
    media: bedRoomVideo,
    mediaType: 'video',
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
    media: diningRoom,
    mediaType: 'image',
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
const LIVING_TO_BED = { start: 0.05, end: 0.46 }
const BED_TO_DINING = { start: 0.54, end: 0.94 }
const SCENE_ANCHORS = [0, 0.5, 0.98]
const AUTO_TRANSITION_DURATION = 1.24
const MIN_TRANSITION_DURATION = 0.62
const MAX_TRANSITION_DURATION = 1.42
const MAX_TRANSITION_TIMESCALE = 2.3
const INPUT_RELEASE_DELAY = 24
const WHEEL_THRESHOLD = 1.5
const CAPTURE_START = 0.025
const CAPTURE_END = 0.965
const REVERSE_CAPTURE_END = 0.995
const END_HANDOFF_DURATION = 96

const getRangeProgress = (value, start, end) =>
  easeInOutCubic(clamp((value - start) / (end - start)))

const getTransitionDuration = (inputDelta = 0) => {
  const intensity = clamp((Math.abs(inputDelta) - 18) / 360)

  return (
    MAX_TRANSITION_DURATION -
    (MAX_TRANSITION_DURATION - MIN_TRANSITION_DURATION) *
      easeInOutCubic(intensity)
  )
}

const getSceneProgress = (progress) => ({
  livingToBed: getRangeProgress(
    progress,
    LIVING_TO_BED.start,
    LIVING_TO_BED.end,
  ),
  bedToDining: getRangeProgress(
    progress,
    BED_TO_DINING.start,
    BED_TO_DINING.end,
  ),
})

const getTitleStyle = (index, livingToBed, bedToDining) => {
  if (index === 0) {
    return {
      opacity: 1 - livingToBed,
      transform: `translate3d(0, ${livingToBed * TITLE_TRAVEL}px, 0)`,
    }
  }

  if (index === 1) {
    const enteringFromLiving = (livingToBed - 1) * TITLE_TRAVEL
    const leavingToDining = bedToDining * TITLE_TRAVEL

    return {
      opacity: Math.min(livingToBed, 1 - bedToDining),
      transform: `translate3d(0, ${
        bedToDining > 0 ? leavingToDining : enteringFromLiving
      }px, 0)`,
    }
  }

  return {
    opacity: bedToDining,
    transform: `translate3d(0, ${(bedToDining - 1) * TITLE_TRAVEL}px, 0)`,
  }
}

const getImageStyle = (index, livingToBed, bedToDining) => {
  if (index === 0) return { transform: 'translate3d(0, 0, 0)' }

  const imageProgress = index === 1 ? livingToBed : bedToDining

  return {
    transform: `translate3d(0, ${(1 - imageProgress) * 100}%, 0)`,
  }
}

function SpacesSection() {
  const transitionRef = useRef(null)
  const titleRefs = useRef([])
  const imageLayerRefs = useRef([])
  const imageRefs = useRef([])
  const activeMediaIndexRef = useRef(-1)
  const visibleMediaSignatureRef = useRef('')
  const visualFrameRef = useRef(null)
  const observerFrameRef = useRef(null)
  const observerRef = useRef(null)
  const scrollTweenRef = useRef(null)
  const targetAnchorRef = useRef(null)
  const releaseTimerRef = useRef(null)
  const endHandoffTimerRef = useRef(null)
  const isHandingOffFromEndRef = useRef(false)
  const isAnimatingRef = useRef(false)
  const animationDirectionRef = useRef(0)
  const transitionTimeScaleRef = useRef(1)

  useEffect(() => {
    const renderProgress = () => {
      visualFrameRef.current = null
      const section = transitionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const scrollableDistance = section.offsetHeight - window.innerHeight
      const progress = scrollableDistance > 0
        ? clamp(-rect.top / scrollableDistance)
        : 0
      const { livingToBed, bedToDining } = getSceneProgress(progress)
      const activeImageIndex =
        bedToDining > 0.5 ? 2 : livingToBed > 0.5 ? 1 : 0
      const sectionIsNearViewport =
        rect.top < window.innerHeight && rect.bottom > 0
      const playableMediaIndexes = new Set()

      if (sectionIsNearViewport && livingToBed < 1) {
        playableMediaIndexes.add(0)
      }

      if (sectionIsNearViewport && livingToBed > 0) {
        playableMediaIndexes.add(1)
      }

      titleRefs.current.forEach((title, index) => {
        if (!title) return
        const titleStyle = getTitleStyle(
          index,
          livingToBed,
          bedToDining,
        )
        title.style.opacity = titleStyle.opacity
        title.style.transform = titleStyle.transform
      })

      imageLayerRefs.current.forEach((layer, index) => {
        if (!layer) return
        layer.style.transform = getImageStyle(
          index,
          livingToBed,
          bedToDining,
        ).transform
      })

      if (activeMediaIndexRef.current !== activeImageIndex) {
        activeMediaIndexRef.current = activeImageIndex

        imageRefs.current.forEach((image, index) => {
          image?.setAttribute(
            'aria-hidden',
            String(index !== activeImageIndex),
          )
        })
      }

      const visibleMediaSignature = [...playableMediaIndexes].join(',')

      if (visibleMediaSignatureRef.current !== visibleMediaSignature) {
        visibleMediaSignatureRef.current = visibleMediaSignature

        imageRefs.current.forEach((media, index) => {
          if (media?.tagName !== 'VIDEO') return

          const shouldPlay = playableMediaIndexes.has(index)

          if (shouldPlay && media.paused) {
            media.play().catch(() => undefined)
          } else if (!shouldPlay && !media.paused) {
            media.pause()
          }
        })
      }
    }

    const requestProgressRender = () => {
      if (visualFrameRef.current !== null) return
      visualFrameRef.current = window.requestAnimationFrame(renderProgress)
    }

    renderProgress()
    window.addEventListener('scroll', requestProgressRender, { passive: true })
    window.addEventListener('resize', requestProgressRender)

    return () => {
      window.removeEventListener('scroll', requestProgressRender)
      window.removeEventListener('resize', requestProgressRender)
      if (visualFrameRef.current !== null) {
        window.cancelAnimationFrame(visualFrameRef.current)
      }
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

    const getRawProgress = (metrics) =>
      (window.scrollY - metrics.top) / metrics.distance

    const getCurrentProgress = (metrics) =>
      clamp(getRawProgress(metrics))

    const setInputLocked = (locked) => {
      window.clearTimeout(releaseTimerRef.current)

      if (locked) {
        isAnimatingRef.current = true
        return
      }

      releaseTimerRef.current = window.setTimeout(() => {
        isAnimatingRef.current = false
      }, INPUT_RELEASE_DELAY)
    }

    const animateTo = (
      targetTop,
      duration = AUTO_TRANSITION_DURATION,
      onComplete,
      direction = 0,
    ) => {
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      scrollTweenRef.current?.kill()

      if (reduceMotion) {
        window.scrollTo({ top: targetTop, behavior: 'auto' })
        onComplete?.()
        return
      }

      setInputLocked(true)
      animationDirectionRef.current = direction
      transitionTimeScaleRef.current = 1
      scrollTweenRef.current = gsap.to(window, {
        duration,
        ease: 'power3.inOut',
        overwrite: true,
        scrollTo: {
          y: targetTop,
          autoKill: false,
        },
        onComplete: () => {
          onComplete?.()
          targetAnchorRef.current = null
          animationDirectionRef.current = 0
          transitionTimeScaleRef.current = 1
          setInputLocked(false)
        },
      })
    }

    const accelerateTransition = (direction, inputDelta) => {
      if (
        !scrollTweenRef.current ||
        animationDirectionRef.current !== direction
      ) {
        return
      }

      const speedBoost = clamp(Math.abs(inputDelta) / 260, 0.08, 0.42)
      const nextTimeScale = clamp(
        transitionTimeScaleRef.current + speedBoost,
        1,
        MAX_TRANSITION_TIMESCALE,
      )

      transitionTimeScaleRef.current = nextTimeScale
      scrollTweenRef.current.timeScale(nextTimeScale)
    }

    const getNextAnchor = (currentProgress, direction) => {
      const margin = 0.012

      if (direction > 0) {
        return SCENE_ANCHORS.find((anchor) => anchor > currentProgress + margin)
      }

      if (currentProgress >= SCENE_ANCHORS[2] - margin) {
        return SCENE_ANCHORS[1]
      }

      return [...SCENE_ANCHORS]
        .reverse()
        .find((anchor) => anchor < currentProgress - margin)
    }

    const goToScene = (direction, inputDelta = 0) => {
      if (isAnimatingRef.current) return
      const metrics = getTransitionMetrics()
      if (!metrics) return

      const currentProgress = getCurrentProgress(metrics)
      const targetAnchor = getNextAnchor(currentProgress, direction)

      if (targetAnchor !== undefined) {
        targetAnchorRef.current = targetAnchor
        animateTo(
          metrics.top + metrics.distance * targetAnchor,
          getTransitionDuration(inputDelta),
          undefined,
          direction,
        )
      }
    }

    const syncObserver = () => {
      const metrics = getTransitionMetrics()
      const observer = observerRef.current
      if (!metrics || !observer) return

      const rawProgress = getRawProgress(metrics)
      const isInsideCaptureZone =
        rawProgress >= CAPTURE_START &&
        rawProgress <= REVERSE_CAPTURE_END

      if (isInsideCaptureZone && !observer.isEnabled) {
        observer.enable()
      } else if (!isInsideCaptureZone && observer.isEnabled) {
        observer.disable()
      }
    }

    const handleWheel = (event) => {
      const direction = Math.sign(event.deltaY)
      if (!direction || Math.abs(event.deltaY) < WHEEL_THRESHOLD) return

      const metrics = getTransitionMetrics()
      if (!metrics) return

      const rawProgress = getRawProgress(metrics)

      if (direction > 0) {
        window.clearTimeout(endHandoffTimerRef.current)
        isHandingOffFromEndRef.current = false
      }

      if (direction < 0 && rawProgress > REVERSE_CAPTURE_END) {
        isHandingOffFromEndRef.current = true
        window.clearTimeout(endHandoffTimerRef.current)
        endHandoffTimerRef.current = window.setTimeout(() => {
          isHandingOffFromEndRef.current = false
        }, END_HANDOFF_DURATION)
        return
      }

      const shouldHandOffToIntro =
        isAnimatingRef.current &&
        direction < 0 &&
        targetAnchorRef.current === SCENE_ANCHORS[0] &&
        rawProgress <= 0.08

      if (shouldHandOffToIntro) {
        scrollTweenRef.current?.kill()
        targetAnchorRef.current = null
        animationDirectionRef.current = 0
        transitionTimeScaleRef.current = 1
        window.clearTimeout(releaseTimerRef.current)
        isAnimatingRef.current = false
        observerRef.current?.disable()
        return
      }

      const shouldCapture =
        direction > 0
          ? rawProgress >= 0 && rawProgress < CAPTURE_END
          : rawProgress > CAPTURE_START && rawProgress <= REVERSE_CAPTURE_END

      if (direction < 0 && isHandingOffFromEndRef.current) return
      if (!shouldCapture) return

      event.preventDefault()
      if (isAnimatingRef.current) {
        accelerateTransition(direction, event.deltaY)
        return
      }
      goToScene(direction, event.deltaY)
    }

    const requestObserverSync = () => {
      if (observerFrameRef.current !== null) return

      observerFrameRef.current = window.requestAnimationFrame(() => {
        observerFrameRef.current = null
        syncObserver()
      })
    }

    const handleScroll = () => {
      requestObserverSync()
    }

    observerRef.current = Observer.create({
      target: window,
      type: 'touch',
      preventDefault: true,
      tolerance: 24,
      dragMinimum: 12,
      onDown: () => goToScene(1),
      onUp: () => goToScene(-1),
    })
    observerRef.current.disable()

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', requestObserverSync)
    syncObserver()

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', requestObserverSync)
      window.clearTimeout(releaseTimerRef.current)
      window.clearTimeout(endHandoffTimerRef.current)
      if (observerFrameRef.current !== null) {
        window.cancelAnimationFrame(observerFrameRef.current)
      }
      scrollTweenRef.current?.kill()
      targetAnchorRef.current = null
      animationDirectionRef.current = 0
      transitionTimeScaleRef.current = 1
      observerRef.current?.kill()
    }
  }, [])

  const initialProgress = getSceneProgress(0)

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
                  ref={(node) => {
                    titleRefs.current[index] = node
                  }}
                  style={getTitleStyle(
                    index,
                    initialProgress.livingToBed,
                    initialProgress.bedToDining,
                  )}
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
                  ref={(node) => {
                    imageLayerRefs.current[index] = node
                  }}
                  style={getImageStyle(
                    index,
                    initialProgress.livingToBed,
                    initialProgress.bedToDining,
                  )}
                >
                  {space.mediaType === 'video' ? (
                    <video
                      className={styles.image}
                      src={space.media}
                      aria-label={space.alt}
                      aria-hidden={index !== 0}
                      muted
                      loop
                      playsInline
                      preload="auto"
                      ref={(node) => {
                        imageRefs.current[index] = node
                      }}
                    />
                  ) : (
                    <img
                      className={styles.image}
                      src={space.media}
                      alt={space.alt}
                      aria-hidden={index !== 0}
                      ref={(node) => {
                        imageRefs.current[index] = node
                      }}
                    />
                  )}
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
