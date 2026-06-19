import styles from './ScrollTopButton.module.css'

// 서브페이지 우측 하단 고정 "맨 위로" 버튼 (메인은 푸터 버튼이 있어 제외)
export default function ScrollTopButton() {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      className={styles.topButton}
      onClick={handleClick}
      aria-label="맨 위로"
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
