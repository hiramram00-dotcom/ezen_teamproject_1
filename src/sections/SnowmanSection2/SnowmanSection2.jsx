import { useEffect, useRef } from 'react'
import styles from './SnowmanSection2.module.css'
import SnowmanModel from './SnowmanModel'

import snowmanWhiteSilver from '../../../img/snowman-1.png'
import snowmanPink from '../../../img/snowman-2.png'
import snowmanWhiteGold from '../../../img/snowman-3.png'
import snowmanYellowSilver from '../../../img/snowman-4.png'
import snowmanWhiteBlue from '../../../img/snowman-5.png'

const clamp = (value, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max)

const smoothStep = (value) => {
  const progress = clamp(value)
  return progress * progress * (3 - 2 * progress)
}

const SNOWMEN = [
  {
    src: snowmanPink,
    targetX: -30.4,
    targetY: -19.2,
    exitX: -72,
    exitY: -42,
    rotation: 52,
    exitRotation: 52,
    size: 12,
  },
  {
    src: snowmanWhiteSilver,
    targetX: 15.6,
    targetY: -36.1,
    exitX: 22,
    exitY: -82,
    rotation: -32,
    size: 13,
  },
  {
    src: snowmanWhiteGold,
    targetX: 45.9,
    targetY: -9.2,
    exitX: 77,
    exitY: -20,
    rotation: 15,
    size: 11,
  },
  {
    src: snowmanYellowSilver,
    targetX: -41.7,
    targetY: 33.3,
    exitX: -76,
    exitY: 72,
    rotation: -22,
    size: 17,
  },
  {
    src: snowmanWhiteBlue,
    targetX: 17.1,
    targetY: 42.6,
    exitX: 34,
    exitY: 82,
    rotation: 29,
    size: 13,
  },
]

function SnowmanSection2() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const featureTitleRef = useRef(null)
  const modelRef = useRef(null)
  const detailRef = useRef(null)
  const productRefs = useRef([])
  const frameRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const featureTitle = featureTitleRef.current
    const model = modelRef.current
    const detail = detailRef.current
    const products = productRefs.current.filter(Boolean)
    if (
      !section ||
      !title ||
      !featureTitle ||
      !model ||
      !detail ||
      !products.length
    ) {
      return undefined
    }

    const update = () => {
      const scrollDistance = section.offsetHeight - window.innerHeight
      const progress = clamp(-section.getBoundingClientRect().top / scrollDistance)
      const exit = smoothStep((progress - 0.02) / 0.17)
      const modelEnter = smoothStep((progress - 0.16) / 0.17)
      const modelCover = smoothStep((progress - 0.28) / 0.28)
      const featureTitleIn = smoothStep((progress - 0.18) / 0.1)
      const featureTitleOut = smoothStep((progress - 0.42) / 0.13)
      const finalScene = smoothStep((progress - 0.62) / 0.26)

      title.style.setProperty('--title-scale', `${1 - exit * 0.82}`)
      title.style.setProperty('--title-opacity', `${1 - exit}`)

      featureTitle.style.setProperty(
        '--feature-title-opacity',
        `${featureTitleIn * (1 - featureTitleOut)}`,
      )

      model.style.setProperty('--model-opacity', `${modelEnter}`)
      model.style.setProperty('--model-x', `${finalScene * -17}vw`)
      model.style.setProperty('--model-y', `${(1 - modelCover) * 69}vh`)
      model.style.setProperty(
        '--model-turn',
        `${modelCover * Math.PI * 0.7 + finalScene * Math.PI * 1.85}`,
      )
      model.style.setProperty('--model-light', `${finalScene}`)
      model.dataset.turn = `${
        modelCover * Math.PI * 0.7 + finalScene * Math.PI * 1.85
      }`
      model.dataset.enter = `${modelCover}`
      model.dataset.final = `${finalScene}`
      model.dataset.light = `${finalScene}`
      model.style.setProperty(
        '--model-scale',
        `${0.62 + modelCover * 0.28 - finalScene * 0.04}`,
      )

      detail.style.setProperty('--detail-opacity', `${finalScene}`)
      detail.style.setProperty('--detail-x', `${(1 - finalScene) * 6}vw`)

      products.forEach((product, index) => {
        const item = SNOWMEN[index]
        const x = item.targetX + (item.exitX - item.targetX) * exit
        const y = item.targetY + (item.exitY - item.targetY) * exit
        const scale = 1 + exit * 0.18
        const exitRotation = item.exitRotation ?? item.rotation * 1.35
        const rotation = item.rotation + (exitRotation - item.rotation) * exit

        product.style.setProperty('--x', `${x}vw`)
        product.style.setProperty('--y', `${y}vh`)
        product.style.setProperty('--rotation', `${rotation}deg`)
        product.style.setProperty('--scale', `${scale}`)
        product.style.setProperty('--opacity', `${1 - exit}`)
      })

      frameRef.current = null
    }

    const requestUpdate = () => {
      if (!frameRef.current) frameRef.current = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={styles.snowman}
      aria-labelledby="snowman-title"
    >
      <div className={styles.stage}>
        <h2 ref={titleRef} id="snowman-title" className={styles.title}>
          SNOWMAN
        </h2>

        <div className={styles.productLayer} aria-hidden="true">
          {SNOWMEN.map((snowman, index) => (
            <img
              key={snowman.src}
              ref={(element) => {
                productRefs.current[index] = element
              }}
              className={styles.product}
              src={snowman.src}
              alt=""
              style={{ '--size': `${snowman.size}vw` }}
            />
          ))}
        </div>

        <p ref={featureTitleRef} className={styles.featureTitle}>
          LIGHT,
          <br />
          MADE LOVABLE
        </p>

        <div ref={modelRef} className={styles.modelWrap}>
          <SnowmanModel className={styles.modelCanvas} />
        </div>

        <div ref={detailRef} className={styles.detail}>
          <h3>SNOWMAN SERIES</h3>
          <p>
            겨울의 포근함을 담은 오브제 시리즈.
            <br />
            공간에 따뜻하고 사랑스러운 무드를 더합니다.
          </p>
        </div>
      </div>
    </section>
  )
}

export default SnowmanSection2
