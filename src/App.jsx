import { useLayoutEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import HeroSection from './sections/HeroSection/HeroSection'
import NewIntroSectionNew from './sections/NewIntroSection_new/NewIntroSection_new'
import MakeLightSection from './sections/MakeLightSection/MakeLightSection'
import StorySection from './sections/StorySection/StorySection'
import SpaceMiddleSection from './sections/SpaceMiddleSection/SpaceMiddleSection'
import StoryEndingSection from './sections/StoryEndingSection/StoryEndingSection'
import FixSnowman2Section from './sections/FixSnowman2Section/FixSnowman2Section'
import FixStorySection from './sections/FixStorySection/FixStorySection'
import ProductSection from './sections/ProductSection/ProductSection'
import FlamingoDetailSection from './sections/FlamingoDetailSection/FlamingoDetailSection'
import SpacesSection from './sections/SpacesSection/SpacesSection'
import CollaboSection from './sections/CollaboSection/CollaboSection'
import CollaboLandingSection from './sections/CollaboLandingSection/CollaboLandingSection'
import CollaboGallerySection from './sections/CollaboGallerySection/CollaboGallerySection'
import collaboFooterPhoto from './sections/CollaboGallerySection/assets/collabo-footer.jpg'
import CollaboDetailSection from './sections/CollaboDetailSection/CollaboDetailSection'
import CollaboDetailContentSection from './sections/CollaboDetailSection/CollaboDetailContentSection'
import kbpCollabo from './sections/CollaboDetailSection/collabos/kbp'
import kakaoCollabo from './sections/CollaboDetailSection/collabos/kakao'
import Footer from './components/Footer/Footer'
import AboutPage from './pages/AboutPage/AboutPage'
import ShowroomPage from './pages/ShowroomPage/ShowroomPage'
import Header from './components/Header/Header'
import LightCursor from './components/LightCursor/LightCursor'
import ResizeAnchor from './components/ResizeAnchor/ResizeAnchor'
import ScrollTopButton from './components/ScrollTopButton/ScrollTopButton'

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

// 전역 "맨 위로" 버튼 (스크롤에 따라 자동 노출)
function GlobalTopButton() {
  return <ScrollTopButton />
}

// 메인(인덱스) 페이지 — 헤더는 인덱스 전용 동작(index)
function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <NewIntroSectionNew />
      <MakeLightSection />
      <StorySection />
      <SpaceMiddleSection />
      <StoryEndingSection />
      <FixSnowman2Section />
      <SpacesSection />
      {/* 고정된 Dining(ON) 위로 Collabo가 슬라이드업 (한 번만 렌더) */}
      <div className="collaboOverlap">
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
      <LightCursor />
      <ScrollToTop />
      <ResizeAnchor />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* 서브페이지는 전역 헤더 상시표시(index 없음). About은 자체 헤더 없어 바로 적용 */}
        <Route path="/about" element={<><Header /><AboutPage /></>} />
        <Route path="/product" element={<><Header /><ProductRoute /></>} />
        <Route
          path="/product/flamingo"
          element={
            <>
              <FlamingoDetailSection />
              <Footer hidePhoto />
            </>
          }
        />
        <Route path="/showroom" element={<><Header /><ShowroomPage /></>} />
        {/* 메뉴 COLLABO → 콜라보 랜딩(ILKW × 브랜드 룰렛). Figma 1565:194 */}
        <Route path="/collabo" element={<><Header /><CollaboLandingSection /></>} />
        {/* 콜라보 컬렉션 목록(룰렛 다음 화면). Figma 1565:270 */}
        <Route
          path="/collabo/list"
          element={
            <>
              <Header />
              <CollaboGallerySection />
              <Footer
                photo={collaboFooterPhoto}
                photoPosition="center 15%"
                headingLines={['IF YOU HAVE AN IDEA FOR A COLLABORATION,', "WE'D LOVE TO HEAR FROM YOU."]}
                contact={{ lines: ['Please', 'Contact us'], href: 'mailto:info@ilkwdesign.com' }}
                email="INFO@ILKWDESIGN.COM"
                emailHref="mailto:info@ilkwdesign.com"
              />
            </>
          }
        />
        {/* 콜라보 상세 — 히어로 + 스크롤 시 본문 + 푸터(사진 없이). 데이터만 갈아끼움 */}
        <Route
          path="/collabo-detail"
          element={
            <>
              <Header />
              <CollaboDetailSection {...kbpCollabo.hero} />
              <CollaboDetailContentSection {...kbpCollabo.content} />
              <Footer hidePhoto />
            </>
          }
        />
        <Route
          path="/collabo-detail/kakao"
          element={
            <>
              <Header />
              <CollaboDetailSection {...kakaoCollabo.hero} />
              <CollaboDetailContentSection {...kakaoCollabo.content} />
              <Footer hidePhoto />
            </>
          }
        />
        {/* 작업용 미리보기 — FixStorySection 단독 확인용 (이전 섹션 포함) */}
        <Route path="/fixstory" element={<><Header /><NewIntroSectionNew /><FixStorySection /></>} />

        {/* 작업용 미리보기 — FixSnowman2Section 단독 확인용, 메인 페이지에는 미연결 */}
        <Route path="/fixsnowman2" element={<><Header /><FixSnowman2Section /></>} />
      </Routes>
      <GlobalTopButton />
    </>
  )
}

export default App
