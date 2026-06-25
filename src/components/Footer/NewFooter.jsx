import logoIlkw from './assets/ilkw-logo.svg'
import styles from './NewFooter.module.css'

const MARQUEE_TEXT =
  'Interested in distributing or reselling ILKW products? ............ For dealership inquiries, please include information on your brand and the online/offline platforms where sales are planned. — For bulk purchase inquiries, kindly send us your business registration, product names, quantity, and options. ··· Contact us at sales@ilkwdesign.com, and we will get back to you shortly. — Also suggesting various projects, developments, designs are welcomed.............'

const NAV_LINKS = [
  { label: 'Brand', href: '#' },
  { label: 'Light Philosophy', href: '#intro' },
  { label: 'Products', href: '#products' },
  { label: 'Space Curation', href: '#showroom' },
  { label: 'Collaborations', href: '#collabo' },
]

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/ilkwdesign' },
  { label: 'YouTube', href: 'https://www.youtube.com/@ilkwanglighting' },
  { label: 'Naver Brand Store', href: 'https://brand.naver.com/iklamp' },
]

export default function NewFooter() {
  return (
    <footer className={styles.footer}>
      {/* 상단: ILKW 로고 + 마퀴 */}
      <div className={styles.topBand}>
        <div className={styles.logoWrap}>
          <img src={logoIlkw} alt="ILKW" className={styles.logo} />
        </div>
        <div className={styles.marqueeWrap} aria-hidden="true">
          <div className={styles.marqueeTrack}>
            <span className={styles.marqueeText}>{MARQUEE_TEXT}</span>
            <span className={styles.marqueeText}>{MARQUEE_TEXT}</span>
          </div>
        </div>
      </div>

      {/* 중단: 태그라인 | Explore 내비 | 연락처 */}
      <div className={styles.main}>
        <div className={styles.left}>
          <p className={styles.tagline}>
            처음 빛을 밝혔던 그 온도 그대로, 60년의 시간을 넘어 지금 이 순간에도
            일광전구는 빛의 원형을 이어갑니다.
          </p>
          <div className={styles.socials}>
            {SOCIALS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <nav className={styles.nav} aria-label="푸터 내비게이션">
          <span className={styles.navLabel}>Explore</span>
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className={styles.navLink}>
              {label}
            </a>
          ))}
        </nav>

        <address className={styles.contact}>
          <p>
            HQ &amp; Factory
            <br />
            Daegu, South Korea
          </p>
          <p>
            Seoul Office
            <br />
            Jung-gu, Seoul
          </p>
          <p>
            Showroom
            <br />
            Jung-gu, Seoul
          </p>
          <p>
            T. +82 53 581 1076
            <br />
            E. info@ilkwdesign.com
          </p>
        </address>
      </div>

      {/* 하단: 구분선 + 저작권 */}
      <div className={styles.divider} role="separator" />
      <div className={styles.legal}>
        <p className={styles.copyright}>
          © Copyright Ilkwanglighting 2026 All Right Reserved
        </p>
        <p className={styles.legalLinks}>
          <a href="#privacy" className={styles.legalLink}>
            Privacy Policy
          </a>
          ·
          <a href="#terms" className={styles.legalLink}>
            Terms of Use
          </a>
        </p>
      </div>
    </footer>
  )
}
