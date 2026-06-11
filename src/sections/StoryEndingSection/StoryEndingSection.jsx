import styles from './StoryEndingSection.module.css';

export default function StoryEndingSection() {
  return (
    <section className={styles.endingSection}>
      <div className={styles.container}>
        <div className={styles.textBlock1}>
          <p>60년이 넘는 시간 동안 우리는 오직 하나,</p>
          <p>
            <span className={styles.semiBold}>‘빛의 본질’</span>
            <span>에 몰두해 왔습니다.</span>
          </p>
        </div>
        
        <div className={styles.textBlock2}>
          <p>사람과 공간이</p>
          <p>
            <span className={styles.semiBold}>‘가장 자연스럽게 연결되는 순간’</span>
            <span>을 위해.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
