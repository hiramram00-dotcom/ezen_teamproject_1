import { useEffect, useRef, useState } from 'react'
import styles from './RevealLines.module.css'

/**
 * RevealLines — 여러 줄 텍스트를 줄 단위로 차례차례 아래에서 위로 올림.
 * 뷰포트에 재진입할 때마다 각 줄이 stagger(lineDelay)로 순차 등장.
 * prefers-reduced-motion: reduce 면 모션 없이 즉시 표시.
 *
 * 사용: <RevealLines as="p" className="type-body-3" lines={['1줄', '2줄', ...]} />
 * @param {string}   as         렌더 태그 (기본 p)
 * @param {string[]} lines      줄 문자열 배열
 * @param {number}   lineDelay  줄 간 지연(ms)
 * @param {number}   startDelay 첫 줄 시작 지연(ms) — 문단 이어붙일 때 사용
 */
function RevealLines({ as: Tag = 'p', className = '', lines = [], lineDelay = 110, startDelay = 0, ...rest }) {
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
    <Tag ref={ref} className={`${styles.lines} ${shown ? styles.shown : ''} ${className}`} {...rest}>
      {lines.map((line, i) => (
        <span
          key={i}
          className={styles.line}
          style={{
            transitionDelay: shown
              ? `${startDelay + i * lineDelay}ms`
              : '0ms',
          }}
        >
          {line}
        </span>
      ))}
    </Tag>
  )
}

export default RevealLines
