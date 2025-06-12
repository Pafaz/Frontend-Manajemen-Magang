import { motion } from "framer-motion";

const Banner = ({ title, subtitle, backgroundImage,possitionIlustration,ilustration }) => {
  return (
    <div className="relative w-full top-0 h-[425px] flex items-center justify-center text-center overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "grayscale(20%) contrast(1)",
          backgroundBlendMode: "multiply",
        }}
      />

      <div className="absolute inset-0 bg-blue-500 opacity-30 mix-blend-multiply" />

      <div className="absolute inset-0 bg-[#0F2239] opacity-75" />

      <div className="relative z-20 flex flex-col justify-center items-center top-10 gap-5 text-white px-5">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-lg md:text-xl"
        >
          {subtitle}
        </motion.p>
      </div>

      <motion.img
        src={`/assets/img/banner/${ilustration}.png`}
        alt="Illustration"
        className={`absolute ${possitionIlustration}`}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      <motion.img
        src="/assets/img/banner/grid_banner.png"
        alt="Grid Banner"
        className="absolute right-6 top-80 w-28 h-17 z-10"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      <motion.img
        src="/assets/img/banner/arrow_banner.png"
        alt="Arrow Banner"
        className="absolute left-15 top-70 object-cover z-10"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </div>
  );
};

export default Banner;
