import { useEffect, useRef, useState } from 'react'
import styles from './SpacesSection.module.css'

import livingImg from '../../assets/spaces/spaces2-living.webp'
import livingOnImg from '../../assets/spaces/spaces2-living-on.webp'
import bedImg from '../../assets/spaces/spaces2-bed.webp'
import bedOnImg from '../../assets/spaces/spaces2-bed-on.webp'
import diningImg from '../../assets/spaces/spaces2-dining.webp'
import diningOnImg from '../../assets/spaces/spaces2-dining-on.webp'

const rooms = [
  {
    title: 'Living Room',
    image: livingImg,
    imageOn: livingOnImg,
    alt: '빈티지 텔레비전과 의자가 놓인 거실',
    caption: (
      <>
        머무르고, 쉬고, 대화를 나누는 거실.{' '}
        <br className={styles.brDesktop} />
        일광전구는 공간의 크기와 생활 방식을 살펴{' '}
        <br className={styles.brDesktop} />
        머무는 시간이 더욱 편안해지도록{' '}
        <br className={styles.brDesktop} />
        거실의 빛과 분위기를 완성합니다.
      </>
    ),
  },
  {
    title: 'Bed Room',
    image: bedImg,
    imageOn: bedOnImg,
    alt: '은은한 빛이 드는 침실의 침대',
    caption: (
      <>
        하루의 끝에는 밝음보다 편안함이 필요합니다.{' '}
        <br className={styles.brDesktop} />
        눈에 부담을 덜어주는 은은한 빛과{' '}
        <br className={styles.brDesktop} />
        차분하게 가라앉는 따뜻한 온기로,{' '}
        <br className={styles.brDesktop} />
        침실을 깊은 휴식의 공간으로 바꿉니다.
      </>
    ),
  },
  {
    title: 'Dining Room',
    image: diningImg,
    imageOn: diningOnImg,
    alt: '촛불이 켜진 다이닝 테이블',
    caption: (
      <>
        한 끼의 식사와 자연스러운 대화가 이어지는 곳.{' '}
        <br className={styles.brDesktop} />
        식탁 위에 고르게 머무는 따뜻한 빛이{' '}
        <br className={styles.brDesktop} />
        음식과 사람의 표정을 선명하게 비추고,{' '}
        <br className={styles.brDesktop} />
        함께하는 시간을 더욱 풍성하게 만듭니다.
      </>
    ),
  },
]

// 각 룸 사진 속 램프 실루엣 아이콘 (Living/Bed/Dining 순). viewBox 0 0 40 54 공통
const LAMP_ICONS = [
  // 0) 거실 — 2단 디스크 플로어 램프
  (
    <>
      <path d="M14 12.5Q20 7.5 26 12.5" />
      <path d="M9 18Q20 10 31 18" />
      <line x1="20" y1="18" x2="20" y2="46" />
      <ellipse cx="20" cy="47.5" rx="7" ry="2.3" />
    </>
  ),
  // 1) 침실 — 줄에 매달린 돔 펜던트
  (
    <>
      <line x1="20" y1="6" x2="20" y2="20" />
      <path d="M10 33C10 22 14 20 20 20C26 20 30 22 30 33Z" />
    </>
  ),
  // 2) 다이닝 — 주름진 둥근 셰이드 테이블 램프
  (
    <>
      <path d="M11 23Q11 13 20 13Q29 13 29 23Q29 32 20 32Q11 32 11 23Z" />
      <line x1="13" y1="18.5" x2="27" y2="18.5" />
      <line x1="12" y1="23" x2="28" y2="23" />
      <line x1="13.5" y1="28" x2="26.5" y2="28" />
      <line x1="20" y1="32" x2="20" y2="44" />
      <ellipse cx="20" cy="45.5" rx="5.5" ry="1.8" />
    </>
  ),
]

const clamp = (value, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max)

const easeInOutCubic = (value) =>
  value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2

// 진행도 구간: 텍스트 고정 → 검정 절반 등장(REVEAL) → 전체화면 확장(WIDEN) → 가로 패닝+조명 스윕
const REVEAL_START = 0.1
const REVEAL_END = 0.15
const WIDEN_END = 0.3
const CARD_MIN_SCALE = 0.05
// 스윕(조명 ON 라인) 구간이 룸 이동보다 몇 배 더 긴지 — 클수록 라인이 천천히 지나간다
const SWEEP_WEIGHT = 1.9
// 룸 간 이동(전환) 구간 비중 — 작을수록 더 스냅처럼 빠르게 다음 룸으로 넘어간다 (앞/뒤 양방향 동일)
const PAN_WEIGHT = 0.5
// 한 룸에 머무는 동안 앞뒤로 잠깐 멈추는 비율(앞=조명 OFF 정지, 뒤=조명 ON 정지)
const SWEEP_HOLD = 0.26
// 이 진행도에서 애니메이션 완료(Dining ON). 이후 끝까지는 고정 유지 + Collabo가 위로 올라옴
const ANIM_END = 0.85
// 고정 구간에서 Dining이 위로 드리프트하는 양(px) — 클수록 더 많이 올라감
const DINING_DRIFT = 200

function SpacesSection() {
  const rangeRef = useRef(null)
  const cardRef = useRef(null)
  const trackRef = useRef(null)
  const photoRefs = useRef([])
  const photoOnRefs = useRef([])
  const lineRefs = useRef([])
  const bulbRefs = useRef([])
  const handleRefs = useRef([])
  const panelTextRefs = useRef([])
  const frameRef = useRef(null)
  const introRef = useRef(null)
  const [introVisible, setIntroVisible] = useState(false)
  // 각 룸 텍스트(타이틀+캡션)의 진입 reveal 여부 (리렌더에도 유지되도록 상태로 관리)
  const [revealed, setRevealed] = useState(() => rooms.map(() => false))
  // 태블릿·모바일(≤1199px) = 세로 스택 모드. 가로 패닝용 "숨김" 초기 인라인 스타일을
  // 적용하지 않기 위한 플래그(리렌더 시 카드가 opacity:0으로 되돌아가 이미지가 사라지는 것 방지).
  const [isStacked, setIsStacked] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 1199px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1199px)')
    const onChange = (e) => setIsStacked(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const intro = introRef.current
    if (!intro) return

    const observer = new IntersectionObserver(
      (entries) => {
        setIntroVisible(entries[0].isIntersecting)
      },
      { threshold: 0.4 },
    )

    observer.observe(intro)
    return () => observer.disconnect()
  }, [])

  // 세로 스택(≤1199px) 전용: 각 룸 타이틀+캡션이 화면에 들어오면 fade-up 1회 reveal.
  // (데스크톱은 CSS에서 숨김 상태가 없어 항상 보임 → 기존 패닝 연출과 충돌 없음)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const i = panelTextRefs.current.indexOf(entry.target)
          if (i === -1) return
          // 진입하면 reveal, 화면을 벗어나면 reset → 다시 들어올 때 재생
          setRevealed((prev) => {
            if (prev[i] === entry.isIntersecting) return prev
            const next = [...prev]
            next[i] = entry.isIntersecting
            return next
          })
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -12% 0px' },
    )
    panelTextRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // 태블릿·모바일 전용: 이미지별 드래그 비교 슬라이더 (off 흑백 ↔ on 컬러)
  useEffect(() => {
    const mobileMq = window.matchMedia('(max-width: 1199px)')
    const cleanups = []

    const applySlider = (i, p) => {
      const img = photoOnRefs.current[i]
      const line = lineRefs.current[i]
      const handle = handleRefs.current[i]
      if (img) img.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`
      if (line) {
        line.style.left = `${p * 100}%`
        line.style.opacity = '1'
      }
      if (handle) handle.style.left = `${p * 100}%`
    }

    const teardown = () => {
      while (cleanups.length) cleanups.pop()()
    }

    const setup = () => {
      teardown()
      if (!mobileMq.matches) return

      photoRefs.current.forEach((photo, i) => {
        if (!photo) return
        applySlider(i, 0.5) // 초기: 절반씩 보여 비교 가능함을 암시

        let dragging = false
        const update = (clientX) => {
          const rect = photo.getBoundingClientRect()
          if (!rect.width) return
          applySlider(i, clamp((clientX - rect.left) / rect.width))
        }
        const onDown = (e) => {
          dragging = true
          e.currentTarget.setPointerCapture?.(e.pointerId)
          update(e.clientX)
        }
        const onMove = (e) => {
          if (dragging) update(e.clientX)
        }
        const onUp = (e) => {
          dragging = false
          e.currentTarget.releasePointerCapture?.(e.pointerId)
        }

        const handle = handleRefs.current[i]
        if (!handle) return
        handle.addEventListener('pointerdown', onDown)
        handle.addEventListener('pointermove', onMove)
        handle.addEventListener('pointerup', onUp)
        handle.addEventListener('pointercancel', onUp)
        cleanups.push(() => {
          handle.removeEventListener('pointerdown', onDown)
          handle.removeEventListener('pointermove', onMove)
          handle.removeEventListener('pointerup', onUp)
          handle.removeEventListener('pointercancel', onUp)
        })
      })
    }

    setup()
    mobileMq.addEventListener('change', setup)
    return () => {
      mobileMq.removeEventListener('change', setup)
      teardown()
    }
  }, [])

  useEffect(() => {
    // 태블릿·모바일(≤1199px)에선 가로 패닝 대신 세로 스택 → 카드/트랙 변형만 비운다.
    // off↔on은 아래 별도 useEffect의 드래그 비교 슬라이더가 제어한다.
    const mobileMq = window.matchMedia('(max-width: 1199px)')

    const renderMobile = () => {
      const card = cardRef.current
      const track = trackRef.current
      if (card) {
        card.style.transform = ''
        card.style.borderRadius = ''
        card.style.opacity = ''
        card.style.width = ''
      }
      if (track) track.style.transform = ''
    }

    const render = () => {
      frameRef.current = null
      if (mobileMq.matches) {
        renderMobile()
        return
      }
      const range = rangeRef.current
      const card = cardRef.current
      const track = trackRef.current
      if (!range || !card || !track) return

      const rect = range.getBoundingClientRect()
      const distance = range.offsetHeight - window.innerHeight
      const progress = distance > 0 ? clamp(-rect.top / distance) : 0
      // 애니메이션은 ANIM_END에서 끝나고 나머지(끝부분)는 Dining ON 상태로 고정 유지
      // → 그 고정 구간 위로 Collabo가 올라온다
      const animProgress = clamp(progress / ANIM_END)
      // 고정 구간 동안 Dining이 위로 드리프트 — Collabo가 완전히 올라올 때까지 등속으로 계속
      const holdP = clamp((progress - ANIM_END) / (1 - ANIM_END))
      const driftY = holdP * DINING_DRIFT

      const viewportWidth = window.innerWidth
      const halfWidth = viewportWidth * 0.5

      // 1) 우하단 작은 카드 → 화면 우측 절반(검정 텍스트면)
      const revealP = easeInOutCubic(
        clamp((animProgress - REVEAL_START) / (REVEAL_END - REVEAL_START)),
      )
      const scale = CARD_MIN_SCALE + (1 - CARD_MIN_SCALE) * revealP
      card.style.transform = `translate3d(0, ${-driftY}px, 0) scale(${scale})`
      card.style.borderRadius = `${(1 - revealP) * 28}px`
      card.style.opacity = String(clamp((animProgress - REVEAL_START) / 0.04))

      // 2) 우측 절반 → 전체화면으로 확장
      const widenP = easeInOutCubic(
        clamp((animProgress - REVEAL_END) / (WIDEN_END - REVEAL_END)),
      )
      card.style.width = `${halfWidth + (viewportWidth - halfWidth) * widenP}px`

      // 3) 가로 패닝: 룸마다 [조명 스윕 → 다음 룸으로 이동]
      // 스윕 세그먼트에 가중치를 줘서 라인이 더 천천히 지나가게 한다.
      const panP = clamp((animProgress - WIDEN_END) / (1 - WIDEN_END))
      const count = rooms.length
      const segs = []
      for (let i = 0; i < count; i += 1) {
        segs.push({ kind: 'sweep', room: i, weight: SWEEP_WEIGHT })
        if (i < count - 1) segs.push({ kind: 'pan', room: i, weight: PAN_WEIGHT })
      }
      const totalWeight = segs.reduce((sum, s) => sum + s.weight, 0)

      let position = count - 1
      const sweptAmount = new Array(count).fill(0)
      const target = panP * totalWeight
      let acc = 0
      for (let s = 0; s < segs.length; s += 1) {
        const seg = segs[s]
        const isLast = s === segs.length - 1
        if (target <= acc + seg.weight || isLast) {
          const segLocal = clamp((target - acc) / seg.weight)
          for (let k = 0; k < seg.room; k += 1) sweptAmount[k] = 1
          if (seg.kind === 'sweep') {
            position = seg.room
            // 앞: 조명 OFF로 잠깐 정지 → 중간: 스윕 → 뒤: 조명 ON으로 잠깐 정지
            sweptAmount[seg.room] = clamp(
              (segLocal - SWEEP_HOLD) / (1 - 2 * SWEEP_HOLD),
            )
          } else {
            sweptAmount[seg.room] = 1
            position = seg.room + easeInOutCubic(segLocal)
          }
          break
        }
        acc += seg.weight
      }
      track.style.transform = `translate3d(${-position * viewportWidth}px, 0, 0)`

      // 조명 스윕: 세로 라인이 지나가며 OFF → ON
      photoOnRefs.current.forEach((img, i) => {
        if (!img) return
        const sweep = easeInOutCubic(sweptAmount[i])
        img.style.clipPath = `inset(0 ${(1 - sweep) * 100}% 0 0)`

        const line = lineRefs.current[i]
        if (line) {
          line.style.left = `${sweep * 100}%`
          line.style.opacity = sweep > 0.002 && sweep < 0.998 ? '1' : '0'
        }

        // 전구도 스윕에 맞춰 같이 점등
        const bulb = bulbRefs.current[i]
        if (bulb) bulb.style.opacity = String(sweep)
      })
    }

    const requestRender = () => {
      if (frameRef.current !== null) return
      frameRef.current = window.requestAnimationFrame(render)
    }

    render()
    window.addEventListener('scroll', requestRender, { passive: true })
    window.addEventListener('resize', requestRender)
    mobileMq.addEventListener('change', requestRender)

    return () => {
      window.removeEventListener('scroll', requestRender)
      window.removeEventListener('resize', requestRender)
      mobileMq.removeEventListener('change', requestRender)
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  return (
    <section id="showroom" className={styles.spaces} aria-label="공간 큐레이션">
      <div className={styles.range} ref={rangeRef}>
        <div className={styles.stage}>
          <div
            className={`${styles.introCopy} ${introVisible ? styles.introVisible : ''}`}
            ref={introRef}
          >
            <p className={styles.introLabel}>
              <span className={styles.introLabelSpace}>Space,</span>{' '}
              <br className={styles.introLabelBr} />
              <span className={styles.introLabelDeco}>defined by</span> ILKW.
            </p>
            <p className={styles.introSub}>
              일광전구는 공간에 가장 잘 어울리는 빛을 제안합니다.
            </p>
          </div>

          <div
            className={styles.card}
            ref={cardRef}
            style={
              isStacked
                ? undefined
                : {
                    transform: 'scale(0.05)',
                    borderRadius: '28px',
                    opacity: 0,
                    width: '50vw',
                  }
            }
          >
            <div className={styles.track} ref={trackRef}>
              {rooms.map((room, index) => (
                <article className={styles.panel} key={room.title}>
                  <div
                    className={`${styles.panelText} ${
                      revealed[index] ? styles.textRevealed : ''
                    }`}
                    ref={(node) => {
                      panelTextRefs.current[index] = node
                    }}
                  >
                    <p className={styles.caption}>{room.caption}</p>
                    <span className={styles.bulb} aria-hidden="true">
                      <svg className={styles.bulbBase} viewBox="0 0 40 54">
                        {LAMP_ICONS[index]}
                      </svg>
                      <svg
                        className={styles.bulbGlow}
                        viewBox="0 0 40 54"
                        ref={(node) => {
                          bulbRefs.current[index] = node
                        }}
                      >
                        {LAMP_ICONS[index]}
                      </svg>
                    </span>
                    <h3 className={styles.roomTitle}>{room.title}</h3>
                  </div>
                  <div
                    className={styles.panelPhoto}
                    ref={(node) => {
                      photoRefs.current[index] = node
                    }}
                  >
                    <img className={styles.photoOff} src={room.image} alt={room.alt} />
                    <img
                      className={styles.photoOn}
                      src={room.imageOn}
                      alt=""
                      aria-hidden="true"
                      style={{
                        clipPath: isStacked
                          ? 'inset(0 50% 0 0)'
                          : 'inset(0 100% 0 0)',
                      }}
                      ref={(node) => {
                        photoOnRefs.current[index] = node
                      }}
                    />
                    <span
                      className={styles.sweepLine}
                      aria-hidden="true"
                      style={
                        isStacked
                          ? { left: '50%', opacity: 1 }
                          : { left: '0%', opacity: 0 }
                      }
                      ref={(node) => {
                        lineRefs.current[index] = node
                      }}
                    />
                    {/* 모바일 전용: 드래그 비교 슬라이더 핸들 (off↔on) */}
                    <button
                      type="button"
                      className={styles.compareHandle}
                      aria-label="조명 비교 슬라이더 드래그"
                      ref={(node) => {
                        handleRefs.current[index] = node
                      }}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <line x1="6.5" y1="12" x2="17.5" y2="12" />
                        <polyline points="9 9 6 12 9 15" />
                        <polyline points="15 9 18 12 15 15" />
                      </svg>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SpacesSection
