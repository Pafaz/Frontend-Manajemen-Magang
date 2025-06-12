// JobVacancyList.jsx - Komponen untuk halaman daftar lowongan
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Loading from "../Loading";
import DataNotAvaliable from "../DataNotAvaliable";

export default function JobVacancyList() {
  const [jobVacancies, setJobVacancies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6; // Menampilkan lebih banyak job karena sekarang fullwidth
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const totalPages = Math.ceil(jobVacancies.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobVacancies.slice(indexOfFirstJob, indexOfLastJob);
  const [loading, setLoading] = useState(true);

  const getImagePath = (job, type) => {
    return (
      job?.perusahaan?.perusahaan?.foto?.find((f) => f.type === type)?.path ||
      job?.cabang?.foto?.find((f) => f.type === type)?.path ||
      ""
    );
  };

  const mapJobData = (job) => ({
    id: job.id,
    position: job.divisi?.nama || "-",
    company: {
      name: job.perusahaan?.perusahaan?.nama || "-",
      location: job.perusahaan?.perusahaan?.alamat || "-",
      logo: `${import.meta.env.VITE_API_URL_FILE}/storage/${getImagePath(
        job,
        "logo"
      )}`,
      email: job.perusahaan?.perusahaan?.email || "-",
      website: job.perusahaan?.perusahaan?.website || "-",
      description: job.perusahaan?.perusahaan?.deskripsi || "-",
    },
    documents: job.dokumen_dibutuhkan || [],
    importantDates: {
      duration: job.durasi + " Bulan",
      Pembukaan: job.tanggal_mulai,
      Penutupan: job.tanggal_selesai,
    },
    requirements: job.syarat?.split("\n") || [],
    benefits: job.fasilitas?.split("\n") || [],
    total_pendaftar: job.total_pendaftar || 0,
    cover: `${import.meta.env.VITE_API_URL_FILE}/storage/${getImagePath(
      job,
      "profil_cover"
    )}`,
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/lowongan-all`
        );

        const jobs = (data?.data || []).map(mapJobData);
        setJobVacancies(jobs);
      } catch (error) {
        console.error("Gagal memuat data lowongan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewDetail = (jobId) => {
    navigate(`/vacancy/${jobId}`);
  };

  if (loading)
    return (
      <div className="container mx-auto px-4 py-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i + 1}
              className="w-full h-64 rounded-xl bg-gray-200 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );

  return (
    <>
      {currentJobs.length === 0 ? (
        <>
          <DataNotAvaliable />
          <h1 className="text-4xl font-bold text-center py-10">
            Data Not Avaliable
          </h1>
        </>
      ) : (
        <div className="container mx-auto px-4 py-8 mt-10">
          <h1 className="text-3xl font-bold mb-8 text-center">Lowongan Magang</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentJobs.map((job) => (
              <div key={job.id} className="mb-8">
                <div className="relative bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="h-36 w-full overflow-hidden">
                    <img
                      src={job.cover}
                      alt="Company Cover"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {job.company.name}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {job.company.location}
                    </p>
                    <p className="text-gray-600 text-xs mt-2 font-light">
                      {job.importantDates.Pembukaan} -{" "}
                      {job.importantDates.Penutupan}
                    </p>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="text-md font-semibold text-gray-900">
                        Posisi: {job.position}
                      </div>
                      <div className="flex gap-3 items-center mt-2 text-gray-600">
                        <i className="bi bi-people text-lg font-semibold"></i>
                        <span className="font-light text-sm">
                          {job.total_pendaftar} Pendaftar
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-blue-700"
                        onClick={() => handleViewDetail(job.id)}
                      >
                        LIHAT DETAIL
                        <ArrowRight size={16} className="ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                className={`w-10 h-10 flex items-center justify-center rounded-md border ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    className={`w-10 h-10 flex items-center justify-center rounded-md border ${
                      currentPage === number
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => handlePageChange(number)}
                  >
                    {number}
                  </button>
                )
              )}
              <button
                className={`w-10 h-10 flex items-center justify-center rounded-md border ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
