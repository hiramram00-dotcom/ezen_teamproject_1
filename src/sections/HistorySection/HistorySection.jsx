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

// 梨뺥꽣蹂??곕룄 ?쒓린 ???멸린媛 諛붾뚮㈃ ?꾩껜(1962쨌2002), 媛숈? ?멸린硫??????먮━(87쨌99??,
// 吏곸쟾怨?媛숈? ?곕룄硫??앸왂(2026 以묐났). ?곗뒪?ы넲 ?꾩슜 ?쒓린(紐⑤컮?쇱? ?꾩껜 ?곕룄 ?몄텧).
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
  const metricsRef = useRef(null)
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
    // ?곗뒪?ы넲(?볦? ?붾㈃쨌?뺣? ?ъ씤?걔룸え???덉슜)?먯꽌留?sticky ?곕룄 臾띠쓬??援щ룞.
    // 洹???紐⑤컮?셋룹?紐⑥뀡)??媛?釉붾줉???꾩껜 ?곕룄(.marker)媛 ?뺤쟻?쇰줈 ?몄텧?쒕떎.
    const mq = window.matchMedia(
      '(min-width: 1200px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    )

    let frame = 0
    let lastFrameState = ''
    let active = false

    const resetAnimatedParts = () => {
      const railMotion = railMotionRef.current
      if (railMotion) railMotion.style.transform = ''
      blockRefs.current.forEach((block) => {
        block
          ?.querySelectorAll(
            '[data-year-prefix], [data-year-prefix-ghost], [data-year-suffix]',
          )
          .forEach((part) => {
            part.style.transform = ''
            if (part.hasAttribute('data-year-suffix')) {
              part.style.visibility = ''
            }
            if (
              part.hasAttribute('data-year-prefix') ||
              part.hasAttribute('data-year-prefix-ghost')
            ) {
              part.style.visibility = ''
            }
          })
      })
      railMotion
        ?.querySelectorAll('[data-rail-prefix], [data-rail-suffix]')
        .forEach((part) => {
          part.style.visibility = ''
          part.style.transform = ''
          part.style.opacity = ''
          part.style.filter = ''
        })
    }

    const measure = () => {
      const divider = dividerRef.current
      if (!divider) return

      resetAnimatedParts()

      const scrollY = window.scrollY

      const markers = blockRefs.current
        .map((block, index) => {
          const marker = block?.querySelector('[data-history-year-marker]')
          const media = block?.querySelector('[data-history-media]')
          if (!marker || marker.dataset.skipYear === 'true') return null

          const blockRect = block.getBoundingClientRect()
          const blockTop = blockRect.top + scrollY
          const prefix = marker.querySelector('[data-year-prefix]')
          const prefixGhost = marker.querySelector('[data-year-prefix-ghost]')
          const suffix = marker.querySelector('[data-year-suffix]')
          const mediaBottom = media
            ? blockTop + media.offsetTop + media.offsetHeight
            : blockRect.bottom + scrollY
          let yearGroupMediaBottom = mediaBottom

          for (
            let nextIndex = index + 1;
            nextIndex < historyItems.length &&
            historyItems[nextIndex].yearLabel === historyItems[index].yearLabel;
            nextIndex += 1
          ) {
            const nextBlock = blockRefs.current[nextIndex]
            const nextMedia = nextBlock?.querySelector('[data-history-media]')
            if (!nextBlock || !nextMedia) continue
            const nextBlockRect = nextBlock.getBoundingClientRect()
            yearGroupMediaBottom =
              nextBlockRect.top +
              scrollY +
              nextMedia.offsetTop +
              nextMedia.offsetHeight
          }

          return {
            index,
            top: blockTop + marker.offsetTop,
            mediaBottom: yearGroupMediaBottom,
            prefix,
            prefixGhost,
            prefixValue: historyItems[index].yearLabel.slice(0, 2),
            suffix,
            suffixValue: historyItems[index].yearLabel.slice(2),
            suffixHeight: suffix?.offsetHeight ?? marker.offsetHeight,
          }
        })
        .filter(Boolean)

      metricsRef.current = {
        markers,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
      }
    }

    const render = () => {
      const railMotion = railMotionRef.current
      const divider = dividerRef.current
      if (!railMotion || !divider) return

      const metrics = metricsRef.current
      if (!metrics) {
        measure()
        return
      }

      const { markers } = metrics
      const scrollY = window.scrollY

      resetAnimatedParts()

      const moveBy = (value) => {
        const ratio = window.devicePixelRatio || 1
        const snapped = Math.round(value * ratio) / ratio
        return `translateY(${snapped}px)`
      }

      const yearGap = parseFloat(window.getComputedStyle(divider).marginTop) || 0
      const anchorTop = divider.getBoundingClientRect().bottom + yearGap

      const moveEntryToTop = (entry, targetTop) => {
        if (!entry) return ''
        return moveBy(targetTop - (entry.top - scrollY))
      }
      const moveEntryToImageEnd = (entry) =>
        moveEntryToTop(
          entry,
          entry.mediaBottom - scrollY - entry.suffixHeight,
        )

      const finalEntry = markers.at(-1)
      const finalAnchorTop =
        finalEntry &&
        finalEntry.mediaBottom - scrollY - finalEntry.suffixHeight
      const finalEntryEnding =
        finalEntry &&
        finalEntry.mediaBottom - scrollY <= anchorTop + finalEntry.suffixHeight

      if (finalEntryEnding) {
        // 留덉?留??곕룄瑜??대?吏 ?앷퉴吏 諛곗썒???뚮쭔 sticky 臾띠쓬???대?吏 ?앹쑝濡?蹂대궦??
        railMotion.style.transform = ''
      }

      const showRailPrefix = (value) => {
        railMotion
          .querySelectorAll('[data-rail-prefix]')
          .forEach((part) => {
            part.style.visibility =
              part.dataset.railPrefix === value ? 'visible' : ''
          })
      }

      const moveRailPrefix = (value, offset) => {
        railMotion
          .querySelectorAll(`[data-rail-prefix="${value}"]`)
          .forEach((part) => {
            part.style.visibility = 'visible'
            part.style.transform = moveBy(offset)
          })
      }

      const fadeRailPrefix = (value, progress) => {
        railMotion
          .querySelectorAll(`[data-rail-prefix="${value}"]`)
          .forEach((part) => {
            part.style.opacity = `${Math.max(0, 1 - progress)}`
            part.style.filter = `blur(${(progress * 10).toFixed(2)}px)`
          })
      }

      const moveRailSuffix = (value, offset) => {
        railMotion
          .querySelectorAll(`[data-rail-suffix="${value}"]`)
          .forEach((part) => {
            part.style.visibility = 'visible'
            part.style.transform = moveBy(offset)
          })
      }

      const fadeRailSuffix = (value, progress) => {
        railMotion
          .querySelectorAll(`[data-rail-suffix="${value}"]`)
          .forEach((part) => {
            part.style.opacity = `${Math.max(0, 1 - progress)}`
            part.style.filter = `blur(${(progress * 10).toFixed(2)}px)`
          })
      }

      const nextPrefixIndex = markers.findIndex(
        (entry) => entry.prefix && entry.top - scrollY > anchorTop,
      )
      const prefixHandoffNextEntry =
        nextPrefixIndex >= 0 ? markers[nextPrefixIndex] : null
      const prefixHandoffEntry =
        nextPrefixIndex > 0 ? markers[nextPrefixIndex - 1] : null
      const prefixChangesAtHandoff =
        prefixHandoffEntry?.prefixValue &&
        prefixHandoffNextEntry?.prefixValue &&
        prefixHandoffEntry.prefixValue !== prefixHandoffNextEntry.prefixValue
      const prefixHandoffActive =
        prefixHandoffEntry?.prefixGhost &&
        !prefixChangesAtHandoff &&
        prefixHandoffEntry.mediaBottom - scrollY <=
          anchorTop + prefixHandoffEntry.suffixHeight

      const activePrefix = prefixHandoffActive
        ? null
        : markers
            .filter((entry) => entry.prefix && entry.top - scrollY <= anchorTop)
            .at(-1)

      if (activePrefix?.prefix) {
        activePrefix.prefix.style.visibility = 'hidden'
        showRailPrefix(activePrefix.prefixValue)
      }

      if (prefixHandoffActive) {
        prefixHandoffEntry.prefixGhost.style.visibility = 'visible'
        prefixHandoffEntry.prefixGhost.style.transform =
          moveEntryToImageEnd(prefixHandoffEntry)
      }

      const activeSuffix = markers
        .filter((entry) => entry.suffix && entry.top - scrollY <= anchorTop)
        .at(-1)
      const nextSuffix = markers.find(
        (entry) => entry.suffix && entry.top - scrollY > anchorTop,
      )
      const nextSuffixDistance = nextSuffix
        ? nextSuffix.top - scrollY - anchorTop
        : Number.POSITIVE_INFINITY
      const suffixHeight =
        activeSuffix?.suffixHeight ?? nextSuffix?.suffixHeight ?? 120
      const suffixHandoffDistance = suffixHeight * 1.65
      const prefixEntryDistance = prefixHandoffNextEntry
        ? prefixHandoffNextEntry.top - scrollY - anchorTop
        : Number.POSITIVE_INFINITY
      const suffixHandoffProgress =
        nextSuffix && Number.isFinite(nextSuffixDistance)
          ? Math.max(
              0,
              Math.min(
                1,
                (suffixHandoffDistance - nextSuffixDistance) /
                  suffixHandoffDistance,
              ),
            )
          : 0
      const initialGroupEntryActive =
        !activeSuffix &&
        nextSuffix &&
        nextSuffixDistance <= suffixHandoffDistance
      const initialGroupOffset = initialGroupEntryActive
        ? Math.max(0, nextSuffixDistance)
        : 0

      if (initialGroupOffset > 0) {
        railMotion.style.transform = ''
      }

      if (
        !activePrefix &&
        !prefixHandoffActive &&
        prefixHandoffNextEntry?.prefix &&
        prefixEntryDistance <= suffixHandoffDistance
      ) {
        prefixHandoffNextEntry.prefix.style.visibility = 'hidden'
        moveRailPrefix(
          prefixHandoffNextEntry.prefixValue,
          initialGroupEntryActive ? 0 : Math.max(0, prefixEntryDistance),
        )
      }

      markers.forEach((entry) => {
        if (!entry.suffix) return
        const distance = entry.top - scrollY - anchorTop
        if (distance <= suffixHandoffDistance) {
          entry.suffix.style.visibility = 'hidden'
        }
      })

      if (activeSuffix?.suffixValue) {
        const activeOffset = suffixHandoffProgress
          ? -suffixHandoffProgress * suffixHeight
          : 0
        moveRailSuffix(activeSuffix.suffixValue, activeOffset)
        if (suffixHandoffProgress > 0) {
          fadeRailSuffix(activeSuffix.suffixValue, suffixHandoffProgress)
        }
      }

      if (
        nextSuffix?.suffixValue &&
        nextSuffixDistance <= suffixHandoffDistance
      ) {
        moveRailSuffix(
          nextSuffix.suffixValue,
          initialGroupEntryActive ? 0 : Math.max(0, nextSuffixDistance),
        )
      }

      const prefixChangesDuringSuffixHandoff =
        activeSuffix?.prefixValue &&
        nextSuffix?.prefixValue &&
        activeSuffix.prefixValue !== nextSuffix.prefixValue &&
        nextSuffixDistance <= suffixHandoffDistance

      if (prefixChangesDuringSuffixHandoff) {
        const activePrefixOffset = -suffixHandoffProgress * suffixHeight
        moveRailPrefix(activeSuffix.prefixValue, activePrefixOffset)
        fadeRailPrefix(activeSuffix.prefixValue, suffixHandoffProgress)
        moveRailPrefix(nextSuffix.prefixValue, Math.max(0, nextSuffixDistance))
        if (nextSuffix.prefix) {
          nextSuffix.prefix.style.visibility = 'hidden'
        }
      }
    }

    const tick = () => {
      if (!active) return
      const frameState = `${window.scrollY}:${window.innerWidth}:${window.innerHeight}`
      if (frameState !== lastFrameState) {
        const needsMeasure =
          !metricsRef.current ||
          metricsRef.current.viewportWidth !== window.innerWidth ||
          metricsRef.current.viewportHeight !== window.innerHeight
        if (needsMeasure) measure()
        lastFrameState = frameState
        render()
      }
      frame = window.requestAnimationFrame(tick)
    }

    const refreshMetrics = () => {
      if (!active) return
      measure()
      render()
    }

    const enable = () => {
      if (active) return
      active = true
      lastFrameState = ''
      measure()
      render()
      frame = window.requestAnimationFrame(tick)
      window.addEventListener('resize', refreshMetrics)
      document.fonts?.ready?.then(refreshMetrics)
    }
    const disable = () => {
      if (!active) return
      active = false
      window.removeEventListener('resize', refreshMetrics)
      if (frame) {
        window.cancelAnimationFrame(frame)
        frame = 0
      }
      // ?뺤쟻 ?대갚?쇰줈 ?뚯븘媛????붿뿬 transform ?쒓굅.
      blockRefs.current.forEach((block) => {
        block
          ?.querySelectorAll(
            '[data-year-prefix], [data-year-prefix-ghost], [data-year-suffix]',
          )
          .forEach((part) => {
            part.style.transform = ''
            if (part.hasAttribute('data-year-suffix')) {
              part.style.visibility = ''
            }
            if (
              part.hasAttribute('data-year-prefix') ||
              part.hasAttribute('data-year-prefix-ghost')
            ) {
              part.style.visibility = ''
            }
          })
      })
      metricsRef.current = null
      if (railMotionRef.current) {
        railMotionRef.current.style.transform = ''
        railMotionRef.current
          .querySelectorAll('[data-rail-prefix], [data-rail-suffix]')
          .forEach((part) => {
            part.style.visibility = ''
            part.style.transform = ''
            part.style.opacity = ''
            part.style.filter = ''
          })
      }
    }

    const onMq = (e) => (e.matches ? enable() : disable())
    if (mq.matches) enable()
    mq.addEventListener('change', onMq)

    return () => {
      mq.removeEventListener('change', onMq)
      disable()
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

