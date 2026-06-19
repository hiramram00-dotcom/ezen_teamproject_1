import { useEffect } from 'react'

// 창 가로 크기를 조절할 때 보고 있던 콘텐츠가 위/아래로 튀지 않도록 하는 스크롤 앵커.
// - 스크롤할 때마다 화면 상단(33% 지점) 근처의 기준 요소와 그 위치를 기억해 둔다.
// - 리사이즈로 레이아웃이 바뀌면(이미지 height:92vw, clamp 폰트, 데스크톱↔태블릿 전환 등),
//   리플로우 후 그 기준 요소가 같은 화면 위치에 오도록 scrollBy로 보정한다.
// 브라우저 기본 overflow-anchor가 sticky/transform 스크롤 연동 섹션에서 잘 동작하지 않아 직접 처리.
export default function ResizeAnchor() {
  useEffect(() => {
    let anchorEl = null
    let anchorTop = 0
    let scrollRaf = 0
    let resizeRaf = 0

    const probeY = () => Math.round(window.innerHeight * 0.33)

    const capture = () => {
      const el = document.elementFromPoint(
        Math.round(window.innerWidth / 2),
        probeY(),
      )
      if (el) {
        anchorEl = el
        anchorTop = el.getBoundingClientRect().top
      }
    }

    const onScroll = () => {
      if (scrollRaf) return
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0
        capture()
      })
    }

    const onResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0
        if (anchorEl && anchorEl.isConnected) {
          const delta = anchorEl.getBoundingClientRect().top - anchorTop
          if (Math.abs(delta) > 0.5) window.scrollBy(0, delta)
        }
        capture() // 보정 후 기준 갱신 (연속 드래그 중 드리프트 방지)
      })
    }

    capture()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
      if (resizeRaf) cancelAnimationFrame(resizeRaf)
    }
  }, [])

  return null
}
