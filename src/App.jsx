import styles from './App.module.css'

function App() {
  return (
    <main className={styles.welcome}>
      <p className={styles.kicker}>ILKW · TEAM PROJECT</p>
      <h1 className={styles.title}>
        We make <span className={styles.glow}>Light.</span>
      </h1>
      <p className={styles.desc}>
        프로젝트 기본 세팅 완료 ✅<br />
        각자 <code>feature/섹션명</code> 브랜치를 따서 작업을 시작하세요.
      </p>
    </main>
  )
}

export default App
