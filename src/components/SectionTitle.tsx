import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export const SectionTitle = ({ title }: { title: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-screen"
    >
      <h2 className="text-3xl lg:text-4xl font-bold text-sky-800 text-center">
        {title}
      </h2>
    </motion.div>
  );
};
