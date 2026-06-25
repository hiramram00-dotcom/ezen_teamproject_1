import { useEffect, useRef } from 'react'

import styles from './HistorySection.module.css'

import about1962 from './assets/about-1962.webp'
import about1987 from './assets/about-1987.webp'
import about1999 from './assets/about-1999.webp'
import about2002 from './assets/about-2002.webp'
import about2013a from './assets/about-2013-a.webp'
import about2013b from './assets/about-2013-b.webp'
import about2021 from './assets/about-2021.webp'
import about2022 from './assets/about-2022.webp'
import about2023 from './assets/about-2023.webp'
import about2026 from './assets/about-2026.webp'
import about2026daysA from './assets/about-2026-3days-a.webp'
import about2026daysB from './assets/about-2026-3days-b.webp'

// Figma "about-history" (node 1641:55) 湲곗? ??梨뺥꽣留덈떎 ?쇱そ???곕룄, ?ㅻⅨ履쎌뿉 肄섑뀗痢?
// ?곕룄??x=570 ?곗륫 ?뺣젹. ?멸린媛 諛붾??뚮쭔 ?꾩껜(1962쨌2002), 媛숈? ?멸린???????먮━(87쨌99쨌13??,
// 吏곸쟾怨?媛숈? ?곕룄硫??앸왂(2026 以묐났). 肄섑뀗痢좊뒗 x=852쨌width 1000(?ㅻⅨ履?68px 嫄고꽣源뚯?).
// yearLabel: ?꾩껜 4?먮━. images: [{ src, w, h }] ??1?μ씠硫??⑥씪(1000횞580), 2?μ씠硫?媛濡??섏뿴.
const historyItems = [
  {
    key: '1962',
    yearLabel: '1962',
    title: '일광전구 설립',
    description: (
      <>
        김만규 회장님께서 일광전구를 설립하시고,
        <br />
        백열전구 생산을 시작하였습니다.
      </>
    ),
    images: [{ src: about1962, w: 1000, h: 580 }],
  },
  {
    key: '1987',
    yearLabel: '1987',
    title: '미국 수출',
    description: '미국 Walmart에 백열전구를 수출하였습니다.',
    images: [{ src: about1987, w: 1000, h: 580 }],
  },
  {
    key: '1999',
    yearLabel: '1999',
    title: '김홍도 대표이사 취임',
    description: (
      <>
        김만규 회장님의 뒤를 이어
        <br />
        김홍도 대표이사님이 취임하셨습니다.
      </>
    ),
    images: [{ src: about1999, w: 1000, h: 580 }],
  },
  {
    key: '2002',
    yearLabel: '2002',
    title: '대구 공장 설립',
    description: '대구에 일광전구 공장을 설립하였습니다.',
    images: [{ src: about2002, w: 1000, h: 580 }],
  },
  {
    key: '2013',
    yearLabel: '2013',
    title: '1st 리브랜딩',
    description: '창립 50주년을 맞아 브랜드 리뉴얼을 진행했습니다.',
    images: [
      { src: about2013a, w: 580, h: 580 },
      { src: about2013b, w: 404, h: 358 },
    ],
  },
  {
    key: '2021',
    yearLabel: '2021',
    title: '조명 브랜드로의 전환',
    description: (
      <>
        2nd 리브랜딩과 SNOWMAN 시리즈 출시를 통해
        <br />
        전구 제조사를 넘어 디자인 조명 브랜드로 도약했습니다.
      </>
    ),
    images: [{ src: about2021, w: 1000, h: 580 }],
  },
  {
    key: '2022',
    yearLabel: '2022',
    title: '백열전구 생산 종료',
    description: (
      <>
        60년간 이어온 백열전구 생산을 마무리하고,
        <br />
        축적된 제조 기술을 디자인 조명에 이어갔습니다.
      </>
    ),
    images: [{ src: about2022, w: 1000, h: 580 }],
  },
  {
    key: '2023',
    yearLabel: '2023',
    title: '60주년 브랜드북 발간',
    description: '60년 브랜드의 역사를 담은 브랜드북을 발간하였습니다.',
    images: [{ src: about2023, w: 1000, h: 580 }],
  },
  {
    key: '2026',
    yearLabel: '2026',
    title: '서울리빙디자인페어 참가',
    description: '10회 연속으로 서울리빙디자인페어에 참가하였습니다.',
    images: [{ src: about2026, w: 1000, h: 580 }],
  },
  {
    key: '2026-3days',
    yearLabel: '2026',
    title: '3daysofdesign 참가',
    description: (
      <>
        덴마크 코펜하겐에서 열리는 세계적 디자인 축제에
        <br />
        대한민국 브랜드로 참가하였습니다.
      </>
    ),
    images: [
      { src: about2026daysA, w: 525, h: 580 },
      { src: about2026daysB, w: 459, h: 375 },
    ],
  },
]
const yearShorts = (() => {
  let prev = null
  return historyItems.map((item) => {
    const y = item.yearLabel
    let label
    if (y === prev) label = '' // 吏곸쟾怨??숈씪 ?곕룄 ???쒓린 ?앸왂
    else if (prev && y.slice(0, 2) === prev.slice(0, 2)) label = y.slice(2) // 媛숈? ?멸린
    else label = y // 泥???ぉ ?먮뒗 ?멸린 蹂寃????꾩껜
    prev = y
    return label
  })
})()

const yearPrefixes = [
  ...new Set(historyItems.map((item) => item.yearLabel.slice(0, 2))),
]

const yearSuffixes = [
  ...new Set(historyItems.map((item) => item.yearLabel.slice(2))),
]

function HistorySection() {
  // suffix???ㅼ쓬 ?대깽???꾩튂?먯꽌 ?ㅼ젣濡??щ씪?ㅻ떎媛 active marker???우쑝硫?
  // prefix? ?④퍡 sticky 臾띠쓬 ?덉뿉???덉젙?곸쑝濡?蹂댁씤??
  // chapters of Light + ?쇱씤 臾띠쓬? ?꾨옒濡??대룞?섏? ?딅뒗??
  const blockRefs = useRef([])
  const railMotionRef = useRef(null)
  const dividerRef = useRef(null)
  const headingRef = useRef(null)
  const historyRef = useRef(null)
  const timelineRef = useRef(null)

  // 'our HISTORY' ??댄? ???붾㈃???ㅼ뼱?ㅻ㈃ ?먮┝ ???좊챸, 踰쀬뼱?섎㈃ ?ㅼ떆 ?먮젮??
  // ??뒪?щ·(?ㅼ떆 吏꾩엯)???뚮쭏??紐⑥뀡???ъ깮?쒕떎.
  useEffect(() => {
    const el = headingRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add(styles.headingShown)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          el.classList.toggle(styles.headingShown, entry.isIntersecting)
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const blocks = blockRefs.current.filter(Boolean)
    if (!blocks.length) return undefined

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
    const ease = (value) => value * value * (3 - 2 * value)
    let frame = 0

    const setReveal = (block, rawProgress) => {
      const progress = ease(clamp(rawProgress, 0, 1))
      block.style.setProperty('--history-reveal-media', progress.toFixed(4))
      block.style.setProperty('--history-reveal-marker', clamp((progress - 0.12) / 0.88, 0, 1).toFixed(4))
      block.style.setProperty('--history-reveal-copy', clamp((progress - 0.2) / 0.8, 0, 1).toFixed(4))
    }

    const revealAll = () => {
      blocks.forEach((block) => {
        block.style.setProperty('--history-reveal-media', '1')
        block.style.setProperty('--history-reveal-marker', '1')
        block.style.setProperty('--history-reveal-copy', '1')
      })
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealAll()
      return undefined
    }

    const update = () => {
      const vh = window.innerHeight
      blocks.forEach((block) => {
        const rect = block.getBoundingClientRect()
        const start = vh * 0.94
        const end = vh * 0.36
        setReveal(block, (start - rect.top) / (start - end))
      })
      frame = 0
    }

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const history = historyRef.current
    const timeline = timelineRef.current
    if (!history || !timeline) return undefined

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
    const ease = (value) => value * value * (3 - 2 * value)
    let frame = 0

    const updateIntro = () => {
      const rect = timeline.getBoundingClientRect()
      const start = window.innerHeight * 0.78
      const end = window.innerHeight * 0.24
      const progress = ease(clamp((start - rect.top) / (start - end), 0, 1))

      timeline.style.setProperty('--history-intro-progress', progress.toFixed(4))
      frame = 0
    }

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateIntro)
    }

    updateIntro()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const rail = railMotionRef.current
    const blocks = blockRefs.current.filter(Boolean)
    if (!rail || !blocks.length) return undefined

    const mq = window.matchMedia(
      '(min-width: 1200px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    )

    const prefixSpans = Array.from(rail.querySelectorAll('[data-rail-prefix]'))
    const suffixSpans = Array.from(rail.querySelectorAll('[data-rail-suffix]'))
    const prefixMap = new Map(prefixSpans.map((span) => [span.dataset.railPrefix, span]))
    const suffixMap = new Map(suffixSpans.map((span) => [span.dataset.railSuffix, span]))
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
    const ease = (value) => value * value * (3 - 2 * value)
    let rafId = 0

    const resetSpan = (span) => {
      span.style.visibility = 'hidden'
      span.style.opacity = '0'
      span.style.transform = 'translate3d(0, 0, 0)'
      span.style.filter = 'blur(0px)'
    }

    const showSpan = (span, opacity, y, blur) => {
      if (!span) return
      span.style.visibility = opacity > 0.001 ? 'visible' : 'hidden'
      span.style.opacity = opacity.toFixed(4)
      span.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`
      span.style.filter = `blur(${blur.toFixed(2)}px)`
    }

    const reset = () => {
      prefixSpans.forEach(resetSpan)
      suffixSpans.forEach(resetSpan)
      rail.style.transform = ''
    }

    const render = () => {
      reset()

      if (!mq.matches) {
        rafId = 0
        return
      }

      const railRect = rail.getBoundingClientRect()
      const fallbackYearStep = 96
      const markerTop = railRect.top + railRect.height * 0.72
      const lastBlock = blocks.at(-1)
      const lastMedia = lastBlock?.querySelector('[data-history-media]')
      const lastTarget = lastMedia || lastBlock
      if (lastTarget) {
        const exitStart = markerTop + window.innerHeight * 0.26
        const exitY = Math.min(0, lastTarget.getBoundingClientRect().bottom - exitStart)
        rail.style.transform = `translate3d(0, ${exitY.toFixed(2)}px, 0)`
      }
      let currentIndex = 0

      blocks.forEach((block, index) => {
        const marker = block.querySelector('[data-history-year-marker]')
        const target = marker || block.querySelector('[data-history-media]') || block
        const rect = target.getBoundingClientRect()
        if (rect.top <= markerTop) currentIndex = index
      })

      const current = historyItems[currentIndex]
      const nextIndex = Math.min(currentIndex + 1, historyItems.length - 1)
      const next = historyItems[nextIndex]
      const currentSuffix = current.yearLabel.slice(2)
      const yearStep = Math.max(
        72,
        (suffixMap.get(currentSuffix)?.getBoundingClientRect().height || fallbackYearStep) * 0.92,
      )
      let progress = 0
      const incomingStartY = Math.max(yearStep * 6.4, window.innerHeight * 0.58)

      if (next && next.yearLabel !== current.yearLabel) {
        const nextBlock = blocks[nextIndex]
        if (nextBlock) {
          const rect = nextBlock.getBoundingClientRect()
          const start = window.innerHeight * 0.94
          const end = window.innerHeight * 0.36
          progress = ease(clamp((start - rect.top) / (start - end), 0, 1))
        }
      }

      const currentPrefix = current.yearLabel.slice(0, 2)
      const nextPrefix = next?.yearLabel.slice(0, 2)
      const nextSuffix = next?.yearLabel.slice(2)
      const outgoingY = -yearStep * progress
      const nextY = incomingStartY * (1 - progress)
      const incomingOpacity = clamp(progress / 0.42, 0, 1)
      const outgoingOpacity = clamp((1 - progress) / 0.42, 0, 1)
      const incomingBlur = (1 - incomingOpacity) * 10
      const outgoingBlur = (1 - outgoingOpacity) * 4

      if (!next || next.yearLabel === current.yearLabel || progress <= 0.001) {
        showSpan(prefixMap.get(currentPrefix), 1, 0, 0)
        showSpan(suffixMap.get(currentSuffix), 1, 0, 0)
      } else if (progress >= 0.999) {
        showSpan(prefixMap.get(nextPrefix), 1, 0, 0)
        showSpan(suffixMap.get(nextSuffix), 1, 0, 0)
      } else {
        const samePrefix = currentPrefix === nextPrefix
        if (samePrefix) {
          showSpan(prefixMap.get(currentPrefix), 1, 0, 0)
        } else {
          showSpan(prefixMap.get(currentPrefix), outgoingOpacity, outgoingY, outgoingBlur)
          showSpan(prefixMap.get(nextPrefix), incomingOpacity, nextY, incomingBlur)
        }

        showSpan(suffixMap.get(currentSuffix), outgoingOpacity, outgoingY, outgoingBlur)
        showSpan(suffixMap.get(nextSuffix), incomingOpacity, nextY, incomingBlur)
      }

      rafId = 0
    }

    const requestRender = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(render)
    }

    render()
    window.addEventListener('scroll', requestRender, { passive: true })
    window.addEventListener('resize', requestRender)
    mq.addEventListener?.('change', requestRender)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', requestRender)
      window.removeEventListener('resize', requestRender)
      mq.removeEventListener?.('change', requestRender)
      reset()
    }
  }, [])
  return (
    <section ref={historyRef} className={styles.history} aria-labelledby="history-title">
      <h2 id="history-title" ref={headingRef} className={styles.heading}>
        <span className={styles.headingPlain}>our</span>
        <em>History</em>
      </h2>

      <div ref={timelineRef} className={styles.timeline}>
        {/* chapters of Light + ?쇱씤 + ?곕룄瑜??섎굹??active marker(?곗뒪?ы넲 sticky 臾띠쓬)濡?
            ?곕룄??prefix/suffix ??而щ읆???ㅼ젣 DOM?쇰줈 ?볦뿬 ?ㅽ겕濡ㅼ뿉 留욎떠 ?꾨줈 ?대룞?쒕떎.
            紐⑤컮?셋룹?紐⑥뀡? ??臾띠쓬???④린怨?媛?釉붾줉???꾩껜 ?곕룄瑜??뺤쟻?쇰줈 ?몄텧. */}
        <div className={styles.rail}>
          <div ref={railMotionRef} className={styles.railMotion}>
            <p className={styles.subtitle}>
              <span className={styles.subtitlePlain}>chapters of</span>
              <em>Light</em>
            </p>
            <span
              ref={dividerRef}
              className={styles.divider}
              data-history-divider
              aria-hidden="true"
            />
            <span className={styles.railPrefixLayer} aria-hidden="true">
              {yearPrefixes.map((prefix) => (
                <span key={prefix} data-rail-prefix={prefix}>
                  {prefix}
                </span>
              ))}
            </span>
            <span className={styles.railSuffixLayer} aria-hidden="true">
              {yearSuffixes.map((suffix) => (
                <span key={suffix} data-rail-suffix={suffix}>
                  {suffix}
                </span>
              ))}
            </span>
          </div>
        </div>

        {historyItems.map((item, index) => (
          <article
            key={item.key}
            ref={(el) => {
              blockRefs.current[index] = el
            }}
            className={`${styles.block}${
              yearShorts[index] === '' ? ` ${styles.continued}` : ''
            }`}
          >
            {/* 梨뺥꽣 ?곕룄 ???곗륫 ?뺣젹(x=570). ?곗뒪?ы넲: 異뺤빟 ?쒓린 / 紐⑤컮?? ?꾩껜 ?곕룄 */}
            <p
              className={styles.marker}
              aria-label={item.yearLabel}
              data-history-year-marker
              data-skip-year={yearShorts[index] === ''}
            >
              <span className={styles.markerFull}>{item.yearLabel}</span>
              <span className={styles.markerSplit} aria-hidden="true">
                {yearShorts[index].length === 4 && (
                  <span className={styles.markerPrefix} data-year-prefix>
                    {item.yearLabel.slice(0, 2)}
                  </span>
                )}
                {yearShorts[index].length === 2 && (
                  <span
                    className={styles.markerPrefixGhost}
                    data-year-prefix-ghost
                  >
                    {item.yearLabel.slice(0, 2)}
                  </span>
                )}
                {yearShorts[index] !== '' && (
                  <span className={styles.markerSuffix} data-year-suffix>
                    {item.yearLabel.slice(2)}
                  </span>
                )}
              </span>
            </p>
            <div className={styles.content}>
              <div className={styles.copy}>
                <h3 className={`${styles.title} fs-body-2`}>{item.title}</h3>
                <p className={`${styles.description} fs-sub-3`}>{item.description}</p>
              </div>
              <div
                className={`${styles.media} ${
                  item.images.length > 1 ? styles.mediaRow : ''
                }`}
                data-history-media
              >
                {item.images.map((img, i) => (
                  <div
                    key={i}
                    className={styles.frame}
                    style={{
                      aspectRatio: `${img.w} / ${img.h}`,
                      flexGrow: item.images.length > 1 ? img.w : undefined,
                    }}
                  >
                    <img src={img.src} alt="" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default HistorySection

