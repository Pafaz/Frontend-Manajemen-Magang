import { useEffect, useRef } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        ease: "power2.out",
        duration: 0.1,
      });
    };

    const handleHover = () => {
      gsap.to(cursorRef.current, {
        scale: 2,
        duration: 0.3,
        borderColor: "#0077FF",
      });
    };

    const handleLeave = () => {
      gsap.to(cursorRef.current, {
        scale: 1,
        duration: 0.3,
        borderColor: "#00AAFF",
      });
    };

    const handleClick = () => {
      gsap.to(cursorRef.current, {
        scale: 2,
        duration: 0.1,
        borderColor: "#00AAFF",
      });
    };

    const handleRelease = () => {
      gsap.to(cursorRef.current, {
        scale: 1,
        duration: 0.2,
        borderColor: "#00AAFF",
      });
    };

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("mouseup", handleRelease);

    document.querySelectorAll("a, button, input").forEach((el) => {
      el.addEventListener("mouseenter", handleHover);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("mouseup", handleRelease);

      document.querySelectorAll("a, button, input").forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed w-6 h-6 border-[2px] border-[#00AAFF] rounded-full pointer-events-none z-[9999999999]"
      style={{
        transform: "translate(-50%, -50%)",
        backgroundColor: "transparent",
        boxShadow: "0 0 5px rgba(0, 170, 255, 0.5)",
      }}
    />
  );
};

export default CustomCursor;
