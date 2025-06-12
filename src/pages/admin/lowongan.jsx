import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import JobCard from "../../components/cards/JobCard";
import JobDetail from "../../components/cards/JobDetail";
import AddJobModal from "../../components/modal/AddJobModal";
import axios from "axios";
import Loading from "../../components/Loading";

export default function Lowongan() {
  const [sortStatus, setSortStatus] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lowongan, setLowongan] = useState([]);
  const [editingData, setEditingData] = useState(null);

  const GetData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/lowongan`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLowongan(res.data.data);
    } catch (error) {
      console.log(error);
    }finally {
      setLoading(false);
    }
  };

  const { totalLowonganBerlangsung, totalLowonganSelesai } = lowongan.reduce(
    (acc, job) => {
      if (job.status == true) {
        acc.totalLowonganBerlangsung += 1;
      } else if (job.status == false) {
        acc.totalLowonganSelesai += 1;
      }
      return acc;
    },
    { totalLowonganBerlangsung: 0, totalLowonganSelesai: 0 }
  );

  useEffect(() => {
    GetData();
  }, []);
  

  const summaryCardsData = [
    {
      id: 1,
      title: "Total Lowongan",
      count: lowongan.length,
      color: "orange",
      iconType: "people",
      chartData: [10, 12, 15, 14, 16, 17, 18, 20],
    },
    {
      id: 2,
      title: "Total Lowongan Berlangsung",
      count: totalLowonganBerlangsung,
      color: "yellow",
      iconType: "chart",
      chartData: [5, 7, 10, 12, 13, 15, 14, 15],
    },
    {
      id: 3,
      title: "Total Lowongan Selesai",
      count: totalLowonganSelesai,
      color: "blue",
      iconType: "document",
      chartData: [2, 3, 3, 4, 4, 5, 5, 5],
    },
  ];

  const filteredData =
    sortStatus === "All"
      ? lowongan
      : lowongan.filter((job) => job.status === Number(sortStatus));

  const handleChevronClick = (jobId) => {
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(null);
    } else {
      const job = lowongan.find((job) => job.id === jobId);
      setSelectedJob(job);
    }
  };


  const handleEditJob = (job) => {
    setEditingData(job); // Kirim data untuk diedit
    setShowModal(true);  // Tampilkan modal
  };


  const handleCloseDetail = () => {
    setSelectedJob(null);
  };
  
  if(loading) return <Loading/>

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div
        className={`flex transition-all duration-500 ${
          selectedJob ? "flex-row" : "flex-col"
        }`}
      >
        <div
          className={`${
            selectedJob ? "w-4/5 pr-4" : "w-full"
          } transition-all duration-300`}
        >
          <div
            className={`grid ${
              selectedJob ? "grid-cols-3" : "grid-cols-1 md:grid-cols-3"
            } gap-2 mb-6`}
          >
            {summaryCardsData.map((summaryCard) => (
              <JobCard
                key={summaryCard.id}
                job={summaryCard}
                isActive={false}
              />
            ))}
          </div>

          {/* Job Listings Table */}
          <div className="bg-white rounded-xl overflow-hidden mt-4 shadow-sm">
            <div className="flex items-center justify-between p-4">
              <h1 className="text-lg font-semibold">Cabang Perusahaan</h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-white text-gray-700 border border-gray-300 rounded-md px-3 py-1 text-xs flex items-center hover:bg-gray-50"
                >
                  <span className="mr-1">+</span>
                  <span>Tambah Lowongan</span>
                </button>
                {/* Sort by dropdown */}
                <div className="flex items-center">
                  <span className="mr-2 text-xs">Sort by:</span>
                  <select
                    className="border border-gray-300 rounded-md px-2 py-1 text-xs"
                    value={sortStatus}
                    onChange={(e) => setSortStatus(e.target.value)}
                  >
                    <option value="All">Semua</option>
                    <option value="1">Berlangsung</option>
                    <option value="0">Selesai</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      Nama Perusahaan
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      Alamat
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      Jumlah Kuota
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-700">
                      Status Lowongan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-gray-50 border-t border-gray-100"
                    >
                      <td className="p-4">
                        <div className="font-semibold">{job.perusahaan.nama} | {job.cabang.nama}</div>
                        <div className="text-sm text-gray-500">
                        {job.perusahaan.kota}
                        </div>
                      </td>
                      <td className="p-4 text-sm">{job.perusahaan.alamat}</td>
                      <td className="p-4 text-sm">{job.max_kuota}</td>
                      <td className="p-4 flex items-center gap-2">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            job.status === 1
                              ? "bg-orange-100 text-orange-500"
                              : "bg-emerald-100 text-emerald-500"
                          }`}
                        >
                          {job.status === 0 ? "Selesai" : "Berlangsung"}
                        </span>
                        <ChevronRight
                          onClick={() => handleChevronClick(job.id)}
                          className={`w-4 h-4 cursor-pointer transition-transform ${
                            selectedJob && selectedJob.id === job.id
                              ? "rotate-90 text-orange-500"
                              : "text-gray-400"
                          }`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tampilkan Detail Job */}
        {selectedJob && !showModal && (
          <JobDetail
            job={selectedJob}
            onClose={handleCloseDetail} 
            onEdit={() => handleEditJob(selectedJob)}
            onSucces={() => GetData}
          />
        )}
      </div>

      <AddJobModal showModal={showModal} setShowModal={setShowModal} editingData={editingData} onSucces={() => GetData()} />
    </div>
  );
}
