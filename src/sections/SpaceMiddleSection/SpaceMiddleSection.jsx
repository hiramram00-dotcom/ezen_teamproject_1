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
import img15 from '../../../img/space-15.webp';
import img8 from '../../../img/8.png';

const DESKTOP_HEIGHT = 3133;
const MOBILE_HEIGHT = 6500;

const DESKTOP_IMAGES = [
  { left: 0, top: 0, width: 808, height: 995 },
  { left: 808, top: 995, width: 331, height: 322 },
  { left: 317, top: 1317, width: 488, height: 408 },
  { left: 0, top: 1729, width: 317, height: 260 },
  { left: 682, top: 1923, width: 456, height: 315 },
  { left: 383, top: 2190, width: 300, height: 283 },
  { left: 0, top: 2410, width: 383, height: 281 },
  { left: 383, top: 2645, width: 796, height: 488 },
];

const MOBILE_IMAGES = [
  { left: 60, top: 1830, width: 720, height: 760 },
  { left: 1080, top: 2350, width: 690, height: 520 },
  { left: 260, top: 2920, width: 760, height: 620 },
  { left: 1110, top: 3400, width: 660, height: 520 },
  { left: 70, top: 3900, width: 800, height: 570 },
  { left: 1010, top: 4380, width: 720, height: 620 },
  { left: 70, top: 4970, width: 770, height: 770 },
  { left: 700, top: 5680, width: 1120, height: 700 },
];

const DESKTOP_STOPS = [
  { scroll: 300, x: 404, y: 498, images: [0] },
  { scroll: 995, x: 974, y: 1156, images: [1] },
  { scroll: 1340, x: 561, y: 1521, images: [2] },
  { scroll: 1729, x: 159, y: 1859, images: [3] },
  { scroll: 1923, x: 910, y: 2081, images: [4] },
  { scroll: 2190, x: 533, y: 2332, images: [5] },
  { scroll: 2410, x: 192, y: 2551, images: [6] },
  { scroll: 2645, x: 781, y: 2889, images: [7] },
];

const MOBILE_STOPS = MOBILE_IMAGES.map((image, index) => ({
  scroll: image.top + image.height * 0.42,
  x: image.left + image.width / 2,
  y: image.top + image.height / 2,
  images: [index],
}));

const withBounds = (stops, images) => stops.map((stop, index) => ({
  ...stop,
  bounds: {
    left: images[index].left,
    top: images[index].top,
    right: images[index].left + images[index].width,
    bottom: images[index].top + images[index].height,
  },
}));

const createSmoothPath = (points) => {
  if (!points.length) return '';
  let path = `M ${points[0].x} 0 L ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index++) {
    const current = points[index];
    const next = points[index + 1];
    const middleY = (current.y + next.y) / 2;
    path += ` C ${current.x} ${middleY}, ${next.x} ${middleY}, ${next.x} ${next.y}`;
  }
  const last = points[points.length - 1];
  return `${path} C ${last.x} ${last.y + 120}, 960 ${last.y + 180}, 960 ${MOBILE_HEIGHT}`;
};

export default function SpaceMiddleSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const highlightWordRef = useRef(null);
  const lightRef = useRef(null);
  const trailCanvasRef = useRef(null);
  const motionPathRef = useRef(null);
  const imageRefs = useRef([]);
  const heroRef = useRef(null);
  const heroDimRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const isMobile = viewportWidth < 768;
  const containerHeight = isMobile ? MOBILE_HEIGHT : DESKTOP_HEIGHT;
  const imageLayout = isMobile ? MOBILE_IMAGES : DESKTOP_IMAGES;
  const mobilePath = createSmoothPath(MOBILE_STOPS);

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
    const wordChangeEnd = isMobile ? 6050 : isTablet ? 2250 : 3133;

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

    const IMAGE8_DESIGN_TOP = viewportWidth < 768 ? MOBILE_IMAGES[7].top : 2645;
    const isMobile = viewportWidth < 768;
    const image8TriggerPosition = isMobile
      ? IMAGE8_DESIGN_TOP + MOBILE_IMAGES[7].height / 2
      : IMAGE8_DESIGN_TOP;
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
      start: () =>
        `top+=${image8TriggerPosition * scale}px ${isMobile ? 'center' : '8%'}`,
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
      // 아래로 빠져나갈 때(스크롤 점프 포함) 끝상태(풀스크린+딤)를 강제 →
      // scrub가 중간값에서 멈춰 hero가 유령처럼 떠있는 현상 방지
      onLeave: () => {
        hero.style.opacity = '1';
        setProgress(1);
      },
      // 방어: 새로고침/refresh 시 핀 구간 밖(progress 0)이면 hero/dim 강제 숨김
      // → 중간상태로 박히는(반투명/유령) 현상 방지
      onRefresh: (self) => {
        if (self.progress <= 0) {
          hero.style.opacity = '0';
          dim.style.opacity = '0';
        }
      },
      onUpdate: (self) => setProgress(self.progress)
    });

    return () => st.kill();
  }, [scale, viewportWidth]);

  // A small light follows a curved route, pauses at each image, sparkles,
  // and then switches that image on.
  useEffect(() => {
    const section = sectionRef.current;
    const light = lightRef.current;
    const trailCanvas = trailCanvasRef.current;
    const motionPath = motionPathRef.current;
    if (!section || !light || !trailCanvas || !motionPath) return;

    const trailContext = trailCanvas.getContext('2d');
    const trailPoints = [];
    trailCanvas.width = 1920;
    trailCanvas.height = isMobile ? MOBILE_HEIGHT : DESKTOP_HEIGHT;

    const CONTAINER_HEIGHT = isMobile ? MOBILE_HEIGHT : DESKTOP_HEIGHT;
    const DESIGN_WIDTH = 1920;
    const stops = isMobile
      ? withBounds(MOBILE_STOPS, MOBILE_IMAGES)
      : withBounds(DESKTOP_STOPS, DESKTOP_IMAGES);

    const HOLD_BEFORE = 70;
    const HOLD_AFTER = 120;
    const revealed = new Set();
    const revealCalls = new Map();
    let currentPathProgress = 0;
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
    const totalPathLength = motionPath.getTotalLength();
    const positionLight = (pathProgress) => {
      const pathLength = totalPathLength * pathProgress;
      const point = motionPath.getPointAtLength(pathLength);
      const tangentDistance = 2;
      const before = motionPath.getPointAtLength(
        Math.max(0, pathLength - tangentDistance)
      );
      const after = motionPath.getPointAtLength(
        Math.min(totalPathLength, pathLength + tangentDistance)
      );
      const rotation =
        Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI;

      gsap.set(light, {
        x: point.x,
        y: point.y,
        xPercent: -50,
        yPercent: -50,
        rotation,
        transformOrigin: '50% 50%',
      });

      return point;
    };
    // ⚡ 패스를 한 번만 샘플링해서 캐시.
    //   (이전엔 stop마다 1200번씩 getPointAtLength 호출 → 8 stop × 1200 ≈ 9,600번.
    //    getPointAtLength가 비싼 SVG 기하계산이라, mount 때 동기로 9,600번 = 메인스레드 3초 블로킹 = 첫 로딩 렉의 주범.)
    //   이제 1,200번만 호출하고 각 stop은 캐시된 점들 중 최근접만 탐색 → 결과·연출 100% 동일, 호출 8배↓.
    const samples = 1200;
    const sampledPoints = [];
    for (let sample = 0; sample <= samples; sample++) {
      const length = totalPathLength * sample / samples;
      sampledPoints.push({ length, point: motionPath.getPointAtLength(length) });
    }
    const stopPathLengths = stops.map(stop => {
      let closestLength = 0;
      let closestDistance = Infinity;
      for (let i = 0; i < sampledPoints.length; i++) {
        const { length, point } = sampledPoints[i];
        const distance = Math.hypot(point.x - stop.x, point.y - stop.y);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestLength = length;
        }
      }
      return closestLength;
    });

    const getPathProgress = scrollY => {
      if (scrollY <= stops[0].scroll - HOLD_BEFORE) {
        const progress = Math.max(0, scrollY / (stops[0].scroll - HOLD_BEFORE));
        return stopPathLengths[0] * smooth(progress) / totalPathLength;
      }

      for (let index = 0; index < stops.length; index++) {
        const stop = stops[index];
        const arrival = stop.scroll - HOLD_BEFORE;
        const departure = stop.scroll + HOLD_AFTER;
        if (scrollY <= departure && scrollY >= arrival) {
          return stopPathLengths[index] / totalPathLength;
        }

        const next = stops[index + 1];
        if (next && scrollY < next.scroll - HOLD_BEFORE) {
          const start = departure;
          const end = next.scroll - HOLD_BEFORE;
          const progress = Math.max(0, Math.min(1, (scrollY - start) / (end - start)));
          const eased = smooth(progress);
          const pathLength =
            stopPathLengths[index] +
            (stopPathLengths[index + 1] - stopPathLengths[index]) * eased;
          return pathLength / totalPathLength;
        }
      }

      return stopPathLengths[stopPathLengths.length - 1] / totalPathLength;
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
      // On mobile, reveal each image while it is still below the sticky
      // headline. Using screen pixels here made the reveal happen after the
      // image had already travelled behind and above the text.
      const viewportOffset = isMobile
        ? 2450
        : (window.innerHeight * viewportRatio) / renderedScale;
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
      const targetPathProgress = getPathProgress(activeScroll);
      currentPathProgress += (targetPathProgress - currentPathProgress) * 0.12;

      const currentPathLength = totalPathLength * currentPathProgress;
      const currentPoint = positionLight(currentPathProgress);
      const currentX = currentPoint.x;
      const currentY = currentPoint.y;

      const lastTrailPoint = trailPoints[trailPoints.length - 1];
      if (
        !lastTrailPoint ||
        Math.hypot(currentX - lastTrailPoint.x, currentY - lastTrailPoint.y) > 3
      ) {
        trailPoints.push({ x: currentX, y: currentY, life: 1 });
      } else {
        lastTrailPoint.x = currentX;
        lastTrailPoint.y = currentY;
        lastTrailPoint.life = 1;
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

        // Finish the curve at the exact light position. The midpoint-based
        // smoothing above otherwise leaves the visible line trailing behind.
        const latest = trailPoints[trailPoints.length - 1];
        const previous = trailPoints[trailPoints.length - 2];
        trailContext.beginPath();
        trailContext.moveTo(
          (previous.x + latest.x) / 2,
          (previous.y + latest.y) / 2
        );
        trailContext.quadraticCurveTo(
          latest.x,
          latest.y,
          currentX,
          currentY
        );
        trailContext.strokeStyle = `rgba(255, 205, 132, ${latest.life * 0.34})`;
        trailContext.lineWidth = 2.2;
        trailContext.shadowColor =
          `rgba(255, 231, 184, ${latest.life * 0.272})`;
        trailContext.shadowBlur = 7;
        trailContext.stroke();
        trailContext.shadowBlur = 0;
      }

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

      stops.forEach((stop, index) => {
        const distanceFromStop =
          Math.abs(currentPathLength - stopPathLengths[index]);
        if (
          activeScroll >= stop.scroll - HOLD_BEFORE &&
          activeScroll <= stop.scroll + HOLD_AFTER &&
          distanceFromStop < 8
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
      currentPathProgress = getPathProgress(lightProgress);
      positionLight(currentPathProgress);
    };
    window.addEventListener('resize', handleResize);

    rafId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafId);
      flashCall?.kill();
      revealCalls.forEach(call => call.kill());
      window.removeEventListener('resize', handleResize);
    };
  }, [scale, isMobile]);

  return (
    <section id="brand" className={styles.section} ref={sectionRef}>

      <div
        ref={containerRef}
        className={styles.container}
        style={{
          zoom: scale,
          height: containerHeight,
          margin: scale < 1 ? '0' : '0 auto',
        }}
      >

        {/* Small travelling light with a short, faint tail */}
        <svg
          className={styles.motionPathSvg}
          style={{ height: containerHeight }}
          viewBox={`0 0 1920 ${containerHeight}`}
          aria-hidden="true"
        >
          <path
            ref={motionPathRef}
            d={isMobile ? mobilePath : `
              M 404 0
              C 390 210, 360 390, 404 498
              C 445 650, 1110 760, 974 1156
              C 920 1320, 690 1340, 561 1521
              C 430 1690, 80 1690, 159 1859
              C 245 2025, 1060 1870, 910 2081
              C 790 2240, 630 2170, 533 2332
              C 450 2470, 120 2390, 192 2551
              C 260 2705, 910 2670, 781 2889
              C 720 2990, 680 3060, 760 3133
            `}
          />
        </svg>
        <canvas
          ref={trailCanvasRef}
          className={styles.lightTrailCanvas}
          style={{ height: containerHeight }}
          aria-hidden="true"
        />
        <div ref={lightRef} className={styles.travelLight} aria-hidden="true">
          <span className={styles.lightTail} />
          <span className={styles.lightCore} />
        </div>

        {/* Images */}
        <div ref={el => imageRefs.current[0] = el} className={styles.imgWrapper} style={imageLayout[0]}>
          <img src={img1} alt="Space 1" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[1] = el} className={styles.imgWrapper} style={imageLayout[1]}>
          <img src={img2} alt="Space 2" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[2] = el} className={styles.imgWrapper} style={imageLayout[2]}>
          <img src={imgGif} alt="Space GIF" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[3] = el} className={styles.imgWrapper} style={imageLayout[3]}>
          <img src={img14} alt="Space 14" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[4] = el} className={styles.imgWrapper} style={imageLayout[4]}>
          <img src={img4} alt="Space 4" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[5] = el} className={styles.imgWrapper} style={imageLayout[5]}>
          <img src={img6} alt="Space 6" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[6] = el} className={styles.imgWrapper} style={imageLayout[6]}>
          <img src={img15} alt="Space 15" className={styles.image} />
        </div>

        <div ref={el => imageRefs.current[7] = el} className={styles.imgWrapper} style={imageLayout[7]}>
          <img src={img8} alt="Space 8" className={styles.imageReduced} />
        </div>

        {/* Central Text Block Wrapper for Sticky */}
        <div className={styles.textStickyTrack}>
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
