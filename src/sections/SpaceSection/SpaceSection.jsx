import { useState, useEffect, useRef } from 'react';
import styles from './SpaceSection.module.css';

import imgSpace02 from '../../../img/2.png';
import imgSpace04 from '../../../img/4.png';
import imgSpace05 from '../../assets/space/img-space-05.png';
import imgSpace06 from '../../assets/space/img-space-06.png';
import imgSpace07 from '../../assets/space/img-space-07.png';
import imgSpace08 from '../../assets/space/img-space-08.gif';

import spaceImg1 from '../../../img/100.png';
import spaceImg12 from '../../../img/15.png';
import spaceImg14 from '../../../img/14.png';
import spaceImg16 from '../../../img/8.png';
import spaceImg19 from '../../../img/6.png';
import imgGif from '../../../img/download.gif';
import ilkwLogo from '../../assets/common/logo/ilkw.svg';

const stepsData = [
  { word: "Spaces", sub: "모든 공간에는, 그에 어울리는 빛이 있습니다." },
  { word: "Moments", sub: "빛은 머무는 순간을 특별하게 만듭니다." },
  { word: "Warmth", sub: "빛이 머문 자리에, 온기가 남습니다." },
  { word: "Memories", sub: "좋은 빛은 그 자리를 오래 기억하게 합니다." },
  { word: "Atmospheres", sub: "빛은 공간의 공기를 바꿉니다." }
];

export default function SpaceSection() {
  const sectionRef = useRef(null);
  const textBoxRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealedImages, setRevealedImages] = useState({});
  const [scale, setScale] = useState(1);
  const [textHeight, setTextHeight] = useState(0);
  const [candleActive, setCandleActive] = useState(false);
  const [litBulbs, setLitBulbs] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const clientWidth = document.documentElement.clientWidth;
      setScale(clientWidth < 1920 ? clientWidth / 1920 : 1);
      if (textBoxRef.current) {
        setTextHeight(textBoxRef.current.offsetHeight);
      }
    };
    handleResize();
    setTimeout(handleResize, 100); // Recalculate after font load
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollY = -rect.top; 
      const sectionHeight = rect.height - window.innerHeight;
      
      const stickOffset = window.innerHeight * 0.45;
      const stickStart = (1447 * scale) - stickOffset;

      if (textBoxRef.current) {
        const textRect = textBoxRef.current.getBoundingClientRect();
        // 텍스트 박스 요소 자체가 뷰포트 하단(화면)에 진입하는 즉시 애니메이션을 시작합니다.
        if (textRect.top < window.innerHeight) {
          setIsRevealed(true);
        } else {
          setIsRevealed(false);
        }
      }

      // Check visibility dynamically based on actual DOM position
      setRevealedImages(prev => {
        const next = { ...prev };
        let changed = false;
        const triggerY = window.innerHeight * 0.85; // Reveal when image top hits 85% of screen
        
        const keys = ['img1', 'img2', 'img3', 'img4', 'img5', 'img6', 'img7', 'img8'];
        for (const key of keys) {
          const el = document.getElementById(key);
          if (el) {
            const elRect = el.getBoundingClientRect();
            const isVisible = elRect.top < triggerY;
            if (next[key] !== isVisible) {
              next[key] = isVisible;
              changed = true;
            }
          }
        }
        return changed ? next : prev;
      });

      // 촛불 시퀀스 트리거 (스크롤 오르내릴 때 재설정되도록)
      const img7El = document.getElementById('img7');
      if (img7El) {
        const img7Rect = img7El.getBoundingClientRect();
        const isCandleVisible = img7Rect.top < window.innerHeight * 0.75;
        setCandleActive(prev => {
          if (prev !== isCandleVisible) return isCandleVisible;
          return prev;
        });
      }

      if (scrollY < stickStart) {
        setCurrentStep(0);
      } else if (scrollY > sectionHeight) {
        setCurrentStep(4);
      } else {
        const progress = (scrollY - stickStart) / (sectionHeight - stickStart);
        const step = Math.min(4, Math.max(0, Math.floor(progress * 5)));
        setCurrentStep(step);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize immediately on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scale]);

  const currentText = stepsData[currentStep] || stepsData[0];
  return (
    <section className={styles.spaceSection} ref={sectionRef}>

      <div className={styles.topNav}>
        <img src={ilkwLogo} alt="ILKW Logo" className={styles.logo} />
      </div>
      <div className={styles.container} style={{ zoom: scale }}>
        <div className={styles.textWrapper} style={{ height: textHeight ? `calc(100% + ${textHeight}px)` : '100%' }}>
          <div className={styles.textBox} ref={textBoxRef}>
            <div className={`${styles.mainText} ${isRevealed ? styles.revealed : ''}`}>
              <p className="type-title-5"><span className={`${styles.lineContent} ${styles.delay1}`}>We bring</span></p>
              <p className="type-title-5">
                <span className={`${styles.lineContent} ${styles.delay2}`}>
                  <span key={`word-${currentStep}`} className={`type-italic-6 ${styles.spaceText} ${styles.animateText}`}>
                    {currentText.word}
                  </span> 
                  <span style={{ display: 'inline-block' }}>&nbsp;to life</span>
                </span>
              </p>
              <p className="type-title-5"><span className={`${styles.lineContent} ${styles.delay3}`}>through light.</span></p>
            </div>
            <div className={`${styles.subTextWrapper} ${isRevealed ? styles.revealed : ''}`}>
              <div className={`${styles.lineContent} ${styles.delay4}`}>
                <p key={`sub-${currentStep}`} className={`${styles.subText} type-body-4 ${styles.animateText}`}>
                  {currentText.sub}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div id="img1" className={`${styles.imgBase} ${styles.img1}`} style={{ width: '1417px', height: '1447px', left: '0px', top: '0px', overflow: 'hidden' }}>
          <img src={spaceImg1} alt="Space 1" className={`${styles.scaleImg} ${revealedImages.img1 ? styles.revealedScaleImg : ''}`} style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
        </div>
        <img id="img2" src={imgSpace02} alt="Space 2" className={`${styles.imgBase} ${styles.img2} ${styles.scrollImg} ${revealedImages.img2 ? styles.revealedScrollImg : ''}`} style={{ width: '394px', height: '298px', left: '1417px', top: '1447px' }} />
        <img id="img3" src={spaceImg14} alt="Space 3" className={`${styles.imgBase} ${styles.img3} ${styles.scrollImg} ${revealedImages.img3 ? styles.revealedScrollImg : ''}`} style={{ width: '427px', height: '298px', left: '0px', top: '2452px' }} />
        <img id="img4" src={imgSpace04} alt="Space 4" className={`${styles.imgBase} ${styles.img4} ${styles.scrollImg} ${revealedImages.img4 ? styles.revealedScrollImg : ''}`} style={{ width: '440px', height: '301px', left: '1215px', top: '2672px' }} />
        <img id="img5" src={spaceImg19} alt="Space 5" className={`${styles.imgBase} ${styles.img5} ${styles.scrollImg} ${revealedImages.img5 ? styles.revealedScrollImg : ''}`} style={{ width: '647px', height: '439px', left: '571px', top: '2908px' }} />
        <img id="img6" src={spaceImg12} alt="Space 6" className={`${styles.imgBase} ${styles.img6} ${styles.scrollImg} ${revealedImages.img6 ? styles.revealedScrollImg : ''}`} style={{ width: '571px', height: '430px', left: '0px', top: '3347px' }} />
        {/* img7 - 촛불 이미지 래퍼 (기존 scrollImg 동작 유지 + 별똥별 인터렉션) */}
        <div
          id="img7"
          className={`${styles.imgBase} ${styles.img7} ${styles.scrollImg} ${revealedImages.img7 ? styles.revealedScrollImg : ''}`}
          style={{ width: '1033px', height: '682px', left: '571px', top: '3776px', overflow: 'hidden' }}
        >
          <img src={spaceImg16} alt="Space 7" style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }} />
          {/* 암전 오버레이 */}
          <div className={`${styles.candleDarkOverlay} ${candleActive ? styles.candleDarkOverlayActive : ''}`} />
          {/* 전구 드러남 (Reveal) - 4번(오른쪽)부터 순서대로 점화 */}
          <div className={`${styles.candleReveal} ${styles.candleReveal4} ${candleActive ? styles.candleReveal4Active : ''}`}>
            <img src={spaceImg16} alt="" />
          </div>
          <div className={`${styles.candleReveal} ${styles.candleReveal3} ${candleActive ? styles.candleReveal3Active : ''}`}>
            <img src={spaceImg16} alt="" />
          </div>
          <div className={`${styles.candleReveal} ${styles.candleReveal2} ${candleActive ? styles.candleReveal2Active : ''}`}>
            <img src={spaceImg16} alt="" />
          </div>
          <div className={`${styles.candleReveal} ${styles.candleReveal1} ${candleActive ? styles.candleReveal1Active : ''}`}>
            <img src={spaceImg16} alt="" />
          </div>
        </div>
        {/* 별똥별 4개 */}
        {candleActive && (
          <>
            <div className={`${styles.shootingStar} ${styles.shootingStar4}`} />
            <div className={`${styles.shootingStar} ${styles.shootingStar3}`} />
            <div className={`${styles.shootingStar} ${styles.shootingStar2}`} />
            <div className={`${styles.shootingStar} ${styles.shootingStar1}`} />
          </>
        )}
        <div id="img8" className={`${styles.box8} ${styles.scrollImg} ${revealedImages.img8 ? styles.revealedScrollImg : ''}`} style={{ width: '843px', height: '695px', left: '573px', top: '1745px' }}>
          <img src={imgGif} alt="Space 8 GIF" className={styles.box8InnerImg} />
        </div>

      </div>
    </section>
  );
}
