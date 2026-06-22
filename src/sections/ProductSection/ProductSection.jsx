import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './ProductSection.module.css'
import productWordmark from './assets/product-ilkw-wordmark.svg'
import heroImage from './assets/product-hero-hq.webp'
import flamingoMain from './assets/flamingo-main-hq.webp'
import flamingoThumb from './assets/flamingo-thumb-hq.webp'
import snowmanMain from './assets/snowman-main-hq.webp'
import snowmanThumb from './assets/snowman-thumb-hq.webp'
import snowballMain from './assets/snowball-main-hq.webp'
import snowballThumb from './assets/snowball-thumb-hq.webp'
import teacupMain from './assets/teacup-main-hq.webp'
import teacupThumb from './assets/teacup-thumb-hq.webp'

gsap.registerPlugin(ScrollTrigger)

const products = [
  {
    name: 'FLAMINGO',
    description: ['낮에는 하나의 오브제로,', '밤에는 따뜻한 빛으로.'],
    mainImage: flamingoMain,
    thumbnail: flamingoThumb,
    imageSide: 'right',
    detail: 'flamingo',
    contentX: '49.64%',
  },
  {
    name: 'SNOWMAN',
    description: ['겹겹이 포개진 부드러운 곡선,', '그 사이로 은은한 빛이 피어납니다.'],
    mainImage: snowmanMain,
    thumbnail: snowmanThumb,
    imageSide: 'left',
    contentX: '50.68%',
  },
  {
    name: 'SNOWBALL',
    description: ['가장 가까운 곳에서,', '일상의 온도를 부드럽게 바꿉니다.'],
    mainImage: snowballMain,
    thumbnail: snowballThumb,
    imageSide: 'right',
    contentX: '53.28%',
  },
  {
    name: 'TEACUP R',
    description: ['작지만 선명한 빛으로,', '익숙한 공간에 따뜻한 온기를 더합니다.'],
    mainImage: teacupMain,
    thumbnail: teacupThumb,
    imageSide: 'left',
    contentX: '49.84%',
  },
]

function ProductSection({ onOpenProduct }) {
  const sectionRef = useRef(null)
  const hoverTimerRef = useRef(null)
  const [hoveredProduct, setHoveredProduct] = useState(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const hero = section.querySelector('[data-hero-image]')
      const rows = gsap.utils.toArray('[data-product-row]', section)

      gsap.fromTo(
        hero,
        { scale: 1.1 },
        { scale: 1, duration: 3, delay: 0.1, ease: 'power3.out' },
      )

      rows.forEach((row) => {
        const mainMotion = row.querySelector('[data-main-motion]')
        const titleChars = row.querySelectorAll('[data-title-char]')
        const thumbnailInner = row.querySelector('[data-thumbnail-inner]')
        const thumbnailReveal = row.querySelector('[data-thumbnail-reveal]')

        gsap.fromTo(
          mainMotion,
          { scale: 1.15 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top bottom',
              end: 'center center',
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          },
        )

        const revealTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 85%',
            once: true,
          },
        })

        revealTimeline.fromTo(
          titleChars,
          { opacity: 0, yPercent: 55 },
          { opacity: 1, yPercent: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out' },
          0.05,
        )

        revealTimeline.fromTo(
          thumbnailInner,
          { scale: 1.25, yPercent: -20 },
          { scale: 1, yPercent: 0, duration: 2, ease: 'power3.out' },
          0.4,
        )

        revealTimeline.fromTo(
          thumbnailReveal,
          { scaleY: 1 },
          { scaleY: 0, duration: 2, ease: 'power3.out' },
          0.4,
        )
      })

      return () => ScrollTrigger.getAll().forEach((trigger) => {
        if (section.contains(trigger.trigger)) trigger.kill()
      })
    })

    ScrollTrigger.refresh()
    return () => {
      window.clearTimeout(hoverTimerRef.current)
      media.revert()
    }
  }, [])

  const openProduct = (product) => onOpenProduct?.(product)
  const triggerProductTitleHover = (productName) => {
    window.clearTimeout(hoverTimerRef.current)
    setHoveredProduct(productName)
    hoverTimerRef.current = window.setTimeout(() => {
      setHoveredProduct(null)
    }, 1100)
  }

  return (
    <section ref={sectionRef} id="product" className={styles.products} aria-label="ILKW 제품 컬렉션">
      <div className={styles.hero}>
        <img data-hero-image className={styles.heroImage} src={heroImage} alt="ILKW 조명 제품 컬렉션" fetchPriority="high" />
        <div className={styles.heroIdentity}>
          <img className={styles.heroWordmark} src={productWordmark} alt="ILKW" />
          <p className={styles.heroCopy}>
            공간을 바꾸는 가장 쉬운 방법
            <br />
            일광전구의 제품 라인업을 만나보세요.
          </p>
        </div>
      </div>

      <div className={styles.catalog}>
        {products.map((product) => {
          const isLinked = Boolean(product.detail)
          const isHovered = hoveredProduct === product.name
          const rowClassName = `${styles.productRow} ${product.imageSide === 'left' ? styles.imageLeft : styles.imageRight} ${isHovered ? styles.productHovered : ''}`
          const titleChars = [...product.name].map((letter, index) => (
            <span
              aria-hidden="true"
              className={styles.titleChar}
              data-title-char
              key={`${letter}-${index}`}
              style={{ '--char-index': index }}
            >
              {letter}
            </span>
          ))

          return (
            <article
              data-product-row
              className={rowClassName}
              key={product.name}
              style={{ '--content-x': product.contentX }}
            >
              {isLinked ? (
                <button
                  type="button"
                  className={`${styles.mainVisual} ${styles.productLink}`}
                  data-cursor="pointer"
                  onClick={() => openProduct(product.detail)}
                  aria-label={`${product.name} 상세 페이지 열기`}
                >
                  <span data-main-motion className={styles.mainImageMotion}>
                    <img src={product.mainImage} alt={`${product.name} 조명이 놓인 공간`} loading="lazy" decoding="async" />
                  </span>
                </button>
              ) : (
                <figure className={styles.mainVisual} data-cursor="pointer">
                  <span data-main-motion className={styles.mainImageMotion}>
                    <img src={product.mainImage} alt={`${product.name} 조명이 놓인 공간`} loading="lazy" decoding="async" />
                  </span>
                </figure>
              )}

              <div className={styles.productInfo}>
                <h2
                  className={styles.productName}
                  aria-label={product.name}
                  data-cursor="pointer"
                  onMouseEnter={() => triggerProductTitleHover(product.name)}
                >
                  {isLinked ? (
                    <button
                      type="button"
                      className={styles.productTitleButton}
                      onClick={() => openProduct(product.detail)}
                      onFocus={() => triggerProductTitleHover(product.name)}
                      aria-label={`${product.name} 상세 페이지 열기`}
                    >
                      {titleChars}
                    </button>
                  ) : titleChars}
                </h2>

                <p className={styles.description}>
                  {product.description.map((line) => <span key={line}>{line}</span>)}
                </p>

                {isLinked ? (
                  <button
                    type="button"
                    className={`${styles.thumbnail} ${styles.productLink}`}
                    data-cursor="pointer"
                    onClick={() => openProduct(product.detail)}
                    onMouseEnter={() => triggerProductTitleHover(product.name)}
                    onFocus={() => triggerProductTitleHover(product.name)}
                    aria-label={`${product.name} 상세 페이지 열기`}
                  >
                    <span data-thumbnail-inner className={styles.thumbnailInner}>
                      <img src={product.thumbnail} alt="" loading="lazy" decoding="async" />
                    </span>
                    <span data-thumbnail-reveal className={styles.thumbnailReveal} aria-hidden="true" />
                  </button>
                ) : (
                  <figure
                    className={styles.thumbnail}
                    data-cursor="pointer"
                    onMouseEnter={() => triggerProductTitleHover(product.name)}
                  >
                    <span data-thumbnail-inner className={styles.thumbnailInner}>
                      <img src={product.thumbnail} alt="" loading="lazy" decoding="async" />
                    </span>
                    <span data-thumbnail-reveal className={styles.thumbnailReveal} aria-hidden="true" />
                  </figure>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default ProductSection
