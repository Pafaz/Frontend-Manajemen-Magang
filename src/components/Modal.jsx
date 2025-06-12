import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, title, children, size = "medium", customClass = "" }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const modalSizeClasses = {
    small: "w-1/5",
    medium: "w-1/4",
    large: "w-1/3",
    ExtraLarge: "w-1/2",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[9999999] bg-black/[0.6]"
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`bg-white rounded-lg shadow-lg overflow-hidden ${modalSizeClasses[size]} ${customClass}`}
          >
            <div className="flex justify-between items-center p-4 border-b border-b-gray-300/[0.5]">
              <h2 className="text-xl text-gray-800 font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
