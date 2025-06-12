import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PartnerDetail = ({ slug }) => {
  // Data perusahaan (contoh, sebaiknya diambil dari API/database berdasarkan slug)
  const companyData = {
    name: "PT. HUMMA TEKNOLOGI INDONESIA",
    location: "Malang, Jawa Timur",
    projects: "150 Proyek+",
    website: "www.hummateknologi.co.id",
    websiteStatus: "Website Perusahaan",
    description: "PT. Humma Teknologi Indonesia adalah perusahaan yang bergerak di bidang teknologi informasi dengan fokus pada pengembangan solusi digital inovatif untuk mendukung transformasi bisnis di era industri 4.0. Kami menyediakan layanan pengembangan perangkat lunak, sistem informasi, dan integrasi teknologi sebagai solusi untuk berbagai sektor industri.",
    partners: [
      { name: "Universitas Brawijaya", logo: "/path-to-logo/univ-brawijaya.png" },
      { name: "Universitas Airlangga", logo: "/path-to-logo/univ-airlangga.png" },
      { name: "Universitas Diponegoro", logo: "/path-to-logo/univ-diponegoro.png" },
      { name: "Universitas Lainnya", logo: "/path-to-logo/univ-lainnya.png" },
    ]
  };

  // State untuk animasi
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Animasi variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  // Animasi untuk partners
  const partnerVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.05, 
      y: -5,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 300, damping: 10 }
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header dengan gambar gedung */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <img 
          src="/path-to-your-building-image.jpg" 
          alt="Company Building" 
          className="w-full h-full object-cover"
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Company card that overlaps the image */}
      <motion.div 
        className="relative mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-24 max-w-6xl"
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div 
          className="bg-white rounded-lg shadow-xl overflow-hidden"
          variants={itemVariants}
        >
          {/* Company header - blue curve background */}
          <div className="relative pt-8 pb-32 px-6 text-center">
            <motion.h1 
              className="text-2xl md:text-3xl font-bold text-gray-800 mb-10"
              variants={itemVariants}
            >
              {companyData.name}
            </motion.h1>
            
            {/* Company info in 3 columns */}
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <p className="text-sm md:text-base font-semibold text-gray-800">{companyData.location}</p>
                <p className="text-xs text-gray-500">Lokasi Perusahaan</p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <p className="text-sm md:text-base font-semibold text-gray-800">{companyData.projects}</p>
                <p className="text-xs text-gray-500">Jumlah Proyek Hingga</p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <p className="text-sm md:text-base font-semibold text-gray-800">{companyData.website}</p>
                <p className="text-xs text-gray-500">{companyData.websiteStatus}</p>
              </motion.div>
            </div>
            
            {/* Blue curve background */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-blue-800 rounded-t-full transform translate-y-12"></div>
          </div>
          
          {/* Company description */}
          <div className="bg-blue-800 px-6 pt-16 pb-12">
            <div className="max-w-4xl mx-auto">
              <motion.h2 
                className="text-xl md:text-2xl font-bold text-white mb-4 text-center"
                variants={itemVariants}
              >
                Tentang Perusahaan
              </motion.h2>
              
              <motion.p 
                className="text-white text-sm md:text-base text-center mb-16"
                variants={itemVariants}
              >
                {companyData.description}
              </motion.p>
              
              {/* Partners section */}
              <motion.div 
                className="mt-8"
                variants={itemVariants}
              >
                <div className="text-center mb-8">
                  <h3 className="font-bold text-xl text-blue-300 uppercase">MITRA KAMI</h3>
                  <p className="text-white">Tumbuh bersama: Kolaborasi menuju kesuksesan</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                  {companyData.partners.map((partner, index) => (
                    <motion.div
                      key={index}
                      className="bg-white rounded-lg p-4 flex flex-col items-center justify-center"
                      variants={partnerVariants}
                      whileHover="hover"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 p-2 rounded-full bg-gray-100 flex items-center justify-center">
                        <img 
                          src={partner.logo} 
                          alt={partner.name} 
                          className="max-w-full max-h-full"
                        />
                      </div>
                      <p className="text-xs mt-2 text-center font-medium">{partner.name}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Pagination dots */}
          <div className="bg-white py-6 flex justify-center">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PartnerDetail;