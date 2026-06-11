import { useEffect, useRef } from 'react'

/* 화면 진입 시 자동재생 영상 — 스크롤을 잠그거나 점프하지 않음.
 * 불꽃·촛불처럼 스스로 역동적으로 움직이는 영상에 적합(스크럽 X).
 *
 * props:
 *  - src: 영상 경로 (import한 mp4 URL)
 *  - active: true면 재생, false면 정지+처음으로 되감기
 *  - className: 스타일 클래스 (레이아웃/크기)
 */
function VideoOnEnter({ src, active, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (active) {
      v.play().catch(() => {}) // muted 영상이라 자동재생 허용. 정책 거부 시 무시
    } else {
      v.pause()
      v.currentTime = 0 // 구간 벗어나면 처음으로 → 다시 들어오면 처음부터 재생
    }
  }, [active])

  return (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      preload="auto"
      className={className}
      aria-hidden="true"
    />
  )
}

export default VideoOnEnter
