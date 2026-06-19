import { useEffect, useRef } from 'react'
import styles from './CollaboGallerySection.module.css'
import ilkwLogo from '../../assets/common/logo/ilkw-black.svg'
import imgKakao from '../CollaboSection/assets/collabo-kakao.webp'
import imgKbp from '../CollaboSection/assets/collabo-kittybunnypony.webp'
import imgWarmgrey from '../CollaboSection/assets/collabo-warmgreytale.webp'
import imgHankyoreh from '../CollaboSection/assets/collabo-hankyoreh.webp'
import imgChilsung from '../CollaboSection/assets/collabo-chilsung.webp'
import imgKanu from '../CollaboSection/assets/collabo-kanu.webp'

/**
 * CollaboGallerySection — 콜라보 컬렉션 목록 (룰렛 다음 화면)
 * Figma: 1차프로젝트-3조 / node 1565:270 (1920×…)
 * "COLLABO with ILKW." 헤더 + 6개 콜라보가 좌우 지그재그로 배치된 긴 스크롤 리스트.
 * 각 행: 사진 + "ILKW × {브랜드}" + 2줄 설명(#555). 스크롤 진입 시 페이드업.
 */

// Figma 위→아래 순서. 사진 비율(ar)·폭 비중(w, 리스트폭 1575 기준 %)은 디자인값.
const COLLABOS = [
  { brand: 'KAKAO FRIENDS', img: imgKakao, ar: '648 / 553', w: '41.14%',
    desc: ['춘식이의 친근한 감성과 함께', '특별한 컬렉션을 선보였습니다.'] },
  { brand: 'KITTY BUNNY PONY', img: imgKbp, ar: '842 / 640', w: '53.46%',
    desc: ['키티버니포니의 감각적인 패턴과 함께', '오래 머물고 싶은 공간을 함께 만들어갔습니다.'] },
  { brand: '웜그레이테일', img: imgWarmgrey, ar: '550 / 640', w: '34.92%',
    desc: ['웜그레이테일만의 따뜻한 일러스트에', '일광전구의 빛을 더했습니다.'] },
  { brand: '한겨레', img: imgHankyoreh, ar: '842 / 640', w: '53.46%',
    desc: ['빛은 공간을 밝히는 것을 넘어,', '연대의 상징이자 시대의 기록이 되었습니다.'] },
  { brand: '칠성사이다', img: imgChilsung, ar: '506 / 640', w: '32.13%',
    desc: ['칠성사이다의 청량한 브랜드 감성과 함께', '그린 크리스마스를 선보였습니다.'] },
  { brand: 'KANU', img: imgKanu, ar: '512 / 640', w: '32.51%',
    desc: ['커피 한 잔의 여유와 함께하는 빛.', '일상의 여유를 더욱 따뜻하게 만들었습니다.'] },
]

function CollaboGallerySection() {
  const sectionRef = useRef(null)

  // 스크롤 진입 시 행이 아래에서 페이드업
  useEffect(() => {
    const root = sectionRef.current
    if (!root) return
    const rows = root.querySelectorAll('[data-reveal]')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      rows.forEach((el) => el.classList.add(styles.inView))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.inView)
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.2 },
    )
    rows.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className={styles.gallery} ref={sectionRef} aria-label="ILKW 콜라보 컬렉션">
      <header className={styles.head} data-reveal>
        <p className={styles.title}>
          <span className={styles.titleCollabo}>COLLABO</span>
          <span className={styles.titleWith}>with</span>
          <img className={styles.titleIlkw} src={ilkwLogo} alt="ILKW" />
        </p>
        <p className={styles.subtitle}>일광전구와 함께한 협업 컬렉션을 소개합니다.</p>
      </header>

      <div className={styles.list}>
        {COLLABOS.map((c, i) => (
          <article
            key={c.brand}
            className={`${styles.row} ${i % 2 === 1 ? styles.right : ''}`}
            data-reveal
          >
            <div className={styles.imageBox} style={{ '--img-w': c.w, '--img-ar': c.ar }}>
              <img src={c.img} alt={`ILKW × ${c.brand}`} loading="lazy" />
            </div>
            <div className={styles.text}>
              <p className={styles.brandLine}>
                <span className={styles.brandStrong}>ILKW</span>
                <span className={styles.brandX} aria-hidden="true">x</span>
                <span className={styles.brandStrong}>{c.brand}</span>
              </p>
              <p className={styles.desc}>
                {c.desc[0]}
                <br />
                {c.desc[1]}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CollaboGallerySection
