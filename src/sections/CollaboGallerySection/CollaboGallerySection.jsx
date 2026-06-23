import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './CollaboGallerySection.module.css'
import ilkwLogo from '../../assets/common/logo/ilkw-black.svg'
import img1 from './assets/collabo-list-1.png'
import img2 from './assets/collabo-list-2.png'
import img3 from './assets/collabo-list-3.jpg'
import img4 from './assets/collabo-list-4.jpg'
import img5 from './assets/collabo-list-5.png'
import img6 from './assets/collabo-list-6.png'
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

function CollaboGallerySection() {
  const sectionRef = useRef(null)
  const headRef = useRef(null)

  // 헤더(COLLABO with ILKW.) blur-in — 마운트되면 등장 (룰렛 다음 화면)
  useEffect(() => {
    const el = headRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add(styles.headIn)
      return
    }
    const id = requestAnimationFrame(() => el.classList.add(styles.headIn))
    return () => cancelAnimationFrame(id)
  }, [])

  // 갤러리(패널) 스크롤 진입 시 페이드업
  useEffect(() => {
    const root = sectionRef.current
    if (!root) return
    const els = root.querySelectorAll('[data-reveal]')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add(styles.inView))
      return
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle(styles.inView, e.isIntersecting)),
      { threshold: 0, rootMargin: '0px 0px -12% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className={styles.gallery} ref={sectionRef} aria-label="ILKW 콜라보 컬렉션">
      <header className={styles.head} ref={headRef}>
        <p className={styles.title}>
          <span className={styles.titleCollabo}>COLLABO</span>
          <span className={styles.titleWith}>with</span>
          <img className={styles.titleIlkw} src={ilkwLogo} alt="ILKW" />
        </p>
        <p className={styles.subtitle}>일광전구와 함께한 협업 컬렉션을 소개합니다.</p>
      </header>

      {/* expanding gallery — 6개 세로 패널 */}
      <div className={styles.panels} data-reveal>
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
                style={c.logoScale ? { transform: `scale(${c.logoScale})` } : undefined}
              />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CollaboGallerySection
