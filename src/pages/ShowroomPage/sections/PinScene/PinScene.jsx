import { useEffect, useRef } from 'react'
import heroImg from './assets/showroom-hero.webp'
import styles from './PinScene.module.css'

/**
 * PinScene — 첫 이미지를 잠시 고정하고 카드가 뒤늦게 올라오는 장면.
 * 이미지는 원본 비율 전체가 보이며, 고정 구간 전체에 걸쳐 1.15 → 1로 축소된다.
 * Figma: 1차프로젝트-3조 / node 778:379·778:380·778:381·778:385
 */
const ease = (t) =>
  t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const CARD_START = 0
const CARD_END = 0.9

function PinScene() {
  const sceneRef = useRef(null)
  const imageRef = useRef(null)
  const scrimRef = useRef(null)
  const cardRef = useRef(null)
  const cardBoxRef = useRef(null)
  const visualBlurRef = useRef(null)
  const visualBlurImgRef = useRef(null)
  const cardGroupRef = useRef(null)

  useEffect(() => {
    const scene = sceneRef.current
    const image = imageRef.current
    const scrim = scrimRef.current
    const card = cardRef.current
    if (!scene || !image || !scrim || !card) return

    const cardGroup = cardGroupRef.current
    const cardBox = cardBoxRef.current
    const visualBlur = visualBlurRef.current
    const visualBlurImg = visualBlurImgRef.current
    const visual = image.parentElement // .visual

    // 카드(라벨 포함)가 배경 이미지보다 크면 비율 그대로 균일 축소하여 이미지 안에 맞춤.
    // 카드는 이미지 정중앙 정렬이므로 center 기준 스케일하면 중심은 그대로 유지된다.
    const fitCard = () => {
      if (!cardGroup) return
      cardGroup.style.transform = '' // 자연 크기로 되돌려 측정
      const labels = cardGroup.firstElementChild // 절대배치된 라벨 묶음
      const labelsBlock = labels
        ? labels.offsetHeight + parseFloat(getComputedStyle(labels).marginBottom || '0')
        : 0
      const cardH = cardGroup.offsetHeight
      const imgH = image.parentElement.offsetHeight // .visual 높이 = 이미지 표시 높이
      // 중심 정렬 기준: 카드 절반 + 라벨 전체가 이미지 절반 안에 들어와야 함 → 분모 (cardH + 2*labels).
      // 32px 여백만 두고, 실제로 넘칠 때만 축소(평소엔 scale 1).
      const denom = cardH + 2 * labelsBlock
      const s = denom > 0 ? Math.min(1, (imgH - 32) / denom) : 1
      cardGroup.style.transform = s < 1 ? `scale(${s})` : ''
    }

    // faux 블러 동기화 — 안쪽 img는 배경 이미지와 같은 줌, wrapper는 카드 위치(rect)로 클립.
    // getBoundingClientRect라 cardLayer 슬라이드·cardGroup 축소 등 중첩 transform이 자동 반영된다.
    const syncBlur = () => {
      if (!visualBlur || !visualBlurImg || !cardBox || !visual) return
      visualBlurImg.style.transform = image.style.transform
      const cr = cardBox.getBoundingClientRect()
      const vr = visual.getBoundingClientRect()
      visualBlur.style.clipPath =
        `inset(${(cr.top - vr.top).toFixed(1)}px ${(vr.right - cr.right).toFixed(1)}px ` +
        `${(vr.bottom - cr.bottom).toFixed(1)}px ${(cr.left - vr.left).toFixed(1)}px round 24px)`
      visualBlur.style.visibility = card.style.visibility
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      image.style.transform = 'scale(1)'
      scrim.style.opacity = '1'
      card.style.transform = 'translateY(0)'
      card.style.visibility = 'visible'
      fitCard()
      syncBlur()
      const onResize = () => {
        fitCard()
        syncBlur()
      }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }

    let ticking = false
    const apply = () => {
      ticking = false
      const rect = scene.getBoundingClientRect()
      const scrollRange = scene.offsetHeight - window.innerHeight
      const sceneProgress = scrollRange > 0
        ? clamp(-rect.top / scrollRange, 0, 1)
        : 1
      const imageEase = ease(sceneProgress)
      const cardProgress = clamp(
        (sceneProgress - CARD_START) / (CARD_END - CARD_START),
        0,
        1,
      )
      const cardEase = ease(cardProgress)

      image.style.transform = `scale(${(1.15 - 0.15 * imageEase).toFixed(4)})`
      scrim.style.opacity = cardEase.toFixed(3)
      card.style.transform = `translateY(${((1 - cardEase) * 100).toFixed(2)}%)`
      card.style.visibility = cardProgress > 0 ? 'visible' : 'hidden'
      syncBlur()
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(apply)
      }
    }

    apply()
    fitCard()
    // 한글 웹폰트가 늦게 로드되면 카드 높이가 달라지므로 로드 후 재계산.
    let cancelled = false
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) fitCard()
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('resize', fitCard)
    return () => {
      cancelled = true
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('resize', fitCard)
    }
  }, [])

  return (
    <section ref={sceneRef} className={styles.scene}>
      <div className={styles.pinStage}>
        <div className={styles.visual}>
          <div ref={imageRef} className={styles.imageInner}>
            <img src={heroImg} alt="일광전구 서울 쇼룸 내부" />
          </div>
          <div ref={scrimRef} className={styles.scrim} aria-hidden="true" />

          {/* faux backdrop-filter: 배경 이미지의 블러 복사본 — 매 프레임 이미지와 같은 줌으로 맞추고
              카드 위치(rect)로 클립 → backdrop-filter 없이 카드 뒤만 흐려짐(배포서버 OK).
              wrapper=클립(transform 영향 X) / 안쪽 img=줌. */}
          <div ref={visualBlurRef} className={styles.visualBlur} aria-hidden="true">
            <img ref={visualBlurImgRef} className={styles.visualBlurImg} src={heroImg} alt="" />
          </div>

          {/* 카드 + 라벨 — 고정 구간 후반에 이미지 위로 올라옴.
              라벨은 cardGroup 안에서 카드 위에 절대배치하여, 카드만 이미지 정중앙에 정렬됨. */}
          <div ref={cardRef} className={styles.cardLayer}>
            <div ref={cardGroupRef} className={styles.cardGroup}>
            <div className={styles.labels}>
              <span className={`${styles.label} type-subtitle-1`}>Our Showroom</span>
              <span className={`${styles.label} ${styles.labelVisit} type-subtitle-1`}>
                <svg
                  className={styles.arrow}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="6 13 12 19 18 13" />
                </svg>
                Plan Your Visit
              </span>
            </div>

            <div ref={cardBoxRef} className={styles.card}>
              <div className={styles.top}>
                <div className={styles.info}>
                  <h2 className={styles.title}>
                    <span className="type-body-semibold-1">일광전구 서울 쇼룸</span>
                    <span className={`${styles.titleEn} type-subtitle-1`}>IK SEOUL SHOWROOM</span>
                  </h2>
                  <p className={`${styles.desc} type-body-4`}>
                    조명과 가구가 함께 놓인 장면을 통해
                    <br />
                    제품의 형태와 크기감, 빛이 만드는 분위기를
                    <br className={styles.mobileBreak} />
                    경험할 수 있습니다.
                  </p>
                </div>

                <div className={styles.map}>
                  <svg
                    className={styles.mapGraphic}
                    viewBox="0 0 555 377"
                    role="img"
                    aria-label="일광전구 서울 쇼룸 약도. 회현역 4번출구, 우리은행, 교육센터 마음의씨앗 인근"
                  >
                    <path className={styles.mapRoad} d="M124 244 L453 0" />
                    <path className={styles.mapRoad} d="M245 216 H555" />
                    <path className={styles.mapRoad} d="M245 324 H555" />
                    <path className={styles.mapRoad} d="M0 356 H205" />
                    <path className={styles.mapRoad} d="M225 191 V377" />
                    <rect className={styles.mapDot} x="238" y="152" width="9" height="9" />
                    <rect className={styles.mapDot} x="163" y="301" width="9" height="9" />
                    <rect className={styles.mapDot} x="430" y="232" width="9" height="9" />
                    <rect className={styles.mapPin} x="270" y="231" width="14" height="14" />
                    <g transform="translate(368 47) rotate(-37.49)">
                      <rect className={styles.mapRoadLabelBg} width="56" height="26" />
                      <text className={styles.mapRoadLabel} x="28" y="18">
                        퇴계로
                      </text>
                    </g>
                    <text className={styles.mapLabel} x="125" y="163">
                      회현역 4번출구
                    </text>
                    <text className={styles.mapLabel} x="446" y="244">
                      우리은행
                    </text>
                    <text className={styles.mapLabel} x="22" y="313">
                      교육센터 마음의씨앗
                    </text>
                    <text className={styles.mapLabelStrong} x="293" y="244">
                      일광전구 쇼룸
                    </text>
                  </svg>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.bottom}>
                <div className={styles.col}>
                  <h3 className={`${styles.colTitle} type-body-semibold-2`}>위치 · 운영시간</h3>
                  <p className={`${styles.colText} type-body-4`}>
                    <span className={styles.desktopOnly}>서울특별시 중구 퇴계로4길 2-1 로컬스티치 B동 1층</span>
                    <span className={styles.mobileOnly}>
                      서울특별시 중구 퇴계로4길 2-1
                      <br />
                      로컬스티치 B동 1층
                    </span>
                  </p>
                  <p className={`${styles.colText} type-body-4`}>
                    <span className={styles.desktopOnly}>MON-SUN 11:00-20:00&nbsp;&nbsp;/&nbsp;&nbsp;BREAK TIME 15:00-16:00</span>
                    <span className={styles.mobileOnly}>
                      MON-SUN 11:00-20:00
                      <br />
                      BREAK TIME 15:00-16:00
                    </span>
                  </p>
                </div>

                <div className={`${styles.col} ${styles.colContact}`}>
                  <h3 className={`${styles.colTitle} type-body-semibold-2`}>문의</h3>
                  <p className={`${styles.colText} type-body-4`}>02-318-1079</p>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PinScene
