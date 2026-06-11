import logoI from './assets/logo-ilkw-i.svg'
import logoL from './assets/logo-ilkw-l.svg'
import logoK from './assets/logo-ilkw-k.svg'
import logoW from './assets/logo-ilkw-w.svg'
import logoDot from './assets/logo-ilkw-dot.svg'
import footerHome from './assets/footer-home.webp'
import styles from './Footer.module.css'

/**
 * Footer (글로벌 컴포넌트)
 * 풀블리드 비주얼 사진 + 거대 ILKW. 워드마크(조각별 배치) + 내비 + 약관.
 * 페이지 하단에서 <Footer /> 하나로 사용.
 * Figma: 1차프로젝트-3조 / node 703:5(사진) · 468:873(푸터)
 */

// 로고 조각 — Figma 좌표를 로고 박스 기준 %로 환산 (I·L·K·W는 윗줄, 점은 아래)
const PIECES = [
  { src: logoI, left: 0, top: 0.1, width: 11.184, height: 95.22 },
  { src: logoL, left: 11.915, top: 0.28, width: 19.604, height: 95.22 },
  { src: logoK, left: 32.038, top: 0, width: 26.775, height: 95.22 },
  { src: logoW, left: 59.548, top: 0.13, width: 33.161, height: 95.22 },
  { src: logoDot, left: 92.71, top: 66.32, width: 7.291, height: 33.676 },
]

const NAV = [
  { label: '브랜드', href: '#brand' },
  { label: '빛의 철학', href: '#philosophy' },
  { label: '제품', href: '#products' },
  { label: '공간 큐레이션', href: '#space' },
  { label: '쇼룸', href: '#showroom' },
]

function Footer() {
  return (
    <div className={styles.footer}>
      {/* 풀블리드 비주얼 사진 */}
      <div className={styles.photo}>
        <img src={footerHome} alt="" loading="lazy" />
      </div>

      {/* 크림 푸터 블록 */}
      <footer className={styles.body}>
        {/* 거대 워드마크 — 조각 SVG(#252525 = footer 색)를 그대로 배치 */}
        <div className={styles.logo} role="img" aria-label="ILKW.">
          {PIECES.map((p, i) => (
            <img
              key={i}
              className={styles.piece}
              src={p.src}
              alt=""
              aria-hidden="true"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.width}%`,
                height: `${p.height}%`,
              }}
            />
          ))}
        </div>

        <div className={styles.bottom}>
        <nav className={styles.nav} aria-label="푸터 내비게이션">
          {NAV.map((item) => (
            <a key={item.label} href={item.href} className={`${styles.navLink} type-body-2`}>
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
    </div>
  )
}

export default Footer
