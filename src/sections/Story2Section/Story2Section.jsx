import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Story2Section.module.css';

// 루트 디렉토리의 img 폴더에서 500.png를 불러옵니다.
import bgImg from '../../../img/500.png';

gsap.registerPlugin(ScrollTrigger);

export default function Story2Section() {
  const sectionRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const bgImageRef = useRef(null);
  const titleRef = useRef(null);
  const lightRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx = gsap.context(() => {
      console.log("Story2Section GSAP starting - Pinned Cinematic Expand");

      // 1. 배경 시네마틱 확장 타임라인 (스크롤 동기화 & 화면 고정)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top', 
          end: '+=500%',    // 전체 스크롤 길이를 5배(500%)로 늘려 훨씬 여유로운 호흡으로 변경
          scrub: 1,         
          pin: true,        
        }
      });

      // 화면이 고정된 상태에서 스크롤을 내리면 액자가 서서히 100% 꽉 차게 확장됨
      tl.fromTo(imageWrapperRef.current, {
        clipPath: 'inset(15% 20% 15% 20% round 30px)'
      }, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        ease: 'power1.inOut',
        duration: 1
      }, 0);

      tl.fromTo(bgImageRef.current, {
        scale: 1.15
      }, {
        scale: 1,
        ease: 'power1.inOut',
        duration: 1
      }, 0);

      // 2. 텍스트 마스킹 슬라이드업 (타임라인의 중간 지점에서 스크롤 연동으로 나타남)
      tl.fromTo([titleRef.current, descRef.current], {
        yPercent: 120
      }, {
        yPercent: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power1.out'
      }, 0.4); 

      // 3. LIGHT 텍스트 은은한 글로우 (서서히 켜짐)
      tl.fromTo(lightRef.current, {
        textShadow: '0 0 0px rgba(255, 255, 255, 0)',
      }, {
        textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4)',
        duration: 0.5,
        ease: 'sine.inOut',
      }, 0.7); 

      // 4. LIGHT 텍스트 은은하게 다시 꺼짐 (숨쉬는 듯한 호흡 연출)
      tl.to(lightRef.current, {
        textShadow: '0 0 0px rgba(255, 255, 255, 0)',
        duration: 0.6,
        ease: 'sine.inOut',
      }, 1.3); // 1.3 지점에서 서서히 꺼지기 시작

      // 5. 애니메이션 완료 후 텍스트를 여유롭게 읽을 수 있도록 '머무르는 시간(Dwell Time)' 유지
      tl.to({}, { duration: 1.5 }, 1.0); // 1.0부터 2.5까지 스크롤 여백

      // 6. 다음 섹션으로 넘어가기 직전, 아주 천천히 암전되며(Fade out) 우아하게 꺼짐
      tl.to([imageWrapperRef.current, titleRef.current, descRef.current], {
        opacity: 0,
        duration: 1.5,
        ease: 'power1.inOut'
      }, 2.5); // 2.5부터 4.0까지 서서히 암전

      // 7. 완전히 까맣게 꺼진 상태에서 바로 넘어가지 않고 잠시 대기하는 '시간차(Black Dwell Time)' 추가
      tl.to({}, { duration: 1.0 }, 4.0); // 4.0부터 5.0까지 텅 빈 까만 화면 유지
    }, sectionRef);

    return () => {
      // 컴포넌트 언마운트 시 GSAP 관련 모든 상태와 핀(Pin)을 깔끔하게 제거
      ctx.revert();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={styles.story2Section} 
      aria-label="브랜드 철학"
    >
      {/* 배경 이미지 및 그라데이션 오버레이 */}
      <div className={styles.imageWrapper} ref={imageWrapperRef} aria-hidden="true">
        <img src={bgImg} alt="" className={styles.backgroundImage} ref={bgImageRef} />
        <div className={styles.gradientOverlay} />
      </div>

      {/* 텍스트 콘텐츠 (1920px 기준 중앙 정렬) */}
      <div className={styles.content}>
        <div className={styles.titleWrapper}>
          <p className={styles.title} ref={titleRef}>
            <span className={styles.titleNormal}>We Make </span>
            <span className={styles.titleLight} ref={lightRef}>LIGHT</span>
            <span className={styles.titleNormal}>,</span>
            <span className={styles.titleNormal}> ILKW.</span>
          </p>
        </div>
        
        <div className={styles.descWrapper}>
          <p className={styles.description} ref={descRef}>
            우리는 빛이 머무는 모든 순간을 생각합니다.<br />
            사람과 공간을 위한 더 나은 빛, 그것이 일광전구가 만드는 가치입니다.
          </p>
        </div>
      </div>
    </section>
  );
}
