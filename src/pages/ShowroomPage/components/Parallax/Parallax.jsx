import { useEffect, useRef } from 'react'
import styles from './Parallax.module.css'

const SCALE = 1.26 // 이미지를 키워(126%) 이동 여유 확보 (amount 이동 시 빈 틈 방지)
const ORIGIN = 'translateY(0%) scale(' + SCALE + ')'

/**
 * Parallax — 풀블리드 이미지에 스크롤 패럴랙스(공간감).
 * 컨테이너(overflow hidden) 안에서 살짝 확대된 이미지를 스크롤 진행도에 따라
 * 위아래로 천천히 이동시켜 깊이감을 준다. rAF + scroll(throttle).
 * prefers-reduced-motion: reduce 면 정지.
 *
 * @param {string} src
 * @param {string} className  컨테이너(wrap)에 적용 (보통 aspect-ratio 지정)
 * @param {number} amount     이동 폭(%) — 진행도 0~1에서 -amount/2 ~ +amount/2
 */
function Parallax({ src, alt = '', className = '', amount = 22, ...rest }) {
  const wrapRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const img = imgRef.current
    if (!wrap || !img) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      img.style.transform = ORIGIN
      return
    }

    let ticking = false
    const apply = () => {
      ticking = false
      const rect = wrap.getBoundingClientRect()
      const vh = window.innerHeight
      if (rect.bottom < 0 || rect.top > vh) return
      // 요소가 아래에서 위로 지나가는 진행도 0~1
      const progress = (vh - rect.top) / (vh + rect.height)
      const clamped = Math.min(1, Math.max(0, progress))
      const move = (clamped - 0.5) * amount // -amount/2 ~ +amount/2 (%)
      img.style.transform = `translateY(${move.toFixed(2)}%) scale(${SCALE})`
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(apply)
      }
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [amount])

  return (
    <div ref={wrapRef} className={`${styles.wrap} ${className}`}>
      <img ref={imgRef} className={styles.img} src={src} alt={alt} style={{ transform: ORIGIN }} {...rest} />
    </div>
  )
}

export default Parallax
