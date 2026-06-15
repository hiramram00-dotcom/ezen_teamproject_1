import { useRef, useEffect, useState } from 'react'
import styles from './Header.module.css'
import logo from '../../assets/common/logo/ilkw.svg'

/* ===== 헤더 노출 규칙 =====
 * [인덱스(메인) — <Header index />]
 *   1) Hero 구간 = 숨김.
 *   2) Hero가 완전히 사라져 Intro가 화면을 꽉 채우면(=Intro 스크롤 0 시점)
 *      → 헤더가 위에서 스르륵 "등장" (잠깐 유지해서 사용자가 헤더 존재를 인지하게).
 *   3) 그 뒤로는: 아래로 스크롤 = 숨김 / 위로 스크롤 = 다시 등장.
 *      (인덱스는 브랜드 스토리 감상이 많아 헤더가 방해되지 않게 평소엔 숨김)
 * [서브페이지 — <Header />]  : 상시 표시(스크롤 인터랙션 없음).
 *   ※ 이 규칙은 종욱님 결정(수정 가능성 있음).
 */
const ENTER_HOLD = 800 // 등장 직후 유지 시간(ms) — 헤더가 확실히 보이도록
const HIDE_AT = 8 // 아래로 이만큼(px) 스크롤해야 숨김 (값 ↑ = 덜 민감 = 천천히 올라감)
const SHOW_AT = 4 // 위로 이만큼(px) 스크롤하면 등장

function Header({ index = false }) {
  const [hidden, setHidden] = useState(index) // 인덱스=처음 숨김 / 서브=상시 표시
  const lastY = useRef(0)
  const pastHero = useRef(false)
  const enteredAt = useRef(0)

  useEffect(() => {
    if (!index) return // 서브페이지: 스크롤 로직 없이 상시 표시

    const heroEl = document.getElementById('hero')
    let io
    if (heroEl) {
      io = new IntersectionObserver(
        ([entry]) => {
          pastHero.current = !entry.isIntersecting
          if (pastHero.current) {
            setHidden(false) // Intro 진입 → 등장
            enteredAt.current = performance.now()
          } else {
            setHidden(true) // Hero 안 → 숨김
          }
          lastY.current = window.scrollY
        },
        { threshold: 0 },
      )
      io.observe(heroEl)
    }

    const onScroll = () => {
      const y = window.scrollY
      if (!pastHero.current) {
        lastY.current = y
        return // Hero 구간은 observer가 관리
      }
      if (performance.now() - enteredAt.current < ENTER_HOLD) {
        lastY.current = y
        return // 등장 직후엔 잠깐 유지 (확실히 보여주기)
      }
      if (y > lastY.current + HIDE_AT) setHidden(true) // 아래로 → 숨김
      else if (y < lastY.current - SHOW_AT) setHidden(false) // 위로 → 등장
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      io && io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [index])

  return (
    <header className={`${styles.header} ${hidden ? styles.hidden : ''}`}>
      <img className={styles.logo} src={logo} alt="ILKW" />
      <button className={styles.menu} type="button" aria-label="메뉴 열기">
        <span className={styles.arrow} aria-hidden="true">→</span>
        <span>Menu</span>
      </button>
    </header>
  )
}

export default Header
