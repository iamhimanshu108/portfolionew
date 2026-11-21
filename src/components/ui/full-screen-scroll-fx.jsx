import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';

export function FullScreenScrollFX({ children, sections, showProgress = true }) {
  const stageRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start start', 'end start'] });
  useMotionValueEvent(scrollYProgress, 'change', (value) => setActiveIndex(Math.min(sections.length - 1, Math.floor(value * sections.length))));

  return <div ref={stageRef} className="hero-scroll-stage">
    <div className="hero-scroll-sticky">
      <div className="hero-scroll-scenes" aria-hidden="true">
        {sections.map((section, index) => {
          const start = index / sections.length;
          const end = (index + 1) / sections.length;
          const opacityInput = index === 0
            ? [0, end, Math.min(1, end + 0.08)]
            : index === sections.length - 1
              ? [Math.max(0, start - 0.08), start, 1]
              : [Math.max(0, start - 0.08), start, end, Math.min(1, end + 0.08)];
          const opacityOutput = index === 0 || index === sections.length - 1 ? [1, 1, 0] : [0, 1, 1, 0];
          const opacityMotion = useTransform(scrollYProgress, opacityInput, opacityOutput);
          const scaleMotion = useTransform(scrollYProgress, [start, end], [1.08, 1]);
          const opacity = reduceMotion ? (index === 0 ? 1 : 0) : opacityMotion;
          const scale = reduceMotion ? 1 : scaleMotion;
          return <motion.div key={section.id ?? index} className="hero-scroll-scene" style={{ opacity, scale, background: section.background }}>
            <div className="hero-scroll-scene-wash" />
            <span className="hero-scroll-scene-label">{section.label}</span>
          </motion.div>;
        })}
      </div>
      {typeof children === 'function' ? children({ activeIndex, section: sections[activeIndex] }) : children}
      {showProgress && <div className="hero-scroll-progress" aria-hidden="true">{sections.map((section, index) => <motion.span key={section.id ?? index} style={{ scaleX: useTransform(scrollYProgress, [index / sections.length, (index + 1) / sections.length], [0, 1]) }} />)}</div>}
    </div>
  </div>;
}
