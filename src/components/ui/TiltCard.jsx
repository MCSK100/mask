import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";

/**
 * TiltCard
 * Adds a 3D tilt-on-hover effect with a subtle glare highlight.
 * Wrap any content in this component to get the interactive depth effect
 * popularized by premium landing pages (e.g. utopiatokyo.com).
 */
export default function TiltCard({
  children,
  className = "",
  maxTilt = 14,
  glare = true,
}) {
  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const px = useMotionValue(50);
  const py = useMotionValue(50);

  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const glareBackground = useMotionTemplate`radial-gradient(600px circle at ${px}% ${py}%, rgba(255,255,255,0.10), transparent 45%)`;

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    px.set((x / rect.width) * 100);
    py.set((y / rect.height) * 100);
    rotateY.set(((x / rect.width) - 0.5) * 2 * maxTilt);
    rotateX.set(-((y / rect.height) - 0.5) * 2 * maxTilt);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    px.set(50);
    py.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={`relative ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glareBackground, mixBlendMode: "overlay" }}
        />
      )}
    </motion.div>
  );
}
