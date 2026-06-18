import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './MakeLightSection.module.css'

gsap.registerPlugin(ScrollTrigger)

const MAKE_LIGHT_VIDEO_URL =
  'https://res.cloudinary.com/ddit4bjrw/video/upload/v1781749340/Lamp_glows_on_bedsheets_202606181112_vqzy0z.mp4'

/**
 * MakeLightSection — 브랜드 마무리 화면 (Figma node 1106:489)
 * 스토리텔링 섹션이 위로 사라진 뒤 등장.
 * 검은 배경에서 화면 아래의 작은 원이 점점 커져 마무리 사진이 전체화면으로 전환되고,
 * 이어서 "We Make Light, ILKW." 카피가 아래에서 위로(헤드라인 → 본문 시차) 등장한다.
 */
function MakeLightSection() {
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
      bgEl.style.clipPath = 'ellipse(250% 200% at 50% 50%)'
      gsap.set(dim, { opacity: 0 })
      gsap.set([overlay, headline, desc], { opacity: 1, y: 0 })
      gsap.set(light, { '--glow': 0 })
      section.style.height = 'auto'
      stage.style.position = 'static'
      return
    }

    // 가로로 긴 타원 (rx = ry * 1.7) — clip-path만 갱신(필터 없음 → 부드럽게)
    const oval = { r: 0 }
    // 중심을 화면 60%(더 위)에 둬서 작은 타원이 위쪽에서 온전히 보인 채로 확대된다.
    const setClip = () => {
      bgEl.style.clipPath = `ellipse(${oval.r * 1.7}% ${oval.r}% at 50% 50%)`
    }
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 30%', // 핀 직전(섹션 top이 화면 10%)부터 시작 → 원이 조금 더 일찍 커지기 시작
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
      },
    })
    // 검정 정지 → 가로 타원이 커짐. 사진은 처음부터 어둡다가 원래 밝기로(한 방향) 돌아옴.
    tl.to(oval, { r: 130, ease: 'none', duration: 0.62, onUpdate: setClip }, 0.02)
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
      data-make-light-section
      aria-label="We Make Light, ILKW."
    >
      <div ref={stageRef} className={styles.stage}>
        <video
          ref={bgRef}
          className={styles.bg}
          data-make-light-video
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

export default MakeLightSection
