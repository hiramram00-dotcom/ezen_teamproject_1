import SnowmanIntro from './SnowmanIntro'
import SnowmanVideo from './SnowmanVideo'

/**
 * Snowman1Section
 * 스노우맨 제품 시퀀스 (도입부 + 영상 축소 연출)을 하나로 묶은 섹션.
 * 내부 화면:
 *   - SnowmanIntro : "Meet / SNOWMAN" 타이틀 (Figma 468:657)
 *   - SnowmanVideo : 영상 카드↔풀스크린 스크롤 연출 (Figma 468:701 ↔ 468:673)
 */
function Snowman1Section() {
  return (
    <>
      <SnowmanIntro />
      <SnowmanVideo />
    </>
  )
}

export default Snowman1Section
