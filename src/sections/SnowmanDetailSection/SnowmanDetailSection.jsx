import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroImage from './assets/hero-snowman.webp'
import introLamp from './assets/intro-snowman.webp'
import collaborationLeft from './assets/snowman-collab-left-figma.webp'
import collaborationRight from './assets/snowman-collab-right-figma.webp'
import storyPendantTouch from './assets/story-pendant-touch.webp'
import storyTableLamp from './assets/story-table-lamp.webp'
import storyChairFloorLamp from './assets/story-chair-floor-lamp.webp'
import marqueeCardQuietly from './assets/marquee-card-quietly.webp'
import marqueeCardQuietGlow from './assets/marquee-card-quiet-glow.webp'
import marqueeCardSoftHour from './assets/marquee-card-soft-hour.webp'
import marqueeCardLightStays from './assets/marquee-card-light-stays.webp'
import marqueeCardLessWarmer from './assets/marquee-card-less-warmer.webp'
import marqueeCardSoftDesign from './assets/marquee-card-soft-design.webp'
import marqueeCardCloseBy from './assets/marquee-card-close-by.webp'
import marqueeCardStillWarm from './assets/marquee-card-still-warm.webp'
import otherSnowman from './assets/other-snowman.webp'
import otherSnowball from './assets/other-snowball.webp'
import otherMario from './assets/other-mario.webp'
import otherFlamingo from './assets/other-flamingo.webp'
import otherApollo from './assets/other-apollo.webp'
import styles from './SnowmanDetailSection.module.css'
import otherStyles from '../../styles/otherTrack.module.css'

gsap.registerPlugin(ScrollTrigger)

const OTHER_PRODUCTS_DRAG_RESISTANCE = 0.48
const HERO_VIDEO_URL =
  'https://res.cloudinary.com/dfi8egvz1/video/upload/v1782694757/iklamp/snowman22-v2-table-720p.mp4'

const storySlides = [storyPendantTouch, storyTableLamp, storyChairFloorLamp]

const topMarqueeCards = [
  {
    image: marqueeCardQuietly,
    alt: 'SNOWMAN lamp with Quietly here copy',
    variant: 'quietlyCard',
    content: (
      <p className={`${styles.marqueeCopy} ${styles.quietlyCopy}`}>
        <span>Quietly</span>
        <span>here.</span>
      </p>
    ),
  },
  {
    image: marqueeCardQuietGlow,
    alt: 'Round SNOWMAN lamp glowing quietly',
    variant: 'quietGlowCard',
    content: <p className={`${styles.marqueeCopy} ${styles.quietGlowCopy}`}>A quiet glow.</p>,
  },
  {
    image: marqueeCardSoftHour,
    alt: 'SNOWMAN lamp framed in orange poster',
    variant: 'softHourCard',
    content: null,
  },
  {
    image: marqueeCardLightStays,
    alt: 'SNOWMAN lamp on striped textile',
    content: (
      <p className={`${styles.marqueeCopy} ${styles.lightStaysCopy}`}>
        Light that <em>stays.</em>
      </p>
    ),
  },
]

const bottomMarqueeCards = [
  {
    image: marqueeCardLessWarmer,
    alt: 'Small SNOWMAN lamp poster on green background',
    variant: 'lessWarmerCard',
    content: <p className={`${styles.marqueeCopy} ${styles.lessWarmerCopy}`}>Less, but warmer.</p>,
  },
  {
    image: marqueeCardSoftDesign,
    alt: 'SNOWMAN lamp shadow detail',
    variant: 'softDesignCard',
    content: (
      <p className={`${styles.marqueeCopy} ${styles.softDesignCopy}`}>
        Soft by <em>design.</em>
      </p>
    ),
  },
  {
    image: marqueeCardCloseBy,
    alt: 'Person holding a SNOWMAN lamp near greenery',
    content: (
      <div className={`${styles.marqueeCopy} ${styles.closeByCopy}`}>
        <p>
          <em>Light,</em> close by.
        </p>
        <span>멀리서 비추기보다</span>
        <span>손이 닿는 자리에서</span>
        <span>함께합니다.</span>
      </div>
    ),
  },
  {
    image: marqueeCardStillWarm,
    alt: 'Hand adjusting a warm SNOWMAN lamp',
    variant: 'stillWarmCard',
    content: (
      <p className={`${styles.marqueeCopy} ${styles.stillWarmCopy}`}>
        Still, and <em>warm.</em>
      </p>
    ),
  },
]

const renderMarqueeCards = (cards) =>
  Array.from({ length: 4 }, () => cards).flat().map((card, index) => (
    <article
      className={styles.marqueeCard}
      key={`${card.alt}-${index}`}
      aria-hidden={index >= cards.length}
    >
      <img src={card.image} alt={index < cards.length ? card.alt : ''} draggable="false" />
    </article>
  ))

function SnowmanDetailSection() {
  const scrollRef = useRef(null)
  const introRef = useRef(null)
  const introImageRef = useRef(null)
  const introCopyRef = useRef(null)
  const introTitleRef = useRef(null)
  const introDescriptionRef = useRef(null)
  const storyRef = useRef(null)
  const storySlideRefs = useRef([])
  const storyTitleRef = useRef(null)
  const storyDescriptionRef = useRef(null)
  const collaborationRef = useRef(null)
  const collaborationGridRef = useRef(null)
  const collaborationSubtitleRef = useRef(null)
  const collaborationTitleRef = useRef(null)
  const collaborationButtonRef = useRef(null)
  const collaborationButtonTextRef = useRef(null)
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
    if (!story || slides.length !== 3) return undefined

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
    const collaboration = collaborationRef.current
    if (!collaboration) return undefined

    const ctx = gsap.context(() => {
      const collaborationImages = collaborationGridRef.current?.querySelectorAll('img')
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReducedMotion) {
        gsap.set(collaborationImages, { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)' })
        return
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: collaborationTitleRef.current,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
        })
        .fromTo(
          collaborationSubtitleRef.current,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.42, ease: 'sine.out' }
        )
        .fromTo(
          collaborationTitleRef.current,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.38, ease: 'sine.out' },
          '-=0.2'
        )

      gsap.fromTo(
        collaborationImages,
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
            trigger: collaborationGridRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      const playButtonSweep = () => {
        const buttonText = collaborationButtonTextRef.current
        if (!buttonText) return

        buttonText.classList.remove(styles.collaborationButtonTextSweep)
        void buttonText.offsetWidth
        buttonText.classList.add(styles.collaborationButtonTextSweep)
      }

      ScrollTrigger.create({
        trigger: collaborationButtonRef.current,
        start: 'top 92%',
        onEnter: playButtonSweep,
        onLeaveBack: () => {
          collaborationButtonTextRef.current?.classList.remove(
            styles.collaborationButtonTextSweep
          )
        },
      })
    }, collaboration)

    return () => ctx.revert()
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
    <main className={styles.detail}>
      <section className={`${styles.panel} ${styles.hero}`}>
        <video
          className={styles.heroBackground}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={heroImage}
          aria-label="SNOWMAN22 V2 lighting video"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        <h1 className={styles.heroTitle}>SNOWMAN</h1>
      </section>

      <section ref={introRef} className={`${styles.panel} ${styles.intro}`}>
        <figure className={styles.introVisual}>
          <img ref={introImageRef} src={introLamp} alt="창가에 놓인 SNOWMAN 조명" />
        </figure>
        <div ref={introCopyRef} className={styles.introCopy}>
          <h2 ref={introTitleRef} className={styles.introTitle}>
            <span data-intro-line>Warmth,</span>
            <em data-intro-line>in its simplest form.</em>
          </h2>
          <p ref={introDescriptionRef} className={styles.introDescription}>
            <span className={styles.defaultCopy}>
              군더더기 없는 실루엣 안에, 가장 본질적인 빛의 따뜻함을
              <br className={styles.tabletBr} />{' '}
              담았습니다. 화려한 장식이나
              <br className={styles.desktopBr} />
              복잡한 구조 대신,
              <br className={styles.tabletBr} />{' '}
              둥글고 단정한 형태만으로 공간에 스며듭니다.
              <br className={styles.tabletBr} />{' '}
              꾸미지 않아도 충분한 빛,
              <br className={styles.desktopBr} />
              오래 보아도 질리지 않는
              <br className={styles.tabletBr} />{' '}
              단순함 속에서 일상의 온기가 조용히 머뭅니다.
            </span>
            <span className={styles.mobileCopy}>
              군더더기 없는 실루엣 안에, 가장 본질적인 빛의 따뜻함을
              <br />
              담았습니다. 화려한 장식이나 복잡한 구조 대신,
              <br />
              단정한 형태만으로 공간에 스며듭니다.
              <br />
              꾸미지 않아도 충분한 빛, 오래 보아도 질리지 않는
              <br />
              단순함 속에서 일상의 온기가 조용히 머뭅니다.
            </span>
          </p>
        </div>
      </section>

      <section ref={storyRef} className={`${styles.panel} ${styles.story}`}>
        <figure className={styles.storyVisual}>
          {storySlides.map((src, index) => (
            <img
              key={src}
              ref={(element) => {
                storySlideRefs.current[index] = element
              }}
              src={src}
              alt={
                index === 0
                  ? '손으로 SNOWMAN 펜던트 조명을 만지는 모습'
                  : index === 1
                    ? '햇빛이 드는 협탁 위에 놓인 SNOWMAN 테이블 조명'
                    : '원목 벽 앞 의자 옆에 놓인 SNOWMAN 플로어 조명'
              }
            />
          ))}
        </figure>
        <div className={styles.storyCopy}>
          <h2 ref={storyTitleRef}>Standing, softly lit.</h2>
          <p ref={storyDescriptionRef}>
            <span className={styles.defaultCopy}>
              두 겹으로 포개진 둥근 디퓨저가 빛을 표면 전체로 감싸,
              <br className={styles.tabletBr} />{' '}
              눈부심 없이
              <br className={styles.desktopBr} />{' '}
              고르게 퍼뜨립니다. 위아래로 맞닿은
              <br className={styles.tabletBr} />{' '}
              곡면은 눈사람을 닮은 둥근 형태로
              <br className={styles.desktopBr} />{' '}
              어느 방향에서 보아도
              <br className={styles.tabletBr} />{' '}
              단정합니다. 빛이 부드럽게 번져 공간을 편안한 밝기로 채웁니다.
            </span>
            <span className={styles.mobileCopy}>
              두 겹으로 포개진 둥근 디퓨저가 빛을 표면 전체로 감싸, 눈부심 없이
              <br />
              고르게 퍼뜨립니다. 위아래로 맞닿은 곡면은 눈사람을 닮은
              <br />
              둥근 형태로 어느 방향에서 보아도 단정합니다. 빛이 부드럽게 번져
              <br />
              공간을 편안한 밝기로 채웁니다.
            </span>
          </p>
        </div>
      </section>

      <section className={`${styles.panel} ${styles.marqueeShowcase}`} aria-label="SNOWMAN moments">
        <div className={`${styles.marqueeRow} ${styles.marqueeRowTop}`}>
          {renderMarqueeCards(topMarqueeCards)}
        </div>
        <div className={`${styles.marqueeRow} ${styles.marqueeRowBottom}`}>
          {renderMarqueeCards(bottomMarqueeCards)}
        </div>
      </section>

      <section ref={collaborationRef} className={`${styles.panel} ${styles.collaboration}`}>
        <div className={styles.collaborationHeading}>
          <p ref={collaborationSubtitleRef} className={styles.collaborationSubtitle}>
            둥글게 쌓아 올린 부드러운 온기.
          </p>
          <h2 ref={collaborationTitleRef} className={styles.collaborationTitle}>
            SNOWMAN
          </h2>
        </div>
        <div ref={collaborationGridRef} className={styles.collaborationGrid}>
          <img src={collaborationLeft} alt="SNOWMAN 조명 포스터 이미지" />
          <img src={collaborationRight} alt="SNOWMAN 조명 디테일 이미지" />
        </div>
        <a
          ref={collaborationButtonRef}
          className={styles.collaborationButton}
          href="https://brand.naver.com/iklamp/category/a2ef0d94e57d4dd4afd4df3a9df5e0bd?cp=1"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="pointer"
        >
          <span ref={collaborationButtonTextRef} className={styles.collaborationButtonText}>
            제품 보러가기
          </span>
        </a>
      </section>

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
          className={`${otherStyles.dragHint} ${otherStyles.dragHintDesktop} ${
            hasDraggedOtherProducts ? otherStyles.dragHintHidden : ''
          }`}
          aria-hidden="true"
        >
          <span>Drag</span>
          <span>←→</span>
        </div>

        <div className={otherStyles.otherTrack}>
          <div ref={otherIntroRef} className={otherStyles.otherIntro}>
            <h2>
              <span className={otherStyles.otherTitleLead}>Other</span>
              <span className={otherStyles.otherTitleAccent}>
                Products
                <span className={otherStyles.otherArrow} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="7" x2="17" y2="17" />
                    <polyline points="17 8 17 17 8 17" />
                  </svg>
                </span>
              </span>
            </h2>
            <p>
              부드러운 빛으로
              <br />
              일상에 편안함을 더하는 조명을 찾고 있다면
            </p>
            <div
              className={`${otherStyles.dragHint} ${otherStyles.dragHintTablet} ${
                hasDraggedOtherProducts ? otherStyles.dragHintHidden : ''
              }`}
              aria-hidden="true"
            >
              <span>Drag</span>
              <span>← →</span>
            </div>
          </div>

          <article className={`${styles.otherCard} ${styles.snowmanCard}`}>
            <a
              className={styles.otherCardLink}
              href="https://brand.naver.com/iklamp/category/a2ef0d94e57d4dd4afd4df3a9df5e0bd?cp=1"
              target="_blank"
              rel="noopener noreferrer"
              draggable="false"
              data-cursor="pointer"
            >
              <img src={otherSnowman} alt="SNOWMAN22 V2" draggable="false" />
              <h3>
                SNOWMAN22
                <br />
                V2
              </h3>
            </a>
          </article>

          <article className={`${styles.otherCard} ${styles.snowballCard}`}>
            <a
              className={styles.otherCardLink}
              href="https://brand.naver.com/iklamp/search?q=snowball"
              target="_blank"
              rel="noopener noreferrer"
              draggable="false"
              data-cursor="pointer"
            >
              <img src={otherSnowball} alt="V2 SNOWBALL22" draggable="false" />
              <h3>
                V2
                <br />
                SNOWBALL22
              </h3>
            </a>
          </article>

          <article className={`${styles.otherCard} ${styles.marioCard}`}>
            <a
              className={styles.otherCardLink}
              href="https://brand.naver.com/iklamp/search?q=mario"
              target="_blank"
              rel="noopener noreferrer"
              draggable="false"
              data-cursor="pointer"
            >
              <img src={otherMario} alt="MARIO 14 Table" draggable="false" />
              <h3>MARIO 14 Table</h3>
            </a>
          </article>

          <article className={`${styles.otherCard} ${styles.flamingoCard}`}>
            <a
              className={styles.otherCardLink}
              href="https://brand.naver.com/iklamp/search?q=flamongo"
              target="_blank"
              rel="noopener noreferrer"
              draggable="false"
              data-cursor="pointer"
            >
              <img src={otherFlamingo} alt="FLAMINGO 26" draggable="false" />
              <h3>
                FLA
                <br />
                MINGO
                <br />
                26
              </h3>
            </a>
          </article>

          <article className={`${styles.otherCard} ${styles.apolloCard}`}>
            <a
              className={styles.otherCardLink}
              href="https://brand.naver.com/iklamp/search?q=apollo"
              target="_blank"
              rel="noopener noreferrer"
              draggable="false"
              data-cursor="pointer"
            >
              <img src={otherApollo} alt="APOLLO 22" draggable="false" />
              <h3>APOLLO 22</h3>
            </a>
          </article>
        </div>
      </section>
    </main>
  )
}

export default SnowmanDetailSection
