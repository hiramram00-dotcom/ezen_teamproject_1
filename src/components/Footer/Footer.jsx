import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logoIlkw from './assets/ilkw-logo.svg'
import footerTop from './assets/footer-top.webp'
import styles from './Footer.module.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * Footer (글로벌 컴포넌트)
 * 비주얼 사진 + 흰 카드 오버레이 + 거대 ILKW. 워드마크 + 내비 + 약관.
 * 페이지 하단에서 <Footer /> 하나로 사용.
 * Figma: 1차프로젝트-3조 / node 778:521(사진+카드) · 778:525(푸터)
 *
 * 스크롤 인터랙션:
 *  - 사진 섹션: 사진 살짝 확대 + 흰 카드 떠오름
 *  - 푸터 본문: 워드마크 로고가 왼쪽부터 써지듯 리빌
 */

const NAV = [
  { label: '브랜드', href: '#brand' },
  { label: '빛의 철학', href: '#philosophy' },
  { label: '제품', href: '#products' },
  { label: '공간 큐레이션', href: '#space' },
  { label: '쇼룸', href: '#showroom' },
]

function Footer() {
  const footerRef = useRef(null)
  const photoRef = useRef(null)
  const photoImgRef = useRef(null)
  const cardRef = useRef(null)
  const bodyRef = useRef(null)
  const logoRef = useRef(null)

  useEffect(() => {
    // 모션 최소화 설정이면 애니메이션 생략
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // ───── 트리거 ① 사진 섹션(.photo) ─────
      // 사진 섹션이 화면에 들어올 때 — 스크롤 연동(scrub)으로 진행.
      // 사진: 살짝 확대 / 흰 카드: 아래에서 제자리로 떠오름 (함께 진행)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: photoRef.current,
          start: 'top 85%', // 사진 top이 화면 85% 지점에 닿으면 시작
          end: 'center center', // 사진 중앙이 화면 중앙에 닿으면 끝
          scrub: 1,
          // 히어로 핀(늦게 생성, 페이지 높이 증가)보다 나중에 위치 계산하도록 강제.
          refreshPriority: -1,
        },
      })

      tl.fromTo(
        photoImgRef.current,
        { scale: 1 },
        { scale: 1.08, ease: 'none', duration: 1 },
        0
      ).fromTo(
        cardRef.current,
        { yPercent: 60, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, ease: 'none', duration: 1 },
        0
      )

      // ───── 트리거 ② 푸터 본문(.body) ─────
      // 푸터 본문에 진입하면 워드마크 로고가 왼쪽 → 오른쪽으로 써지듯 리빌.
      // clip-path inset의 오른쪽 값을 100% → 0%으로 줄여 왼쪽부터 드러냄.
      gsap.fromTo(
        logoRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          ease: 'none',
          scrollTrigger: {
            trigger: bodyRef.current,
            start: 'top 85%', // 본문 top이 화면 85% 지점에 닿으면 시작
            end: 'top 40%', // 본문 top이 화면 40% 지점에 닿으면 끝 (페이지 끝 전 완료)
            scrub: 1,
            refreshPriority: -1,
          },
        }
      )
    }, footerRef)

    // 푸터는 긴 페이지 맨 아래 — 위쪽 콘텐츠가 늦게 로드되며 높이가 바뀌면
    // 트리거 위치가 어긋날 수 있어 로드/지연/높이변화 때마다 재계산.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t1 = window.setTimeout(refresh, 600)
    const t2 = window.setTimeout(refresh, 1800)

    let debounce
    const ro = new ResizeObserver(() => {
      window.clearTimeout(debounce)
      debounce = window.setTimeout(refresh, 200)
    })
    ro.observe(document.body)

    return () => {
      window.removeEventListener('load', refresh)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(debounce)
      ro.disconnect()
      ctx.revert()
    }
  }, [])

  return (
    <div className={styles.footer} ref={footerRef}>
      {/* 비주얼 사진 + 흰 카드 오버레이 (footer_C / 778:521) */}
      <div className={styles.photo} ref={photoRef}>
        <img className={styles.photoImg} src={footerTop} alt="" loading="lazy" ref={photoImgRef} />
        <div className={styles.card} ref={cardRef}>
          <p className={styles.cardHeading}>
            Ilkwang Lighting has SHAPEd light
            <br />
            with passion and craftsmanship.
          </p>
          <a
            className={styles.cardLink}
            href="https://brand.naver.com/iklamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Go to Naver Brand Store </span>
            <span className={styles.cardArrow}>→</span>
          </a>
          <a className={styles.cardEmail} href="#">INFO@ILKWDESIGN.com</a>
        </div>
      </div>

      {/* 크림 푸터 블록 */}
      <footer className={styles.body} ref={bodyRef}>
        {/* 거대 워드마크 — 단일 SVG(#252525 = footer 색) */}
        <div className={styles.logo}>
          <img src={logoIlkw} alt="ILKW." ref={logoRef} />
        </div>

        <div className={styles.bottom}>
        <nav className={styles.nav} aria-label="푸터 내비게이션">
          {NAV.map((item) => (
            <a key={item.label} href={item.href} className={`${styles.navLink} type-body-3`}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.divider} />

        <div className={styles.legal}>
          <p className={styles.legalText}>
            © 2026 일광전구 주식회사 &nbsp;·&nbsp; 서울 성동구 성수동 &nbsp;·&nbsp; 사업자
            000-00-00000 &nbsp;·&nbsp; 통신판매업 신고번호 000-000-0000
          </p>
          <p className={styles.legalText}>
            <a href="#privacy" className={styles.legalLink}>
              Privacy Policy
            </a>
            &nbsp;·&nbsp;
            <a href="#terms" className={styles.legalLink}>
              Terms of Use
            </a>
          </p>
        </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
