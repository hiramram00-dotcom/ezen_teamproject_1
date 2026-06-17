import { useLayoutEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import HeroSection from './sections/HeroSection/HeroSection'
import NewIntroSection from './sections/NewIntroSection/NewIntroSection'
import MakeLightSection from './sections/MakeLightSection/MakeLightSection'
import Story2Section from './sections/Story2Section/Story2Section'
import StorySection from './sections/StorySection/StorySection'
import SpaceSection from './sections/SpaceSection/SpaceSection'
import StoryEndingSection from './sections/StoryEndingSection/StoryEndingSection'
import Snowman1Section from './sections/Snowman1Section/Snowman1Section'
import ProductSection from './sections/ProductSection/ProductSection'
import FlamingoDetailSection from './sections/FlamingoDetailSection/FlamingoDetailSection'
import SpacesSection from './sections/SpacesSection/SpacesSection'
import CollaboSection from './sections/CollaboSection/CollaboSection'
import Footer from './components/Footer/Footer'
import AboutPage from './pages/AboutPage/AboutPage'
import ShowroomPage from './pages/ShowroomPage/ShowroomPage'
import Header from './components/Header/Header'

// 라우트 바뀔 때마다 맨 위로 (엉뚱한 스크롤 위치 방지)
// useLayoutEffect = 페인트 전 / 다음 프레임에 한 번 더 = ScrollTrigger 등이 위치 복원하려는 것까지 눌러줌
function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => window.scrollTo(0, 0))
    return () => cancelAnimationFrame(id)
  }, [pathname])
  return null
}

// 메인(인덱스) 페이지 — 헤더는 인덱스 전용 동작(index)
function Home() {
  return (
    <main>
      <Header index />
      <HeroSection />
      <NewIntroSection />
      <MakeLightSection />
      <Story2Section />
      <StorySection />
      <SpaceSection />
      <StoryEndingSection />
      <Snowman1Section />
      <SpacesSection />
      {/* 고정된 Dining(ON) 위로 Collabo가 슬라이드업 */}
      <div style={{ position: 'relative', zIndex: 2, marginTop: '-100vh' }}>
        <CollaboSection />
      </div>
      <Footer />
    </main>
  );
}

// 제품 목록 → 상세 이동(라우터)
function ProductRoute() {
  const navigate = useNavigate()
  return (
    <ProductSection
      onOpenProduct={(product) => {
        if (product === 'flamingo') navigate('/product/flamingo')
      }}
    />
  )
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* 서브페이지는 전역 헤더 상시표시(index 없음). About은 자체 헤더 없어 바로 적용 */}
        <Route path="/about" element={<><Header /><AboutPage /></>} />
        <Route path="/product" element={<><Header /><ProductRoute /></>} />
        <Route path="/product/flamingo" element={<FlamingoDetailSection />} />
        <Route path="/showroom" element={<><Header /><ShowroomPage /></>} />
        {/* ⚠️ /collabo 는 아직 전용 페이지 미정(취합 전) → 임시로 홈 콜라보 섹션 단독 렌더 */}
        <Route path="/collabo" element={<><Header /><CollaboSection /></>} />
      </Routes>
    </>
  )
}

export default App
