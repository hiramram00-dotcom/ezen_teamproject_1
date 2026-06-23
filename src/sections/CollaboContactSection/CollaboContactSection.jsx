import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './CollaboContactSection.module.css'
import bgPhoto from '../CollaboGallerySection/assets/collabo-footer.jpg'

gsap.registerPlugin(ScrollTrigger)

/**
 * CollaboContactSection — 콜라보 갤러리 다음 화면 (Figma node 1808:38)
 * 어두운 배경 사진 위 중앙 카피 + Contact Us 버튼.
 * MakeLightSection과 동일한 원형 리빌(검정 → 사진) 기법으로 스크롤 시 등장한다.
 */
function CollaboContactSection() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const dimRef = useRef(null)
  const headlineRef = useRef(null)
  const descRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const dim = dimRef.current
    const headline = headlineRef.current
    const desc = descRef.current
    const cta = ctaRef.current

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      gsap.set(dim, { opacity: 0 })
      gsap.set([headline, desc, cta], { autoAlpha: 1, y: 0, filter: 'blur(0px)' })
      section.style.height = 'auto'
      stage.style.position = 'static'
      return
    }

    // MakeLightSection과 동일한 기법: 타원형 마스크를 가진 검정 덮개(.dim)를 점점 넓혀 사진을 드러낸다.
    const oval = { r: 0 }
    const setReveal = () => dim.style.setProperty('--reveal', `${oval.r}%`)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 30%',
        end: 'bottom bottom',
        scrub: 0.6, // 숫자 scrub = 약간의 지연(보간)으로 따라옴 → 빠르게 스크롤해도 원이 한 번에 확 커지지 않음
        invalidateOnRefresh: true,
      },
    })

    // 모든 등장(리빌+텍스트)을 타임라인 앞쪽(~67%)에 몰아넣고, 뒤쪽은 빈 시간(.to({}, ...))으로
    // 채워 둔다. scrub는 "스크롤 진행률"을 "타임라인 전체 길이" 기준으로 매핑하므로,
    // 뒤쪽에 여유(dwell)를 둬야 모션이 끝난 뒤에도 화면이 풀로 고정된 채 잠시 머물다가
    // 핀이 풀리며 다음 섹션으로 넘어간다(끝나자마자 바로 넘어가지 않도록).
    tl.to(oval, { r: 120, ease: 'none', duration: 0.5, onUpdate: setReveal }, 0)
      .fromTo(dim, { opacity: 1 }, { opacity: 0, ease: 'none', duration: 0.22 }, 0.42)
      .fromTo(
        headline,
        { autoAlpha: 0, y: 48, filter: 'blur(8px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.15 },
        0.5
      )
      .fromTo(
        desc,
        { autoAlpha: 0, y: 48, filter: 'blur(8px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.15 },
        0.58
      )
      .fromTo(
        cta,
        { autoAlpha: 0, y: 48, filter: 'blur(8px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.15 },
        0.66
      )
      // dwell: 아무 효과 없이 타임라인 길이만 늘려, 모션 완료 후에도 한동안 풀스크린에 머물게 한다.
      .to({}, { duration: 0.4 }, 0.81)

    return () => {
      tl.scrollTrigger && tl.scrollTrigger.kill()
      tl.kill()
    }
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} aria-label="콜라보 제안">
      <div ref={stageRef} className={styles.stage}>
        <img className={styles.bg} src={bgPhoto} alt="" aria-hidden="true" />
        <div className={styles.scrim} aria-hidden="true" />
        <div ref={dimRef} className={styles.dim} aria-hidden="true" />

        <div className={styles.content}>
          <h2 ref={headlineRef} className={styles.headline}>
            IF YOU HAVE AN IDEA FOR A <em className={styles.it}>collaboration</em>,<br />
            WE&apos;D LOVE TO HEAR FROM YOU.
          </h2>
          <p ref={descRef} className={styles.desc}>
            빛으로 연결될 새로운 이야기를 기다립니다.
          </p>
          <a ref={ctaRef} className={styles.cta} href="#contact" data-cursor="pointer">
            Contact Us
          </a>
        </div>
      </div>
    </section>
  )
}

export default CollaboContactSection
