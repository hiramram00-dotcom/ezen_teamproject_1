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
    if (!section || !container || !targetCard || !targetMask || !sourceVideo) return

    const sourceParent = sourceVideo.parentNode
    const sourceNextSibling = sourceVideo.nextSibling

    const observer = new IntersectionObserver(
      ([entry]) => {
        section.classList.toggle(styles.isVisibleTriggered, entry.isIntersecting)
      },
      { threshold: 0.15 }
    )
    observer.observe(section)

    const moveToViewport = () => {
      if (sourceVideo.parentNode !== document.body) {
        document.body.appendChild(sourceVideo)
      }
      gsap.set(sourceVideo, {
        position: 'fixed',
        inset: '0 auto auto 0',
        zIndex: 20,
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        clipPath: 'inset(0% round 0px)',
        objectFit: 'cover',
        objectPosition: 'center',
        pointerEvents: 'none',
        autoAlpha: 1,
        willChange: 'transform,width,height,clip-path',
      })
    }

    const moveToTargetViewport = () => {
      const rect = targetCard.getBoundingClientRect()
      if (sourceVideo.parentNode !== document.body) {
        document.body.appendChild(sourceVideo)
      }
      gsap.set(sourceVideo, {
        position: 'fixed',
        inset: '0 auto auto 0',
        zIndex: 20,
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        clipPath: 'inset(0% round 4px)',
        objectFit: 'cover',
        objectPosition: 'center',
        autoAlpha: 1,
      })
    }

    const restoreToMakeLight = () => {
      sourceVideo.pause()
      sourceVideo.currentTime = 0
      if (sourceNextSibling?.parentNode === sourceParent) {
        sourceParent.insertBefore(sourceVideo, sourceNextSibling)
      } else {
        sourceParent.appendChild(sourceVideo)
      }
      gsap.set(sourceVideo, {
        clearProps:
          'position,inset,z-index,x,y,transform,width,height,object-fit,object-position,pointer-events,visibility,opacity,will-change',
      })
      sourceVideo.style.clipPath = 'ellipse(221% 130% at 50% 50%)'
    }

    let isAtTarget = false

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top bottom',
        end: 'top top',
        onEnter: () => {
          isAtTarget = false
          moveToViewport()
        },
        onLeaveBack: () => {
          isAtTarget = false
          restoreToMakeLight()
        },
      })

      gsap
        .timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: () => `+=${window.innerHeight}`,
          scrub: true,
          invalidateOnRefresh: true,
          onEnter: () => {
            if (!isAtTarget) moveToViewport()
          },
          onEnterBack: () => {
            sourceVideo.pause()
            isAtTarget = false
            moveToTargetViewport()
          },
          onLeaveBack: () => {
            isAtTarget = false
            moveToViewport()
          },
          onLeave: () => {
            isAtTarget = true
            sourceVideo.play().catch(() => {})
          },
          },
        })
        .to(sourceVideo, {
          x: () => targetCard.getBoundingClientRect().left,
          y: () => targetCard.getBoundingClientRect().top,
          width: () => targetCard.getBoundingClientRect().width,
          height: () => targetCard.getBoundingClientRect().height,
          clipPath: 'inset(0% round 4px)',
          ease: 'power2.inOut',
          duration: 1,
        })

      ScrollTrigger.create({
        trigger: container,
        start: 'bottom bottom',
        onEnter: () => gsap.set(sourceVideo, { autoAlpha: 0 }),
        onLeaveBack: () => {
          gsap.set(sourceVideo, { autoAlpha: 1 })
          if (isAtTarget) moveToTargetViewport()
        },
      })
    }, container)

    const refresh = () => {
      ScrollTrigger.refresh()
      if (isAtTarget) moveToTargetViewport()
    }
    window.addEventListener('resize', refresh)

    return () => {
      window.removeEventListener('resize', refresh)
      observer.disconnect()
      ctx.revert()
      restoreToMakeLight()
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
