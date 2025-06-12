import React, { useState, useEffect } from "react";
import axios from "axios";

const DataDiriCard = () => {
  const [dataPeserta, setDataPeserta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/peserta/detail`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDataPeserta(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data peserta:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      {/* Data Diri Section */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-0.5">Data Diri</h2>
        <p className="text-xs text-gray-500 mb-3">Silahkan Lengkapi Data diri anda</p>

        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nama</label>
            <input type="text" value={dataPeserta?.nama || ""} className="w-1/4 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" readOnly />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Alamat</label>
            <textarea value={dataPeserta?.alamat || ""} rows={3} className="w-1/2 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" readOnly />
          </div>

          {/* Baris pertama: Jenis Kelamin, Tempat Lahir, No HP, dan Tanggal Lahir */}
          <div className="grid grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Jenis Kelamin</label>
              <input type="text" value={dataPeserta?.jenis_kelamin || ""} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" readOnly />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tempat Lahir</label>
              <input type="text" value={dataPeserta?.tempat_lahir || ""} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" readOnly />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">No. Hp</label>
              <input type="text" value={dataPeserta?.telepon || ""} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" readOnly />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Lahir</label>
              <input type="text" value={dataPeserta?.tanggal_lahir || ""} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" readOnly />
            </div>
          </div>

          {/* Baris kedua: Sekolah, NISN/NIM, Jurusan, dan Kelas */}
          <div className="grid grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Sekolah/Universitas</label>
              <input
                type="text"
                value={dataPeserta?.sekolah || dataPeserta?.universitas || ""}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">NISN/NIM</label>
              <input type="text" value={dataPeserta.nomor_identitas || ""} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" readOnly />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Jurusan</label>
              <input type="text" value={dataPeserta?.jurusan || ""} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" readOnly />
            </div>
          </div>
        </div>
      </div>

      {/* Pemberitasan Section */}
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-0.5">Pemberitasan</h2>
        <p className="text-xs text-gray-500 mb-3">Silahkan lengkapi pemberitasan dibawah ini</p>

        <div className="grid grid-cols-3 gap-6 mb-5">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Perusahaan</label>
            <input type="text" value={dataPeserta?.perusahaan || ""} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" readOnly />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Cabang Perusahaan</label>
            <input type="text" value={dataPeserta?.cabang || ""} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" readOnly />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Divisi yang dipilih</label>
            <input type="text" value={dataPeserta?.divisi || ""} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" readOnly />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Mulai Magang</label>
            <input type="text" value={dataPeserta?.mulai_magang || ""} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" readOnly />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Selesai Magang</label>
            <input type="text" value={dataPeserta?.selesai_magang || ""} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" readOnly />
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="grid grid-cols-4 gap-6">
        {/* Foto Peserta Magang */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Foto Peserta Magang</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              {dataPeserta?.foto_peserta ? (
                <img src={dataPeserta.foto_peserta} alt="Foto Peserta" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="text-[10px] text-gray-500">
                <p>
                  <span className="text-blue-600 font-medium">Foto Peserta Magang</span>
                </p>
                <p>JPG, PNG • Max 2MB</p>
                <p>Size 500 x 500 PX</p>
              </div>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 ml-4 whitespace-nowrap">Browse</button>
            </div>
          </div>
        </div>

        {/* Bukti CV Peserta */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Bukti CV Peserta</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="text-[10px] text-gray-500">
                <p>
                  <span className="text-blue-600 font-medium">{dataPeserta?.cv_peserta ? "CV Uploaded" : "Bukti CV Peserta"}</span>
                </p>
                <p>PDF • Max 2MB</p>
                <p>Size A4/Letter, 72 DPI</p>
              </div>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 ml-4 whitespace-nowrap">Browse</button>
            </div>
          </div>
        </div>

        {/* Bukti Surat Pernyataan Diri */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Bukti Surat Pernyataan Diri</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="text-[10px] text-gray-500">
                <p>
                  <span className="text-blue-600 font-medium">{dataPeserta?.surat_pernyataan ? "Surat Uploaded" : "Bukti Surat Pernyataan Diri"}</span>
                </p>
                <p>PDF • Max 2MB</p>
                <p>Size A4/Letter, 72 DPI</p>
              </div>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 ml-4 whitespace-nowrap">Browse</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDiriCard;
