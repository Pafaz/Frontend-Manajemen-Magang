import { motion } from "framer-motion";
import Banner from "../components/Banner";
import Vacancy2 from "../components/section/Vacancy2";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const Lowongan = () => {
  return (
    <>
      <Banner
        title="Lowongan"
        subtitle="Beranda → Lowongan"
        backgroundImage="/assets/img/banner/study_tim.jpg"
        possitionIlustration={`right-0 top-18 w-full h-screen z-10`}
        ilustration={`ilustration_blue`}
      />
      <motion.div
        className="pl-20"
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Vacancy2 />
      </motion.div>
    </>
  );
};

export default Lowongan;
