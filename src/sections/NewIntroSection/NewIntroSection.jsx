import { useRef, useEffect } from 'react'
import styles from './NewIntroSection.module.css'

import word1 from './assets/intro-word-1.webp'
import word2 from './assets/intro-word-2.webp'
import word3 from './assets/intro-word-3.webp'
import lamp from './assets/lamp.webp'
import story2 from './assets/story-2.webp'
import story3 from './assets/story-3.webp'
import makeLightBg from './assets/make-light-bg.webp'

/**
 * NewIntroSection — 브랜드 철학 인용 → 브랜드 스토리텔링 (핀 고정)
 * Figma: 1139:197(인용) → 1106:483(스토리1) → 1106:492(스토리2)
 *
 * 스크롤 인터랙션 (한 화면 안에서 진행):
 *  A. 인용 화면이 고정된 채 인라인 램프(word-4)가 커지며 검은 스토리 화면으로 확장.
 *     램프 외 요소는 축소·블러·페이드로 멀어져 "사진으로 빨려드는" 깊이감.
 *  B. 프레임·양옆 라벨(ILKWANG/LIGHTING)은 고정한 채, 가운데 사진이 위로 슬라이드되며
 *     다음 컷으로 교체되고 가운데 문구도 세상을/밝히고 → 일상을/채우고 로 바뀐다.
 */
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const lerp = (a, b, t) => a + (b - a) * t
const smooth = (t) => t * t * (3 - 2 * t) // smoothstep
const CREAM = [255, 247, 234] // #FFF7EA
const BLACK = [0, 0, 0]
const mix = (a, b, t) =>
  `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(
    lerp(a[2], b[2], t)
  )})`

// 단어 색 채우기 구간 (핀 고정 진행도 p 기준)
// 인용문이 중앙에 딱 멈춘(핀 고정) 뒤부터 스크롤하면 단어가 하나씩 채워진다.
// 스크롤 업 시에도 동일하게 역재생.
const FILL_P_END = 0.18 // 이 구간 동안 단어를 다 채움 (넓을수록 천천히)

// 전환 구간 (스크롤 진행도 p 기준)
const GROW_START = 0.24 // 단어 채우기 완료 뒤 정지 구간을 두고 확대 시작
const GROW_END = 0.32 // 램프 확장 완료 (스크롤 연동)
const STORY_AT = 0.32 // 양옆/가운데 라벨 등장 (확장 완료 시점)
const SLIDE_TRIGGERS = [0.47, 0.6] // 각 슬라이드 체류 구간을 넉넉히 (확확 넘어가지 않게)
// 아웃트로: 스토리3가 더 깊이 멀어진 뒤(축소·블러) → 마무리 사진이 떠오르고 → 글씨가 아래에서 위로
const REVEAL_START = 0.76 // 스토리3 깊이 멀어짐 시작
const RECEDE_END = 0.87 // 스토리3 충분히 멀어진 지점
const PHOTO_START = 0.85 // 사진 밝아짐 시작 (깊이 들어간 뒤)
const PHOTO_END = 0.93 // 사진 완전히 드러남
const TEXT_START = 0.93 // 마무리 글씨 등장 시작 (헤드라인)
const TEXT_END = 0.99 // 마무리 글씨 등장 완료
const DESC_DELAY = 0.025 // 헤드라인 뒤 본문("우리는~")이 따라 오르는 시차

function NewIntroSection() {
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
  const makeBgRef = useRef(null)
  const makeOverlayRef = useRef(null)
  const makeTextRef = useRef(null)
  const makeHeadlineRef = useRef(null)
  const makeDescRef = useRef(null)

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
    const makeBg = makeBgRef.current
    const makeOverlay = makeOverlayRef.current
    const makeText = makeTextRef.current
    const makeHeadline = makeHeadlineRef.current
    const makeDesc = makeDescRef.current

    const chars = Array.from(quote.querySelectorAll(`.${styles.ch}`))

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      // 모션 최소화: 인용문은 검정으로 바로 채우고, 스토리 연출 생략
      chars.forEach((ch) => ch.classList.add(styles.lit))
      section.style.height = 'auto'
      stage.style.position = 'static'
      word4.style.visibility = 'visible'
      frame.style.display = 'none'
      sideLabels.style.display = 'none'
      centers.forEach((el) => (el.style.display = 'none'))
      makeBg.style.display = 'none'
      makeOverlay.style.display = 'none'
      makeText.style.display = 'none'
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
      metrics = {
        // 시작: 인라인 word-4 슬롯 (스테이지 기준 좌표)
        start: { left: w.left - s.left, top: w.top - s.top, width: w.width, height: w.height },
        // 끝: Figma 1106:486 박스 (356,161,1207,721 / 1920×1080)
        end: { left: sw * 0.1854, top: sh * 0.1491, width: sw * 0.6286, height: sh * 0.6676 },
      }
    }

    const apply = () => {
      raf = 0
      if (!metrics) return
      const rectTop = section.getBoundingClientRect().top
      const dist = section.offsetHeight - stage.offsetHeight
      const p = clamp01(-rectTop / dist)
      const { start, end } = metrics

      // ===== 단어 색 채우기: 중앙에 멈춘(핀 고정) 뒤부터 단어가 하나씩 연한색→검정 =====
      const lit = Math.round(clamp01(p / FILL_P_END) * chars.length)
      if (lit !== lastLit) {
        const lo = Math.min(lit, lastLit < 0 ? 0 : lastLit)
        const hi = Math.max(lit, lastLit < 0 ? 0 : lastLit)
        for (let i = lo; i < hi; i++) chars[i]?.classList.toggle(styles.lit, i < lit)
        lastLit = lit
      }

      // ===== Phase A: 램프 확장 (스크롤 연동) =====
      // GROW_START 전까지는 gp=0 → 인용문이 그대로 머물다가 확대 시작
      const gp = clamp01((p - GROW_START) / (GROW_END - GROW_START))
      const lp = smooth(gp)
      frame.style.left = `${lerp(start.left, end.left, lp)}px`
      frame.style.top = `${lerp(start.top, end.top, lp)}px`
      frame.style.width = `${lerp(start.width, end.width, lp)}px`
      frame.style.height = `${lerp(start.height, end.height, lp)}px`
      frame.style.opacity = '1'

      // 램프 외 요소: 뒤로 멀어지듯 축소·블러·페이드
      const recede = smooth(gp)
      quote.style.opacity = String(clamp01(1 - gp / 0.9))
      quote.style.transform = `translate(-50%, -50%) scale(${lerp(1, 0.6, recede)})`
      quote.style.filter = `blur(${lerp(0, 5, recede)}px)`

      // 배경: 크림→검정
      bg.style.backgroundColor = mix(CREAM, BLACK, clamp01((gp - 0.1) / 0.6))

      // ===== Phase B: 임계값을 넘을 때마다 다음 슬라이드로 자동 교체 (CSS 트랜지션) =====
      const ready = p >= STORY_AT
      let idx = 0
      for (let i = 0; i < SLIDE_TRIGGERS.length; i++) if (p >= SLIDE_TRIGGERS[i]) idx = i + 1

      track.style.transform = `translateY(${-idx * 100}%)`

      // ===== 아웃트로: 스토리3가 더 깊이 멀어진 뒤 → 마무리 사진 등장 =====
      const recedeP = smooth(clamp01((p - REVEAL_START) / (RECEDE_END - REVEAL_START)))
      const photoP = smooth(clamp01((p - PHOTO_START) / (PHOTO_END - PHOTO_START)))
      const k = 1 - recedeP // 스토리(사진·라벨) 잔여 표시량

      // 스토리3 프레임: 더 깊이 멀어짐 (축소·블러·페이드)
      frame.style.opacity = String(k)
      frame.style.transform = `scale(${lerp(1, 0.45, recedeP)})`
      frame.style.filter = `blur(${lerp(0, 8, recedeP)}px)`

      // 마무리 사진: 깊이 들어간 뒤 어두운 상태 → 밝아짐 (밝은 전등 부분이 먼저)
      makeBg.style.opacity = String(clamp01((p - (PHOTO_START - 0.04)) / 0.04))
      makeBg.style.filter = `brightness(${lerp(0.06, 1, photoP)})`
      makeBg.style.transform = `scale(${lerp(0.72, 1, photoP)})` // 작았다가 커지는 모션
      makeOverlay.style.opacity = String(photoP)

      // 마무리 글씨: 사진이 드러난 뒤 아래에서 위로 — 헤드라인 먼저, 본문이 시차 두고 따라옴
      const headP = smooth(clamp01((p - TEXT_START) / (TEXT_END - DESC_DELAY - TEXT_START)))
      const descP = smooth(clamp01((p - (TEXT_START + DESC_DELAY)) / (TEXT_END - TEXT_START - DESC_DELAY)))
      makeHeadline.style.opacity = String(headP)
      makeHeadline.style.transform = `translateY(${lerp(48, 0, headP)}px)`
      makeDesc.style.opacity = String(descP)
      makeDesc.style.transform = `translateY(${lerp(48, 0, descP)}px)`

      // 양옆/가운데 라벨: 스토리와 함께 멀어지며 페이드
      sideLabels.style.opacity = ready ? String(k) : '0'
      centers.forEach((el, j) => {
        if (!ready || j > idx) {
          el.style.opacity = '0'
          el.style.transform = 'translateY(60px)' // 아래에서 대기
        } else if (j < idx) {
          el.style.opacity = '0'
          el.style.transform = 'translateY(-60px)' // 위로 빠짐
        } else {
          el.style.opacity = String(k)
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
  const T = (text, base) => {
    const out = []
    if (text.startsWith(' ')) out.push(' ')
    text
      .trim()
      .split(/\s+/)
      .forEach((w, i) => {
        if (i > 0) out.push(' ')
        out.push(
          <span key={`${base}${i}`} className={styles.ch}>
            {w}
          </span>
        )
      })
    if (text.endsWith(' ')) out.push(' ')
    return out
  }

  return (
    <section id="intro" ref={sectionRef} className={styles.intro} aria-label="ILKW 브랜드 철학">
      <div ref={stageRef} className={styles.stage}>
        <div ref={bgRef} className={styles.bg} />

        <p ref={quoteRef} className={styles.quote}>
          <span className={styles.line}>
            {T('We think ', 'a')}
            <img className={`${styles.word} ${styles.w1}`} src={word1} alt="" />
            {T(' about every moment light', 'b')}
          </span>
          <span className={styles.line}>
            {T('becomes part of life. ', 'c')}
            <img className={`${styles.word} ${styles.w2}`} src={word2} alt="" />
            {T(' Creating better', 'd')}
          </span>
          <span className={styles.line}>
            {T('light ', 'e')}
            <img className={`${styles.word} ${styles.w3}`} src={word3} alt="" />
            {T(' for people and the spaces they', 'f')}
          </span>
          <span className={styles.line}>
            {T('inhabit— that is the value ', 'g')}
            <img
              ref={word4Ref}
              className={`${styles.word} ${styles.w4} ${styles.slot}`}
              src={lamp}
              alt=""
            />{' '}
            <strong>{T('ILKW', 'h')}</strong>
            {T(' brings.', 'i')}
          </span>
        </p>

        {/* 자라나는 프레임 — 안에서 사진이 위로 슬라이드되며 교체 */}
        <div ref={frameRef} className={styles.frame}>
          <div ref={trackRef} className={styles.track}>
            <div className={styles.slide}>
              <img src={lamp} alt="일광전구 포터블 조명을 든 손" />
            </div>
            <div className={styles.slide}>
              <img src={story2} alt="조명을 포장하는 모습" />
            </div>
            <div className={styles.slide}>
              <img src={story3} alt="공간에 스며든 조명" />
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

        {/* 마무리 화면 (1106:489) — 스토리3가 멀어지며 뒤로 떠오름 */}
        <img ref={makeBgRef} className={styles.makeBg} src={makeLightBg} alt="" loading="lazy" />
        <div ref={makeOverlayRef} className={styles.makeOverlay} aria-hidden="true" />
        <div ref={makeTextRef} className={styles.makeText}>
          <h2 ref={makeHeadlineRef} className={styles.makeHeadline}>
            We Make <strong>LIGHT</strong>, ILKW.
          </h2>
          <p ref={makeDescRef} className={styles.makeDesc}>
            우리는 빛이 머무는 모든 순간을 생각합니다.
            <br />
            사람과 공간을 위한 더 나은 빛, 그것이 일광전구가 만드는 가치입니다.
          </p>
        </div>
      </div>
    </section>
  )
}

export default NewIntroSection
