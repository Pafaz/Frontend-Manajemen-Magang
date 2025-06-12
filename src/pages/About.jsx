import { motion } from "framer-motion";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import About_us from "../components/section/section_abouts/About_us";
import Counter from "../components/section/section_abouts/Counter";
import Testimonials from "../components/section/section_abouts/testimonials";
import WhyUsSection from "../components/section/section_abouts/WhyUsSection";

// Variants untuk fade up
const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const About = () => {
  return (
    <>
      <Banner
        title="Tentang Kami"
        subtitle="Beranda → Tentang Kami"
        backgroundImage="/assets/img/banner/study_tim.jpg"
        possitionIlustration={`right-0 top-18 w-full h-screen z-10`}
        ilustration={`ilustration_blue`}
      />

      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <About_us />
      </motion.div>

      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <WhyUsSection />
      </motion.div>

      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Counter />
      </motion.div>

      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Testimonials />
      </motion.div>
    </>
  );
};

export default About;
