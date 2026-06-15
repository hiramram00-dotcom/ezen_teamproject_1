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
 *  - 사진: 뷰에 들어올 때 살짝 커졌다가 원래 크기로 (펄스)
 *  - 흰 카드: 조금 더 스크롤하면 아래에서 위로 떠오르며 등장
 */

const NAV = [
  { label: '브랜드', href: '#brand' },
  { label: '빛의 철학', href: '#philosophy' },
  { label: '제품', href: '#products' },
  { label: '공간 큐레이션', href: '#space' },
  { label: '쇼룸', href: '#showroom' },
]

function Footer() {
  const photoRef = useRef(null)
  const photoImgRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    // 모션 최소화 설정이면 애니메이션 생략
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // 사진: 뷰 진입 시 살짝 커졌다가 원래 크기로 (펄스)
      gsap
        .timeline({
          scrollTrigger: {
            trigger: photoRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reset',
          },
        })
        .fromTo(
          photoImgRef.current,
          { scale: 1 },
          { scale: 1.08, duration: 0.7, ease: 'power2.out' }
        )
        .to(photoImgRef.current, { scale: 1, duration: 0.9, ease: 'power2.inOut' })

      // 흰 카드: 조금 더 스크롤하면 아래에서 위로 떠오르며 등장
      gsap.fromTo(
        cardRef.current,
        { yPercent: 50, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: photoRef.current,
            start: 'top 45%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, photoRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className={styles.footer}>
      {/* 비주얼 사진 + 흰 카드 오버레이 (footer_C / 778:521) */}
      <div className={styles.photo} ref={photoRef}>
        <img className={styles.photoImg} src={footerTop} alt="" loading="lazy" ref={photoImgRef} />
        <div className={styles.card} ref={cardRef}>
          <p className={styles.cardHeading}>
            Ilkwang Lighting has SHAPEd light
            <br />
            with passion and craftsmanship.
          </p>
          <a className={styles.cardLink} href="#naver-store">
            <span>Go to Naver Brand Store </span>
            <span className={styles.cardArrow}>→</span>
          </a>
          <p className={styles.cardEmail}>INFO@ILKWDESIGN.com</p>
        </div>
      </div>

      {/* 크림 푸터 블록 */}
      <footer className={styles.body}>
        {/* 거대 워드마크 — 단일 SVG(#252525 = footer 색) */}
        <div className={styles.logo}>
          <img src={logoIlkw} alt="ILKW." />
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
