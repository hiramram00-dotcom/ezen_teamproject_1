import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './HeroSection.module.css'

gsap.registerPlugin(ScrollTrigger)
import lampImg from '../../assets/hero/hero-pendant.png'
import iLetter from '../../assets/hero/ilkw-i.svg'
import lLetter from '../../assets/hero/ilkw-l.svg'
import kLetter from '../../assets/hero/ilkw-k.svg'
import wLetter from '../../assets/hero/ilkw-w.svg'

const CTA_TEXT = 'CLICK TO ENTER'

// ===== CTA 트레일 스프링 튜닝 =====
const STIFFNESS = 0.5
const DAMPING = 0.4
const OFFSET_X = 26
const OFFSET_Y = 12
const MAX_V = 45

function HeroSection() {
  const heroRef = useRef(null)
  const lampRef = useRef(null)
  const lettersRef = useRef([])        // CTA 글자
  const cursorRef = useRef({ x: -2000, y: -2000 })
  const stateRef = useRef([])
  const primedRef = useRef(false)
  const logoRef = useRef(null)
  const logoLettersRef = useRef([])    // ILKW 글자
  const sparkleRef = useRef(null)
  const spotlightRef = useRef(null)
  const [revealed, setRevealed] = useState(false)

  // CTA 글자 트레일 (클릭 전에만)
  useEffect(() => {
    if (revealed) return
    const letters = lettersRef.current.filter(Boolean)
    if (!letters.length) return

    const widths = letters.map((el) => el.offsetWidth)
    primedRef.current = false
    stateRef.current = letters.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }))
    const st = stateRef.current
    letters.forEach((el) => { el.style.transform = 'translate(-9999px, -9999px)' })

    let raf
    const loop = () => {
      if (!primedRef.current) {
        raf = requestAnimationFrame(loop)
        return
      }
      for (let i = 0; i < letters.length; i++) {
        const tx = i === 0 ? cursorRef.current.x + OFFSET_X : st[i - 1].x + widths[i - 1]
        const ty = i === 0 ? cursorRef.current.y + OFFSET_Y : st[i - 1].y
        st[i].vx = (st[i].vx + (tx - st[i].x) * STIFFNESS) * DAMPING
        st[i].vy = (st[i].vy + (ty - st[i].y) * STIFFNESS) * DAMPING
        if (st[i].vx > MAX_V) st[i].vx = MAX_V
        else if (st[i].vx < -MAX_V) st[i].vx = -MAX_V
        if (st[i].vy > MAX_V) st[i].vy = MAX_V
        else if (st[i].vy < -MAX_V) st[i].vy = -MAX_V
        st[i].x += st[i].vx
        st[i].y += st[i].vy
        letters[i].style.transform = `translate(${st[i].x}px, ${st[i].y}px)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [revealed])

  // 마운트: 중앙정렬 + 인트로 전 스크롤 잠금 (클릭 전엔 못 내려가게)
  useEffect(() => {
    gsap.set(lampRef.current, { xPercent: -50 })
    gsap.set(logoRef.current, { xPercent: -50 })
    // 스크롤 잠금 — 스크롤바 폭만큼 padding 보정(잠금/해제 시 화면 안 밀리게)
    const sbw = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${sbw}px`
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [])

  // 스크롤 시퀀스 (pin + scrub): 램프 내려왔다 올라감 → 글씨 중앙 → 페이드아웃
  const setupScroll = () => {
    const lamp = lampRef.current
    const logo = logoRef.current
    if (!lamp || !logo) return
    document.body.style.overflow = ''        // 인트로 끝 → 스크롤 잠금 해제
    document.body.style.paddingRight = ''    // 보정 padding 제거(스크롤바 자리로 자연 복귀)
    const VH = window.innerHeight
    gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=2200',      // 시퀀스 스크롤 길이 (튜닝)
        pin: true,
        scrub: 1,
      },
    })
      // .to(lamp, { y: VH * 0.05, ease: 'none', duration: 0.4 })         // [보류] 살짝 내려옴 — 이미지 짤림 이슈, 이미지 교체 후 복구
      .to(lamp, { y: -VH * 0.95, ease: 'power1.in', duration: 1.4 })      // 램프 위로 사라짐
      .to(logo, { y: VH * 0.2, ease: 'none', duration: 1.2 }, '<')        // 램프 올라갈 때 글씨 중앙으로
      .to(logo, { y: VH * 0.26, ease: 'none', duration: 0.8 })           // 중앙 도착 후 좀 더 머물며 내려감(각인)
      .to(logo, { autoAlpha: 0, ease: 'none', duration: 0.6 })           // 그 다음 페이드아웃

    ScrollTrigger.refresh()   // 잠금 해제 후 스크롤 높이 재계산
  }

  const handleMouseMove = (e) => {
    const el = heroRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cursorRef.current = { x, y }
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)

    if (!primedRef.current) {
      const st = stateRef.current
      for (let i = 0; i < st.length; i++) {
        st[i].x = x; st[i].y = y; st[i].vx = 0; st[i].vy = 0
      }
      primedRef.current = true
    }
  }

  // 클릭 → 로고 조립 인터랙션 (GSAP 타임라인)
  const playIntro = () => {
    const [I, L, K, W] = logoLettersRef.current
    if (!I || !L || !K || !W) return
    const sparkle = sparkleRef.current
    const spotlight = spotlightRef.current
    const logo = logoRef.current

    const VW = window.innerWidth
    const VH = window.innerHeight
    // ===== 시작 위치 튜닝 =====
    const Y_TOP = -VH * 0.16   // IL 그룹 상단 시작
    const Y_BOT = VH * 0.30    // KW 그룹 하단 시작
    const OFF_L = -VW * 0.4    // 좌측 화면 밖
    const OFF_R = VW * 0.4     // 우측 화면 밖

    gsap.set(logo, { autoAlpha: 1 })
    gsap.set([I, L], { x: OFF_L, y: Y_TOP })  // I,L : 좌측 + 상단
    gsap.set([K, W], { x: OFF_R, y: Y_BOT })  // K,W : 우측 + 하단
    gsap.set(sparkle, { scale: 0, autoAlpha: 0, transformOrigin: 'center center' })

    const tl = gsap.timeline()
    // 1단계: 가로 조립 (x → 0)
    tl.to([I, L, K, W], { x: 0, duration: 1.5, ease: 'power2.out', stagger: 0.06 })
    // (살짝 텀 0.2s) → 2단계: 수직 합류 (y → 0) + 램프 페이드인(손전등 제거)
    tl.to([I, L, K, W], { y: 0, duration: 1.2, ease: 'power3.inOut', stagger: 0.05 }, '+=0.2')
    tl.to(spotlight, { autoAlpha: 0, duration: 1.2, ease: 'power2.out' }, '<+=0.3')
    // 3단계: 점 생성 (가운데서 빛처럼)
    tl.to(sparkle, { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, '+=0.15')
    // 인트로 끝 → 스크롤 시퀀스(pin) 준비
    tl.call(setupScroll)
    // 4단계: 반짝(은은한 호흡 반복)
    tl.to(sparkle, { autoAlpha: 0.5, duration: 1.8, ease: 'sine.inOut', repeat: -1, yoyo: true }, '+=0.05')
  }

  const handleClick = () => {
    if (revealed) return
    setRevealed(true)
    playIntro()
  }

  return (
    <section
      ref={heroRef}
      className={`${styles.hero} ${revealed ? styles.revealed : ''}`}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/* 펜던트 램프 */}
      <img ref={lampRef} className={styles.lamp} src={lampImg} alt="" aria-hidden="true" />

      {/* ILKW. 로고 — 클릭 시 GSAP로 조립 */}
      <div className={styles.logo} ref={logoRef} aria-label="ILKW">
        <img ref={(el) => (logoLettersRef.current[0] = el)} className={styles.letter} src={iLetter} alt="" aria-hidden="true" />
        <img ref={(el) => (logoLettersRef.current[1] = el)} className={styles.letter} src={lLetter} alt="" aria-hidden="true" />
        <img ref={(el) => (logoLettersRef.current[2] = el)} className={styles.letter} src={kLetter} alt="" aria-hidden="true" />
        <img ref={(el) => (logoLettersRef.current[3] = el)} className={styles.letter} src={wLetter} alt="" aria-hidden="true" />
        <span ref={sparkleRef} className={styles.sparkle} />
      </div>

      {/* 마우스 손전등 */}
      <div ref={spotlightRef} className={styles.spotlight} />

      {/* 커스텀 커서 — 빛점 */}
      <div className={styles.cursorDot} />

      {/* CLICK TO ENTER — 글자 트레일 (클릭 전) */}
      {!revealed && (
        <div className={styles.cta} aria-hidden="true">
          {CTA_TEXT.split('').map((ch, i) => (
            <span
              key={i}
              ref={(el) => (lettersRef.current[i] = el)}
              className={styles.ctaLetter}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}

export default HeroSection
