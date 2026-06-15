import { useEffect, useRef, useState } from 'react'
import styles from './Reveal.module.css'

/**
 * Reveal — 스크롤 진입 시 아래에서 위로 올라오며 페이드인.
 * 화면을 벗어나면 초기화되어 스크롤 방향과 관계없이 다시 실행된다.
 * prefers-reduced-motion: reduce 면 모션 없이 즉시 표시.
 *
 * 사용: <Reveal as="p" className="type-body-3" delay={100}>...</Reveal>
 * @param {string} as     렌더할 태그 (기본 div)
 * @param {number} delay  stagger용 지연(ms)
 */
function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useRef(null)
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  const [shown, setShown] = useState(reducedMotion)

  useEffect(() => {
    if (reducedMotion) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShown(entry.isIntersecting)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reducedMotion])

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${shown ? styles.shown : ''} ${className}`}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export default Reveal
