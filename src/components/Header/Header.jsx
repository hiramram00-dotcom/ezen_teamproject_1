import { useRef, useEffect, useLayoutEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import MenuOverlay from './MenuOverlay'
import logo from '../../assets/common/logo/ilkw.svg'

/* ===== 헤더 노출 규칙 (index) — 기준점 = Intro 섹션 top0 =====
 * 1) Intro top이 뷰포트로 올라오는 동안 → 헤더가 Intro top에 붙어 "같이 올라옴"(즉시 추종, transition X).
 * 2) Intro top = 0 → 헤더 "고정"(맨 위).
 * 3) 고정 후 일정이상(HIDE_AFTER) 더 내려가면 → 아래스크롤=숨김 / 위로=등장.
 * [서브페이지 — <Header />] : 상시 표시(스크롤 로직 없음).
 * ※ 종욱님 결정(수정가능).
 */
const HIDE_AFTER = 0.5 // Intro top0 이후 이만큼(뷰포트 비율) 더 내려가야 숨김 시작
const HIDE_AT = 8 // 아래로 이만큼(px) 스크롤해야 숨김 (둔감)
const SHOW_AT = 4 // 위로 이만큼(px) 스크롤하면 등장
const HIDE_DUR = '0.8s' // 올라감(숨김) — 느리게
const SHOW_DUR = '0.4s' // 등장 — 빠르게

function Header({ index = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef(null)
  const menuOpenRef = useRef(false)

  useEffect(() => {
    menuOpenRef.current = menuOpen
  }, [menuOpen])

  // 메뉴 열렸을 때: body 잠금 + ESC + 헤더 강제 표시(맨 위)
  useEffect(() => {
    if (!menuOpen) return
    document.body.style.overflow = 'hidden'
    const h = headerRef.current
    if (h) {
      h.style.transition = 'none'
      h.style.transform = 'translateY(0)'
    }
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // 인덱스: Intro top 기준 추종 → 고정 → 숨김/등장 (useLayoutEffect = 첫 페인트 전 위치잡아 깜빡임 방지)
  useLayoutEffect(() => {
    if (!index) return
    const h = headerRef.current
    let lastY = window.scrollY
    let hidden = false
    let raf = 0

    const apply = () => {
      raf = 0
      if (menuOpenRef.current || !h) return
      const intro = document.getElementById('intro')
      if (!intro) return
      const introTop = intro.getBoundingClientRect().top
      const vh = window.innerHeight
      const y = window.scrollY

      if (introTop > 0) {
        // Intro top0 전 → Intro top에 붙어 같이 올라옴 (즉시 추종)
        h.style.transition = 'none'
        h.style.transform = `translateY(${Math.round(introTop)}px)`
        hidden = false
      } else {
        // Intro top0 지남 → 고정
        const into = -introTop // 인트로로 내려온 양(px)
        if (into > vh * HIDE_AFTER) {
          if (y > lastY + HIDE_AT) hidden = true
          else if (y < lastY - SHOW_AT) hidden = false
        } else {
          hidden = false // 아직 일정 미만 → 보임
        }
        h.style.transition = `transform ${hidden ? HIDE_DUR : SHOW_DUR} cubic-bezier(0.4, 0, 0.2, 1)`
        h.style.transform = hidden ? 'translateY(-100%)' : 'translateY(0)'
      }
      lastY = y
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    apply() // 초기 1회 (페인트 전)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [index])

  // 로고 클릭 → 메뉴 닫고 메인('/')으로. (이미 메인이면 맨 위로 부드럽게)
  const handleLogo = () => {
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <header ref={headerRef} className={`${styles.header} ${menuOpen ? styles.menuMode : ''}`}>
        <Link className={styles.logoLink} to="/" onClick={handleLogo} aria-label="메인으로">
          <img className={styles.logo} src={logo} alt="ILKW" />
        </Link>
        <button
          className={styles.menu}
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          <span className={styles.arrow} aria-hidden="true">→</span>
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
        </button>
      </header>
      <MenuOverlay open={menuOpen} onNavigate={() => setMenuOpen(false)} />
    </>
  )
}

export default Header
