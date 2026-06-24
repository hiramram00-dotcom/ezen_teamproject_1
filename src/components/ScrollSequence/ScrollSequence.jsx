import { useEffect, useRef } from 'react'

/* 이미지 시퀀스 스크럽 — 스크롤 진행도(progress 0~1)에 따라 프레임을 canvas에 그림.
 * 끊김 없음(이미지라 디코딩 X). 프레임은 마운트 시 전부 프리로드.
 *
 * props:
 *  - dir: 프레임 폴더 경로 (예: '/intro/intro1')
 *  - count: 프레임 수
 *  - pad: 파일명 zero-padding 자릿수 (기본 3 → frame-001.jpg)
 *  - ext: 확장자 (기본 'jpg')
 *  - progress: 0~1 (이 구간 안에서 첫 프레임 → 마지막 프레임)
 *  - className: canvas 스타일 클래스
 */
function ScrollSequence({ dir, count, pad = 3, ext = 'jpg', progress = 0, className = '' }) {
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const progressRef = useRef(progress)

  // 프레임 프리로드 (1회)
  function draw(p) {
    const c = canvasRef.current
    const imgs = imagesRef.current
    if (!c || !imgs.length) return
    const idx = Math.min(count - 1, Math.max(0, Math.round(p * (count - 1))))
    const img = imgs[idx]
    if (!img || !img.complete || !img.naturalWidth) return
    const ctx = c.getContext('2d')
    ctx.drawImage(img, 0, 0, c.width, c.height)
  }

  useEffect(() => {
    const imgs = []
    for (let i = 1; i <= count; i++) {
      const img = new Image()
      img.src = `${dir}/frame-${String(i).padStart(pad, '0')}.${ext}`
      imgs[i - 1] = img
    }
    imagesRef.current = imgs

    // 첫 프레임 로드되면 캔버스 크기 맞추고 그리기
    if (imgs[0]) {
      imgs[0].onload = () => {
        const c = canvasRef.current
        if (!c) return
        c.width = imgs[0].naturalWidth
        c.height = imgs[0].naturalHeight
        draw(progressRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dir, count, pad, ext])

  // progress 바뀔 때마다 해당 프레임 그리기
  useEffect(() => {
    progressRef.current = progress
    draw(progress)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}

export default ScrollSequence
