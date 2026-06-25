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

      // Pinned + scrubbed: the section pins to the viewport and the whole
      // sequence is driven by scroll progress over the pin distance (end).
      // Scrolling up reverses it; the user keeps full scroll control (no
      // input lock). Pin distance (innerHeight * 3) sets the reading pace.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * 3, // 핀 유지 거리 = 읽는 속도 (숫자 늘리면 더 천천히)
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          // 점프로 섹션을 지나가도 SpaceMiddle의 hero/dim이 확실히 꺼지게 (어둠 잔상 방지)
          onLeave: () => gsap.set([heroEl, dimEl], { opacity: 0 }),
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
    };
  }, []);

  return (
    <section id="light-philosophy" className={styles.endingSection} ref={sectionRef}>
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
