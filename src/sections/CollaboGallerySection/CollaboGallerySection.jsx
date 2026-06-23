import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './CollaboGallerySection.module.css'
import ScrollHint from '../../components/ScrollHint/ScrollHint'
import ilkwLogo from '../../assets/common/logo/ilkw-black.svg'
import imgKakao from './assets/collabo-1.webp'
import imgKbp from './assets/collabo-2.webp'
import imgWarmgrey from './assets/collabo-3.webp'
import imgHankyoreh from './assets/collabo-4.webp'
import imgChilsung from './assets/collabo-5.webp'
import imgKanu from './assets/collabo-6.webp'

/**
 * CollaboGallerySection — 콜라보 컬렉션 목록 (룰렛 다음 화면)
 * Figma: 1차프로젝트-3조 / node 1565:270 (1920×…)
 * "COLLABO with ILKW." 헤더 + 6개 콜라보가 좌우 지그재그로 배치된 긴 스크롤 리스트.
 * 각 행: 사진 + "ILKW × {브랜드}" + 2줄 설명(#555). 스크롤 진입 시 페이드업.
 */

// Figma 위→아래 순서. 사진 비율(ar)·폭 비중(w, 리스트폭 1575 기준 %)은 디자인값.
const COLLABOS = [
  { brand: 'KAKAO FRIENDS', img: imgKakao, ar: '648 / 553', w: '41.14%', to: '/collabo-detail/kakao',
    desc: ['춘식이의 친근한 감성과 함께', '특별한 컬렉션을 선보였습니다.'] },
  { brand: 'KITTY BUNNY PONY', img: imgKbp, ar: '842 / 640', w: '53.46%', to: '/collabo-detail',
    desc: ['키티버니포니의 감각적인 패턴과 함께', '오래 머물고 싶은 공간을 함께 만들어갔습니다.'] },
  { brand: '웜그레이테일', img: imgWarmgrey, ar: '550 / 640', w: '34.92%', to: '/collabo-detail/kakao',
    desc: ['웜그레이테일만의 따뜻한 일러스트에', '일광전구의 빛을 더했습니다.'] },
  { brand: '한겨레', img: imgHankyoreh, ar: '842 / 640', w: '53.46%', to: '/collabo-detail',
    desc: ['빛은 공간을 밝히는 것을 넘어,', '연대의 상징이자 시대의 기록이 되었습니다.'] },
  { brand: '칠성사이다', img: imgChilsung, ar: '506 / 640', w: '32.13%', to: '/collabo-detail/kakao',
    desc: ['칠성사이다의 청량한 브랜드 감성과 함께', '그린 크리스마스를 선보였습니다.'] },
  { brand: 'KANU', img: imgKanu, ar: '512 / 640', w: '32.51%', to: '/collabo-detail',
    desc: ['커피 한 잔의 여유와 함께하는 빛.', '일상의 여유를 더욱 따뜻하게 만들었습니다.'] },
]

function CollaboGallerySection() {
  const sectionRef = useRef(null)
  const headRef = useRef(null)

  // 헤더(COLLABO with ILKW.) — 마운트되면 바로 가운데서 blur-in (룰렛 다음 화면)
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

  // 스크롤에 따라: ① 스크롤 힌트 페이드아웃 ② 배경 크림 → #fff (타이틀→리스트로 내려갈수록)
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const clamp01 = (v) => Math.min(1, Math.max(0, v))
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const y = window.scrollY
      // ① 힌트 페이드 (앞 30vh)
      el.style.setProperty('--hint-fade', String(1 - Math.min(1, y / (vh * 0.3))))
      // ② 배경: 크림(#FFF7EA=255,247,234) → 흰색(255,255,255). 0.15vh~0.8vh 구간 전환
      const bp = clamp01((y - vh * 0.15) / (vh * 0.65))
      el.style.backgroundColor = `rgb(255, ${Math.round(247 + 8 * bp)}, ${Math.round(234 + 21 * bp)})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // 스크롤 진입 시 행이 아래에서 페이드업
  useEffect(() => {
    const root = sectionRef.current
    if (!root) return
    const rows = root.querySelectorAll('[data-reveal]')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      rows.forEach((el) => el.classList.add(styles.inView))
      return
    }
    // 토글: 화면에 들어오면 나타나고 벗어나면 초기화 → 역(위로)스크롤로 다시 들어올 때도 재생.
    // 깜빡임 방지: threshold 0(진입/이탈 경계가 서로 멀어 들락날락 안 함) + 하단 rootMargin 버퍼로
    // 살짝 안쪽에서 나타나게 함(경계에서 미세 토글 방지).
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          e.target.classList.toggle(styles.inView, e.isIntersecting)
        })
      },
      { threshold: 0, rootMargin: '0px 0px -12% 0px' },
    )
    rows.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className={styles.gallery} ref={sectionRef} aria-label="ILKW 콜라보 컬렉션">
      <div className={styles.headWrap}>
        <header className={styles.head} ref={headRef}>
          <p className={styles.title}>
            <span className={styles.titleCollabo}>COLLABO</span>
            <span className={styles.titleWith}>with</span>
            <img className={styles.titleIlkw} src={ilkwLogo} alt="ILKW" />
          </p>
          <p className={styles.subtitle}>일광전구와 함께한 협업 컬렉션을 소개합니다.</p>
        </header>
        {/* 첫 화면(100vh) 하단 가운데 스크롤 안내 — 상세 페이지와 동일 위치. 스크롤하면 서서히 사라짐 */}
        <div className={styles.scrollCue}>
          <ScrollHint />
        </div>
      </div>

      <div className={styles.list}>
        {COLLABOS.map((c, i) => (
          <article
            key={c.brand}
            className={`${styles.row} ${i % 2 === 1 ? styles.right : ''}`}
            data-reveal
          >
            <Link
              to={c.to}
              className={styles.imageBox}
              style={{ '--img-w': c.w, '--img-ar': c.ar }}
              aria-label={`ILKW × ${c.brand} 자세히 보기`}
              data-cursor="pointer"
            >
              <img src={c.img} alt={`ILKW × ${c.brand}`} loading="lazy" />
              {/* 사진 호버 시 어두워지며 원형 화살표 등장 (홈 마퀴와 동일) */}
              <span className={styles.imageOverlay}>
                <span className={styles.goArrow}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="8 7 17 7 17 16" />
                  </svg>
                </span>
              </span>
            </Link>
            <div className={styles.text}>
              <p className={styles.brandLine}>
                <span className={styles.brandStrong}>ILKW</span>
                <span className={styles.brandX} aria-hidden="true">x</span>
                <span className={styles.brandStrong}>{c.brand}</span>
              </p>
              <p className={styles.desc}>
                {c.desc[0]}
                <br />
                {c.desc[1]}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CollaboGallerySection
