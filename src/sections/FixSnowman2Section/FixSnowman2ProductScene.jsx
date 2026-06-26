import { useEffect, useRef } from 'react'
import styles from './FixSnowman2ProductScene.module.css'
import SnowmanModel from './FixSnowman2Model'

const clamp = (value, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max)

const smoothStep = (value) => {
  const progress = clamp(value)
  return progress * progress * (3 - 2 * progress)
}

function FixSnowman2ProductScene() {
  const sectionRef = useRef(null)
  const featureTitleRef = useRef(null)
  const modelRef = useRef(null)
  const detailRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const featureTitle = featureTitleRef.current
    const model = modelRef.current
    const detail = detailRef.current

    if (!section || !featureTitle || !model || !detail) {
      return undefined
    }

    const update = () => {
      const scrollDistance = section.offsetHeight - window.innerHeight
      const progress = clamp(-section.getBoundingClientRect().top / scrollDistance)
      const modelEnter = smoothStep(progress / 0.16)
      const modelCover = smoothStep((progress - 0.14) / 0.36) // 기간 대폭 연장: 0.14 ~ 0.50
      const featureTitleIn = smoothStep(progress / 0.1)
      const featureTitleOut = smoothStep((progress - 0.28) / 0.22) // 글자 페이드아웃도 0.50까지 늦춰서 눈사람과 싱크 맞춤
      const finalScene = smoothStep((progress - 0.50) / 0.28) // 텍스트 등장은 눈사람이 완벽히 자리잡은 0.50 이후부터 시작
      const wobblePower = 1 - modelEnter

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
      model.style.setProperty('--model-shadow', `${finalScene}`)
      model.style.setProperty(
        '--model-wobble-x',
        `${Math.sin(modelEnter * Math.PI * 4) * wobblePower * 0.4}vw`,
      )
      model.style.setProperty(
        '--model-wobble-rotate',
        `${Math.sin(modelEnter * Math.PI * 5) * wobblePower * 3.2}deg`,
      )
      model.style.setProperty(
        '--model-scale',
        `${0.62 + modelCover * 0.28 - finalScene * 0.04}`,
      )

      model.dataset.turn = `${
        modelCover * Math.PI * 0.7 + finalScene * Math.PI * 1.85
      }`
      model.dataset.enter = `${modelCover}`
      model.dataset.final = `${finalScene}`
      model.dataset.light = `${finalScene}`
      model.dataset.showcase = '1'

      detail.style.setProperty('--detail-opacity', `${finalScene}`)
      detail.style.setProperty('--detail-x', `${(1 - finalScene) * 6}vw`)

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
      id="products"
      ref={sectionRef}
      className={styles.snowman}
      aria-labelledby="snowman-feature-title"
    >
      <div className={styles.stage}>
        <p
          ref={featureTitleRef}
          id="snowman-feature-title"
          className={`${styles.featureTitle} fs-title-2`}
        >
          LIGHT,
          <br />
          MADE LOVABLE
        </p>

        <div ref={modelRef} className={styles.modelWrap}>
          <span className={styles.modelShadow} aria-hidden="true" />
          <SnowmanModel className={styles.modelCanvas} />
        </div>

        <div ref={detailRef} className={styles.detail}>
          <h3>SNOWMAN SERIES</h3>
          <p>
            겨울의 포근함을 담은 오브제 시리즈.
            <br />
            공간에 따뜻하고 사랑스러운 무드를 더합니다.
          </p>
          <a
            className={styles.buyLink}
            href="https://brand.naver.com/iklamp/products/11202568021"
            target="_blank"
            rel="noreferrer"
            data-cursor="pointer"
          >
            제품 보러가기
          </a>
        </div>
      </div>
    </section>
  )
}

export default FixSnowman2ProductScene
