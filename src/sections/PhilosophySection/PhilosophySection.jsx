import { useEffect, useRef, useState } from 'react'
import styles from './PhilosophySection.module.css'

import philosophyRoom from './assets/philosophy-room.webp'
import philosophyLight from './assets/philosophy-light.webp'
import philosophyPendant from './assets/philosophy-pendant.webp'
import philosophyWarmHandLight from './assets/philosophy-warm-hand-light.webp'

const ease = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const messages = [
  '우리는 빛으로 세상에 공헌한다',
  '글로벌 넘버원 백년장인 기업이 된다',
  '삶에 온기를 주는 빛을 개발 공급한다',
]

const lightImages = [philosophyLight, philosophyPendant, philosophyWarmHandLight]

/**
 * PhilosophySection — Our Philosophy
 * 섹션이 화면에 들어오는 순간부터 무대(배경)가 스크롤과 함께 올라오고,
 * 카드는 무대 아래쪽에서 정중앙으로 이동한다. 무대가 화면을 꽉 채우는
 * 순간 카드가 정확히 화면 정중앙에 온다. 배경은 그 구간에서 scale 1.15→1로
 * 줌아웃되어 공간감을 준다.
 */
function PhilosophySection() {
  const sceneRef = useRef(null)
  const roomRef = useRef(null)
  const panelRef = useRef(null)
  const activeMessageRef = useRef(0)
  const [activeMessage, setActiveMessage] = useState(0)

  // 메시지는 카드가 중앙에 고정된 뒤 스크롤 진행도에 맞춰 하나씩 전환된다.
  useEffect(() => {
    const scene = sceneRef.current
    const room = roomRef.current
    const panel = panelRef.current
    if (!scene || !room || !panel) return

    const cardScale =
      parseFloat(getComputedStyle(panel).getPropertyValue('--card-scale')) || 1

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      room.style.transform = 'scale(1)'
      panel.style.transform = `translate(-50%, -50%) scale(${cardScale})`
      return
    }

    let ticking = false
    const apply = () => {
      ticking = false
      const rect = scene.getBoundingClientRect()
      const vh = window.innerHeight
      // 진행도: 섹션이 화면에 막 들어온 순간(rect.top=vh) → 무대가 화면을 꽉 채운 순간(rect.top=0)
      const enterProgress = clamp((vh - rect.top) / vh, 0, 1)
      const e = ease(enterProgress)
      const sectionTravel = Math.max(scene.offsetHeight - vh, 1)
      const exitProgress = ease(
        clamp((-rect.top - sectionTravel * 0.92) / (sectionTravel * 0.08), 0, 1),
      )
      const exitScale = 1 - exitProgress * 0.08
      const exitLift = exitProgress * 4
      const exitOpacity = 1 - exitProgress * 0.88
      const exitBlur = exitProgress * 5
      // 배경: 살짝 확대 → 원래 크기 (스크롤하며 공간감)
      room.style.transform = `scale(${(1.12 - 0.06 * e + exitProgress * 0.03).toFixed(4)})`
      room.style.opacity = `${1 - exitProgress * 0.35}`
      // 카드: 무대 아래쪽 → 무대 중앙으로 이동.
      // 스크롤과 1:1 선형으로 올려 화면상 아래→위로 매끄럽게 상승한다.
      // 무대가 화면을 채우는 순간(progress 1) 카드가 화면 정중앙에 온다.
      const up = ((1 - enterProgress) * 50).toFixed(2) // svh, 중앙보다 아래에서 시작하는 양
      panel.style.transform = `translate(-50%, calc(-50% + ${up}svh - ${exitLift}svh)) scale(${(cardScale * exitScale).toFixed(4)})`
      panel.style.opacity = `${exitOpacity}`
      panel.style.filter = `blur(${exitBlur}px)`

      const messageScrollDistance = sectionTravel
      const messageProgress = clamp(-rect.top / messageScrollDistance, 0, 1)
      const nextMessage = Math.min(
        messages.length - 1,
        Math.floor(messageProgress * messages.length),
      )

      if (nextMessage !== activeMessageRef.current) {
        activeMessageRef.current = nextMessage
        setActiveMessage(nextMessage)
      }
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(apply)
      }
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section ref={sceneRef} className={styles.philosophy} aria-labelledby="philosophy-title">
      <div className={styles.stage}>
        <img ref={roomRef} className={styles.room} src={philosophyRoom} alt="" />

        {/* 카드는 무대 안에서 아래→중앙으로 이동 — 섹션이 보이는 순간 화면 아래에서
            등장해 위로 올라오다가, 무대가 화면을 채우면 화면 정중앙에 위치한다. */}
        <div ref={panelRef} className={styles.panel}>
          {/* Our Philosophy 텍스트 + 조명 이미지 + 문구를 하나의 묶음으로 카드 정중앙 배치 */}
          <div className={styles.group}>
            <div className={styles.lightFrame} aria-hidden="true">
              {lightImages.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  className={`${styles.light} ${
                    index === activeMessage ? styles.lightActive : ''
                  }`}
                  src={image}
                  alt=""
                />
              ))}
            </div>
            <img className={styles.light} src={philosophyLight} alt="빛을 밝히는 펜던트 조명" />
          <h2 id="philosophy-title" className={styles.title}>
            <span>Our</span>
            <span>Philosophy</span>
          </h2>
          <p className={styles.message} aria-live="polite">
            {messages.map((message, index) => (
              <span
                key={message}
                className={[
                  index === activeMessage && styles.messageActive,
                  index < activeMessage && styles.messageBefore,
                  index > activeMessage && styles.messageAfter,
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-hidden={index !== activeMessage}
              >
                {message}
              </span>
            ))}
          </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PhilosophySection
