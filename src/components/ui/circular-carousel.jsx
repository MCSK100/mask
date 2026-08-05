"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CircularCarousel({
  items,
  activeIndex: controlledIndex,
  onActiveChange,
  autoPlay = true,
  autoPlayInterval = 4000,
  className,
}) {
  const [internalIndex, setInternalIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  const activeIndex = controlledIndex ?? internalIndex;
  const total = items.length;

  const goTo = useCallback(
    (index) => {
      const newIndex = ((index % total) + total) % total;
      if (controlledIndex === undefined) {
        setInternalIndex(newIndex);
      }
      onActiveChange?.(newIndex);
    },
    [total, controlledIndex, onActiveChange],
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (!autoPlay || isHovered || isFocused) return;
    intervalRef.current = setInterval(next, autoPlayInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, autoPlayInterval, isHovered, isFocused, next]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    const el = containerRef.current;
    el?.addEventListener("keydown", handler);
    return () => el?.removeEventListener("keydown", handler);
  }, [next, prev]);

  const activeItem = items[activeIndex];

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Circular carousel"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn(
        "relative flex flex-col items-center justify-center gap-8 outline-none",
        className,
      )}
    >
      {/* Circular track */}
      <div className="relative h-[280px] w-full max-w-lg">
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => {
            const offset = ((i - activeIndex) % total + total) % total;
            const adjusted =
              offset > Math.floor(5 / 2) ? offset - total : offset;
            const angle = (adjusted / 5) * Math.PI;
            const x = Math.sin(angle) * 220;
            const y = -Math.cos(angle) * 100;
            const distance = Math.abs(adjusted);
            const maxDistance = Math.floor(5 / 2) + 1;
            const scale = Math.max(0, 1 - (distance / maxDistance) * 0.3);
            const opacity = Math.max(0.3, 1 - (distance / maxDistance) * 0.7);
            const zIndex = 5 - distance;

            const isActive = i === activeIndex;

            return (
              <motion.button
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  x,
                  y,
                  scale,
                  opacity,
                  zIndex,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => goTo(i)}
                aria-label={item.title}
                aria-selected={isActive}
                role="option"
                className={cn(
                  "absolute left-1/2 top-1/2 flex h-32 w-48 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-start justify-between rounded-2xl border p-4 backdrop-blur-sm transition-[box-shadow,border-color] duration-300",
                  "border-purple-500/20 bg-gradient-to-b from-slate-900/90 via-purple-950/60 to-slate-900/90",
                  isActive
                    ? "border-purple-400/50 shadow-[0_0_30px_-6px_rgba(168,85,247,0.7)]"
                    : "border-white/10 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.3)] hover:border-cyan-400/40 hover:shadow-[0_0_20px_-6px_rgba(34,211,238,0.5)]",
                )}
                style={{ transformOrigin: "center center" }}
              >
                {item.tag && (
                  <span className="rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-purple-300">
                    {item.tag}
                  </span>
                )}
                <div className="w-full">
                  <h3
                    className={cn(
                      "font-semibold leading-tight transition-colors duration-300",
                      isActive
                        ? "bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent text-base"
                        : "text-white/80 text-sm",
                    )}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-1 line-clamp-2 text-xs leading-relaxed transition-colors duration-300",
                      isActive ? "text-white/60" : "text-white/40",
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Center content */}
      <motion.div
        key={activeItem.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
      >
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
        <span className="mt-1 text-xs text-white/40">
          of {String(total).padStart(2, "0")}
        </span>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={prev}
          aria-label="Previous item"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 backdrop-blur-sm transition-colors hover:bg-purple-500/20 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-400/40"
        >
          <ChevronLeft className="size-5" />
        </motion.button>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5" role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === activeIndex
                  ? "w-6 bg-gradient-to-r from-purple-400 to-pink-400"
                  : "w-1.5 bg-white/20 hover:bg-cyan-400/50",
              )}
              aria-label={`Go to item ${i + 1}`}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={next}
          aria-label="Next item"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 backdrop-blur-sm transition-colors hover:bg-purple-500/20 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-400/40"
        >
          <ChevronRight className="size-5" />
        </motion.button>
      </div>
    </div>
  );
}

export default CircularCarousel;
