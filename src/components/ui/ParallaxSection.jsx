import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * ParallaxSection
 * Wraps children in a scroll-driven parallax container.
 * - `speed` controls how much the content translates on scroll (positive = up, negative = down).
 * - `opacity` optionally fades the section out as it scrolls past.
 * - `className` / `style` are forwarded to the outer sticky wrapper.
 */
export default function ParallaxSection({
  children,
  speed = 80,
  fade = false,
  className = "",
  style = {},
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const opacity = fade
    ? useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])
    : undefined;

  return (
    <div ref={ref} className={`relative ${className}`} style={style}>
      <motion.div style={{ y, opacity }} className="preserve-3d">
        {children}
      </motion.div>
    </div>
  );
}
