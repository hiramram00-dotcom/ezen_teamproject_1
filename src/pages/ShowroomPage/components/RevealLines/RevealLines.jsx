import { useEffect, useRef, useState } from 'react'
import styles from './RevealLines.module.css'

/**
 * RevealLines — 여러 줄 텍스트를 줄 단위로 차례차례 아래에서 위로 올림.
 * 뷰포트에 재진입할 때마다 각 줄이 stagger(lineDelay)로 순차 등장.
 * prefers-reduced-motion: reduce 면 모션 없이 즉시 표시.
 *
 * 사용: <RevealLines as="p" className="type-body-3" lines={['1줄', '2줄', ...]} />
 * @param {string}   as            렌더 태그 (기본 p)
 * @param {string[]} lines         줄 문자열 배열
 * @param {number}   lineDelay     줄 간 지연(ms)
 * @param {number}   startDelay    첫 줄 시작 지연(ms) — 문단 이어붙일 때 사용
 * @param {boolean}  collapseToFlow 고정 줄바꿈이 컨테이너 폭에 닿으면(가장 긴 줄이
 *                                 넘치기 시작하면) 줄바꿈을 풀어 한 문단으로 자연 흐름.
 */
function RevealLines({ as: Tag = 'p', className = '', lines = [], lineDelay = 110, startDelay = 0, collapseToFlow = false, ...rest }) {
  const ref = useRef(null)
  const measureRef = useRef(null)
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  const [shown, setShown] = useState(reducedMotion)
  const [collapsed, setCollapsed] = useState(false)

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

  // 고정 줄바꿈 해제 판단: 가장 긴 줄의 실제 폭이 컨테이너 폭을 넘으면 collapse.
  // 숨겨진 측정용 DOM(measurer)으로 글꼴·자간이 반영된 실제 폭을 재므로 정확하다.
  useEffect(() => {
    if (!collapseToFlow) return
    const el = ref.current
    const measurer = measureRef.current
    if (!el || !measurer) return

    const measure = () => {
      let max = 0
      measurer.querySelectorAll('[data-measure-line]').forEach((s) => {
        if (s.offsetWidth > max) max = s.offsetWidth
      })
      setCollapsed(max > el.clientWidth)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)

    // 한글 웹폰트가 늦게 로드되면 폭이 달라지므로 로드 후 재측정.
    let cancelled = false
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) measure()
      })
    }
    return () => {
      cancelled = true
      ro.disconnect()
    }
  }, [collapseToFlow, lines])

  const flowing = collapseToFlow && collapsed

  return (
    <Tag ref={ref} className={`${styles.lines} ${shown ? styles.shown : ''} ${className}`} {...rest}>
      {collapseToFlow && (
        <span ref={measureRef} className={styles.measurer} aria-hidden="true">
          {lines.map((line, i) => (
            <span key={i} data-measure-line className={styles.measureLine}>
              {line}
            </span>
          ))}
        </span>
      )}
      {flowing ? (
        <span
          className={styles.line}
          style={{ transitionDelay: shown ? `${startDelay}ms` : '0ms' }}
        >
          {lines.join(' ')}
        </span>
      ) : (
        lines.map((line, i) => (
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
        ))
      )}
    </Tag>
  )
}

export default RevealLines
