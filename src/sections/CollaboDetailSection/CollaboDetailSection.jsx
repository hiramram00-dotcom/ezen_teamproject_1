import { useEffect, useRef } from 'react'
import styles from './CollaboDetailSection.module.css'
import ilkwWordmark from './assets/ilkw-wordmark.svg'
import ScrollHint from '../../components/ScrollHint/ScrollHint'

/**
 * CollaboDetailSection — 콜라보 상세 첫 화면 히어로 (공용)
 * Figma: 1차프로젝트-3조 / node 1565:312 (KBP), 1587:33 (KAKAO)
 * 풀스크린 배경 사진 + 정중앙 "ILKW × {brand}" 로고 락업.
 * 로고는 blur-in(흐림→선명) 스태거로 등장.
 *
 * props: bg(배경 이미지), brandLogo(브랜드 로고), brandAlt
 */
function CollaboDetailSection({ bg, brandLogo, brandAlt = 'brand', logoAspect = '1 / 1' }) {
  const heroRef = useRef(null)
  const lockupRef = useRef(null)

  // 화면에 들어오면 .isVisible 토글 → 자식(.fxBlurIn)들이 순서대로 또렷해짐
  useEffect(() => {
    const el = lockupRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle(styles.isVisible, entry.isIntersecting),
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // 스크롤 내릴수록 스크롤 힌트가 서서히 사라짐 (--hint-fade: 1 → 0, 앞 35vh 동안)
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const p = Math.min(1, window.scrollY / (window.innerHeight * 0.35))
      el.style.setProperty('--hint-fade', String(1 - p))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className={styles.hero} ref={heroRef} aria-label={`ILKW × ${brandAlt} 콜라보`}>
      <img className={styles.bg} src={bg} alt="" />

      <div className={styles.lockup} ref={lockupRef}>
        <img className={`${styles.ilkw} ${styles.fxBlurIn}`} src={ilkwWordmark} alt="ILKW" />
        <span className={`${styles.x} ${styles.fxBlurIn}`} aria-hidden="true">x</span>
        <img
          className={`${styles.brandLogo} ${styles.fxBlurIn}`}
          src={brandLogo}
          alt={brandAlt}
          style={{ aspectRatio: logoAspect }}
        />
      </div>

      {/* 첫 화면 스크롤 안내 (어두운 배경 → 밝은색) */}
      <ScrollHint light />
    </section>
  )
}

export default CollaboDetailSection
