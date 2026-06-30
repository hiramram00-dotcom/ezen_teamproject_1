import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './MenuOverlay.module.css'
import menu1 from '../../assets/header/menu-1.webp'
import menu2 from '../../assets/header/menu-2.webp'
import menu3 from '../../assets/header/menu-3.webp'
import menu4 from '../../assets/header/menu-4.webp'

// 각 메뉴 항목 → 해당 페이지 대표 이미지 (hover 시 프리뷰로 펼쳐짐)
const ITEMS = [
  { label: 'ABOUT', to: '/about', img: menu1, soft: true }, // menu-1: 대비 살짝 낮춰 부드럽게
  { label: 'PRODUCT', to: '/product', img: menu2 },
  { label: 'SHOWROOM', to: '/showroom', img: menu3 },
  { label: 'COLLABO', to: '/collabo', img: menu4 },
]

function MenuOverlay({ open, onNavigate }) {
  const [active, setActive] = useState(null) // hover된 항목 index

  const canShowPreview = () =>
    window.matchMedia('(min-width: 1200px) and (hover: hover) and (pointer: fine)').matches

  return (
    <div className={`${styles.overlay} ${open ? styles.open : ''}`} aria-hidden={!open}>
      <nav className={styles.list} onMouseLeave={() => setActive(null)}>
        {ITEMS.map(({ label, to, img, soft }, i) => (
          <div className={styles.row} key={label}>
            <Link
              className={`${styles.item} ${active !== null && active !== i ? styles.dim : ''}`}
              to={to}
              onClick={onNavigate}
              onMouseEnter={() => {
                if (canShowPreview()) setActive(i)
              }}
              data-cursor="pointer"
            >
              {label}
            </Link>
            {/* hover 시 프리뷰 펼쳐짐 — 이미지 클릭해도 해당 페이지로 이동 (버튼 안 쫓아가도 됨) */}
            <Link
              to={to}
              onClick={onNavigate}
              className={`${styles.preview} ${active === i ? styles.previewOn : ''}`}
              tabIndex={active === i ? 0 : -1}
              aria-hidden={active !== i}
              data-cursor="pointer"
            >
              <div className={styles.previewInner}>
                <img className={soft ? styles.softImg : undefined} src={img} alt={`${label} 미리보기`} />
              </div>
            </Link>
          </div>
        ))}
      </nav>
    </div>
  )
}

export default MenuOverlay
