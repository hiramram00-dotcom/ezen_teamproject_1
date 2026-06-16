import styles from './PurposeSection.module.css'

import videoPlaceholder from '../PhilosophySection/assets/philosophy-room.webp'
import teamImage from './assets/purpose-team.webp'

function PurposeSection() {
  return (
    <section className={styles.purpose} aria-label="일광전구의 목적">
      <div className={styles.ceoBlock}>
        <div className={styles.videoPlaceholder} role="img" aria-label="브랜드 영상 미리보기">
          <img src={videoPlaceholder} alt="" />
          <div className={styles.videoCopy}>
            <strong>We Make Light.</strong>
            <span className={styles.yearMark}>1962</span>
            <strong>by Ilkwang Lightings Presents</strong>
          </div>
          <div className={styles.videoLogos}>
            <span>1962</span>
            <strong>IK</strong>
            <strong>ILKW.</strong>
          </div>
        </div>

        <div className={styles.ceoCopy}>
          <p className={styles.ceo}>
            <span>CEO</span>
            <i />
            <strong>김홍도</strong>
          </p>
          <blockquote>“빛에는 희망의 개념도 있잖아요. 우리는 희망을 만드는 거예요.”</blockquote>
          <p className={styles.description}>
            60년 넘게 이어온 제조 기술과 빛에 대한 깊은 이해를 바탕으로,
            <br />
            일광전구의 새로운 방향성을 만들어가고 있습니다.
          </p>
        </div>
      </div>

      <div className={styles.mission}>
        <p className={styles.missionTitle}>
          우리는 <strong>세상을 이롭게 하는 빛</strong>을 만듭니다.
        </p>
        <img src={teamImage} alt="일광전구 구성원 단체 사진" />
        <p className={styles.englishCopy}>
          From a single glowing filament
          <br />
          to thoughtfully designed lighting,
          <br />
          our purpose remains the same.
        </p>
      </div>
    </section>
  )
}

export default PurposeSection
