import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './ProductSection.module.css'
import productWordmark from './assets/product-ilkw-wordmark.svg'
import heroImage from './assets/product-hero-figma-latest.webp'
import flamingoMain from './assets/flamingo-main-hq.webp'
import flamingoThumb from './assets/flamingo-thumb-hq.webp'
import flamingoThumb2 from './assets/flamingo-thumb-2-figma.webp'
import flamingoThumb3 from './assets/flamingo-thumb-3-figma.webp'
import snowmanMain from './assets/snowman-main-hq.webp'
import snowmanThumb from './assets/snowman-thumb-hq.webp'
import snowmanThumb2 from './assets/snowman-thumb-2-figma.webp'
import snowmanThumb3 from './assets/snowman-thumb-3-figma.webp'
import snowballMain from './assets/snowball-main-hq.webp'
import snowballThumb from './assets/snowball-thumb-hq.webp'
import snowballThumb2 from './assets/snowball-thumb-2-figma.webp'
import snowballThumb3 from './assets/snowball-thumb-3-figma.webp'
import teacupMain from './assets/teacup-main-figma-latest.webp'
import teacupThumb from './assets/teacup-thumb-hq.webp'
import teacupThumb2Latest from './assets/teacup-thumb-2-figma-latest.webp'
import teacupThumb3Latest from './assets/teacup-thumb-3-figma-latest.webp'

gsap.registerPlugin(ScrollTrigger)

const products = [
  {
    name: 'FLAMINGO',
    number: '1',
    description: ['낮에는 하나의 오브제로,', '밤에는 따뜻한 빛으로.'],
    mainImage: flamingoMain,
    thumbnail: flamingoThumb,
    thumbnailFrames: [
      { src: flamingoThumb },
      { src: flamingoThumb2, crop: { width: '102.3%', height: '840.19%', left: '0.06%', top: '-697.02%' } },
      { src: flamingoThumb3, crop: { width: '107.07%', height: '245.02%', left: '-7.03%', top: '-63.13%' } },
    ],
    imageSide: 'right',
    detail: 'flamingo',
  },
  {
    name: 'SNOWMAN',
    number: '2',
    description: ['겹겹이 포개진 부드러운 곡선,', '그 사이로 은은한 빛이 피어납니다.'],
    mainImage: snowmanMain,
    thumbnail: snowmanThumb,
    thumbnailFrames: [
      { src: snowmanThumb },
      { src: snowmanThumb2, crop: { width: '127.01%', height: '700.65%', left: '-14.33%', top: '-570.71%' } },
      { src: snowmanThumb3, crop: { width: '103.48%', height: '673.04%', left: '-3.34%', top: '-35.91%' } },
    ],
    imageSide: 'left',
    detail: 'snowman',
  },
  {
    name: 'SNOWBALL',
    number: '3',
    description: ['가장 가까운 곳에서,', '일상의 온도를 부드럽게 바꿉니다.'],
    mainImage: snowballMain,
    thumbnail: snowballThumb,
    thumbnailFrames: [
      { src: snowballThumb },
      { src: snowballThumb2, crop: { width: '100%', height: '624.14%', left: '0', top: '-486.66%' } },
      { src: snowballThumb3, crop: { width: '100.04%', height: '182.63%', left: '-0.02%', top: '-46.31%' } },
    ],
    imageSide: 'right',
    detail: 'snowball',
  },
  {
    name: 'TEACUP R',
    number: '4',
    description: ['작지만 선명한 빛으로,', '익숙한 공간에 따뜻한 온기를 더합니다.'],
    mainImage: teacupMain,
    mainCrop: { width: '100%', height: '348.89%', left: '0', top: '-87.99%' },
    thumbnail: teacupThumb,
    thumbnailFrames: [
      { src: teacupMain, crop: { width: '109.82%', height: '842.53%', left: '0', top: '-710.99%' } },
      { src: teacupThumb2Latest, crop: { width: '100%', height: '833.19%', left: '0.12%', top: '-510.47%' } },
      { src: teacupThumb3Latest, crop: { width: '224.94%', height: '1700.74%', left: '-43.82%', top: '-1401.01%' } },
    ],
    imageSide: 'left',
    detail: 'teacup',
  },
]

const renderThumbnailFrames = (product) => (
  <span data-thumbnail-inner className={styles.thumbnailInner}>
    {(product.thumbnailFrames ?? [{ src: product.thumbnail }]).map((frame, index) => (
      <span
        className={styles.thumbnailFrame}
        key={`${product.name}-thumbnail-${index}`}
        style={{ '--frame-index': index }}
      >
        <img
          src={frame.src}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            '--crop-width': frame.crop?.width,
            '--crop-height': frame.crop?.height,
            '--crop-left': frame.crop?.left,
            '--crop-top': frame.crop?.top,
          }}
        />
      </span>
    ))}
  </span>
)

const getCropStyle = (crop) => ({
  '--crop-width': crop?.width,
  '--crop-height': crop?.height,
  '--crop-left': crop?.left,
  '--crop-top': crop?.top,
})

function ProductSection({ onOpenProduct }) {
  const sectionRef = useRef(null)
  const hoverTimerRef = useRef(null)
  const [hoveredProduct, setHoveredProduct] = useState(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    // productName 위/아래 밑줄 길이를 제목 텍스트 길이에 맞춘다.
    const syncTitleLineWidth = () => {
      section.querySelectorAll('[data-product-row]').forEach((row) => {
        const titleBlock = row.querySelector('[data-title-block]')
        if (!titleBlock) return
        row.style.setProperty('--title-line-width', `${titleBlock.getBoundingClientRect().width}px`)
      })
    }
    syncTitleLineWidth()
    window.addEventListener('resize', syncTitleLineWidth)
    // 웹폰트가 늦게 적용되어 제목 너비가 바뀌는 경우까지 다시 한번 보정.
    document.fonts?.ready?.then(syncTitleLineWidth)

    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const hero = section.querySelector('[data-hero-image]')
      const rows = gsap.utils.toArray('[data-product-row]', section)

      gsap.fromTo(
        hero,
        { scale: 1.22 },
        { scale: 1, duration: 2.2, delay: 0.1, ease: 'power3.out' },
      )

      rows.forEach((row) => {
        const titleBlock = row.querySelector('[data-title-block]')
        const description = row.querySelector('[data-product-description]')
        const thumbnailInner = row.querySelector('[data-thumbnail-inner]')
        const thumbnailReveal = row.querySelector('[data-thumbnail-reveal]')

        const revealTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 85%',
            toggleActions: 'play none none reset',
            onEnter: () => {
              if (thumbnailInner) thumbnailInner.dataset.cycle = 'off'
            },
            onLeaveBack: () => {
              if (thumbnailInner) thumbnailInner.dataset.cycle = 'off'
            },
          },
        })

        revealTimeline.fromTo(
          [titleBlock, description],
          { opacity: 0, y: 34 },
          { opacity: 1, y: 0, duration: 0.76, stagger: 0.12, ease: 'power2.out' },
          0.05,
        )

        revealTimeline.fromTo(
          thumbnailInner,
          { scale: 1.25, yPercent: -20 },
          { scale: 1, yPercent: 0, duration: 1.15, ease: 'power3.out' },
          0.4,
        )

        revealTimeline.fromTo(
          thumbnailReveal,
          { scaleY: 1 },
          { scaleY: 0, duration: 1.15, ease: 'power3.out' },
          0.4,
        )

        revealTimeline.call(() => {
          if (thumbnailInner) thumbnailInner.dataset.cycle = 'on'
        }, null, 1.8)
      })

      return () => ScrollTrigger.getAll().forEach((trigger) => {
        if (section.contains(trigger.trigger)) trigger.kill()
      })
    })

    ScrollTrigger.refresh()
    return () => {
      window.clearTimeout(hoverTimerRef.current)
      window.removeEventListener('resize', syncTitleLineWidth)
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
              role={isLinked ? 'link' : undefined}
              tabIndex={isLinked ? 0 : undefined}
              aria-label={isLinked ? `${product.name} 상세 페이지 열기` : undefined}
              data-cursor={isLinked ? 'pointer' : undefined}
              onClick={(event) => {
                if (!isLinked || event.target.closest?.('button, a')) return
                openProduct(product.detail)
              }}
              onKeyDown={(event) => {
                if (!isLinked || event.target !== event.currentTarget) return
                if (event.key !== 'Enter' && event.key !== ' ') return
                event.preventDefault()
                openProduct(product.detail)
              }}
            >
              {isLinked ? (
                <button
                  type="button"
                  className={`${styles.mainVisual} ${styles.productLink}`}
                  data-cursor="pointer"
                  onClick={() => openProduct(product.detail)}
                  aria-label={`${product.name} 상세 페이지 열기`}
                >
                  <span className={styles.mainImageMotion}>
                    <img src={product.mainImage} alt={`${product.name} 조명이 놓인 공간`} loading="lazy" decoding="async" style={getCropStyle(product.mainCrop)} />
                  </span>
                  <span className={styles.mainCta} aria-hidden="true">
                    컬렉션 자세히 보기
                    <span className={styles.mainCtaArrow}>→</span>
                  </span>
                </button>
              ) : (
                <figure className={styles.mainVisual} data-cursor="pointer">
                  <span className={styles.mainImageMotion}>
                    <img src={product.mainImage} alt={`${product.name} 조명이 놓인 공간`} loading="lazy" decoding="async" style={getCropStyle(product.mainCrop)} />
                  </span>
                </figure>
              )}

              <div className={styles.productInfo}>
                <div className={styles.productInfoInner}>
                <h2
                  className={styles.productName}
                  aria-label={product.name}
                  data-title-block
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

                <p className={styles.description} data-product-description>
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
                    {renderThumbnailFrames(product)}
                    <span data-thumbnail-reveal className={styles.thumbnailReveal} aria-hidden="true" />
                  </button>
                ) : (
                  <figure
                    className={styles.thumbnail}
                    data-cursor="pointer"
                    onMouseEnter={() => triggerProductTitleHover(product.name)}
                  >
                    {renderThumbnailFrames(product)}
                    <span data-thumbnail-reveal className={styles.thumbnailReveal} aria-hidden="true" />
                  </figure>
                )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default ProductSection
