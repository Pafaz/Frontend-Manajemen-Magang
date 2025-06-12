import { useState, useEffect, useRef } from "react";

const StatsSection = () => {
  const stats = [
    { number: 3900, label: "Perusahaan Terdaftar" },
    { number: 100, label: "Lowongan Magang" },
    { number: 17500, label: "Magang Selesai dan Sukses" },
    { number: 1000, label: "Siswa/Mahasiswa Terdaftar" },
  ];

  return (
    <section className="bg-[#144564] text-white py-10 relative z-[55]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <StatCard key={index} number={stat.number} label={stat.label} />
        ))}
      </div>
    </section>
  );
};

const StatCard = ({ number, label }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
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

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [number, hasAnimated]);

  return (
    <div ref={ref}>
      <h3 className="text-3xl font-extrabold">{count.toLocaleString()}+</h3>
      <p className="text-lg">{label}</p>
    </div>
  );
};

export default StatsSection;
