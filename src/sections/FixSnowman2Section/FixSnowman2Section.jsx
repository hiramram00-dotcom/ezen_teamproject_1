import FixSnowman2Intro from './FixSnowman2Intro'
import FixSnowman2ProductScene from './FixSnowman2ProductScene'
import FixSnowman2Video from './FixSnowman2Video'

/**
 * FixSnowman2Section
 * FixSnowmanSection을 복제한 독립 작업용 섹션 (원본/팀원 작업본은 그대로 유지).
 * 내부 화면:
 *   - FixSnowman2Intro : "Meet / SNOWMAN" 타이틀 (Figma 468:657)
 *   - FixSnowman2ProductScene : 3D 눈사람 모델 + "LIGHT, MADE LOVABLE"
 */
function FixSnowman2Section() {
  return (
    <>
      <FixSnowman2Intro />
      <FixSnowman2ProductScene />
      <FixSnowman2Video />
    </>
  )
}

export default FixSnowman2Section
