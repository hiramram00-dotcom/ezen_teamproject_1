import HeroSection from './sections/HeroSection/HeroSection'
import IntroSection from './sections/IntroSection/IntroSection'
import StorySection from './sections/StorySection/StorySection'
import SpaceSection from './sections/SpaceSection/SpaceSection'
import StoryEndingSection from './sections/StoryEndingSection/StoryEndingSection'
import Snowman1Section from './sections/Snowman1Section/Snowman1Section'
import SnowmanSection2 from './sections/SnowmanSection2/SnowmanSection2'
import CollaboSection from './sections/CollaboSection/CollaboSection'

function App() {
  return (
    <main>      
      <HeroSection />
      <IntroSection />
      <StorySection />
      <SpaceSection />
      <StoryEndingSection />
      <Snowman1Section />
      <SnowmanSection2 />
    <CollaboSection />
      {/* 다음 섹션들 순서대로 추가: Story, Snowman, Space, Collabo, Footer */}
    </main>
  )
}


export default App
