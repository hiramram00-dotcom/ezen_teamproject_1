import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ilkwLogo from './assets/ilkw-green.svg'
import heroFrame from './assets/hero-figma-frame.webp'
import introLamp from './assets/intro-window.webp'
import floorLamp from './assets/floor-lamp.webp'
import storyTulip from './assets/story-tulip.webp'
import storyChair from './assets/story-chair.webp'
import posterGreen from './assets/poster-green.webp'
import posterCenter from './assets/poster-center.webp'
import posterCream from './assets/poster-cream.webp'
import kbpLeft from './assets/kbp-left.webp'
import kbpRight from './assets/kbp-right.webp'
import otherSnowman from './assets/other-snowman.webp'
import otherSnowball from './assets/other-snowball.webp'
import otherMario from './assets/other-mario.webp'
import otherFlamingo from './assets/other-flamingo.webp'
import otherApollo from './assets/other-apollo.webp'
import styles from './FlamingoDetailSection.module.css'

gsap.registerPlugin(ScrollTrigger)

const HERO_VIDEO_URL =
  'https://res.cloudinary.com/dfi8egvz1/video/upload/v1781840122/iklamp/flamingo26_floor_kbp_edition_1080p.mp4'
const OTHER_PRODUCTS_DRAG_RESISTANCE = 0.48

function FlamingoDetailSection() {
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
  const postersRef = useRef(null)
  const posterGridRef = useRef(null)
  const greenPosterRef = useRef(null)
  const greenPosterImageRef = useRef(null)
  const centerPosterRef = useRef(null)
  const centerPosterImageRef = useRef(null)
  const madeForRef = useRef(null)
  const momentRef = useRef(null)
  const creamPosterRef = useRef(null)
  const madeToRef = useRef(null)
  const glowRef = useRef(null)
  const creamProductImageRef = useRef(null)
  const creamLogoRef = useRef(null)
  const creamYearRef = useRef(null)
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
          .set(slides[next], { xPercent: 100, zIndex: 2 }, '+=1.5')
          .to(slides[next], {
            xPercent: 0,
            duration: 0.7,
            ease: 'power1.out',
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
    const posters = postersRef.current
    if (!posters) return undefined

    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.fromTo(
        posterGridRef.current,
        { scale: 0.85 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: posters,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        }
      )
    }, posters)

    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    const poster = greenPosterRef.current
    if (!poster) return undefined

    const ctx = gsap.context(() => {
      const tracks = poster.querySelectorAll('[data-poster-track]')
      const lineBar = poster.querySelector('[data-poster-line-bar]')

      gsap.set(tracks, { yPercent: 0 })
      gsap.set(lineBar, { scaleX: 0, transformOrigin: 'left center' })

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const swapLoop = gsap
        .timeline({ paused: true, repeat: -1 })
        .to(tracks, { yPercent: -50, duration: 0.4, ease: 'sine.inOut' }, 0.9)
        .to(tracks, { yPercent: -50, duration: 0.9 }, 1.3)

      const barIntro = gsap.fromTo(
        lineBar,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.6, ease: 'power2.out', delay: 0.25, paused: true }
      )

      const pulse = gsap
        .timeline({ paused: true, repeat: -1, repeatDelay: 1.5 })
        .to(greenPosterImageRef.current, {
          scale: 1.22,
          duration: 2,
          ease: 'sine.inOut',
        })
        .to(
          greenPosterImageRef.current,
          { scale: 1, duration: 2, ease: 'sine.inOut' },
          '+=1.5'
        )

      ScrollTrigger.create({
        trigger: poster,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => {
          swapLoop.play()
          barIntro.restart()
          pulse.play()
        },
        onEnterBack: () => {
          swapLoop.play()
          barIntro.restart()
          pulse.play()
        },
        onLeave: () => {
          swapLoop.pause()
          barIntro.pause(0)
          pulse.pause()
        },
        onLeaveBack: () => {
          swapLoop.pause()
          barIntro.pause(0)
          pulse.pause()
        },
      })
    }, poster)

    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    const centerPoster = centerPosterRef.current
    if (!centerPoster) return undefined

    const ctx = gsap.context(() => {
      gsap.set(madeForRef.current, { y: 0, autoAlpha: 1 })
      gsap.set(momentRef.current, { y: 0, autoAlpha: 1 })

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.fromTo(
        centerPosterImageRef.current,
        { scale: 1 },
        {
          scale: 1.16,
          ease: 'none',
          scrollTrigger: {
            trigger: centerPoster,
            start: 'top 85%',
            end: 'bottom 15%',
            scrub: 0.8,
          },
        }
      )

      const posterHeight = centerPoster.offsetHeight
      const madeForDistance = posterHeight * (-90 / 557)
      const momentDistance = posterHeight * (147 / 557)

      const float = gsap
        .timeline({ paused: true, repeat: -1 })
        .to(
          madeForRef.current,
          { y: madeForDistance, duration: 1, ease: 'sine.inOut' },
          0.8
        )
        .to(
          momentRef.current,
          { y: momentDistance, duration: 1, ease: 'sine.inOut' },
          0.8
        )
        .to(madeForRef.current, { y: 0, duration: 1, ease: 'sine.inOut' }, 2.6)
        .to(momentRef.current, { y: 0, duration: 1, ease: 'sine.inOut' }, 2.6)

      ScrollTrigger.create({
        trigger: centerPoster,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => float.play(),
        onEnterBack: () => float.play(),
        onLeave: () => float.pause(),
        onLeaveBack: () => float.pause(),
      })
    }, centerPoster)

    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    const creamPoster = creamPosterRef.current
    if (!creamPoster) return undefined

    const ctx = gsap.context(() => {
      gsap.set(madeToRef.current, { x: 0 })
      gsap.set(glowRef.current, { x: 0 })
      gsap.set(creamProductImageRef.current, { scale: 1 })

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const posterWidth = creamPoster.offsetWidth
      const madeToDistance = posterWidth * (159 / 450)
      const glowDistance = posterWidth * (-123 / 450)

      const drift = gsap
        .timeline({ paused: true, repeat: -1 })
        .to(
          madeToRef.current,
          { x: madeToDistance, duration: 1, ease: 'sine.inOut' },
          0.8
        )
        .to(
          glowRef.current,
          { x: glowDistance, duration: 1, ease: 'sine.inOut' },
          0.8
        )
        .to(madeToRef.current, { x: 0, duration: 1, ease: 'sine.inOut' }, 2.6)
        .to(glowRef.current, { x: 0, duration: 1, ease: 'sine.inOut' }, 2.6)
        .to(
          creamProductImageRef.current,
          { scale: 1.35, duration: 1, ease: 'sine.inOut' },
          0.8
        )
        .to(
          creamProductImageRef.current,
          { scale: 1, duration: 1, ease: 'sine.inOut' },
          2.6
        )

      ScrollTrigger.create({
        trigger: creamPoster,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => drift.play(),
        onEnterBack: () => drift.play(),
        onLeave: () => drift.pause(),
        onLeaveBack: () => drift.pause(),
      })
    }, creamPoster)

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
          poster={heroFrame}
          aria-label="창가에 놓인 플라밍고 조명 영상"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        <h1 className={styles.heroTitle}>FLAMINGO</h1>
      </section>

      <section ref={introRef} className={`${styles.panel} ${styles.intro}`}>
        <figure className={styles.introVisual}>
          <img
            ref={introImageRef}
            src={introLamp}
            alt="책 위에 놓인 플라밍고 조명"
          />
        </figure>
        <div ref={introCopyRef} className={styles.introCopy}>
          <h2 ref={introTitleRef} className={styles.introTitle}>
            <span data-intro-line>A quiet</span>
            <em data-intro-line>form of light.</em>
          </h2>
          <p ref={introDescriptionRef} className={styles.introDescription}>
            빛이 공간과 사람 사이에 만들어내는 감각에 주목했습니다. 시선을 끄는
            조형성과 편안한 조명 경험으로 공간의 인상을 섬세하게 변화시키고,
            머무는 시간에 여유와 깊이를 더합니다. 조명을 단순한 기능이 아닌 취향을
            표현하며 일상에 오래 머무는 존재로 제안합니다.
          </p>
        </div>
      </section>

      <section ref={storyRef} className={`${styles.panel} ${styles.story}`}>
        <figure className={styles.storyVisual}>
          {[floorLamp, storyTulip, storyChair].map((src, index) => (
            <img
              key={src}
              ref={(element) => {
                storySlideRefs.current[index] = element
              }}
              className={styles.storySlide}
              src={src}
              alt={
                index === 0
                  ? '꽃과 함께 놓인 플라밍고 플로어 조명'
                  : index === 1
                    ? '튤립과 함께 놓인 플라밍고 조명'
                    : '의자 옆 테이블에 놓인 플라밍고 조명'
              }
            />
          ))}
        </figure>
        <div className={styles.storyCopy}>
          <h2 ref={storyTitleRef}>Elegance in Every Curve.</h2>
          <p ref={storyDescriptionRef}>
            플라밍고 시리즈는 유연하게 이어지는 곡선과 절제된 형태로 공간에
            우아한 균형을 더합니다. 낮에는 하나의 오브제로 존재하고, 밤에는
            따뜻한 빛으로 일상의 풍경을 부드럽게 밝힙니다. 빛을 켜는 순간의
            온도와 결에는, 오랜 시간 빛을 다루어 온 일광전구의 감각이 조용히
            담겨 있습니다.
          </p>
        </div>
      </section>

      <section ref={postersRef} className={`${styles.panel} ${styles.posters}`}>
        <div ref={posterGridRef} className={styles.posterGrid}>
          <article ref={greenPosterRef} className={`${styles.posterCard} ${styles.greenPoster}`}>
            <span className={styles.liveIn}>
              <span className={styles.posterTrack} data-poster-track>
                <span>LIVE IN</span>
                <span aria-hidden="true">LIVE IN</span>
              </span>
            </span>
            <span className={styles.better}>
              <span className={styles.posterTrack} data-poster-track>
                <span>A BETTER</span>
                <span aria-hidden="true">A BETTER</span>
              </span>
            </span>
            <span className={styles.light}>
              <span className={styles.posterTrack} data-poster-track>
                <span>LIGHT</span>
                <span aria-hidden="true">LIGHT</span>
              </span>
            </span>
            <span
              className={styles.posterLine}
              data-poster-line-bar
              aria-hidden="true"
            />
            <div className={styles.greenPosterImageMask}>
              <img ref={greenPosterImageRef} src={posterGreen} alt="녹색 플라밍고 조명 포스터" />
            </div>
          </article>

          <article ref={centerPosterRef} className={`${styles.posterCard} ${styles.centerPoster}`}>
            <img ref={centerPosterImageRef} src={posterCenter} alt="플라밍고 조명 포스터" />
            <span ref={madeForRef} className={styles.madeFor}>
              <span>MADE FOR THE</span>
            </span>
            <span ref={momentRef} className={styles.moment}>
              <span>MOMENT</span>
            </span>
          </article>

          <article ref={creamPosterRef} className={`${styles.posterCard} ${styles.creamPoster}`}>
            <h2 ref={madeToRef} className={styles.madeTo}>MADE TO</h2>
            <h2 ref={glowRef} className={styles.glow}>GLOW</h2>
            <div className={styles.creamProductImageMask}>
              <img
                ref={creamProductImageRef}
                className={styles.creamProductImage}
                src={posterCream}
                alt="크림색 플라밍고 조명 포스터"
              />
            </div>
            <img ref={creamLogoRef} className={styles.creamLogo} src={ilkwLogo} alt="ILKW" />
            <span ref={creamYearRef}>— 1962</span>
          </article>
        </div>
      </section>

      <section ref={collaborationRef} className={`${styles.panel} ${styles.collaboration}`}>
        <div className={styles.collaborationHeading}>
          <p ref={collaborationSubtitleRef} className={styles.collaborationSubtitle}>
            공간에 온기를 더하는 빛.
          </p>
          <h2 ref={collaborationTitleRef} className={styles.collaborationTitle}>
            FLAMINGO
          </h2>
        </div>
        <div ref={collaborationGridRef} className={styles.collaborationGrid}>
          <img src={kbpLeft} alt="책 위에 놓인 키티버니포니 패턴 플라밍고 조명" />
          <img src={kbpRight} alt="튤립 옆에 놓인 키티버니포니 패턴 플라밍고 조명" />
        </div>
        <a
          ref={collaborationButtonRef}
          className={styles.collaborationButton}
          href="#"
          data-cursor="pointer"
        >
          <span ref={collaborationButtonTextRef} className={styles.collaborationButtonText}>
            제품 보러가기
          </span>
        </a>
      </section>

      <section
        ref={scrollRef}
        className={`${styles.otherProducts} ${
          isDragging ? styles.dragging : ''
        }`}
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
          <span>← →</span>
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

          <article className={`${styles.otherCard} ${styles.snowmanCard}`}>
            <img src={otherSnowman} alt="SNOWMAN22 V2" draggable="false" />
            <h3>
              SNOWMAN22
              <br />
              V2
            </h3>
          </article>

          <article className={`${styles.otherCard} ${styles.snowballCard}`}>
            <img src={otherSnowball} alt="V2 SNOWBALL22" draggable="false" />
            <h3>
              V2
              <br />
              SNOWBALL22
            </h3>
          </article>

          <article className={`${styles.otherCard} ${styles.marioCard}`}>
            <img src={otherMario} alt="MARIO 14 Table" draggable="false" />
            <h3>MARIO 14 Table</h3>
          </article>

          <article className={`${styles.otherCard} ${styles.flamingoCard}`}>
            <img src={otherFlamingo} alt="FLAMINGO 26" draggable="false" />
            <h3>
              FLA
              <br />
              MINGO
              <br />
              26
            </h3>
          </article>

          <article className={`${styles.otherCard} ${styles.apolloCard}`}>
            <img src={otherApollo} alt="APOLLO 22" draggable="false" />
            <h3>APOLLO 22</h3>
          </article>
        </div>
      </section>
    </main>
  )
}

export default FlamingoDetailSection
