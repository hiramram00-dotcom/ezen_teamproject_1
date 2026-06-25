import { Fragment, useRef, useEffect } from 'react'
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

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// 거리와 무관하게 일정한 시간·ease로 부드럽게 스크롤 (브라우저 기본 smooth는 멀수록 빨라져 정신없음).
// 도중에 사용자가 스크롤/키 입력하면 즉시 중단.
function smoothScrollTo(targetY) {
  const startY = window.scrollY
  const dist = targetY - startY
  if (Math.abs(dist) < 2) return

  // 모션 최소화 설정이면 즉시 이동
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, targetY)
    return
  }

  // 거리에 비례하되 600~1400ms로 제한 → 가까우면 짧게, 멀어도 과하지 않게
  const duration = Math.min(1400, Math.max(600, Math.abs(dist) * 0.5))
  let startTime = null
  let raf = 0

  const cleanup = () => {
    window.removeEventListener('wheel', onInterrupt)
    window.removeEventListener('touchstart', onInterrupt)
    window.removeEventListener('keydown', onInterrupt)
  }
  const onInterrupt = () => {
    if (raf) cancelAnimationFrame(raf)
    cleanup()
  }
  window.addEventListener('wheel', onInterrupt, { passive: true })
  window.addEventListener('touchstart', onInterrupt, { passive: true })
  window.addEventListener('keydown', onInterrupt)

  const step = (now) => {
    if (startTime === null) startTime = now
    const p = Math.min(1, (now - startTime) / duration)
    window.scrollTo(0, startY + dist * easeInOutCubic(p))
    if (p < 1) raf = requestAnimationFrame(step)
    else cleanup()
  }
  raf = requestAnimationFrame(step)
}

// target: 'top'은 최상단, 그 외엔 해당 섹션 id로 위로 스크롤
const NAV = [
  { label: '브랜드', target: 'top' },
  { label: '빛의 철학', target: 'intro' },
  { label: '제품', target: 'products' },
  { label: '공간 큐레이션', target: 'showroom' },
  { label: '콜라보', target: 'collabo' },
]

function Footer({
  hidePhoto = false,
  hideBody = false,
  photo = footerTop,
  photoPosition = 'center', // 사진 보이는 구간(object-position). 윗부분 더 보이려면 'center 15%' 등
  headingLines = ['Ilkwang Lighting has SHAPEd light', 'with passion and craftsmanship.'],
  contact = null, // 지정 시 네이버 링크 대신 이탤릭 안내문 표시: { lines: ['Please', 'Contact us'], href }
  email = 'INFO@ILKWDESIGN.com',
  emailHref = '#',
}) {
  const footerRef = useRef(null)
  const photoRef = useRef(null)
  const photoImgRef = useRef(null)
  const cardBgRef = useRef(null)
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
      // (hidePhoto면 사진 미렌더 → 이 트리거 생략)
      if (!hidePhoto && photoRef.current) {
        // 사진 + 블러 복사본(cardBg)을 함께 1.08배 확대 — 스크롤 연동(패럴랙스).
        // 둘이 같이 커져야 카드 안 블러가 뒤 사진과 계속 정렬된다(faux 블러라 가능).
        gsap.fromTo(
          [photoImgRef.current, cardBgRef.current],
          { scale: 1 },
          {
            scale: 1.08,
            ease: 'none',
            scrollTrigger: {
              trigger: photoRef.current,
              start: 'top 85%',
              end: 'center center',
              scrub: 1,
              refreshPriority: -1,
            },
          }
        )

        // 흰 카드: 아래에서 떠오르며 페이드인. 한 번 재생 후 유지(toggleActions:'play none none none')
        // → 스크롤 위로 올려도 안 사라진다(블러 사라지던 버그 수정). faux 블러라 카드 transform 무관.
        gsap.fromTo(
          cardRef.current,
          { yPercent: 60, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: photoRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
              refreshPriority: -1,
            },
          }
        )
      }

      // ───── 트리거 ② 푸터 본문(.body) ─────
      if (!hideBody && bodyRef.current) {
        gsap.fromTo(
          logoRef.current,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: bodyRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reset',
              refreshPriority: -1,
            },
          }
        )
      }
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
  }, [hidePhoto, hideBody])

  // 푸터 내비: 해당 섹션으로 일정 속도·부드러운 ease로 위로 스크롤 ('top'은 최상단)
  const handleNavClick = (e, target) => {
    e.preventDefault()
    if (target === 'top') {
      smoothScrollTo(0)
      return
    }
    const el = document.getElementById(target)
    if (!el) return
    smoothScrollTo(el.getBoundingClientRect().top + window.scrollY)
  }

  return (
    <div className={styles.footer} ref={footerRef}>
      {/* 비주얼 사진 + 흰 카드 오버레이 (footer_C / 778:521) — hidePhoto면 생략 */}
      {!hidePhoto && (
        <div className={styles.photo} ref={photoRef}>
          <img className={styles.photoImg} src={photo} alt="" loading="lazy" ref={photoImgRef} style={{ objectPosition: photoPosition }} />
          <div className={`${styles.card} ${contact ? styles.cardCompact : ''}`} ref={cardRef}>
            {/* faux backdrop-filter: 블러된 사진 복사본 + 흰 틴트 — backdrop-filter가 배포에서
                상위 transform 때문에 깨져, filter:blur로 직접 깐다(항상 작동) */}
            <img className={styles.cardBg} src={photo} alt="" aria-hidden="true" ref={cardBgRef} />
            <span className={styles.cardTint} aria-hidden="true" />
            <p className={styles.cardHeading}>
              {headingLines.map((line, i) => (
                <Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </p>
            {contact ? (
              <a className={styles.cardLink} href={contact.href} data-cursor="pointer">
                {contact.lines.map((line, i) => (
                  <Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
              </a>
            ) : (
              <a
                className={styles.cardLink}
                href="https://brand.naver.com/iklamp"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="pointer"
              >
                <span>Go to Naver Brand Store </span>
                <span className={styles.cardArrow}>→</span>
              </a>
            )}
            <a className={styles.cardEmail} href={emailHref}>{email}</a>
          </div>
        </div>
      )}

      {/* 크림 푸터 블록 */}
      {!hideBody && <footer className={styles.body} ref={bodyRef}>
        {/* 거대 워드마크 — 단일 SVG(#252525 = footer 색) */}
        <div className={styles.logo}>
          <img src={logoIlkw} alt="ILKW." ref={logoRef} />
        </div>

        <div className={styles.bottom}>
        <nav className={styles.nav} aria-label="푸터 내비게이션">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.target === 'top' ? '#' : `#${item.target}`}
              onClick={(e) => handleNavClick(e, item.target)}
              className={`${styles.navLink} fs-body-2`}
              style={{ fontFamily: 'var(--font-kr)', fontWeight: 300 }}
              data-cursor="pointer"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.divider} />

        <div className={styles.legal}>
          <p className={styles.legalText}>
            © 2026 일광전구 주식회사 &nbsp;·&nbsp; 서울 성동구 성수동 &nbsp;·&nbsp; 사업자
            123-45-12345 &nbsp;·&nbsp; 통신판매업 신고번호 123-456-7890
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
      </footer>}
    </div>
  )
}

export default Footer
