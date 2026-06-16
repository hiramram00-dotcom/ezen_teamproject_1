import { useRef, useEffect } from 'react'
import styles from './NewIntroSection.module.css'

import word1 from './assets/intro-word-1.webp'
import word2 from './assets/intro-word-2.webp'
import word3 from './assets/intro-word-3.webp'
import lamp from './assets/lamp.webp'
import story2 from './assets/story-2.webp'
import story3 from './assets/story-3.webp'

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
const CREAM = [255, 247, 234] // #FFF7EA
const BLACK = [0, 0, 0]
const mix = (a, b, t) =>
  `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(
    lerp(a[2], b[2], t)
  )})`

// 단어 색 채우기 — 인용문이 중앙에 멈춘(핀 고정) 뒤부터 진행 (스크롤 업 시 역재생)
const FILL_P_END = 0.2

// 전환 구간 (스크롤 진행도 p 기준)
const GROW_START = 0.28 // 단어 채우기 완료 뒤 정지 구간을 두고 확대 시작
const GROW_END = 0.38 // 램프 확장 완료
const STORY_AT = 0.38 // 양옆/가운데 라벨 등장
const SLIDE_TRIGGERS = [0.55, 0.78] // 각 임계값을 넘을 때마다 다음 슬라이드로 자동 교체

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

    const chars = Array.from(quote.querySelectorAll(`.${styles.ch}`))

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      chars.forEach((ch) => ch.classList.add(styles.lit))
      section.style.height = 'auto'
      stage.style.position = 'static'
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
      // word4(인라인 램프)는 quote의 transform(scale)·blur 영향을 받으므로,
      // 스크롤이 내려간 상태(축소됨)에서 측정하면 시작 위치가 틀어진다.
      // 측정하는 동안만 quote를 기본 상태(scale 1, blur 0)로 되돌려 자연 위치를 읽는다.
      const prevTransform = quote.style.transform
      const prevFilter = quote.style.filter
      quote.style.transform = 'translate(-50%, -50%)'
      quote.style.filter = 'none'

      const s = stage.getBoundingClientRect()
      const w = word4.getBoundingClientRect()
      const sw = stage.offsetWidth
      const sh = stage.offsetHeight
      metrics = {
        start: { left: w.left - s.left, top: w.top - s.top, width: w.width, height: w.height },
        end: { left: sw * 0.1854, top: sh * 0.1491, width: sw * 0.6286, height: sh * 0.6676 },
      }

      // 원래 상태로 복원 (직후 apply()가 현재 스크롤 위치에 맞게 다시 설정)
      quote.style.transform = prevTransform
      quote.style.filter = prevFilter
    }

    const apply = () => {
      raf = 0
      if (!metrics) return
      const rectTop = section.getBoundingClientRect().top
      const dist = section.offsetHeight - stage.offsetHeight
      const p = clamp01(-rectTop / dist)
      const { start, end } = metrics

      // ===== 단어 색 채우기: 중앙에 멈춘(핀 고정) 뒤부터 첫 단어부터 연한색→검정 =====
      const lit = Math.round(clamp01(p / FILL_P_END) * chars.length)
      if (lit !== lastLit) {
        const lo = Math.min(lit, lastLit < 0 ? 0 : lastLit)
        const hi = Math.max(lit, lastLit < 0 ? 0 : lastLit)
        for (let i = lo; i < hi; i++) chars[i]?.classList.toggle(styles.lit, i < lit)
        lastLit = lit
      }

      // ===== Phase A: 램프 확장 (스크롤 연동) =====
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

    // 재측정 + 즉시 반영 (어긋났을 때 제자리로 복원)
    const remeasure = () => {
      measure()
      apply()
    }

    measure()
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    // 모든 리소스 로드 완료 시 한 번 더 (이미지 늦게 로드되며 줄바꿈 바뀌는 경우)
    window.addEventListener('load', remeasure)

    // 웹폰트 로드 후 텍스트가 리플로우되면 인라인 램프(word4) 위치가 바뀌므로 재측정
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(remeasure)
    }

    // 인용문 안 이미지(워드/램프)가 늦게 로드되어 위치가 바뀌는 경우 각각 재측정
    const imgs = Array.from(quote.querySelectorAll('img'))
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', remeasure)
    })

    // 레이아웃이 어떤 이유로든 바뀌면(폰트/이미지/리사이즈) 항상 다시 맞춤
    const ro = new ResizeObserver(remeasure)
    ro.observe(stage)
    ro.observe(quote)

    // 느린 환경 대비 지연 보정
    const settle1 = window.setTimeout(remeasure, 300)
    const settle2 = window.setTimeout(remeasure, 1200)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', remeasure)
      imgs.forEach((img) => img.removeEventListener('load', remeasure))
      ro.disconnect()
      if (raf) cancelAnimationFrame(raf)
      window.clearTimeout(settle1)
      window.clearTimeout(settle2)
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
      </div>
    </section>
  )
}

export default NewIntroSection
