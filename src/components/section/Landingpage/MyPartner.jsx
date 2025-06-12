import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Button from "../../Button";
import LogoCompany from "../../LogoCompany";

const MyPartner = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [width, setWidth] = useState(0);
  const carousel = useRef();

  // Konfigurasi API
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // Fetch data mitra dari API
  const fetchMitraData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/mitra-all`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });

      console.log("API Response:", response.data);

      if (response.data.status === "success") {
        // Transform data untuk mendapatkan foto profile
        const transformedData = response.data.data.map(mitra => {
          return {
            id: mitra.id,
            name: mitra.nama,
            slug: mitra.nama.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            profileImage: mitra.foto?.find(f => f.type === 'profile')?.path
              ? `${import.meta.env.VITE_API_URL_FILE}/storage/${mitra.foto.find(f => f.type === 'profile').path}`
              : "/api/placeholder/40/40"
          };
        });

        console.log("Transformed Data:", transformedData);
        setData(transformedData);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching mitra data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMitraData();
  }, []);

  useEffect(() => {
    if (carousel.current && data.length > 0) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
  }, [data]);

  // Navigasi ke halaman detail partner berdasarkan ID
  const handleCompanyClick = (mitraId) => {
    console.log("Navigating to mitra detail with ID:", mitraId);
    
    // Pastikan mitraId tidak null atau undefined
    if (!mitraId) {
      console.error("Mitra ID is null or undefined");
      return;
    }
    
    // Simpan mitraId ke localStorage untuk digunakan di halaman detail
    localStorage.setItem("mitraId", mitraId.toString());
    
    // Navigasi ke halaman detail mitra
    // Pilih salah satu metode navigasi sesuai dengan routing yang digunakan:
    
    // 1. Menggunakan window.location (universal)
    window.location.href = `/mitradetails/${mitraId}`;
    
    // 2. Jika menggunakan React Router, uncomment baris berikut:
    // import { useNavigate } from 'react-router-dom';
    // const navigate = useNavigate();
    // navigate(`/mitradetails/${mitraId}`);
    
    // 3. Jika menggunakan Next.js, uncomment baris berikut:
    // import { useRouter } from 'next/router';
    // const router = useRouter();
    // router.push(`/mitradetails/${mitraId}`);
  };

  // Logo dengan animasi hover dan klik
  const AnimatedLogo = ({ company }) => {
    console.log("AnimatedLogo - Company:", company.name, "ID:", company.id, "Image URL:", company.profileImage);
    
    return (
      <motion.div
        className="px-4 flex items-center justify-center min-w-40 cursor-pointer"
        whileHover={{
          scale: 1.1,
          y: -10,
          
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Clicked on company:", company.name, "with ID:", company.id);
          handleCompanyClick(company.id);
        }}
      >
        {/* Tampilkan gambar dengan fallback */}
        <div className="flex flex-col items-center">
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src={company.profileImage} 
              alt={company.name}
              className="w-30 h-30 object-contain mb-2 cursor-pointer transform transition-transform hover:scale-105"
              onError={(e) => {
                console.error("Image failed to load:", company.profileImage);
                e.target.src = "/api/placeholder/40/40";
              }}
              onLoad={() => {
                console.log("Image loaded successfully:", company.profileImage);
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCompanyClick(company.id);
              }}
            />
          </div>
          
          {/* Tampilkan nama perusahaan yang juga bisa diklik */}
          <span 
            className="text-xs text-center text-gray-600 font-medium max-w-24 truncate cursor-pointer hover:text-blue-600 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCompanyClick(company.id);
            }}
          >
            {/* {company.name} */}
          </span>
        </div>
      </motion.div>
    );
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-gray-600">Memuat data mitra...</span>
    </div>
  );

  // Error component
  const ErrorMessage = () => (
    <div className="flex justify-center items-center py-12">
      <div className="text-red-500 text-center">
        <p className="text-lg font-semibold">Gagal memuat data mitra</p>
        <p className="text-sm mt-2">{error}</p>
        <button 
          onClick={fetchMitraData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );

  return (
    <section className="w-full py-12 px-6 md:px-12 lg:px-44 bg-white overflow-hidden">
      <div className="space-y-3">
        <h1 className="uppercase text-2xl text-center text-color-blue font-bold">
          Mitra Kami
        </h1>
        <p className="text-slate-800 text-center font-semibold text-xl">
          Tumbuh bersama Kolaborasi menuju kesuksesan
        </p>
      </div>

      {/* Conditional rendering berdasarkan state */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage />
      ) : data.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500 text-lg">Belum ada data mitra</p>
        </div>
      ) : (
        <>
          {/* Carousel container */}
          <motion.div 
            ref={carousel}
            className="cursor-grab overflow-x-hidden overflow-y-visible mt-8 border-y-2 border-slate-300/[0.5] py-12"
          >
            <motion.div
              drag="x"
              dragConstraints={{ right: 0, left: -width }}
              className="flex justify-center"
              whileTap={{ cursor: "grabbing" }}
            >
              {/* Tampilkan data sesuai database */}
              {data.map((company) => (
                <AnimatedLogo key={company.id} company={company} />
              ))}
            </motion.div>
          </motion.div>

          <div className="flex justify-center mt-8">
            <Button icon="bi-arrow-right" onClick={() => window.location.href = '/partners'}>
              Lihat semua mitra
            </Button>
          </div>
        </>
      )}
    </section>
  );
};

export default MyPartner;