import { useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import AboutSection from "../components/section/Landingpage/AboutSection";
import CarierStart from "../components/section/Landingpage/CarierStart";
import Gallery from "../components/section/Landingpage/Gallery";
import HeroSection from "../components/section/Landingpage/HeroSection";
import InternshipDivisions from "../components/section/Landingpage/InternshipDivisions";
import InternshipLanding from "../components/section/Landingpage/InternshipLanding";
import MyPartner from "../components/section/Landingpage/MyPartner";
import StatsSection from "../components/section/Landingpage/StatsSection";
import Testimonials from "../components/section/Landingpage/Testimonials";
import Button from "../../src/components/Button";


const Index = () => {
  // Animasi fade-up yang akan digunakan untuk setiap section
  const fadeInUpVariants = {
    hidden: { 
      opacity: 0, 
      y: 60 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut"
      }
    }
  };

  // Wrapper component untuk animasi section
  const AnimatedSection = ({ children, delay = 0 }) => {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-50px" }}
        variants={fadeInUpVariants}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <>
      {/* Hero section tidak perlu animasi karena sudah visible saat pertama load */}
      <HeroSection />
      
      <AnimatedSection delay={0.1}>
        <AboutSection />
      </AnimatedSection>
      
      <AnimatedSection delay={0.1}>
        <InternshipDivisions />
      </AnimatedSection>
      
      <AnimatedSection delay={0.1}>
        <StatsSection />
      </AnimatedSection>
      
      <AnimatedSection delay={0.1}>
        <InternshipLanding />
      </AnimatedSection>
      
      {/* <AnimatedSection delay={0.1}>
        <Gallery />
      </AnimatedSection>
       */}
      <AnimatedSection delay={0.1}>
  <h2 className="text-center text-2xl font-semibold text-black mb-20">
    Temukan Karir yang Tepat, dengan Cepat
  </h2>
  <CarierStart />
  <div className="flex justify-center mt-8">
              <Button icon="bi-arrow-right" onClick={() => window.location.href = '/lowongan'}>
                Lihat semua lowongan
              </Button>
            </div>
</AnimatedSection>

      
      <AnimatedSection delay={0.1}>
        <MyPartner />
      </AnimatedSection>
      
      <AnimatedSection delay={0.1}>
        <Testimonials />
      </AnimatedSection>
    </>
  );
};

export default Index;