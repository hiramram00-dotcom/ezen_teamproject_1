import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroImage from './assets/hero-figma.webp'
import introImage from './assets/intro.webp'
import storySlideShelf from './assets/story-slide-shelf.webp'
import storySlideWhite from './assets/story-slide-white.webp'
import storySlidePink from './assets/story-slide-pink.webp'
import mosaicBox from './assets/mosaic-box.webp'
import mosaicLamp from './assets/mosaic-lamp.webp'
import mosaicGlow from './assets/mosaic-glow.webp'
import mosaicPendant from './assets/mosaic-pendant.webp'
import galleryLeft from './assets/gallery-left-crop.webp'
import galleryRight from './assets/gallery-right.webp'
import otherSnowman from '../FlamingoDetailSection/assets/other-snowman.webp'
import otherSnowball from '../FlamingoDetailSection/assets/other-snowball.webp'
import otherMario from '../FlamingoDetailSection/assets/other-mario.webp'
import otherFlamingo from '../FlamingoDetailSection/assets/other-flamingo.webp'
import otherApollo from '../FlamingoDetailSection/assets/other-apollo.webp'
import styles from './SnowballDetailSection.module.css'

gsap.registerPlugin(ScrollTrigger)

const OTHER_PRODUCTS_DRAG_RESISTANCE = 0.48

const storySlides = [
  { src: storySlidePink, alt: '창가 공간에 설치된 핑크 SNOWBALL 조명' },
  { src: storySlideWhite, alt: '하얀 오브제와 함께 놓인 SNOWBALL 조명' },
  { src: storySlideShelf, alt: '선반 위를 밝히는 SNOWBALL 천장 조명' },
]

const otherProducts = [
  {
    name: <>SNOWMAN22<br />V2</>,
    image: otherSnowman,
    className: 'snowmanCard',
    link: 'https://brand.naver.com/iklamp/category/a2ef0d94e57d4dd4afd4df3a9df5e0bd?cp=1',
  },
  {
    name: <>V2<br />SNOWBALL22</>,
    image: otherSnowball,
    className: 'snowballCard',
    link: 'https://brand.naver.com/iklamp/search?q=snowball',
  },
  {
    name: 'MARIO 14 Table',
    image: otherMario,
    className: 'marioCard',
    link: 'https://brand.naver.com/iklamp/search?q=mario',
  },
  {
    name: <>FLA<br />MINGO<br />26</>,
    image: otherFlamingo,
    className: 'flamingoCard',
    link: 'https://brand.naver.com/iklamp/search?q=flamongo',
  },
  {
    name: 'APOLLO 22',
    image: otherApollo,
    className: 'apolloCard',
    link: 'https://brand.naver.com/iklamp/search?q=apollo',
  },
]

export function ProductOtherSection() {
  const scrollRef = useRef(null)
  const otherIntroRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hasDraggedOtherProducts, setHasDraggedOtherProducts] = useState(false)
  const dragState = useRef({ x: 0, left: 0 })

  useLayoutEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setHasDraggedOtherProducts(false)
      },
      { threshold: 0.05 }
    )

    observer.observe(scroller)

    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const otherIntro = otherIntroRef.current
    if (!otherIntro) return undefined

    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.fromTo(
        otherIntro.children,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: otherIntro,
            start: 'top 82%',
            toggleActions: 'play none none reset',
          },
        }
      )
    }, otherIntro)

    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return undefined

    const cards = scroller.querySelectorAll(`.${styles.otherCard}`)
    if (!cards.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.dataset.visible = entry.isIntersecting ? 'true' : 'false'
        })
      },
      {
        root: scroller,
        rootMargin: '0px -14% 0px -8%',
        threshold: 0.34,
      }
    )

    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  const startDrag = (event) => {
    const scroller = scrollRef.current
    if (!scroller) return

    dragState.current = {
      x: event.clientX,
      left: scroller.scrollLeft,
    }
    setIsDragging(true)
    setHasDraggedOtherProducts(true)
    scroller.setPointerCapture?.(event.pointerId)
  }

  const moveDrag = (event) => {
    const scroller = scrollRef.current
    if (!scroller || !isDragging) return

    const dragDistance = event.clientX - dragState.current.x
    scroller.scrollLeft =
      dragState.current.left - dragDistance * OTHER_PRODUCTS_DRAG_RESISTANCE
  }

  const endDrag = (event) => {
    scrollRef.current?.releasePointerCapture?.(event.pointerId)
    setIsDragging(false)
  }

  return (
    <section
      ref={scrollRef}
      className={`${styles.otherProducts} ${isDragging ? styles.dragging : ''}`}
      aria-label="다른 제품"
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className={`${styles.dragHint} ${
          hasDraggedOtherProducts ? styles.dragHintHidden : ''
        }`}
        aria-hidden="true"
      >
        <span>Drag</span>
        <span>→</span>
      </div>

      <div className={styles.otherTrack}>
        <div ref={otherIntroRef} className={styles.otherIntro}>
          <h2>
            <span className={styles.otherTitleLead}>Other</span>
            <span className={styles.otherTitleAccent}>
              Products
              <span className={styles.otherArrow} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="7" x2="17" y2="17" />
                  <polyline points="17 8 17 17 8 17" />
                </svg>
              </span>
            </span>
          </h2>
          <p>
            부드러운 빛으로 일상에 편안함을 더하는
            <br />
            조명을 찾고 있다면
          </p>
        </div>

        {otherProducts.map((product) => (
          <article className={`${styles.otherCard} ${styles[product.className]}`} key={product.className}>
            <a
              className={styles.otherCardLink}
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              draggable="false"
            >
              <img src={product.image} alt="" draggable="false" />
              <h3>{product.name}</h3>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

function SnowballDetailSection() {
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
  const mosaicLeftRef = useRef(null)
  const mosaicLeftTextRef = useRef(null)
  const mosaicTopRef = useRef(null)
  const mosaicTopLampRef = useRef(null)
  const mosaicBottomRef = useRef(null)
  const mosaicPendantRef = useRef(null)
  const mosaicBlankRef = useRef(null)
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
        clipPath: 'inset(0 0 0% 0)',
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
      const downCards = [mosaicLeftRef.current, mosaicTopRef.current].filter(Boolean)
      const upCards = [
        mosaicBottomRef.current,
        mosaicPendantRef.current,
        mosaicBlankRef.current,
      ].filter(Boolean)
      const lamp = mosaicTopLampRef.current
      const mosaicLeftTextLines = mosaicLeftTextRef.current?.querySelectorAll('[data-mosaic-text]')
      const mosaicLeadTextLines = mosaicLeftTextRef.current?.querySelectorAll('[data-mosaic-lead-text]')
      const mosaicSnowballText = mosaicLeftRef.current?.querySelector('[data-mosaic-title-text]')

      gsap.set(downCards, { autoAlpha: 0, y: -54 })
      gsap.set(upCards, { autoAlpha: 0, y: 54 })
      gsap.set(mosaicLeftTextLines, { autoAlpha: 0, yPercent: 110 })
      gsap.set(mosaicSnowballText, { autoAlpha: 0, yPercent: 110 })
      gsap.set(lamp, { y: 0 })

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set([...downCards, ...upCards], { autoAlpha: 1, y: 0 })
        gsap.set(mosaicLeftTextLines, { autoAlpha: 1, yPercent: 0 })
        gsap.set(mosaicSnowballText, { autoAlpha: 1, yPercent: 0 })
        return
      }

      const reveal = gsap
        .timeline({ paused: true })
        .to(
          downCards,
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: 'power4.out',
            stagger: 0.08,
          },
          0
        )
        .to(
          upCards,
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: 'power4.out',
            stagger: 0.08,
          },
          0.08
        )
        .to(
          mosaicLeadTextLines,
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.72,
            ease: 'power3.out',
            stagger: 0.14,
          },
          0.45
        )
        .to(
          mosaicSnowballText,
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.4,
            ease: 'power3.out',
          },
          0.65
        )

      let floatTween = null

      const startFloat = () => {
        if (!lamp) return
        floatTween?.kill()
        floatTween = gsap.to(lamp, {
          y: -20,
          duration: 1.85,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }

      ScrollTrigger.create({
        trigger: mosaic,
        start: 'top 78%',
        end: 'bottom top',
        onEnter: () => {
          floatTween?.kill()
          gsap.set(lamp, { y: 0 })
          reveal.restart()
          reveal.eventCallback('onComplete', startFloat)
        },
        onEnterBack: () => {
          floatTween?.kill()
          gsap.set(lamp, { y: 0 })
          reveal.restart()
          reveal.eventCallback('onComplete', startFloat)
        },
        onLeave: () => {
          floatTween?.kill()
          gsap.set(lamp, { y: 0 })
        },
        onLeaveBack: () => {
          floatTween?.kill()
          gsap.set(lamp, { y: 0 })
          reveal.pause(0)
        },
      })
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
      <section className={`${styles.panel} ${styles.hero}`} aria-label="SNOWBALL 제품 소개">
        <div className={styles.heroVisual}>
          <img ref={heroImageRef} src={heroImage} alt="소파 위에 놓인 SNOWBALL 조명" />
        </div>
        <h1>SNOWBALL</h1>
      </section>

      <section ref={introRef} className={`${styles.panel} ${styles.intro}`}>
        <div className={styles.introVisual}>
          <img ref={introImageRef} src={introImage} alt="창가에 놓인 SNOWBALL 테이블 조명" />
        </div>
        <div ref={introCopyRef} className={styles.introCopy}>
          <h2 ref={introTitleRef}>
            <span data-intro-line>Light,</span>
            <em data-intro-line>softly settled.</em>
          </h2>
          <p ref={introDescriptionRef}>
            둥근 유리 안에서 빛이 부드럽게 번집니다. 또렷하지 않아 더 편안한 빛이 공간의 온도를 천천히 끌어올리고, 곁에 두는 시간에 잔잔한 포근함을 더합니다. 밝히는 것을 넘어, 하루의 끝까지 가만히 머무는 작은 존재로 곁을 지킵니다.
          </p>
        </div>
      </section>

      <section ref={storyRef} className={`${styles.panel} ${styles.story}`}>
        <div className={styles.storyCopy}>
          <h2 ref={storyTitleRef}>A Sphere That Holds Warmth.</h2>
          <p ref={storyDescriptionRef}>
            은은한 빛이 천천히 내려앉아 책상 위를 차분히 물들입니다. 둥근 유리를 지난 또렷하지 않은 빛이 마주한 공간을 낮게 가라앉히고, 가까운 자리에 포근한 온기를 더합니다. 오래 켜두어도 눈이 편안한 부드러운 빛은, 시선을 끌지 않아도 하루의 끝을 조용히 함께합니다.
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

      <section ref={mosaicRef} className={`${styles.panel} ${styles.mosaic}`} aria-label="SNOWBALL 제품 이미지">
        <div ref={mosaicLeftRef} className={styles.mosaicLeft}>
          <p ref={mosaicLeftTextRef} className={styles.mosaicLeftLead}>
            <span className={styles.mosaicTextMask}>
              <span data-mosaic-text data-mosaic-lead-text>GLOW</span>
            </span>
            <span className={styles.mosaicTextMask}>
              <span data-mosaic-text data-mosaic-lead-text>WITHOUT EDGES.</span>
            </span>
          </p>
          <img src={mosaicBox} alt="테이블 위 SNOWBALL 조명과 패키지" />
          <h2>
            <span className={styles.mosaicTextMask}>
              <span data-mosaic-text data-mosaic-title-text>SNOWBALL</span>
            </span>
          </h2>
        </div>
        <div ref={mosaicTopRef} className={styles.mosaicTop}>
          <div className={styles.mosaicTopFrame}>
            <div ref={mosaicTopLampRef} className={styles.mosaicTopRotated}>
              <img src={mosaicLamp} alt="SNOWBALL 테이블 조명" />
            </div>
          </div>
        </div>
        <div ref={mosaicBottomRef} className={styles.mosaicBottom}>
          <img src={mosaicGlow} alt="빛을 밝힌 SNOWBALL 조명" />
        </div>
        <div ref={mosaicPendantRef} className={styles.mosaicPendant}>
          <img src={mosaicPendant} alt="공간에 설치된 SNOWBALL 펜던트 조명" />
        </div>
        <div ref={mosaicBlankRef} className={styles.mosaicBlank} aria-hidden="true">
          <div className={styles.mosaicBlankPattern} />
        </div>
      </section>

      <section ref={galleryRef} className={`${styles.panel} ${styles.gallery}`}>
        <p ref={galleryEyebrowRef} className={styles.galleryEyebrow}>잔잔하게 번져 가는 둥근 하루.</p>
        <h2 ref={galleryTitleRef}>SNOWBALL</h2>
        <div ref={galleryGridRef} className={styles.galleryGrid}>
          <div><img src={galleryLeft} alt="천장에 설치된 SNOWBALL 조명" /></div>
          <div><img src={galleryRight} alt="카펫 위에 놓인 SNOWBALL 조명" /></div>
        </div>
        <a
          ref={productButtonRef}
          className={styles.productButton}
          href="https://brand.naver.com/iklamp/search?q=snowball"
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

export default SnowballDetailSection
