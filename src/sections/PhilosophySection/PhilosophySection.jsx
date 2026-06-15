import styles from './PhilosophySection.module.css'

import philosophyRoom from './assets/philosophy-room.webp'
import philosophyLight from './assets/philosophy-light.webp'

function PhilosophySection() {
  return (
    <section className={styles.philosophy} aria-labelledby="philosophy-title">
      <img className={styles.room} src={philosophyRoom} alt="" />

      <div className={styles.panel}>
        <img className={styles.light} src={philosophyLight} alt="빛을 밝히는 펜던트 조명" />
        <h2 id="philosophy-title" className={styles.title}>
          <span>Our</span>
          <span>Philosophy</span>
        </h2>
        <p className={styles.message}>우리는 빛으로 세상에 공헌한다</p>
      </div>
    </section>
  )
}

export default PhilosophySection
