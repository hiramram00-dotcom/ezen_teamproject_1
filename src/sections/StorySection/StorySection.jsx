import { useRef, useEffect } from 'react';
import styles from './StorySection.module.css';
import imgStoryScene from '../../../img/400.png';
import imgStoryWarm from '../../../img/300.png';

export default function StorySection() {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    // GSAP ScrollTrigger 대신 IntersectionObserver 사용
    // — Story2Section의 GSAP pin이 만드는 spacer 때문에
    //   ScrollTrigger의 좌표 계산이 어긋나는 문제를 원천 차단
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add(styles.isVisibleTriggered);
        } else {
          section.classList.remove(styles.isVisibleTriggered);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="story-section-wrapper" ref={containerRef} style={{ height: '250vh', position: 'relative' }}>
      <section
        className={styles.storySection}
        ref={sectionRef}
        style={{ position: 'sticky', top: 0, height: '100vh' }}
      >
        <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.titleRegular}>We Make</span>
          <span className={styles.titleItalic}> Light</span>
        </h2>
        <p className={styles.desc}>
          단순히 공간을 밝히는 것을 넘어,<br />
          그 공간이 가진 분위기와 감정을 완성합니다.
        </p>
      </div>

      <div className={styles.imageGrid}>
        <div className={styles.imageCard}>
          <div className={styles.imageRevealMask}>
            <img src={imgStoryScene} alt="빛이 번지는 장면" className={styles.imgScene} />
          </div>
          <div className={styles.gradientOverlay}></div>
        </div>
        <div className={styles.imageCard}>
          <div className={`${styles.imageRevealMask} ${styles.delay2}`}>
            <img src={imgStoryWarm} alt="온기 어린 공간" className={styles.imgWarm} />
          </div>
          <div className={styles.gradientOverlay}></div>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={`type-italic-3 ${styles.footerTextLeft}`}>Better Life</span>
        <div className={styles.line}></div>
        <span className={`type-italic-3 ${styles.footerTextRight}`}>Better Light</span>
      </div>
    </section>
    </div>
  );
}

// EOF
