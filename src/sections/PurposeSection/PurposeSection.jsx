import { useEffect, useRef } from 'react'
import styles from './PurposeSection.module.css'

import teamImage from './assets/purpose-team.webp'

const CEO_VIDEO_URL =
  'https://player.cloudinary.com/embed/?cloud_name=ddit4bjrw&public_id=about-ceo-video_iuezru'

function PurposeSection() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const ceoCopyRef = useRef(null)
  const descriptionRef = useRef(null)
  const missionRef = useRef(null)
  const missionBodyRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    const ceoCopy = ceoCopyRef.current
    const description = descriptionRef.current
    const mission = missionRef.current
    const missionBody = missionBodyRef.current
    if (!section || !video || !ceoCopy || !description || !mission || !missionBody) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.style.setProperty('--purpose-dark', '1')
      section.style.setProperty('--mission-title-light', '1')
      section.style.setProperty('--mission-image-progress', '1')
      section.style.setProperty('--mission-content-progress', '1')
      video.style.setProperty('--purpose-video-opacity', '1')
      video.style.setProperty('--purpose-video-mask-inner', '118%')
      video.style.setProperty('--purpose-video-mask-mid', '132%')
      video.style.setProperty('--purpose-video-mask-outer', '146%')
      video.style.setProperty('--purpose-video-blur', '0px')
      video.style.setProperty('--purpose-video-brightness', '1')
      video.style.setProperty('--purpose-video-scale', '1')
      ceoCopy.style.setProperty('--ceo-light', '1')
      ceoCopy.style.setProperty('--quote-light', '1')
      ceoCopy.style.setProperty('--desc-light', '1')
      return
    }

    let ticking = false

    const updateReveal = () => {
      ticking = false
      const rect = video.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.98
      const end = vh * 0.22
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
      const eased = progress * progress * (3 - 2 * progress)
      const maskInner = Math.max(0, eased * 118 - 18)
      const maskOuter = eased * 146
      const maskMid = (maskInner + maskOuter) / 2

      video.style.setProperty('--purpose-video-opacity', eased.toFixed(4))
      video.style.setProperty('--purpose-video-mask-inner', `${maskInner.toFixed(2)}%`)
      video.style.setProperty('--purpose-video-mask-mid', `${maskMid.toFixed(2)}%`)
      video.style.setProperty('--purpose-video-mask-outer', `${maskOuter.toFixed(2)}%`)
      video.style.setProperty('--purpose-video-blur', `${((1 - eased) * 18).toFixed(2)}px`)
      video.style.setProperty('--purpose-video-brightness', (1 + (1 - eased) * 0.8).toFixed(4))
      video.style.setProperty('--purpose-video-scale', (1 + (1 - eased) * 0.08).toFixed(4))

      const copyRect = ceoCopy.getBoundingClientRect()
      const copyStart = vh * 0.94
      const copyEnd = vh * 0.68
      const copyProgress = Math.min(1, Math.max(0, (copyStart - copyRect.top) / (copyStart - copyEnd)))
      const step = (from, to) => {
        const local = Math.min(1, Math.max(0, (copyProgress - from) / (to - from)))
        return local * local * (3 - 2 * local)
      }
      const setTextLight = (name, value) => {
        ceoCopy.style.setProperty(`--${name}-light`, value.toFixed(4))
      }

      setTextLight('ceo', step(0, 0.24))
      setTextLight('quote', step(0.14, 0.58))
      setTextLight('desc', step(0.42, 1))

      // mission은 더 이상 화면에 고정(pin)되지 않고 일반 문서 흐름에 놓인다.
      // 화면에 들어오는 동안 자기 위치만으로 단계별 등장을 계산한다. 어두워지는
      // 전환이 한번에 뚝 끊기지 않도록 화면 높이의 1.4배에 걸쳐 천천히 진행한다.
      const missionRect = mission.getBoundingClientRect()
      const missionStart = vh * 1.1
      const missionEnd = vh * -0.3
      const missionProgress = Math.min(
        1,
        Math.max(0, (missionStart - missionRect.top) / (missionStart - missionEnd)),
      )
      const missionStep = (from, to) => {
        const local = Math.min(1, Math.max(0, (missionProgress - from) / (to - from)))
        return local * local * (3 - 2 * local)
      }

      // 시퀀스: ①배경이 서서히 어두워짐 → ②제목 선명 → ③뒷배경 이미지 등장 → ④영문 카피 등장.
      section.style.setProperty('--purpose-dark', missionStep(0, 0.55).toFixed(4))
      section.style.setProperty('--mission-title-light', missionStep(0.35, 0.6).toFixed(4))
      section.style.setProperty('--mission-image-progress', missionStep(0.45, 0.7).toFixed(4))

      // 영문 카피는 missionVisual 아래쪽에 있어 mission(이미지+제목) 기준 progress보다
      // 늦게 화면에 들어온다. 화면 중앙에 왔을 때 이미 선명해 보이도록, 자기 자신의
      // 위치를 기준으로 별도 progress를 계산한다.
      const bodyRect = missionBody.getBoundingClientRect()
      const bodyStart = vh * 1.05
      const bodyEnd = vh * 0.68
      const bodyProgress = Math.min(
        1,
        Math.max(0, (bodyStart - bodyRect.top) / (bodyStart - bodyEnd)),
      )
      const bodyEased = bodyProgress * bodyProgress * (3 - 2 * bodyProgress)
      section.style.setProperty('--mission-content-progress', bodyEased.toFixed(4))
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(updateReveal)
      }
    }

    updateReveal()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} className={styles.purpose} aria-label="일광전구의 목적">
      <div className={styles.ceoBlock}>
        <div
          ref={videoRef}
          className={styles.videoPlaceholder}
          role="img"
          aria-label="브랜드 영상 미리보기"
        >
          <iframe
            src={CEO_VIDEO_URL}
            title="브랜드 영상"
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
          />
          <div className={styles.videoCopy}>
            <strong>We Make Light.</strong>
            <span className={styles.yearMark}>1962</span>
            <strong>by Ilkwang Lightings Presents</strong>
          </div>
          <div className={styles.videoLogos}>
            <span>1962</span>
            <strong>IK</strong>
            <strong>ILKW.</strong>
          </div>
        </div>

        <div ref={ceoCopyRef} className={styles.ceoCopy}>
          <p className={styles.ceo}>
            <span>CEO</span>
            <i />
            <strong>김홍도</strong>
          </p>
          <blockquote>“빛에는 희망의 개념도 있잖아요. 우리는 희망을 만드는 거예요.”</blockquote>
          <p ref={descriptionRef} className={styles.description}>
            60년 넘게 이어온 제조 기술과 빛에 대한 깊은 이해를 바탕으로,
            <br />
            일광전구의 새로운 방향성을 만들어가고 있습니다.
          </p>
        </div>
      </div>

      <div ref={missionRef} className={styles.mission}>
        <div className={styles.missionVisual}>
          <img className={styles.missionImage} src={teamImage} alt="" />
          <p className={styles.missionTitle}>
            우리는 <strong>세상을 이롭게 하는 빛</strong>을 만듭니다.
          </p>
        </div>
        <div ref={missionBodyRef} className={styles.missionBody}>
          <p className={styles.englishCopy}>
            From a single glowing filament
            <br />
            to thoughtfully designed lighting,
            <br />
            our purpose remains the same.
          </p>
        </div>
      </div>
    </section>
  )
}

export default PurposeSection
