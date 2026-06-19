import { useRef, useEffect, useState } from 'react'
import styles from './NewIntroSection_new.module.css'

import ilkwLogoBlack from '../../assets/common/logo/ilkw-black.svg'
import lamp from './assets/lamp.webp'
import story2 from './assets/story-2.webp'
import story3 from './assets/story-3.webp'

const VIDEO_MOBILE_Q = '(max-width: 767px)'
const VIDEO_WIDE = 'https://res.cloudinary.com/ddit4bjrw/video/upload/hero-video2_ojabtt.mp4'
const VIDEO_MOBILE = 'https://res.cloudinary.com/ddit4bjrw/video/upload/YTDown_YouTube_HELLO-SNOWMAN-SOLID-PORTABLE-ILKW-SNOWMA_Media_7Q9AIiPlFWQ_001_1080p_qnhlk1.mp4'
const pickVideoSrc = () => typeof window !== 'undefined' && window.matchMedia(VIDEO_MOBILE_Q).matches ? VIDEO_MOBILE : VIDEO_WIDE

/**
 * NewIntroSection — 브랜드 철학 인용 → 브랜드 스토리텔링 (핀 고정)
 * Figma: 1139:197(인용) → 1106:483·492·498(스토리텔링)
 *
 * 스크롤 인터랙션 (한 화면 안에서 진행):
 *  A. 인용문이 중앙에 고정된 뒤 단어가 하나씩 검정으로 채워짐.
 *  B. 인라인 램프가 커지며 검은 스토리 화면으로 확장(램프 외 요소는 멀어지는 깊이감).
 *  C. 가운데 사진이 위로 슬라이드되며 1·2·3 컷으로 교체(가운데 문구도 함께 교체).
 *  슬라이드3 이후 섹션이 핀에서 풀려 위로 스크롤되어 사라지고, 다음 마무리 섹션으로 이어진다.
 */
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const lerp = (a, b, t) => a + (b - a) * t
const smooth = (t) => t * t * (3 - 2 * t) // smoothstep
const TEXT_REVEAL_START = 0.34
const TEXT_REVEAL_END = 0.82
const HANDOFF_TEXT_REVEAL_MAX = 0.27
const CREAM = [255, 247, 234] // #FFF7EA
const BLACK = [0, 0, 0]
const mix = (a, b, t) =>
  `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(
    lerp(a[2], b[2], t)
  )})`

// 단어 색 채우기 — 인용문이 중앙에 멈춘(핀 고정) 뒤부터 진행 (스크롤 업 시 역재생)
// 전환 구간 (스크롤 진행도 p 기준)
const TEXT_REVEAL_SCROLL_RANGE = 0.56 // 단어 채우기에 필요한 스크롤 비율 (클수록 천천히 채워짐)
const GROW_START = 0.6 // 단어 채우기 완료 뒤 정지 구간을 두고 확대 시작
const GROW_END = 0.7 // 램프 확장 완료
const STORY_AT = 0.72 // 양옆/가운데 라벨 등장
const SLIDE_TRIGGERS = [0.84, 0.93] // 각 임계값을 넘을 때마다 다음 슬라이드로 자동 교체

function SlicedImage({ src, alt }) {
  return (
    <div
      className={styles.sliceImage}
      role="img"
      aria-label={alt}
      style={{ '--slice-image': `url(${src})` }}
    >
      <img className={styles.baseImage} src={src} alt="" aria-hidden="true" />
      <span className={styles.slice} aria-hidden="true" />
      <span className={styles.slice} aria-hidden="true" />
      <span className={styles.slice} aria-hidden="true" />
      <span className={styles.slice} aria-hidden="true" />
    </div>
  )
}

function NewIntroSectionNew() {
  const [videoSrc, setVideoSrc] = useState(pickVideoSrc)

  useEffect(() => {
    const mq = window.matchMedia(VIDEO_MOBILE_Q)
    const onChange = () => setVideoSrc(pickVideoSrc())
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const bgRef = useRef(null)
  const quoteRef = useRef(null)
  const word4Ref = useRef(null)
  const frameRef = useRef(null)
  const trackRef = useRef(null)
  const sideLabelsRef = useRef(null)
  const center1Ref = useRef(null)
  const center2Ref = useRef(null)
  const center3Ref = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const bg = bgRef.current
    const quote = quoteRef.current
    const word4 = word4Ref.current
    const frame = frameRef.current
    const track = trackRef.current
    const sideLabels = sideLabelsRef.current
    const centers = [center1Ref.current, center2Ref.current, center3Ref.current]
    const slides = Array.from(track.querySelectorAll(`.${styles.slide}`))

    const revealItems = Array.from(
      quote.querySelectorAll(`.${styles.reveal}:not(.${styles.initial})`)
    )
    const allRevealItems = Array.from(quote.querySelectorAll(`.${styles.reveal}`))

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      allRevealItems.forEach((item) => item.classList.add(styles.lit))
      section.style.height = 'auto'
      stage.style.position = 'static'
      quote.style.opacity = '1'
      quote.style.transform = 'translate(-50%, -50%)'
      quote.style.filter = 'none'
      word4.style.visibility = 'visible'
      frame.style.display = 'none'
      sideLabels.style.display = 'none'
      centers.forEach((el) => (el.style.display = 'none'))
      return
    }

    let metrics = null
    let raf = 0
    let lastLit = -1
    const measure = () => {
      const s = stage.getBoundingClientRect()
      const w = word4.getBoundingClientRect()
      const sw = stage.offsetWidth
      const sh = stage.offsetHeight
      const end =
        sw >= 1200
          ? { left: sw * 0.1854, top: sh * 0.1491, width: sw * 0.6286, height: sh * 0.6676 }
          : sw >= 768
            ? { left: sw * 0.08, top: sh * 0.22, width: sw * 0.84, height: sh * 0.56 }
            : { left: sw * 0.06, top: sh * 0.29, width: sw * 0.88, height: sh * 0.42 }
      metrics = {
        start: { left: w.left - s.left, top: w.top - s.top, width: w.width, height: w.height },
        end,
      }
    }

    const apply = () => {
      raf = 0
      if (!metrics) return
      const rectTop = section.getBoundingClientRect().top
      const dist = section.offsetHeight - stage.offsetHeight
      const p = clamp01(-rectTop / dist)
      const handoffProgress = clamp01((window.innerHeight - rectTop) / window.innerHeight)
      const handoffTextReveal =
        smooth(clamp01((handoffProgress - TEXT_REVEAL_START) / (TEXT_REVEAL_END - TEXT_REVEAL_START))) *
        HANDOFF_TEXT_REVEAL_MAX
      const pinnedTextReveal = clamp01(
        HANDOFF_TEXT_REVEAL_MAX + (p / TEXT_REVEAL_SCROLL_RANGE) * (1 - HANDOFF_TEXT_REVEAL_MAX)
      )
      const textReveal = Math.max(handoffTextReveal, pinnedTextReveal)
      const { end } = metrics

      quote.style.position = 'absolute'
      quote.style.top = '50%'
      quote.style.left = '50%'

      // ===== 단어 색 채우기: 중앙에 멈춘(핀 고정) 뒤부터 첫 단어부터 연한색→검정 =====
      const lit = Math.round(textReveal * revealItems.length)
      if (lit !== lastLit) {
        const lo = Math.min(lit, lastLit < 0 ? 0 : lastLit)
        const hi = Math.max(lit, lastLit < 0 ? 0 : lastLit)
        for (let i = lo; i < hi; i++) revealItems[i]?.classList.toggle(styles.lit, i < lit)
        lastLit = lit
      }

      // ===== Phase A: 램프 확장 (스크롤 연동) =====
      const gp = clamp01((p - GROW_START) / (GROW_END - GROW_START))
      const lp = smooth(gp)
      const wordReady = word4.classList.contains(styles.lit)
      const frameActive = wordReady && gp > 0
      const stageRect = stage.getBoundingClientRect()
      const wordRect = word4.getBoundingClientRect()
      const start = {
        left: wordRect.left - stageRect.left,
        top: wordRect.top - stageRect.top,
        width: wordRect.width,
        height: wordRect.height,
      }
      frame.style.left = `${lerp(start.left, end.left, lp)}px`
      frame.style.top = `${lerp(start.top, end.top, lp)}px`
      frame.style.width = `${lerp(start.width, end.width, lp)}px`
      frame.style.height = `${lerp(start.height, end.height, lp)}px`
      frame.style.opacity = frameActive ? '1' : '0'
      word4.style.opacity = frameActive ? '0' : ''

      // 램프 외 요소: 뒤로 멀어지듯 축소·블러·페이드
      const recede = smooth(gp)
      quote.style.opacity = String(clamp01(1 - gp / 0.9))
      quote.style.transform = `translate(-50%, -50%) scale(${lerp(1, 0.6, recede)})`
      quote.style.filter = `blur(${lerp(0, 5, recede)}px)`

      // 배경: 크림→검정
      bg.style.backgroundColor = mix(CREAM, BLACK, clamp01((gp - 0.1) / 0.6))

      // ===== Phase B: 임계값을 넘을 때마다 다음 슬라이드로 자동 교체 (CSS 트랜지션) =====
      const ready = p >= STORY_AT
      const splitActive = ready
      let idx = 0
      for (let i = 0; i < SLIDE_TRIGGERS.length; i++) if (p >= SLIDE_TRIGGERS[i]) idx = i + 1

      track.style.transform = 'none'
      track.classList.toggle(styles.splitActive, splitActive)
      slides.forEach((slide, j) => {
        slide.classList.toggle(styles.activeSlide, frameActive && j === idx)
      })
      sideLabels.style.opacity = ready ? '1' : '0'
      centers.forEach((el, j) => {
        if (!ready || j > idx) {
          el.style.opacity = '0'
          el.style.transform = 'translateY(60px)' // 아래에서 대기
        } else if (j < idx) {
          el.style.opacity = '0'
          el.style.transform = 'translateY(-60px)' // 위로 빠짐
        } else {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)' // 현재 슬라이드
        }
      })
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const onResize = () => {
      measure()
      apply()
    }

    measure()
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    const settle = window.setTimeout(onResize, 300)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
      window.clearTimeout(settle)
    }
  }, [])

  // 텍스트를 단어 단위 span으로 분해 (스크롤에 따라 단어가 하나씩 색이 채워진다)
  const T = (text, base, initialCount = 0) => {
    const out = []
    if (text.startsWith(' ')) out.push(' ')
    text
      .trim()
      .split(/\s+/)
      .forEach((w, i) => {
        if (i > 0) out.push(' ')
        const isInitial = i < initialCount
        out.push(
          <span
            key={`${base}${i}`}
            className={`${styles.ch} ${styles.reveal} ${
              isInitial ? `${styles.initial} ${styles.lit}` : ''
            }`}
          >
            {w}
          </span>
        )
      })
    if (text.endsWith(' ')) out.push(' ')
    return out
  }

  return (
    <section id="intro" ref={sectionRef} className={styles.intro} aria-label="ILKW 브랜드 철학">
      <div ref={stageRef} className={styles.stage} data-intro-stage>
        <div ref={bgRef} className={styles.bg} />
        <p ref={quoteRef} className={styles.quote}>
          <span className={styles.line}>
            {T('We think about every moment light', 'a')}
          </span>
          <span className={styles.line}>
            {T('becomes ', 'b')}
            <video
              data-intro-hero-video
              className={`${styles.word} ${styles.w1} ${styles.introHeroVideo}`}
              src={videoSrc}
              muted
              loop
              autoPlay
              playsInline
              preload="auto"
              aria-hidden="true"
            />
            {T(' part of life. Creating better', 'c')}
          </span>
          <span className={styles.line}>
            {T('light for people and the spaces ', 'd')}
            <img
              ref={word4Ref}
              className={`${styles.word} ${styles.w4} ${styles.slot} ${styles.reveal}`}
              src={lamp}
              alt=""
            />
            {T(' they', 'e')}
          </span>
          <span className={styles.line}>
            {T('inhabit— that is the value ', 'f')}
            <img
              className={`${styles.logoWord} ${styles.reveal}`}
              src={ilkwLogoBlack}
              alt="ILKW"
            />
            {T(' brings.', 'h')}
          </span>
        </p>

        {/* 자라나는 프레임 — 안에서 사진이 위로 슬라이드되며 교체 */}
        <div ref={frameRef} className={styles.frame}>
          <div ref={trackRef} className={styles.track}>
            <div className={`${styles.slide} ${styles.noSplit}`}>
              <SlicedImage src={lamp} alt="일광전구 포터블 조명을 든 손" />
            </div>
            <div className={styles.slide}>
              <SlicedImage src={story2} alt="조명을 포장하는 모습" />
            </div>
            <div className={styles.slide}>
              <SlicedImage src={story3} alt="공간에 스며든 조명" />
            </div>
          </div>
        </div>

        {/* 양옆 라벨 (고정) */}
        <div ref={sideLabelsRef} className={`${styles.labels} ${styles.sideLabels}`}>
          <span className={`${styles.label} ${styles.labelEn} ${styles.lbl1}`}>ILKWANG</span>
          <span className={`${styles.label} ${styles.labelEn} ${styles.lbl4}`}>LIGHTING</span>
        </div>
        {/* 가운데 문구 — 슬라이드1 */}
        <div ref={center1Ref} className={`${styles.labels} ${styles.centerSet}`}>
          <span className={`${styles.label} ${styles.labelKr} ${styles.lbl2}`}>세상을</span>
          <span className={`${styles.label} ${styles.labelKr} ${styles.lbl3}`}>밝히고</span>
        </div>
        {/* 가운데 문구 — 슬라이드2 */}
        <div ref={center2Ref} className={`${styles.labels} ${styles.centerSet}`}>
          <span className={`${styles.label} ${styles.labelKr} ${styles.lbl2}`}>일상을</span>
          <span className={`${styles.label} ${styles.labelKr} ${styles.lbl3}`}>채우고</span>
        </div>
        {/* 가운데 문구 — 슬라이드3 */}
        <div ref={center3Ref} className={`${styles.labels} ${styles.centerSet}`}>
          <span className={`${styles.label} ${styles.labelKr} ${styles.lbl2}`}>공간에</span>
          <span className={`${styles.label} ${styles.labelKr} ${styles.lbl3}`}>스며드는.</span>
        </div>
      </div>
    </section>
  )
}

export default NewIntroSectionNew
