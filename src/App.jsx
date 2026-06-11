import HeroSection from './sections/HeroSection/HeroSection'
import IntroSection from './sections/IntroSection/IntroSection'
import Snowman1Section from './sections/Snowman1Section/Snowman1Section'
import SnowmanSection2 from './sections/SnowmanSection2/SnowmanSection2'

function App() {
  return (
    <main>
      <HeroSection />
      <IntroSection />
      {/* {story 섹션 추가} */}
      <Snowman1Section />
      <SnowmanSection2 />
      {/* 다음 섹션들 순서대로 추가: Story, Snowman, Space, Collabo, Footer */}
    </main>
  )
}

export default App
