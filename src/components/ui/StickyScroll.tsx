import React, { useRef, useState, useEffect } from "react";
import {
  useMotionValueEvent,
  useScroll,
  motion,
  AnimatePresence,
} from "framer-motion";
import { cn } from "../../lib/utils";

export const StickyScroll = ({
  content,
}: {
  content: {
    title: string;
    description: string;
    image?: string;
    sectionTitle?: string;
  }[];
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const [showSticky, setShowSticky] = useState(false);
  const [hideContent, setHideContent] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start end", "end start"],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const clamped = Math.min(Math.max(latest, 0), 1);
    const step = 1 / content.length;

    let index = Math.floor(clamped / step);
    index = Math.min(index, content.length - 1);

    setActiveCard(index);
  });

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrollTop = Math.min(
        Math.max(-rect.top, 0),
        totalHeight - viewportHeight
      );
      const scrollProgress = scrollTop / (totalHeight - viewportHeight);

      const stepCount = content.length;
      const overshoot = 0.02;
      const progressPerCard = (1 - overshoot) / stepCount;

      let index = Math.floor((scrollProgress - overshoot) / progressPerCard);
      index = Math.max(0, Math.min(index, stepCount - 1));

      setActiveCard(index);

      const isAlmostDone = scrollProgress > 0.995 && index === stepCount - 1;
      const isExiting = rect.bottom <= viewportHeight * 0.2 && isAlmostDone;
      const isInViewport = rect.top <= 0 && rect.bottom > 0;

      setHideContent(isExiting);
      setShowSticky(isInViewport);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [content.length]);

  const gradientBgColors = [
    "bg-white",
  ];

  const textColors = [
    "text-gray-900",
  ];

  return (
    <div className="relative w-full">
      <div ref={scrollContainerRef} className="h-[1100vh] bg-white">
        <div
          className={cn(
            "sticky top-0 h-screen w-full flex items-center justify-center px-8 z-20 transition-opacity duration-300",
            showSticky ? "opacity-100" : "opacity-0 pointer-events-none",
            gradientBgColors[activeCard % gradientBgColors.length]
          )}
        >
          <motion.div className="absolute left-8 top-20 h-[80%] w-1 rounded-full overflow-hidden hidden lg:block">
            <div className="absolute inset-0 z-0 bg-white/5 mask-gradient pointer-events-none" />
            <motion.div
              style={{
                scaleY: scrollYProgress,
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)",
              }}
              className="w-full origin-top h-full rounded-full relative z-10"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-[length:300%_300%] animate-gradient"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, #38bdf8, #6366f1, #ec4899)",
                }}
              />
            </motion.div>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center justify-evenly w-full max-w-7xl gap-5">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {!hideContent && (
                  <motion.div
                    key={activeCard}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="my-10"
                  >
                    {content[activeCard].sectionTitle &&
                      (activeCard === 0 ||
                        content[activeCard - 1].sectionTitle !==
                          content[activeCard].sectionTitle) && (
                        <h2 className="text-2xl font-light text-sky-800 mb-10">
                          #{content[activeCard].sectionTitle}
                        </h2>
                      )}

                    <h2
                      className={`text-5xl font-bold ${
                        textColors[activeCard % textColors.length]
                      }`}
                    >
                      {content[activeCard].title}
                    </h2>
                    <p className="mt-6 text-lg text-slate-500 max-w-xl">
                      {content[activeCard].description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden lg:flex h-96 w-96 items-center justify-center">
              <AnimatePresence mode="wait">
                {!hideContent &&
                  (content[activeCard].image ? (
                    <motion.img
                      key={activeCard}
                      initial={{ opacity: 0, x: 100, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -100, scale: 0.95 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      src={`/assets/svg/${content[activeCard].image}`}
                      alt={content[activeCard].title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <p></p>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
