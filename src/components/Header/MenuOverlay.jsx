import { useState, useEffect } from 'react'
import styles from './MenuOverlay.module.css'
import img1 from '../../assets/header/header-menu-test01.webp'
import img2 from '../../assets/header/header-menu-test02.webp'
import img3 from '../../assets/header/header-menu-test03.webp'
import img4 from '../../assets/header/header-menu-test04.webp'

// ⚠️⚠️ 해당 이미지는 테스트 이미지입니다. 각 페이지에 맞는 이미지로 교체해야 합니다. ⚠️⚠️
// (지금은 임시로: 항목에 포커스하면 이 4장을 0.5초 간격으로 무한 순환)
const TEST_IMAGES = [img1, img2, img3, img4]

const ITEMS = ['ABOUT', 'PRODUCT', 'SHOWROOM', 'COLLABO']

function MenuOverlay({ open }) {
  const [active, setActive] = useState(null) // hover된 항목 index
  const [imgIdx, setImgIdx] = useState(0) // 포커스 중 0.5초마다 도는 테스트 이미지 index

  // 포커스 상태에서 테스트 이미지 4장을 0.5초 간격 무한 순환
  useEffect(() => {
    if (active === null) return
    setImgIdx(0)
    const t = setInterval(() => setImgIdx((n) => (n + 1) % TEST_IMAGES.length), 2000)
    return () => clearInterval(t)
  }, [active])

  return (
    <div className={`${styles.overlay} ${open ? styles.open : ''}`} aria-hidden={!open}>
      <nav className={styles.list} onMouseLeave={() => setActive(null)}>
        {ITEMS.map((label, i) => (
          <div className={styles.row} key={label}>
            <a
              className={`${styles.item} ${active !== null && active !== i ? styles.dim : ''}`}
              href="#"
              onMouseEnter={() => setActive(i)}
            >
              {label}
            </a>
            {/* hover 시 시안비율(세로형) 슬롯이 펼쳐지며 아래 항목 밀어냄 */}
            <div className={`${styles.preview} ${active === i ? styles.previewOn : ''}`}>
              <div className={styles.previewInner}>
                {/* ⚠️ 테스트 이미지 — 각 페이지에 맞는 이미지로 교체해야 합니다. */}
                <img src={TEST_IMAGES[imgIdx]} alt="" />
              </div>
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}

export default MenuOverlay
