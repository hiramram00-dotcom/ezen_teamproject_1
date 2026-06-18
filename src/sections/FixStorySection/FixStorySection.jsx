import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './FixStorySection.module.css'

gsap.registerPlugin(ScrollTrigger)

const MAKE_LIGHT_VIDEO_URL =
  'https://res.cloudinary.com/ddit4bjrw/video/upload/v1781749340/Lamp_glows_on_bedsheets_202606181112_vqzy0z.mp4'

/**
 * FixStorySection — 브랜드 마무리 화면 (MakeLightSection 복제본)
 * 샌드박스용 테스트 컴포넌트입니다.
 */
function FixStorySection() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const bgRef = useRef(null)
  const dimRef = useRef(null)
  const overlayRef = useRef(null)
  const headlineRef = useRef(null)
  const moveTextRef = useRef(null)
  const restTextRef = useRef(null)
  const lightRef = useRef(null)
  const descRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const bgEl = bgRef.current
    const dim = dimRef.current
    const overlay = overlayRef.current
    const headline = headlineRef.current
    const moveText = moveTextRef.current
    const restText = restTextRef.current
    const light = lightRef.current
    const desc = descRef.current

    bgEl.pause()
    bgEl.currentTime = 0

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      bgEl.style.webkitMaskImage = 'none'
      bgEl.style.maskImage = 'none'
      gsap.set(dim, { opacity: 0 })
      gsap.set([overlay, headline, desc], { opacity: 1, y: 0 })
      gsap.set(light, { '--glow': 0 })
      section.style.height = 'auto'
      stage.style.position = 'static'
      return
    }

    // 애플 최고 디자이너의 선택: 빛의 번짐 (Soft Feather Mask)
    // 시작 시 완전히 가려지도록 초기 반경을 -30으로 세팅 (페더링 30% 구간 고려)
    const oval = { r: -30 }
    
    // 호환성 완벽 방어: 사파리를 위해 -webkit- 접두어 강제 동시 적용
    const setClip = () => {
      // 왼쪽 아래 구석(0% 100%)에서 시작해, oval.r 까지는 100% 검정(보임), 그 후 30% 구간은 투명(안보임)으로 안개처럼 스며듦
      const maskGradient = `radial-gradient(circle at 0% 100%, black ${oval.r}%, transparent ${oval.r + 30}%)`
      bgEl.style.webkitMaskImage = maskGradient
      bgEl.style.maskImage = maskGradient
    }
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 30%', 
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
      },
    })
    
    // 대각선 반대편 끝까지 안개빛이 완전히 덮을 수 있도록 반경을 200까지 넉넉하게 키움. (우아한 power2.inOut 가속)
    tl.to(oval, { r: 200, ease: 'power2.inOut', duration: 0.62, onUpdate: setClip }, 0.02)
      .fromTo(dim, { opacity: 0.75 }, { opacity: 0, ease: 'none', duration: 0.52 }, 0.24) // 어둠 → 원본
      .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.08 }, 0.72)
      // 글씨 한꺼번에 (헤드라인 + 본문 동시)
      .fromTo(
        headline,
        { autoAlpha: 0, y: 48 },
        { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.12 },
        0.78
      )
      .fromTo(
        desc,
        { autoAlpha: 0, y: 48 },
        { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.12 },
        0.9
      )
      // "LIGHT" — 흰색 유지 → 점차 한 번 밝아졌다가 → 서서히 다시 흰색 (CSS 변수 보간으로 매끄럽게)
      .to(light, { '--glow': 1, ease: 'power1.inOut', duration: 0.16 }, 0.6)
      .to(light, { '--glow': 0, ease: 'power1.inOut', duration: 0.28 }, 0.8)
      // 섹션이 끝나갈 무렵 사진/딤/오버레이/본문/헤드라인은 평범하게 페이드 아웃
      .to([dim, overlay, desc, moveText, restText], { opacity: 0, ease: 'none', duration: 0.06 }, 1.04)

    return () => {
      tl.scrollTrigger && tl.scrollTrigger.kill()
      tl.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-fix-story-section
      aria-label="We Make Light, ILKW."
    >
      <div ref={stageRef} className={styles.stage}>
        <video
          ref={bgRef}
          className={styles.bg}
          src={MAKE_LIGHT_VIDEO_URL}
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div ref={dimRef} className={styles.dim} aria-hidden="true" />
        <div ref={overlayRef} className={styles.overlay} aria-hidden="true" />

        <h2 ref={headlineRef} className={styles.headline}>
          <span ref={moveTextRef}>
            We Make{' '}
            <strong ref={lightRef} className={styles.light}>
              Light
            </strong>
          </span>
          <span ref={restTextRef}>, ILKW.</span>
        </h2>
        <p ref={descRef} className={styles.desc}>
          우리는 빛이 머무는 모든 순간을 생각합니다.
          <br />
          사람과 공간을 위한 더 나은 빛, 그것이 일광전구가 만드는 가치입니다.
        </p>
      </div>
    </section>
  )
}

export default FixStorySection
