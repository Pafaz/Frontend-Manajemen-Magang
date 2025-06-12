import { useState, useEffect, useCallback } from 'react';
import { MapPin, Users, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function JobListingPage() {
  const [filterOpen, setFilterOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobVacancies, setJobVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showMoreDivisions, setShowMoreDivisions] = useState(false);
  const jobsPerPage = 8;
  const navigate = useNavigate();
  
  // Mock API base URL - ganti dengan URL API Anda
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';
  const API_FILE_URL = import.meta.env.VITE_API_URL_FILE || 'https://files.example.com';
  
  // Fungsi untuk mengformat data lowongan dari API
  const mapJobData = (job) => ({
    id: job.id,
    title: job.divisi || "-",
    divisiId: job.id,
    divisiNama: job.divisi || "-",
    company: job.perusahaan || "Company Name",
    location: `${job.kota}, ${job.provinsi}`,
    posted: formatDate(job.tanggal_mulai),
    closing: formatDate(job.tanggal_selesai),
    badge: "Magang",
    applicants: job.total_pendaftar || 0,
    image: job.foto?.find(f => f.type === "profil_cover")?.path
      ? `${API_FILE_URL}/storage/${job.foto.find(f => f.type === "profil_cover").path}`
      : "/assets/img/Cover.png",
    duration: job.durasi ? `${job.durasi} Bulan` : "",
    createdAt: job.created_at || job.tanggal_mulai,
    updatedAt: job.updated_at || job.tanggal_selesai
  });

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  // Fungsi untuk fetch data dengan parameter tambahan
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      
      const timestamp = new Date().getTime();
      const response = await fetch(
        `${API_BASE_URL}/lowongan-all?_t=${timestamp}&sort=created_at&order=desc`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const sortedJobs = (data?.data || [])
        .sort((a, b) => new Date(b.tanggal_mulai) - new Date(a.tanggal_mulai))
        .map(mapJobData);
      
      setJobVacancies(sortedJobs);
      setFilteredJobs(sortedJobs);
      
      // PERBAIKAN: Ekstrak divisi unik berdasarkan NAMA DIVISI saja (tidak di-group)
      const uniqueDivisionNames = [...new Set(
        sortedJobs
          .filter(job => job.divisiNama && job.divisiNama !== "-")
          .map(job => job.divisiNama.toLowerCase())
      )];
      
      const uniqueDivisions = uniqueDivisionNames.map((divisionName, index) => {
        // Ambil contoh job pertama dengan divisi ini untuk mendapatkan nama asli (dengan kapitalisasi)
        const sampleJob = sortedJobs.find(job => 
          job.divisiNama && job.divisiNama.toLowerCase() === divisionName
        );
        
        return {
          id: `division-${index}`, // ID unik untuk divisi
          nama: sampleJob.divisiNama // Nama asli divisi
        };
      });
      
      setDivisions(uniqueDivisions);
      
    } catch (error) {
      console.error("Gagal memuat data lowongan:", error);
      // Fallback ke data mock jika API gagal
      const mockJobs = generateMockJobs();
      setJobVacancies(mockJobs);
      setFilteredJobs(mockJobs);
      setDivisions(generateMockDivisions());
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, API_FILE_URL]);

  // Generate mock data untuk demo
  const generateMockJobs = () => {
    const companies = ['PT. Tech Indonesia', 'CV. Digital Solutions', 'PT. Innovation Corp', 'Startup Teknologi'];
    const divisions = ['Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'Data Analyst', 'Mobile Developer'];
    const locations = ['Jakarta, DKI Jakarta', 'Bandung, Jawa Barat', 'Surabaya, Jawa Timur', 'Yogyakarta, DIY'];
    
    return Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      title: divisions[i % divisions.length],
      divisiId: i + 1,
      divisiNama: divisions[i % divisions.length],
      company: companies[i % companies.length],
      location: locations[i % locations.length],
      posted: formatDate(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)),
      closing: formatDate(new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000)),
      badge: "Magang",
      applicants: Math.floor(Math.random() * 100),
      image: `https://picsum.photos/160/144?random=${i}`,
      duration: `${Math.floor(Math.random() * 6) + 3} Bulan`,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
  };

  const generateMockDivisions = () => {
    const mockJobs = generateMockJobs();
    const uniqueDivisionNames = [...new Set(mockJobs.map(job => job.divisiNama.toLowerCase()))];
    
    return uniqueDivisionNames.map((divisionName, index) => {
      const sampleJob = mockJobs.find(job => job.divisiNama.toLowerCase() === divisionName);
      
      return {
        id: `division-${index}`,
        nama: sampleJob.divisiNama
      };
    });
  };

  // Initial fetch saja, tanpa auto-refresh
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // PERBAIKAN: Effect untuk memfilter lowongan berdasarkan nama divisi yang dipilih
  useEffect(() => {
    if (selectedDivisions.length === 0) {
      setFilteredJobs(jobVacancies);
    } else {
      // Filter berdasarkan nama divisi yang dipilih
      const selectedDivisionNames = selectedDivisions.map(divisionId => {
        const division = divisions.find(d => d.id === divisionId);
        return division ? division.nama.toLowerCase() : '';
      }).filter(name => name !== '');
      
      const filtered = jobVacancies.filter(job => 
        job.divisiNama && selectedDivisionNames.includes(job.divisiNama.toLowerCase())
      );
      
      setFilteredJobs(filtered);
    }
    setCurrentPage(1);
  }, [selectedDivisions, jobVacancies, divisions]);

  // PERBAIKAN: Fungsi untuk mengubah filter divisi
  const handleDivisionChange = (divisionId) => {
    setSelectedDivisions(prev => {
      if (prev.includes(divisionId)) {
        // Jika sudah dipilih, hapus dari selection
        return prev.filter(id => id !== divisionId);
      } else {
        // Jika belum dipilih, tambahkan ke selection
        return [...prev, divisionId];
      }
    });
  };

  // Logic untuk pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Fungsi untuk mengganti halaman
  const goToPage = (pageNumber) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  };

  // Fungsi untuk melihat detail lowongan
  const handleViewDetail = (jobId) => {
    navigate(`/lowongan/${jobId}`);
  };
  
  return (
    <div className="bg-white-100 min-h-screen p-10">
      <div className="bg-white rounded-lg p-4 mb-6 max-w-7xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Lowongan Pekerjaan</h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filter Sidebar */}
          <div className={`bg-white rounded-lg lg:w-64 relative left-[-3rem] ${filterOpen ? 'block' : 'hidden'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="font-medium">Filter</span>
              </div>
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <ChevronDown size={18} />
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3 text-gray-700">Divisi</h3>
              <div className="flex flex-col gap-2">
                {loading ? (
                  <div className="py-2 px-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                  </div>
                ) : divisions.length > 0 ? (
                  <>
                    {divisions.slice(0, showMoreDivisions ? divisions.length : 5).map((division) => {
                      const isChecked = selectedDivisions.includes(division.id);

                      return (
                        <label key={division.id} className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded text-blue-600" 
                            checked={isChecked}
                            onChange={() => handleDivisionChange(division.id)}
                          />
                          <span className="text-sm">
                            {division.nama}
                          </span>
                        </label>
                      );
                    })}

                    {divisions.length > 5 && (
                      <div className="mt-1">
                        <button 
                          onClick={() => setShowMoreDivisions(!showMoreDivisions)}
                          className="flex items-center text-gray-700 hover:text-gray-900 text-sm font-medium"
                        >
                          {showMoreDivisions ? 'Sembunyikan' : 'Lainnya'}
                          <ChevronDown size={16} className={`ml-1 transition-transform ${showMoreDivisions ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Tidak ada divisi tersedia</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Job Listings */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-6 pl-24 min-h-56 max-w-[500px] mx-auto">
                    <div className="absolute left-0 -translate-y-1/2 -translate-x-1/4 w-40 h-36 bg-gray-200 animate-pulse rounded-xl"></div>
                    <div className="flex flex-col h-full">
                      <div className="mb-1 ml-15">
                        <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse mb-3"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-full animate-pulse mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse mt-auto"></div>
                      <div className="mt-4 flex justify-end">
                        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  {currentJobs.length > 0 ? (
                    currentJobs.map((job) => (
                      <div key={job.id} className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6 pl-24 min-h-56 max-w-[500px] mx-auto">
                        <div className="absolute left-0 -translate-y-1/3 -translate-x-1/4 w-40 h-36">
                          <img 
                            src={job.image} 
                            alt={`${job.title} - Gambar`} 
                            className="w-full h-full object-cover rounded-xl shadow-md"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/160x144?text=No+Image';
                            }}
                          />
                        </div>
                        
                        <div className="flex flex-col h-full">
                          <div className="mb-1 ml-10">
                            <h4 className="text-base font-bold text-gray-900 mb-2">{job.company}</h4>
                            <div className="flex items-center gap-1 text-gray-600 mb-2">
                              <MapPin size={14} className="text-gray-400" />
                              <span className="text-xs">{job.location}</span>
                            </div>
                            <div className="text-xs text-gray-700 mb-2">
                              {job.posted} - {job.closing}
                            </div>
                          </div>
                          
                          <h3 className="text-sm font-bold text-gray-800 mb-3 -ml-22 mt-8">Divisi {job.title}</h3>
                         
                          <div className="flex items-center text-gray-700 mt-auto -ml-22">
                            <Users size={14} className="mr-2 text-gray-500" />
                            <span className="text-sm">{job.applicants} Pelamar</span>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <button 
                              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg text-sm font-medium transition-colors flex items-center"
                              onClick={() => handleViewDetail(job.id)}
                            >
                              VIEW VACANCY
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center py-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-700">Tidak ada lowongan tersedia</h3>
                      <p className="text-gray-500 text-sm mt-1">Silakan coba lagi nanti atau ubah filter pencarian.</p>
                    </div>
                  )}
                </div>
                
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center justify-center w-10 h-10 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`flex items-center justify-center w-10 h-10 rounded-md ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button 
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center justify-center w-10 h-10 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-700'}`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}