import heroImage from './assets/hero.webp'
import introImage from './assets/intro.webp'
import storyImage from './assets/story-b.webp'
import mosaicLamp from './assets/mosaic-lamp.webp'
import mosaicGlow from './assets/mosaic-glow.webp'
import mosaicPendant from './assets/mosaic-pendant.webp'
import galleryLeft from './assets/gallery-left-bottom.webp'
import galleryRight from './assets/gallery-right.webp'
import otherSnowman from '../FlamingoDetailSection/assets/other-snowman.webp'
import otherSnowball from '../FlamingoDetailSection/assets/other-snowball.webp'
import otherMario from '../FlamingoDetailSection/assets/other-mario.webp'
import otherFlamingo from '../FlamingoDetailSection/assets/other-flamingo.webp'
import otherApollo from '../FlamingoDetailSection/assets/other-apollo.webp'
import styles from './SnowballDetailSection.module.css'

const otherProducts = [
  { name: <>SNOWMAN22<br />V2</>, image: otherSnowman, className: 'snowmanCard' },
  { name: <>V2<br />SNOWBALL22</>, image: otherSnowball, className: 'snowballCard' },
  { name: 'MARIO 14 Table', image: otherMario, className: 'marioCard' },
  { name: <>FLA<br />MINGO<br />26</>, image: otherFlamingo, className: 'flamingoCard' },
  { name: 'APOLLO 22', image: otherApollo, className: 'apolloCard' },
]

export function ProductOtherSection() {
  return (
    <section className={styles.otherProducts} aria-label="다른 제품">
      <div className={styles.otherTrack}>
        <div className={styles.otherIntro}>
          <h2>
            <span>Other</span>
            <em>Products</em>
            <span className={styles.arrow} aria-hidden="true">↘</span>
          </h2>
          <p>부드러운 빛으로 일상에 편안함을 더하는<br />조명을 찾고 있다면</p>
        </div>

        {otherProducts.map((product) => (
          <article className={`${styles.otherCard} ${styles[product.className]}`} key={product.className}>
            <img src={product.image} alt="" draggable="false" />
            <h3>{product.name}</h3>
          </article>
        ))}
      </div>
    </section>
  )
}

function SnowballDetailSection() {
  return (
    <main className={styles.detail}>
      <section className={`${styles.panel} ${styles.hero}`} aria-label="SNOWBALL 제품 소개">
        <div className={styles.heroVisual}>
          <img src={heroImage} alt="소파 위에 놓인 SNOWBALL 조명" />
        </div>
        <h1>SNOWBALL</h1>
      </section>

      <section className={`${styles.panel} ${styles.intro}`}>
        <div className={styles.introVisual}>
          <img src={introImage} alt="창가에 놓인 SNOWBALL 테이블 조명" />
        </div>
        <div className={styles.introCopy}>
          <h2>A quiet<br /><em>form of light.</em></h2>
          <p>
            빛이 공간과 사람 사이에 만들어내는 감각에 주목했습니다. 시선을 끄는 조형성과 편안한 조명 경험으로 공간의 인상을 섬세하게 변화시키고, 머무는 시간에 여유와 깊이를 더합니다. 조명을 단순한 기능이 아닌 취향을 표현하며 일상에 오래 머무는 존재로 제안합니다.
          </p>
        </div>
      </section>

      <section className={`${styles.panel} ${styles.story}`}>
        <div className={styles.storyCopy}>
          <h2>Elegance in Every Curve.</h2>
          <p>
            플라밍고 시리즈는 유연하게 이어지는 곡선과 절제된 형태로 공간에 우아한 균형을 더합니다. 낮에는 하나의 오브제로 존재하고, 밤에는 따뜻한 빛으로 일상의 풍경을 부드럽게 밝힙니다. 빛을 켜는 순간의 온도와 결에는, 오랜 시간 빛을 다루어 온 일광전구의 감각이 조용히 담겨 있습니다.
          </p>
        </div>
        <div className={styles.storyVisual}>
          <img src={storyImage} alt="선반 위를 밝히는 SNOWBALL 천장 조명" />
        </div>
      </section>

      <section className={`${styles.panel} ${styles.mosaic}`} aria-label="SNOWBALL 제품 이미지">
        <div className={styles.mosaicLeft}>
          <img src={heroImage} alt="테이블 위 SNOWBALL 조명과 패키지" />
        </div>
        <div className={styles.mosaicTop}>
          <img src={mosaicLamp} alt="SNOWBALL 테이블 조명" />
        </div>
        <div className={styles.mosaicBottom}>
          <img src={mosaicGlow} alt="빛을 밝힌 SNOWBALL 조명" />
        </div>
        <div className={styles.mosaicPendant}>
          <img src={mosaicPendant} alt="공간에 설치된 SNOWBALL 펜던트 조명" />
        </div>
        <div className={styles.mosaicBlank} aria-hidden="true" />
      </section>

      <section className={`${styles.panel} ${styles.gallery}`}>
        <p className={styles.galleryEyebrow}>공간에 온기를 더하는 빛.</p>
        <h2>SNOWBALL</h2>
        <div className={styles.galleryGrid}>
          <div><img src={galleryLeft} alt="천장에 설치된 SNOWBALL 조명" /></div>
          <div><img src={galleryRight} alt="카펫 위에 놓인 SNOWBALL 조명" /></div>
        </div>
        <span className={styles.productButton}>제품 보러가기</span>
      </section>

      <ProductOtherSection />
    </main>
  )
}

export default SnowballDetailSection
