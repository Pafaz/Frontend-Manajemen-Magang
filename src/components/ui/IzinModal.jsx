import React, { useState } from "react";
import Modal from "../Modal";
import Card from "../cards/Card";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const IzinModal = ({ isOpen, onClose }) => {
  const [mulai, setMulai] = useState("");
  const [selesai, setSelesai] = useState("");
  const [file, setFile] = useState(null);
  const [deskripsi, setDeskripsi] = useState("");
  const [jenis, setJenis] = useState("sakit");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("mulai", mulai);
      formData.append("selesai", selesai);
      formData.append("bukti", file);
      formData.append("deskripsi", deskripsi);
      formData.append("jenis", jenis);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/izin`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );      

      if (response.data.status === "success") {
        // Menggunakan SweetAlert untuk notifikasi sukses
        Swal.fire({
          title: 'Berhasil!',
          text: 'Izin berhasil diajukan!',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#10B981'
        });
        onClose();
      }
    } catch (error) {
      console.error("Error during izin submission:", error);
      // Menggunakan SweetAlert untuk notifikasi error
      Swal.fire({
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat mengajukan izin.',
        icon: 'error',
        confirmButtonText: 'Coba Lagi',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Form Izin" size="large">
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Mengubah layout mulai dan selesai menjadi vertikal (atas-bawah) */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Mulai Izin</label>
          <input
            type="date"
            value={mulai}
            onChange={(e) => setMulai(e.target.value)}
            className="w-full bg-white rounded-lg border text-sm border-slate-300/[0.8] py-2 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 peer px-4 mt-2"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium">Selesai Izin</label>
          <input
            type="date"
            value={selesai}
            onChange={(e) => setSelesai(e.target.value)}
            className="w-full bg-white rounded-lg border text-sm border-slate-300/[0.8] py-2 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 peer px-4 mt-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Bukti Izin (Gambar)</label>
          <div className="flex rounded-lg border border-slate-300/[0.8] mt-2 overflow-hidden">
            <label className="flex items-center justify-center px-4 py-2 bg-gray-50 text-gray-700 text-sm border-r border-slate-300/[0.8] cursor-pointer hover:bg-gray-100">
              Choose File
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <div className="flex items-center px-4 py-2 text-sm text-gray-500 flex-grow">
              {file ? file.name : "No File Chosen"}
            </div>
          </div>

        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium">Deskripsi</label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full bg-white rounded-lg border text-sm border-slate-300/[0.8] py-2 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 peer px-4 mt-2"
            placeholder="Masukkan deskripsi izin..."
          ></textarea>
        </div>

        <label className="block text-sm font-medium mb-2">Status</label>
        <div className="mb-4 flex justify-start gap-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="sakit"
              name="status"
              value="sakit"
              checked={jenis === "sakit"}
              onChange={() => setJenis("sakit")}
              className="w-4 h-4 text-purple-600"
            />
            <label htmlFor="sakit" className="ml-2 text-sm">Sakit</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="izin"
              name="status"
              value="izin"
              checked={jenis === "izin"}
              onChange={() => setJenis("izin")}
              className="w-4 h-4 text-purple-600"
            />
            <label htmlFor="izin" className="ml-2 text-sm">Izin</label>
          </div>
        </div>

        <div className="flex justify-end gap-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-200 font-light text-red-500 rounded-full hover:bg-red-700"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-200 font-light text-green-500 rounded-full hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default IzinModal;