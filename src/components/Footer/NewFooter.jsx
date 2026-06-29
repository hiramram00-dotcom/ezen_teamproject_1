import { useNavigate, useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const getSectionScrollY = (sectionId) => {
    const el = document.getElementById(sectionId)
    if (!el) return null
    // ScrollTrigger에 등록된 trigger 중 해당 섹션을 가진 것의 start값이 정확한 스크롤 위치
    const st = ScrollTrigger.getAll().find(t => t.trigger === el)
    if (st) return st.start
    // fallback: 일반 요소
    return el.getBoundingClientRect().top + window.scrollY
  }

  const hideSpaceOverlays = () => {
    const heroEl = document.querySelector('[class*="heroImage"]')
    const dimEl = document.querySelector('[class*="heroDim"]')
    if (heroEl) heroEl.style.opacity = '0'
    if (dimEl) dimEl.style.opacity = '0'
  }

  const scrollToSection = (e, sectionId, offset = 0, hideOverlays = false) => {
    e.preventDefault()
    if (pathname === '/') {
      const y = getSectionScrollY(sectionId)
      if (y !== null) {
        window.scrollTo(0, y - offset)
        requestAnimationFrame(() => {
          ScrollTrigger.refresh()
          // refresh 후에 강제 hide — GSAP가 복원하는 것 방지
          if (hideOverlays) hideSpaceOverlays()
        })
      }
    } else {
      navigate('/')
      setTimeout(() => {
        const y = getSectionScrollY(sectionId)
        if (y !== null) {
          window.scrollTo(0, y - offset)
          requestAnimationFrame(() => {
            ScrollTrigger.refresh()
            if (hideOverlays) hideSpaceOverlays()
          })
        }
      }, 300)
    }
  }

  const handleBrandClick = (e) => scrollToSection(e, 'brand', 450)

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
            처음 빛을 밝혔던 그 온도 그대로,
            <br />
            60년의 시간을 넘어 지금 이 순간에도 일광전구는 빛의 원형을 이어갑니다.
          </p>
          <div className={styles.socials}>
            {SOCIALS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="pointer"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <nav className={styles.nav} aria-label="푸터 내비게이션">
          <span className={styles.navLabel}>Explore</span>
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={styles.navLink}
              data-cursor="pointer"
              onClick={
                label === 'Brand' ? handleBrandClick :
                label === 'Light Philosophy' ? (e) => scrollToSection(e, 'light-philosophy', 0) :
                label === 'Products' ? (e) => scrollToSection(e, 'products', -500, true) :
                label === 'Space Curation' ? (e) => {
                  const el = document.getElementById('showroom')
                  // Room0 조명 켜지기 시작하는 구간 = progress 0.30
                  const dynamicOffset = el
                    ? -((el.offsetHeight - window.innerHeight) * 0.30)
                    : 0
                  scrollToSection(e, 'showroom', dynamicOffset, true)
                } :
                label === 'Collaborations' ? (e) => {
                  const el = document.getElementById('collabo')
                  // 갤러리 이미지가 완전히 보이는 구간 = scroll거리의 48%
                  const dynamicOffset = el
                    ? -((el.offsetHeight - window.innerHeight) * 0.48)
                    : 0
                  scrollToSection(e, 'collabo', dynamicOffset, true)
                } :
                undefined
              }
            >
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
          <a href="#privacy" className={styles.legalLink} data-cursor="pointer">
            Privacy Policy
          </a>
          ·
          <a href="#terms" className={styles.legalLink} data-cursor="pointer">
            Terms of Use
          </a>
        </p>
      </div>
    </footer>
  )
}
