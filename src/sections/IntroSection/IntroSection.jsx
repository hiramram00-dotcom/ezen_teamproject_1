/* IntroSection — 스크롤 반응형.
 * ⚠️ 임시 placeholder 아님: 팀원 원본을 fix/scroll-issue 브랜치에서 리팩터한 버전.
 * 변경점(A안): 충돌 원인이던 영상 자동재생용 스크롤 잠금+scrollTo 점프 제거.
 *   영상은 "구간 진입 시 자동재생"(VideoOnEnter)으로 처리 — 스크롤을 가로채지 않음.
 * 보존: 스티키 스테이지 / 진행도 계산 / 모든 레이어 opacity 타이밍 / text6 / 클로징.
 */
import { useEffect, useRef, useState } from 'react'
import styles from './IntroSection.module.css'
import VideoOnEnter from '../../components/VideoOnEnter/VideoOnEnter'

import intro3 from '../../../img/intro-3.png'
import intro4 from '../../../img/intro-4.jpg'
import intro5 from '../../../img/intro-5.png'

const flameVideo =
  'https://res.cloudinary.com/dg9hg29hc/video/upload/video-intro-1_emyjko.mp4'
const bulbVideo =
  'https://res.cloudinary.com/dg9hg29hc/video/upload/video-intro-2_omam01.mp4'

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max)

const getOpacity = (progress, start, fadeInEnd, fadeOutStart, end) => {
  if (progress <= start || progress >= end) return 0
  if (progress < fadeInEnd) return clamp((progress - start) / (fadeInEnd - start))
  if (progress <= fadeOutStart) return 1
  return clamp(1 - (progress - fadeOutStart) / (end - fadeOutStart))
}

const getSceneProgress = (progress, start, end) => clamp((progress - start) / (end - start))

const getText6State = (progress) => {
  const opacity = getOpacity(progress, 0.725, 0.745, 0.875, 0.9)
  const moveProgress = getSceneProgress(progress, 0.77, 0.835)
  return { opacity, '--text6-y': `${14 + moveProgress * 36}vh` }
}

function IntroSection() {
  const introRef = useRef(null)
  const frameRef = useRef(null)
  const text6TriggeredRef = useRef(false)
  const text6FadeTimerRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [text6AutoPlaying, setText6AutoPlaying] = useState(false)
  const [text6AutoLeaving, setText6AutoLeaving] = useState(false)

  const opacity = {
    text1: getOpacity(progress, 0.01, 0.035, 0.105, 0.13),
    intro1: getOpacity(progress, 0.14, 0.165, 0.235, 0.28),
    intro2: getOpacity(progress, 0.31, 0.335, 0.415, 0.46),
    intro3Image: getOpacity(progress, 0.49, 0.505, 0.548, 0.565),
    intro3Text: getOpacity(progress, 0.515, 0.53, 0.54, 0.55),
    intro4Image: getOpacity(progress, 0.58, 0.6, 0.668, 0.685),
    intro4Text: getOpacity(progress, 0.61, 0.625, 0.64, 0.65),
    intro5Image: getOpacity(progress, 0.7, 0.72, 0.788, 0.805),
    closing: getOpacity(progress, 0.92, 0.94, 0.995, 1),
  }
  const text6State = getText6State(progress)

  // 스크롤 진행도 계산 — 반응형만 (잠금/점프 없음)
  useEffect(() => {
    const updateProgress = () => {
      const section = introRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const scrollableDistance = section.offsetHeight - window.innerHeight
      setProgress(clamp(-rect.top / scrollableDistance))
      frameRef.current = null
    }
    const onScroll = () => {
      if (!frameRef.current) frameRef.current = requestAnimationFrame(updateProgress)
    }
    updateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      if (text6FadeTimerRef.current) window.clearTimeout(text6FadeTimerRef.current)
    }
  }, [])

  // text6 자동 연출 (그대로 보존)
  useEffect(() => {
    if (progress >= 0.735 && progress < 0.9 && !text6TriggeredRef.current) {
      text6TriggeredRef.current = true
      setText6AutoPlaying(true)
      setText6AutoLeaving(false)
    }
    if (progress >= 0.855 && text6TriggeredRef.current && !text6FadeTimerRef.current) {
      setText6AutoLeaving(true)
      text6FadeTimerRef.current = window.setTimeout(() => {
        text6TriggeredRef.current = false
        text6FadeTimerRef.current = null
        setText6AutoPlaying(false)
        setText6AutoLeaving(false)
      }, 1000)
    }
    if (progress < 0.69 && text6TriggeredRef.current) {
      if (text6FadeTimerRef.current) {
        window.clearTimeout(text6FadeTimerRef.current)
        text6FadeTimerRef.current = null
      }
      text6TriggeredRef.current = false
      setText6AutoPlaying(false)
      setText6AutoLeaving(false)
    }
  }, [progress])

  return (
    <section id="about" ref={introRef} className={styles.intro} aria-label="일광전구 브랜드 소개">
      <div className={styles.stickyStage}>
        <div className={`${styles.layer} ${styles.centerLayer}`} style={{ opacity: opacity.text1 }}>
          <p className={styles.copy}>
            인류는 어둠 속에서{' '}
            <strong className={`${styles.glow} ${opacity.text1 > 0.5 ? styles.lit : ''}`}>빛</strong>
            을 찾았습니다.
          </p>
        </div>

        <div className={`${styles.layer} ${styles.intro1Layer}`} style={{ opacity: opacity.intro1 }}>
          <p className={`${styles.copy} ${styles.topCopy}`}>불꽃에서 초로,</p>
          <VideoOnEnter
            src={flameVideo}
            active={opacity.intro1 > 0}
            className={`${styles.media} ${styles.intro1Media}`}
          />
        </div>

        <div className={`${styles.layer} ${styles.centerMediaLayer}`} style={{ opacity: opacity.intro2 }}>
          <p className={`${styles.copy} ${styles.topCopy}`}>초에서 전구로,</p>
          <VideoOnEnter
            src={bulbVideo}
            active={opacity.intro2 > 0}
            className={`${styles.media} ${styles.intro2Media}`}
          />
        </div>

        <div className={`${styles.layer} ${styles.intro3Layer}`}>
          <p className={`${styles.copy} ${styles.topCopy} ${styles.fadeItem}`} style={{ opacity: opacity.intro3Text }}>
            빛은 시대와 함께 변화하지만,
          </p>
          <img
            className={`${styles.media} ${styles.intro3Media} ${styles.fadeItem}`}
            src={intro3}
            alt="따뜻한 빛이 켜진 생활 공간"
            style={{ opacity: opacity.intro3Image }}
          />
        </div>

        <div className={`${styles.layer} ${styles.intro4Layer}`}>
          <p className={`${styles.copy} ${styles.topCopy} ${styles.fadeItem}`} style={{ opacity: opacity.intro4Text }}>
            좋은 빛의 기준은 변하지 않습니다.
          </p>
          <img
            className={`${styles.media} ${styles.intro4Media} ${styles.fadeItem}`}
            src={intro4}
            alt="손 위에서 은은하게 빛나는 전구"
            style={{ opacity: opacity.intro4Image }}
          />
        </div>

        <div className={`${styles.layer} ${styles.intro5Layer}`}>
          <img
            className={`${styles.media} ${styles.intro5Media} ${styles.fadeItem} ${text6AutoPlaying ? styles.intro5AutoFade : ''}`}
            src={intro5}
            alt="따뜻한 조명이 켜진 공간"
            style={{ opacity: opacity.intro5Image }}
          />
        </div>

        <div
          className={`${styles.layer} ${styles.text6Layer} ${text6AutoPlaying ? styles.text6AutoMove : ''} ${text6AutoLeaving ? styles.text6AutoLeaving : ''}`}
          style={text6AutoPlaying ? { opacity: 1 } : text6State}
        >
          <p className={styles.copy}>
            더 따뜻하게.
            <br />더 편안하게.
            <br />
            <strong>더 오래 곁에 머무르도록.</strong>
          </p>
        </div>

        <div className={`${styles.layer} ${styles.centerLayer}`} style={{ opacity: opacity.closing }}>
          <p className={styles.closing}>
            We Make{' '}
            <em className={`${styles.glow} ${opacity.closing > 0.5 ? styles.lit : ''}`}>Light,</em>{' '}
            <strong>ILKW.</strong>
          </p>
        </div>
      </div>
    </section>
  )
}

export default IntroSection
