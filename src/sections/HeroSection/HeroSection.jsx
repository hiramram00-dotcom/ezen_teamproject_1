import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './HeroSection.module.css'

import ilkwLogo from '../../assets/common/logo/ilkw.svg' // 합쳐진 완성형(커닝 정확)

gsap.registerPlugin(ScrollTrigger)

// ===== 타이밍(초) — 전부 자동 진행 =====
const SWEEP_AT = 0.4 // 혜성 빛 시작
const SWEEP_DUR = 1.2 // 혜성이 지나가며 서브카피 등장
const SPLIT_GAP = 0.3 // 혜성 끝 → 분할 시작 사이 텀 (2배)
const SPLIT_DUR = 0.85 // 화면 위/아래로 갈라지는 시간 (텀 늘린 만큼 줄임)

// ===== 영상 소스 — 모바일(≤767px)은 세로 버전으로 교체 =====
const VIDEO_MOBILE_Q = '(max-width: 767px)'
// f_auto,q_auto = 브라우저 맞는 가벼운 포맷 + 화질 자동 최적화 (원본 13.9MB → 대폭 감소, 로딩 렉 해결)
const VIDEO_WIDE = 'https://res.cloudinary.com/ddit4bjrw/video/upload/f_auto,q_auto:eco,w_1280/hero-video2_ojabtt.mp4'
const VIDEO_MOBILE = 'https://res.cloudinary.com/ddit4bjrw/video/upload/f_auto,q_auto:eco,w_720/YTDown_YouTube_HELLO-SNOWMAN-SOLID-PORTABLE-ILKW-SNOWMA_Media_7Q9AIiPlFWQ_001_1080p_qnhlk1.mp4'
// poster = 영상 첫 프레임(so_0)을 가벼운 JPG로 추출 → 영상 디코딩 전에 즉시 표시(LCP 단축).
// 연출 변화 없음(첫 프레임과 동일 그림). 영상 재생 시작되면 자동으로 사라짐.
const VIDEO_WIDE_POSTER = 'https://res.cloudinary.com/ddit4bjrw/video/upload/f_auto,q_auto,w_1280,so_0/hero-video2_ojabtt.jpg'
const VIDEO_MOBILE_POSTER = 'https://res.cloudinary.com/ddit4bjrw/video/upload/f_auto,q_auto,w_720,so_0/YTDown_YouTube_HELLO-SNOWMAN-SOLID-PORTABLE-ILKW-SNOWMA_Media_7Q9AIiPlFWQ_001_1080p_qnhlk1.jpg'
const pickVideoSrc = () =>
  window.matchMedia(VIDEO_MOBILE_Q).matches ? VIDEO_MOBILE : VIDEO_WIDE

const prefersReduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
const HERO_TO_INTRO_FADE_START = 0.96
const clamp01 = (x) => Math.min(1, Math.max(0, x))
const lerp = (a, b, t) => a + (b - a) * t
const smooth = (t) => t * t * (3 - 2 * t)

// 인트로 1회만 — sessionStorage (F5·뒤로가기 스킵, 새 탭/세션 리셋)
const INTRO_KEY = 'ilkw_intro_played'
const introWasPlayed = () => {
  try { return sessionStorage.getItem(INTRO_KEY) === '1' } catch { return false }
}
const markIntroPlayed = () => {
  try { sessionStorage.setItem(INTRO_KEY, '1') } catch { /* 스토리지 차단 무시 */ }
}
// 새로고침(F5/Cmd-R) 여부 — reload일 땐 같은 세션이라도 인트로를 새 탭처럼 다시 재생
const isReload = () => {
  try {
    const nav = performance.getEntriesByType('navigation')[0]
    return nav ? nav.type === 'reload' : false
  } catch { return false }
}

function HeroSection() {
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  const panelTopRef = useRef(null)
  const panelBottomRef = useRef(null)
  const filamentRef = useRef(null)
  const logoRef = useRef(null)

  // 모바일(≤767px)이면 세로 영상으로 교체 (리사이즈/회전 시 자동 갱신)
  const [videoSrc, setVideoSrc] = useState(pickVideoSrc)
  const posterSrc = videoSrc === VIDEO_MOBILE ? VIDEO_MOBILE_POSTER : VIDEO_WIDE_POSTER
  useEffect(() => {
    const mq = window.matchMedia(VIDEO_MOBILE_Q)
    const onChange = () => setVideoSrc(pickVideoSrc())
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

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

    // 스킵(reduce-motion / 같은 세션 내 재방문): 인트로 없이 최종 상태(영상 + 로고)
    // ※ 새로고침(F5)이면 introWasPlayed여도 스킵하지 않고 인트로를 새 탭처럼 풀 재생
    if (prefersReduced() || (introWasPlayed() && !isReload())) {
      gsap.set(panelTop, { yPercent: -100 })
      gsap.set(panelBottom, { yPercent: 100 })
      gsap.set(filament, { autoAlpha: 0 })
      gsap.set(hero, { '--sweep': 1 })
      playVideo()
      return
    }

    // 새로고침 시 브라우저가 직전 스크롤 위치를 복원해 hero를 지나치지 않도록 맨 위로
    window.scrollTo(0, 0)

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

  useEffect(() => {
    const video = videoRef.current
    const logo = logoRef.current
    if (!video || prefersReduced()) return

    let transitionST
    const resetHeroVideo = () => {
      gsap.set(video, {
        clearProps:
          'position,inset,left,top,right,bottom,width,height,zIndex,borderRadius,transform,opacity,visibility',
      })
    }

    const setupHeroToIntro = () => {
      const targetVideo = document.querySelector('[data-intro-hero-video]')
      const introStage = document.querySelector('[data-intro-stage]')
      const introQuote = targetVideo?.closest('p')
      if (!targetVideo || !introStage) return

      transitionST && transitionST.kill()
      transitionST = ScrollTrigger.create({
        trigger: '#intro',
        start: 'top bottom',
        end: 'top top',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = clamp01(self.progress)
          const videoRectNow = targetVideo.getBoundingClientRect()
          const stageRectNow = introStage.getBoundingClientRect()
          const quoteIsFixed = introQuote && window.getComputedStyle(introQuote).position === 'fixed'
          const target = {
            left: videoRectNow.left,
            top: quoteIsFixed ? videoRectNow.top : videoRectNow.top - stageRectNow.top,
            width: videoRectNow.width,
            height: videoRectNow.height,
          }
          const targetAlpha = smooth(
            clamp01((p - HERO_TO_INTRO_FADE_START) / (1 - HERO_TO_INTRO_FADE_START))
          )

          gsap.set(targetVideo, { opacity: targetAlpha })
          if (logo) gsap.set(logo, { autoAlpha: p > 0.01 ? 0 : 1 })
          if (p <= 0) {
            resetHeroVideo()
            return
          }

          gsap.set(video, {
            position: 'fixed',
            left: 0,
            top: 0,
            right: 'auto',
            bottom: 'auto',
            width: window.innerWidth,
            height: window.innerHeight,
            xPercent: 0,
            yPercent: 0,
            transformOrigin: '0 0',
            x: lerp(0, target.left, p),
            y: lerp(0, target.top, p),
            scaleX: lerp(1, target.width / window.innerWidth, p),
            scaleY: lerp(1, target.height / window.innerHeight, p),
            borderRadius: 0,
            zIndex: 30,
            autoAlpha: 1 - targetAlpha,
          })
        },
        onLeave: () => {
          gsap.set(targetVideo, { opacity: 1 })
          gsap.set(video, { autoAlpha: 0 })
          if (logo) gsap.set(logo, { autoAlpha: 0 })
        },
        onLeaveBack: () => {
          gsap.set(targetVideo, { opacity: 0 })
          if (logo) gsap.set(logo, { clearProps: 'opacity,visibility' })
          resetHeroVideo()
        },
        // 방어: 새로고침/refresh 시 핸드오프 구간 밖(progress 0)이면 영상 깨끗이 리셋
        // → 새로고침으로 영상이 fixed·반투명 중간상태로 박히는 현상 방지
        onRefresh: (self) => {
          if (self.progress <= 0) {
            resetHeroVideo()
            if (logo) gsap.set(logo, { autoAlpha: 1 })
          }
        },
      })
    }

    setupHeroToIntro()
    const refreshId = window.setTimeout(() => {
      setupHeroToIntro()
      ScrollTrigger.refresh()
    }, 300)

    return () => {
      window.clearTimeout(refreshId)
      transitionST && transitionST.kill()
      resetHeroVideo()
    }
  }, [])

  return (
    <section id="hero" ref={heroRef} className={styles.hero}>
      {/* 배경 영상 (패널 뒤) */}
      <video
        ref={videoRef}
        className={styles.video}
        src={videoSrc}
        poster={posterSrc}
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
        <p className={styles.copyKr}>우리는 세상을 이롭게 하는 빛을 만듭니다</p>
      </div>

      {/* 혜성 빛 — 분할선(가운데)에서 가로로 지나감 */}
      <span className={styles.filament} ref={filamentRef} aria-hidden="true" />

      {/* 메인 로고 — 2배 크기, 등장 후 유지 */}
      <div className={styles.logo} ref={logoRef} aria-label="ILKW">
        <img className={styles.letter} src={ilkwLogo} alt="" aria-hidden="true" />
      </div>
    </section>
  )
}

export default HeroSection
