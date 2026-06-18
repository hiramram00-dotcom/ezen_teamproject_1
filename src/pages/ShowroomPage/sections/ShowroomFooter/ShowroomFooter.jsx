import logoIlkw from '../../../../components/Footer/assets/ilkw-logo.svg'
import styles from './ShowroomFooter.module.css'

/**
 * ShowroomFooter — showroom 전용 푸터 (사진 없는 버전)
 * 크림 배경 + 거대 ILKW 워드마크(skew) + 내비 + 약관.
 * Figma: 1차프로젝트-3조 / node 1174:17 (footer_bottom_B)
 */
const NAV = [
  { label: '브랜드', href: '#brand' },
  { label: '빛의 철학', href: '#philosophy' },
  { label: '제품', href: '#products' },
  { label: '공간 큐레이션', href: '#space' },
  { label: '콜라보', href: '#collabo' },
]

function ShowroomFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        <img src={logoIlkw} alt="ILKW." />
      </div>

      <div className={styles.bottom}>
        <nav className={styles.nav} aria-label="푸터 내비게이션">
          {NAV.map((item) => (
            <a key={item.label} href={item.href} className={`${styles.navLink} type-body-3`}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.divider} />

        <div className={styles.legal}>
          <p className={styles.legalText}>
            © 2026 일광전구 주식회사 &nbsp;·&nbsp; 서울 성동구 성수동 &nbsp;·&nbsp; 사업자
            000-00-00000 &nbsp;·&nbsp; 통신판매업 신고번호 000-000-0000
          </p>
          <p className={styles.legalText}>
            <a href="#privacy" className={styles.legalLink}>
              Privacy Policy
            </a>
            &nbsp;·&nbsp;
            <a href="#terms" className={styles.legalLink}>
              Terms of Use
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default ShowroomFooter
