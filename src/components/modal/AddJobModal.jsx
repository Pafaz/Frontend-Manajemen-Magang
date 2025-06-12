import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2

const AddJobModal = ({ showModal, setShowModal, editingData = null, onSucces }) => {
  const [cabang, setCabang] = useState([]);
  const [divisi, setDivisi] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingDivisi, setLoadingDivisi] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Track jika data sudah dimuat

  const [formData, setFormData] = useState({
    tanggal_mulai: "",
    tanggal_selesai: "",
    id_cabang: "",
    id_divisi: "",
    max_kuota: "",
    requirement: "",
    jobdesc: "",
  });

  // Fungsi untuk mengambil divisi berdasarkan cabang
  const GetDivisiByBranch = async (cabangId) => {
    if (!cabangId) {
      setDivisi([]);
      return;
    }

    setLoadingDivisi(true);
    try {
      const id = parseInt(cabangId);
      console.log("Fetching divisi for cabang ID:", id);

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/divisi/cabang/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("Loaded divisi:", res.data.data);
      setDivisi(res.data.data);
      return res.data.data; // Return data untuk digunakan di useEffect
    } catch (error) {
      console.error("Error loading divisi:", error);
      setDivisi([]);
      Swal.fire({
        icon: "error",
        title: "Gagal memuat data",
        text: "Tidak dapat memuat data divisi. Silakan coba lagi nanti.",
        confirmButtonColor: "#3085d6",
      });
      return [];
    } finally {
      setLoadingDivisi(false);
    }
  };

  const GetCabang = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cabang`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCabang(res.data.data);
      console.log("Loaded cabang:", res.data.data);
      return res.data.data; // Return data untuk digunakan di useEffect
    } catch (error) {
      console.error("Error loading cabang:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal memuat data",
        text: "Tidak dapat memuat data cabang. Silakan coba lagi nanti.",
        confirmButtonColor: "#3085d6",
      });
      return [];
    }
  };

  // Effect untuk memuat data cabang saat komponen mount
  useEffect(() => {
    GetCabang();
  }, []);

  // Effect terpisah untuk handle editing data
  useEffect(() => {
    const loadEditingData = async () => {
      console.log("EditingData received:", editingData);

      // Reset state terlebih dahulu
      setIsDataLoaded(false);
      setErrors({});
      setTouched({});

      if (editingData) {
        // Handle jika editingData adalah array atau object
        const dataToEdit = Array.isArray(editingData) ? editingData[0] : editingData;
        console.log("Processed editing data:", dataToEdit);

        if (!dataToEdit) {
          setIsDataLoaded(true);
          return;
        }

        const { tanggal_mulai, tanggal_selesai, id_cabang, id_divisi, max_kuota, requirement, jobdesc, cabang, divisi } = dataToEdit;

        // Format tanggal
        const formatDateForInput = (dateString) => {
          if (!dateString) return "";
          try {
            const date = new Date(dateString);
            return date.toISOString().split("T")[0];
          } catch (error) {
            console.error("Date formatting error:", error);
            return "";
          }
        };

        // Ambil ID dari nested object jika ada, atau dari field langsung
        const cabangId = cabang?.id || id_cabang;
        const divisiId = divisi?.id || id_divisi;

        // Set form data
        const newFormData = {
          tanggal_mulai: formatDateForInput(tanggal_mulai),
          tanggal_selesai: formatDateForInput(tanggal_selesai),
          id_cabang: cabangId ? parseInt(cabangId) : "",
          id_divisi: divisiId ? parseInt(divisiId) : "",
          max_kuota: max_kuota ? parseInt(max_kuota) : "",
          requirement: requirement || "",
          jobdesc: jobdesc || "",
        };

        console.log("Setting form data:", newFormData);
        setFormData(newFormData);

        // Load divisi untuk cabang yang sedang diedit
        if (cabangId) {
          console.log("Loading divisi for cabang:", cabangId);
          await GetDivisiByBranch(parseInt(cabangId));
        }

        setIsDataLoaded(true);
      } else {
        // Reset form untuk mode tambah
        setFormData({
          tanggal_mulai: "",
          tanggal_selesai: "",
          id_cabang: "",
          id_divisi: "",
          max_kuota: "",
          requirement: "",
          jobdesc: "",
        });
        setDivisi([]);
        setIsDataLoaded(true);
      }
    };

    // Hanya jalankan jika modal terbuka
    if (showModal) {
      loadEditingData();
    }
  }, [editingData, showModal]);

  const handleClose = () => {
    const isFormModified = Object.values(formData).some((val) => val !== "");

    if (isFormModified) {
      Swal.fire({
        title: "Konfirmasi",
        text: "Perubahan yang Anda buat belum disimpan. Yakin ingin menutup?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, tutup",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          setShowModal(false);
          // Reset state saat modal ditutup
          setIsDataLoaded(false);
          setDivisi([]);
        }
      });
    } else {
      setShowModal(false);
      setIsDataLoaded(false);
      setDivisi([]);
    }
  };

  const handleValue = (e) => {
    const { name, value } = e.target;

    if (name === "id_cabang") {
      const cabangId = parseInt(value) || "";
      setFormData((prev) => ({
        ...prev,
        [name]: cabangId,
        id_divisi: "", // Reset divisi saat cabang berubah
      }));

      if (cabangId) {
        GetDivisiByBranch(cabangId);
      } else {
        setDivisi([]);
      }
    } else if (name === "id_divisi") {
      const divisiId = parseInt(value) || "";
      setFormData((prev) => ({ ...prev, [name]: divisiId }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setTouched((prev) => ({ ...prev, [name]: true }));

    if (name === "max_kuota" && (isNaN(value) || parseInt(value) <= 0)) {
      setErrors((prev) => ({ ...prev, [name]: "Kuota harus berupa angka positif" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  useEffect(() => {
    if (formData.tanggal_mulai && formData.tanggal_selesai) {
      const start = new Date(formData.tanggal_mulai);
      const end = new Date(formData.tanggal_selesai);
      if (end < start) {
        setErrors((prev) => ({ ...prev, tanggal_selesai: "Tanggal selesai harus setelah tanggal mulai" }));
      } else {
        setErrors((prev) => ({ ...prev, tanggal_selesai: "" }));
      }
    }
  }, [formData.tanggal_mulai, formData.tanggal_selesai]);

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      { name: "tanggal_mulai", label: "Tanggal mulai" },
      { name: "tanggal_selesai", label: "Tanggal selesai" },
      { name: "id_cabang", label: "Cabang" },
      { name: "id_divisi", label: "Divisi" },
      { name: "max_kuota", label: "Jumlah kuota" },
      { name: "requirement", label: "Requirement" },
      { name: "jobdesc", label: "Deskripsi pekerjaan" },
    ];

    requiredFields.forEach((field) => {
      if (!formData[field.name]) {
        newErrors[field.name] = `${field.label} wajib diisi`;
      }
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values({ ...errors, ...newErrors }).every((err) => !err);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (!formData[name]) {
      setErrors((prev) => ({ ...prev, [name]: `Field ini wajib diisi` }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const touchedAll = {};
    Object.keys(formData).forEach((k) => {
      touchedAll[k] = true;
    });
    setTouched(touchedAll);

    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validasi Gagal",
        text: "Silakan periksa kembali form isian Anda",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setLoading(true);

    Swal.fire({
      title: editingData ? "Memperbarui Data" : "Menyimpan Data",
      text: "Mohon tunggu...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // PERBAIKAN: Handle editingData yang berupa array atau object
      let editId = null;
      if (editingData) {
        if (Array.isArray(editingData)) {
          editId = editingData[0]?.id ? parseInt(editingData[0].id) : null;
        } else {
          editId = editingData.id ? parseInt(editingData.id) : null;
        }
      }

      const url = editId 
        ? `${import.meta.env.VITE_API_URL}/lowongan/${editId}` 
        : `${import.meta.env.VITE_API_URL}/lowongan`;

      const method = editId ? "put" : "post";

      const payload = {
        ...formData,
        id_cabang: parseInt(formData.id_cabang),
        id_divisi: parseInt(formData.id_divisi),
        max_kuota: parseInt(formData.max_kuota),
      };

      console.log("Submitting:", { method, url, payload, editId, editingData });

      const response = await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: payload,
      });

      console.log("Response:", response.data);

      Swal.close();

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: editingData ? "Data lowongan berhasil diperbarui" : "Lowongan baru berhasil ditambahkan",
        confirmButtonColor: "#3085d6",
      });

      setFormData({
        tanggal_mulai: "",
        tanggal_selesai: "",
        id_cabang: "",
        id_divisi: "",
        max_kuota: "",
        requirement: "",
        jobdesc: "",
      });
      setShowModal(false);
      setIsDataLoaded(false);
      onSucces();
    } catch (err) {
      console.error("Submit error:", err);
      console.error("Error response:", err.response);

      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.response?.data?.message || "Terjadi kesalahan saat menyimpan data",
        confirmButtonColor: "#3085d6",
      });

      setErrors((prev) => ({
        ...prev,
        form: err.response?.data?.message || "Terjadi kesalahan saat menyimpan data",
      }));
    } finally {
      setLoading(false);
    }
  };

  // Jangan render form jika data belum dimuat dan dalam mode edit
  if (editingData && !isDataLoaded) {
    return (
      <div className={`fixed inset-0 bg-black/40 flex justify-center items-center z-[999] ${showModal ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="bg-white rounded-lg shadow-xl p-5 w-96 md:w-112 mx-4">
          <div className="flex justify-center items-center py-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Memuat data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 bg-black/40 flex justify-center items-center z-[999] ${showModal ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="bg-white rounded-lg shadow-xl p-5 w-96 md:w-112 mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold">{editingData ? "Edit Lowongan" : "Tambah Lowongan"}</h2>
          <button onClick={handleClose} className="text-gray-500 text-xl">
            ⨯
          </button>
        </div>

        {errors.form && <div className="bg-red-50 text-red-600 p-2 rounded-md mb-3 text-xs">{errors.form}</div>}

        <form onSubmit={handleSubmit}>
          {/* Tanggal */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Mulai *</label>
              <input
                type="date"
                name="tanggal_mulai"
                value={formData.tanggal_mulai}
                onChange={handleValue}
                onBlur={handleBlur}
                className={`w-full border ${errors.tanggal_mulai && touched.tanggal_mulai ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs`}
              />
              {errors.tanggal_mulai && touched.tanggal_mulai && <p className="text-red-500 text-xs">{errors.tanggal_mulai}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Selesai *</label>
              <input
                type="date"
                name="tanggal_selesai"
                value={formData.tanggal_selesai}
                onChange={handleValue}
                onBlur={handleBlur}
                className={`w-full border ${errors.tanggal_selesai && touched.tanggal_selesai ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs`}
              />
              {errors.tanggal_selesai && touched.tanggal_selesai && <p className="text-red-500 text-xs">{errors.tanggal_selesai}</p>}
            </div>
          </div>

          {/* Cabang & Divisi */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Cabang *</label>
              <select
                name="id_cabang"
                value={formData.id_cabang}
                onChange={handleValue}
                onBlur={handleBlur}
                className={`w-full border ${errors.id_cabang && touched.id_cabang ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs bg-white`}
              >
                <option value="">Pilih Cabang</option>
                {cabang.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nama}
                  </option>
                ))}
              </select>
              {errors.id_cabang && touched.id_cabang && <p className="text-red-500 text-xs">{errors.id_cabang}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Divisi *</label>
              <select
                name="id_divisi"
                value={formData.id_divisi}
                onChange={handleValue}
                onBlur={handleBlur}
                disabled={!formData.id_cabang || loadingDivisi}
                className={`w-full border ${errors.id_divisi && touched.id_divisi ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs bg-white ${
                  !formData.id_cabang || loadingDivisi ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <option value="">{loadingDivisi ? "Memuat divisi..." : !formData.id_cabang ? "Pilih cabang" : "Pilih Divisi"}</option>
                {divisi.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nama}
                  </option>
                ))}
              </select>
              {errors.id_divisi && touched.id_divisi && <p className="text-red-500 text-xs">{errors.id_divisi}</p>}
            </div>
          </div>

          {/* Kuota */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Jumlah Kuota *</label>
            <input
              type="number"
              name="max_kuota"
              value={formData.max_kuota}
              onChange={handleValue}
              onBlur={handleBlur}
              min="1"
              className={`w-full border ${errors.max_kuota && touched.max_kuota ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs`}
              placeholder="Masukkan jumlah kuota"
            />
            {errors.max_kuota && touched.max_kuota && <p className="text-red-500 text-xs">{errors.max_kuota}</p>}
          </div>

          {/* Requirement */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Requirement *</label>
            <textarea
              name="requirement"
              value={formData.requirement}
              onChange={handleValue}
              onBlur={handleBlur}
              className={`w-full border ${errors.requirement && touched.requirement ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs`}
              rows="3"
              placeholder="Masukkan persyaratan"
            />
            {errors.requirement && touched.requirement && <p className="text-red-500 text-xs">{errors.requirement}</p>}
          </div>

          {/* Jobdesc */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi Pekerjaan *</label>
            <textarea
              name="jobdesc"
              value={formData.jobdesc}
              onChange={handleValue}
              onBlur={handleBlur}
              className={`w-full border ${errors.jobdesc && touched.jobdesc ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs`}
              rows="3"
              placeholder="Masukkan deskripsi pekerjaan"
            />
            {errors.jobdesc && touched.jobdesc && <p className="text-red-500 text-xs">{errors.jobdesc}</p>}
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={handleClose} className="bg-red-500 text-white px-5 py-3 rounded-md text-xs" disabled={loading}>
              Batal
            </button>
            <button type="submit" className="bg-blue-600 text-white px-5 py-3 rounded-md text-xs" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;