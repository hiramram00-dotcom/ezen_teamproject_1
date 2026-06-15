import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './ProductSection.module.css'
import blackLogo from '../Snowman1Section/assets/logo-ilkw-black.svg'
import whiteLogo from '../Snowman1Section/assets/logo-ilkw.svg'
import heroImage from './assets/product-hero.avif'
import flamingoMain from './assets/flamingo-main.avif'
import flamingoThumb from './assets/flamingo-thumb.avif'
import snowmanMain from './assets/snowman-main.avif'
import snowmanThumb from './assets/snowman-thumb.avif'
import snowballMain from './assets/snowball-main.avif'
import snowballThumb from './assets/snowball-thumb.avif'
import teacupMain from './assets/teacup-main.avif'
import teacupThumb from './assets/teacup-thumb.avif'

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
    titleX: '48.28%',
    logoLeft: '1.98%',
    logoWidth: '4.23%',
  },
  {
    name: 'SNOWMAN',
    description: ['유리 위에 새겨진 리듬을 따라,', '따뜻한 빛과 온기가 공간에 번집니다.'],
    mainImage: snowmanMain,
    thumbnail: snowmanThumb,
    imageSide: 'left',
    contentX: '50.68%',
    titleX: '50.68%',
    logoLeft: '1.2%',
    logoWidth: '5.36%',
  },
  {
    name: 'SNOWBALL',
    description: ['가장 가까운 곳에서,', '일상의 온도를 부드럽게 바꿉니다.'],
    mainImage: snowballMain,
    thumbnail: snowballThumb,
    imageSide: 'right',
    contentX: '53.28%',
    titleX: '53.33%',
    logoLeft: '1.2%',
    logoWidth: '5.36%',
  },
  {
    name: 'TEACUP R',
    description: ['작지만 선명한 빛으로,', '익숙한 공간에 따뜻한 온기를 더합니다.'],
    mainImage: teacupMain,
    thumbnail: teacupThumb,
    imageSide: 'left',
    contentX: '49.84%',
    titleX: '49.9%',
    logoLeft: '1.98%',
    logoWidth: '5.36%',
  },
]

function ProductSection({ onOpenProduct }) {
  const sectionRef = useRef(null)
  const flamingoRowRef = useRef(null)
  const flamingoMainRef = useRef(null)
  const flamingoThumbImageRef = useRef(null)
  const flamingoTitleRef = useRef(null)

  useLayoutEffect(() => {
    const row = flamingoRowRef.current
    const mainImage = flamingoMainRef.current
    const thumbnailImage = flamingoThumbImageRef.current
    const title = flamingoTitleRef.current

    if (!row || !mainImage || !thumbnailImage || !title) return undefined

    const media = gsap.matchMedia()

    media.add(
      {
        desktop: '(min-width: 701px)',
        mobile: '(max-width: 700px)',
        allowMotion: '(prefers-reduced-motion: no-preference)',
      },
      ({ conditions }) => {
        if (!conditions.allowMotion) return undefined

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top bottom',
            end: 'center center',
            scrub: 1.4,
            invalidateOnRefresh: true,
          },
        })

        timeline.fromTo(
          mainImage,
          { scale: conditions.desktop ? 1.16 : 1.1 },
          { scale: 1, ease: 'none' },
          0,
        )

        timeline.fromTo(
          thumbnailImage,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' },
          0,
        )

        timeline.fromTo(
          title,
          { y: conditions.desktop ? 10 : 6 },
          { y: 0, ease: 'none' },
          0,
        )

        return () => timeline.kill()
      },
    )

    ScrollTrigger.refresh()

    return () => media.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="product"
      className={styles.products}
      aria-label="ILKW 제품 컬렉션"
    >
      <div className={styles.hero}>
        <img
          className={styles.heroImage}
          src={heroImage}
          alt="ILKW 조명 컬렉션"
          fetchPriority="high"
        />
        <img className={styles.heroLogo} src={blackLogo} alt="ILKW" />
        <img
          className={styles.heroWordmark}
          src={whiteLogo}
          alt=""
          aria-hidden="true"
        />
      </div>

      <div className={styles.catalog}>
        {products.map((product) => (
          <article
            className={`${styles.productRow} ${
              product.imageSide === 'left' ? styles.imageLeft : styles.imageRight
            } ${product.detail ? styles.flamingoRow : ''}`}
            key={product.name}
            ref={product.detail ? flamingoRowRef : null}
            style={{
              '--content-x': product.contentX,
              '--title-x': product.titleX,
              '--logo-left': product.logoLeft,
              '--logo-width': product.logoWidth,
            }}
          >
            {product.detail ? (
              <button
                type="button"
                className={`${styles.mainVisual} ${styles.productLink}`}
                onClick={() => onOpenProduct(product.detail)}
                aria-label={`${product.name} 상세 페이지 열기`}
              >
                <span ref={flamingoMainRef} className={styles.mainImageMotion}>
                  <img
                    src={product.mainImage}
                    alt={`${product.name} 조명이 놓인 공간`}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
              </button>
            ) : (
              <figure className={styles.mainVisual}>
                <img
                  src={product.mainImage}
                  alt={`${product.name} 조명이 놓인 공간`}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            )}

            <div className={styles.productInfo}>
              <h2
                className={`${styles.productName} ${
                  product.detail ? styles.flamingoName : ''
                }`}
                ref={product.detail ? flamingoTitleRef : null}
              >
                {product.detail
                  ? (
                      <button
                        type="button"
                        className={styles.flamingoTitleButton}
                        onClick={() => onOpenProduct(product.detail)}
                        aria-label={`${product.name} 상세 페이지 열기`}
                      >
                        {[...product.name].map((letter, index) => (
                          <span
                            className={styles.flamingoChar}
                            key={`${letter}-${index}`}
                            style={{ '--char-index': index }}
                          >
                            {letter}
                          </span>
                        ))}
                      </button>
                    )
                  : product.name}
              </h2>

              <p className={styles.description}>
                {product.description.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>

              {product.detail ? (
                <button
                  type="button"
                  className={`${styles.thumbnail} ${styles.productLink}`}
                  onClick={() => onOpenProduct(product.detail)}
                  aria-label={`${product.name} 상세 페이지 열기`}
                >
                  <img
                    ref={flamingoThumbImageRef}
                    src={product.thumbnail}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              ) : (
                <figure className={styles.thumbnail}>
                  <img
                    src={product.thumbnail}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              )}
            </div>

            <img className={styles.rowLogo} src={blackLogo} alt="ILKW" />
          </article>
        ))}
      </div>
    </section>
  )
}

export default ProductSection
