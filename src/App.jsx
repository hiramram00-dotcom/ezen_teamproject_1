import HeroSection from './sections/HeroSection/HeroSection'
// ⚠️ 임시: IntroSection은 placeholder(김종욱 제작). 다른 팀원 작업물로 교체 필요.
import IntroSection from './sections/IntroSection/IntroSection'

function App() {
  return (
    <>
      <HeroSection />
      {/* ⚠️ 임시 placeholder — 실제 Intro 섹션으로 교체할 것 */}
      <IntroSection />
      {/* 다음 섹션들 순서대로 추가: Story, Snowman, Space, Collabo, Footer */}
    </>
  )
}

export default App
