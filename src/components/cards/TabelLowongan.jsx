import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function CompanyTable() {
  const [sortStatus, setSortStatus] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null); // Menyimpan job yang dipilih untuk detail

  const jobData = [
    {
      id: 1,
      company: "PT. HUMMA TECHNOLOGY INDONESIA",
      location: "Malang",
      address: "Jl. Pemuda Kaffa Blok. 20 No.5",
      quota: "250 Orang",
      status: "Berlangsung",
    },
    {
      id: 2,
      company: "PT. HUMMA TECHNOLOGY INDONESIA",
      location: "Malang",
      address: "Jl. Pemuda Kaffa Blok. 20 No.5",
      quota: "250 Orang",
      status: "Selesai",
    },
    {
      id: 3,
      company: "PT. HUMMA TECHNOLOGY INDONESIA",
      location: "Malang",
      address: "Jl. Pemuda Kaffa Blok. 20 No.5",
      quota: "250 Orang",
      status: "Berlangsung",
    },
  ];

  const filteredData = sortStatus === 'All'
    ? jobData
    : jobData.filter((job) => job.status === sortStatus);

  // Fungsi untuk toggle detail
  const handleChevronClick = (jobId) => {
    if (selectedJob === jobId) {
      setSelectedJob(null); // Jika detail sudah terbuka, tutup
    } else {
      setSelectedJob(jobId); // Jika detail belum terbuka, buka untuk job yang dipilih
    }
  };

  return (
    <div className="max-w-9xl mx-auto p-2">
      <div className="bg-white rounded-xl shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold ml-6 mt-6">Cabang Perusahaan</h1>
          <div className="flex items-center space-x-2 pr-4 pt-4">
            <button 
              onClick={() => setShowModal(true)}
              className="bg-white text-gray-700 border border-gray-300 rounded-md px-2 py-1 text-xs flex items-center"
            >
              <i className="bi bi-plus mr-1"></i>
              <span className="mr-1">Tambah Divisi</span>
            </button>
            <div className="flex items-center">
              <span className="mr-1 text-xs">Sort by:</span>
              <select 
                className="border border-gray-300 rounded-md px-2 py-1 text-xs"
                value={sortStatus}
                onChange={(e) => setSortStatus(e.target.value)}
              >
                <option value="All">Semua</option>
                <option value="Berlangsung">Berlangsung</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex">
          <div className={`w-${selectedJob ? '7/12' : 'full'} transition-all ease-in-out duration-300`}>
            <table className="min-w-full bg-white">
              <thead className="bg-[#D5DBE7]">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-black-700">Nama Perusahaan</th>
                  <th className="text-left p-4 text-sm font-medium text-black-700">Alamat</th>
                  <th className="text-left p-4 text-sm font-medium text-black-700">Jumlah Kuota</th>
                  <th className="text-left p-4 text-sm font-medium text-black-700">Status Lowongan</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-semibold">{job.company}</div>
                      <div className="text-sm text-gray-500">{job.location}</div>
                    </td>
                    <td className="p-4 text-sm">{job.address}</td>
                    <td className="p-4 text-sm">{job.quota}</td>
                    <td className="p-4 flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        job.status === "Berlangsung"
                          ? "bg-orange-100 text-orange-500"
                          : "bg-emerald-100 text-emerald-500"
                      }`}>
                        {job.status}
                      </span>
                      <ChevronRight
                        onClick={() => handleChevronClick(job.id)}
                        className="w-4 h-4 text-gray-400 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detail */}
          {selectedJob && (
            <div className="w-5/12 p-4 bg-gray-50 transition-all ease-in-out duration-300">
              <h2 className="text-xl font-semibold mb-4">Detail Perusahaan</h2>
              <div>
                {jobData
                  .filter((job) => job.id === selectedJob)
                  .map((job) => (
                    <div key={job.id}>
                      <p><strong>Nama Perusahaan:</strong> {job.company}</p>
                      <p><strong>Alamat:</strong> {job.address}</p>
                      <p><strong>Quota:</strong> {job.quota}</p>
                      <p><strong>Status:</strong> {job.status}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
