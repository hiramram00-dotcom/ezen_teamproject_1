import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import whiteLogo from '../Snowman1Section/assets/logo-ilkw.svg'
import blackLogo from '../Snowman1Section/assets/logo-ilkw-black.svg'
import heroBackground from './assets/hero-background.webp'
import introLamp from './assets/intro-lamp.webp'
import floorLamp from './assets/floor-lamp.webp'
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

function PanelHeader({ variant = 'dark' }) {
  return (
    <div
      className={`${styles.header} ${
        variant === 'light' ? styles.headerLight : styles.headerDark
      }`}
    >
      <img
        className={styles.headerLogo}
        src={variant === 'light' ? whiteLogo : blackLogo}
        alt="ILKW"
      />
      <Link className={styles.headerMenu} to="/product">
        → Menu
      </Link>
    </div>
  )
}

function FlamingoDetailSection() {
  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef({ x: 0, left: 0 })

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
        <img
          className={styles.heroBackground}
          src={heroBackground}
          alt="창가에서 플라밍고 조명을 옮기는 장면"
          fetchPriority="high"
        />
        <h1 className={styles.heroTitle}>FLAMINGO</h1>
        <PanelHeader variant="light" />
      </section>

      <section className={`${styles.panel} ${styles.intro}`}>
        <figure className={styles.introVisual}>
          <img src={introLamp} alt="책 위에 놓인 플라밍고 조명" />
        </figure>
        <h2 className={styles.introTitle}>
          <span>A quiet</span>
          <em>form of light.</em>
        </h2>
        <p className={styles.introDescription}>
          빛이 공간과 사람 사이에 만들어내는 감각에 주목했습니다. 시선을
          끄는 조형성과 편안한 조명 경험으로 공간의 인상을 섬세하게
          변화시키고, 머무는 시간에 여유와 깊이를 더합니다. 조명을 단순한
          기능이 아닌 취향을 표현하며 일상에 오래 머무는 존재로 제안합니다.
        </p>
        <PanelHeader />
      </section>

      <section className={`${styles.panel} ${styles.story}`}>
        <figure className={styles.storyVisual}>
          <img src={floorLamp} alt="꽃과 함께 놓인 플라밍고 플로어 조명" />
        </figure>
        <div className={styles.storyCopy}>
          <h2>Elegance in Every Curve.</h2>
          <p>
            플라밍고 시리즈는 유연하게 이어지는 곡선과 절제된 형태로 공간에
            우아한 균형을 더합니다. 낮에는 하나의 오브제로 존재하고, 밤에는
            따뜻한 빛으로 일상의 풍경을 부드럽게 밝힙니다.
          </p>
        </div>
        <PanelHeader />
      </section>

      <section className={`${styles.panel} ${styles.posters}`}>
        <PanelHeader />
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
            <img src={posterCream} alt="크림색 플라밍고 조명 포스터" />
            <span>— 1962</span>
          </article>
        </div>
      </section>

      <section className={styles.collaboration}>
        <PanelHeader />
        <h2 className={styles.collaborationTitle}>Kitty Bunny Pony</h2>
        <p className={styles.collaborationDescription}>
          플라밍고26에 키티버니포니 특유의 감각적인 패턴을 더한 협업
          에디션입니다.
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
