import heroImage from './assets/hero.webp'
import introImage from './assets/intro.webp'
import storyImage from './assets/story.webp'
import mosaicLeft from './assets/mosaic-left.webp'
import mosaicRight from './assets/mosaic-right.webp'
import galleryLeft from './assets/gallery-left.webp'
import galleryRight from './assets/gallery-right.webp'
import { ProductOtherSection } from '../SnowballDetailSection/SnowballDetailSection'
import styles from './TeacupDetailSection.module.css'

function TeacupDetailSection() {
  return (
    <main className={styles.detail}>
      <section className={`${styles.panel} ${styles.hero}`} aria-label="TEACUP 제품 소개">
        <img className={styles.heroImage} src={heroImage} alt="햇빛이 드는 공간에 놓인 TEACUP 조명" />
        <h1>TEACUP</h1>
      </section>

      <section className={`${styles.panel} ${styles.intro}`}>
        <div className={styles.introVisual}>
          <img src={introImage} alt="고양이와 함께 놓인 TEACUP 조명" />
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
          <img src={storyImage} alt="레드 TEACUP 조명이 놓인 테이블" />
        </div>
      </section>

      <section className={`${styles.panel} ${styles.mosaic}`} aria-label="TEACUP 제품 이미지">
        <figure className={styles.mosaicLeft}>
          <img src={mosaicLeft} alt="책상 위 TEACUP 조명" />
          <figcaption>Elegance in Every Curve.</figcaption>
        </figure>
        <figure className={styles.mosaicRight}>
          <figcaption>Elegance in Every Curve.</figcaption>
          <img src={mosaicRight} alt="꽃과 함께 놓인 TEACUP 조명" />
        </figure>
      </section>

      <section className={`${styles.panel} ${styles.gallery}`}>
        <p className={styles.galleryEyebrow}>공간에 온기를 더하는 빛.</p>
        <h2>TEACUP</h2>
        <div className={styles.galleryGrid}>
          <div><img src={galleryLeft} alt="선반 위 레드 TEACUP 조명" /></div>
          <div><img src={galleryRight} alt="계단 위 화이트 TEACUP 조명" /></div>
        </div>
        <span className={styles.productButton}>제품 보러가기</span>
      </section>

      <ProductOtherSection />
    </main>
  )
}

export default TeacupDetailSection
