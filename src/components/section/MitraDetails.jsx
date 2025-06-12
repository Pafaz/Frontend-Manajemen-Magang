import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom"; // Import useParams untuk mengambil ID dari URL

// Komponen Ornamen Dekoratif
const DecorativeOrb = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full bg-gradient-to-br from-blue-200 to-blue-400 opacity-20 ${className}`}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ 
      scale: [0, 1.2, 1], 
      opacity: [0, 0.3, 0.2],
      rotate: [0, 180, 360]
    }}
    transition={{ 
      duration: 3,
      delay: delay,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }}
  />
);

const FloatingDots = ({ className }) => (
  <div className={`absolute ${className}`}>
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-blue-300 rounded-full absolute"
        style={{
          left: `${(i % 3) * 20}px`,
          top: `${Math.floor(i / 3) * 20}px`
        }}
        animate={{
          y: [0, -10, 0],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration: 2,
          delay: i * 0.2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

const CurvedLine = ({ className }) => (
  <motion.svg
    className={`absolute ${className}`}
    width="120"
    height="80"
    viewBox="0 0 120 80"
    fill="none"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 0.3 }}
    transition={{ duration: 2, ease: "easeInOut" }}
  >
    <motion.path
      d="M10 70 Q 60 10 110 70"
      stroke="url(#gradient)"
      strokeWidth="2"
      fill="none"
      strokeDasharray="5,5"
    />
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.8" />
      </linearGradient>
    </defs>
  </motion.svg>
);

const CompanyProfile = () => {
  const [cabangPage, setCabangPage] = useState(0);
  const [mitraPage, setMitraPage] = useState(0);
  const [perusahaanData, setPerusahaanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 3;

  // Ambil token dari localStorage
  const token = localStorage.getItem("token");
  
  // Ambil ID dari URL parameter menggunakan useParams
  const { id: urlId } = useParams();
  
  // Fungsi untuk mendapatkan mitraId dengan prioritas: URL params > localStorage > null
  const getMitraId = () => {
    // Prioritas 1: ID dari URL parameter
    if (urlId && urlId !== "undefined" && urlId !== "null") {
      console.log("Using ID from URL params:", urlId);
      return urlId;
    }
    
    // Prioritas 2: ID dari localStorage
    const localStorageId = localStorage.getItem("mitraId");
    if (localStorageId && localStorageId !== "undefined" && localStorageId !== "null") {
      console.log("Using ID from localStorage:", localStorageId);
      return localStorageId;
    }
    
    // Tidak ada ID yang valid
    console.error("No valid mitraId found in URL or localStorage");
    return null;
  };

  const mitraId = getMitraId();

  // Fungsi untuk mengambil data perusahaan dari API
  const fetchPerusahaanData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validasi mitraId sebelum melakukan request
      if (!mitraId) {
        throw new Error("ID Mitra tidak ditemukan. Pastikan Anda mengakses halaman ini melalui link yang benar.");
      }

      console.log("Fetching data for mitra ID:", mitraId);
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/mitra/${mitraId}/detail`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("API Response status:", response.status);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Mitra tidak ditemukan. Pastikan ID yang digunakan valid.");
        } else if (response.status === 401) {
          throw new Error("Tidak memiliki akses. Silakan login terlebih dahulu.");
        } else {
          throw new Error(`Gagal mengambil data mitra (Status: ${response.status})`);
        }
      }

      const responseData = await response.json();
      console.log("API Response data:", responseData);

      if (responseData.status === "success" && responseData.data) {
        setPerusahaanData(responseData.data);
        // Simpan ID ke localStorage untuk referensi di masa depan
        localStorage.setItem("mitraId", mitraId);
      } else {
        throw new Error("Format response tidak sesuai atau data kosong");
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Hanya fetch data jika mitraId tersedia
    if (mitraId) {
      fetchPerusahaanData();
    } else {
      setLoading(false);
      setError("ID Mitra tidak ditemukan. Silakan akses halaman ini melalui daftar mitra.");
    }
  }, [mitraId]); // Dependency array termasuk mitraId

  // Tampilkan loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data perusahaan...</p>
          <p className="text-sm text-gray-400 mt-2">ID Mitra: {mitraId || "Tidak tersedia"}</p>
        </div>
      </div>
    );
  }

  // Tampilkan error state
  if (error || !perusahaanData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error || "Data tidak ditemukan"}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            ID Mitra: {mitraId || "Tidak tersedia"}
          </p>
          <div className="space-y-2">
            <button 
              onClick={() => {
                if (mitraId) {
                  fetchPerusahaanData();
                } else {
                  window.location.href = '/partners'; // Redirect ke halaman daftar mitra
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mr-2"
            >
              {mitraId ? "Coba Lagi" : "Lihat Daftar Mitra"}
            </button>
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ekstrak data dari API response
  const perusahaan = {
    nama: perusahaanData.nama,
    lokasi: `${perusahaanData.kota}, ${perusahaanData.provinsi}`,
    peserta: perusahaanData.total_peserta,
    website: perusahaanData.email, // Menggunakan email sebagai kontak
    deskripsi: perusahaanData.deskripsi,
    alamat: `${perusahaanData.alamat}, ${perusahaanData.kecamatan}, ${perusahaanData.kota}`,
    // Gambar gedung dari foto profil cover
    gambarGedung: perusahaanData.foto?.find(f => f.type === 'profil_cover')?.path
      ? `${import.meta.env.VITE_API_URL_FILE}/storage/${perusahaanData.foto.find(f => f.type === 'profil_cover').path}`
      : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    backgroundWave: "/assets/img/banner/BackgroundMitra.png",
  };

  // Data cabang dari API
  const cabangData = perusahaanData.cabang?.map(cabang => ({
    id: cabang.id,
    name: cabang.nama,
    subtitle: `${cabang.kota}, ${cabang.provinsi}`,
    bidang_usaha: cabang.bidang_usaha,
    foto: cabang.foto?.find(f => f.type === 'profile')?.path
      ? `${import.meta.env.VITE_API_URL_FILE}/storage/${cabang.foto.find(f => f.type === 'profile').path}`
      : null
  })) || [];

  // Data mitra dari API (jika ada)
  const mitraData = perusahaanData.mitra?.map(mitra => ({
    id: mitra.id,
    name: mitra.nama,
    avatar: mitra.foto?.find(f => f.type === 'logo')?.path
      ? `${import.meta.env.VITE_API_URL_FILE}/storage/${mitra.foto.find(f => f.type === 'logo').path}`
      : null
  })) || [];

  const cabangPageCount = Math.ceil(cabangData.length / itemsPerPage);
  const mitraPageCount = Math.ceil(mitraData.length / itemsPerPage);

  const cabangItems = cabangData.slice(
    cabangPage * itemsPerPage,
    (cabangPage + 1) * itemsPerPage
  );
  const mitraItems = mitraData.slice(
    mitraPage * itemsPerPage,
    (mitraPage + 1) * itemsPerPage
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <motion.div
      className="min-h-screen bg-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* Ornamen Background */}
      <DecorativeOrb className="w-32 h-32 -top-16 -right-16" delay={0} />
      <DecorativeOrb className="w-20 h-20 top-1/4 -left-10" delay={1} />
      <DecorativeOrb className="w-40 h-40 bottom-1/4 -right-20" delay={2} />
      <FloatingDots className="top-20 right-20" />
      <CurvedLine className="top-1/3 left-10" />

      {/* Hero Section */}
      <div className="relative">
        {/* Ornamen untuk Hero Section */}
        <FloatingDots className="absolute top-10 left-10 z-10" />
        <DecorativeOrb className="w-30 h-30 absolute top-20 right-20 z-10" delay={0.5} />
        
        <motion.div
          className="w-full h-90 mb-10 relative"
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={perusahaan.gambarGedung}
            alt="Gedung Perusahaan"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
            }}
          />
        </motion.div>

        <motion.div
          className="flex justify-center py-8 bg-white mb-20 relative"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Ornamen di sekitar judul */}
          <CurvedLine className="absolute -top-5 left-1/4" />
          <FloatingDots className="absolute top-5 right-1/4" />
          
          <h1 className="text-4xl font-bold text-gray-800 text-center relative z-10 mb-10">
            {perusahaan.nama}
          </h1>
        </motion.div>

        <div className="relative w-full">
          {/* <img
            src={perusahaan.backgroundWave}
            alt=""
            className="w-full h-60 object-cover"
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          /> */}
          <div className="absolute inset-x-0 top-1/4 transform -translate-y-1/2 px-4 -mt-10">
            <motion.div
              className="bg-white shadow-md rounded-lg px-8 py-6 max-w-5xl mx-auto w-full min-h-[150px] flex items-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-center w-full">
                <div>
                  <p className="font-semibold text-gray-800 mb-2 text-lg">
                    {perusahaan.lokasi}
                  </p>
                  <p className="text-gray-500 text-sm">Lokasi</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-2 text-lg">
                    {perusahaan.peserta} Peserta
                  </p>
                  <p className="text-gray-500 text-sm">Total Peserta</p>
                </div>
                
                <div>
                  <p className="font-semibold text-gray-800 mb-2 text-lg">
                    {perusahaan.website}
                  </p>
                  <p className="text-gray-500 text-sm">Email</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tentang Perusahaan */}
      <motion.div
        className="pt-12 pb-12 max-w-6xl mx-auto px-8 relative"
        initial="hidden"
        animate="visible"
        variants={listVariants}
      >
        {/* Ornamen untuk section tentang */}
        <DecorativeOrb className="w-16 h-16 absolute top-0 right-10" delay={1.5} />
        <FloatingDots className="absolute bottom-10 left-10" />
        
        <motion.h2 
          className="text-2xl font-bold text-black mb-6 text-center relative z-10 mt-10" 
          variants={{hidden: {opacity:0, y:20}, visible:{opacity:1, y:0}}}
        >
          Tentang Perusahaan
        </motion.h2>
        <motion.p 
          className="text-black leading-relaxed text-justify mb-4" 
          variants={{hidden: {opacity:0, y:20}, visible:{opacity:1, y:0}, transition: {delay:0.2}}}
        >
          {perusahaan.deskripsi}
        </motion.p>
        <motion.p 
          className="text-gray-600 leading-relaxed" 
          variants={{hidden: {opacity:0, y:20}, visible:{opacity:1, y:0}, transition: {delay:0.3}}}
        >
        </motion.p>
      </motion.div>

      {/* Cabang Kami Section */}
      <div className="bg-white py-16 relative">
        {/* Ornamen untuk section cabang */}
        <DecorativeOrb className="w-28 h-28 absolute top-10 left-10" delay={2} />
        <CurvedLine className="absolute top-20 right-20" />
        <FloatingDots className="absolute bottom-20 right-1/4" />
        
        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="text-center mb-12 relative">
            <CurvedLine className="absolute -top-5 left-1/2 transform -translate-x-1/2" />
            <h2 className="text-3xl font-bold text-[#0069AB] mb-2">CABANG KAMI</h2>
            <p className="text-2xl font-semibold text-black mb-2">
              Tumbuh bersama: Kolaborasi menuju kesuksesan
            </p>
          </div>

          {cabangData.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={cabangPage}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {cabangItems.map((cabang) => (
                    <motion.div
                      key={cabang.id}
                      className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                    >
                      <div className="w-16 h-16 bg-gray-800 rounded-lg mx-auto mb-4 flex items-center justify-center overflow-hidden">
                        {cabang.foto ? (
                          <img 
                            src={cabang.foto} 
                            alt={cabang.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <div className="w-8 h-8 bg-white rounded" style={{display: cabang.foto ? 'none' : 'block'}}></div>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{cabang.name}</h3>
                      <p className="text-sm text-gray-500 mb-1">{cabang.subtitle}</p>
                      <p className="text-xs text-blue-600">{cabang.bidang_usaha}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {cabangPageCount > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {[...Array(cabangPageCount)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCabangPage(i)}
                      className={`w-4 h-4 rounded-full ${
                        i === cabangPage ? "bg-blue-500" : "bg-gray-300"
                      } focus:outline-none transition-colors`}
                      aria-label={`Page ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">🏢</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Belum Ada Data Cabang
              </h3>
              <p className="text-gray-500">
                Informasi cabang akan ditampilkan di sini ketika tersedia.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mitra Kami Section */}
      <div className="bg-white py-10 relative">
        {/* Ornamen untuk section mitra */}
        <DecorativeOrb className="w-36 h-36 absolute top-0 right-0" delay={2.5} />
        <FloatingDots className="absolute top-1/3 left-10" />
        <CurvedLine className="absolute bottom-10 left-1/3" />
        
        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="text-center mb-12 relative">
            <FloatingDots className="absolute -top-8 left-1/2 transform -translate-x-1/2" />
            <h2 className="text-3xl font-bold text-[#0069AB] mb-2">MITRA KAMI</h2>
            <p className="text-2xl font-semibold text-black mb-2">
              Tumbuh bersama Kolaborasi menuju kesuksesan
            </p>
          </div>

          {mitraData.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={mitraPage}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {mitraItems.map((mitra) => (
                    <motion.div
                      key={mitra.id}
                      className="bg-white rounded-lg p-6 text-center transition-shadow cursor-pointer"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                    >
                      <div className="w-30 h-30 mx-auto mb-4 flex items-center justify-center text-2xl">
                        {mitra.avatar ? (
                          <img 
                            src={mitra.avatar} 
                            alt={mitra.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🏢
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-800">{mitra.name}</h3>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {mitraPageCount > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {[...Array(mitraPageCount)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setMitraPage(i)}
                      className={`w-4 h-4 rounded-full ${
                        i === mitraPage ? "bg-blue-500" : "bg-gray-300"
                      } focus:outline-none transition-colors`}
                      aria-label={`Page ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">🤝</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Belum Ada Data Mitra
              </h3>
              <p className="text-gray-500">
                Informasi mitra akan ditampilkan di sini ketika tersedia.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyProfile;