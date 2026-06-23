import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ilkwLogo from './assets/ilkw-green.svg'
import heroBackground from './assets/hero-background.webp'
import introLamp from './assets/intro-lamp.webp'
import floorLamp from './assets/floor-lamp.webp'
import storyTulip from './assets/story-tulip.webp'
import storyChair from './assets/story-chair.webp'
import posterGreen from './assets/poster-green.webp'
import posterCenter from './assets/poster-center.webp'
import posterCream from './assets/poster-cream.webp'
import kbpLeft from './assets/kbp-left.webp'
import kbpRight from './assets/kbp-right.webp'
import kbpWide from './assets/kbp-wide.webp'
import otherSnowman from './assets/other-snowman.webp'
import otherSnowball from './assets/other-snowball.webp'
import otherMario from './assets/other-mario.webp'
import otherFlamingo from './assets/other-flamingo.webp'
import otherApollo from './assets/other-apollo.webp'
import styles from './FlamingoDetailSection.module.css'

gsap.registerPlugin(ScrollTrigger)

const HERO_VIDEO_URL =
  'https://res.cloudinary.com/dfi8egvz1/video/upload/v1781840122/iklamp/flamingo26_floor_kbp_edition_1080p.mp4'

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
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef({ x: 0, left: 0 })

  useLayoutEffect(() => {
    const intro = introRef.current
    if (!intro) return undefined

    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.fromTo(
        introImageRef.current,
        { scale: 1.12 },
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

      gsap
        .timeline({
          scrollTrigger: {
            trigger: introCopyRef.current,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        })
        .fromTo(
          introTitleRef.current,
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }
        )
        .fromTo(
          introDescriptionRef.current,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out' },
          '-=0.15'
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
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }
        )
        .fromTo(
          storyDescriptionRef.current,
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.15'
        )
    }, story)

    return () => ctx.revert()
  }, [])

  const startDrag = (event) => {
    const scroller = scrollRef.current
    if (!scroller) return

    dragState.current = {
      x: event.clientX,
      left: scroller.scrollLeft,
    }
    setIsDragging(true)
    scroller.setPointerCapture?.(event.pointerId)
  }

  const moveDrag = (event) => {
    const scroller = scrollRef.current
    if (!scroller || !isDragging) return

    scroller.scrollLeft =
      dragState.current.left - (event.clientX - dragState.current.x)
  }

  const endDrag = (event) => {
    scrollRef.current?.releasePointerCapture?.(event.pointerId)
    setIsDragging(false)
  }

  const moveWithWheel = (event) => {
    const scroller = scrollRef.current
    if (!scroller || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return

    event.preventDefault()
    scroller.scrollLeft += event.deltaY
  }

  return (
    <main className={styles.detail}>
      <section className={`${styles.panel} ${styles.hero}`}>
        <video
          className={styles.heroBackground}
          poster={heroBackground}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
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
            <span>A quiet</span>
            <em>form of light.</em>
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

      <section className={`${styles.panel} ${styles.posters}`}>
        <div className={styles.posterGrid}>
          <article className={`${styles.posterCard} ${styles.greenPoster}`}>
            <span className={styles.liveIn}>LIVE IN</span>
            <span className={styles.better}>A BETTER</span>
            <span className={styles.light}>LIGHT</span>
            <span className={styles.posterLine} aria-hidden="true" />
            <img src={posterGreen} alt="녹색 플라밍고 조명 포스터" />
          </article>

          <article className={`${styles.posterCard} ${styles.centerPoster}`}>
            <img src={posterCenter} alt="플라밍고 조명 포스터" />
            <span className={styles.madeFor}>MADE FOR THE</span>
            <span className={styles.moment}>MOMENT</span>
          </article>

          <article className={`${styles.posterCard} ${styles.creamPoster}`}>
            <h2>MADE TO GLOW</h2>
            <img
              className={styles.creamProductImage}
              src={posterCream}
              alt="크림색 플라밍고 조명 포스터"
            />
            <img className={styles.creamLogo} src={ilkwLogo} alt="ILKW" />
            <span>— 1962</span>
          </article>
        </div>
      </section>

      <section className={styles.collaboration}>
        <h2 className={styles.collaborationTitle}>Kitty Bunny Pony</h2>
        <p className={styles.collaborationDescription}>
          플라밍고26에 키티버니포니 특유의 감각적인 패턴을 더한 협업 에디션입니다.
          <br />
          부드러운 빛과 생동감 있는 그래픽이 어우러져,
          <br />
          조명을 공간의 분위기를 완성하는 특별한 오브젝트로 만들어줍니다.
        </p>
        <div className={styles.collaborationGrid}>
          <img src={kbpLeft} alt="검정 패턴 플라밍고 조명" />
          <img src={kbpRight} alt="크림 패턴 플라밍고 조명" />
        </div>
        <img
          className={styles.collaborationWide}
          src={kbpWide}
          alt="튤립과 함께 놓인 플라밍고 조명"
          loading="lazy"
        />
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
        onWheel={moveWithWheel}
      >
        <div className={styles.otherTrack}>
          <div className={styles.otherIntro}>
            <h2>
              Other
              <br />
              Products
            </h2>
            <p>
              Find the right light
              <br />
              for your space
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
