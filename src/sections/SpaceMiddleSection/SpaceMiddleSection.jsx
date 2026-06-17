import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import styles from './SpaceMiddleSection.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import img1 from '../../../img/1.png';
import img2 from '../../../img/2.png';
import imgGif from '../../../img/download.gif';
import img14 from '../../../img/14.png';
import img4 from '../../../img/4.png';
import img6 from '../../../img/6.png';
import img15 from '../../../img/15.png';
import img8 from '../../../img/8.png';

export default function SpaceMiddleSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const highlightWordRef = useRef(null);
  const lightRef = useRef(null);
  const imageRefs = useRef([]);
  const bgOverlayRef = useRef(null);
  const textWrapperRef = useRef(null);
  const endText1Ref = useRef(null);
  const endText2Ref = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const handleResize = () => {
      const clientWidth = document.documentElement.clientWidth;
      setScale(clientWidth / 1920);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Reveal animation for text block lines
      gsap.fromTo(textRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.8,
          stagger: 0.25,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: () => `top+=${650 * scale}px 85%`,
            invalidateOnRefresh: true,
            toggleActions: "play none none none"
          }
        }
      );

      // Change the highlight word while the text is sticky
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: () => `top+=${650 * scale}px 80px`,
        end: () => `top+=${3133 * scale}px top`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const words = ["Spaces", "Moments", "Warmth", "Memories", "Atmospheres"];
          const index = Math.min(Math.floor(self.progress * words.length), words.length - 1);
          const targetWord = words[index];

          if (highlightWordRef.current && highlightWordRef.current.dataset.currentWord !== targetWord) {
            highlightWordRef.current.dataset.currentWord = targetWord;
            gsap.killTweensOf(highlightWordRef.current);
            gsap.to(highlightWordRef.current, {
              opacity: 0,
              duration: 0.3,
              ease: "power1.inOut",
              onComplete: () => {
                if (highlightWordRef.current) {
                  highlightWordRef.current.innerText = targetWord;
                  gsap.to(highlightWordRef.current, {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power1.inOut"
                  });
                }
              }
            });
          }
        }
      });

      // Fade out container as it leaves screen
      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "bottom 60%",
          end: "bottom top",
          scrub: 1,
        },
        opacity: 0,
        ease: "power1.inOut"
      });

      // Ending sequence: Space 8 zoom-in bg + text overlay
      gsap.set(bgOverlayRef.current, { opacity: 0, scale: 0.35, transformOrigin: 'center center' });
      gsap.set(endText1Ref.current, { y: 50, opacity: 0 });
      gsap.set(endText2Ref.current, { y: 50, opacity: 0 });

      const endingTl = gsap.timeline({
        scrollTrigger: {
          trigger: textWrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      });

      endingTl
        .to(bgOverlayRef.current, { opacity: 1, scale: 1, duration: 200, ease: 'power2.out' })
        .to(endText1Ref.current, { y: 0, opacity: 1, duration: 150, ease: 'power1.out' })
        .to(endText1Ref.current, { opacity: 1, duration: 100 })
        .to(endText1Ref.current, { y: -30, opacity: 0, duration: 300, ease: 'power1.inOut' })
        .to(endText2Ref.current, { y: 0, opacity: 1, duration: 200, ease: 'power1.out' }, '+=50')
        .to(endText2Ref.current, { opacity: 1, duration: 100 })
        .to(endText2Ref.current, { y: -30, opacity: 0, duration: 300, ease: 'power1.inOut' })
        .to(bgOverlayRef.current, { opacity: 0, duration: 200, ease: 'power1.inOut' }, '+=50');

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Light beam follows scroll, reveals images on contact
  useEffect(() => {
    const section = sectionRef.current;
    const light = lightRef.current;
    if (!section || !light) return;

    const CONTAINER_HEIGHT = 3133;

    // Light path: waypoints in design coordinates (1920px space)
    // X = center of each image, Y = top of each image
    const waypoints = [
      { y: 0,               x: 404 },
      { y: 995,             x: 972 },
      { y: 1317,            x: 561 },
      { y: 1729,            x: 158 },
      { y: 1923,            x: 910 },
      { y: 2190,            x: 533 },
      { y: 2410,            x: 191 },
      { y: 2645,            x: 781 },
      { y: CONTAINER_HEIGHT, x: 781 },
    ];

    // Y position where each imageRefs[i] gets revealed
    const revealTriggers = [300, 995, 1317, 1336, 1729, 1923, 2190, 2410, 2645];

    const getLightX = (y) => {
      for (let i = 0; i < waypoints.length - 1; i++) {
        if (y <= waypoints[i + 1].y) {
          const t = (y - waypoints[i].y) / (waypoints[i + 1].y - waypoints[i].y);
          return waypoints[i].x + (waypoints[i + 1].x - waypoints[i].x) * t;
        }
      }
      return waypoints[waypoints.length - 1].x;
    };

    let currentY = 0;
    let currentX = 0;
    let rafId = null;

    const getTargetY = () => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      return (window.scrollY - sectionTop + window.innerHeight / 2) / scale;
    };

    const animate = () => {
      const targetY = getTargetY();
      const LERP = 0.06;
      currentY += (targetY - currentY) * LERP;

      const clampedY = Math.max(0, Math.min(CONTAINER_HEIGHT, currentY));
      const targetX = getLightX(clampedY);
      currentX += (targetX - currentX) * LERP;

      // Expand light when near an image trigger
      const nearImage = revealTriggers.some(t => Math.abs(clampedY - t) < 220);
      light.style.width = nearImage ? '180px' : '70px';

      light.style.left = `${currentX}px`;
      light.style.top = `${clampedY}px`;
      light.style.opacity = (targetY >= 0 && targetY <= CONTAINER_HEIGHT) ? '1' : '0';

      imageRefs.current.forEach((el, i) => {
        if (!el) return;
        if (clampedY >= revealTriggers[i]) {
          el.classList.add(styles.lit);
        } else {
          el.classList.remove(styles.lit);
        }
      });

      rafId = requestAnimationFrame(animate);
    };

    currentY = getTargetY();
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [scale]);

  return (
    <section className={styles.section} ref={sectionRef}>

      <div ref={containerRef} className={styles.container} style={{ zoom: scale, margin: scale < 1 ? '0' : '0 auto' }}>

        {/* Light beam */}
        <div ref={lightRef} className={styles.travelLight} aria-hidden="true">
          <span className={styles.glowDot} />
        </div>

        {/* Images */}
        <div ref={el => imageRefs.current[0] = el} className={styles.imgWrapper} style={{ left: 0, top: 0, width: 808, height: 995 }}>
          <img src={img1} alt="Space 1" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[1] = el} className={styles.imgWrapper} style={{ left: 808, top: 995, width: 331, height: 322 }}>
          <img src={img2} alt="Space 2" className={styles.image} />
        </div>

        {/* White Box with GIF */}
        <div ref={el => imageRefs.current[2] = el} className={styles.whiteBox} style={{ left: 317, top: 1317, width: 488, height: 408 }} />
        <div ref={el => imageRefs.current[3] = el} className={styles.imgWrapper} style={{ left: 363, top: 1336, width: 397, height: 371 }}>
          <img src={imgGif} alt="Space GIF" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[4] = el} className={styles.imgWrapper} style={{ left: 0, top: 1729, width: 317, height: 260 }}>
          <img src={img14} alt="Space 14" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[5] = el} className={styles.imgWrapper} style={{ left: 682, top: 1923, width: 456, height: 315 }}>
          <img src={img4} alt="Space 4" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[6] = el} className={styles.imgWrapper} style={{ left: 383, top: 2190, width: 300, height: 283 }}>
          <img src={img6} alt="Space 6" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[7] = el} className={styles.imgWrapper} style={{ left: 0, top: 2410, width: 383, height: 281 }}>
          <img src={img15} alt="Space 15" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[8] = el} className={styles.imgWrapper} style={{ left: 383, top: 2645, width: 796, height: 488 }}>
          <img src={img8} alt="Space 8" className={styles.imageReduced} />
        </div>

        {/* Central Text Block Wrapper for Sticky */}
        <div style={{ position: 'absolute', left: 1192, top: 0, bottom: 0, zIndex: 20 }}>
          <div ref={textRef} className={styles.textBlock} style={{ position: 'sticky', top: '80px', marginTop: 350 }}>
            <p className={styles.textLine}>We bring</p>
            <p ref={highlightWordRef} className={styles.textHighlight}>Spaces</p>
            <p className={styles.textLine}>to life</p>
            <p className={styles.textLine}>through light.</p>
          </div>
        </div>

      </div>

      {/* Fixed bg overlay — Space 8 zooms in, text appears on top */}
      <div ref={bgOverlayRef} className={styles.bgOverlay}>
        <img src={img8} alt="" className={styles.bgOverlayImg} />
        <div className={styles.bgOverlayDim} />
      </div>

      {/* 400vh scroll area for ending sequence */}
      <div ref={textWrapperRef} style={{ height: '400vh', position: 'relative', backgroundColor: '#000' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'grid', placeItems: 'center' }}>
          <div ref={endText1Ref} className={styles.endingText}>
            <p>60년이 넘는 시간 동안 우리는 오직 하나,</p>
            <p><span className={styles.endingTextBold}>'빛의 본질'</span><span>에 몰두해 왔습니다.</span></p>
          </div>
          <div ref={endText2Ref} className={styles.endingText}>
            <p>사람과 공간이</p>
            <p><span className={styles.endingTextBold}>'가장 자연스럽게 연결되는 순간'</span><span>을 위해.</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}
