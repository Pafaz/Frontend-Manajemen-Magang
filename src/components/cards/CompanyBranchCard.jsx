import React, { useEffect, useState } from "react";
import Card from "../../components/cards/Card";
import ReactPaginate from "react-paginate";
import ModalTambahAdminCabang from "../../components/modal/ModalTambahAdminCabang";
import ModalDetailAdminCabang from "../../components/modal/ModalDetailAdminCabang";
import Loading from "../../components/Loading";
import axios from "axios";
import DataNotAvaliable from "../DataNotAvaliable";
import Swal from "sweetalert2";

export default function CompanyBranchCard() {
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState("terbaru"); // State untuk sorting
  const itemsPerPage = 12;
  const [modalState, setModalState] = useState({
    showModal: false,
    showDetailModal: false,
    branchToDetail: null,
    branchToEdit: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      Swal.fire({
        title: 'Memuat data...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin?sort=${sortOrder}`, // Tambahkan parameter sort
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      // Jika API tidak mendukung sorting, lakukan sorting di frontend
      let sortedData = response.data.data;
      if (sortOrder === "terbaru") {
        sortedData = sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (sortOrder === "terlama") {
        sortedData = sortedData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }
      
      setBranches(sortedData);
      Swal.close();
    } catch (error) {
      console.error("Error fetching admins:", error);
      Swal.close();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [sortOrder]); // Tambahkan sortOrder sebagai dependency

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    setCurrentPage(0); // Reset ke halaman pertama saat sorting berubah
  };

  const displayedBranches = branches.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleViewDetail = (branch) => {
    setModalState({
      ...modalState,
      showDetailModal: true,
      branchToDetail: branch,
    });
  };

  const handleDeleteClick = (branch) => {
    Swal.fire({
      title: 'Hapus Admin?',
      text: `Apakah Anda yakin ingin menghapus admin ${branch.user?.nama || 'ini'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteBranch(branch);
      }
    });
  };

  const handleDeleteBranch = async (branch) => {
    try {
      // Show loading
      Swal.fire({
        title: 'Menghapus...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/${branch.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setBranches(branches.filter((b) => b.id !== branch.id));
      
      // Success notification
      Swal.fire({
        title: 'Berhasil!',
        text: 'Admin berhasil dihapus',
        icon: 'success',
        confirmButtonColor: '#10b981',
        timer: 2000,
        showConfirmButton: false
      });

      fetchAdmins();
    } catch (error) {
      console.error("Error deleting admin:", error);
      
      // Error notification
      Swal.fire({
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menghapus admin',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  const handleEditClick = (branch) => {
    setModalState({ ...modalState, showModal: true, branchToEdit: branch });
  };

  const handleModalSuccess = () => {
    fetchAdmins();
    setModalState({ ...modalState, showModal: false, branchToEdit: null });
    
    // Success notification for save/edit
    Swal.fire({
      title: 'Berhasil!',
      text: modalState.branchToEdit ? 'Data admin berhasil diperbarui' : 'Admin baru berhasil ditambahkan',
      icon: 'success',
      confirmButtonColor: '#10b981',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleModalClose = () => {
    setModalState({ ...modalState, showModal: false, branchToEdit: null });
  };

  if (loading) return <Loading />;

  return (
    <Card>
      <div className="mt-3 px-1 pb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Admin</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                setModalState((prevState) => ({
                  ...prevState,
                  showModal: true,
                  branchToEdit: null,
                }))
              }
              className="bg-white text-gray-700 border border-gray-300 rounded-md px-2 py-1 text-xs flex items-center"
            >
              <i className="bi bi-plus mr-1"></i>
              <span className="mr-1">Tambah Admin</span>
            </button>

            <div className="flex items-center">
              <span className="mr-1 text-xs">Sort by:</span>
              <select 
                className="border border-gray-300 rounded-md px-2 py-1 text-xs"
                value={sortOrder}
                onChange={handleSortChange}
              >
                <option value="terbaru">Terbaru</option>
                <option value="terlama">Terlama</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayedBranches.map((branch) => {
            const cover = branch.foto?.find((f) => f.type === "cover");
            const profile = branch.foto?.find((f) => f.type === "profile");
            return (
              <div
                key={branch.id}
                className="bg-white border border-[#D5DBE7] rounded-lg w-full"
              >
                <div className="relative">
                  <img
                    src={`${import.meta.env.VITE_API_URL_FILE}/storage/${
                      cover?.path
                    }`}
                    alt="Company Building"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute -bottom-4 left-0 right-0 flex justify-center">
                    <div className="rounded-full overflow-hidden border-2 border-white bg-white w-16 h-16">
                      <img
                        src={`${import.meta.env.VITE_API_URL_FILE}/storage/${
                          profile?.path
                        }`}
                        alt="Company Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 px-3 pb-5">
                  {branch.user && (
                    <>
                      <h3 className="font-bold text-sm text-gray-800 text-center mb-2">
                        {branch.user.nama}
                      </h3>
                      <p className="text-xs text-black-600 text-center mb-1 break-words px-2">
                        {branch.user.email}
                      </p>
                    </>
                  )}

                  <div className="flex justify-center mt-5">
                    <div className="border border-[#D5DBE7] rounded p-2 w-full flex justify-between items-center space-x-2">
                      <button
                        onClick={() => handleViewDetail(branch)}
                        className="text-blue-500 border border-blue-500 rounded px-3 py-1 text-xs hover:bg-blue-50 transition-colors"
                      >
                        Lihat Detail
                      </button>
                      <button
                        onClick={() => handleEditClick(branch)}
                        className="text-orange-500 border border-orange-500 rounded px-3 py-1 text-xs hover:bg-orange-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(branch)}
                        className="text-red-500 border border-red-500 rounded px-3 py-1 text-xs hover:bg-red-50 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {displayedBranches.length > 0 ? (
          <div className="flex items-center justify-between mt-6">
            <div className="flex-1">
              <ReactPaginate
                previousLabel="← Sebelumnya"
                nextLabel="Berikutnya →"
                breakLabel="..."
                pageCount={Math.ceil(branches.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                forcePage={currentPage} // Pastikan pagination tetap sinkron
                containerClassName="flex justify-center items-center space-x-2"
                pageLinkClassName="px-3 py-1 text-sm rounded-md text-gray-700 hover:bg-blue-100"
                activeLinkClassName="bg-blue-500 text-white"
                previousClassName="mr-auto"
                nextClassName="ml-auto"
                previousLinkClassName="border border-gray-300 px-4 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100"
                nextLinkClassName="border border-gray-300 px-4 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-100"
              />
            </div>
          </div>
        ) : (
          <DataNotAvaliable />
        )}
      </div>

      <ModalTambahAdminCabang
        isOpen={modalState.showModal}
        onSucces={handleModalSuccess}
        onClose={handleModalClose}
        branchToEdit={modalState.branchToEdit}
      />

      <ModalDetailAdminCabang
        isOpen={modalState.showDetailModal}
        onClose={() => setModalState({ ...modalState, showDetailModal: false })}
        branch={modalState.branchToDetail}
      />
    </Card>
  );
}