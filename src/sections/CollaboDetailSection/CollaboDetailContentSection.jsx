import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './CollaboDetailContentSection.module.css'
import ilkwWordmark from './assets/ilkw-wordmark.svg'

gsap.registerPlugin(ScrollTrigger)

/**
 * CollaboDetailContentSection — 콜라보 상세 본문 (공용, 히어로 아래로 스크롤 시 진입)
 * Figma: 1차프로젝트-3조 / node 1565:327(KBP), 1587:62(KAKAO) — 1920×4683
 * 레이아웃/여백/글씨크기는 공통. 콜라보별 데이터(props)만 다름.
 *
 * props:
 *  - titleWord: "LIGHT meets ___" 의 마지막 단어 (PATTERN / FRIENDS)
 *  - subtitle: 부제 한 줄
 *  - bodyLines: 본문 카피 줄 배열
 *  - brandLogo, brandAlt: 브랜드 로고
 *  - photos: [{ src, left, top, width, height }] (프레임 1920×4683 기준 %)
 *  - bodyTriggerIndex: 본문이 떠오르는 기준 사진 index (기본 1 = 2번째)
 *  - productUrl: "제품 보러가기" 링크
 *
 * 인터랙션: 타이틀 blur-in / 사진 아래→위 상승(GSAP ScrollTrigger) /
 *  본문은 2번째 사진 근처에서 blur-in 후 CSS sticky로 고정(사진이 뒤로 흐름),
 *  마지막 사진 끝에서 자연스럽게 풀림.
 */
function CollaboDetailContentSection({
  titleWord,
  subtitle,
  bodyLines = [],
  brandLogo,
  brandAlt = 'brand',
  logoAspect = '1 / 1',
  photos = [],
  bodyTriggerIndex = 1,
  productUrl = '#',
}) {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const bodyRef = useRef(null)
  const p2Ref = useRef(null) // 본문 등장 기준 사진

  // ----- 레이아웃 계산 (KBP 하단 여백을 모든 콜라보에 동일 적용) -----
  // 디자인 기준 프레임 1920×4683. KBP는 "마지막 사진 bottom ~ 프레임 끝" = 737px,
  // 그 안에 락업(+316px)·버튼(+456px)이 위치. 콜라보마다 마지막 사진이 낮아도
  // 프레임 높이를 "마지막 사진 bottom + 737px"로 늘려 동일한 하단 여백을 확보한다.
  // %는 늘어난 프레임에 맞춰 스케일 → 사진의 실제 픽셀 크기/위치는 보존됨.
  const BASE_H = 4683
  const BLOCK = 737
  const LOCKUP_OFFSET = 316
  const BUTTON_OFFSET = 456
  const TITLE_TOP = 6 // 타이틀 top (% of BASE_H)

  const triggerTop = photos[bodyTriggerIndex]?.top ?? 0
  const lastPhoto = photos[photos.length - 1]
  const lastBottomPct = lastPhoto ? lastPhoto.top + lastPhoto.height : 84.247
  const lastBottomPx = (lastBottomPct / 100) * BASE_H
  const totalH = lastBottomPx + BLOCK
  const scale = BASE_H / totalH

  const sectionStyle = { aspectRatio: `1920 / ${totalH}` }
  const titleStyle = { top: `${TITLE_TOP * scale}%` }
  const rangeStyle = {
    top: `${triggerTop * scale}%`,
    height: `${Math.max(0, lastBottomPct - triggerTop) * scale}%`,
  }
  const lockupStyle = { top: `${((lastBottomPx + LOCKUP_OFFSET) / totalH) * 100}%` }
  const ctaStyle = { top: `${((lastBottomPx + BUTTON_OFFSET) / totalH) * 100}%` }
  const photoStyle = (p) => ({
    left: `${p.left}%`,
    top: `${p.top * scale}%`,
    width: `${p.width}%`,
    height: `${p.height * scale}%`,
  })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = sectionRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      // 타이틀: blur-in
      gsap.fromTo(
        titleRef.current,
        { autoAlpha: 0, filter: 'blur(8px)' },
        {
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: titleRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      )

      // 사진: 아래에서 위로 (각자 진입 시) — ScrollTrigger가 위치를 캐싱해 떨림 없음
      root.querySelectorAll('[data-photo]').forEach((ph) => {
        gsap.fromTo(
          ph,
          { autoAlpha: 0, y: 80 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: { trigger: ph, start: 'top 88%', toggleActions: 'play none none reverse' },
          }
        )
      })

      // 본문: 기준 사진 근처에서 blur-in (고정은 CSS sticky가 담당)
      if (p2Ref.current) {
        gsap.fromTo(
          bodyRef.current,
          { autoAlpha: 0, filter: 'blur(8px)' },
          {
            autoAlpha: 1,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: { trigger: p2Ref.current, start: 'top 75%', toggleActions: 'play none none reverse' },
          }
        )
      }
    }, sectionRef)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = window.setTimeout(refresh, 800)
    return () => {
      window.removeEventListener('load', refresh)
      window.clearTimeout(t)
      ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} style={sectionStyle} aria-label={`ILKW × ${brandAlt}`}>
      {/* 타이틀 */}
      <div className={styles.titleBlock} ref={titleRef} style={titleStyle}>
        <p className={styles.title}>
          <span className={styles.enWord}>LIGHT</span>{' '}
          <span className={styles.itWord}>meets</span>{' '}
          <span className={styles.enWord}>{titleWord}</span>
        </p>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      {/* 흩뿌린 사진들 — 각자 스크롤 진입 시 아래에서 위로 (위치/사이즈는 데이터) */}
      {photos.map((p, i) => (
        <img
          key={i}
          ref={i === bodyTriggerIndex ? p2Ref : undefined}
          className={styles.photo}
          src={p.src}
          alt=""
          loading="lazy"
          data-photo
          style={photoStyle(p)}
        />
      ))}

      {/* 본문 카피 — sticky 범위 래퍼 안에서 고정 */}
      <div className={styles.stickyRange} style={rangeStyle}>
        <p className={styles.body} ref={bodyRef}>
          {bodyLines.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      </div>

      {/* 로고 락업 */}
      <div className={styles.lockup} style={lockupStyle}>
        <img className={styles.ilkw} src={ilkwWordmark} alt="ILKW" />
        <span className={styles.x} aria-hidden="true">x</span>
        <img className={styles.brandLogo} src={brandLogo} alt={brandAlt} style={{ aspectRatio: logoAspect }} />
      </div>

      {/* 제품 보러가기 — 외부 제품 페이지 */}
      <a className={styles.cta} style={ctaStyle} href={productUrl} target="_blank" rel="noopener noreferrer">
        제품 보러가기
      </a>
    </section>
  )
}

export default CollaboDetailContentSection
