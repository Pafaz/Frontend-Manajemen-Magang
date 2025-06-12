import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { CalendarDays, Download, Search, CheckCircle, XCircle, AlertTriangle, ChevronDown, DownloadIcon, FileIcon, SquarePen, X} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import axios from "axios";
import Loading from "../Loading";

export default function ApprovalTable() {
  const [activeTab, setActiveTab] = useState("pendaftaran");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [dataPendaftaran, setDataPendaftaran] = useState([]);
  const [dataIzin, setDataIzin] = useState([]);
  const [showModalIzin, setShowModalIzin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activePreview, setActivePreview] = useState('cv');

  // State untuk modal nomor surat berdasarkan sekolah
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [sekolahGroups, setSekolahGroups] = useState({});
  const [nomorSuratPerSekolah, setNomorSuratPerSekolah] = useState({});

  // State untuk filters
  const [filters, setFilters] = useState({
    jurusan: '',
    sekolah: ''
  });

  const mapFrontendStatusToApi = (frontendStatus) => {
    switch (frontendStatus) {
      case "approved":
        return "diterima";
      case "rejected":
        return "ditolak";
      default:
        return frontendStatus;
    }
  };

  // Fungsi untuk mengelompokkan item berdasarkan sekolah
  const groupItemsBySekolah = (itemIds) => {
    const currentData = activeTab === "pendaftaran" ? dataPendaftaran : dataIzin;
    const groups = {};
    
    itemIds.forEach(id => {
      const item = currentData.find(data => data.id === id);
      if (item && item.user && item.user.sekolah) {
        const sekolah = item.user.sekolah;
        if (!groups[sekolah]) {
          groups[sekolah] = [];
        }
        groups[sekolah].push(id);
      }
    });
    
    return groups;
  };

  // Modifikasi handleBulkAction
  const handleBulkAction = async (frontendActionStatus) => {
    if (selectedItems.length === 0) {
      setShowActionDropdown(false);
      return;
    }

    // Jika aksi adalah "approved", tampilkan modal nomor surat berdasarkan sekolah
    if (frontendActionStatus === "approved") {
      const groups = groupItemsBySekolah(selectedItems);
      setSekolahGroups(groups);
      
      // Initialize nomor surat object dengan sekolah sebagai key
      const initialNomorSurat = {};
      Object.keys(groups).forEach(sekolah => {
        initialNomorSurat[sekolah] = '';
      });
      setNomorSuratPerSekolah(initialNomorSurat);
      
      setShowApprovalModal(true);
      return;
    }

    // Untuk aksi selain approved, jalankan seperti biasa
    await executeBulkAction(frontendActionStatus);
  };

  // Fungsi untuk menjalankan bulk action berdasarkan sekolah
  const executeBulkActionBySekolah = async (frontendActionStatus, nomorSuratData) => {
    const apiActionStatus = mapFrontendStatusToApi(frontendActionStatus);
    const url = activeTab === "pendaftaran" 
      ? `${API_BASE_URL}/many/magang`
      : `${API_BASE_URL}/many/izin`;

    try {
      // Proses setiap sekolah secara terpisah
      for (const [sekolah, itemIds] of Object.entries(sekolahGroups)) {
        const payload = {
          ids: itemIds,
          status: apiActionStatus,
          status_izin: apiActionStatus,
          nomor_surat: nomorSuratData[sekolah] || ''
        };

        await axios.put(url, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
      }

      // Reset dan refresh data
      fetchDataIzin();
      fetchDataPendaftaran();
      setSelectedItems([]);
      setShowActionDropdown(false);
      
      // Redirect setelah semua selesai
      if (activeTab === "pendaftaran") {
        window.location.href = "/perusahaan/cabang/${namaCabang}/approval";
      } else {
        window.location.href = "/perusahaan/cabang/${namaCabang}/approval";
      }
      
    } catch (error) {
      console.error("Terjadi kesalahan saat melakukan request API:", error);
      if (error.response) {
        console.error("Status error response:", error.response.status);
        console.error("Data error response:", error.response.data);
      } else if (error.request) {
        console.error("Request yang dikirim:", error.request);
      } else {
        console.error("Pesan error:", error.message);
      }
      alert(
        `Gagal melakukan aksi massal: ${
          error.response?.data?.message || error.message
        }`
      );
      setShowActionDropdown(false);
    }
  };

  // Fungsi untuk menjalankan bulk action (untuk non-approved actions)
  const executeBulkAction = async (frontendActionStatus, nomorSuratParam = '') => {
    const apiActionStatus = mapFrontendStatusToApi(frontendActionStatus);
    const payload = {
      ids: selectedItems,
      status: apiActionStatus,
      status_izin: apiActionStatus,
    };

    // Tambahkan nomor surat ke payload jika ada
    if (nomorSuratParam && frontendActionStatus === "approved") {
      payload.nomor_surat = nomorSuratParam;
    }

    const url =
      activeTab === "pendaftaran"
        ? `${API_BASE_URL}/many/magang`
        : `${API_BASE_URL}/many/izin`;
    
    try {
      await axios.put(url, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (activeTab === "pendaftaran") {
        window.location.href = "/perusahaan/cabang/${namaCabang}/approval";
      } else {
        window.location.href = "/perusahaan/cabang/${namaCabang}/approval";
      }
      fetchDataIzin();
      fetchDataPendaftaran();
      setSelectedItems([]);
      setShowActionDropdown(false);
    } catch (error) {
      console.error("Terjadi kesalahan saat melakukan request API:", error);
      if (error.response) {
        console.error("Status error response:", error.response.status);
        console.error("Data error response:", error.response.data);
      } else if (error.request) {
        console.error("Request yang dikirim:", error.request);
      } else {
        console.error("Pesan error:", error.message);
      }
      alert(
        `Gagal melakukan aksi massal: ${
          error.response?.data?.message || error.message
        }`
      );
      setShowActionDropdown(false);
    }
  };

  // Fungsi untuk handle approval dengan nomor surat per sekolah
  const handleApprovalSubmit = async () => {
    // Validasi semua nomor surat telah diisi
    const allFilled = Object.keys(sekolahGroups).every(sekolah => 
      nomorSuratPerSekolah[sekolah] && nomorSuratPerSekolah[sekolah].trim()
    );
    
    if (allFilled) {
      await executeBulkActionBySekolah("approved", nomorSuratPerSekolah);
      setShowApprovalModal(false);
      setNomorSuratPerSekolah({});
      setSekolahGroups({});
    }
  };

  // Fungsi untuk menutup modal approval
  const handleCloseApprovalModal = () => {
    setShowApprovalModal(false);
    setNomorSuratPerSekolah({});
    setSekolahGroups({});
  };

  // Fungsi untuk update nomor surat per sekolah
  const updateNomorSurat = (sekolah, value) => {
    setNomorSuratPerSekolah(prev => ({
      ...prev,
      [sekolah]: value
    }));
  };

  const FileIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-red-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  const DownloadIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3 mr-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );

  const PreviewIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3 mr-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    document.body.classList.remove("modal-open");
  };

  const fetchDataPendaftaran = async () => {
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

      const response = await axios.get(`${API_BASE_URL}/magang`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      let pendaftaranData = response.data.data || response.data;
      setDataPendaftaran(pendaftaranData);
      Swal.close();
    } catch (error) {
      console.error("Failed to fetch data pendaftaran:", error);
      setLoading(false);
      Swal.close();
    }
  };

  const fetchDataIzin = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/izin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const izinData = response.data.data || response.data;
      setDataIzin(izinData);
    } catch (error) {
      console.error("Failed to fetch data izin:", error);
    }
  };

  useEffect(() => {
    fetchDataPendaftaran();
    fetchDataIzin();
  }, []);

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleIndividualAction = async (itemId, frontendActionStatus, type) => {
    const apiActionStatus = mapFrontendStatusToApi(frontendActionStatus);
    let url = "";
    let payload = "";
    if (type === "pendaftaran") {
      url = `${API_BASE_URL}/magang/${itemId}`;
      payload = { status: apiActionStatus };
    } else if (type === "izin") {
      url = `${API_BASE_URL}/izin/${itemId}`;
      payload = { status_izin: apiActionStatus };
    } else {
      console.error("Tipe aksi individual tidak diketahui");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message}`
        );
      }

      if (type === "pendaftaran") {
        setDataPendaftaran((prevData) =>
          prevData.map((item) =>
            item.id === itemId
              ? { ...item, status: frontendActionStatus }
              : item
          )
        );
      } else {
        setDataIzin((prevData) =>
          prevData.map((item) =>
            item.id === itemId
              ? { ...item, status: frontendActionStatus }
              : item
          )
        );
      }
      fetchDataPendaftaran();
      fetchDataIzin();
      setShowModal(false);
    } catch (error) {
      console.error(`Gagal mengupdate item ${itemId}:`, error);
      alert(`Gagal memperbarui status: ${error.message}`);
    }
  };

  // Function untuk handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Function untuk handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Function untuk mendapatkan unique values untuk dropdown
  const getUniqueValues = (field) => {
    const currentData = activeTab === "pendaftaran" ? dataPendaftaran : dataIzin;
    if (!currentData || !Array.isArray(currentData)) return [];
    
    const values = currentData
      .map(item => item.user?.[field])
      .filter(value => value && value.trim() !== '')
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    return values;
  };

  // Function untuk filter data yang lebih optimal
  const getFilteredData = () => {
    const currentData = activeTab === "pendaftaran" ? dataPendaftaran : dataIzin;
    if (!currentData || !Array.isArray(currentData)) return [];
    
    let filtered = currentData;

    // Filter berdasarkan search term
    if (searchTerm) {
      filtered = filtered.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.user?.nama?.toLowerCase().includes(searchLower) ||
          item.user?.jurusan?.toLowerCase().includes(searchLower) ||
          item.user?.sekolah?.toLowerCase().includes(searchLower) ||
          item.user?.email?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filter berdasarkan tanggal (created_at)
    if (selectedDate) {
      const selectedDateStr = selectedDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
      filtered = filtered.filter(item => {
        if (!item.created_at) return false;
        const itemDateStr = new Date(item.created_at).toISOString().split('T')[0];
        return itemDateStr === selectedDateStr;
      });
    }

    // Filter berdasarkan jurusan
    if (filters.jurusan) {
      filtered = filtered.filter(item =>
        item.user?.jurusan === filters.jurusan
      );
    }

    // Filter berdasarkan sekolah
    if (filters.sekolah) {
      filtered = filtered.filter(item =>
        item.user?.sekolah === filters.sekolah
      );
    }

    return filtered;
  };

  // Gunakan getFilteredData() untuk data yang sudah difilter
  const filteredData = getFilteredData();

  // Custom Button dengan forwardRef yang benar
  const CustomButton = React.forwardRef(({ value, onClick }, ref) => (
    <button
      className="flex items-center gap-2 bg-white text-[#344054] py-2 px-4 rounded-md shadow border border-[#667797] hover:bg-[#0069AB] hover:text-white text-sm"
      onClick={onClick}
      ref={ref}
      type="button"
    >
      <CalendarDays size={16} />
      {value
        ? new Date(value).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Pilih Tanggal"}
    </button>
  ));

  const getStatusBadge = (status) => {
    switch (status) {
      case "diterima":
        return (
          <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
            Disetujui
          </span>
        );
      case "ditolak":
        return (
          <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
            Ditolak
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
            Pending
          </span>
        );
    }
  };

  const handleDownload = (doc) => {
    if (!doc || !doc.url) return;
    const baseUrl = import.meta.env.VITE_API_URL_FILE || "";
    const cleanedUrl = doc.url.includes("/storage/")
      ? doc.url.split("/storage/")[1]
      : doc.url;
    const downloadUrl = `${baseUrl}/storage/${cleanedUrl}`;
    const encodedUrl = encodeURI(downloadUrl);
    const link = document.createElement("a");
    link.href = encodedUrl;
    link.download = doc.name || "download";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  };

  const handlePreview = (document) => {
    if (!document || !document.url) return;
    const cleanUrl = document.url.includes("/storage")
      ? document.url.split("/storage")[1]
      : document.url;
    const finalUrl = `${import.meta.env.VITE_API_URL_FILE}/storage/${cleanUrl}`;
    window.open(finalUrl, "_blank");
  };

  const DocumentItem = ({ document, onDownload, onPreview }) => {
    return (
      <div className="border border-gray-200 rounded-lg p-2 mb-2 w-full">
        <div className="flex items-start">
          <div className="bg-red-100 p-1.5 rounded-lg mr-2">
            <FileIcon />
          </div>
          <div className="flex justify-between w-full">
            <div>
              <p className="font-medium text-sm">
                {document?.name || "Document"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 ml-4">
              <button
                className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs flex items-center"
                onClick={() => onDownload(document)}
              >
                <DownloadIcon />
                Download
              </button>
              <button
                className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs flex items-center mt-1"
                onClick={() => onPreview(document)}
              >
                <PreviewIcon />
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const InputLabel = ({ label, value }) => (
    <div>
      <label className="block text-gray-600 text-xs mb-1">{label}</label>
      <input
        type="text"
        value={value || ""}
        readOnly
        className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 cursor-default"
      />
    </div>
  );

  // Function untuk clear semua filter
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedDate(null);
    setFilters({
      jurusan: '',
      sekolah: ''
    });
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#1D2939]">
                Data Approval
              </h2>
              <p className="text-[#667085] text-sm mt-1">
                Kelola data penerimaan dengan maksimal!
              </p>
            </div>
          </div>
      
          <div className="border-b border-gray-200 my-5" />
      
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm border ${
                  activeTab === "pendaftaran"
                    ? "bg-[#0069AB] text-white"
                    : "border-gray-300 text-[#344054]"
                }`}
                onClick={() => {
                  setActiveTab("pendaftaran");
                  setSelectedItems([]);
                  setShowActionDropdown(false);
                }}
              >
                Pendaftaran
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm border ${
                  activeTab === "izin"
                    ? "bg-[#0069AB] text-white"
                    : "border-gray-300 text-[#344054]"
                }`}
                onClick={() => {
                  setActiveTab("izin");
                  setSelectedItems([]);
                  setShowActionDropdown(false);
                }}
              >
                Izin/Sakit
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari"
                  className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm w-60"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Search size={16} />
                </span>
              </div>
            </div>
          </div>
      
          {/* Bulk Action Bar */}
          {selectedItems.length > 0 && (
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg mt-4">
              <div className="text-sm text-blue-700">
                {selectedItems.length} item dipilih
                {Object.keys(groupItemsBySekolah(selectedItems)).length > 1 && (
                  <span className="ml-2 text-orange-600">
                    ({Object.keys(groupItemsBySekolah(selectedItems)).length} sekolah berbeda)
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                  onClick={() => handleBulkAction("approved")}
                >
                  <CheckCircle size={14} />
                  Terima
                </button>
                <button
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
                  onClick={() => handleBulkAction("rejected")}
                >
                  <XCircle size={14} />
                  Tolak
                </button>
                <button
                  className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700"
                  onClick={() => handleBulkAction("blocked")}
                >
                  <AlertTriangle size={14} />
                  Blokir
                </button>
              </div>
            </div>
          )}

          {/* Modal untuk Nomor Surat per Sekolah */}
{showApprovalModal && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Masukkan Nomor Surat per Sekolah
          </h3>
          <button
            onClick={handleCloseApprovalModal}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[calc(80vh-140px)]">
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            Anda akan menyetujui {selectedItems.length} item dari {Object.keys(sekolahGroups).length} sekolah. 
            Setiap sekolah memerlukan nomor surat terpisah.
          </p>

          <div className="space-y-4">
            {Object.entries(sekolahGroups).map(([sekolah, itemIds]) => (
              <div key={sekolah} className="border border-gray-200 rounded-lg p-4">
                <div className="mb-3">
                  <h4 className="font-medium text-gray-900 mb-1">{sekolah}</h4>
                  <p className="text-sm text-gray-500">
                    {itemIds.length} item akan disetujui
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Surat
                  </label>
                  <input
                    type="text"
                    value={nomorSuratPerSekolah[sekolah] || ''}
                    onChange={(e) => updateNomorSurat(sekolah, e.target.value)}
                    placeholder="Contoh: 001/APP/SMK-ABC/2025"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCloseApprovalModal}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleApprovalSubmit}
            disabled={!Object.keys(sekolahGroups).every(sekolah => nomorSuratPerSekolah[sekolah]?.trim())}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Setujui
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>

    {/* Table for Pendaftaran */}
    {activeTab === "pendaftaran" && (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-[#667085]">
            <tr>
              <th className="px-6 py-3 text-left"></th>
              <th className="px-6 py-3 text-left">Nama</th>
              <th className="px-6 py-3 text-left">Jurusan</th>
              <th className="px-6 py-3 text-left">Masa Magang</th>
              <th className="px-6 py-3 text-left">Sekolah</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#0069AB] focus:ring-[#0069AB]"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                  />
                </td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={
                      item.user?.foto?.find((f) => f.type === "profile")
                        ?.path
                        ? `http://127.0.0.1:8000/storage/${
                            item.user.foto.find((f) => f.type === "profile")
                              .path
                          }`
                        : "/assets/img/default-avatar.png"
                    }
                    alt={item.user?.nama || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{item.user?.nama || "-"}</span>
                </td>
                <td className="px-6 py-4">{item.user?.jurusan || "-"}</td>
                <td className="px-6 py-4">
                  {item.mulai && item.selesai
                    ? `${new Date(item.mulai).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })} - ${new Date(item.selesai).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}`
                    : "-"}
                </td>
                <td className="px-6 py-4">{item.user?.sekolah || "-"}</td>
                <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    title="Lihat Detail"
                  >
                    <SquarePen className="w-5 h-5 mx-auto" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  {searchTerm || filters.jurusan || filters.sekolah || selectedDate
                    ? "Tidak ada data pendaftaran yang sesuai dengan filter."
                    : "Tidak ada data pendaftaran."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )}
        {activeTab === "izin" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-[#667085]">
                <tr>
                  <th className="px-6 py-3 text-left"></th>
                  <th className="px-6 py-3 text-left">Nama</th>
                  <th className="px-6 py-3 text-left">Sekolah</th>
                  <th className="px-6 py-3 text-left">Tanggal Izin</th>
                  <th className="px-6 py-3 text-left">Tanggal Kembali</th>
                  <th className="px-6 py-3 text-left">Keterangan</th>
                  <th className="px-6 py-3 text-left">Status Approval</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredIzin.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#0069AB] focus:ring-[#0069AB]"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={
                          item.peserta.berkas.find((f) => f.type === "profile")
                            ?.path
                            ? `${import.meta.env.VITE_API_URL_FILE}/storage/${
                                item.peserta.berkas.find(
                                  (f) => f.type === "profile"
                                )?.path
                              }`
                            : "/assets/img/default-avatar.png"
                        }
                        alt={item.peserta.nama}
                        className="w-8 h-8 rounded-full object-cover"
                      />

                      <span>{item.peserta.nama}</span>
                    </td>
                    <td className="px-6 py-4">{item.peserta.sekolah}</td>
                    <td className="px-6 py-4">{item.mulai}</td>
                    <td className="px-6 py-4">{item.selesai}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full ${
                          item.jenis === "izin"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                        } text-xs font-medium`}
                      >
                        {item.jenis} {/* Menampilkan "Izin" atau "Sakit" */}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.status_izin)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowModalIzin(true);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        {" "}
                        Lihat Detail{" "}
                      </button>
                    </td>{" "}
                  </tr>
                ))}
                {filteredIzin.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Tidak ada data izin/sakit yang sesuai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

{showModal && selectedItem && (
  <div
    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4"
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        closeModal();
      }
    }}
  >
    <div
      className="bg-white rounded-lg max-w-7xl w-full h-[90vh] shadow-lg pointer-events-auto flex overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Sisi Kiri - Informasi Pendaftar */}
      <div className="flex-1 p-6 overflow-y-auto scrollbar-hide" style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        <h2 className="text-xl font-semibold mb-4">Detail Pendaftar</h2>

        <div className="flex flex-col gap-6">
          {/* Foto profil */}
          <div className="flex justify-center">
            <img
              src={
                selectedItem.user?.foto?.find((f) => f.type === "profile")
                  ? `${import.meta.env.VITE_API_URL_FILE}/storage/${
                      selectedItem.user.foto.find((f) => f.type === "profile").path
                    }`
                  : "/placeholder-profile.jpg"
              }
              alt={selectedItem.user?.nama}
              className="w-32 h-32 rounded-full object-cover shadow-md"
              onError={(e) => {
                e.target.src = "/placeholder-profile.jpg";
              }}
            />
          </div>

          {/* Informasi Personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {/* Kolom 1 */}
            <div className="space-y-3">
              <InputLabel label="Nama" value={selectedItem.user?.nama} />
              <InputLabel
                label="Jenis Kelamin"
                value={
                  selectedItem.user?.jenis_kelamin === "L"
                    ? "Laki-Laki"
                    : "Perempuan"
                }
              />
              <InputLabel
                label="Tempat Lahir"
                value={selectedItem.user?.tempat_lahir}
              />
              <InputLabel label="Sekolah" value={selectedItem.user?.sekolah} />
              <InputLabel
                label="NISN/NIM"
                value={selectedItem.user?.nomor_identitas}
              />
            </div>

            {/* Kolom 2 */}
            <div className="space-y-3">
              <InputLabel label="Alamat" value={selectedItem.user?.alamat} />
              <InputLabel label="No. HP" value={selectedItem.user?.telepon} />
              <InputLabel
                label="Tanggal Lahir"
                value={selectedItem.user?.tanggal_lahir}
              />
              <InputLabel label="Jurusan" value={selectedItem.user?.jurusan} />
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-1">
                  Status Pendaftaran
                </label>
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedItem.status || "Menunggu Konfirmasi"}
                </span>
              </div>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-4 pt-4 border-t">
            {/* Tombol Tolak */}
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-red-600 hover:bg-red-50 bg-red-100 font-medium transition-all duration-200 hover:shadow-md"
              onClick={() => {
                Swal.fire({
                  title: "Apakah Anda yakin?",
                  text: "Anda akan menolak siswa ini.",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#dc2626",
                  cancelButtonColor: "#6b7280",
                  confirmButtonText: "Ya, Tolak",
                  cancelButtonText: "Batal",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleIndividualAction(selectedItem.id, "rejected", "pendaftaran");
                  }
                });
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Tolak Pendaftar
            </button>

            {/* Tombol Terima */}
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-green-600 hover:bg-green-50 bg-green-100 font-medium transition-all duration-200 hover:shadow-md"
              onClick={() => {
                Swal.fire({
                  title: "Apakah Anda yakin?",
                  text: "Anda akan menerima siswa ini.",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonColor: "#16a34a",
                  cancelButtonColor: "#6b7280",
                  confirmButtonText: "Ya, Terima",
                  cancelButtonText: "Batal",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleIndividualAction(selectedItem.id, "approved", "pendaftaran");
                  }
                });
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Terima Pendaftar
            </button>
          </div>
        </div>
      </div>

      {/* Sisi Kanan - Preview Dokumen */}
      <div className="w-1/2 bg-gray-50 border-l flex flex-col">
        {/* <div className="p-4 border-b bg-white">
          <h3 className="text-lg font-semibold text-gray-800">Preview Dokumen</h3>
        </div> */}

        <div className="flex-1 overflow-y-auto">
          {/* CV Section */}
          <div className="mb-6">
            <div className="bg-white p-3 sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-md font-medium text-gray-700">CV</h2>
                {(() => {
                  const cv = selectedItem.user?.foto?.find((f) => f.type === "cv");
                  if (cv && cv.path) {
                    const cvUrl = `${import.meta.env.VITE_API_URL_FILE}/storage/${cv.path}`;
                    const fileExtension = cv.path.split('.').pop().toLowerCase();
                    return (
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(cvUrl, '_blank')}
                          className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                          title="Buka di tab baru"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = cvUrl;
                            link.download = `CV_${selectedItem.user?.nama || 'document'}.${fileExtension}`;
                            link.target = '_blank';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                          title="Download CV"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
            
            <div className="p-4 bg-white min-h-[300px]">
              {(() => {
                const cv = selectedItem.user?.foto?.find((f) => f.type === "cv");
                
                if (cv && cv.path) {
                  const cvUrl = `${import.meta.env.VITE_API_URL_FILE}/storage/${cv.path}`;
                  const fileExtension = cv.path.split('.').pop().toLowerCase();
                  
                  if (fileExtension === 'pdf') {
                    return (
                      <div className="h-[300px]">
                        <embed
                          src={cvUrl}
                          type="application/pdf"
                          className="w-full h-full rounded border"
                        />
                      </div>
                    );
                  } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
                    return (
                      <div className="flex justify-center">
                        <img
                          src={cvUrl}
                          alt="CV Preview"
                          className="max-w-full h-auto rounded shadow-sm"
                          onError={(e) => {
                            console.error('Error loading CV image');
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex items-center justify-center h-[300px] text-center">
                        <div>
                          <div className="text-4xl mb-4 text-gray-400">📄</div>
                          <p className="text-gray-600 mb-2">Preview tidak tersedia untuk format ini</p>
                          <button
                            onClick={() => window.open(cvUrl, '_blank')}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            Buka File
                          </button>
                        </div>
                      </div>
                    );
                  }
                } else {
                  return (
                    <div className="flex items-center justify-center h-[300px] text-center">
                      <div>
                        <div className="text-4xl mb-4 text-gray-400">📄</div>
                        <p className="text-gray-600">CV belum tersedia</p>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          </div>

          {/* Surat Pernyataan Section */}
          <div>
            <div className="bg-white border-b p-3 sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium text-gray-700">Surat Pernyataan</h4>
                {(() => {
                  const surat = selectedItem.user?.berkas?.find((b) => b.type === "surat_pernyataan_diri");
                  if (surat && surat.path) {
                    const suratUrl = `${import.meta.env.VITE_API_URL_FILE}/storage/${surat.path}`;
                    const fileExtension = surat.path.split('.').pop().toLowerCase();
                    return (
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(suratUrl, '_blank')}
                          className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                          title="Buka di tab baru"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = suratUrl;
                            link.download = `Surat_Pernyataan_${selectedItem.user?.nama || 'document'}.${fileExtension}`;
                            link.target = '_blank';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                          title="Download Surat Pernyataan"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
            
            <div className="p-4 bg-white min-h-[300px]">
              {(() => {
                const surat = selectedItem.user?.berkas?.find((b) => b.type === "surat_pernyataan_diri");
                
                if (surat && surat.path) {
                  const suratUrl = `${import.meta.env.VITE_API_URL_FILE}/storage/${surat.path}`;
                  const fileExtension = surat.path.split('.').pop().toLowerCase();

                  if (fileExtension === 'pdf') {
                    return (
                      <div className="h-[300px]">
                        <embed
                          src={suratUrl}
                          type="application/pdf"
                          className="w-full h-full rounded border"
                        />
                      </div>
                    );
                  } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
                    return (
                      <div className="flex justify-center">
                        <img
                          src={suratUrl}
                          alt="Surat Pernyataan Preview"
                          className="max-w-full h-auto rounded shadow-sm"
                          onError={(e) => {
                            console.error('Error loading Surat Pernyataan image');
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex items-center justify-center h-[300px] text-center">
                        <div>
                          <div className="text-4xl mb-4 text-gray-400">📋</div>
                          <p className="text-gray-600 mb-2">Preview tidak tersedia untuk format ini</p>
                          <button
                            onClick={() => window.open(suratUrl, '_blank')}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            Buka File
                          </button>
                        </div>
                      </div>
                    );
                  }
                } else {
                  return (
                    <div className="flex items-center justify-center h-[300px] text-center">
                      <div>
                        <div className="text-4xl mb-4 text-gray-400">📋</div>
                        <p className="text-gray-600">Surat pernyataan belum tersedia</p>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

        {showModalIzin && selectedItem && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Detail Izin</h2>
                  <button onClick={closeModal} className="text-black">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
                <p className="text-gray-500 text-sm">
                  Ayo Laporkan Kegiatanmu hari ini!
                </p>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-gray-500 text-sm">Nama</label>
                    <div>{selectedItem.peserta.nama}</div>
                  </div>

                  <div>
                    <label className="block text-gray-500 text-sm">
                      Tanggal
                    </label>
                    <div>{selectedItem.mulai} - {selectedItem.selesai}</div>
                  </div>

                  <div>
                    <label className="block text-gray-500 text-sm">
                      Sekolah
                    </label>
                    <div>{selectedItem.peserta.sekolah}</div>
                  </div>

                  <div>
                    <label className="block text-gray-500 text-sm">
                      Kegiatan
                    </label>
                    <div>{selectedItem.deskripsi}</div>
                  </div>

                  <div>
                    <label className="block text-gray-500 text-sm">
                      Bukti Kegiatan
                    </label>
                    <div className="mt-2 flex justify-center">
                      {/* Menampilkan gambar bukti kegiatan */}
                      
                        <a
                          href={selectedItem.bukti.path}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={
                              selectedItem.bukti.path
                                ? `http://127.0.0.1:8000/storage/${
                                    selectedItem.bukti.path
                                  }`
                                : "/assets/img/default-avatar.png"
                            }
                            alt="Bukti Kegiatan"
                            className="max-w-[200px] h-auto rounded-lg"
                          />
                        </a>
                    

                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                 {/* Tombol Tolak */}
                <button
                  className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 bg-red-100 text-sm font-medium"
                  onClick={() => {
                    Swal.fire({
                      title: "Apakah Anda yakin?",
                      text: "Anda akan menolak izin/sakit siswa ini.",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#d33",
                      cancelButtonColor: "#aaa",
                      confirmButtonText: "Ya, Tolak",
                      cancelButtonText: "Batal",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleIndividualAction(selectedItem.id, "rejected", "izin");
                      }
                    });
                  }}
                >
                  Tolak
                </button>

                {/* Tombol Terima */}
                <button
                  className="px-4 py-2 rounded-lg text-green-600 hover:bg-green-50 bg-green-100 text-sm font-medium"
                  onClick={() => {
                    Swal.fire({
                      title: "Apakah Anda yakin?",
                      text: "Anda akan menerima izin/sakit siswa ini.",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#22c55e",
                      cancelButtonColor: "#aaa",
                      confirmButtonText: "Ya, Terima",
                      cancelButtonText: "Batal",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleIndividualAction(selectedItem.id, "approved", "izin");
                      }
                    });
                  }}
                >
                  Terima
                </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}