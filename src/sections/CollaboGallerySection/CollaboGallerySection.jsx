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
import logoKakao from '../CollaboDetailSection/assets/kakao-logo-black.svg'
import logoKbp from '../CollaboDetailSection/assets/kittybunnypony-logo.svg'
import logoWarmgrey from '../CollaboDetailSection/assets/warmgrey-logo.svg'
import logoHankyoreh from '../CollaboDetailSection/assets/hangyeore-logo.svg'
import logoChilsung from '../CollaboDetailSection/assets/chilsung-logo.svg'
import logoKanu from '../CollaboDetailSection/assets/kanu-logo.svg'

const COLLABOS = [
  { display: 'Kakao Friends',    img: img1, logo: logoKakao,    logoAlt: 'KAKAO FRIENDS',    to: '/collabo-detail/kakao' },
  { display: 'Kitty Bunny Pony', img: img3, logo: logoKbp,      logoAlt: 'KITTY BUNNY PONY', to: '/collabo-detail' },
  { display: 'Hangyeore',        img: img6, logo: logoHankyoreh, logoAlt: '한겨레',            to: '/collabo-detail/kakao' },
  { display: 'Kanu',             img: img5, logo: logoKanu,      logoAlt: 'KANU',             to: '/collabo-detail' },
  { display: 'Warmgrey Tail',    img: img2, logo: logoWarmgrey,  logoAlt: '웜그레이테일',      to: '/collabo-detail' },
  { display: 'Chilsung',         img: img4, logo: logoChilsung,  logoAlt: '칠성사이다',        to: '/collabo-detail/kakao' },
]

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp01 = (v) => Math.min(1, Math.max(0, v))

function CollaboGallerySection() {
  const wrapRef = useRef(null)
  const headRef = useRef(null)
  const listRef = useRef(null)

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const head = headRef.current
    const list = listRef.current
    if (!wrap || !head || !list) return

    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const reduce  = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isMobile || reduce) {
      head.classList.add(styles.headIn)
      list.classList.add(styles.listIn)
      return
    }

    // 타이틀: 화면 세로 중앙에서 시작해 스크롤하면 제자리(상단)로 올라감
    const riseOf = () =>
      Math.max(0, window.innerHeight / 2 - (head.offsetTop + head.offsetHeight / 2))

    const listRise = window.innerHeight

    head.style.transform = `translateY(${riseOf()}px)`
    list.style.transform = `translateY(${listRise}px)`
    list.style.opacity = '0'

    const revealId = requestAnimationFrame(() => head.classList.add(styles.headIn))

    // 리스트가 100vh를 넘어 잘리는 양 — 레이아웃 안정 후 한 번만 계산
    let listOverflow = 0
    requestAnimationFrame(() => {
      listOverflow = Math.max(
        0,
        list.offsetTop + list.scrollHeight - window.innerHeight,
      )
    })

    let raf = 0
    let isVisible = false

    const frame = () => {
      raf = 0
      if (!isVisible) return

      const rect  = wrap.getBoundingClientRect()
      const vh    = window.innerHeight
      const total = wrap.offsetHeight - vh
      const scrolled = Math.min(total, Math.max(0, -rect.top))
      const aP = ease(clamp01(scrolled / Math.max(1, total * 0.85)))

      // Phase 1 (aP 0→0.5): 타이틀 중앙→자연 위치, 리스트 아래에서 올라옴
      // Phase 2 (aP 0.5→1): 타이틀+리스트가 한 덩어리로 위로 패닝 → 하단 행 노출
      const pan = aP > 0.5 ? listOverflow * (aP * 2 - 1) : 0

      // 타이틀도 aP=0.5에 자연 위치 도달 → 리스트와 동일 타이밍으로 phase1 완료
      head.style.transform = `translateY(${(1 - Math.min(aP, 0.5) * 2) * riseOf() - pan}px)`

      let listTY
      if (aP <= 0.5) {
        listTY = listRise * (1 - aP * 2)
      } else {
        listTY = -pan
      }
      list.style.transform = `translateY(${listTY}px)`
      list.style.opacity   = String(clamp01(aP * 2))

      wrap.style.setProperty('--hint-fade', String(1 - clamp01(scrolled / (vh * 0.3))))

      raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible && !raf)  raf = requestAnimationFrame(frame)
        else if (!isVisible && raf) { cancelAnimationFrame(raf); raf = 0 }
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

        <div className={styles.scrollCue}>
          <ScrollHint />
        </div>

        <ul className={styles.list} ref={listRef}>
          {COLLABOS.map((c) => (
            <li key={c.display}>
              <Link
                to={c.to}
                className={styles.row}
                aria-label={`ILKW × ${c.logoAlt} 자세히 보기`}
                data-cursor="pointer"
              >
                <span className={styles.rowName}>{c.display}</span>

                <span className={styles.rowPhotoWrap} aria-hidden="true">
                  <img className={styles.rowPhotoImg} src={c.img} alt="" />
                </span>

                <img className={styles.rowLogo} src={c.logo} alt={c.logoAlt} />
              </Link>
            </li>
          ))}
        </ul>

      </div>
    </section>
  )
}

export default CollaboGallerySection
