import { useLayoutEffect } from 'react'
import ShowroomHero from './sections/ShowroomHero/ShowroomHero'
import PinScene from './sections/PinScene/PinScene'
import BeyondSection from './sections/BeyondSection/BeyondSection'
import NewFooter from '../../components/Footer/NewFooter'
import styles from './ShowroomPage.module.css'

/**
 * ShowroomPage (서브페이지 — Figma "showroom")
 * 일광전구 서울 쇼룸 소개 페이지. 라우터 도입 전까지 main.jsx의 #showroom 해시로 미리보기.
 * Figma: 1차프로젝트-3조 / "디자인 최종본" page · node 778:451(showroom)
 *
 * 구성: Hero(헤더·소개) → PinScene(이미지 pin + 카드 슬라이드업) → Beyond the Room → NewFooter
 */
function ShowroomPage() {
  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    const scrollToTop = () => window.scrollTo(0, 0)
    scrollToTop()
    window.addEventListener('pageshow', scrollToTop)

    return () => {
      window.removeEventListener('pageshow', scrollToTop)
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  return (
    <main className={styles.page}>
      <ShowroomHero />
      <PinScene />
      <BeyondSection />
      <NewFooter />
    </main>
  )
}

export default ShowroomPage
