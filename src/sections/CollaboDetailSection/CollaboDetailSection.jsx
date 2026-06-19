import { useEffect, useRef } from 'react'
import styles from './CollaboDetailSection.module.css'
import ilkwWordmark from './assets/ilkw-wordmark.svg'

/**
 * CollaboDetailSection — 콜라보 상세 첫 화면 히어로 (공용)
 * Figma: 1차프로젝트-3조 / node 1565:312 (KBP), 1587:33 (KAKAO)
 * 풀스크린 배경 사진 + 정중앙 "ILKW × {brand}" 로고 락업.
 * 로고는 blur-in(흐림→선명) 스태거로 등장.
 *
 * props: bg(배경 이미지), brandLogo(브랜드 로고), brandAlt
 */
function CollaboDetailSection({ bg, brandLogo, brandAlt = 'brand', logoAspect = '1 / 1' }) {
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

  return (
    <section className={styles.hero} aria-label={`ILKW × ${brandAlt} 콜라보`}>
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
    </section>
  )
}

export default CollaboDetailSection
