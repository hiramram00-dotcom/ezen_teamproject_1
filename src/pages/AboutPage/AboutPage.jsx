import AboutSection from '../../sections/AboutSection/AboutSection'
import HistorySection from '../../sections/HistorySection/HistorySection'
import PhilosophySection from '../../sections/PhilosophySection/PhilosophySection'
import PurposeSection from '../../sections/PurposeSection/PurposeSection'
import styles from './AboutPage.module.css'

function AboutPage() {
  return (
    <main className={styles.aboutPage}>
      <AboutSection />
      <HistorySection />
      <PhilosophySection />
      <PurposeSection />
    </main>
  )
}

export default AboutPage
