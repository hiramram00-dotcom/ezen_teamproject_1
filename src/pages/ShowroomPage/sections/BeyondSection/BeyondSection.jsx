import gallery01 from './assets/showroom-gallery-01.webp'
import gallery02 from './assets/showroom-gallery-02.webp'
import gallery03 from './assets/showroom-gallery-03.webp'
import gallery04 from './assets/showroom-gallery-04.webp'
import exterior from './assets/showroom-beyond-exterior.webp'
import interiorLg from './assets/showroom-beyond-01.webp'
import interiorSm from './assets/showroom-beyond-02.webp'
import interiorSm2 from './assets/showroom-beyond-03.webp'
import interiorLg2 from './assets/showroom-beyond-04.webp'
import Reveal from '../../components/Reveal/Reveal'
import RevealLines from '../../components/RevealLines/RevealLines'
import Parallax from '../../components/Parallax/Parallax'
import RevealImage from '../../components/RevealImage/RevealImage'
import styles from './BeyondSection.module.css'

/**
 * BeyondSection — Beyond the Room
 * 좌측 고정 텍스트 + 우측 사진 4장(세로 흐름), 이어서 검정 풀스크린 블록
 * (외관 풀폭 사진 + 우측정렬 설명문 + 인테리어 2장).
 * Figma: 1차프로젝트-3조 / node 778:415~778:429
 */
function BeyondSection() {
  return (
    <section className={styles.beyond}>
      {/* 갤러리: 좌측 텍스트(sticky) + 우측 사진 스택 */}
      <div className={styles.gallery}>
        <div className={styles.galleryText}>
          <Reveal as="h2" className={`${styles.title} type-subtitle-1`}>Beyond the Room</Reveal>
          <div className={`${styles.desc} type-body-4`}>
            <RevealLines
              as="p"
              lines={[
                '오래된 목조 구조가 남아 있는 실내와',
                '붉은 기와지붕 너머로 보이는 창,',
                '식물과 조명이 함께 놓인 테라스까지.',
              ]}
            />
            <RevealLines
              as="p"
              startDelay={330}
              lines={[
                '일광전구 서울 쇼룸은',
                '집 안과 밖의 장면을 따라',
                '빛이 공간에 머무는 방식을 보여줍니다.',
              ]}
            />
          </div>
        </div>

        <div className={styles.galleryImages}>
          <img
            className={styles.galleryFirstImage}
            src={gallery01}
            alt="쇼룸 공간 1"
            loading="lazy"
          />
          <img src={gallery02} alt="쇼룸 공간 2" loading="lazy" />
          <img
            className={styles.galleryThirdImage}
            src={gallery03}
            alt="쇼룸 공간 3"
            loading="lazy"
          />
          <img src={gallery04} alt="쇼룸 공간 4" loading="lazy" />
        </div>
      </div>

      {/* 검정 풀스크린 블록 */}
      <div className={styles.dark}>
        <Parallax className={styles.darkExterior} src={exterior} alt="일광전구 서울 쇼룸 외관" loading="lazy" />

        <div className={styles.darkTextWrap}>
          <Reveal as="h2" className={`${styles.darkTitle} type-subtitle-1`}>Experience Light</Reveal>
          <RevealLines
            as="p"
            className={`${styles.darkText} type-collabo-x`}
            collapseToFlow
            lines={[
              '일광전구 서울 쇼룸은 제품을 진열하는 매장을 넘어, 빛이 실제 공간 안에서 어떻게 작동하는지',
              '보여주는 브랜드 하우스입니다. 벽의 색, 가구의 재질, 테이블의 높이, 창밖에서 들어오는 자연광과',
              '함께 하나의 분위기를 만들어냅니다. 이곳에서는 조명을 고르는 일이 단순한 구매가 아니라,',
              '내 공간에 어울리는 빛을 상상하는 경험이 됩니다.',
            ]}
          />
        </div>

        <div className={styles.darkPhotos}>
          {/* 좌측(작은) — 우측보다 늦게 시작 */}
          <RevealImage className={styles.darkPhotoSm} src={interiorSm} alt="쇼룸 인테리어 1" loading="lazy" delay={350} />
          {/* 우측(큰) — 먼저 시작 */}
          <RevealImage className={styles.darkPhotoLg} src={interiorLg} alt="쇼룸 인테리어 2" loading="lazy" delay={0} />
        </div>

        {/* 동일 레이아웃, 텍스트만 좌측정렬 */}
        <div className={`${styles.darkTextWrap} ${styles.darkTextWrapLeft}`}>
          <Reveal as="h2" className={`${styles.darkTitle} type-subtitle-1`}>Light, Up Close</Reveal>
          <RevealLines
            as="p"
            className={`${styles.darkText} type-collabo-x`}
            collapseToFlow
            lines={[
              '멀리서 보던 조명을 가까이서 만지고, 켜고, 비교해 볼 수 있는 곳.',
              '같은 제품도 공간과 각도에 따라 전혀 다른 빛을 보여줍니다.',
              '일광전구 서울 쇼룸은 그 차이를 가장 정직하게 보여주는 자리이며,',
              '선택의 기준이 되어줍니다.',
            ]}
          />
        </div>

        <div className={`${styles.darkPhotos} ${styles.darkPhotosLeft}`}>
          {/* 좌측(큰) — 먼저 시작 */}
          <RevealImage className={styles.darkPhotoLg} src={interiorSm2} alt="쇼룸 인테리어 3" loading="lazy" delay={0} />
          {/* 우측(작은) — 좌측보다 늦게 시작 */}
          <RevealImage className={styles.darkPhotoSm} src={interiorLg2} alt="쇼룸 인테리어 4" loading="lazy" delay={350} />
        </div>
      </div>
    </section>
  )
}

export default BeyondSection
