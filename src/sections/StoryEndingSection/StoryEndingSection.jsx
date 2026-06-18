import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './StoryEndingSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function StoryEndingSection() {
  const sectionRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  useEffect(() => {
    // While the sequence plays, scrolling is locked so the user can't
    // scroll past/through it — it's released the moment it finishes.
    const preventScroll = (e) => e.preventDefault();
    const lockScroll = () => {
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
    };
    const unlockScroll = () => {
      window.removeEventListener('wheel', preventScroll, { passive: false });
      window.removeEventListener('touchmove', preventScroll, { passive: false });
    };

    let ctx = gsap.context(() => {
      const text1Lines = text1Ref.current.children;
      const text2Lines = text2Ref.current.children;
      gsap.set(text1Ref.current, { opacity: 1, y: 0 });
      gsap.set(text2Ref.current, { opacity: 1, y: 0 });
      gsap.set(text1Lines, { y: 30, opacity: 0, filter: "blur(10px)", scale: 1.04 });
      gsap.set(text2Lines, { y: 30, opacity: 0, filter: "blur(10px)", scale: 1.04 });

      // SpaceMiddleSection's hero image + dim scrim are fixed-position
      // elements that stay on screen indefinitely once shown, so they must
      // be explicitly faded out here once text2 is done, or they'd
      // permanently cover Snowman1Section beneath.
      const heroEl = document.querySelector(`[class*="heroImage"]`);
      const dimEl = document.querySelector(`[class*="heroDim"]`);

      // This whole sequence plays on its own fixed real-world clock, not
      // tied to scroll distance/speed at all — scrolling only decides
      // *when* it (re)starts. text1/text2 are position:fixed (see CSS), so
      // once started the sequence keeps playing to completion no matter how
      // far past the (short, 100svh) trigger zone the user tries to scroll
      // — input is locked for its whole real duration and released on
      // completion. Scrolling back up out of the zone (before it has even
      // started) resets it to hidden, and re-entering restarts it from the top.
      const tl = gsap.timeline({
        paused: true,
        onStart: lockScroll,
        onComplete: unlockScroll,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "restart none restart reset",
          onLeaveBack: unlockScroll
        }
      });

      // Sequence: text1 lines blur into focus one after another -> hold
      // -> text1 fades out -> wait -> text2 lines blur in -> hold
      // -> text2 fades out -> hero image + dim fade out
      tl.to(text1Lines, { y: 0, opacity: 1, filter: "blur(0px)", scale: 1, duration: 1.6, stagger: 0.25, ease: "power3.out" }) // 1. Text 1 lines blur into focus in sequence
        .to(text1Ref.current, { opacity: 1, duration: 0.5 }) // 2. Hold text 1 (shorter)
        .to(text1Ref.current, { y: -30, opacity: 0, duration: 0.6, ease: "power1.inOut" }) // 3. Text 1 fades out
        .to(text2Lines, { y: 0, opacity: 1, filter: "blur(0px)", scale: 1, duration: 1.6, stagger: 0.25, ease: "power3.out" }, "+=0.1") // 4. Text 2 lines blur into focus, sooner after Text 1
        .to(text2Ref.current, { opacity: 1, duration: 0.5 }) // 5. Hold Text 2 (shorter)
        .to(text2Ref.current, { y: -30, opacity: 0, duration: 1.0, ease: "power1.inOut" }) // 6. Text 2 fades out slowly
        .to([heroEl, dimEl], { opacity: 0, duration: 1.0, ease: "power1.inOut" }, "+=0.3"); // 7. Hero image + dim fade to reveal the next section
    }, sectionRef);

    return () => {
      ctx.revert();
      unlockScroll();
    };
  }, []);

  return (
    <section className={styles.endingSection} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.stickyWrapper}>
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
