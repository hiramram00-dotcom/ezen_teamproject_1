import { useEffect, useState } from 'react'
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
import Header from './components/Header/Header'

const getCurrentView = () => {
  if (window.location.hash === '#product/flamingo') return 'flamingo'
  if (window.location.hash === '#product') return 'product'
  return 'home'
}

function App() {
  const [view, setView] = useState(getCurrentView)

  useEffect(() => {
    const syncViewWithHistory = () => {
      const nextView = getCurrentView()
      setView(nextView)

      window.requestAnimationFrame(() => {
        if (nextView !== 'home') {
          window.scrollTo({ top: 0 })
          return
        }

        const targetId = window.location.hash.slice(1)
        document.getElementById(targetId)?.scrollIntoView()
      })
    }

    window.addEventListener('popstate', syncViewWithHistory)
    return () => window.removeEventListener('popstate', syncViewWithHistory)
  }, [])

  const openProductDetail = (product) => {
    if (product !== 'flamingo') return

    window.history.pushState(null, '', '#product/flamingo')
    setView('flamingo')
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'auto' })
    })
  }

  if (view === 'flamingo') {
    return <FlamingoDetailSection />
  }

  if (view === 'product') {
    return <ProductSection onOpenProduct={openProductDetail} />
  }

  if (window.location.pathname === '/about') {
    return <AboutPage />
  }

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

export default App
