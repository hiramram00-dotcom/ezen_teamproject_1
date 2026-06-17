import { useState, useLayoutEffect, useRef } from 'react';
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
  // Container height reduced in CSS to pull up the next section
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const img1Ref = useRef(null);
  const textRef = useRef(null);
  const highlightWordRef = useRef(null);
  const img8WrapperRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const handleResize = () => {
      const clientWidth = document.documentElement.clientWidth;
      setScale(clientWidth / 1920); // Scale based on 1920px design
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Animate the first image to scale down and fade in as it scrolls into view
      gsap.fromTo(img1Ref.current,
        { scale: 1.3, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 2.5, // Slower reveal
          ease: "power2.out",
          scrollTrigger: {
            trigger: img1Ref.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Reveal animation for all subsequent images as each scrolls into view
      const images = gsap.utils.toArray('.reveal-image');
      images.forEach((img) => {
        gsap.fromTo(img,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 2.5, // Slower reveal
            ease: "power2.out",
            scrollTrigger: {
              trigger: img,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Reveal animation for text block lines
      gsap.fromTo(textRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.8, // Slower duration
          stagger: 0.25, // More delay between lines
          ease: "power2.out", // Smoother ease
          scrollTrigger: {
            trigger: sectionRef.current, // Use unscaled parent
            start: () => `top+=${650 * scale}px 85%`, // Mathematically calculate scaled position
            invalidateOnRefresh: true, // Recalculate on resize
            toggleActions: "play none none reverse"
          }
        }
      );

      // Change the highlight word while the text is sticky
      ScrollTrigger.create({
        trigger: sectionRef.current, // Use unscaled parent
        start: () => `top+=${650 * scale}px 80px`, // Starts exactly when the 650px offset hits the 80px sticky point
        end: () => `top+=${3133 * scale}px bottom`, // Ends exactly when the container finishes
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const words = ["Spaces", "Moments", "Warmth", "Memories", "Atmospheres"];
          const index = Math.min(Math.floor(self.progress * words.length), words.length - 1);
          if (highlightWordRef.current && highlightWordRef.current.innerText !== words[index]) {
            highlightWordRef.current.innerText = words[index];
          }
        }
      });


    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>

      <div ref={containerRef} className={styles.container} style={{ zoom: scale, margin: scale < 1 ? '0' : '0 auto' }}>
        
        {/* Images */}
        <div className={styles.imgWrapper} style={{ left: 0, top: 0, width: 808, height: 995 }}>
          <img ref={img1Ref} src={img1} alt="Space 1" className={styles.image} />
        </div>
        
        <div className={`${styles.imgWrapper} reveal-image`} style={{ left: 808, top: 995, width: 331, height: 322 }}>
          <img src={img2} alt="Space 2" className={styles.image} />
        </div>
        
        {/* White Box with GIF */}
        <div className={`${styles.whiteBox} reveal-image`} style={{ left: 317, top: 1317, width: 488, height: 408 }} />
        <div className={`${styles.imgWrapper} reveal-image`} style={{ left: 363, top: 1336, width: 397, height: 371 }}>
          <img src={imgGif} alt="Space GIF" className={styles.image} />
        </div>

        <div className={`${styles.imgWrapper} reveal-image`} style={{ left: 0, top: 1729, width: 317, height: 260 }}>
          <img src={img14} alt="Space 14" className={styles.image} />
        </div>

        <div className={`${styles.imgWrapper} reveal-image`} style={{ left: 682, top: 1923, width: 456, height: 315 }}>
          <img src={img4} alt="Space 4" className={styles.image} />
        </div>

        <div className={`${styles.imgWrapper} reveal-image`} style={{ left: 383, top: 2190, width: 300, height: 283 }}>
          <img src={img6} alt="Space 6" className={styles.image} />
        </div>

        <div className={`${styles.imgWrapper} reveal-image`} style={{ left: 0, top: 2410, width: 383, height: 281 }}>
          <img src={img15} alt="Space 15" className={styles.image} />
        </div>

        <div ref={img8WrapperRef} className={`${styles.imgWrapper} reveal-image`} style={{ left: 383, top: 2645, width: 796, height: 488 }}>
          <img src={img8} alt="Space 8" className={styles.imageReduced} />
        </div>

        {/* Central Text Block Wrapper for Sticky */}
        <div style={{ position: 'absolute', left: 1192, top: 0, bottom: 0, zIndex: 20 }}>
          <div ref={textRef} className={styles.textBlock} style={{ position: 'sticky', top: '80px', marginTop: 650 }}>
            <p className={styles.textLine}>We bring</p>
            <p ref={highlightWordRef} className={styles.textHighlight}>Spaces</p>
            <p className={styles.textLine}>to life</p>
            <p className={styles.textLine}>through light.</p>
          </div>
        </div>

      </div>

      {/* 50vh Spacer for the "Dark Phase" before StoryEndingSection */}
      <div style={{ width: '100%', height: '50vh', backgroundColor: '#000000' }}></div>
    </section>
  );
}
