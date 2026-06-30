import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroImage from './assets/hero.webp'
import introImage from './assets/intro.webp'
import storyImage from './assets/story.webp'
import mosaicLeft from './assets/mosaic-left.webp'
import mosaicRight from './assets/mosaic-right.webp'
import galleryLeft from './assets/gallery-left.webp'
import galleryRight from './assets/gallery-right.webp'
import storySlidePlant from './assets/story-slide-plant.webp'
import storySlideTulip from './assets/story-slide-tulip.webp'
import { ProductOtherSection } from '../SnowballDetailSection/SnowballDetailSection'
import styles from './TeacupDetailSection.module.css'

gsap.registerPlugin(ScrollTrigger)

const storySlides = [
  { src: storyImage, alt: '레드 TEACUP 조명이 놓인 테이블' },
  { src: storySlidePlant, alt: 'TEACUP 조명과 식물이 놓인 공간' },
  { src: storySlideTulip, alt: '튤립과 함께 놓인 TEACUP 조명' },
]

function TeacupDetailSection() {
  const heroImageRef = useRef(null)
  const introRef = useRef(null)
  const introImageRef = useRef(null)
  const introCopyRef = useRef(null)
  const introTitleRef = useRef(null)
  const introDescriptionRef = useRef(null)
  const storyRef = useRef(null)
  const storySlideRefs = useRef([])
  const storyTitleRef = useRef(null)
  const storyDescriptionRef = useRef(null)
  const mosaicRef = useRef(null)
  const galleryRef = useRef(null)
  const galleryGridRef = useRef(null)
  const galleryEyebrowRef = useRef(null)
  const galleryTitleRef = useRef(null)
  const productButtonRef = useRef(null)
  const productButtonTextRef = useRef(null)

  useLayoutEffect(() => {
    const heroImageEl = heroImageRef.current
    if (!heroImageEl) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const tween = gsap.fromTo(
      heroImageEl,
      { scale: 1.22 },
      { scale: 1, duration: 2.2, delay: 0.1, ease: 'power3.out' }
    )

    return () => tween.kill()
  }, [])

  useLayoutEffect(() => {
    const intro = introRef.current
    if (!intro) return undefined

    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.fromTo(
        introImageRef.current,
        { scale: 1.35 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: introImageRef.current,
            start: 'top 90%',
            end: 'bottom 35%',
            scrub: 1,
          },
        }
      )

      const introTitleLines = introTitleRef.current.querySelectorAll('[data-intro-line]')

      gsap
        .timeline({
          scrollTrigger: {
            trigger: introCopyRef.current,
            start: 'top 88%',
            toggleActions: 'restart none none reset',
          },
        })
        .fromTo(
          introTitleLines,
          { autoAlpha: 0, y: 130 },
          { autoAlpha: 1, y: 0, duration: 1.15, ease: 'power3.out', stagger: 0.12 },
          0
        )
        .fromTo(
          introDescriptionRef.current,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          0.45
        )
    }, intro)

    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    const story = storyRef.current
    const slides = storySlideRefs.current.filter(Boolean)
    if (!story || slides.length !== storySlides.length) return undefined

    const ctx = gsap.context(() => {
      gsap.set(slides, {
        xPercent: 100,
        yPercent: 0,
        autoAlpha: 1,
        zIndex: 0,
      })
      gsap.set(slides[0], { xPercent: 0, zIndex: 1 })

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const slider = gsap.timeline({ paused: true, repeat: -1 })
      let current = 0

      for (let index = 1; index <= slides.length; index += 1) {
        const next = index % slides.length
        slider
          .set(slides[next], { xPercent: 100, autoAlpha: 0, zIndex: 2 }, '+=1.5')
          .to(slides[next], {
            xPercent: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: 'power2.inOut',
          })
          .set(slides[current], { xPercent: 100, zIndex: 0 })
          .set(slides[next], { zIndex: 1 })
        current = next
      }

      ScrollTrigger.create({
        trigger: story,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => slider.play(),
        onEnterBack: () => slider.play(),
        onLeave: () => slider.pause(),
        onLeaveBack: () => {
          slider.pause(0)
          gsap.set(slides, { xPercent: 100, zIndex: 0 })
          gsap.set(slides[0], { xPercent: 0, zIndex: 1 })
        },
      })

      gsap
        .timeline({
          scrollTrigger: {
            trigger: storyDescriptionRef.current,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
        })
        .fromTo(
          storyTitleRef.current,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.42, ease: 'sine.out' }
        )
        .fromTo(
          storyDescriptionRef.current,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.38, ease: 'sine.out' },
          '-=0.2'
        )
    }, story)

    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    const mosaic = mosaicRef.current
    if (!mosaic) return undefined

    const ctx = gsap.context(() => {
      const leftImage = mosaic.querySelector('[data-mosaic-image="down"]')
      const rightImage = mosaic.querySelector('[data-mosaic-image="up"]')
      const captions = mosaic.querySelectorAll('[data-mosaic-caption]')

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap
        .timeline({
          scrollTrigger: {
            trigger: mosaic,
            start: 'top 76%',
            toggleActions: 'play none none reverse',
          },
        })
        .fromTo(
          leftImage,
          { yPercent: -105, autoAlpha: 1 },
          { yPercent: 0, duration: 1.55, ease: 'power4.out' },
          0
        )
        .fromTo(
          rightImage,
          { yPercent: 105, autoAlpha: 1 },
          { yPercent: 0, duration: 1.55, ease: 'power4.out' },
          0.12
        )
        .fromTo(
          captions,
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 },
          0.42
        )
    }, mosaic)

    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    const gallery = galleryRef.current
    if (!gallery) return undefined

    const ctx = gsap.context(() => {
      const galleryImages = galleryGridRef.current?.querySelectorAll('img')
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReducedMotion) {
        gsap.set(galleryImages, { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)' })
        return
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: galleryTitleRef.current,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
        })
        .fromTo(
          galleryEyebrowRef.current,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.42, ease: 'sine.out' }
        )
        .fromTo(
          galleryTitleRef.current,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.38, ease: 'sine.out' },
          '-=0.2'
        )

      gsap.fromTo(
        galleryImages,
        {
          autoAlpha: 0,
          y: -12,
          clipPath: 'inset(0 0 100% 0)',
        },
        {
          autoAlpha: 1,
          y: 0,
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.25,
          ease: 'sine.inOut',
          stagger: 0,
          scrollTrigger: {
            trigger: galleryGridRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      const playButtonSweep = () => {
        const buttonText = productButtonTextRef.current
        if (!buttonText) return

        buttonText.classList.remove(styles.productButtonTextSweep)
        void buttonText.offsetWidth
        buttonText.classList.add(styles.productButtonTextSweep)
      }

      ScrollTrigger.create({
        trigger: productButtonRef.current,
        start: 'top 92%',
        onEnter: playButtonSweep,
        onLeaveBack: () => {
          productButtonTextRef.current?.classList.remove(styles.productButtonTextSweep)
        },
      })
    }, gallery)

    return () => ctx.revert()
  }, [])

  return (
    <main className={styles.detail}>
      <section className={`${styles.panel} ${styles.hero}`} aria-label="TEACUP 제품 소개">
        <img ref={heroImageRef} className={styles.heroImage} src={heroImage} alt="햇빛이 드는 공간에 놓인 TEACUP 조명" />
        <h1>TEACUP</h1>
      </section>

      <section ref={introRef} className={`${styles.panel} ${styles.intro}`}>
        <div className={styles.introVisual}>
          <img ref={introImageRef} src={introImage} alt="고양이와 함께 놓인 TEACUP 조명" />
        </div>
        <div ref={introCopyRef} className={styles.introCopy}>
          <h2 ref={introTitleRef}>
            <span data-intro-line>A little</span>
            <em data-intro-line>pool of warmth.</em>
          </h2>
          <p ref={introDescriptionRef}>
            손이 닿는 자리에 두는 작은 빛에 마음을 두었습니다. 크지 않아 더 가깝게 느껴지는 따뜻함이
            책상 한 켠을 조용히 데우고, 혼자 보내는 시간에 낮은 온기를 더합니다. 공간 전체가 아닌,
            바로 곁의 한 뼘을 밝히는 빛으로 제안합니다.
          </p>
        </div>
      </section>

      <section ref={storyRef} className={`${styles.panel} ${styles.story}`}>
        <div className={styles.storyCopy}>
          <h2 ref={storyTitleRef}>A Cup of Quiet Light.</h2>
          <p ref={storyDescriptionRef}>
            티컵 시리즈는 일상의 그릇을 닮은 작은 형태로, 곁에 두기 좋은 빛을 제안합니다. 낮에는 책상 위
            단정한 오브제로 머물고, 밤에는 손이 닿는 거리에서 따뜻한 빛을 밝힙니다. 작지만 단단한 형태와
            빛의 온도에는, 오랜 시간 빛을 다루어 온 일광전구의 감각이 담겨 있습니다.
          </p>
        </div>
        <div className={styles.storyVisual}>
          {storySlides.map((slide, index) => (
            <img
              key={slide.src}
              ref={(element) => {
                storySlideRefs.current[index] = element
              }}
              className={styles.storySlide}
              src={slide.src}
              alt={slide.alt}
            />
          ))}
        </div>
      </section>

      <section ref={mosaicRef} className={`${styles.panel} ${styles.mosaic}`} aria-label="TEACUP 제품 이미지">
        <figure className={styles.mosaicLeft}>
          <div className={styles.mosaicImageMask}>
            <img data-mosaic-image="down" src={mosaicLeft} alt="책상 위 TEACUP 조명" />
          </div>
          <figcaption data-mosaic-caption>
            <span className={styles.mosaicCaptionAccent}>One Warm Point</span>
            <span className={styles.mosaicCaptionPlain}> in the Dark.</span>
          </figcaption>
        </figure>
        <figure className={styles.mosaicRight}>
          <figcaption data-mosaic-caption>
            <span className={styles.mosaicCaptionAccent}>Where the Day </span>
            <span className={styles.mosaicCaptionPlain}>Lingers.</span>
          </figcaption>
          <div className={styles.mosaicImageMask}>
            <img data-mosaic-image="up" src={mosaicRight} alt="꽃과 함께 놓인 TEACUP 조명" />
          </div>
        </figure>
      </section>

      <section ref={galleryRef} className={`${styles.panel} ${styles.gallery}`}>
        <p ref={galleryEyebrowRef} className={styles.galleryEyebrow}>공간에 온기를 더하는 빛.</p>
        <h2 ref={galleryTitleRef}>TEACUP</h2>
        <div ref={galleryGridRef} className={styles.galleryGrid}>
          <div><img src={galleryLeft} alt="선반 위 레드 TEACUP 조명" /></div>
          <div><img src={galleryRight} alt="계단 위 화이트 TEACUP 조명" /></div>
        </div>
        <a
          ref={productButtonRef}
          className={styles.productButton}
          href="https://brand.naver.com/iklamp/search?q=teacup"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span ref={productButtonTextRef} className={styles.productButtonText}>
            제품 보러가기
          </span>
        </a>
      </section>

      <ProductOtherSection />
    </main>
  )
}

export default TeacupDetailSection
