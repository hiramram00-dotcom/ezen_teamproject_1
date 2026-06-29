import { useState, useEffect, useRef } from 'react'
import styles from './ScrollTopButton.module.css'

// 푸터에서 버튼이 올라오는 "최대 높이"(px). 푸터 top까지 다 따라가면 너무 높이 올라가므로 이만큼만.
const FOOTER_LIFT_MAX = 220

// 전역 우측 하단 고정 "맨 위로" 버튼 (스크롤 내릴 때 표시)
export default function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const buttonRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)

      // 페이지 바닥(푸터)에 닿으면 버튼이 푸터 위로 "살짝" 올라가게 — 가려지지 않도록.
      // 단 푸터가 화면 덮는 높이(overlap)를 그대로 따라가면 푸터 top까지 올라가 너무 높으므로,
      // FOOTER_LIFT_MAX까지만 올린다(cap). (직접 DOM 조작 = 리렌더 없음)
      const btn = buttonRef.current
      if (!btn) return
      const footer = document.querySelector('footer')
      const overlap = footer ? window.innerHeight - footer.getBoundingClientRect().top : 0
      const lift = Math.min(Math.max(overlap, 0), FOOTER_LIFT_MAX)
      btn.style.bottom = lift > 0 ? `calc(max(20px, 4vmin) + ${Math.round(lift)}px)` : ''
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    handleScroll() // 초기 로드 시 체크

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${styles.topButton} ${isVisible ? styles.visible : ''}`}
      onClick={handleClick}
      aria-label="맨 위로"
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
    >
      {/* 위로 향하는 꺾쇠 3개 (이어서 쌓음) */}
      <span className={styles.chevrons} aria-hidden="true">
        <svg className={styles.chevron} viewBox="0 0 24 8" fill="none">
          <polyline points="2 6 12 2 22 6" />
        </svg>
        <svg className={styles.chevron} viewBox="0 0 24 8" fill="none">
          <polyline points="2 6 12 2 22 6" />
        </svg>
        <svg className={styles.chevron} viewBox="0 0 24 8" fill="none">
          <polyline points="2 6 12 2 22 6" />
        </svg>
      </span>
      <span className={styles.label}>Top</span>
    </button>
  )
}
