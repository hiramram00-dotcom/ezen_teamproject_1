import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './StoryEndingSection.module.css';
import img8 from '../../../img/8.png';

gsap.registerPlugin(ScrollTrigger);

export default function StoryEndingSection() {
  const sectionRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top", // Starts when section reaches the top of the viewport
          end: "bottom bottom", // Ends when the entire 2200px container finishes scrolling
          scrub: true
        }
      });

      // Set initial positions for slide-up effect
      gsap.set(text1Ref.current, { y: 100, opacity: 0 });
      gsap.set(text2Ref.current, { y: 100, opacity: 0 });
      gsap.set(bgRef.current, { opacity: 0 });

      // Sequence: background fades in slowly -> text 1 slides up & fades in -> stays -> slides up & fades out -> text 2 slides up & fades in -> stays
      tl.to(bgRef.current, { opacity: 1, duration: 150, ease: "power1.inOut" }) // 1. Extremely slow background reveal
        .to(text1Ref.current, { y: 0, opacity: 1, duration: 125, ease: "power2.out" }) // 2. Extremely slow text 1 fade in
        .to(text1Ref.current, { opacity: 1, duration: 50 }) // 3. Hold text 1
        .to(text1Ref.current, { y: -100, opacity: 0, duration: 500, ease: "none" }) // 4. "조금만 더 느리게" (Fade out duration pushed to the absolute extreme, takes half the section)
        .to(text2Ref.current, { y: 0, opacity: 1, duration: 125, ease: "power2.out" }, "+=50") // 5. Long pause (+=50), then extremely slow text 2 fade in
        .to(text2Ref.current, { opacity: 1, duration: 75 }); // 6. Hold Text 2
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.endingSection} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.stickyWrapper}>
          {/* Full Screen Background Image */}
          <div ref={bgRef} style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
            <img src={img8} alt="Ending Background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {/* Dark overlay for text readability */}
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
          </div>

          <div className={styles.textBlock1} ref={text1Ref}>
            <p>60년이 넘는 시간 동안 우리는 오직 하나,</p>
            <p>
              <span className={styles.semiBold}>‘빛의 본질’</span>
              <span>에 몰두해 왔습니다.</span>
            </p>
          </div>
          
          <div className={styles.textBlock2} ref={text2Ref}>
            <p>사람과 공간이</p>
            <p>
              <span className={styles.semiBold}>‘가장 자연스럽게 연결되는 순간’</span>
              <span>을 위해.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
