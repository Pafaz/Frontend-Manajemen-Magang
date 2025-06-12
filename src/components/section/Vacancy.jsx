import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Mail,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import PemberkasanModal from "../modal/PemberkasanModal";
import Loading from "../Loading";
import DataNotAvaliable from "../DataNotAvaliable";

export default function JobVacancyLayout() {
  const [jobVacancies, setJobVacancies] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [userMagangStatus, setUserMagangStatus] = useState(null);
  const [statusError, setStatusError] = useState("");
  const jobsPerPage = 3;
  const jobDetailRef = useRef(null);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const totalPages = Math.ceil(jobVacancies.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobVacancies.slice(indexOfFirstJob, indexOfLastJob);
  const [loading, setLoading] = useState(true);

  const getImagePath = (job, type) => {
    return (
      job?.perusahaan?.foto?.find((f) => f.type === type)?.path ||
      job?.cabang?.foto?.find((f) => f.type === type)?.path ||
      ""
    );
  };

  const mapJobData = (job) => ({
    id: job.id,
    position: job.divisi?.nama || "-",
    company: {
      name: job.perusahaan?.nama || "-",
      location: job.perusahaan?.alamat || "-",
      logo: `${import.meta.env.VITE_API_URL_FILE}/storage/${getImagePath(
        job,
        "logo"
      )}`,
      email: job.perusahaan?.email || "-",
      website: job.perusahaan?.website || "-",
      description: job.perusahaan?.deskripsi || "-",
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
          `${import.meta.env.VITE_API_URL}/lowongan-all`);

        const jobs = (data?.data || []).map(mapJobData);        
        setJobVacancies(jobs);
        setSelectedJob(jobs[0] || null);
      } catch (error) {
        console.error("Gagal memuat data lowongan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    // Fetch user's internship/magang status when user is logged in
    const fetchUserMagangStatus = async () => {
      if (!token || !user) return;
      
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/complete/magang`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // API merespons dengan data: "true" jika peserta sudah terdaftar magang
        // dan data: "false" jika peserta belum terdaftar magang
        const isTerdaftarMagang = response.data.data === "true";
        setUserMagangStatus(isTerdaftarMagang ? "terdaftar" : "belum_terdaftar");
      } catch (error) {
        console.error("Gagal memuat status magang user:", error);
      }
    };

    fetchUserMagangStatus();
  }, [user, token]);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    jobDetailRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const jobsOnNewPage = jobVacancies.slice(
      (pageNumber - 1) * jobsPerPage,
      pageNumber * jobsPerPage
    );
    if (!jobsOnNewPage.find((job) => job.id === selectedJob?.id)) {
      setSelectedJob(jobsOnNewPage[0]);
      jobDetailRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openModal = (e) => {
    e.preventDefault();
    setStatusError("");
    
    // Check if user is logged in
    if (!token || !user) {
      navigate("/auth/login");
      return;
    }
    
    // Check user's internship status
    if (userMagangStatus === "terdaftar") {
      setStatusError("Anda sudah terdaftar magang. Tidak dapat melamar lowongan baru.");
      return;
    }
    
    // If status is "belum_terdaftar" or null/undefined, allow them to apply
    setModalOpen(true);
  };

  const getImportantDates = (job) => {
    const { Pembukaan, Penutupan } = job.importantDates || {};

    if (!Pembukaan || !Penutupan) {
      return {
        duration: "Tidak tersedia",
        Pembukaan: "Tidak tersedia",
        Penutupan: "Tidak tersedia",
      };
    }

    const start = new Date(Pembukaan);
    const end = new Date(Penutupan);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        duration: "Tanggal tidak valid",
        Pembukaan: "Tanggal tidak valid",
        Penutupan: "Tanggal tidak valid",
      };
    }

    const duration = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    return {
      duration: `${duration} hari`,
      Pembukaan: start.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      Penutupan: end.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  };
  
  const importantDates = selectedJob ? getImportantDates(selectedJob) : null;
  const closeModal = () => setModalOpen(false);

  if (loading)
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-white mt-10">
        <div className="w-full md:w-1/3 bg-white overflow-y-2 px-6 py-9">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i + 1}
              className="w-full h-1/2 rounded-xl bg-gray-200 animate-pulse my-3"
            ></div>
          ))}
        </div>
        <div className="w-full h-screen bg-gray-200 animate-pulse rounded-xl"></div>
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
        <div className="flex flex-col md:flex-row min-h-screen bg-white mt-10 p-6">
          <div className="w-full md:w-1/3 bg-white overflow-y-auto px-6 py-9">
            {currentJobs.map((job) => (
              <div
                key={job.id}
                className={`mb-8 cursor-pointer ${
                  selectedJob?.id === job.id
                    ? "ring-2 ring-blue-500 rounded-xl"
                    : ""
                }`}
                onClick={() => handleSelectJob(job)}
              >
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
                        Possition : {job.position}
                      </div>
                      <div className="flex gap-3 items-center mt-2 text-gray-600">
                        <i className="bi bi-people text-lg font-semibold"></i>
                        <span className="font-light text-sm">
                          {job.total_pendaftar}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-blue-700">
                        VIEW VACANCY
                        <ArrowRight size={16} className="ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  className={`w-8 h-8 flex items-center justify-center rounded-md border ${
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
                      className={`w-8 h-8 flex items-center justify-center rounded-md border ${
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
                  className={`w-8 h-8 flex items-center justify-center rounded-md border ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    currentPage < totalPages &&
                    handlePageChange(currentPage + 1)
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          <div
            ref={jobDetailRef}
            className="w-full md:w-2/3 border border-gray-300 bg-white rounded-lg overflow-y-auto p-10 mt-8"
          >
            {selectedJob && (
              <>
                <div className="flex flex-col md:flex-row-reverse justify-between items-start mb-6">
                  <div className="mb-4 md:mb-0 md:w-1/4 flex justify-end">
                    <img
                      src={selectedJob.company.logo}
                      alt={selectedJob.company.name}
                      className="h-20 w-auto object-contain"
                    />
                  </div>

                  <div className="flex flex-col flex-1">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                      {selectedJob.position}
                    </h1>
                    <p className="text-blue-600 font-medium mb-2">
                      {selectedJob.company.name}
                    </p>
                    <p className="text-gray-600 text-sm flex items-center mb-4">
                      <MapPin size={14} className="mr-1" />
                      {selectedJob.company.location}
                    </p>

                    {statusError && (
                      <div className="flex items-center p-3 mb-4 bg-red-100 text-red-700 rounded-md">
                        <AlertCircle size={16} className="mr-2" />
                        <span>{statusError}</span>
                      </div>
                    )}

                    <button
                      className={`text-sm font-bold py-2 px-4 rounded-md w-fit ${
                        userMagangStatus === "terdaftar"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      onClick={openModal}
                      disabled={userMagangStatus === "terdaftar"}
                    >
                      APPLY VACANCY
                    </button>
                  </div>
                </div>

                <div className="border-b border-gray-300 mb-5"></div>

                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-2">
                    Tentang Perusahaan
                  </h2>
                  <p className="text-gray-700 text-sm">
                    {selectedJob.company.description}
                  </p>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 text-sm">
                    <div className="flex items-center mb-2 md:mb-0">
                      <Mail size={16} className="text-gray-500 mr-2" />
                      <span className="text-gray-700">
                        {selectedJob.company.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <ExternalLink size={16} className="text-gray-500 mr-2" />
                      <a
                        href={`https://${selectedJob.company.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:underline"
                      >
                        {selectedJob.company.website}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-300 mb-5"></div>

                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-2">
                    Dokumen Yang Dibutuhkan
                  </h2>
                  <ul className="flex flex-wrap gap-8 pl-5 list-disc text-sm text-gray-700">
                    {selectedJob.documents.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>

                <div className="border-b border-gray-300 mb-5"></div>

                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-2">
                    Tanggal Penting
                  </h2>
                  {importantDates && (
                    <div className="pl-5">
                      <div className="grid grid-cols-[200px_auto] text-sm text-gray-700 mb-1">
                        <span>Durasi</span>
                        <span>: {importantDates.duration}</span>
                      </div>
                      <div className="grid grid-cols-[200px_auto] text-sm text-gray-700 mb-1">
                        <span>Pembukaan</span>
                        <span>: {importantDates.Pembukaan}</span>
                      </div>
                      <div className="grid grid-cols-[200px_auto] text-sm text-gray-700 mb-1">
                        <span>Penutupan</span>
                        <span>: {importantDates.Penutupan}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-b border-gray-300 mb-5"></div>

                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-3">
                    Rincian Lowongan
                  </h2>

                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-2 pl-5">
                      Requirements :
                    </h3>
                    <ol className="list-decimal pl-12 text-sm text-gray-700 space-y-2">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-2 pl-5">
                      Benefits :
                    </h3>
                    <ol className="list-decimal pl-12 text-sm text-gray-700 space-y-2">
                      {selectedJob.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </>
            )}
          </div>

          {modalOpen && (
            <PemberkasanModal
              isOpen={modalOpen}
              onClose={closeModal}
              jobData={selectedJob}
            />
          )}
        </div>
      )}
    </>
  );
}