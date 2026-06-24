import { useState, useEffect } from 'react'
import styles from './ScrollTopButton.module.css'

// 전역 우측 하단 고정 "맨 위로" 버튼 (스크롤 내릴 때 표시)
export default function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [atBottom, setAtBottom] = useState(false)

  useEffect(() => {
    // 페이지 끝 이 범위(px) 안에선 버튼을 위로 올림 (푸터 버튼과 겹침 방지)
    const BOTTOM_LIFT_ZONE = 120
    const handleScroll = () => {
      const y = window.scrollY
      setIsVisible(y > 300) // 300px 이상 스크롤 시 표시
      // 맨 아래 근처면 위로 올림 (그 전까진 지금과 동일)
      const reachedBottom =
        window.innerHeight + y >= document.documentElement.scrollHeight - BOTTOM_LIFT_ZONE
      setAtBottom(reachedBottom)
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
      type="button"
      className={`${styles.topButton} ${isVisible ? styles.visible : ''} ${atBottom ? styles.atBottom : ''}`}
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
