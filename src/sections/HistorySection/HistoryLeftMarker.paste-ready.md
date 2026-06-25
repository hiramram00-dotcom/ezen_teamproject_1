# History Left Year Marker Paste-Ready Code

이 파일은 about `our HISTORY` 섹션의 왼쪽 연도 전환 영역만 다시 구현할 때 쓰는 코드 모음입니다.

## 1. JSX 상단 유틸/refs/useEffect

```jsx
// historyItems는 각 item에 yearLabel이 있어야 합니다.
// 예: { key: '1962', yearLabel: '1962', title: '...', images: [...] }

const yearShorts = (() => {
  let prev = null
  return historyItems.map((item) => {
    const y = item.yearLabel
    let label
    if (y === prev) label = ''
    else if (prev && y.slice(0, 2) === prev.slice(0, 2)) label = y.slice(2)
    else label = y
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
  const blockRefs = useRef([])
  const railMotionRef = useRef(null)
  const dividerRef = useRef(null)
  const metricsRef = useRef(null)

  useEffect(() => {
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
            if (part.hasAttribute('data-year-suffix')) part.style.visibility = ''
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
        moveEntryToTop(entry, entry.mediaBottom - scrollY - entry.suffixHeight)

      const finalEntry = markers.at(-1)
      const finalAnchorTop =
        finalEntry &&
        finalEntry.mediaBottom - scrollY - finalEntry.suffixHeight
      const finalEntryEnding =
        finalEntry &&
        finalEntry.mediaBottom - scrollY <= anchorTop + finalEntry.suffixHeight

      if (finalEntryEnding) {
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
      blockRefs.current.forEach((block) => {
        block
          ?.querySelectorAll(
            '[data-year-prefix], [data-year-prefix-ghost], [data-year-suffix]',
          )
          .forEach((part) => {
            part.style.transform = ''
            if (part.hasAttribute('data-year-suffix')) part.style.visibility = ''
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
    <div className={styles.timeline}>
      {/* 아래 2번, 3번 JSX를 이 안에 넣으세요. */}
    </div>
  )
}
```

## 2. Sticky 왼쪽 marker JSX

```jsx
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
```

## 3. 각 history article 안 왼쪽 연도 JSX

```jsx
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
          <span className={styles.markerPrefixGhost} data-year-prefix-ghost>
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
      {/* 오른쪽 텍스트/이미지 내용 */}
      {/* 이미지 묶음에는 반드시 data-history-media를 붙이세요. */}
      <div className={styles.media} data-history-media>
        {/* image */}
      </div>
    </div>
  </article>
))}
```

## 4. CSS

```css
.timeline {
  position: relative;
  overflow: visible;
}

.rail {
  position: relative;
  z-index: 2;
  padding-top: 1.2vw;
}

.railMotion {
  position: relative;
  width: 36.46vw;
  --history-year-gap: 1.72vw;
  will-change: transform;
  transform: translateZ(0);
}

.subtitle {
  width: 36.46vw;
  text-align: center;
  font-family: var(--font-deco);
  font-style: italic;
  font-size: 3.333333vw;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.02em;
}

.divider {
  display: block;
  width: 36.46vw;
  height: 1px;
  margin-top: var(--history-year-gap);
  background: var(--color-base-3);
}

.railPrefixLayer,
.railSuffixLayer {
  position: absolute;
  top: calc(100% + var(--history-year-gap));
  width: 2ch;
  font-family: var(--font-en);
  font-size: 100px;
  font-style: normal;
  font-weight: 450;
  line-height: 1.2;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
  z-index: 3;
}

.railPrefixLayer {
  left: calc(50% - 2ch);
  text-align: right;
}

.railSuffixLayer {
  left: 50%;
  text-align: left;
}

.railPrefixLayer span,
.railSuffixLayer span {
  position: absolute;
  top: 0;
  visibility: hidden;
}

.railPrefixLayer span {
  right: 0;
}

.railSuffixLayer span {
  left: 0;
}

.block {
  position: relative;
  display: grid;
  grid-template-columns: 36.46vw 52.08vw;
  column-gap: 4.38vw;
  align-items: start;
  padding-bottom: 12vw;
  overflow: visible;
}

.block:first-of-type {
  margin-top: 5.5vw;
}

.continued {
  margin-top: -8vw;
}

.marker {
  position: relative;
  z-index: 3;
  margin-top: -0.46em;
  text-align: center;
  font-family: var(--font-en);
  font-style: normal;
  font-weight: 450;
  font-size: 100px;
  line-height: 1.2;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

.markerFull {
  display: inline;
}

.markerSplit {
  display: none;
  overflow: visible;
  white-space: nowrap;
}

.markerPrefix,
.markerPrefixGhost,
.markerSuffix {
  display: inline-block;
}

.markerPrefix,
.markerPrefixGhost {
  min-width: 2ch;
  text-align: right;
}

.markerPrefixGhost {
  visibility: hidden;
}

.markerSuffix {
  min-width: 2ch;
  text-align: left;
  font-weight: 450;
}

.subtitle,
.divider {
  position: relative;
  z-index: 1;
}

@media (min-width: 1200px) {
  .rail {
    position: sticky;
    top: 14vh;
  }
}

@media (min-width: 1200px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .markerFull {
    display: none;
  }

  .markerSplit {
    display: inline-flex;
  }
}

@media (max-width: 1199px) {
  .railMotion,
  .subtitle,
  .divider {
    width: 100%;
  }

  .subtitle {
    font-size: clamp(24px, 5vw, 40px);
  }

  .block {
    display: block;
    padding-bottom: 16vw;
  }

  .marker {
    margin: 4vw 0 3vw;
    text-align: left;
    font-size: clamp(64px, 18vw, 120px);
  }

  .markerFull {
    display: inline;
  }

  .markerSplit {
    display: none;
  }
}
```

