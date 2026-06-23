import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './MakeLightSection.module.css'

gsap.registerPlugin(ScrollTrigger)

const MAKE_LIGHT_VIDEO_URL =
  'https://res.cloudinary.com/dht6hmacp/video/upload/f_auto,q_auto/v1781829634/10_vgb2kq.mp4'

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
    bgEl.load()

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      dim.style.setProperty('--reveal', '140%')
      gsap.set(dim, { opacity: 0 })
      gsap.set([overlay, headline, desc], { opacity: 1, y: 0 })
      gsap.set(light, { '--glow': 0 })
      section.style.height = 'auto'
      stage.style.position = 'static'
      return
    }

    // 리스크 0% 우회 기법: 영상 대신 단색 검은 덮개(.dim)에 마스크를 씌워 확장시킴
    // 가로로 긴 타원형 마스크를 부드러운 그라데이션으로 확장한다.
    const oval = { r: 0 }
    // 중심을 화면 60%(더 위)에 둬서 작은 타원이 위쪽에서 온전히 보인 채로 확대된다.
    const setReveal = () => {
      dim.style.setProperty('--reveal', `${oval.r}%`)
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
    
    // 1. 대각선 안개 걷힘 (0.00 ~ 0.80): duration을 0.80으로 대폭 늘려 고급스럽고 여유로운 속도감 확보
    tl.fromTo(dim, { '--mask-radius': '0%' }, { '--mask-radius': '150%', ease: 'power2.inOut', duration: 0.80 }, 0.00)
      // 하단 그라데이션 오버레이 서서히 등장
      .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.20 }, 0.60)
      // 2. 타이포그래피 (0.75 ~ 0.90): 안개가 어느 정도 걷히고 나서 우아하게 등장
    // 검정 정지 → 가로 타원이 커짐. 사진은 처음부터 어둡다가 원래 밝기로(한 방향) 돌아옴.
    tl.to(oval, { r: 120, ease: 'none', duration: 0.68, onUpdate: setReveal }, 0.02)
      .fromTo(dim, { opacity: 1 }, { opacity: 0, ease: 'none', duration: 0.3 }, 0.58) // 어둠 → 원본
      .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.08 }, 0.72)
      // 글씨 한꺼번에 (헤드라인 + 본문 동시)
      .fromTo(
        headline,
        { autoAlpha: 0, y: 48 },
        { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.15 },
        0.75
      )
      .fromTo(
        desc,
        { autoAlpha: 0, y: 48 },
        { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.15 },
        0.80
      )
      // "LIGHT" 글로우 효과
      .to(light, { '--glow': 1, ease: 'power1.inOut', duration: 0.20 }, 0.75)
      .to(light, { '--glow': 0, ease: 'power1.inOut', duration: 0.20 }, 0.95)
      // 3. 섹션 여운 (1.05 ~ 1.15): 평범한 페이드 아웃 (bgEl은 다음 섹션 연결을 위해 유지)
      .to([dim, overlay, desc, moveText, restText], { opacity: 0, ease: 'none', duration: 0.10 }, 1.05)

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
        {/* data-make-light-copy: StorySection이 핸드오프 시작 즉시 이 레이어를 강제로 꺼서,
            이 섹션 자체의 페이드아웃 타이밍과 어긋나도 텍스트/오버레이가 한 프레임에 통째로
            가려지며 "컷"되는 것을 막는다. */}
        <div data-make-light-copy style={{ transition: 'opacity 0.35s ease, visibility 0.35s ease' }}>
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
      </div>
    </section>
  )
}

export default MakeLightSection
