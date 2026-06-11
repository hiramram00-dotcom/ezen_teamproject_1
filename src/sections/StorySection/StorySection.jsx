import styles from './StorySection.module.css';
import imgStoryScene from '../../assets/story/img-story-scene.png';
import imgStoryWarm from '../../assets/story/img-story-warm.png';

export default function StorySection() {
  return (
    <section className={styles.storySection}>
      <div className={styles.header}>
        <h2 className={`${styles.title} type-italic-1`}>We make Light</h2>
        <p className={`${styles.desc} type-body-3`}>
          단순히 공간을 밝히는 것을 넘어,<br />
          그 공간이 가진 분위기와 감정을 완성합니다.
        </p>
      </div>

      <div className={styles.imageGrid}>
        <div className={styles.imageCard}>
          <img src={imgStoryScene} alt="빛이 번지는 장면" className={styles.imgScene} />
        </div>
        <div className={styles.imageCard}>
          <img src={imgStoryWarm} alt="온기 어린 공간" className={styles.imgWarm} />
        </div>
      </div>

      <div className={styles.footer}>
        <span className="type-italic-3">Better Life</span>
        <div className={styles.line}></div>
        <span className="type-italic-3">Better Light</span>
      </div>
    </section>
  );
}
