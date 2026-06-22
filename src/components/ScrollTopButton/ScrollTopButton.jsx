import { useState, useEffect } from 'react'
import styles from './ScrollTopButton.module.css'

// 전역 우측 하단 고정 "맨 위로" 버튼 (스크롤 내릴 때 표시)
export default function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // 300px 이상 스크롤 시 버튼 표시
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 초기 로드 시 체크

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
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
