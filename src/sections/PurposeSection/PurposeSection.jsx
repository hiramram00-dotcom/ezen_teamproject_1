import { useEffect, useRef } from 'react'
import styles from './PurposeSection.module.css'

import videoPlaceholder from '../PhilosophySection/assets/philosophy-room.webp'
import teamImage from './assets/purpose-team.webp'

function PurposeSection() {
  const videoRef = useRef(null)
  const ceoCopyRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    const ceoCopy = ceoCopyRef.current
    if (!video || !ceoCopy) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
      const copyStart = vh * 0.86
      const copyEnd = vh * 0.36
      const copyProgress = Math.min(1, Math.max(0, (copyStart - copyRect.top) / (copyStart - copyEnd)))
      const step = (from, to) => {
        const local = Math.min(1, Math.max(0, (copyProgress - from) / (to - from)))
        return local * local * (3 - 2 * local)
      }
      const setTextLight = (name, value) => {
        ceoCopy.style.setProperty(`--${name}-light`, value.toFixed(4))
      }

      setTextLight('ceo', step(0, 0.38))
      setTextLight('quote', step(0.28, 0.72))
      setTextLight('desc', step(0.62, 1))
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
    <section className={styles.purpose} aria-label="일광전구의 목적">
      <div className={styles.ceoBlock}>
        <div
          ref={videoRef}
          className={styles.videoPlaceholder}
          role="img"
          aria-label="브랜드 영상 미리보기"
        >
          <img src={videoPlaceholder} alt="" />
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
          <p className={styles.description}>
            60년 넘게 이어온 제조 기술과 빛에 대한 깊은 이해를 바탕으로,
            <br />
            일광전구의 새로운 방향성을 만들어가고 있습니다.
          </p>
        </div>
      </div>

      <div className={styles.mission}>
        <p className={styles.missionTitle}>
          우리는 <strong>세상을 이롭게 하는 빛</strong>을 만듭니다.
        </p>
        <img src={teamImage} alt="일광전구 구성원 단체 사진" />
        <p className={styles.englishCopy}>
          From a single glowing filament
          <br />
          to thoughtfully designed lighting,
          <br />
          our purpose remains the same.
        </p>
      </div>
    </section>
  )
}

export default PurposeSection
