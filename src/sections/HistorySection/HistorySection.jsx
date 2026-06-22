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

function HistorySection() {
  // suffix는 실제 이벤트 위치에서 스크롤로 올라와 active marker에 닿고,
  // 전환이 시작되면 해당 이미지 끝 위치에 남아 이미지와 함께 스크롤된다.
  // chapters of Light + 라인 묶음은 아래로 이동하지 않는다.
  const blockRefs = useRef([])
  const railMotionRef = useRef(null)
  const dividerRef = useRef(null)

  useEffect(() => {
    // 데스크톱(넓은 화면·정밀 포인터·모션 허용)에서만 sticky 연도 묶음을 구동.
    // 그 외(모바일·저모션)는 각 블록의 전체 연도(.marker)가 정적으로 노출된다.
    const mq = window.matchMedia(
      '(min-width: 1200px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    )

    let frame = 0
    let lastFrameState = ''
    let active = false

    const render = () => {
      const railMotion = railMotionRef.current
      const divider = dividerRef.current
      if (!railMotion || !divider) return

      railMotion.style.transform = ''

      const markerElements = blockRefs.current
        .map((block, index) => {
          const marker = block?.querySelector('[data-history-year-marker]')
          const media = block?.querySelector('[data-history-media]')
          if (!marker || marker.dataset.skipYear === 'true') return null
          const blockRect = block.getBoundingClientRect()
          const prefix = marker.querySelector('[data-year-prefix]')
          const prefixGhost = marker.querySelector('[data-year-prefix-ghost]')
          const suffix = marker.querySelector('[data-year-suffix]')
          const mediaBottom = media
            ? blockRect.top + media.offsetTop + media.offsetHeight
            : blockRect.bottom
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
              nextBlockRect.top + nextMedia.offsetTop + nextMedia.offsetHeight
          }

          return {
            index,
            marker,
            top: blockRect.top + marker.offsetTop,
            mediaBottom: yearGroupMediaBottom,
            prefix,
            prefixGhost,
            suffix,
            suffixHeight: suffix?.offsetHeight ?? marker.offsetHeight,
          }
        })
        .filter(Boolean)

      markerElements.forEach(({ prefix, prefixGhost, suffix }) => {
        if (prefix) prefix.style.transform = ''
        if (prefixGhost) {
          prefixGhost.style.transform = ''
          prefixGhost.style.visibility = ''
        }
        if (suffix) suffix.style.transform = ''
      })

      const anchorTop = divider.getBoundingClientRect().bottom
      const markers = markerElements

      const moveBy = (value) => `translate3d(0, ${value.toFixed(3)}px, 0)`
      const moveEntryToTop = (entry, targetTop) => {
        if (!entry) return ''
        return moveBy(targetTop - entry.top)
      }
      const moveEntryToImageEnd = (entry) =>
        moveEntryToTop(entry, entry.mediaBottom - entry.suffixHeight)

      const finalEntry = markers.at(-1)
      const finalAnchorTop =
        finalEntry && finalEntry.mediaBottom - finalEntry.suffixHeight
      const finalEntryEnding =
        finalEntry &&
        finalEntry.mediaBottom <= anchorTop + finalEntry.suffixHeight
      const activeAnchorTop = finalEntryEnding ? finalAnchorTop : anchorTop

      if (finalEntryEnding) {
        railMotion.style.transform = moveBy(finalAnchorTop - anchorTop)
      }

      const nextPrefixIndex = markers.findIndex(
        (entry) => entry.prefix && entry.top > anchorTop,
      )
      const prefixHandoffEntry =
        nextPrefixIndex > 0 ? markers[nextPrefixIndex - 1] : null
      const prefixHandoffActive =
        prefixHandoffEntry?.prefixGhost &&
        prefixHandoffEntry.mediaBottom <=
          anchorTop + prefixHandoffEntry.suffixHeight

      const activePrefix = prefixHandoffActive
        ? null
        : markers
            .filter((entry) => entry.prefix && entry.top <= anchorTop)
            .at(-1)

      if (activePrefix?.prefix) {
        activePrefix.prefix.style.transform = moveEntryToTop(
          activePrefix,
          activeAnchorTop,
        )
      }

      if (prefixHandoffActive) {
        prefixHandoffEntry.prefixGhost.style.visibility = 'visible'
        prefixHandoffEntry.prefixGhost.style.transform =
          moveEntryToImageEnd(prefixHandoffEntry)
      }

      markers.forEach((entry) => {
        if (!entry.suffix) return

        const suffixTouchesMarker = entry.top <= anchorTop
        const suffixTouchesImageEnd =
          entry.mediaBottom <= anchorTop + entry.suffixHeight

        if (suffixTouchesImageEnd) {
          entry.suffix.style.transform = moveEntryToImageEnd(entry)
          return
        }

        if (suffixTouchesMarker) {
          entry.suffix.style.transform = moveEntryToTop(entry, anchorTop)
        }
      })
    }

    const tick = () => {
      if (!active) return
      const frameState = `${window.scrollY}:${window.innerWidth}:${window.innerHeight}`
      if (frameState !== lastFrameState) {
        lastFrameState = frameState
        render()
      }
      frame = window.requestAnimationFrame(tick)
    }

    const enable = () => {
      if (active) return
      active = true
      lastFrameState = ''
      render()
      frame = window.requestAnimationFrame(tick)
    }
    const disable = () => {
      if (!active) return
      active = false
      if (frame) {
        window.cancelAnimationFrame(frame)
        frame = 0
      }
      // 정적 폴백으로 돌아갈 때 잔여 transform 제거.
      blockRefs.current.forEach((block) => {
        block
          ?.querySelectorAll('[data-year-prefix], [data-year-suffix]')
          .forEach((part) => {
            part.style.transform = ''
          })
      })
      if (railMotionRef.current) {
        railMotionRef.current.style.transform = ''
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
      <h2 id="history-title" className={styles.heading}>
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
