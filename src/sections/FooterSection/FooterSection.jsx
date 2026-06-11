import Footer from '../../components/Footer/Footer'
import footerHome from './assets/footer-home.webp'
import styles from './FooterSection.module.css'

/**
 * FooterSection (홈 전용)
 * 홈 페이지 마지막 블록 = 풀블리드 비주얼 사진 + 공용 <Footer/>.
 * 서브페이지에서는 이 섹션 대신 <Footer/> 만 직접 사용한다.
 * Figma: 1차프로젝트-3조 / node 703:5
 */
function FooterSection() {
  return (
    <section className={styles.footerSection}>
      <div className={styles.photo}>
        <img src={footerHome} alt="" loading="lazy" />
      </div>
      <Footer />
    </section>
  )
}

export default FooterSection
