import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import React,{ useRef, useState } from "react";

type Step = {
  title: string;
  description: string;
};

export const ScrollStepCards = ({ steps }: { steps: Step[] }) => {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.floor(latest * steps.length);
    setActiveStep(Math.min(steps.length - 1, Math.max(0, index)));
  });

  return (
    <div ref={containerRef} className="h-[500vh] bg-white">
      <div className="sticky top-0 h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-3xl h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full h-full"
            >
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                {steps[activeStep].title}
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                {steps[activeStep].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
