import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './CollaboGallerySection.module.css'
import ScrollHint from '../../components/ScrollHint/ScrollHint'
import ilkwLogo from '../../assets/common/logo/ilkw-black.svg'
import img1 from './assets/collabo-list-1.webp'
import img2 from './assets/collabo-list-2.webp'
import img3 from './assets/collabo-list-3.webp'
import img4 from './assets/collabo-list-4.webp'
import img5 from './assets/collabo-list-5.webp'
import img6 from './assets/collabo-list-6.webp'
// 브랜드 로고 SVG — 룰렛(CollaboLandingSection)에서 쓴 것 재활용
import logoKakao from '../CollaboDetailSection/assets/kakao-logo.svg'
import logoKbp from '../CollaboDetailSection/assets/kittybunnypony-logo.svg'
import logoWarmgrey from '../CollaboDetailSection/assets/warmgrey-logo.svg'
import logoHankyoreh from '../CollaboDetailSection/assets/hangyeore-logo.svg'
import logoChilsung from '../CollaboDetailSection/assets/chilsung-logo.svg'
import logoKanu from '../CollaboDetailSection/assets/kanu-logo.svg'

/**
 * CollaboGallerySection — 콜라보 컬렉션 (룰렛 다음 화면)
 * Figma: 1차프로젝트-3조 / node 1837:2 (레이아웃) · 1853:2 (호버 로고 락업)
 * "COLLABO with ILKW." 헤더 + 6개 세로 패널 가로 배치.
 * 인터랙션(expanding gallery): 한 패널에 호버하면 그 패널이 커지고 나머지는 어두워지며 작아짐.
 *  호버한 패널 정중앙에 "ILKW 로고 × 브랜드 로고" 락업 표시. 클릭 시 상세로 이동.
 *  ※ 사진(collabo-list-1~6)·브랜드 매핑은 임시 — 필요 시 교체.
 *  objPos: 호버 전(좁은 패널) 사진에서 보일 가로 위치. 3·4번째는 왼쪽 부분이 보이게.
 */
// 순서: 카카오 · 웜그레이 · 키티버니 · 칠성 · 카누 · 한겨레 (사진 collabo-list-1~6 순)
// logoScale: 락업 브랜드 로고 개별 확대 배율(작게 보이는 로고 보정). 칠성 로고는 키움.
const COLLABOS = [
  { brand: 'KAKAO FRIENDS', img: img1, logo: logoKakao, to: '/collabo-detail/kakao' },
  { brand: '웜그레이테일', img: img2, logo: logoWarmgrey, to: '/collabo-detail' },
  { brand: 'KITTY BUNNY PONY', img: img3, logo: logoKbp, objPos: '37% center', to: '/collabo-detail' },
  { brand: '칠성사이다', img: img4, logo: logoChilsung, objPos: '30% center', logoScale: 1.4, to: '/collabo-detail/kakao' },
  { brand: 'KANU', img: img5, logo: logoKanu, to: '/collabo-detail' },
  { brand: '한겨레', img: img6, logo: logoHankyoreh, to: '/collabo-detail/kakao' },
]

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const PANEL_RISE = 1000 // 패널이 더 아래에서 떠오르도록 시작 오프셋(px)

function CollaboGallerySection() {
  const wrapRef = useRef(null)
  const headRef = useRef(null)
  const panelsRef = useRef(null)

  // 타이틀(화면 중앙→스크롤하면 위로) + 패널(아래에서 떠오름) — 핀 고정 스크롤 모션
  // (홈 화면 CollaboSection의 핀 패턴과 동일한 방식)
  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const head = headRef.current
    const panels = panelsRef.current
    if (!wrap || !head || !panels) return

    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isMobile || reduce) {
      head.classList.add(styles.headIn)
      return
    }

    const riseOf = () => Math.max(0, window.innerHeight / 2 - (head.offsetTop + head.offsetHeight / 2))

    // 초기(스크롤 0) 상태를 동기적으로 먼저 잡아둔다: 타이틀은 화면 중앙에 위치한 채
    // 곧바로 블러인 — 룰렛에서 넘어오자마자(스크롤 전) 타이틀이 비어 보이지 않도록.
    head.style.transform = `translateY(${riseOf()}px)`
    panels.style.transform = `translateY(${PANEL_RISE}px)`
    panels.style.opacity = '0'
    const revealId = requestAnimationFrame(() => head.classList.add(styles.headIn))

    let raf = 0
    let isVisible = false

    const frame = () => {
      raf = 0
      if (!isVisible) return

      const rect = wrap.getBoundingClientRect()
      const vh = window.innerHeight
      const total = wrap.offsetHeight - vh
      const scrolled = Math.min(total, Math.max(0, -rect.top))
      const aP = ease(clamp01(scrolled / Math.max(1, total * 0.85)))

      // 타이틀: 화면 중앙에서 시작 → 스크롤하면 원래(상단) 위치로 상승 (등장은 위에서 이미 처리)
      head.style.transform = `translateY(${(1 - aP) * riseOf()}px)`

      // 패널: 아래에서 떠오르며 페이드인
      panels.style.transform = `translateY(${(1 - aP) * PANEL_RISE}px)`
      panels.style.opacity = String(clamp01(aP / 0.85))

      // 스크롤 힌트: 처음 30vh 만큼 스크롤하는 동안 서서히 사라짐
      wrap.style.setProperty('--hint-fade', String(1 - clamp01(scrolled / (vh * 0.3))))

      raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible && !raf) raf = requestAnimationFrame(frame)
        else if (!isVisible && raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { threshold: 0 },
    )
    io.observe(wrap)

    return () => {
      cancelAnimationFrame(revealId)
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  return (
    <section className={styles.gallery} ref={wrapRef} aria-label="ILKW 콜라보 컬렉션">
      <div className={styles.stickyInner}>
        <header className={styles.head} ref={headRef}>
          <p className={styles.title}>
            <span className={`${styles.titleCollabo} type-title-5`}>COLLABO</span>
            <span className={`${styles.titleWith} type-italic-6`}>with</span>
            <img className={styles.titleIlkw} src={ilkwLogo} alt="ILKW" />
          </p>
          <p className={`${styles.subtitle} type-body-4`}>일광전구와 함께한 협업 컬렉션을 소개합니다.</p>
        </header>

        {/* 첫 화면 하단 가운데 스크롤 안내 — 스크롤하면 서서히 사라짐(--hint-fade) */}
        <div className={styles.scrollCue}>
          <ScrollHint />
        </div>

        {/* expanding gallery — 6개 세로 패널 */}
        <div className={styles.panels} ref={panelsRef}>
          {COLLABOS.map((c) => (
            <Link
              key={c.brand}
              to={c.to}
              className={styles.panel}
              aria-label={`ILKW × ${c.brand} 자세히 보기`}
              data-cursor="pointer"
            >
              <img
                className={styles.panelImg}
                src={c.img}
                alt={`ILKW × ${c.brand}`}
                style={{ '--obj-pos': c.objPos || 'center' }}
              />
              {/* 호버 시 정중앙에 ILKW 로고 × 브랜드 로고 (Figma 1853:2) */}
              <span className={styles.panelLockup}>
                <img className={styles.lockIlkw} src={ilkwLogo} alt="" />
                <span className={styles.lockX} aria-hidden="true">x</span>
                <img
                  className={styles.lockBrand}
                  src={c.logo}
                  alt=""
                  style={
                    c.logoScale
                      ? { transform: `scale(${c.logoScale})`, marginTop: 'clamp(4px, 0.4vw, 8px)' }
                      : undefined
                  }
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CollaboGallerySection
