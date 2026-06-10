/* ⚠️⚠️ 임시 PLACEHOLDER (작성: 김종욱) ⚠️⚠️
 * Hero 스크롤 전환 테스트용으로 임시로 만든 거예요.
 * Intro 섹션은 다른 팀원이 작업 중 → 이 파일은 그 작업물로 교체해야 함.
 * 충돌 방지: 실제 Intro 들어오면 이 컴포넌트 삭제하고 import만 바꾸면 됨.
 * (App.jsx 에서도 <IntroSection /> 교체 필요)
 */
import styles from './IntroSection.module.css'

function IntroSection() {
  return (
    <section className={styles.intro}>
      <h2 className={styles.title}>Intro Section</h2>
      <p className={styles.sub}>임시 placeholder — 다음 섹션 자리</p>
    </section>
  )
}

export default IntroSection
