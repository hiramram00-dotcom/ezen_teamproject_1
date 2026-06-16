import { useEffect, useRef } from 'react'

import styles from './SnowmanIntro.module.css'
import SnowmanModel from './SnowmanModel'

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

function SnowmanIntro() {
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
      const spinProgress = smoothstep(progress / 0.58)
      const settleProgress = smoothstep((progress - 0.46) / 0.2)
      const transitionProgress = smoothstep((progress - 0.46) / 0.24)
      const exitProgress = smoothstep((progress - 0.58) / 0.22)
      const holdExit = smoothstep((progress - 0.86) / 0.14)
      const productReveal = smoothstep((progress - 0.58) / 0.16)
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
        const x = item.targetX + (item.exitX - item.targetX) * productExit
        const y = item.targetY + (item.exitY - item.targetY) * productExit
        const exitRotation = item.exitRotation ?? item.rotation * 1.35
        const rotation =
          item.rotation + (exitRotation - item.rotation) * productExit

        product.style.setProperty('--x', `${x}vw`)
        product.style.setProperty('--y', `${y}vh`)
        product.style.setProperty('--rotation', `${rotation}deg`)
        product.style.setProperty('--scale', `${0.96 + productReveal * 0.04 + productExit * 0.32}`)
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
          <p ref={meetRef} className={`${styles.meetLine} type-italic-2`}>
            Meet
          </p>
          <p
            ref={snowmanWordRef}
            className={`${styles.snowmanLine} type-title-semibold`}
          >
            SNOWMAN
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

export default SnowmanIntro
