import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  const trailCanvasRef = useRef(null);
  const imageRefs = useRef([]);
  const heroRef = useRef(null);
  const heroDimRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);

  useLayoutEffect(() => {
    const handleResize = () => {
      const clientWidth = document.documentElement.clientWidth;
      setScale(clientWidth / 1920);
      setViewportWidth(clientWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useLayoutEffect(() => {
    const isMobile = viewportWidth < 768;
    const isTablet = viewportWidth >= 768 && viewportWidth < 1200;
    const textRevealOffset = isMobile ? 300 : 650;
    const wordChangeOffset = isMobile ? 900 : 650;
    const wordChangeEnd = isMobile ? 2350 : isTablet ? 2250 : 3133;

    let ctx = gsap.context(() => {
      // Reveal animation for the whole text block (rises + fades in as one
      // unit, not line by line), replaying every time it's scrolled past
      // and back into view in either direction.
      gsap.fromTo(textRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: isMobile ? 0.75 : 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: () => `top+=${textRevealOffset * scale}px ${isMobile ? '95%' : '85%'}`,
            invalidateOnRefresh: true,
            toggleActions: "restart none restart reset"
          }
        }
      );

      // Change the highlight word while the text is sticky
      const words = ["Spaces.", "Moments.", "Warmth.", "Memories."];
      // Dead zone around each word boundary (in word-units) — without it,
      // tiny scroll jitter right at a boundary (e.g. trackpad momentum)
      // flips the index back and forth and replays the same word twice.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: () => `top+=${wordChangeOffset * scale}px ${isMobile ? '80%' : '80px'}`,
        end: () => `top+=${wordChangeEnd * scale}px top`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const responsiveThresholds =
            isMobile
              ? [0, 0.16, 0.4, 0.64]
              : isTablet
                ? [0, 0.08, 0.34, 0.62]
              : [0, 0.25, 0.5, 0.75];
          let index = 0;
          for (let i = responsiveThresholds.length - 1; i >= 0; i--) {
            if (self.progress >= responsiveThresholds[i]) {
              index = i;
              break;
            }
          }
          const targetWord = words[index];

          if (highlightWordRef.current && highlightWordRef.current.dataset.currentWord !== targetWord) {
            highlightWordRef.current.dataset.currentWord = targetWord;
            gsap.killTweensOf(highlightWordRef.current);
            highlightWordRef.current.innerText = targetWord;
            gsap.fromTo(highlightWordRef.current, {
              opacity: 0,
              y: 8,
            }, {
              opacity: 1,
              y: 0,
              duration: 0.22,
              ease: "power1.out",
              overwrite: true,
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

    }, sectionRef);
    return () => ctx.revert();
  }, [scale, viewportWidth]);

  // When the last image scrolls up beside the sticky text block, scrolling
  // pauses there (pinned) — further scroll input grows that exact in-place
  // image to fullscreen while a dark scrim fades in at the same time, then
  // unpins so the page continues into StoryEndingSection's text.
  useEffect(() => {
    const lastWrapper = imageRefs.current[7];
    const hero = heroRef.current;
    const dim = heroDimRef.current;
    const section = sectionRef.current;
    if (!lastWrapper || !hero || !dim || !section) return;

    const IMAGE8_DESIGN_TOP = 2645;
    const MAX_DIM = 0.55;
    let fromRect = null;

    const setProgress = (p) => {
      if (!fromRect) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      hero.style.left = `${fromRect.left + (0 - fromRect.left) * p}px`;
      hero.style.top = `${fromRect.top + (0 - fromRect.top) * p}px`;
      hero.style.width = `${fromRect.width + (vw - fromRect.width) * p}px`;
      hero.style.height = `${fromRect.height + (vh - fromRect.height) * p}px`;
      dim.style.opacity = `${MAX_DIM * p}`;
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: () => `top+=${IMAGE8_DESIGN_TOP * scale}px 8%`,
      end: () => `+=${window.innerHeight}`,
      pin: true,
      pinSpacing: true,
      scrub: true,
      invalidateOnRefresh: true,
      onEnter: () => {
        fromRect = lastWrapper.getBoundingClientRect();
        hero.style.opacity = '1';
        dim.style.opacity = '0';
      },
      onEnterBack: () => {
        fromRect = lastWrapper.getBoundingClientRect();
        hero.style.opacity = '1';
      },
      onLeaveBack: () => {
        hero.style.opacity = '0';
        dim.style.opacity = '0';
      },
      onUpdate: (self) => setProgress(self.progress)
    });

    return () => st.kill();
  }, [scale]);

  // A small light follows a curved route, pauses at each image, sparkles,
  // and then switches that image on.
  useEffect(() => {
    const section = sectionRef.current;
    const light = lightRef.current;
    const trailCanvas = trailCanvasRef.current;
    if (!section || !light || !trailCanvas) return;

    const trailContext = trailCanvas.getContext('2d');
    const trailPoints = [];
    trailCanvas.width = 1920;
    trailCanvas.height = 3133;

    const CONTAINER_HEIGHT = 3133;
    const DESIGN_WIDTH = 1920;
    const stops = [
      { scroll: 300, x: 404, y: 498, images: [0], bounds: { left: 0, top: 0, right: 808, bottom: 995 } },
      { scroll: 995, x: 974, y: 1156, images: [1], bounds: { left: 808, top: 995, right: 1139, bottom: 1317 } },
      { scroll: 1340, x: 561, y: 1521, images: [2], bounds: { left: 317, top: 1317, right: 805, bottom: 1725 } },
      { scroll: 1729, x: 159, y: 1859, images: [3], bounds: { left: 0, top: 1729, right: 317, bottom: 1989 } },
      { scroll: 1923, x: 910, y: 2081, images: [4], bounds: { left: 682, top: 1923, right: 1138, bottom: 2238 } },
      { scroll: 2190, x: 533, y: 2332, images: [5], bounds: { left: 383, top: 2190, right: 683, bottom: 2473 } },
      { scroll: 2410, x: 192, y: 2551, images: [6], bounds: { left: 0, top: 2410, right: 383, bottom: 2691 } },
      { scroll: 2645, x: 781, y: 2889, images: [7], bounds: { left: 383, top: 2645, right: 1179, bottom: 3133 } },
    ];

    const HOLD_BEFORE = 70;
    const HOLD_AFTER = 120;
    const revealed = new Set();
    const revealCalls = new Map();
    let currentX = stops[0].x;
    let currentY = 0;
    let previousX = currentX;
    let previousY = currentY;
    let flashingStop = -1;
    let flashCall = null;
    let previousScroll = 0;
    let previousTargetScroll = 0;
    let lightProgress = 0;
    let rafId;

    const getRenderedScale = () => {
      const renderedWidth = containerRef.current?.getBoundingClientRect().width;
      return renderedWidth ? renderedWidth / DESIGN_WIDTH : scale;
    };

    const smooth = value => value * value * value * (value * (value * 6 - 15) + 10);
    const catmullRom = (p0, p1, p2, p3, t) => {
      const t2 = t * t;
      const t3 = t2 * t;
      return 0.5 * (
        (2 * p1) +
        (-p0 + p2) * t +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
        (-p0 + 3 * p1 - 3 * p2 + p3) * t3
      );
    };

    const getPathPosition = scrollY => {
      if (scrollY <= stops[0].scroll - HOLD_BEFORE) {
        const progress = Math.max(0, scrollY / (stops[0].scroll - HOLD_BEFORE));
        const eased = smooth(progress);
        return { x: stops[0].x, y: stops[0].y * eased };
      }

      for (let index = 0; index < stops.length; index++) {
        const stop = stops[index];
        const arrival = stop.scroll - HOLD_BEFORE;
        const departure = stop.scroll + HOLD_AFTER;
        if (scrollY <= departure && scrollY >= arrival) return { x: stop.x, y: stop.y };

        const next = stops[index + 1];
        if (next && scrollY < next.scroll - HOLD_BEFORE) {
          const start = departure;
          const end = next.scroll - HOLD_BEFORE;
          const progress = Math.max(0, Math.min(1, (scrollY - start) / (end - start)));
          const eased = smooth(progress);
          const previous = stops[Math.max(0, index - 1)];
          const afterNext = stops[Math.min(stops.length - 1, index + 2)];
          return {
            x: Math.max(
              24,
              Math.min(1170, catmullRom(previous.x, stop.x, next.x, afterNext.x, eased))
            ),
            y: Math.max(
              0,
              Math.min(CONTAINER_HEIGHT, catmullRom(previous.y, stop.y, next.y, afterNext.y, eased))
            ),
          };
        }
      }

      const last = stops[stops.length - 1];
      return { x: last.x, y: last.y };
    };

    const sparkleAndReveal = (stop, index) => {
      if (revealed.has(index)) return;
      revealed.add(index);
      flashingStop = index;
      light.classList.remove(styles.spark);
      void light.offsetWidth;
      light.classList.add(styles.spark);

      const call = gsap.delayedCall(0.38, () => {
        stop.images.forEach(imageIndex => {
          const image = imageRefs.current[imageIndex];
          if (image) image.classList.add(styles.lit);
        });
      });
      revealCalls.set(index, call);

      flashCall?.kill();
      flashCall = gsap.delayedCall(0.45, () => {
        flashingStop = -1;
        light.classList.remove(styles.spark);
      });
    };

    const revealWithoutSparkle = (stop, index) => {
      if (revealed.has(index)) return;
      revealed.add(index);
      stop.images.forEach(imageIndex => {
        imageRefs.current[imageIndex]?.classList.add(styles.lit);
      });
    };

    const hideAfterReverse = (stop, index) => {
      if (!revealed.has(index)) return;
      revealed.delete(index);
      revealCalls.get(index)?.kill();
      revealCalls.delete(index);
      if (flashingStop === index) {
        flashCall?.kill();
        flashingStop = -1;
        light.classList.remove(styles.spark);
      }
      stop.images.forEach(imageIndex => {
        imageRefs.current[imageIndex]?.classList.remove(styles.lit);
      });
    };

    const getTargetScroll = () => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const renderedScale = getRenderedScale();
      const scrollInsideSection = (window.scrollY - sectionTop) / renderedScale;
      // Keep the viewport offset in screen pixels. Dividing this value by a
      // very small mobile scale makes the light jump far ahead of the images.
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1200;
      const isMobile = window.innerWidth < 768;
      const viewportRatio = isMobile ? 0.78 : isTablet ? 0.8 : 0.65;
      const viewportOffset =
        (window.innerHeight * viewportRatio) / renderedScale;
      return scrollInsideSection + viewportOffset;
    };

    const animate = () => {
      const targetScroll = getTargetScroll();
      const clampedScroll = Math.max(0, Math.min(CONTAINER_HEIGHT, targetScroll));
      const targetScrollDelta = Math.abs(clampedScroll - previousTargetScroll);
      const fastProgressThreshold = Math.max(85, window.innerHeight * 0.1);
      const crossedStops = stops.filter((stop, index) =>
        !revealed.has(index) &&
        previousTargetScroll < stop.scroll &&
        clampedScroll >= stop.scroll &&
        targetScrollDelta > fastProgressThreshold
      );
      crossedStops.forEach(stop => {
        const index = stops.indexOf(stop);
        revealWithoutSparkle(stop, index);
      });

      const progressDistance = clampedScroll - lightProgress;
      const maxProgressStep = Math.max(8, Math.min(24, window.innerHeight * 0.02));
      lightProgress += Math.max(
        -maxProgressStep,
        Math.min(maxProgressStep, progressDistance)
      );

      const maxProgressLag = 180;
      if (clampedScroll - lightProgress > maxProgressLag) {
        lightProgress = clampedScroll - maxProgressLag;
      } else if (lightProgress - clampedScroll > maxProgressLag) {
        lightProgress = clampedScroll + maxProgressLag;
      }

      const activeScroll = lightProgress;
      const target = getPathPosition(activeScroll);
      currentX += (target.x - currentX) * 0.065;
      currentY += (target.y - currentY) * 0.065;

      const lastTrailPoint = trailPoints[trailPoints.length - 1];
      if (
        !lastTrailPoint ||
        Math.hypot(currentX - lastTrailPoint.x, currentY - lastTrailPoint.y) > 3
      ) {
        trailPoints.push({ x: currentX, y: currentY, life: 1 });
      }

      trailContext.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      for (let index = trailPoints.length - 1; index >= 0; index--) {
        trailPoints[index].life -= 0.012;
        if (trailPoints[index].life <= 0) trailPoints.splice(index, 1);
      }

      if (trailPoints.length > 1) {
        trailContext.lineCap = 'round';
        trailContext.lineJoin = 'round';
        for (let index = 1; index < trailPoints.length; index++) {
          const previous = trailPoints[index - 1];
          const point = trailPoints[index];
          const beforePrevious = trailPoints[Math.max(0, index - 2)];
          const startX = (beforePrevious.x + previous.x) / 2;
          const startY = (beforePrevious.y + previous.y) / 2;
          const endX = (previous.x + point.x) / 2;
          const endY = (previous.y + point.y) / 2;
          const alpha = Math.min(previous.life, point.life) * 0.34;
          trailContext.beginPath();
          trailContext.moveTo(startX, startY);
          trailContext.quadraticCurveTo(previous.x, previous.y, endX, endY);
          trailContext.strokeStyle = `rgba(255, 205, 132, ${alpha})`;
          trailContext.lineWidth = 2.2;
          trailContext.shadowColor = `rgba(255, 231, 184, ${alpha * 0.8})`;
          trailContext.shadowBlur = 7;
          trailContext.stroke();
        }
        trailContext.shadowBlur = 0;
      }

      const angle = Math.atan2(currentY - previousY, currentX - previousX) * 180 / Math.PI;
      light.style.left = `${currentX}px`;
      light.style.top = `${currentY}px`;
      light.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

      const lightIsInsideRevealedImage = stops.some((stop, index) => {
        if (!revealed.has(index) || flashingStop === index) return false;
        const margin = 16;
        return (
          currentX >= stop.bounds.left - margin &&
          currentX <= stop.bounds.right + margin &&
          currentY >= stop.bounds.top - margin &&
          currentY <= stop.bounds.bottom + margin
        );
      });

      light.style.opacity =
        targetScroll >= 0 &&
        targetScroll <= CONTAINER_HEIGHT &&
        !lightIsInsideRevealedImage
          ? '1'
          : '0';
      previousX = currentX;
      previousY = currentY;

      stops.forEach((stop, index) => {
        const distance = Math.hypot(currentX - stop.x, currentY - stop.y);
        if (
          activeScroll >= stop.scroll - HOLD_BEFORE &&
          activeScroll <= stop.scroll + HOLD_AFTER &&
          distance < 8
        ) {
          sparkleAndReveal(stop, index);
        }
        // Fast scrolling can skip the narrow center-hit window. Once the
        // trigger has clearly been crossed, guarantee the image reveal.
        if (
          !revealed.has(index) &&
          activeScroll >= stop.scroll &&
          activeScroll > stop.scroll + HOLD_AFTER
        ) {
          revealWithoutSparkle(stop, index);
        }
        if (activeScroll < stop.scroll - HOLD_BEFORE) hideAfterReverse(stop, index);
      });

      previousScroll = activeScroll;
      previousTargetScroll = clampedScroll;
      rafId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      trailPoints.length = 0;
      trailContext.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      previousScroll = getTargetScroll();
      previousTargetScroll = previousScroll;
      lightProgress = Math.max(0, Math.min(CONTAINER_HEIGHT, previousScroll));
    };
    window.addEventListener('resize', handleResize);

    rafId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafId);
      flashCall?.kill();
      revealCalls.forEach(call => call.kill());
      window.removeEventListener('resize', handleResize);
    };
  }, [scale]);

  return (
    <section className={styles.section} ref={sectionRef}>

      <div ref={containerRef} className={styles.container} style={{ zoom: scale, margin: scale < 1 ? '0' : '0 auto' }}>

        {/* Small travelling light with a short, faint tail */}
        <canvas ref={trailCanvasRef} className={styles.lightTrailCanvas} aria-hidden="true" />
        <div ref={lightRef} className={styles.travelLight} aria-hidden="true">
          <span className={styles.lightTail} />
          <span className={styles.lightCore} />
        </div>

        {/* Images */}
        <div ref={el => imageRefs.current[0] = el} className={styles.imgWrapper} style={{ left: 0, top: 0, width: 808, height: 995 }}>
          <img src={img1} alt="Space 1" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[1] = el} className={styles.imgWrapper} style={{ left: 808, top: 995, width: 331, height: 322 }}>
          <img src={img2} alt="Space 2" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[2] = el} className={styles.imgWrapper} style={{ left: 317, top: 1317, width: 488, height: 408 }}>
          <img src={imgGif} alt="Space GIF" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[3] = el} className={styles.imgWrapper} style={{ left: 0, top: 1729, width: 317, height: 260 }}>
          <img src={img14} alt="Space 14" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[4] = el} className={styles.imgWrapper} style={{ left: 682, top: 1923, width: 456, height: 315 }}>
          <img src={img4} alt="Space 4" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[5] = el} className={styles.imgWrapper} style={{ left: 383, top: 2190, width: 300, height: 283 }}>
          <img src={img6} alt="Space 6" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[6] = el} className={styles.imgWrapper} style={{ left: 0, top: 2410, width: 383, height: 281 }}>
          <img src={img15} alt="Space 15" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[7] = el} className={styles.imgWrapper} style={{ left: 383, top: 2645, width: 796, height: 488 }}>
          <img src={img8} alt="Space 8" className={styles.imageReduced} />
        </div>

        {/* Central Text Block Wrapper for Sticky */}
        <div style={{ position: 'absolute', left: 1192, top: 0, bottom: 0, zIndex: 20 }}>
          <div
            ref={textRef}
            className={styles.textBlock}
            style={{
              position: 'sticky',
              top:
                viewportWidth < 768
                  ? '450px'
                  : viewportWidth < 1200
                    ? '350px'
                    : '150px',
              marginTop: 350,
            }}
          >
            <p className={styles.textLine}>Through light,</p>
            <p className={styles.textLine}>we create</p>
            <p
              ref={highlightWordRef}
              className={styles.textHighlight}
              data-current-word="Spaces."
            >
              Spaces.
            </p>
          </div>
        </div>

      </div>

      {/* Hero clone of the last image — grows to fullscreen once the grid
          section has finished scrolling past, darkening at the same time,
          and stays as the backdrop for StoryEndingSection's text. Rendered
          via a portal because GSAP's pin applies a transform to this
          section, which would otherwise become the containing block for
          these fixed-position elements and break their viewport coordinates. */}
      {createPortal(
        <>
          <div ref={heroRef} className={styles.heroImage}>
            <img src={img8} alt="" />
          </div>
          <div ref={heroDimRef} className={styles.heroDim} />
        </>,
        document.body
      )}
    </section>
  );
}
