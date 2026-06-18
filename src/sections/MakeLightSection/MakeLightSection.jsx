import { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
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
  const backdropRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const bgEl = bgRef.current
    const dim = dimRef.current
    const overlay = overlayRef.current
    const headline = headlineRef.current
    const light = lightRef.current
    const desc = descRef.current
    const backdrop = backdropRef.current

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
    tl.to(oval, { r: 130, ease: 'none', duration: 0.34, onUpdate: setClip }, 0.02)
      .fromTo(dim, { opacity: 0.75 }, { opacity: 0, ease: 'none', duration: 0.28 }, 0.14) // 어둠 → 원본
      .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.08 }, 0.42)
      // 글씨 한꺼번에 (헤드라인 + 본문 동시)
      .fromTo(
        [headline, desc],
        { autoAlpha: 0, y: 48 },
        { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.12 },
        0.52
      )
      // "LIGHT" — 흰색 유지 → 점차 한 번 밝아졌다가 → 서서히 다시 흰색 (CSS 변수 보간으로 매끄럽게)
      .to(light, { '--glow': 1, ease: 'power1.inOut', duration: 0.16 }, 0.6)
      .to(light, { '--glow': 0, ease: 'power1.inOut', duration: 0.28 }, 0.8)

    // Once this section's reveal has finished, the real bg photo itself
    // (not a clone) detaches from the sticky stage and becomes
    // position:fixed, then shrinks via transform into StorySection's
    // right-hand video card spot — the video already playing there takes
    // over the instant it arrives. A solid black backdrop covers
    // everything behind it (headline/desc text included) for the whole
    // trip so only the photo is visible against black while it travels —
    // otherwise the headline/desc would be seen sliding away underneath
    // it as the section's normal scroll continues. The destination is
    // re-queried live every tick (not captured once) because that card is
    // a normal in-flow element whose screen position keeps changing as
    // the user keeps scrolling.
    //
    // Only `transform: translate/scale` is animated, never width/height
    // directly — otherwise object-fit: cover would recompute which part
    // of the photo is visible on every frame as the box's aspect ratio
    // changes, making the image appear to swim internally instead of
    // just shrinking. Scaling the whole fixed-crop box via transform
    // keeps the visible content rigid.
    let fromRect = null
    const applyTransform = (toRect, p) => {
      const scaleX = toRect.width / fromRect.width
      const scaleY = toRect.height / fromRect.height
      const dx = toRect.left - fromRect.left
      const dy = toRect.top - fromRect.top
      const sx = 1 + (scaleX - 1) * p
      const sy = 1 + (scaleY - 1) * p
      bgEl.style.transform = `translate(${dx * p}px, ${dy * p}px) scale(${sx}, ${sy})`
      const fadeP = p > 0.92 ? 1 - (p - 0.92) / 0.08 : 1
      bgEl.style.opacity = `${fadeP}`
      backdrop.style.opacity = `${fadeP}`
    }
    const bgNextSibling = bgEl.nextSibling
    const bgParent = bgEl.parentNode
    let detached = false
    const detachBg = () => {
      fromRect = bgEl.getBoundingClientRect()
      bgEl.style.position = 'fixed'
      bgEl.style.left = `${fromRect.left}px`
      bgEl.style.top = `${fromRect.top}px`
      bgEl.style.width = `${fromRect.width}px`
      bgEl.style.height = `${fromRect.height}px`
      bgEl.style.zIndex = '25'
      bgEl.style.pointerEvents = 'none'
      bgEl.style.transform = 'translate(0px, 0px) scale(1, 1)'
      bgEl.style.opacity = '1'
      // Physically move the real DOM node to document.body so it shares
      // the exact same stacking context as the backdrop (also appended to
      // body) — bg stays nested deep inside .stage/.section otherwise,
      // and some ancestor along that chain was making it paint behind the
      // backdrop no matter how high its z-index was set, even though no
      // ancestor reported creating a stacking context. Moving the node
      // itself sidesteps the mystery entirely.
      if (!detached) {
        document.body.appendChild(bgEl)
        detached = true
      }
      backdrop.style.opacity = '1'
    }
    const reattachBg = () => {
      bgEl.style.position = ''
      bgEl.style.left = ''
      bgEl.style.top = ''
      bgEl.style.width = ''
      bgEl.style.height = ''
      bgEl.style.zIndex = ''
      bgEl.style.pointerEvents = ''
      bgEl.style.transform = ''
      bgEl.style.opacity = ''
      if (detached) {
        bgParent.insertBefore(bgEl, bgNextSibling)
        detached = false
      }
      backdrop.style.opacity = '0'
      fromRect = null
    }
    const migrateTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'bottom bottom',
      end: () => `+=${window.innerHeight}`,
      scrub: 0.5,
      invalidateOnRefresh: true,
      onEnter: detachBg,
      onEnterBack: detachBg,
      onLeaveBack: reattachBg,
      onUpdate: (self) => {
        if (!fromRect) return
        const target = document.querySelector('[data-make-light-target]')
        if (!target) return
        const toRect = target.getBoundingClientRect()
        applyTransform(toRect, self.progress)
      }
    })

    return () => {
      tl.scrollTrigger && tl.scrollTrigger.kill()
      tl.kill()
      migrateTrigger.kill()
      reattachBg()
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

      {/* Solid black backdrop shown only while the real bg photo above is
          mid-migration into StorySection's card — covers the headline/desc
          text and anything scrolling up underneath so only the photo is
          visible against black during the trip. */}
      {createPortal(
        <div ref={backdropRef} className={styles.migrateBackdrop} aria-hidden="true" />,
        document.body
      )}
    </section>
  )
}

export default MakeLightSection
