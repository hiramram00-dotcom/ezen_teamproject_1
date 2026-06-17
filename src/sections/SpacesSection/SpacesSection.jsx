import { useEffect, useRef, useState } from 'react'
import styles from './SpacesSection.module.css'

import livingImg from '../../assets/spaces/spaces2-living.png'
import livingOnImg from '../../assets/spaces/spaces2-living-on.png'
import bedImg from '../../assets/spaces/spaces2-bed.png'
import bedOnImg from '../../assets/spaces/spaces2-bed-on.png'
import diningImg from '../../assets/spaces/spaces2-dining.png'
import diningOnImg from '../../assets/spaces/spaces2-dining-on.png'

const rooms = [
  {
    title: 'Living Room',
    image: livingImg,
    imageOn: livingOnImg,
    alt: '빈티지 텔레비전과 의자가 놓인 거실',
    caption: (
      <>
        머무르고, 쉬고, 대화를 나누는 거실.
        <br />
        일광전구는 공간의 크기와 생활 방식을 살펴
        <br />
        머무는 시간이 더욱 편안해지도록
        <br />
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
        하루의 끝에는 밝음보다 편안함이 필요합니다.
        <br />
        눈에 부담을 덜어주는 은은한 빛과
        <br />
        차분하게 가라앉는 따뜻한 온기로,
        <br />
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
        한 끼의 식사와 자연스러운 대화가 이어지는 곳.
        <br />
        식탁 위에 고르게 머무는 따뜻한 빛이
        <br />
        음식과 사람의 표정을 선명하게 비추고,
        <br />
        함께하는 시간을 더욱 풍성하게 만듭니다.
      </>
    ),
  },
]

const clamp = (value, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max)

const easeInOutCubic = (value) =>
  value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2

// 진행도 구간: 텍스트 고정 → 검정 절반 등장(REVEAL) → 전체화면 확장(WIDEN) → 가로 패닝+조명 스윕
const REVEAL_START = 0.1
const REVEAL_END = 0.26
const WIDEN_END = 0.56
const CARD_MIN_SCALE = 0.05
// 스윕(조명 ON 라인) 구간이 룸 이동보다 몇 배 더 긴지 — 클수록 라인이 천천히 지나간다
const SWEEP_WEIGHT = 1.7
// 이 진행도에서 애니메이션 완료(Dining ON). 이후 끝까지는 고정 유지 + Collabo가 위로 올라옴
const ANIM_END = 0.85
// 고정 구간에서 Dining이 위로 드리프트하는 양(px) — 클수록 더 많이 올라감
const DINING_DRIFT = 200

function SpacesSection() {
  const rangeRef = useRef(null)
  const cardRef = useRef(null)
  const trackRef = useRef(null)
  const photoOnRefs = useRef([])
  const lineRefs = useRef([])
  const frameRef = useRef(null)
  const introRef = useRef(null)
  const [introVisible, setIntroVisible] = useState(false)

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

  useEffect(() => {
    const render = () => {
      frameRef.current = null
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
        if (i < count - 1) segs.push({ kind: 'pan', room: i, weight: 1 })
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
            sweptAmount[seg.room] = segLocal
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
      })
    }

    const requestRender = () => {
      if (frameRef.current !== null) return
      frameRef.current = window.requestAnimationFrame(render)
    }

    render()
    window.addEventListener('scroll', requestRender, { passive: true })
    window.addEventListener('resize', requestRender)

    return () => {
      window.removeEventListener('scroll', requestRender)
      window.removeEventListener('resize', requestRender)
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
            <p className={styles.introLabel}>SPACE, DEFINED BY ILKW.</p>
            <h2 className={styles.introHeadline}>
              Every space has its own purpose,
              <br />
              rhythm, and atmosphere.
              <br />
              ILKW brings the right light to each one.
            </h2>
            <p className={styles.introSub}>
              일광전구는 공간에 가장 잘 어울리는 빛을 제안합니다.
            </p>
          </div>

          <div
            className={styles.card}
            ref={cardRef}
            style={{
              transform: 'scale(0.05)',
              borderRadius: '28px',
              opacity: 0,
              width: '50vw',
            }}
          >
            <div className={styles.track} ref={trackRef}>
              {rooms.map((room, index) => (
                <article className={styles.panel} key={room.title}>
                  <div className={styles.panelText}>
                    <p className={styles.caption}>{room.caption}</p>
                    <span className={styles.arrow} aria-hidden="true">
                      <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16.875 30V7.18125L27.3563 17.6625L30 15L15 0L0 15L2.64375 17.6438L13.125 7.18125V30H16.875Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <h3 className={styles.roomTitle}>{room.title}</h3>
                  </div>
                  <div className={styles.panelPhoto}>
                    <img className={styles.photoOff} src={room.image} alt={room.alt} />
                    <img
                      className={styles.photoOn}
                      src={room.imageOn}
                      alt=""
                      aria-hidden="true"
                      style={{ clipPath: 'inset(0 100% 0 0)' }}
                      ref={(node) => {
                        photoOnRefs.current[index] = node
                      }}
                    />
                    <span
                      className={styles.sweepLine}
                      aria-hidden="true"
                      style={{ left: '0%', opacity: 0 }}
                      ref={(node) => {
                        lineRefs.current[index] = node
                      }}
                    />
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
