import { useState, useEffect, useRef } from "react";
import {
  Trash2,
  Edit,
  ChevronDown,
  Plus,
  Eye,
} from "lucide-react";
import Loading from "../Loading";
import axios from "axios";
import AddEditModal from "../../components/modal/AddEditModal";
import DeleteModal from "../../components/modal/DeleteModal";
import DetailModal from "../../components/modal/DetailModal";
import Swal from "sweetalert2";

export default function UniversityCardGrid() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categoryDropdownRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    telepon: "",
    jenis_institusi: "",
    website: "",
    foto_header: null,
    logo: null,
    jurusan: [],
    id_cabang: "1",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailPartner, setDetailPartner] = useState(null);

  const categories = ["All", "Sekolah", "Universitas", "Politeknik"];

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

  const filtered =
    selectedCategory === "All"
      ? partners
      : partners.filter((p) => p.jenis_institusi === selectedCategory);

  const fetchAllData = async () => {
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
        `${import.meta.env.VITE_API_URL}/mitra`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPartners(response.data.data);
      Swal.close();
    } catch (err) {
      console.error("Gagal memuat data mitra:", err);
       if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
      } else if (err.request) {
        console.error("Request data:", err.request);
      } else {
        console.error("Error message:", err.message);
      }
      
      // Show error alert
      await Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: err.response?.data?.message || 'Terjadi kesalahan saat memperbarui data',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const openAdd = () => {
    setEditingPartner(null);
    setFormData({
      nama: "",
      alamat: "",
      telepon: "",
      jenis_institusi: "",
      website: "",
      foto_header: null,
      logo: null,
      jurusan: [],
      id_cabang: "1",
    });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditingPartner(p);
    setFormData({
      nama: p.nama,
      alamat: p.alamat,
      telepon: p.telepon,
      jenis_institusi: p.jenis_institusi,
      website: p.website || "",
      foto_header: null,
      jurusan: p.jurusan.map((j) => j.nama),
    });
    setShowModal(true);
  };

  const confirmDelete = (p) => {
    setPartnerToDelete(p);
    setShowDeleteModal(true);
  };

  const viewDetail = (p) => {
    // Tambahkan logging untuk debugging
    console.log("View Detail clicked:", p);
    console.log("Photo data:", p.foto);
    console.log("BASE_URL:", BASE_URL);
    
    setDetailPartner(p);
    setShowDetailModal(true);
  };

  const handleDelete = async () => {
    if (!partnerToDelete) return;
    setDeleteLoading(true);

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/mitra/${partnerToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setShowDeleteModal(false);
      setPartnerToDelete(null);
      window.location.href = "/perusahaan/mitra";
    } catch (err) {
      console.error("Gagal menghapus mitra:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const BASE_URL = import.meta.env.VITE_API_URL_FILE + "/storage";
  if (loading) return <Loading />;

  return (
    <div className="p-2 min-h-screen">
      <div className="max-w-9xl mx-auto space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-800">Mitra Terdaftar</h2>
            <div className="flex items-center space-x-2">
              <button
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm flex items-center transition duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  openAdd();
                }}
              >
                <Plus size={14} className="mr-1" /> Tambah Mitra
              </button>

              <div className="relative" ref={categoryDropdownRef}>
                <button
                  className="bg-white px-3 py-1.5 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center transition duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCategoryDropdown((v) => !v);
                  }}
                >
                  <span className="mr-1">Kategori:</span>
                  <span className="font-medium">{selectedCategory}</span>
                  <ChevronDown
                    size={14}
                    className={`ml-1 transition-transform duration-200 ${
                      showCategoryDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200 py-1 overflow-hidden">
                    {categories.map((cat) => (
                      <div
                        key={cat}
                        className={`px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center justify-between ${
                          selectedCategory === cat
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700"
                        }`}
                        onClick={() => handleSelectCategory(cat)}
                      >
                        {cat}
                        {selectedCategory === cat && (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.length > 0 ? (
              filtered.map((university) => {
                const coverImage = university.foto?.find(
                  (f) => f.type === "foto_header"
                );
                const logoImage = university.foto?.find(
                  (f) => f.type === "logo"
                );

                return (
                  <div
                    key={university.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="relative">
                      <img
                        src={
                          coverImage
                            ? `${BASE_URL}/${coverImage.path}`
                            : "/assets/img/Cover.png"
                        }
                        alt="Cover"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                        <img
                          src={
                            logoImage
                              ? `${BASE_URL}/${logoImage.path}`
                              : "/assets/img/logoperusahaan.png"
                          }
                          alt="Logo"
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      </div>
                    </div>
                    <div className="pt-8 px-3 text-center flex-grow">
                      <h3 className="font-bold text-base mb-2">
                        {university.nama}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">
                        {university.alamat}
                      </p>
                      <p className="text-xs text-gray-700 mb-4 line-clamp-3">
                      Tempat para pemimpin masa depan tumbuh, belajar, dan berkontribusi untuk dunia
                      </p>
                    </div>
                    <div className="mt-auto flex border-t border-gray-200">
                      <button
                        className="flex-1 py-2 flex items-center justify-center text-gray-500 text-sm hover:bg-gray-50 transition duration-200"
                        onClick={() => confirmDelete(university)}
                      >
                        <Trash2 size={14} className="mr-1" /> Hapus
                      </button>
                      <div className="w-px bg-gray-200" />
                      <button
                        className="flex-1 py-2 flex items-center justify-center text-blue-500 text-sm hover:bg-gray-50 transition duration-200"
                        onClick={() => viewDetail(university)}
                      >
                        <Eye size={14} className="mr-1" /> Lihat
                      </button>
                      <div className="w-px bg-gray-200" />
                      <button
                        className="flex-1 py-2 flex items-center justify-center text-yellow-500 text-xs hover:bg-gray-50 transition duration-200"
                        onClick={() => openEdit(university)}
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                Tidak ada mitra yang ditemukan untuk kategori ini
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <AddEditModal
          show={showModal}
          onClose={() => setShowModal(false)}
          editingPartner={editingPartner}
          formData={formData}
          setFormData={setFormData}
          onSave={fetchAllData}
          categories={categories.filter(cat => cat !== "All")}
        />
      )}

      {showDeleteModal && partnerToDelete && (
        <DeleteModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          partnerToDelete={partnerToDelete}
          onDelete={handleDelete}
          deleteLoading={deleteLoading}
        />
      )}

{showDetailModal && detailPartner && (
  <DetailModal
    show={showDetailModal}
    onClose={() => setShowDetailModal(false)}
    partner={detailPartner}
    baseUrl={BASE_URL} // Pastikan BASE_URL sudah benar
  />
)}
    </div>
  );
}