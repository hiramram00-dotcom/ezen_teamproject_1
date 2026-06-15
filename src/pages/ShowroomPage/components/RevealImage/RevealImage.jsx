import { useEffect, useRef, useState } from 'react'
import styles from './RevealImage.module.css'

/**
 * RevealImage — 이미지가 위에서 아래로 펼쳐지며(clip-path) 드러나는 모션.
 * 컨테이너를 위→아래로 열고, 이미지는 살짝 위에서 제자리로 내려온다.
 * 뷰포트에 재진입할 때마다 실행. prefers-reduced-motion: reduce 면 즉시 표시.
 *
 * @param {string} src
 * @param {string} className 컨테이너(wrap)에 적용 (크기/flex 등)
 * @param {number} delay     시작 지연(ms) — 좌/우 순차 등장에 사용
 */
function RevealImage({ src, alt = '', className = '', delay = 0, ...rest }) {
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
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reducedMotion])

  return (
    // 바깥(root)은 클립하지 않음 — IntersectionObserver 관측용
    // (clip된 wrap을 직접 관측하면 0면적으로 보여 트리거가 안 됨)
    <div ref={ref} className={`${styles.root} ${className}`}>
      <div
        className={`${styles.wrap} ${shown ? styles.shown : ''}`}
        style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
      >
        <img
          className={styles.img}
          src={src}
          alt={alt}
          style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
          {...rest}
        />
      </div>
    </div>
  )
}

export default RevealImage
