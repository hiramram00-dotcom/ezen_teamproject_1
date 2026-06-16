import { useEffect, useRef } from 'react'
import imgKakao from './assets/collabo-kakao.webp'
import imgKittybunnypony from './assets/collabo-kittybunnypony.webp'
import imgHankyoreh from './assets/collabo-hankyoreh.webp'
import imgChilsung from './assets/collabo-chilsung.webp'
import imgWarmgreytale from './assets/collabo-warmgreytale.webp'
import imgKanu from './assets/collabo-kanu.webp'
import styles from './CollaboSection.module.css'

/**
 * CollaboSection
 * 센터의 "COLLABO with ILKW." 타이틀이 스크롤하면 위로 올라가고,
 * 콜라보 카드 리스트가 가로로 끊김 없이 무한 마퀴(자동)로 흐른다.
 * - 마우스 드래그로 좌우 이동 가능.
 * - 각 카드는 제자리에서 위아래로 은은히 떠다닌다(CSS).
 * - 카드 호버 시 마퀴 정지 + 사진 어두워짐 + '자세히 보기' 버튼.
 * Figma: 1차프로젝트-3조 / node 468:809(인트로) → 468:825(리스트)
 */

// Figma 좌→우 배치 순서. imgH = 카드 이미지 높이(px), offset = 세로 stagger(px)
const CARDS = [
  {
    img: imgKakao,
    brand: 'KAKAO FRIENDS',
    desc: ['춘식이의 친근한 감성과 함께', '특별한 컬렉션을 선보였습니다.'],
    imgH: 218,
    offset: 0,
  },
  {
    img: imgKittybunnypony,
    brand: 'KITTY BUNNY PONY',
    desc: ['키티버니포니의 감각적인 패턴과 함께', '오래 머물고 싶은 공간을 함께 만들어갔습니다.'],
    imgH: 297,
    offset: 131,
  },
  {
    img: imgHankyoreh,
    brand: '한겨레',
    desc: ['빛은 공간을 밝히는 것을 넘어,', '연대의 상징이자 시대의 기록이 되었습니다.'],
    imgH: 261,
    offset: 0,
  },
  {
    img: imgChilsung,
    brand: '칠성사이다',
    desc: ['칠성사이다의 청량한 브랜드 감성과 함께', '그린 크리스마스를 선보였습니다.'],
    imgH: 251,
    offset: 170,
  },
  {
    img: imgWarmgreytale,
    brand: '웜그레이테일',
    desc: ['웜그레이테일만의 따뜻한 일러스트에', '일광전구의 빛을 더했습니다.'],
    imgH: 322,
    offset: 0,
  },
  {
    img: imgKanu,
    brand: 'KANU',
    desc: ['커피 한 잔의 여유와 함께하는 빛.', '일상의 여유를 더욱 따뜻하게 만들었습니다.'],
    imgH: 241,
    offset: 170,
  },
]

// 카드별 둥둥 시간차 (base index 기준 → 두 복사본이 동일하게 떠야 마퀴 이음새 유지)
const FLOAT_DUR = ['6.5s', '7.2s', '6.8s', '7.6s', '6.2s', '7.0s']
const FLOAT_DELAY = ['0s', '-1.8s', '-0.9s', '-3.1s', '-1.3s', '-2.4s']

const BASE_SPEED = 70 // px/s 자동 흐름(스크롤 가속 없음)

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp01 = (v) => Math.min(1, Math.max(0, v))

function CollaboSection() {
  const wrapRef = useRef(null)
  const titleRef = useRef(null)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const title = titleRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!wrap || !title || !track || !viewport) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      title.style.transform = 'none'
      track.style.opacity = '1'
      return
    }

    let copyW = track.scrollWidth / 2 // 카드 세트 한 벌 폭(트랙엔 2벌)
    const measure = () => {
      copyW = track.scrollWidth / 2
    }
    const posMod = (v) => (copyW > 0 ? ((v % copyW) + copyW) % copyW : 0)

    let pos = 0
    let hovering = false
    let dragging = false
    let dragStartX = 0
    let dragStartPos = 0
    let last = performance.now()
    let raf = 0
    let isVisible = false

    // ----- 호버(카드 위에서만 정지) / 드래그 -----
    const overCard = (el) => !!(el && el.closest && el.closest('[data-card]'))
    const onOver = (e) => {
      if (overCard(e.target)) hovering = true
    }
    const onOut = (e) => {
      // 카드 밖(빈 영역/바깥)으로 나가면 다시 흐름
      if (!overCard(e.relatedTarget)) hovering = false
    }
    const onLeave = () => {
      hovering = false
    }
    const onDown = (e) => {
      dragging = true
      dragStartX = e.clientX
      dragStartPos = pos
      if (viewport.setPointerCapture) viewport.setPointerCapture(e.pointerId)
    }
    const onMove = (e) => {
      if (!dragging) return
      pos = posMod(dragStartPos - (e.clientX - dragStartX))
    }
    const onUp = () => {
      dragging = false
    }

    viewport.addEventListener('pointerover', onOver)
    viewport.addEventListener('pointerout', onOut)
    viewport.addEventListener('pointerleave', onLeave)
    viewport.addEventListener('pointerdown', onDown)
    viewport.addEventListener('pointermove', onMove)
    viewport.addEventListener('pointerup', onUp)
    viewport.addEventListener('pointercancel', onUp)

    const frame = (now) => {
      raf = 0
      if (!isVisible) return

      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      // 타이틀 상승 + 카드 페이드인 (스크롤 진행도)
      const rect = wrap.getBoundingClientRect()
      const vh = window.innerHeight
      const total = wrap.offsetHeight - vh
      const scrolled = Math.min(total, Math.max(0, -rect.top))
      const aP = ease(clamp01(scrolled / (total * 0.4)))
      const rise = Math.max(0, vh / 2 - (title.offsetTop + title.offsetHeight / 2))
      title.style.transform = `translateY(${(1 - aP) * rise}px)`
      track.style.opacity = String(aP)

      // 마퀴 (호버/드래그 중엔 자동 정지)
      const inView = rect.bottom > 0 && rect.top < vh
      if (inView && !hovering && !dragging) {
        pos = posMod(pos + BASE_SPEED * dt)
      }
      if (copyW > 0) track.style.transform = `translateX(${-pos}px)`

      raf = requestAnimationFrame(frame)
    }

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting

        if (isVisible && !raf) {
          last = performance.now()
          raf = requestAnimationFrame(frame)
        } else if (!isVisible && raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { threshold: 0 },
    )

    visibilityObserver.observe(wrap)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      visibilityObserver.disconnect()
      window.removeEventListener('resize', measure)
      viewport.removeEventListener('pointerover', onOver)
      viewport.removeEventListener('pointerout', onOut)
      viewport.removeEventListener('pointerleave', onLeave)
      viewport.removeEventListener('pointerdown', onDown)
      viewport.removeEventListener('pointermove', onMove)
      viewport.removeEventListener('pointerup', onUp)
      viewport.removeEventListener('pointercancel', onUp)
    }
  }, [])

  // 무한 마퀴용으로 카드 세트를 2벌 렌더
  const loopCards = [...CARDS, ...CARDS]

  return (
    <section ref={wrapRef} className={styles.collabo}>
      <div className={styles.sticky}>
        <div ref={titleRef} className={styles.intro}>
          <h2 className={styles.title}>
            <span className="type-title-1">COLLABO</span>{' '}
            <span className="type-italic-1">with</span>{' '}
            <span className="type-title-1">ILKW.</span>
          </h2>
          <p className={`${styles.desc} type-body-3`}>
            다양한 브랜드와 함께 새로운 빛의 경험을 만들어갑니다.
          </p>
        </div>

        <div ref={viewportRef} className={styles.galleryViewport}>
          <ul ref={trackRef} className={styles.galleryTrack}>
            {loopCards.map((card, i) => {
              const base = i % CARDS.length
              const isClone = i >= CARDS.length
              return (
                <li
                  key={`${card.brand}-${i}`}
                  className={styles.card}
                  data-card
                  aria-hidden={isClone ? 'true' : undefined}
                  style={{
                    marginTop: `${card.offset}px`,
                    animationDuration: FLOAT_DUR[base],
                    animationDelay: FLOAT_DELAY[base],
                  }}
                >
                  <div className={styles.cardImage} style={{ height: `${card.imgH}px` }}>
                    <img src={card.img} alt={`ILKW x ${card.brand}`} loading="lazy" draggable="false" />
                    <div className={styles.cardOverlay}>
                      <span className={styles.cardArrow} aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="8 7 17 7 17 16" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div className={styles.cardText}>
                    <p className={`${styles.cardTitle} type-body-semibold-2`}>
                      ILKW <span className={styles.cardX}>x</span> {card.brand}
                    </p>
                    <p className={`${styles.cardDesc} type-body-4`}>
                      {card.desc[0]}
                      <br />
                      {card.desc[1]}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default CollaboSection
