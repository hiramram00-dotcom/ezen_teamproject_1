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

      // Set initial positions for slide-up effect (reduced distance for gentler motion)
      gsap.set(text1Ref.current, { y: 50, opacity: 0 });
      gsap.set(text2Ref.current, { y: 50, opacity: 0 });
      gsap.set(bgRef.current, { opacity: 0 });

      // Sequence: background in -> text1 in -> hold -> text1 fades out VERY slowly -> wait -> text2 in -> hold -> text2 fades out -> background fades out (Fade to Black)
      tl.to(bgRef.current, { opacity: 1, duration: 200, ease: "power1.inOut" }) // 1. Extremely slow background reveal
        .to(text1Ref.current, { y: 0, opacity: 1, duration: 150, ease: "power1.out" }) // 2. Text 1 fades in softly
        .to(text1Ref.current, { opacity: 1, duration: 100 }) // 3. Hold text 1
        .to(text1Ref.current, { y: -30, opacity: 0, duration: 400, ease: "power1.inOut" }) // 4. Text 1 fades out VERY slowly
        .to(text2Ref.current, { y: 0, opacity: 1, duration: 300, ease: "power1.out" }, "+=50") // 5. SEQUENTIAL: Wait for Text 1 to disappear entirely, then short pause, then Text 2 fades in
        .to(text2Ref.current, { opacity: 1, duration: 100 }) // 6. Hold Text 2
        .to(text2Ref.current, { y: -30, opacity: 0, duration: 300, ease: "power1.inOut" }) // 7. Text 2 fades out slowly
        .to(bgRef.current, { opacity: 0, duration: 300, ease: "power1.inOut" }, "+=50"); // 8. Background fades to black (The Void Bookend)
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
