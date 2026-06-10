import { useEffect, useRef } from 'react'
import logoIlkwBlack from './assets/logo-ilkw-black.svg'
import styles from './Snowman2Section.module.css'

/**
 * Snowman2Section
 * 하나의 스노우맨 영상이 스크롤에 따라
 *   카드 → (커지며) 풀스크린 → (유지) → (작아지며) 카드
 * 로 자연스럽게 이어지는 연출.
 * Figma: 1차프로젝트-3조 / node 468:701(풀스크린) ↔ 468:673(카드)
 *
 * - 350vh 래퍼 안 sticky 무대(100vh)에서 진행도(raw 0→1) 계산.
 * - 진입(GROW): 카드 크기 → 풀스크린 (Snowman1 검정 배경에서 커지며 등장).
 * - 유지(HOLD): 풀스크린. 이 사이 배경을 검정→흰색으로 교체(가려져 안 보임).
 * - 축소(SHRINK): 풀스크린 → 카드. 막판에 헤더·오버레이 페이드인.
 * 영상 소스 = public/videos/ (무거운 파일이라 git 제외, DEV_GUIDE §9-4).
 */
const VIDEO_SRC = '/videos/video-ilkw-snowman.mp4'

// 카드(최소) 크기 — Figma inset 기준: width 50.37%, height 45.09%
const CARD_W = 50.37 // vw
const CARD_H = 45.09 // vh

// 스크롤 구간(raw 0~1): 0~GROW_END 커짐 / ~SHRINK_START 유지 / 이후 줄어듦
const GROW_END = 0.22
const SHRINK_START = 0.46

// easeInOutCubic — 기계적이지 않게
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp01 = (v) => Math.min(1, Math.max(0, v))

function Snowman2Section() {
  const wrapRef = useRef(null)
  const stickyRef = useRef(null)
  const cardRef = useRef(null)
  const headerRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const sticky = stickyRef.current
    const card = cardRef.current
    const header = headerRef.current
    const overlay = overlayRef.current
    if (!wrap || !card) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    const update = () => {
      raf = 0
      const total = wrap.offsetHeight - window.innerHeight
      const rect = wrap.getBoundingClientRect()
      const raw = total > 0 ? clamp01(-rect.top / total) : 0

      // fullness: 0 = 카드, 1 = 풀스크린
      let f
      if (raw <= GROW_END) {
        f = ease(clamp01(raw / GROW_END)) // 진입: 커짐
      } else if (raw < SHRINK_START) {
        f = 1 // 유지: 풀스크린
      } else {
        f = 1 - ease(clamp01((raw - SHRINK_START) / (1 - SHRINK_START))) // 축소
      }
      if (reduce) f = 0

      card.style.width = CARD_W + f * (100 - CARD_W) + 'vw'
      card.style.height = CARD_H + f * (100 - CARD_H) + 'vh'
      card.style.borderRadius = 40 * (1 - f) + 'px'

      // 배경: 진입(검정) → 풀스크린 지나면 흰색(가려진 순간 교체)
      const onWhite = reduce || raw >= GROW_END
      if (sticky) {
        sticky.style.background = onWhite
          ? 'var(--color-base-1)'
          : 'var(--color-base-3)'
      }

      // 헤더·오버레이: 축소 후반(60~100%)에 페이드인
      let fade = 0
      if (raw >= SHRINK_START) {
        const s = (raw - SHRINK_START) / (1 - SHRINK_START)
        fade = clamp01((s - 0.6) / 0.4)
      }
      if (reduce) fade = 1
      if (header) header.style.opacity = String(fade)
      if (overlay) overlay.style.opacity = String(fade)
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section ref={wrapRef} className={styles.scrollWrap}>
      <div ref={stickyRef} className={styles.sticky}>
        <header ref={headerRef} className={styles.header}>
          <a className={styles.logo} href="/" aria-label="일광전구 ILKW 홈">
            <img src={logoIlkwBlack} alt="ILKW" />
          </a>
          <button type="button" className={`${styles.menu} type-menu`}>
            → Menu
          </button>
        </header>

        <div ref={cardRef} className={styles.card}>
          <video
            className={styles.video}
            src={VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div ref={overlayRef} className={styles.overlay}>
            <p className={styles.overlayTitle}>SNOWMAN</p>
            <p className={`${styles.overlayDesc} type-body-4`}>
              More than a light,
              <br />a presence.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Snowman2Section
