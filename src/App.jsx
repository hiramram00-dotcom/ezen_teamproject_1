import { useLayoutEffect, useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ===== 인덱스(Home) 첫 화면에 필요 — 정적 임포트 =====
import HeroSection from './sections/HeroSection/HeroSection'
import NewIntroSectionNew from './sections/NewIntroSection_new/NewIntroSection_new'
import MakeLightSection from './sections/MakeLightSection/MakeLightSection'
import StorySection from './sections/StorySection/StorySection'
import SpaceMiddleSection from './sections/SpaceMiddleSection/SpaceMiddleSection'
import StoryEndingSection from './sections/StoryEndingSection/StoryEndingSection'
import SpacesSection from './sections/SpacesSection/SpacesSection'
import CollaboSection from './sections/CollaboSection/CollaboSection'
import Footer from './components/Footer/Footer'
import NewFooter from './components/Footer/NewFooter'
import Header from './components/Header/Header'
import LightCursor from './components/LightCursor/LightCursor'
import ResizeAnchor from './components/ResizeAnchor/ResizeAnchor'
import ScrollTopButton from './components/ScrollTopButton/ScrollTopButton'
import kbpCollabo from './sections/CollaboDetailSection/collabos/kbp'
import kakaoCollabo from './sections/CollaboDetailSection/collabos/kakao'

// ===== 코드 스플리팅 — 첫 화면에 불필요한 무거운 코드는 지연로드(번들 분리) =====
// FixSnowman2 = Three.js(3D 눈사람) 포함 → 인덱스 초기 번들에서 제외 → 첫 로딩/LCP 단축
const FixSnowman2Section = lazy(() => import('./sections/FixSnowman2Section/FixSnowman2Section'))
// 서브페이지 — 해당 경로로 이동할 때만 로드
const AboutPage = lazy(() => import('./pages/AboutPage/AboutPage'))
const ShowroomPage = lazy(() => import('./pages/ShowroomPage/ShowroomPage'))
const ProductSection = lazy(() => import('./sections/ProductSection/ProductSection'))
const FlamingoDetailSection = lazy(() => import('./sections/FlamingoDetailSection/FlamingoDetailSection'))
const CollaboLandingSection = lazy(() => import('./sections/CollaboLandingSection/CollaboLandingSection'))
const CollaboGallerySection = lazy(() => import('./sections/CollaboGallerySection/CollaboGallerySection'))
const CollaboContactSection = lazy(() => import('./sections/CollaboContactSection/CollaboContactSection'))
const CollaboDetailSection = lazy(() => import('./sections/CollaboDetailSection/CollaboDetailSection'))
const CollaboDetailContentSection = lazy(() => import('./sections/CollaboDetailSection/CollaboDetailContentSection'))
const FixStorySection = lazy(() => import('./sections/FixStorySection/FixStorySection'))

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

// 지연로드된 섹션이 DOM에 붙어 페이지 높이가 바뀐 뒤 ScrollTrigger 위치 재계산.
// (Suspense 내부에 두어 실제 청크 로드 완료 후에만 마운트 → 그때 refresh 실행)
function RefreshOnMount() {
  useEffect(() => {
    ScrollTrigger.refresh()
  }, [])
  return null
}

// FixSnowman2(3D) 지연로드 래퍼 — 로딩 중 자리 차지용 placeholder로 레이아웃 붕괴 방지
function LazyFixSnowman2() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-hidden="true" />}>
      <FixSnowman2Section />
      <RefreshOnMount />
    </Suspense>
  )
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
      <LazyFixSnowman2 />
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
      <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* 서브페이지는 전역 헤더 상시표시(index 없음). About은 자체 헤더 없어 바로 적용 */}
        <Route path="/about" element={<><Header /><AboutPage /></>} />
        <Route path="/product" element={<><Header /><ProductRoute /></>} />
        <Route
          path="/product/flamingo"
          element={
            <>
              <Header />
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
              <CollaboContactSection />
              {/* 푸터 위 사진+카드 섹션 제거 → 크림 푸터 본문만 */}
              <Footer hidePhoto />
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

        {/* 작업용 미리보기 — NewFooter 단독 확인용 */}
        <Route path="/newfooter" element={<NewFooter />} />
      </Routes>
      </Suspense>
      <GlobalTopButton />
    </>
  )
}

export default App
