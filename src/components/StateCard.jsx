import { useEffect, useRef, useState } from "react";

const StatCard = ({ number, label }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obsever = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          let start = 0;
          const duration = 500;
          const stepTime = Math.abs(Math.floor(duration / number));

          const timer = setInterval(() => {
            start += 1;
            setCount((prev) => (prev < number ? prev + 1 : number));
            if (start >= number) clearInterval(timer);
          }, stepTime);
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) obsever.observe(ref.current);

    return () => {
      if (ref.current) obsever.unobserve(ref.current);
    };
  }, [number, hasAnimated]);

  return (
    <div className="flex-col flex gap-2" ref={ref}>
      <h1 className="font-semibold text-white text-4xl tracking-wider">
        {count.toLocaleString()}K
      </h1>
      <p className="font-light text-white text-sm">{label}</p>
    </div>
  );
};

export default StatCard;
