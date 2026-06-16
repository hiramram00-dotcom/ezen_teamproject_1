import { useEffect, useRef } from 'react'
import styles from './SnowmanProductScene.module.css'
import SnowmanModel from './SnowmanModel'

const clamp = (value, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max)

const smoothStep = (value) => {
  const progress = clamp(value)
  return progress * progress * (3 - 2 * progress)
}

const SNOWMEN = [
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

function SnowmanProductScene() {
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
      const exit = smoothStep((progress - 0.08) / 0.22)
      const modelEnter = smoothStep((progress - 0.34) / 0.17)
      const modelCover = smoothStep((progress - 0.46) / 0.24)
      const featureTitleIn = smoothStep((progress - 0.32) / 0.1)
      const featureTitleOut = smoothStep((progress - 0.56) / 0.13)
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
        const scale = 1 + exit * 0.32
        const exitRotation = item.exitRotation ?? item.rotation * 1.35
        const rotation = item.rotation + (exitRotation - item.rotation) * exit

        product.style.setProperty('--x', `${x}vw`)
        product.style.setProperty('--y', `${y}vh`)
        product.style.setProperty('--rotation', `${rotation}deg`)
        product.style.setProperty('--scale', `${scale}`)
        product.style.setProperty('--opacity', `${1 - exit}`)
        product.style.setProperty('--blur', `${exit * 2.5}px`)
        product.dataset.turn = `${item.turn + exit * 0.32}`
        product.dataset.enter = '0.35'
        product.dataset.light = '0'
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
                '--opacity': 1,
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

export default SnowmanProductScene
