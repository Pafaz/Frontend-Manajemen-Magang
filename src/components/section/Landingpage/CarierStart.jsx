import { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, Users, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function JobListingPage() {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [jobVacancies, setJobVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  
  const jobsPerPage = 3;
  const navigate = useNavigate();

  // Utility functions
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "-";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.warn('Error formatting date:', error);
      return dateString;
    }
  }, []);

  // Data mapping function - DIPERBAIKI sesuai struktur API
  const mapJobData = useCallback((job) => {
    const defaultImage = "/assets/img/Cover.png";
    
    // Cari foto dengan type "profil_cover" dari array foto
    const coverPhoto = job.foto?.find(f => f.type === "profil_cover");
    const imageUrl = coverPhoto?.path 
      ? `${import.meta.env.VITE_API_URL_FILE}/storage/${coverPhoto.path}`
      : defaultImage;

    return {
      id: job.id,
      // Sesuaikan dengan struktur API yang flat
      title: job.divisi || "Posisi Tidak Tersedia", // langsung string, bukan job.divisi.nama
      divisiId: job.id, // gunakan job.id sebagai divisiId karena tidak ada divisi.id
      divisiNama: job.divisi || "Divisi Tidak Tersedia", // langsung string
      company: job.perusahaan || "PT. HIMIKA TEKNOLOGI INDONESIA", // langsung string
      location: `${job.kota || "Pekanbaru"}, ${job.provinsi || "Riau"}`, // gabungkan kota dan provinsi
      posted: formatDate(job.tanggal_mulai),
      closing: formatDate(job.tanggal_selesai),
      badge: "Magang",
      applicants: job.total_pendaftar || 0,
      image: imageUrl,
      duration: "6 Bulan", // default duration karena tidak ada field durasi di API
      // Tambahan untuk debugging dan sorting yang akurat
      rawPostedDate: job.tanggal_mulai,
      rawClosingDate: job.tanggal_selesai,
      createdAt: job.created_at || job.tanggal_mulai,
      updatedAt: job.updated_at,
      maxKuota: job.max_kuota,
      status: job.status
    };
  }, [formatDate]);

  // Fetch jobs data dengan perbaikan sorting
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching jobs data...'); // Debug log
      
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/lowongan-all`
      );
      
      if (!data?.data || !Array.isArray(data.data)) {
        throw new Error('Format data tidak valid');
      }
      
      console.log('Raw data received:', data.data.length, 'jobs'); // Debug log
      console.log('Sample raw data:', data.data[0]); // Debug log untuk melihat struktur
      
      // Map data terlebih dahulu
      const mappedJobs = data.data.map(mapJobData);
      
      console.log('Mapped jobs:', mappedJobs); // Debug log
      
      // Filter hanya job yang aktif (status = 1)
      const activeJobs = mappedJobs.filter(job => job.status === 1);
      
      // Sorting berdasarkan multiple criteria untuk memastikan data terbaru
      const sortedJobs = activeJobs.sort((a, b) => {
        // 1. Prioritas utama: created_at atau updated_at (jika ada)
        if (a.createdAt && b.createdAt) {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          if (dateB - dateA !== 0) return dateB - dateA;
        }
        
        // 2. Fallback: gunakan tanggal_mulai
        if (a.rawPostedDate && b.rawPostedDate) {
          const dateA = new Date(a.rawPostedDate);
          const dateB = new Date(b.rawPostedDate);
          if (dateB - dateA !== 0) return dateB - dateA;
        }
        
        // 3. Fallback terakhir: ID (asumsi ID yang lebih besar = data lebih baru)
        return b.id - a.id;
      });
      
      console.log('Sorted jobs (showing first 5):', sortedJobs.slice(0, 5)); // Debug log
      
      // Ambil 3 terbaru
      const latestJobs = sortedJobs.slice(0, 3);
      
      console.log('Latest 3 jobs selected:', latestJobs); // Debug log
      
      setJobVacancies(latestJobs);
      
      // Extract unique divisions - DIPERBAIKI
      const uniqueDivisions = [];
      const divisionNames = new Set();
      
      latestJobs.forEach(job => {
        if (job.divisiNama && !divisionNames.has(job.divisiNama)) {
          divisionNames.add(job.divisiNama);
          uniqueDivisions.push({
            id: job.divisiId,
            nama: job.divisiNama
          });
        }
      });
      
      setDivisions(uniqueDivisions.sort((a, b) => a.nama.localeCompare(b.nama)));
      
    } catch (error) {
      console.error("Gagal memuat data lowongan:", error);
      setError(
        error.code === 'ECONNABORTED' 
          ? 'Koneksi timeout. Silakan coba lagi.'
          : error.response?.data?.message || 'Gagal memuat data lowongan. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  }, [mapJobData]);

  // Filter jobs based on selected divisions
  const filteredJobs = useMemo(() => {
    if (selectedDivisions.length === 0) {
      return jobVacancies;
    }
    return jobVacancies.filter(job => selectedDivisions.includes(job.divisiId));
  }, [selectedDivisions, jobVacancies]);

  const currentJobs = filteredJobs;

  // Effects
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Event handlers
  const handleDivisionChange = useCallback((divisionId) => {
    setSelectedDivisions(prev => {
      if (prev.includes(divisionId)) {
        return prev.filter(id => id !== divisionId);
      } else {
        return [...prev, divisionId];
      }
    });
  }, []);

  const handleViewDetail = useCallback((jobId) => {
    if (!jobId) {
      console.error('Job ID tidak valid');
      return;
    }
    navigate(`/vacancy/${jobId}`);
  }, [navigate]);

  const handleRetry = useCallback(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-6 pl-24 min-h-56 max-w-sm mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 w-32 h-28 bg-gray-200 animate-pulse rounded-xl" />
          <div className="flex flex-col h-full">
            <div className="mb-1 ml-8">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse mb-1" />
              <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse mb-3" />
            </div>
            <div className="h-5 bg-gray-200 rounded w-full animate-pulse mb-3" />
            <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse mt-auto" />
            <div className="mt-4 flex justify-end">
              <div className="h-8 bg-gray-200 rounded w-28 anime-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render error state
  const renderError = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-12">
      <AlertCircle className="h-16 w-16 text-red-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">Gagal Memuat Data</h3>
      <p className="text-gray-500 text-sm text-center mb-4 max-w-md">{error}</p>
      <button
        onClick={handleRetry}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  );

  // Render empty state
  const renderEmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-12">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-16 w-16 text-gray-300 mb-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
      </svg>
      <h3 className="text-lg font-medium text-gray-700">Tidak ada lowongan tersedia</h3>
      <p className="text-gray-500 text-sm mt-1">
        {selectedDivisions.length > 0 
          ? 'Tidak ada lowongan untuk filter yang dipilih. Coba ubah filter pencarian.'
          : 'Belum ada lowongan tersedia saat ini. Silakan coba lagi nanti.'
        }
      </p>
    </div>
  );

  // Render job card dengan debug info
  const renderJobCard = (job) => (
    <article key={job.id} className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-2 pl-20 min-h-56 max-w-sm mx-auto">
      {/* Debug info - bisa dihapus setelah debugging selesai
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs p-1 rounded">
          ID: {job.id} | Status: {job.status}
        </div>
      )} */}
      
      {/* Company Image */}
      <div className="absolute left-0 top-1/4 -translate-y-1/2 -translate-x-1/4 w-32 h-28">
        <img 
          src={job.image} 
          alt={`Logo ${job.company}`}
          className="w-full h-full object-cover rounded-xl shadow-md"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/assets/img/Cover.png";
          }}
        />
      </div>
      
      {/* Job Details */}
      <div className="flex flex-col h-full">
        <div className="mb-1 ml-8">
          <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">{job.company}</h4>
          <div className="flex items-center gap-1 text-gray-600 mb-2">
            <MapPin size={12} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
            <span className="text-xs">{job.location}</span>
          </div>
          <div className="text-xs text-gray-700 mb-2">
            <time dateTime={job.posted}>{job.posted}</time> - <time dateTime={job.closing}>{job.closing}</time>
          </div>
          <div className="inline-block bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full mb-3">
            {job.duration}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 mb-3 -ml-8 line-clamp-2">{job.title}</h3>
        
        <div className="flex items-center text-gray-700 mt-auto -ml-8">
          <Users size={12} className="mr-2 text-gray-500 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm">{job.applicants} Pelamar</span>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button 
            className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white py-2 px-4 rounded-lg text-xs font-medium transition-colors flex items-center"
            onClick={() => handleViewDetail(job.id)}
            aria-label={`Lihat detail lowongan ${job.title} di ${job.company}`}
          >
            VIEW VACANCY
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="ml-2"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  );

  return (
    <div className="flex-1">
      {/* Debug panel - bisa dihapus setelah debugging selesai
      {process.env.NODE_ENV === 'development' && !loading && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800">Debug Info:</h4>
          <p className="text-sm text-yellow-700">
            Total jobs loaded: {jobVacancies.length} | 
            Filtered jobs: {filteredJobs.length} | 
            Current jobs displayed: {currentJobs.length}
          </p>
          {jobVacancies.length > 0 && (
            <div className="mt-2 text-xs text-yellow-600">
              Jobs order: {jobVacancies.map(job => `#${job.id}(${job.company})`).join(', ')}
            </div>
          )}
        </div>
      )} */}
      
      {loading && renderLoadingSkeleton()}
      
      {error && !loading && renderError()}
      
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentJobs.length > 0 ? (
              currentJobs.map(renderJobCard)
            ) : (
              renderEmptyState()
            )}
          </div>
        </>
      )}
    </div>
  );
}