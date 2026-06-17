import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import styles from './HeroSection.module.css'

import iLetter from '../../assets/common/logo/ilkw-i.svg'
import lLetter from '../../assets/common/logo/ilkw-l.svg'
import kLetter from '../../assets/common/logo/ilkw-k.svg'
import wLetter from '../../assets/common/logo/ilkw-w.svg'

// ===== 타이밍(초) — 전부 자동 진행 =====
const SWEEP_AT = 0.4 // 혜성 빛 시작
const SWEEP_DUR = 1.2 // 혜성이 지나가며 서브카피 등장
const SPLIT_GAP = 0.3 // 혜성 끝 → 분할 시작 사이 텀 (2배)
const SPLIT_DUR = 0.85 // 화면 위/아래로 갈라지는 시간 (텀 늘린 만큼 줄임)

const prefersReduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// 인트로 1회만 — sessionStorage (F5·뒤로가기 스킵, 새 탭/세션 리셋)
const INTRO_KEY = 'ilkw_intro_played'
const introWasPlayed = () => {
  try { return sessionStorage.getItem(INTRO_KEY) === '1' } catch { return false }
}
const markIntroPlayed = () => {
  try { sessionStorage.setItem(INTRO_KEY, '1') } catch { /* 스토리지 차단 무시 */ }
}

function HeroSection() {
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  const panelTopRef = useRef(null)
  const panelBottomRef = useRef(null)
  const filamentRef = useRef(null)
  const logoRef = useRef(null)

  useEffect(() => {
    const hero = heroRef.current
    const video = videoRef.current
    const panelTop = panelTopRef.current
    const panelBottom = panelBottomRef.current
    const filament = filamentRef.current
    if (!hero) return

    const playVideo = () => {
      if (video) video.play().catch(() => {}) // 미리 로드돼 있어 첫 프레임에서 바로 재생
      document.body.dataset.heroRevealed = 'true' // 헤더 등장 신호
    }

    // 스킵(reduce-motion / 뒤로·새로고침): 인트로 없이 최종 상태(영상 + 로고)
    if (prefersReduced() || introWasPlayed()) {
      gsap.set(panelTop, { yPercent: -100 })
      gsap.set(panelBottom, { yPercent: 100 })
      gsap.set(filament, { autoAlpha: 0 })
      gsap.set(hero, { '--sweep': 1 })
      playVideo()
      return
    }

    // 인트로 동안 스크롤 잠금
    const sbw = window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.overflow = 'hidden' // html이 스크롤 주체(global.css overflow-x:clip) → 여기 안 걸면 잠금 안 됨
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${sbw}px`

    gsap.set(hero, { '--sweep': 0 })
    gsap.set([panelTop, panelBottom], { yPercent: 0 })
    gsap.set(filament, { autoAlpha: 0 })

    const splitAt = SWEEP_AT + SWEEP_DUR + SPLIT_GAP

    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
        markIntroPlayed()
      },
    })

    // 1) 혜성 빛 스윕 → 서브카피 등장
    tl.fromTo(hero, { '--sweep': 0 }, { '--sweep': 1, duration: SWEEP_DUR, ease: 'power1.inOut' }, SWEEP_AT)
    tl.fromTo(filament, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, SWEEP_AT)
    tl.to(filament, { autoAlpha: 0, duration: 0.3 }, SWEEP_AT + SWEEP_DUR - 0.15)

    // 2) 화면 위/아래 분할 — 패널 걷히며 뒤의 영상·로고가 드러남 (서브카피는 패널 따라 사라짐)
    tl.to(panelTop, { yPercent: -100, duration: SPLIT_DUR, ease: 'power3.inOut' }, splitAt)
    tl.to(panelBottom, { yPercent: 100, duration: SPLIT_DUR, ease: 'power3.inOut' }, splitAt)

    // 3) 완전히 갈라지면 영상 재생
    tl.add(playVideo, splitAt + SPLIT_DUR - 0.2)

    return () => {
      tl.kill()
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [])

  return (
    <section id="hero" ref={heroRef} className={styles.hero}>
      {/* 배경 영상 (패널 뒤) */}
      <video
        ref={videoRef}
        className={styles.video}
        src="https://res.cloudinary.com/dg9hg29hc/video/upload/0616_1_xt8vzh.mp4"
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* 검정 패널 — 갈라지며 위로 (윗줄 카피 포함) */}
      <div className={styles.panelTop} ref={panelTopRef}>
        <p className={styles.copyEn}>We make Light</p>
      </div>
      {/* 검정 패널 — 갈라지며 아래로 (한글 카피 포함) */}
      <div className={styles.panelBottom} ref={panelBottomRef}>
        <p className={styles.copyKr}>빛이 머문 자리에, 온기가 남습니다</p>
      </div>

      {/* 혜성 빛 — 분할선(가운데)에서 가로로 지나감 */}
      <span className={styles.filament} ref={filamentRef} aria-hidden="true" />

      {/* 메인 로고 — 2배 크기, 등장 후 유지 */}
      <div className={styles.logo} ref={logoRef} aria-label="ILKW">
        <img className={styles.letter} src={iLetter} alt="" aria-hidden="true" />
        <img className={styles.letter} src={lLetter} alt="" aria-hidden="true" />
        <img className={styles.letter} src={kLetter} alt="" aria-hidden="true" />
        <img className={styles.letter} src={wLetter} alt="" aria-hidden="true" />
      </div>
    </section>
  )
}

export default HeroSection
