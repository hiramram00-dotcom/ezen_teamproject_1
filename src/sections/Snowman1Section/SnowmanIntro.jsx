import logoIlkw from './assets/logo-ilkw.svg'
import styles from './SnowmanIntro.module.css'

/**
 * SnowmanIntro (Snowman1Section 내부 화면)
 * 풀스크린 블랙 위에 "Meet / SNOWMAN" 타이틀이 중앙 정렬된다.
 * Figma: 1차프로젝트-3조 / node 468:657 ("18")
 */
function SnowmanIntro() {
  return (
    <section className={styles.snowman}>
      <header className={styles.header}>
        <a className={styles.logo} href="/" aria-label="일광전구 ILKW 홈">
          <img src={logoIlkw} alt="ILKW" />
        </a>
        <button type="button" className={`${styles.menu} type-menu`}>
          → Menu
        </button>
      </header>

      <div className={styles.title}>
        <p className="type-italic-2">Meet</p>
        <p className="type-title-semibold">SNOWMAN</p>
      </div>
    </section>
  )
}

export default SnowmanIntro
