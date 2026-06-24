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

// Figma "about-history" (node 1641:55) 기준 — 챕터마다 왼쪽에 연도, 오른쪽에 콘텐츠.
// 연도는 x=570 우측 정렬. 세기가 바뀔 때만 전체(1962·2002), 같은 세기는 끝 두 자리(87·99·13…),
// 직전과 같은 연도면 생략(2026 중복). 콘텐츠는 x=852·width 1000(오른쪽 68px 거터까지).
// yearLabel: 전체 4자리. images: [{ src, w, h }] — 1장이면 단일(1000×580), 2장이면 가로 나열.
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

// 챕터별 연도 표기 — 세기가 바뀌면 전체(1962·2002), 같은 세기면 끝 두 자리(87·99…),
// 직전과 같은 연도면 생략(2026 중복). 데스크톱 전용 표기(모바일은 전체 연도 노출).
const yearShorts = (() => {
  let prev = null
  return historyItems.map((item) => {
    const y = item.yearLabel
    let label
    if (y === prev) label = '' // 직전과 동일 연도 → 표기 생략
    else if (prev && y.slice(0, 2) === prev.slice(0, 2)) label = y.slice(2) // 같은 세기
    else label = y // 첫 항목 또는 세기 변경 → 전체
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
  // suffix는 다음 이벤트 위치에서 실제로 올라오다가 active marker에 닿으면
  // prefix와 함께 sticky 묶음 안에서 안정적으로 보인다.
  // chapters of Light + 라인 묶음은 아래로 이동하지 않는다.
  const blockRefs = useRef([])
  const railMotionRef = useRef(null)
  const dividerRef = useRef(null)
  const metricsRef = useRef(null)
  const headingRef = useRef(null)

  // 'our HISTORY' 타이틀 — 화면에 들어오면 흐림 → 선명, 벗어나면 다시 흐려져
  // 역스크롤(다시 진입)할 때마다 모션이 재생된다.
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
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    // 데스크톱(넓은 화면·정밀 포인터·모션 허용)에서만 sticky 연도 묶음을 구동.
    // 그 외(모바일·저모션)는 각 블록의 전체 연도(.marker)가 정적으로 노출된다.
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
        // 마지막 연도를 이미지 끝까지 배웅할 때만 sticky 묶음을 이미지 끝으로 보낸다.
        railMotion.style.transform = moveBy(finalAnchorTop - anchorTop)
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
        railMotion.style.transform = moveBy(initialGroupOffset)
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
      // 정적 폴백으로 돌아갈 때 잔여 transform 제거.
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
    <section className={styles.history} aria-labelledby="history-title">
      <h2 id="history-title" ref={headingRef} className={styles.heading}>
        <em>our</em> HISTORY
      </h2>

      <div className={styles.timeline}>
        {/* chapters of Light + 라인 + 연도를 하나의 active marker(데스크톱 sticky 묶음)로.
            연도는 prefix/suffix 두 컬럼에 실제 DOM으로 쌓여 스크롤에 맞춰 위로 이동한다.
            모바일·저모션은 이 묶음을 숨기고 각 블록의 전체 연도를 정적으로 노출. */}
        <div className={styles.rail}>
          <div ref={railMotionRef} className={styles.railMotion}>
            <p className={styles.subtitle}>chapters of Light</p>
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
            {/* 챕터 연도 — 우측 정렬(x=570). 데스크톱: 축약 표기 / 모바일: 전체 연도 */}
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
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.description}>{item.description}</p>
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
