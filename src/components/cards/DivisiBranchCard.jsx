import React, { useEffect, useState } from "react";
import Card from "./Card";
import TempatkanModal from "../modal/TempatkanModal";
import Penempatan from "./Penempatan";
import Detaildivisi from "../modal/WebDevModal";
import axios from "axios";
import ModalDivisi from "../modal/ModalDivisi";
import LoadingCards from "../cards/LoadingCards";
import DataNotAvaliable from "../DataNotAvaliable";
import Swal from "sweetalert2";

export default function DivisiBranchCard() {
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 12;
  const [isTempatkanModalOpen, setIsTempatkanModalOpen] = useState(false);
  const [isDetaildivisiOpen, setIsDetaildivisiOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const pageCount = Math.ceil(branches.length / itemsPerPage);
  const displayedBranches = branches.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const [loading, setLoading] = useState(true);

  const getDataAllDevsion = async () => {
    try {
      // Show loading for initial load
      if (branches.length === 0) {
        Swal.fire({
          title: 'Memuat data...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
      }

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/divisi`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      setBranches(res.data.data);
      setLoading(false);
      
      // Close loading if it was shown
      if (branches.length === 0) {
        Swal.close();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      
      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: 'Terjadi kesalahan saat memuat data divisi. Silakan coba lagi.',
        confirmButtonText: 'OK'
      });
    }
  };

  useEffect(() => {
    getDataAllDevsion();
  }, []);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteClick = async (id) => {
    // Show confirmation dialog with SweetAlert2
    const result = await Swal.fire({
      title: 'Konfirmasi Hapus',
      text: 'Apakah Anda yakin ingin menghapus divisi ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) {
      return;
    }

    // Show loading during delete process
    Swal.fire({
      title: 'Menghapus...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/divisi/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Divisi berhasil dihapus.',
        showConfirmButton: false,
        timer: 2000
      });

      // Refresh data
      getDataAllDevsion();
    } catch (error) {
      console.error(
        "Gagal menghapus divisi:",
        error.response ? error.response.data : error.message
      );

      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menghapus',
        text: error.response?.data?.message || 'Terjadi kesalahan saat menghapus divisi.',
        confirmButtonText: 'OK'
      });
    }
  };

  const handlePlace = (item) => {
    setSelectedItem(item);
    setIsTempatkanModalOpen(true);
  };

  const handleDetailDevision = (branch) => {
    setSelectedItem(branch);
    setIsDetaildivisiOpen(true);
  };

  // Handle modal success callback
  const handleModalSuccess = (message = 'Data berhasil disimpan') => {
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: message,
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      getDataAllDevsion();
    });
  };

  // Handle opening add/edit modal
  const handleOpenModal = (division = null) => {
    setSelectedDivision(division);
    setShowModal(true);
  };

  // Format date to "DD Month YYYY" in Indonesian
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  if (loading) return <LoadingCards />;

  return (
    <Card>
      <div className="mt-8 px-1 pb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Divisi Terdaftar</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleOpenModal()}
              className="bg-white text-gray-700 border border-gray-300 rounded-md px-2 py-1 text-xs flex items-center hover:bg-gray-50 transition-colors"
            >
              <i className="bi bi-plus mr-1"></i>
              <span className="mr-1">Tambah Divisi</span>
            </button>
            <div className="flex items-center">
              <span className="mr-1 text-xs">Sort by:</span>
              <select className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Terbaru</option>
                <option>Terlama</option>
              </select>
            </div>
          </div>
        </div>

        {branches.length === 0 ? (
          <div className="py-10">
            <DataNotAvaliable />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayedBranches.map((branch) => {
              const foto_cover = branch.foto?.find(
                (f) => f.type === "foto_cover"
              );
              return (
                <div
                  key={branch.id}
                  className="bg-white border border-[#CED2D9] rounded-lg overflow-hidden pt-2 px-2 pb-2 mb-4 hover:shadow-md transition-shadow"
                >
                  <div className="rounded-md overflow-hidden mb-3">
                    <img
                      src={`${import.meta.env.VITE_API_URL_FILE}/storage/${
                        foto_cover?.path
                      }`}
                      alt="Background"
                      className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleDetailDevision(branch)}
                    />
                  </div>
                  <div className="flex justify-between px-2">
                    <h3 className="font-bold text-sm text-gray-800 text-left">
                      {branch.nama}
                    </h3>

                    <div className="text-xs flex justify-end items-center gap-1">
                      <i className="bi bi-calendar text-blue-500"></i>
                      <span className="text-black font-medium">
                        {formatDate(branch.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center mt-3 border-t border-t-slate-300">
                    <div className="rounded p-2 w-full flex justify-between items-center space-x-2">
                      <button
                        onClick={() => handleOpenModal(branch)}
                        className="text-orange-500 border border-orange-500 rounded px-3 py-1 text-xs hover:bg-orange-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(branch.id)}
                        className="text-red-500 border border-red-500 rounded px-3 py-1 text-xs hover:bg-red-100 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pageCount > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {Array.from({ length: pageCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageClick(index)}
                  className={`px-3 py-1 rounded transition-colors ${
                    currentPage === index
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* <Penempatan /> */}

      <ModalDivisi
        showModal={showModal}
        setShowModal={setShowModal}
        editingDivision={selectedDivision}
        onSuccess={() => {
          handleModalSuccess(selectedDivision ? 'Divisi berhasil diperbarui' : 'Divisi berhasil ditambahkan');
        }}
      />

      {/* <TempatkanModal
        isOpen={isTempatkanModalOpen}
        onClose={() => setIsTempatkanModalOpen(false)}
        data={selectedItem}
      /> */}

      <Detaildivisi
        isOpen={isDetaildivisiOpen}
        onClose={() => setIsDetaildivisiOpen(false)}
        data={selectedItem}
      />
    </Card>
  );
}