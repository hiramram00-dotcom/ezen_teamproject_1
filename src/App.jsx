import { useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import HeroSection from './sections/HeroSection/HeroSection'
import NewIntroSection from './sections/NewIntroSection/NewIntroSection'
import Story2Section from './sections/Story2Section/Story2Section'
import StorySection from './sections/StorySection/StorySection'
import SpaceSection from './sections/SpaceSection/SpaceSection'
import StoryEndingSection from './sections/StoryEndingSection/StoryEndingSection'
import Snowman1Section from './sections/Snowman1Section/Snowman1Section'
import SnowmanSection2 from './sections/SnowmanSection2/SnowmanSection2'
import ProductSection from './sections/ProductSection/ProductSection'
import FlamingoDetailSection from './sections/FlamingoDetailSection/FlamingoDetailSection'
import SpacesSection from './sections/SpacesSection/SpacesSection'
import CollaboSection from './sections/CollaboSection/CollaboSection'
import Footer from './components/Footer/Footer'
import AboutPage from './pages/AboutPage/AboutPage'
import ShowroomPage from './pages/ShowroomPage/ShowroomPage'
import Header from './components/Header/Header'

// 라우트 바뀔 때마다 맨 위로 (엉뚱한 스크롤 위치 방지)
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
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
      <Story2Section />
      <StorySection />
      <SpaceSection />
      <StoryEndingSection />
      <Snowman1Section />
      <SnowmanSection2 />
      <SpacesSection />
      <CollaboSection />
      <Footer />
    </main>
  )
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
        <Route path="/about" element={<AboutPage />} />
        <Route path="/product" element={<ProductRoute />} />
        <Route path="/product/flamingo" element={<FlamingoDetailSection />} />
        <Route path="/showroom" element={<ShowroomPage />} />
        {/* ⚠️ /collabo 는 아직 전용 페이지 미정(취합 전) → 임시로 홈 콜라보 섹션 단독 렌더 */}
        <Route path="/collabo" element={<CollaboSection />} />
      </Routes>
    </>
  )
}

export default App
