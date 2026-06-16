import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './MakeLightSection.module.css'
import bg from './assets/make-light-bg.webp'

gsap.registerPlugin(ScrollTrigger)

/**
 * MakeLightSection — 브랜드 마무리 화면 (Figma node 1106:489)
 * 스토리텔링 섹션이 위로 사라진 뒤 등장.
 * 검은 배경에서 화면 아래의 작은 원이 점점 커져 마무리 사진이 전체화면으로 전환되고,
 * 이어서 "We Make LIGHT, ILKW." 카피가 아래에서 위로(헤드라인 → 본문 시차) 등장한다.
 */
function MakeLightSection() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const bgRef = useRef(null)
  const dimRef = useRef(null)
  const overlayRef = useRef(null)
  const headlineRef = useRef(null)
  const lightRef = useRef(null)
  const descRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const bgEl = bgRef.current
    const dim = dimRef.current
    const overlay = overlayRef.current
    const headline = headlineRef.current
    const light = lightRef.current
    const desc = descRef.current

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
    const setClip = () => {
      bgEl.style.clipPath = `ellipse(${oval.r * 1.7}% ${oval.r}% at 50% 100%)`
    }
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
      },
    })
    // 검정 정지 → 가로 타원이 커짐. 사진은 처음부터 어둡다가 원래 밝기로(한 방향) 돌아옴.
    tl.to(oval, { r: 130, ease: 'none', duration: 0.5, onUpdate: setClip }, 0.06)
      .fromTo(dim, { opacity: 0.75 }, { opacity: 0, ease: 'none', duration: 0.42 }, 0.24) // 어둠 → 원본
      .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.08 }, 0.58)
      // 글씨 한꺼번에 (헤드라인 + 본문 동시)
      .fromTo(
        [headline, desc],
        { autoAlpha: 0, y: 48 },
        { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.12 },
        0.6
      )
      // "LIGHT" — 흰색 유지 → 점차 한 번 밝아졌다가 → 서서히 다시 흰색 (CSS 변수 보간으로 매끄럽게)
      .to(light, { '--glow': 1, ease: 'power1.inOut', duration: 0.16 }, 0.7)
      .to(light, { '--glow': 0, ease: 'power1.inOut', duration: 0.28 }, 0.88)

    return () => {
      tl.scrollTrigger && tl.scrollTrigger.kill()
      tl.kill()
    }
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} aria-label="We Make Light, ILKW.">
      <div ref={stageRef} className={styles.stage}>
        <img ref={bgRef} className={styles.bg} src={bg} alt="" loading="lazy" />
        <div ref={dimRef} className={styles.dim} aria-hidden="true" />
        <div ref={overlayRef} className={styles.overlay} aria-hidden="true" />

        <h2 ref={headlineRef} className={styles.headline}>
          We Make{' '}
          <strong ref={lightRef} className={styles.light}>
            LIGHT
          </strong>
          , ILKW.
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
