import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './HeroSection.module.css'

import iLetter from '../../assets/common/logo/ilkw-i.svg'
import lLetter from '../../assets/common/logo/ilkw-l.svg'
import kLetter from '../../assets/common/logo/ilkw-k.svg'
import wLetter from '../../assets/common/logo/ilkw-w.svg'

gsap.registerPlugin(ScrollTrigger)

// ===== 타이포 인트로 타이밍/위치 튜닝 (초) =====
const ROW_DROP = 0.56     // KW(아래 행) 내려가는 양 (뷰포트 높이 비율)
const APPEAR = 0.25       // 글자 페이드인
const P1_DUR = 0.45       // 1단계 가로(X) 이동
const GAP_AFTER_H = 0.12  // 가로 → 세로 사이 "사알짝 텀"
const P2_BOT_DUR = 0.5    // 2단계 밑줄(KW) 수직 상승
const KW_DELAY = 0.08     // K → W 살짝 시차

// ===== 영상 reveal (전구까지 자동 → 그 다음 스크롤로 밝힘) =====
const REVEAL_BULB_AT = 0.3   // 최종화면 → 전구 등장
const REVEAL_BULB_DUR = 0.9  // 전구 빛구멍 드러나는 속도
const REVEAL_SCROLL_VH = 1.3 // 빛 다 밝히는 데 필요한 스크롤 거리 (뷰포트 높이 배수)
const BULB_R = 14            // 전구 빛구멍 크기 (%)
const FULL_R = 165           // 완전 공개 (%)
const PLAY_AT = 0.88         // 영상 재생 시점 (스크롤 진행도 0~1 — 거의 다 밝아졌을 때)
const COMPLETE_AT = 0.97     // 이 진행도 넘으면 '완료'로 잠금 (이후 스크롤 업 해도 안 어두워짐)
const BOTTOM_ALPHA = 0.65    // 하단 로고 최종 불투명도(회색감)
const HERO_TO_INTRO_START = 0
const HERO_TO_INTRO_FADE_START = 0.96

const clamp01 = (x) => Math.min(1, Math.max(0, x))
const lerp = (a, b, t) => a + (b - a) * t
const smooth = (t) => t * t * (3 - 2 * t)

// 동작 줄이기(reduce-motion) 여부
const prefersReduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// 인트로 1회만 재생 — sessionStorage라 같은 탭 세션 내내 유지(F5에도 안 재생),
// 새 탭/세션이나 스토리지 클리어 시 리셋 → 첫 방문엔 보여주되 반복(뒤로가기·새로고침)은 막음.
const INTRO_KEY = 'ilkw_intro_played'
const introWasPlayed = () => {
  try { return sessionStorage.getItem(INTRO_KEY) === '1' } catch { return false }
}
const markIntroPlayed = () => {
  try { sessionStorage.setItem(INTRO_KEY, '1') } catch { /* 스토리지 차단 환경 무시 */ }
}

function HeroSection() {
  const heroRef = useRef(null)
  const logoRef = useRef(null)
  const lettersRef = useRef([])
  const copyRef = useRef(null)
  const filamentRef = useRef(null)
  const videoRef = useRef(null)
  const overlayRef = useRef(null)
  const bottomLogoRef = useRef(null)
  const hintRef = useRef(null)
  // 인트로를 스킵하는 경우(reduce-motion 또는 뒤로 재진입)엔 처음부터 done 상태로 시작
  // (effect 안에서 동기 setState 호출 → 불필요한 리렌더 경고 방지)
  const [introDone, setIntroDone] = useState(() => prefersReduced() || introWasPlayed())

  // 마운트: 로고 중앙정렬 + 인트로 동안 스크롤 잠금
  useEffect(() => {
    gsap.set(logoRef.current, { xPercent: -50 })
    gsap.set(bottomLogoRef.current, { xPercent: -50 })
    if (prefersReduced() || introWasPlayed()) return // 인트로 스킵 → 스크롤 잠그지 않음
    const sbw = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${sbw}px`
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [])

  useEffect(() => {
    const letters = lettersRef.current.filter(Boolean)
    const logo = logoRef.current
    const copy = copyRef.current
    const filament = filamentRef.current
    const video = videoRef.current
    const overlay = overlayRef.current
    const bottomLogo = bottomLogoRef.current
    const hint = hintRef.current
    if (letters.length < 4 || !logo) return
    if (video) gsap.set(video, { clearProps: 'position,inset,left,top,right,bottom,width,height,zIndex,borderRadius,transform,opacity,visibility' })

    let tl
    let scrollST
    let heroToIntroST
    let cancelled = false // StrictMode/언마운트 시 중복 실행·잔여 타임라인 방지
    const imgCleanups = []
    const setReveal = (v) => overlay && overlay.style.setProperty('--reveal', v + '%')
    const resetHeroVideo = () => {
      if (!video) return
      gsap.set(video, { clearProps: 'position,inset,left,top,right,bottom,width,height,zIndex,borderRadius,transform,opacity,visibility' })
    }
    const setupHeroToIntro = () => {
      if (!video) return
      const targetVideo = document.querySelector('[data-intro-hero-video]')
      const introStage = document.querySelector('[data-intro-stage]')
      if (!targetVideo || !introStage) return

      heroToIntroST && heroToIntroST.kill()
      heroToIntroST = ScrollTrigger.create({
        trigger: '#intro',
        start: 'top bottom',
        end: 'top top',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const raw = clamp01((self.progress - HERO_TO_INTRO_START) / (1 - HERO_TO_INTRO_START))
          const p = raw
          // 핀 고정 전엔 stage가 아직 sticky로 붙지 않아 화면상 top이 계속 움직인다.
          // stage 기준 상대 오프셋으로 환산해 "핀 고정됐다고 가정한" 안정적인 목표 위치를 구한다.
          const videoRectNow = targetVideo.getBoundingClientRect()
          const stageRectNow = introStage.getBoundingClientRect()
          const target = {
            left: videoRectNow.left,
            top: videoRectNow.top - stageRectNow.top,
            width: videoRectNow.width,
            height: videoRectNow.height,
          }
          const targetAlpha = smooth(clamp01((p - HERO_TO_INTRO_FADE_START) / (1 - HERO_TO_INTRO_FADE_START)))

          gsap.set(targetVideo, { opacity: targetAlpha })
          gsap.set(overlay, { autoAlpha: 1 - p })
          gsap.set(bottomLogo, { autoAlpha: (1 - p) * BOTTOM_ALPHA })
          if (p <= 0) {
            gsap.set(overlay, { clearProps: 'opacity,visibility' })
            resetHeroVideo()
            return
          }

          // width/height/left/top을 직접 바꾸면 매 프레임 레이아웃이 다시 계산되어
          // 리페인트 잔상(흐릿한 이전 프레임)이 남는다. 항상 풀스크린 크기를 유지한 채
          // transform(translate+scale)만 움직여 GPU 합성으로 처리 → 잔상 없음.
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
          gsap.set(overlay, { autoAlpha: 0 })
          gsap.set(bottomLogo, { autoAlpha: 0 })
          gsap.set(video, { autoAlpha: 0 })
        },
        onLeaveBack: () => {
          gsap.set(targetVideo, { opacity: 0 })
          gsap.set(overlay, { clearProps: 'opacity,visibility' })
          resetHeroVideo()
        },
      })
    }

    // 전구 등장 후 → 스크롤로 빛을 밝히는 단계로 핸드오프
    const setupScrollReveal = () => {
      if (cancelled) return
      // 인트로 끝 → 이제 영상 버퍼링 시작 (인트로 동안엔 안 받아서 초반 버벅임 방지)
      if (video) video.load()
      document.body.style.overflow = '' // 스크롤 허용
      document.body.style.paddingRight = ''
      gsap.set(hint, { autoAlpha: 1 }) // 스크롤 힌트 표시

      const dist = window.innerHeight * REVEAL_SCROLL_VH
      const clamp01 = (x) => Math.min(1, Math.max(0, x))
      let completed = false // 완전히 밝힌 뒤부터 잠금 (그 전엔 양방향 자연스크롤)

      const apply = (p) => {
        setReveal(BULB_R + (FULL_R - BULB_R) * p)            // 빛
        gsap.set(logo, { autoAlpha: 1 - clamp01(p / 0.3) })  // 위 로고 (앞 30%)
        gsap.set(hint, { autoAlpha: 1 - clamp01(p / 0.2) })  // 힌트 (앞 20%)
        const bp = clamp01((p - 0.7) / 0.3)                   // 하단 로고 (뒤 30%)
        gsap.set(bottomLogo, { autoAlpha: bp * BOTTOM_ALPHA, y: (1 - bp) * 18 })
      }

      scrollST = ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: `+=${dist}`,
        pin: true,
        onUpdate: (self) => {
          if (self.progress >= COMPLETE_AT) completed = true
          const p = completed ? 1 : self.progress // 완료 전엔 스크롤 따라(양방향), 완료 후 잠금
          apply(p)
          // 오버레이 충분히 걷히면(영상 보임) 헤더 등장 신호 / 다시 어두워지면 숨김
          document.body.dataset.heroRevealed = p > 0.8 ? 'true' : 'false'
          if (p > PLAY_AT && video && video.paused) video.play().catch(() => {})
        },
        onLeave: () => {
          completed = true
          setIntroDone(true)
        },
      })

      setupHeroToIntro()
      ScrollTrigger.refresh()
    }

    // 스킵(reduce-motion 또는 뒤로 재진입): 인트로 없이 최종 상태로 바로 (스크롤 잠금 X)
    if (prefersReduced() || introWasPlayed()) {
      gsap.set([logo, copy], { autoAlpha: 0 })
      gsap.set(bottomLogo, { autoAlpha: BOTTOM_ALPHA, y: 0 })
      gsap.set(hint, { autoAlpha: 0 })
      setReveal(FULL_R)
      if (video) video.play().catch(() => {})
      setupHeroToIntro()
      ScrollTrigger.refresh()
      document.body.dataset.heroRevealed = 'true' // 스킵 시 영상 바로 보임 → 헤더도 바로 등장
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      // introDone은 스킵일 때 초기값이 이미 true → 여기서 setState 불필요
      return
    }

    const build = () => {
      if (cancelled) return
      markIntroPlayed() // 이번 세션 인트로 재생 시작 → 이후(뒤로가기·새로고침) 스킵
      const logoCenter = logo.offsetWidth / 2
      const natCenter = letters.map((el) => el.offsetLeft + el.offsetWidth / 2)
      const DROP = window.innerHeight * ROW_DROP

      const startX = natCenter.map((c) => logoCenter - c)
      const startY = [0, 0, DROP, DROP]

      gsap.set(logo, { autoAlpha: 1 })
      letters.forEach((el, i) =>
        gsap.set(el, { x: startX[i], y: startY[i], autoAlpha: 0 }),
      )
      gsap.set(copy, { y: 24, autoAlpha: 0 })
      setReveal(0) // 오버레이 완전 검정

      const bulb = { v: 0 }
      const onBulb = () => setReveal(bulb.v)
      const p2Start = APPEAR + P1_DUR + GAP_AFTER_H
      const introEnd = p2Start + P2_BOT_DUR + KW_DELAY // ≈ 2.2s

      tl = gsap.timeline({ onComplete: setupScrollReveal })
      // ── 타이포 인트로 ──
      tl.to(letters, { autoAlpha: 1, duration: APPEAR, stagger: 0.04 }, 0)
      tl.to(copy, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power2.out' }, 0.1)
      // ── 한글 서브카피: 전구 필라멘트 빛이 가로로 지나가며 글자가 켜지듯 드러남 ──
      if (filament) {
        // 빛 라인이 화면을 가로질러 → 두 줄(영문·한글) 같이 켜짐
        tl.fromTo(copy, { '--sweep': 0 }, { '--sweep': 1, duration: 1.1, ease: 'power1.inOut' }, 0.5)
        tl.fromTo(filament, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.5)
        tl.to(filament, { autoAlpha: 0, duration: 0.28 }, 1.45) // 빛 라인 끝나면 사라짐
      }
      tl.to(letters, { x: 0, duration: P1_DUR, ease: 'power2.out' }, APPEAR)
      tl.to([letters[2], letters[3]], { y: 0, duration: P2_BOT_DUR, ease: 'power3.inOut', stagger: KW_DELAY }, p2Start)
      // ── 카피만 페이드아웃 → 전구 등장 (로고는 스크롤 전까지 유지) ──
      tl.to(copy, { autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, introEnd + 0.3)
      tl.to(bulb, { v: BULB_R, duration: REVEAL_BULB_DUR, ease: 'sine.inOut', onUpdate: onBulb }, introEnd + REVEAL_BULB_AT)
    }

    // 인트로 시작을 "메인 스레드가 한가해질 때"로 미룬다.
    // (페이지 로드 직후 다른 섹션들의 ScrollTrigger 초기화/리플로우가 메인 스레드를 ~1초 막아서,
    //  바로 시작하면 타임라인이 멈췄다가 GSAP가 경과시간만큼 '확' 순간이동(catch-up)함 → 그걸 방지)
    const startIntro = () => {
      if (cancelled) return
      const ric = window.requestIdleCallback || ((fn) => setTimeout(fn, 1))
      ric(() => { if (!cancelled) build() }, { timeout: 600 })
    }

    // SVG 로드 완료 후 측정 (큰 PNG-임베드 SVG는 비동기 로드 → 리스너 정리 필수)
    const ready = letters.every((el) => el.complete && el.naturalWidth > 0)
    if (ready) {
      startIntro()
    } else {
      let loaded = letters.filter((el) => el.complete && el.naturalWidth > 0).length
      const onLoad = () => {
        if (cancelled) return
        if (++loaded >= letters.length) startIntro()
      }
      letters.forEach((el) => {
        if (!(el.complete && el.naturalWidth > 0)) {
          el.addEventListener('load', onLoad, { once: true })
          imgCleanups.push(() => el.removeEventListener('load', onLoad))
        }
      })
    }

    return () => {
      cancelled = true
      imgCleanups.forEach((fn) => fn())
      tl && tl.kill()
      scrollST && scrollST.kill()
      heroToIntroST && heroToIntroST.kill()
      gsap.set(overlay, { clearProps: 'opacity,visibility' })
      resetHeroVideo()
    }
  }, [])

  return (
    <section id="hero" ref={heroRef} className={`${styles.hero} ${introDone ? styles.done : ''}`}>
      {/* 배경 영상 */}
      <video
        ref={videoRef}
        className={styles.video}
        src="https://res.cloudinary.com/dg9hg29hc/video/upload/0616_1_xt8vzh.mp4"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      />

      {/* 검정 오버레이 — 전구 위치에 빛구멍, --reveal 키우면 걷힘 */}
      <div ref={overlayRef} className={styles.overlay} aria-hidden="true" />

      {/* ILKW 워드마크 — 자동 조립 후 페이드아웃 */}
      <div className={styles.logo} ref={logoRef} aria-label="ILKW">
        <img ref={(el) => (lettersRef.current[0] = el)} className={styles.letter} src={iLetter} alt="" aria-hidden="true" />
        <img ref={(el) => (lettersRef.current[1] = el)} className={styles.letter} src={lLetter} alt="" aria-hidden="true" />
        <img ref={(el) => (lettersRef.current[2] = el)} className={styles.letter} src={kLetter} alt="" aria-hidden="true" />
        <img ref={(el) => (lettersRef.current[3] = el)} className={styles.letter} src={wLetter} alt="" aria-hidden="true" />
      </div>

      {/* 중앙 서브카피 */}
      <div className={styles.copy} ref={copyRef}>
        <p className={styles.copyEn}>We make Light</p>
        <p className={styles.copyKr}>빛이 머문 자리에, 온기가 남습니다</p>
        <span className={styles.filament} ref={filamentRef} aria-hidden="true" />
      </div>

      {/* 하단 로고 — 영상 위에 남는 작은 ILKW */}
      <div className={styles.bottomLogo} ref={bottomLogoRef} aria-label="ILKW">
        <img className={styles.letter} src={iLetter} alt="" aria-hidden="true" />
        <img className={styles.letter} src={lLetter} alt="" aria-hidden="true" />
        <img className={styles.letter} src={kLetter} alt="" aria-hidden="true" />
        <img className={styles.letter} src={wLetter} alt="" aria-hidden="true" />
      </div>

      {/* 하단중앙 스크롤 힌트 — 마우스 휠 인디케이터 */}
      <div ref={hintRef} className={styles.hint} aria-hidden="true">
        <span className={styles.mouse}>
          <span className={styles.wheel} />
        </span>
        <span className={styles.hintLabel}>Scroll</span>
      </div>
    </section>
  )
}

export default HeroSection
