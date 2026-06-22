import styles from './ScrollHint.module.css'

/**
 * ScrollHint — 화면 하단 중앙의 "스크롤 하세요" 표시 (작은 라벨 + 통통 튀는 ↓ 화살표).
 * 부모는 position이 static이 아니어야 함(절대배치 기준).
 * props:
 *  - light: 어두운 배경용(흰색). 기본은 어두운 글씨(크림 배경용).
 *  - label: 표시 텍스트 (기본 'Scroll')
 */
function ScrollHint({ light = false, inline = false, label = 'Scroll' }) {
  return (
    <div
      className={`${styles.hint} ${light ? styles.light : ''} ${inline ? styles.inline : ''}`}
      aria-hidden="true"
    >
      <span className={styles.label}>{label}</span>
      <svg
        className={styles.chevron}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  )
}

export default ScrollHint
