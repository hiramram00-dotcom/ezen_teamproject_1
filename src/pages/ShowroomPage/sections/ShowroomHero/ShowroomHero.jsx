import RevealLines from '../../components/RevealLines/RevealLines'
import Reveal from '../../components/Reveal/Reveal'
import styles from './ShowroomHero.module.css'

/**
 * ShowroomHero — Our Showroom 소개문.
 * (쇼룸 비주얼·라벨·visit 카드는 PinScene으로 이동 — 이미지 pin + 카드 슬라이드업 연출)
 * Figma: 1차프로젝트-3조 / node 778:365·778:377
 */
function ShowroomHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.introWrap}>
        <Reveal as="h2" className={`${styles.heroTitle} type-subtitle-1`}>
          A House of Light
        </Reveal>
        <RevealLines
          as="p"
          className={`${styles.intro} type-body-3`}
          lines={[
            '회현동의 오래된 2층 목조 가정집을 개조한 일광전구 서울 쇼룸은 IK의 다양한 디자인 조명을 실제 생활 공간에',
            '가까운 분위기 속에서 경험할 수 있는 공간입니다. 조명에 어울리는 가구와 오브제를 함께 배치해, 제품의',
            '형태뿐 아니라 공간과 어우러졌을 때의 분위기까지 살펴볼 수 있습니다. 1962년부터 이어온 일광전구의 제조',
            '헤리티지와 오늘의 라이프스타일에 맞춰 확장된 IK의 조명 감각을 회현동의 조용한 집 안에서 만나보세요.',
          ]}
        />
      </div>
    </section>
  )
}

export default ShowroomHero
