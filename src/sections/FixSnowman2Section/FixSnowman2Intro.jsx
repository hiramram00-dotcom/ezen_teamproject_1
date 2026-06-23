import { useEffect, useRef } from 'react'

import styles from './FixSnowman2Intro.module.css'
import SnowmanModel from './FixSnowman2Model'

import flamingoThumb from '../ProductSection/assets/flamingo-thumb.avif'
import snowballThumb from '../ProductSection/assets/snowball-thumb.avif'
import snowmanThumb from '../ProductSection/assets/snowman-thumb.avif'
import teacupThumb from '../ProductSection/assets/teacup-thumb.avif'

const CARD_POOL = [
  { src: snowballThumb, label: 'Snowball' },
  { src: flamingoThumb, label: 'Flamingo' },
  { src: snowmanThumb, label: 'Snowman' },
  { src: teacupThumb, label: 'Teacup' },
]

const CARD_COUNT = 16
const STOP_CARD_INDEX = 2
const INTRO_SNOWMEN = [
  {
    targetX: -29.5,
    targetY: -20.2,
    exitX: -96,
    exitY: -58,
    rotation: 52,
    exitRotation: 52,
    size: 19,
    turn: -0.7,
    glassColor: '#edc6c6',
    bodyColor: '#a8a8a4',
    lampColor: '#ffd8ca',
  },
  {
    targetX: 16.3,
    targetY: -42.4,
    exitX: 30,
    exitY: -112,
    rotation: -32,
    size: 23,
    turn: 0.62,
    glassColor: '#f4f4f1',
    bodyColor: '#9f9f9f',
    lampColor: '#fff2dc',
  },
  {
    targetX: 47.2,
    targetY: -12.8,
    exitX: 106,
    exitY: -26,
    rotation: 15,
    size: 17,
    turn: -0.34,
    glassColor: '#f5f5f1',
    bodyColor: '#b9a86f',
    lampColor: '#fff0d0',
  },
  {
    targetX: -43.2,
    targetY: 33.3,
    exitX: -102,
    exitY: 96,
    rotation: -22,
    size: 34,
    turn: 0.2,
    glassColor: '#e7c774',
    bodyColor: '#a8a8a4',
    lampColor: '#ffe2a3',
  },
  {
    targetX: 17.6,
    targetY: 41.5,
    exitX: 44,
    exitY: 110,
    rotation: 29,
    size: 21,
    turn: -0.52,
    glassColor: '#eef6f5',
    bodyColor: '#d6e5e4',
    lampColor: '#efffff',
  },
]
const CARDS = Array.from({ length: CARD_COUNT }, (_, index) => {
  const card = CARD_POOL[index % CARD_POOL.length]

  return {
    ...card,
    index,
  }
})

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max)
const smoothstep = (value) => {
  const t = clamp(value)

  return t * t * (3 - 2 * t)
}

function FixSnowman2Intro() {
  const sectionRef = useRef(null)
  const stickyRef = useRef(null)
  const cardStageRef = useRef(null)
  const cardTunnelRef = useRef(null)
  const meetRef = useRef(null)
  const snowmanWordRef = useRef(null)
  const productRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const sticky = stickyRef.current
    const cardStage = cardStageRef.current
    const cardTunnel = cardTunnelRef.current
    const meet = meetRef.current
    const snowmanWord = snowmanWordRef.current
    const products = productRefs.current.filter(Boolean)

    if (
      !section ||
      !sticky ||
      !cardStage ||
      !cardTunnel ||
      !meet ||
      !snowmanWord ||
      !products.length
    ) {
      return
    }

    let ticking = false
    const cardAngle = 360 / CARD_COUNT
    const targetRotation = -1440 - STOP_CARD_INDEX * cardAngle

    const updateScene = () => {
      const rect = section.getBoundingClientRect()
      const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = clamp(-rect.top / scrollable)
      
      // 스크롤이 조금이라도 내려가면(1% 이상) 텍스트 트리거 발동
      if (progress > 0.01) {
        meet.classList.add(styles.triggered)
        snowmanWord.classList.add(styles.triggered)
      } else {
        // 스크롤을 완전히 위로 올리면 초기화
        meet.classList.remove(styles.triggered)
        snowmanWord.classList.remove(styles.triggered)
      }
      // 2. 카드 회전: 텍스트 안착 직후인 15% ~ 58% 구간에서 카드가 돌기 시작함
      const spinProgress = smoothstep((progress - 0.15) / 0.43)
      const settleProgress = smoothstep((progress - 0.46) / 0.2)
      const transitionProgress = smoothstep((progress - 0.46) / 0.24)
      // 카드가 완전히 사라진(0.74) 후 제품 등장 로직
      const exitProgress = smoothstep((progress - 0.58) / 0.16) // 카드는 0.58~0.74 구간에서 완전히 페이드아웃
      
      // 1. 제품 모임 (Gather): 0.74 ~ 0.81 (카드 소멸 직후 등장)
      const productReveal = smoothstep((progress - 0.74) / 0.07)
      
      // 2. 정지 유지 (Hold Plateau): 0.81 ~ 0.93 
      // 원본과 완벽하게 동일한 12%(0.12) 길이의 '쉬어가는 구간' 확보!
      
      // 3. 바깥으로 퍼지며 사라짐 (Disperse & Fade): 0.93 ~ 1.00
      const holdExit = smoothstep((progress - 0.93) / 0.07)
      const productExit = holdExit
      const fastRotation = -1260 * spinProgress
      const rotation =
        fastRotation + (targetRotation - fastRotation) * settleProgress
      const whiteValue = Math.round(255 * transitionProgress)
      const snowmanTextValue = Math.round(255 * (1 - transitionProgress))

      cardTunnel.style.setProperty('--carousel-rotation', `${rotation}deg`)
      cardStage.style.setProperty(
        '--cards-opacity',
        `${0.42 * (1 - exitProgress)}`,
      )
      meet.style.setProperty('--meet-opacity', `${1 - transitionProgress}`)
      meet.style.setProperty('--meet-y', `${transitionProgress * -92}px`)
      snowmanWord.style.setProperty(
        '--snowman-y',
        `${transitionProgress * -56 - holdExit * 16}px`,
      )
      snowmanWord.style.setProperty(
        '--snowman-color',
        `rgb(${snowmanTextValue}, ${snowmanTextValue}, ${snowmanTextValue})`,
      )
      snowmanWord.style.setProperty(
        '--snowman-weight',
        `${700 - transitionProgress * 200}`,
      )
      snowmanWord.style.setProperty('--snowman-scale', `${1 - holdExit * 0.68}`)
      snowmanWord.style.setProperty('--snowman-blur', `${holdExit * 4}px`)
      snowmanWord.style.setProperty('--snowman-opacity', `${1 - holdExit}`)
      sticky.style.setProperty(
        '--intro-bg',
        `rgb(${whiteValue}, ${whiteValue}, ${whiteValue})`,
      )
      products.forEach((product, index) => {
        const item = INTRO_SNOWMEN[index]
        const gatheredX = item.targetX * 0.45
        const gatheredY = item.targetY * 0.38
        const settledX = gatheredX + (item.targetX - gatheredX) * productReveal
        const settledY = gatheredY + (item.targetY - gatheredY) * productReveal
        const x = settledX + (item.exitX - settledX) * productExit
        const y = settledY + (item.exitY - settledY) * productExit
        const exitRotation = item.exitRotation ?? item.rotation * 1.35
        const gatheredRotation = item.rotation * 0.55
        const settledRotation =
          gatheredRotation + (item.rotation - gatheredRotation) * productReveal
        const rotation =
          settledRotation + (exitRotation - settledRotation) * productExit

        product.style.setProperty('--x', `${x}vw`)
        product.style.setProperty('--y', `${y}vh`)
        product.style.setProperty('--rotation', `${rotation}deg`)
        product.style.setProperty(
          '--scale',
          `${0.88 + productReveal * 0.12 + productExit * 0.32}`,
        )
        product.style.setProperty(
          '--opacity',
          `${productReveal * (1 - productExit)}`,
        )
        product.style.setProperty('--blur', `${productExit * 2.5}px`)
        product.dataset.turn = `${item.turn + productExit * 0.32}`
        product.dataset.enter = '0.35'
        product.dataset.light = '0'
      })

      ticking = false
    }

    const requestUpdate = () => {
      if (ticking) return

      ticking = true
      window.requestAnimationFrame(updateScene)
    }

    updateScene()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [])

  return (
    <section id="products" ref={sectionRef} className={styles.snowman}>
      <div ref={stickyRef} className={styles.sticky}>
        <div ref={cardStageRef} className={styles.cardStage} aria-hidden="true">
          <div ref={cardTunnelRef} className={styles.cardTunnel}>
            {CARDS.map((card, index) => (
              <figure
                key={`${card.label}-${index}`}
                className={`${styles.card} ${
                  card.label === 'Snowman' ? styles.snowmanCard : ''
                }`}
                style={{
                  '--i': card.index,
                }}
              >
                <img src={card.src} alt="" />
                <figcaption>{card.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className={styles.title}>
          <p ref={meetRef} className={`${styles.meetLine} fs-title-2`} style={{ fontFamily: 'var(--font-deco)', fontStyle: 'italic', fontWeight: 400 }}>
            <span className={styles.textInnerLeft}>Meet</span>
          </p>
          <p
            ref={snowmanWordRef}
            className={`${styles.snowmanLine} fs-title-2`}
            style={{ fontFamily: 'var(--font-en)' }} /* font-weight는 스크롤 애니(--snowman-weight 700→500)가 제어하므로 인라인 지정 금지 */
          >
            <span className={styles.textInnerRight}>SNOWMAN</span>
          </p>
        </div>

        <div className={styles.productLayer} aria-hidden="true">
          {INTRO_SNOWMEN.map((snowman, index) => (
            <div
              key={`${snowman.targetX}-${snowman.targetY}`}
              ref={(element) => {
                productRefs.current[index] = element
              }}
              className={styles.product}
              style={{
                '--size': `${snowman.size}vw`,
                '--x': `${snowman.targetX}vw`,
                '--y': `${snowman.targetY}vh`,
                '--rotation': `${snowman.rotation}deg`,
                '--opacity': 0,
              }}
              data-turn={snowman.turn}
              data-enter="0.35"
              data-light="0"
            >
              <SnowmanModel
                className={styles.productCanvas}
                glassColor={snowman.glassColor}
                bodyColor={snowman.bodyColor}
                lampColor={snowman.lampColor}
                cameraZ={17.5}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FixSnowman2Intro
