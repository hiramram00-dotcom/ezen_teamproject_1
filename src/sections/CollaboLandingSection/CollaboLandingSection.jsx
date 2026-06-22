import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CollaboLandingSection.module.css'
import ilkwLogo from '../../assets/common/logo/ilkw-black.svg'
import kakaoLogo from '../CollaboDetailSection/assets/kakao-logo.svg'
import kbpLogo from '../CollaboDetailSection/assets/kittybunnypony-logo.svg'
import hankyorehLogo from '../CollaboDetailSection/assets/hangyeore-logo.svg'
import kanuLogo from '../CollaboDetailSection/assets/kanu-logo.svg'
import warmgreyLogo from '../CollaboDetailSection/assets/warmgrey-logo.svg'
import chilsungLogo from '../CollaboDetailSection/assets/chilsung-logo.svg'

/**
 * CollaboLandingSection — 콜라보 랜딩 첫 화면 (메뉴 COLLABO → /collabo)
 * Figma: 1차프로젝트-3조 / node 1565:194 (1920×1080)
 * 크림 배경 정중앙 "ILKW × {브랜드}" 락업.
 * 카카오프렌즈 로고 자리(슬롯)에서 브랜드 로고들이 룰렛처럼 쫘라락 빠르게 돌다가
 * KAKAO FRIENDS에서 멈춘 뒤, 잠시 후 다음 화면으로 자동 이동한다.
 */

// 슬롯에서 순환할 브랜드 로고 — Figma 위→아래 순서(카카오프렌즈가 첫/마지막 정착)
// scale: 로고별 크기 조절값(1 = 기본). 키우려면 1.2, 줄이려면 0.8 처럼 이 숫자만 바꾸면 됨.
const BRANDS = [
  { src: kakaoLogo, alt: 'KAKAO FRIENDS', scale: 1 },
  { src: kbpLogo, alt: 'KITTY BUNNY PONY', scale: 1 },
  { src: hankyorehLogo, alt: '한겨레', scale: 1 },
  { src: kanuLogo, alt: 'KANU', scale: 1 },
  { src: warmgreyLogo, alt: 'WARMGREY TAIL', scale: 1.25 },
  { src: chilsungLogo, alt: '칠성사이다', scale: 1.25 },
]

// ▼▼ 룰렛이 멈춘 뒤 자동으로 이동할 다음 화면 ▼▼
//    콜라보 컬렉션 목록(Figma 1565:270). null로 바꾸면 이동 없이 멈춰만 있음.
const NEXT_ROUTE = '/collabo/list'

const LAPS = 1.5 // 룰렛 바퀴 수 (0.5 단위 가능). 1.5 = 한 바퀴 반
const HOLD_AFTER_MS = 120 // 멈춘 뒤 다음 화면으로 넘어가기까지 대기(ms) — 바로 이어지게 짧게

// LAPS바퀴 빠르게 돈 뒤 마지막 칸이 KAKAO가 되도록 reel 구성(끝=KAKAO 역산으로 시작 인덱스 결정)
const N = BRANDS.length
const STEPS = Math.round(LAPS * N) // 총 이동 칸 수
const START = ((-STEPS % N) + N) % N // 끝이 KAKAO(0)가 되도록 시작 인덱스
const REEL = Array.from({ length: STEPS + 1 }, (_, i) => BRANDS[(START + i) % N])
const END_INDEX = STEPS // 정착(KAKAO) 칸 인덱스

function CollaboLandingSection() {
  const lockupRef = useRef(null)
  const navigate = useNavigate()
  const navigateRef = useRef(navigate)
  useEffect(() => {
    navigateRef.current = navigate
  }, [navigate])

  useEffect(() => {
    const el = lockupRef.current
    if (!el) return
    // 등장(blur-in) 토글
    const id = requestAnimationFrame(() => el.classList.add(styles.isVisible))

    // 모션 최소화 환경: 룰렛이 없으니(애니메이션 미실행) 타이머로 다음 화면 이동 보장
    let t
    if (NEXT_ROUTE && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      t = window.setTimeout(() => navigateRef.current(NEXT_ROUTE), 1500)
    }
    return () => {
      cancelAnimationFrame(id)
      if (t) window.clearTimeout(t)
    }
  }, [])

  // 룰렛이 멈추면(reel 애니메이션 종료) 잠시 후 다음 화면으로 자동 이동
  const handleReelEnd = () => {
    if (!NEXT_ROUTE) return
    window.setTimeout(() => navigateRef.current(NEXT_ROUTE), HOLD_AFTER_MS)
  }

  return (
    <section className={styles.collabo} aria-label="ILKW 콜라보">
      <div className={styles.lockup} ref={lockupRef}>
        <img className={`${styles.ilkw} ${styles.fxBlurIn}`} src={ilkwLogo} alt="ILKW" />
        <span className={`${styles.x} ${styles.fxBlurIn}`} aria-hidden="true">x</span>

        {/* 룰렛 슬롯 — 카카오프렌즈 자리에서 브랜드 로고가 쫘라락 돌다가 KAKAO에서 멈춤 */}
        <div className={`${styles.slot} ${styles.fxBlurIn}`}>
          <ul
            className={styles.reel}
            style={{ '--end': END_INDEX }}
            onAnimationEnd={handleReelEnd}
          >
            {REEL.map((b, i) => (
              <li className={styles.cell} key={i}>
                <img
                  src={b.src}
                  alt={i === END_INDEX ? `ILKW × ${b.alt}` : ''}
                  aria-hidden={i === END_INDEX ? undefined : 'true'}
                  style={{ '--logo-scale': b.scale }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default CollaboLandingSection
