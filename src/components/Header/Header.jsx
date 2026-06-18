import { useRef, useEffect, useLayoutEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import MenuOverlay from './MenuOverlay'
import logo from '../../assets/common/logo/ilkw.svg'

/* ===== 헤더 규칙 =====
 * 배경 없음. 흰 로고/메뉴가 mix-blend-mode:difference 로 뒤 배경 밝기에 따라
 * 자동 반전(어두우면 흰색, 밝으면 검정). 메뉴 열리면 반전 끄고 검정(#111).
 * 모든 페이지: 아래로 스크롤 → 헤더 위로 사라짐 / 위로 스크롤 → 등장 (맨 위 근처 항상 표시).
 */
function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef(null)

  // 메뉴 열렸을 때: body 잠금 + ESC로 닫기
  useEffect(() => {
    if (!menuOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // 모든 페이지 공통: 아래로 스크롤 → 헤더 위로 사라짐 / 위로 스크롤 → 다시 등장 (맨 위 근처는 항상 표시)
  useLayoutEffect(() => {
    const h = headerRef.current
    if (!h) return
    const TOP_ALWAYS_SHOW = 80 // 맨 위 이 범위(px)에선 항상 표시
    const DELTA = 5 // 방향 판단 최소 이동량(떨림 방지)
    let lastY = window.scrollY
    let raf = 0

    const apply = () => {
      raf = 0
      const y = window.scrollY

      // 메뉴 열렸으면 항상 표시, 맨 위 근처도 항상 표시
      if (menuOpen || y <= TOP_ALWAYS_SHOW) {
        h.classList.remove(styles.hidden)
      } else if (y > lastY + DELTA) {
        h.classList.add(styles.hidden) // 아래로 → 숨김
      } else if (y < lastY - DELTA) {
        h.classList.remove(styles.hidden) // 위로 → 표시
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
  }, [menuOpen])

  // 로고 클릭 → 메뉴 닫고 메인('/')으로. (이미 메인이면 맨 위로 부드럽게)
  const handleLogo = () => {
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`${styles.header} ${menuOpen ? styles.menuMode : ''}`}
      >
        <Link className={styles.logoLink} to="/" onClick={handleLogo} aria-label="메인으로">
          <img className={styles.logo} src={logo} alt="ILKW" />
        </Link>
        <button
          className={styles.menu}
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          <span className={styles.arrow} aria-hidden="true">
            <svg viewBox="0 0 28 16" fill="none">
              <line x1="7" y1="8" x2="24" y2="8" />
              <polyline points="17 2 24 8 17 14" />
            </svg>
          </span>
          <span className={styles.menuLabel}>{menuOpen ? 'Close' : 'Menu'}</span>
        </button>
      </header>
      <MenuOverlay open={menuOpen} onNavigate={() => setMenuOpen(false)} />
    </>
  )
}

export default Header
