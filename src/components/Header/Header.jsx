import { useRef, useEffect, useLayoutEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import MenuOverlay from './MenuOverlay'
import logo from '../../assets/common/logo/ilkw.svg'

/* ===== 헤더 노출 규칙 (index) =====
 * 0) Hero 영상 보이기 전(인트로 중) → 헤더 숨김.
 * 1) Hero 오버레이 걷히고 영상 보이면(body[data-hero-revealed='true']) → 헤더 등장 (흰글자, 배경 X).
 * 2) Intro 섹션 top0 되면 → 배경 스크림이 위에서 슥 내려옴(.bgShown, 이후 유지).
 *    다시 Hero 쪽으로 올라오면 → 배경만 사라짐(헤더는 영상 위 흰글자로 유지).
 * 3) Intro top0 + 일정이상(HIDE_AFTER) 내려가면 → 아래=숨김 / 위로=등장.
 * 위치는 항상 상단 고정(translateY로 숨김/등장만). 서브페이지=상시 표시.
 */
const HIDE_AFTER = 0.5 // Intro top0 이후 이만큼(뷰포트 비율) 더 내려가야 숨김 시작
const HIDE_DIST = 500 // 아래로 "누적" 이만큼(px ≈ 스크롤 약 5번) 내려야 숨김
const SHOW_DIST = 60 // 위로 누적 이만큼(px) 올리면 등장 (빠릿하게)
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
    let downAccum = 0 // 아래로 누적 스크롤량
    let upAccum = 0 // 위로 누적 스크롤량
    let raf = 0

    const apply = () => {
      raf = 0
      if (menuOpenRef.current || !h) return
      const y = window.scrollY

      // 0) Hero 영상 아직 안 보이면(인트로 중) → 헤더 숨김, 배경 off
      if (document.body.dataset.heroRevealed !== 'true') {
        h.style.transition = 'none'
        h.style.transform = 'translateY(-100%)'
        h.classList.remove(styles.bgShown)
        hidden = false
        lastY = y
        return
      }

      const intro = document.getElementById('intro')
      const vh = window.innerHeight
      const introTop = intro ? intro.getBoundingClientRect().top : vh

      // 2) 배경: Intro top0 지나면 슥 내려옴(유지) / Hero 쪽으로 올라오면 사라짐
      if (introTop <= 0) h.classList.add(styles.bgShown)
      else h.classList.remove(styles.bgShown)

      // 3) 숨김/등장: Intro top0 + 일정이상 내려간 뒤, 아래로 "누적" HIDE_DIST 내리면 숨김 / 위로 SHOW_DIST 올리면 등장
      if (introTop <= -vh * HIDE_AFTER) {
        const dy = y - lastY
        if (dy > 0) {
          downAccum += dy
          upAccum = 0
          if (downAccum > HIDE_DIST) hidden = true
        } else if (dy < 0) {
          upAccum -= dy
          downAccum = 0
          if (upAccum > SHOW_DIST) hidden = false
        }
      } else {
        hidden = false
        downAccum = 0
        upAccum = 0
      }
      h.style.transition = `transform ${hidden ? HIDE_DUR : SHOW_DUR} cubic-bezier(0.4, 0, 0.2, 1)`
      h.style.transform = hidden ? 'translateY(-100%)' : 'translateY(0)'
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
      <header
        ref={headerRef}
        className={`${styles.header} ${!index ? styles.bgShown : ''} ${menuOpen ? styles.menuMode : ''}`}
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
          <span className={`${styles.arrow} ${menuOpen ? styles.arrowClose : ''}`} aria-hidden="true">
            <span className={styles.arrowShaft} />
            <span className={styles.arrowHead} />
          </span>
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
        </button>
      </header>
      <MenuOverlay open={menuOpen} onNavigate={() => setMenuOpen(false)} />
    </>
  )
}

export default Header
