import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './StorySection.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function StorySection() {
  const containerRef = useRef(null)
  const sectionRef = useRef(null)
  const targetCardRef = useRef(null)
  const targetMaskRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const container = containerRef.current
    const targetCard = targetCardRef.current
    const targetMask = targetMaskRef.current
    const sourceVideo = document.querySelector('[data-make-light-video]')
    const makeLightCopy = document.querySelector('[data-make-light-copy]')
    if (!section || !container || !targetCard || !targetMask || !sourceVideo) return

    const hideMakeLightCopy = () => {
      if (!makeLightCopy) return
      makeLightCopy.style.setProperty('opacity', '0', 'important')
      makeLightCopy.style.setProperty('visibility', 'hidden', 'important')
    }

    const restoreMakeLightCopy = () => {
      if (!makeLightCopy) return
      makeLightCopy.style.removeProperty('opacity')
      makeLightCopy.style.removeProperty('visibility')
    }

    const sourceParent = sourceVideo.parentNode
    const sourceNextSibling = sourceVideo.nextSibling
    // handoffWrapper: 화면에 고정된 박스. left/top/width/height 네 값을 풀스크린 사각형 →
    // 카드 사각형까지 매 프레임 "각각 직선으로" 보간한다 — 네 변이 전부 일정한 속도로 움직이므로
    // 박스의 중심/모서리 어디를 보든 항상 곧은 직선 경로로만 움직이고 줄어든다.
    // (이전엔 clip-path의 상/하/좌/우를 따로 보간했는데, 그 네 변의 속도가 서로 달라서
    //  박스가 화면 위쪽에 들러붙은 채로 일그러지듯 줄어드는 — "위로 올라가며 작아지는" — 문제가 있었다.)
    // handoffVideo는 그냥 이 박스를 object-fit:cover로 채우기만 한다 — 별도의 scale 계산이 없어
    // 박스 경로와 영상이 항상 정확히 일치한다.
    let handoffWrapper = null
    let handoffVideo = null

    const getViewportRect = () => {
      return {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }
    }

    const ensureHandoffVideo = () => {
      if (handoffVideo) return

      handoffWrapper = document.createElement('div')
      handoffWrapper.setAttribute('aria-hidden', 'true')
      document.body.appendChild(handoffWrapper)
      gsap.set(handoffWrapper, {
        position: 'fixed',
        zIndex: 20,
        overflow: 'hidden',
        pointerEvents: 'none',
        contain: 'layout paint',
        autoAlpha: 0,
      })

      handoffVideo = sourceVideo.cloneNode(true)
      handoffVideo.removeAttribute('data-make-light-video')
      handoffVideo.muted = true
      handoffVideo.loop = true
      handoffVideo.playsInline = true
      try {
        handoffVideo.currentTime = sourceVideo.currentTime
      } catch {
        // Some browsers disallow setting currentTime before metadata is ready.
      }
      handoffWrapper.appendChild(handoffVideo)
      gsap.set(handoffVideo, {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 'auto',
        bottom: 'auto',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
      })

      sourceVideo.style.setProperty('opacity', '0', 'important')
      sourceVideo.style.setProperty('visibility', 'hidden', 'important')
      // MakeLightSection 자체의 페이드아웃 타이밍과 무관하게, 핸드오프가 화면을 덮는
      // 그 순간 텍스트/오버레이도 같이(트랜지션과 함께) 사라지게 강제한다 — 그래야
      // "아직 안 사라진 헤드라인이 한 프레임에 통째로 가려지는" 컷이 생기지 않는다.
      hideMakeLightCopy()
      handoffVideo.play?.().catch(() => {})
    }

    const setVideoFixedTransform = ({ left, top, width, height, radius }) => {
      ensureHandoffVideo()
      gsap.set(handoffWrapper, {
        left,
        top,
        width,
        height,
        borderRadius: radius,
        autoAlpha: 1,
      })
    }

    const removeHandoffVideo = () => {
      if (!handoffWrapper) return
      handoffVideo?.pause?.()
      handoffWrapper.remove()
      handoffWrapper = null
      handoffVideo = null
    }

    const resetHandoff = () => {
      handoffStartRect = null
      handoffTargetRect = null
      removeHandoffVideo()
    }

    const getTargetCardPinnedRect = () => {
      const cardRect = targetCard.getBoundingClientRect()
      const sectionRect = section.getBoundingClientRect()

      return {
        left: cardRect.left,
        top: cardRect.top - sectionRect.top,
        width: cardRect.width,
        height: cardRect.height,
      }
    }

    const pinToTargetCard = () => {
      if (sourceVideo.parentNode !== targetCard) {
        targetCard.appendChild(sourceVideo)
      }

      if (handoffVideo) {
        try {
          sourceVideo.currentTime = handoffVideo.currentTime
        } catch {
          // Keep the original frame if syncing is unavailable.
        }
      }

      sourceVideo.style.removeProperty('opacity')
      sourceVideo.style.removeProperty('visibility')
      gsap.set(sourceVideo, {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 'auto',
        bottom: 'auto',
        zIndex: 1,
        x: 0,
        y: 0,
        width: '100%',
        height: '100%',
        clipPath: 'inset(0% round 4px)',
        objectFit: 'cover',
        objectPosition: 'center',
        pointerEvents: 'none',
        autoAlpha: 1,
        transformOrigin: '0 0',
        clearProps: 'willChange,will-change',
      })
    }

    const restoreToMakeLight = () => {
      sourceVideo.pause()
      sourceVideo.currentTime = 0
      resetHandoff()
      restoreMakeLightCopy()
      if (sourceNextSibling?.parentNode === sourceParent) {
        sourceParent.insertBefore(sourceVideo, sourceNextSibling)
      } else {
        sourceParent.appendChild(sourceVideo)
      }
      gsap.set(sourceVideo, {
        clearProps:
          'position,inset,left,top,right,bottom,zIndex,z-index,x,y,scale,transform,width,height,clipPath,clip-path,objectFit,object-fit,objectPosition,object-position,pointerEvents,pointer-events,visibility,opacity,willChange,will-change',
      })
      sourceVideo.style.removeProperty('opacity')
      sourceVideo.style.removeProperty('visibility')
      sourceVideo.style.clipPath = ''
    }

    let isAtTarget = false
    let handoffStartRect = null
    let handoffTargetRect = null

    const lerp = (from, to, progress) => from + (to - from) * progress

    const renderHandoff = (progress) => {
      if (!handoffStartRect || !handoffTargetRect) return
      // 박스의 left/top/width/height를 각각 독립적으로 직선 보간 — 네 변이 같은 속도로
      // 움직이므로 박스의 중심·모서리 어디든 항상 곧은 직선으로만 이동/축소된다.
      setVideoFixedTransform({
        left: lerp(handoffStartRect.left, handoffTargetRect.left, progress),
        top: lerp(handoffStartRect.top, handoffTargetRect.top, progress),
        width: lerp(handoffStartRect.width, handoffTargetRect.width, progress),
        height: lerp(handoffStartRect.height, handoffTargetRect.height, progress),
        radius: lerp(0, 4, progress),
      })
    }

    const setHandoffGeometry = (startRect, targetRect) => {
      handoffStartRect = startRect
      handoffTargetRect = targetRect
    }

    const prepareHandoff = (progress = 0) => {
      setHandoffGeometry(getViewportRect(), getTargetCardPinnedRect())
      isAtTarget = false
      renderHandoff(progress)
    }

    const prepareReverseHandoff = (progress = 1) => {
      sourceVideo.pause()
      setHandoffGeometry(getViewportRect(), getTargetCardPinnedRect())
      isAtTarget = false
      renderHandoff(progress)
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        toggleClass: {
          targets: section,
          className: styles.isVisibleTriggered,
        },
      })

      ScrollTrigger.create({
        trigger: container,
        start: 'top 68%',
        end: 'top top',
        // scrub: true는 실제 스크롤값에 1:1로 즉시 반응한다 — 트랙패드/마우스 휠의 관성·역방향
        // 미세 떨림(오버스크롤 보정)까지 그대로 영상에 반영되어 "위로 튀었다가 도로 내려오는"
        // 현상으로 보였다. 작은 숫자로 살짝 댐핑을 줘서 그 떨림을 흡수한다.
        scrub: 0.35,
        invalidateOnRefresh: true,
        onEnter: (self) => {
          prepareHandoff(self.progress)
        },
        onEnterBack: (self) => {
          prepareReverseHandoff(self.progress)
        },
        onUpdate: (self) => {
          if (!self.isActive && !handoffStartRect && !handoffTargetRect) return

          if (!handoffStartRect || !handoffTargetRect) {
            if (self.direction < 0) {
              prepareReverseHandoff(self.progress)
            } else {
              prepareHandoff(self.progress)
            }
            return
          }

          renderHandoff(self.progress)
        },
        onLeaveBack: () => {
          resetHandoff()
          isAtTarget = false
          restoreToMakeLight()
        },
        onLeave: () => {
          handoffStartRect = null
          handoffTargetRect = null
          isAtTarget = true
          pinToTargetCard()
          sourceVideo.play().catch(() => {})
          removeHandoffVideo()
        },
      })

      ScrollTrigger.create({
        trigger: container,
        start: 'bottom bottom',
        onEnter: () => {
          if (isAtTarget) pinToTargetCard()
        },
        onLeaveBack: () => {
          if (isAtTarget) pinToTargetCard()
        },
      })
    }, container)

    const refresh = () => {
      ScrollTrigger.refresh()
      if (isAtTarget) pinToTargetCard()
    }
    window.addEventListener('resize', refresh)

    return () => {
      window.removeEventListener('resize', refresh)
      ctx.revert()
      restoreToMakeLight()
      removeHandoffVideo()
    }
  }, [])

  return (
    <div className={`story-section-wrapper ${styles.storyWrapper}`} ref={containerRef}>
      <section className={styles.storySection} ref={sectionRef}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.titleRegular}>We Make</span>
            <span className={styles.titleItalic}> Light</span>
          </h2>
          <p className={styles.desc}>
            단순히 공간을 밝히는 것을 넘어,
            <br />
            그 공간이 가진 분위기와 감정을 완성합니다.
          </p>
        </div>

        <div className={styles.imageGrid}>
          <div className={styles.imageCard}>
            <div className={styles.imageRevealMask}>
              <video
                src="https://res.cloudinary.com/dht6hmacp/video/upload/v1781753639/mid2_vm7bbx.mp4"
                className={styles.imgScene}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
            <div className={styles.gradientOverlay} />
          </div>
          <div className={styles.imageCard} ref={targetCardRef}>
            <div
              ref={targetMaskRef}
              className={`${styles.imageRevealMask} ${styles.delay2}`}
            />
            <div className={styles.gradientOverlay} />
          </div>
        </div>

        <div className={styles.footer}>
          <span className={`type-italic-3 ${styles.footerTextLeft}`}>Better Life</span>
          <div className={styles.line} />
          <span className={`type-italic-3 ${styles.footerTextRight}`}>Better Light</span>
        </div>
      </section>
    </div>
  )
}
